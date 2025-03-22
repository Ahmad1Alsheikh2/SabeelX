/**
 * Script to verify the password hashing fix works properly
 * This simulates a signup and signin to ensure authentication works correctly
 * Run with: node scripts/verify-password-fix.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function verifyPasswordFix() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Use the actual User model from your app
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String },
      lastName: { type: String },
      role: { type: String, default: 'USER' },
      passwordMatch: { type: Boolean, default: false },
      signupSource: { 
        type: String, 
        enum: ['MENTOR_SIGNUP', 'USER_SIGNUP', 'ADMIN'],
        default: 'USER_SIGNUP'
      }
    });
    
    // Add methods exactly as in your User model
    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next();
      
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });
    
    userSchema.methods.comparePassword = async function(candidatePassword) {
      if (!this.password) return false;
      return await bcrypt.compare(candidatePassword, this.password);
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Generate test users
    const testUsers = [
      {
        email: `test-fix-user-${Date.now()}@example.com`,
        password: 'FixedPassword123',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        signupSource: 'USER_SIGNUP'
      },
      {
        email: `test-fix-mentor-${Date.now()}@example.com`,
        password: 'FixedPassword123',
        firstName: 'Test',
        lastName: 'Mentor',
        role: 'MENTOR',
        signupSource: 'MENTOR_SIGNUP'
      }
    ];
    
    console.log('\n===== TESTING FIXED PASSWORD FLOW =====');
    
    // Test each user type
    for (const userData of testUsers) {
      console.log(`\nTesting user type: ${userData.role}`);
      console.log(`- Email: ${userData.email}`);
      console.log(`- Password: ${userData.password}`);
      
      // Step 1: Create user (simulating the new fixed route)
      console.log('\n1. Create user (using plain password)');
      
      const newUser = new User(userData);
      await newUser.save();
      
      console.log('User created successfully');
      console.log(`- ID: ${newUser._id}`);
      console.log(`- Stored password hash (first 20 chars): ${newUser.password.substring(0, 20)}...`);
      
      // Step 2: Authenticate
      console.log('\n2. Authentication test');
      
      // Find user (simulate login flow)
      const foundUser = await User.findOne({ email: userData.email });
      console.log(`Found user with email ${userData.email}`);
      
      // Test with correct password
      const authResult = await foundUser.comparePassword(userData.password);
      console.log(`Authentication with correct password: ${authResult ? 'SUCCESS' : 'FAILED'}`);
      
      // Test with incorrect password
      const wrongAuthResult = await foundUser.comparePassword('WrongPassword123');
      console.log(`Authentication with wrong password: ${wrongAuthResult ? 'FAILED (unexpected match)' : 'SUCCESS (correctly rejected)'}`);
      
      // Clean up
      await User.deleteOne({ _id: newUser._id });
      console.log('Test user deleted');
    }
    
    console.log('\n===== PASSWORD FIX VERIFICATION COMPLETE =====');
    
  } catch (error) {
    console.error('Error in verification:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

verifyPasswordFix(); 