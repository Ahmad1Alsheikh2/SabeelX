/**
 * Script to delete a specific user by email address
 * Run with: node scripts/delete-specific-user.js hamaadwmehal@gmail.com
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function deleteSpecificUser() {
  try {
    // Get email from command line arguments
    const emailToDelete = process.argv[2]; 
    
    if (!emailToDelete) {
      console.error('Error: No email address provided.');
      console.log('Usage: node scripts/delete-specific-user.js <email_address>');
      process.exit(1);
    }
    
    console.log(`Preparing to delete user with email: ${emailToDelete}`);
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define simple User schema
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      firstName: String,
      lastName: String,
      role: String,
      createdAt: Date
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Check if user exists
    const user = await User.findOne({ email: emailToDelete });
    
    if (!user) {
      console.log(`User with email ${emailToDelete} not found.`);
      await mongoose.disconnect();
      return;
    }
    
    console.log('Found user:');
    console.log(`- ID: ${user._id}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Name: ${user.firstName} ${user.lastName}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Created: ${user.createdAt}`);
    
    // Delete the user
    console.log('\nDeleting user...');
    const result = await User.deleteOne({ email: emailToDelete });
    
    if (result.deletedCount === 1) {
      console.log(`SUCCESS: User with email ${emailToDelete} has been deleted.`);
    } else {
      console.log('No users were deleted. This may be due to a case sensitivity issue.');
      
      // Try case-insensitive search and delete
      console.log('\nAttempting case-insensitive deletion...');
      const regexEmail = new RegExp(`^${emailToDelete}$`, 'i');
      const result2 = await User.deleteOne({ email: regexEmail });
      
      if (result2.deletedCount === 1) {
        console.log(`SUCCESS: User with email matching ${emailToDelete} (case insensitive) has been deleted.`);
      } else {
        console.log('ERROR: Failed to delete user after case-insensitive attempt.');
      }
    }
    
    // Verify deletion
    const userAfterDeletion = await User.findOne({ email: emailToDelete });
    if (!userAfterDeletion) {
      console.log('Verification: User no longer exists in the database.');
    } else {
      console.log('WARNING: User still exists in the database after deletion attempt.');
    }
    
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

deleteSpecificUser(); 