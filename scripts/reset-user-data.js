/**
 * Script to reset user information in MongoDB
 * This will delete all users except those in an admin list
 * Run with: node scripts/reset-user-data.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function resetUserData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define User schema
    const userSchema = new mongoose.Schema({
      email: String,
      firstName: String,
      lastName: String,
      role: String
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // List of admin emails that should be preserved (add your admin emails here)
    const preservedEmails = [
      'admin@example.com',
      // Add more admin emails if needed
    ];
    
    console.log('\n===== RESETTING USER DATA =====');
    
    // First, get a count of all users
    const totalUsers = await User.countDocuments({});
    console.log(`Total users before reset: ${totalUsers}`);
    
    // Delete all users except those in the preserved list
    const result = await User.deleteMany({
      email: { $nin: preservedEmails }
    });
    
    console.log(`Deleted ${result.deletedCount} users`);
    
    // Get remaining users count
    const remainingUsers = await User.countDocuments({});
    console.log(`Remaining users: ${remainingUsers}`);
    
    if (remainingUsers > 0) {
      console.log('\nPreserved users:');
      const adminUsers = await User.find({ email: { $in: preservedEmails } });
      adminUsers.forEach(user => {
        console.log(`- ${user.email} (${user.firstName} ${user.lastName}, Role: ${user.role})`);
      });
    }
    
    console.log('\nReset completed successfully');
    
  } catch (error) {
    console.error('Error resetting user data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetUserData(); 