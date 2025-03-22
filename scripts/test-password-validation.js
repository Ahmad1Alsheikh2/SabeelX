/**
 * Script to test password validation during signup
 * This simulates the signup flow with password validation
 * Run with: node scripts/test-password-validation.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function testPasswordValidation() {
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
      passwordMatch: { type: Boolean, default: false }
    });
    
    // Add comparePassword method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      console.log('Comparing passwords...');
      console.log(`- Stored password hash: ${this.password.substring(0, 10)}...`);
      console.log(`- Candidate password: ${candidatePassword}`);
      
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      console.log(`- Result: ${isMatch ? 'MATCH' : 'NO MATCH'}`);
      return isMatch;
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Clean up any test users before starting
    await User.deleteMany({ email: { $regex: /^test-pwd/ } });
    
    // Test cases
    const testCases = [
      {
        name: 'Identical passwords',
        password: 'Password123',
        confirmPassword: 'Password123',
        expectedMatch: true
      },
      {
        name: 'Different case in passwords',
        password: 'Password123',
        confirmPassword: 'password123',
        expectedMatch: false
      },
      {
        name: 'Space difference in passwords',
        password: 'Password 123',
        confirmPassword: 'Password123',
        expectedMatch: false
      },
      {
        name: 'Trailing space in confirm password',
        password: 'Password123',
        confirmPassword: 'Password123 ',
        expectedMatch: false
      }
    ];
    
    console.log('\n===== SIGNUP PASSWORD VALIDATION TEST =====');
    
    // Run each test case
    for (const testCase of testCases) {
      console.log(`\nTest case: ${testCase.name}`);
      console.log(`Password: "${testCase.password}"`);
      console.log(`Confirm password: "${testCase.confirmPassword}"`);
      
      // Step 1: Frontend validation - compare exact strings
      const passwordsMatch = testCase.password === testCase.confirmPassword;
      console.log(`1. Frontend validation (exact string match): ${passwordsMatch ? 'PASS' : 'FAIL'}`);
      
      if (!passwordsMatch) {
        console.log(`   User would see error: "Passwords do not match"`);
        continue;
      }
      
      // Step 2: Backend validation - create user with password
      console.log('2. Backend validation (hash + store):');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testCase.password, salt);
      console.log(`   Password hash: ${hashedPassword.substring(0, 15)}...`);
      
      const testUser = await User.create({
        email: `test-pwd-${Date.now()}@example.com`,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        passwordMatch: passwordsMatch
      });
      
      console.log(`   User created with ID: ${testUser._id}`);
      
      // Step 3: Try authentication with the plain password
      console.log('3. Authentication test:');
      
      // Test with original password
      const authResult = await testUser.comparePassword(testCase.password);
      console.log(`   Auth with original password: ${authResult ? 'SUCCESS' : 'FAILED'}`);
      
      // Test with confirm password (should always match in real scenario)
      const authResult2 = await testUser.comparePassword(testCase.confirmPassword);
      console.log(`   Auth with confirm password: ${authResult2 ? 'SUCCESS' : 'FAILED'}`);
      
      // Clean up test user
      await User.deleteOne({ _id: testUser._id });
    }
    
    // Additional test: Check if password gets re-hashed during login somehow
    console.log('\n===== ADDITIONAL LOGIN FLOW TEST =====');
    
    // Create test user
    const testPassword = 'LoginTest123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);
    
    const loginTestUser = await User.create({
      email: 'test-pwd-login@example.com',
      password: hashedPassword,
      firstName: 'Login',
      lastName: 'Test'
    });
    
    console.log('Test user created for login flow test');
    console.log(`- Email: ${loginTestUser.email}`);
    console.log(`- Original password hash: ${hashedPassword.substring(0, 15)}...`);
    
    // Simulate login process
    console.log('\nSimulating login process:');
    
    // Step 1: Find user by email
    const foundUser = await User.findOne({ email: loginTestUser.email });
    console.log('1. User found by email');
    
    // Step 2: Compare passwords
    console.log('2. Password comparison:');
    const loginResult = await foundUser.comparePassword(testPassword);
    console.log(`   Result: ${loginResult ? 'SUCCESS' : 'FAILED'}`);
    
    // Compare wrong password for sanity check
    const wrongLoginResult = await foundUser.comparePassword('WrongPassword123');
    console.log(`   Wrong password test: ${wrongLoginResult ? 'MATCHED (PROBLEM!)' : 'DID NOT MATCH (EXPECTED)'}`);
    
    // Clean up login test user
    await User.deleteOne({ _id: loginTestUser._id });
    console.log('\nTest completed and users cleaned up');
    
  } catch (error) {
    console.error('Error in password validation test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testPasswordValidation(); 