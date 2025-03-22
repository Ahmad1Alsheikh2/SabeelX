/**
 * Script to test user creation and authentication with a fixed simple password
 * Run with: node scripts/test-fixed-password.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function testFixedPassword() {
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
      role: { type: String }
    });
    
    // Define manual password comparison method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      console.log('Comparing password...');
      const result = await bcrypt.compare(candidatePassword, this.password);
      return result;
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Use a very simple password for testing
    const testUser = {
      email: 'test-fixed@example.com',
      password: 'Test123',  // Simple password
      firstName: 'Test',
      lastName: 'User'
    };
    
    // Check if user already exists and delete if found
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Deleting existing user');
      await User.deleteOne({ email: testUser.email });
    }
    
    // Create new user with specific salt work factor and hash
    console.log('\n===== CREATING USER =====');
    
    // Use a lower salt factor (10 is default, trying 8)
    const saltRounds = 10;
    console.log(`Using salt rounds: ${saltRounds}`);
    
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('Salt generated:', salt);
    
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    console.log('Password hashed successfully');
    console.log('Hashed password:', hashedPassword);
    
    // Create user with hashed password
    const newUser = await User.create({
      email: testUser.email,
      password: hashedPassword,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      role: 'USER'
    });
    
    console.log('User created successfully:', {
      id: newUser._id.toString(),
      email: newUser.email
    });
    
    // Now try to authenticate with the plain password
    console.log('\n===== AUTHENTICATING USER =====');
    
    // Retrieve user
    const retrievedUser = await User.findOne({ email: testUser.email });
    console.log('Retrieved user:', {
      id: retrievedUser._id.toString(),
      hashedPassword: retrievedUser.password
    });
    
    // Test using the model method
    console.log('Testing with model comparePassword method:');
    const isValid = await retrievedUser.comparePassword(testUser.password);
    console.log('Authentication result:', isValid ? 'SUCCESS' : 'FAILED');
    
    // Test directly with bcrypt
    console.log('\nTesting with direct bcrypt.compare:');
    const directResult = await bcrypt.compare(testUser.password, retrievedUser.password);
    console.log('Direct comparison result:', directResult ? 'SUCCESS' : 'FAILED');
    
    // Test with wrong password
    console.log('\nTesting with wrong password:');
    const wrongResult = await bcrypt.compare('WrongPassword', retrievedUser.password);
    console.log('Wrong password result:', wrongResult ? 'SUCCESS' : 'FAILED (expected)');
    
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testFixedPassword(); 