/**
 * Script to test the entire signup and sign-in flow
 * Run with: node scripts/test-signup-flow.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function testSignupFlow() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define User schema with the comparePassword method
    const userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      password: {
        type: String,
        required: false
      },
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      role: {
        type: String,
        enum: ['USER', 'MENTOR'],
        default: 'USER',
        required: true
      },
      skills: [{
        type: String
      }],
      expertise: [{
        type: String
      }],
      isProfileComplete: {
        type: Boolean,
        default: false
      }
    }, {
      timestamps: true
    });
    
    // Manual implementation of password comparison
    userSchema.methods.comparePassword = async function(candidatePassword) {
      console.log('Comparing password...');
      console.log('- Stored hash (first 20 chars):', this.password?.substring(0, 20) + '...');
      const result = await bcrypt.compare(candidatePassword, this.password);
      console.log('- Password comparison result:', result);
      return result;
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Test credentials
    const testUser = {
      email: `test${Date.now()}@example.com`, // Use timestamp to ensure unique email
      password: 'TestPassword123',
      firstName: 'Test',
      lastName: 'User'
    };
    
    console.log('\n===== SIGNUP PROCESS =====');
    console.log('Creating test user with email:', testUser.email);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('User already exists, will not create a new one.');
    } else {
      // Hash password just like in the signup route
      console.log('Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testUser.password, salt);
      console.log('Password hashed successfully');
      console.log('Hash format check:', hashedPassword.startsWith('$2') ? 'Valid bcrypt format' : 'Not bcrypt format');
      
      // Create user
      const newUser = await User.create({
        email: testUser.email,
        password: hashedPassword,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: 'USER',
        skills: [],
        expertise: [],
        isProfileComplete: false
      });
      
      console.log('User created successfully:', {
        id: newUser._id.toString(),
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`
      });
    }
    
    console.log('\n===== SIGN-IN PROCESS =====');
    console.log('Finding user with email:', testUser.email);
    
    // Fetch the user again to simulate sign-in
    const user = await User.findOne({ email: testUser.email });
    
    if (!user) {
      console.log('User not found, sign-in would fail');
      return;
    }
    
    console.log('User found:', {
      id: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`
    });
    
    // Test authentication
    console.log('Testing authentication...');
    const isValidPassword = await user.comparePassword(testUser.password);
    
    if (isValidPassword) {
      console.log('✅ Authentication successful!');
      console.log('Sign-in process would complete successfully');
    } else {
      console.log('❌ Authentication failed - invalid password');
      console.log('Sign-in process would fail');
      
      // Debug more
      console.log('\nDirect comparison with bcrypt:');
      const directCheck = await bcrypt.compare(testUser.password, user.password);
      console.log('- Direct bcrypt check result:', directCheck);
    }
    
  } catch (error) {
    console.error('Error testing signup flow:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testSignupFlow(); 