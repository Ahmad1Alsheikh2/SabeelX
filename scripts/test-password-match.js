/**
 * Script to test user authentication when password and confirm password match
 * Run with: node scripts/test-password-match.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function testPasswordMatch() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define User schema with the comparePassword method
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      role: { type: String },
      passwordMatch: { type: Boolean, default: false } // New field to track password match
    });
    
    // Define manual password comparison method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      console.log('Comparing password...');
      const result = await bcrypt.compare(candidatePassword, this.password);
      return result;
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Use a unique test email
    const testEmail = `test-match-${Date.now()}@example.com`;
    
    // Create test user with password match flag
    const testUser = {
      email: testEmail,
      password: 'TestMatch123',
      confirmPassword: 'TestMatch123', // Same as password to simulate match
      firstName: 'Test',
      lastName: 'User'
    };
    
    console.log('\n===== SIGNUP PROCESS =====');
    console.log('Email:', testUser.email);
    
    // Verify passwords match
    const passwordsMatch = testUser.password === testUser.confirmPassword;
    console.log('Passwords match:', passwordsMatch);
    
    if (!passwordsMatch) {
      console.log('Passwords do not match, signup would fail here');
      return;
    }
    
    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    console.log('Password hashed successfully');
    
    // Create user with hashed password and password match flag
    const newUser = await User.create({
      email: testUser.email,
      password: hashedPassword,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      role: 'USER',
      passwordMatch: passwordsMatch // Store the password match status
    });
    
    console.log('User created successfully:', {
      id: newUser._id.toString(),
      email: newUser.email,
      passwordMatch: newUser.passwordMatch
    });
    
    // Now try to authenticate
    console.log('\n===== AUTHENTICATING USER =====');
    
    // Retrieve user
    const retrievedUser = await User.findOne({ email: testUser.email });
    console.log('Retrieved user:', {
      id: retrievedUser._id.toString(),
      email: retrievedUser.email,
      passwordMatch: retrievedUser.passwordMatch
    });
    
    // Test authentication
    console.log('Testing authentication...');
    const isValid = await retrievedUser.comparePassword(testUser.password);
    console.log('Authentication result:', isValid ? 'SUCCESS' : 'FAILED');
    
    // Clean up test user
    console.log('\nCleaning up test user...');
    await User.deleteOne({ email: testUser.email });
    console.log('Test user deleted');
    
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testPasswordMatch(); 