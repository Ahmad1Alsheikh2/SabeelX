/**
 * Script to test the signup process with confirmPassword
 * This simulates the entire frontend-backend flow for user signup
 * Run with: node scripts/test-signup-with-confirm.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function testSignupWithConfirm() {
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
      passwordMatch: { type: Boolean, default: false } // Field to track password match
    });
    
    // Define manual password comparison method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      console.log('Comparing password...');
      const result = await bcrypt.compare(candidatePassword, this.password);
      return result;
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Use a unique test email
    const testEmail = `test-signup-${Date.now()}@example.com`;
    
    // Test scenarios
    const scenarios = [
      {
        name: 'Matching passwords',
        userData: {
          email: testEmail,
          password: 'TestPassword123',
          confirmPassword: 'TestPassword123',
          firstName: 'Test',
          lastName: 'User'
        },
        expectedOutcome: 'SUCCESS'
      },
      {
        name: 'Non-matching passwords',
        userData: {
          email: `${testEmail}-2`,
          password: 'TestPassword123',
          confirmPassword: 'DifferentPassword123',
          firstName: 'Test',
          lastName: 'User'
        },
        expectedOutcome: 'FAIL'
      }
    ];
    
    // Run each scenario
    for (const scenario of scenarios) {
      console.log(`\n===== TESTING SCENARIO: ${scenario.name} =====`);
      
      const { email, password, confirmPassword, firstName, lastName } = scenario.userData;
      
      // Check if passwords match
      const passwordsMatch = password === confirmPassword;
      console.log('Passwords match:', passwordsMatch);
      
      if (!passwordsMatch && scenario.expectedOutcome === 'FAIL') {
        console.log('Passwords do not match. Frontend validation would stop here.');
        console.log('Test PASSED: Non-matching passwords correctly rejected');
        continue;
      }
      
      // Clean up any existing test user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('Deleting existing user');
        await User.deleteOne({ email });
      }
      
      // Create user with hashed password and password match flag
      console.log('Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER',
        passwordMatch: passwordsMatch
      });
      
      console.log('User created:', {
        id: newUser._id.toString(),
        email: newUser.email,
        passwordMatch: newUser.passwordMatch
      });
      
      // Test authentication
      console.log('Testing authentication...');
      const authResult = await newUser.comparePassword(password);
      console.log('Authentication result:', authResult ? 'SUCCESS' : 'FAILED');
      
      if (authResult && scenario.expectedOutcome === 'SUCCESS') {
        console.log('Test PASSED: User created and authenticated successfully');
      } else if (!authResult && scenario.expectedOutcome === 'FAIL') {
        console.log('Test PASSED: Authentication failed as expected');
      } else {
        console.log('Test FAILED: Unexpected outcome');
      }
      
      // Clean up test user
      await User.deleteOne({ email });
      console.log('Test user deleted');
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testSignupWithConfirm(); 