/**
 * Script to test email uniqueness validation and cleanup duplicate entries
 * This helps diagnose "User with this email already exists" errors
 * Run with: node scripts/test-email-uniqueness.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function testEmailUniqueness() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define User schema
    const userSchema = new mongoose.Schema({
      email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true // Force lowercase to prevent case-sensitive duplicates
      },
      password: { type: String, required: true },
      firstName: { type: String },
      lastName: { type: String },
      role: { type: String, default: 'USER' },
      signupSource: { 
        type: String, 
        enum: ['MENTOR_SIGNUP', 'USER_SIGNUP', 'ADMIN'],
        default: 'USER_SIGNUP'
      },
      createdAt: { type: Date, default: Date.now }
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Step 1: Check for existing users
    console.log('\n===== CHECKING FOR EXISTING USERS =====');
    const allUsers = await User.find({}).select('email role createdAt');
    
    console.log(`Total users in database: ${allUsers.length}`);
    
    if (allUsers.length > 0) {
      console.log('\nExisting users:');
      allUsers.forEach(user => {
        console.log(`- ${user.email} (${user.role}) created: ${user.createdAt.toISOString()}`);
      });
    }
    
    // Step 2: Check for duplicate emails
    console.log('\n===== CHECKING FOR DUPLICATE EMAILS =====');
    
    // Get all distinct emails first
    const distinctEmails = await User.distinct('email');
    console.log(`Distinct email addresses: ${distinctEmails.length}`);
    
    // Check if there's a difference between total and distinct count
    if (distinctEmails.length < allUsers.length) {
      console.log('\nWARNING: Found possible duplicate emails!');
      console.log(`Total users: ${allUsers.length}, Distinct emails: ${distinctEmails.length}`);
      console.log('Duplicates:', allUsers.length - distinctEmails.length);
      
      // Find duplicates by aggregation
      const duplicates = await User.aggregate([
        { $group: { _id: { email: "$email" }, count: { $sum: 1 }, docs: { $push: "$_id" } } },
        { $match: { count: { $gt: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      if (duplicates.length > 0) {
        console.log('\nDuplicate email details:');
        for (const dup of duplicates) {
          console.log(`Email: ${dup._id.email}, Count: ${dup.count}`);
          
          // Get full details of duplicate users
          const dupUsers = await User.find({ email: dup._id.email }).select('_id email role createdAt');
          dupUsers.forEach((dupUser, index) => {
            console.log(`  ${index + 1}. ID: ${dupUser._id}, Role: ${dupUser.role}, Created: ${dupUser.createdAt.toISOString()}`);
          });
          
          // Keep only the most recent one
          console.log('  Action: Keeping most recent, deleting others');
          
          // Sort by createdAt in descending order
          dupUsers.sort((a, b) => b.createdAt - a.createdAt);
          
          // Keep the first one (most recent), delete the rest
          for (let i = 1; i < dupUsers.length; i++) {
            await User.deleteOne({ _id: dupUsers[i]._id });
            console.log(`  - Deleted user ID: ${dupUsers[i]._id}`);
          }
        }
      }
    } else {
      console.log('No duplicate emails found.');
    }
    
    // Step 3: Test creating a user with a new email
    console.log('\n===== TESTING USER CREATION =====');
    
    const testEmail = `test-unique-${Date.now()}@example.com`;
    console.log(`Testing with email: ${testEmail}`);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log('UNEXPECTED: Test user already exists (should be impossible with timestamp)');
      return;
    }
    
    // Create new user
    const newUser = new User({
      email: testEmail,
      password: 'TestPassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER'
    });
    
    await newUser.save();
    console.log('Test user created successfully');
    
    // Try to create another user with the same email
    console.log('\nAttempting to create duplicate user with same email...');
    try {
      const duplicateUser = new User({
        email: testEmail,
        password: 'DifferentPassword123',
        firstName: 'Duplicate',
        lastName: 'User',
        role: 'USER'
      });
      
      await duplicateUser.save();
      console.log('ERROR: Duplicate user was created! Uniqueness constraint not working!');
    } catch (error) {
      console.log('Expected error occurred: Duplicate user creation was prevented');
      console.log(`Error message: ${error.message}`);
    }
    
    // Clean up
    console.log('\n===== CLEANUP =====');
    await User.deleteOne({ email: testEmail });
    console.log('Test user deleted');
    
    console.log('\n===== SUMMARY OF FINDINGS =====');
    console.log(`1. Total unique users after cleanup: ${await User.countDocuments()}`);
    console.log('2. Uniqueness constraint test: ' + 
      (await User.findOne({ email: testEmail }) ? 'FAILED (user still exists)' : 'PASSED (duplicate prevented)'));
    
  } catch (error) {
    console.error('Error in email uniqueness test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testEmailUniqueness(); 