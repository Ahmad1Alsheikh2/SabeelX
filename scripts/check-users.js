/**
 * Script to check existing users in MongoDB
 * Run with: node scripts/check-users.js [optional email to check]
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function checkUsers() {
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
      signupSource: String,
      createdAt: Date
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Check if a specific email was provided
    const emailToCheck = process.argv[2];
    
    if (emailToCheck) {
      console.log(`\nChecking for user with email: ${emailToCheck}`);
      const user = await User.findOne({ email: emailToCheck });
      
      if (user) {
        console.log('User found:');
        console.log(`- ID: ${user._id}`);
        console.log(`- Email: ${user.email}`);
        console.log(`- Name: ${user.firstName} ${user.lastName}`);
        console.log(`- Role: ${user.role}`);
        console.log(`- Signup Source: ${user.signupSource || 'Unknown'}`);
        console.log(`- Created: ${user.createdAt}`);
      } else {
        console.log(`No user found with email: ${emailToCheck}`);
      }
    } else {
      // Count total users
      const userCount = await User.countDocuments();
      console.log(`\nTotal users in database: ${userCount}`);
      
      if (userCount > 0) {
        // Get all users
        const users = await User.find().sort({ createdAt: -1 });
        
        console.log('\nUsers in database:');
        users.forEach((user, index) => {
          console.log(`${index + 1}. ${user.email} (${user.firstName} ${user.lastName}) - ${user.role} - Created: ${user.createdAt}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkUsers(); 