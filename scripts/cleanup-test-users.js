/**
 * Script to clean up test users from MongoDB
 * Run with: node scripts/cleanup-test-users.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function cleanupTestUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Get User model
    const userSchema = new mongoose.Schema({
      email: String
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Delete all test users
    console.log('Deleting test users...');
    const result = await User.deleteMany({
      email: { $regex: /^test.*@example\.com$/ }
    });
    
    console.log(`Deleted ${result.deletedCount} test users`);
    
  } catch (error) {
    console.error('Error cleaning up test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

cleanupTestUsers(); 