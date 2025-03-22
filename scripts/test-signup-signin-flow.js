/**
 * Script to test the complete signup and signin flow
 * This simulates the frontend and backend processes for signup and signin
 * Run with: node scripts/test-signup-signin-flow.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function testSignupSigninFlow() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define User schema
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String },
      lastName: { type: String },
      role: { type: String, default: 'USER' },
      passwordMatch: { type: Boolean, default: false }
    });
    
    // Add methods
    userSchema.pre('save', async function(next) {
      // Only hash the password if it has been modified (or is new)
      if (!this.isModified('password')) return next();
      
      try {
        console.log('Pre-save hook triggered: hashing password');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
    });
    
    userSchema.methods.comparePassword = async function(candidatePassword) {
      console.log('Comparing passwords:');
      console.log(`- Stored hash (first 20 chars): ${this.password.substring(0, 20)}...`);
      console.log(`- Candidate password: ${candidatePassword}`);
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      console.log(`- Result: ${isMatch ? 'MATCH' : 'NO MATCH'}`);
      return isMatch;
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Clean up any test users
    await User.deleteMany({ email: { $regex: /^test-flow/ } });
    
    // Test data
    const testEmail = `test-flow-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123';
    const userData = {
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
      firstName: 'Test',
      lastName: 'Flow'
    };
    
    console.log('\n===== SIGNUP FLOW =====');
    console.log('Test user data:');
    console.log(`- Email: ${userData.email}`);
    console.log(`- Password: ${userData.password}`);
    console.log(`- Confirm Password: ${userData.confirmPassword}`);
    
    // Step 1: Frontend validation
    console.log('\n1. FRONTEND VALIDATION');
    
    // Check passwords match
    const passwordsMatch = userData.password === userData.confirmPassword;
    console.log(`- Passwords match check: ${passwordsMatch ? 'PASS' : 'FAIL'}`);
    
    if (!passwordsMatch) {
      console.log('Signup would stop here with "Passwords do not match" error');
      return;
    }
    
    // Step 2: Manual hashing (simulating what happens in the API route)
    console.log('\n2. BACKEND PASSWORD HASHING (API route)');
    
    // Generate salt and hash (as done in the API route)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    console.log(`- Generated salt: ${salt}`);
    console.log(`- Hashed password (first 20 chars): ${hashedPassword.substring(0, 20)}...`);
    console.log(`- Full hash length: ${hashedPassword.length}`);
    
    // Step 3: Create user (manual hash method)
    console.log('\n3. USER CREATION WITH HASHED PASSWORD');
    
    // Test both ways: directly with hashed password and letting schema handle it
    // Method 1: Direct hash approach (like in current route.ts)
    const user1 = await User.create({
      email: `${userData.email}-direct`,
      password: hashedPassword, // Already hashed
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordMatch: passwordsMatch
    });
    
    console.log('User created with direct hash:');
    console.log(`- ID: ${user1._id}`);
    console.log(`- Email: ${user1.email}`);
    console.log(`- Password hash (first 20 chars): ${user1.password.substring(0, 20)}...`);
    
    // Method 2: Let schema pre-save hook handle hashing
    const user2 = new User({
      email: `${userData.email}-schema`,
      password: userData.password, // Plain text, will be hashed by pre-save
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordMatch: passwordsMatch
    });
    
    await user2.save();
    
    console.log('User created letting schema handle hashing:');
    console.log(`- ID: ${user2._id}`);
    console.log(`- Email: ${user2.email}`);
    console.log(`- Password hash (first 20 chars): ${user2.password.substring(0, 20)}...`);
    
    // Step 4: Signin tests
    console.log('\n===== SIGNIN TESTS =====');
    
    // Test 1: Signin with direct hash user
    console.log('\n4.1 TESTING SIGNIN: Direct hash user');
    
    const foundUser1 = await User.findOne({ email: user1.email });
    console.log(`Found user with email ${user1.email}`);
    
    const auth1 = await foundUser1.comparePassword(userData.password);
    console.log(`Authentication result: ${auth1 ? 'SUCCESS' : 'FAILED'}`);
    
    // Test 2: Signin with schema-hashed user
    console.log('\n4.2 TESTING SIGNIN: Schema-hashed user');
    
    const foundUser2 = await User.findOne({ email: user2.email });
    console.log(`Found user with email ${user2.email}`);
    
    const auth2 = await foundUser2.comparePassword(userData.password);
    console.log(`Authentication result: ${auth2 ? 'SUCCESS' : 'FAILED'}`);
    
    // Step 5: Double-hashing test
    console.log('\n5. DOUBLE-HASHING TEST');
    console.log('This tests what happens if we accidentally hash an already hashed password');
    
    // Create a user with double-hashed password
    const doubleHashedPassword = await bcrypt.hash(hashedPassword, salt);
    
    const user3 = await User.create({
      email: `${userData.email}-double`,
      password: doubleHashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName
    });
    
    console.log('User created with double-hashed password:');
    console.log(`- ID: ${user3._id}`);
    console.log(`- Email: ${user3.email}`);
    
    // Try to authenticate
    const foundUser3 = await User.findOne({ email: user3.email });
    
    const auth3Plain = await foundUser3.comparePassword(userData.password);
    console.log(`Auth with plain password: ${auth3Plain ? 'SUCCESS' : 'FAILED'}`);
    
    const auth3Hashed = await foundUser3.comparePassword(hashedPassword);
    console.log(`Auth with hashed password: ${auth3Hashed ? 'SUCCESS' : 'FAILED'}`);
    
    // Clean up
    console.log('\n===== CLEANUP =====');
    await User.deleteMany({ email: { $regex: `^${userData.email}` } });
    console.log('Test users deleted');
    
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testSignupSigninFlow(); 