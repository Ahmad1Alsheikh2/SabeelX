/**
 * Interactive script to reset user information in MongoDB
 * This provides options for different types of resets
 * Run with: node scripts/reset-user-data-interactive.js
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

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
      role: String,
      isProfileComplete: Boolean,
      createdAt: Date
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // List of admin emails that should be preserved
    const preservedEmails = [
      'admin@example.com',
      // Add more admin emails if needed
    ];
    
    // First, get a count of all users
    const totalUsers = await User.countDocuments({});
    console.log(`Total users in database: ${totalUsers}`);
    
    // Count users by role
    const mentorCount = await User.countDocuments({ role: 'MENTOR' });
    const userCount = await User.countDocuments({ role: 'USER' });
    console.log(`- Mentors: ${mentorCount}`);
    console.log(`- Regular users: ${userCount}`);
    
    console.log('\n===== USER DATA RESET OPTIONS =====');
    console.log('1. Delete all users (preserving admins)');
    console.log('2. Delete only test users (email contains "test")');
    console.log('3. Delete users by role (MENTOR or USER)');
    console.log('4. Delete incomplete profiles');
    console.log('5. Delete users created in the last X days');
    console.log('6. Exit without deleting');
    
    const option = await prompt('\nSelect an option (1-6): ');
    
    let filter = {};
    let result;
    
    switch(option) {
      case '1':
        // Delete all users except admins
        filter = {
          email: { $nin: preservedEmails }
        };
        break;
        
      case '2':
        // Delete test users
        filter = {
          email: { $regex: /test/i, $nin: preservedEmails }
        };
        break;
        
      case '3':
        // Delete by role
        const roleOption = await prompt('Which role to delete? (1 for MENTOR, 2 for USER): ');
        const roleToDelete = roleOption === '1' ? 'MENTOR' : 'USER';
        filter = {
          role: roleToDelete,
          email: { $nin: preservedEmails }
        };
        break;
        
      case '4':
        // Delete incomplete profiles
        filter = {
          isProfileComplete: { $ne: true },
          email: { $nin: preservedEmails }
        };
        break;
        
      case '5':
        // Delete recently created users
        const days = await prompt('Delete users created in the last how many days?: ');
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(days));
        
        filter = {
          createdAt: { $gte: daysAgo },
          email: { $nin: preservedEmails }
        };
        break;
        
      case '6':
        console.log('Exiting without making any changes.');
        rl.close();
        await mongoose.disconnect();
        return;
        
      default:
        console.log('Invalid option. Exiting without making any changes.');
        rl.close();
        await mongoose.disconnect();
        return;
    }
    
    // Confirmation
    console.log(`\nPreparing to delete users with the following filter:`);
    console.log(JSON.stringify(filter, null, 2));
    const matchCount = await User.countDocuments(filter);
    console.log(`This will delete ${matchCount} users.`);
    
    const confirm = await prompt('Are you sure you want to proceed? (yes/no): ');
    
    if (confirm.toLowerCase() === 'yes') {
      result = await User.deleteMany(filter);
      console.log(`\nDeleted ${result.deletedCount} users`);
      
      // Get remaining users count
      const remainingUsers = await User.countDocuments({});
      console.log(`Remaining users: ${remainingUsers}`);
      
      console.log('\nReset completed successfully');
    } else {
      console.log('Operation cancelled. No users were deleted.');
    }
    
  } catch (error) {
    console.error('Error resetting user data:', error);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetUserData(); 