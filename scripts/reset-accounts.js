/**
 * Script to reset all accounts in the MongoDB database
 * Run with: node scripts/reset-accounts.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

// Models
const UserModel = require('../models/User');
const SessionModel = require('../models/Session');
const AccountModel = require('../models/Account');

async function resetAccounts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all sessions
    console.log('Deleting all sessions...');
    const sessionsResult = await SessionModel.deleteMany({});
    console.log(`Deleted ${sessionsResult.deletedCount} sessions`);

    // Delete all accounts
    console.log('Deleting all accounts...');
    const accountsResult = await AccountModel.deleteMany({});
    console.log(`Deleted ${accountsResult.deletedCount} accounts`);

    // Delete all users
    console.log('Deleting all users...');
    const usersResult = await UserModel.deleteMany({});
    console.log(`Deleted ${usersResult.deletedCount} users`);

    console.log('All accounts have been reset successfully');
  } catch (error) {
    console.error('Error resetting accounts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the reset function
resetAccounts(); 