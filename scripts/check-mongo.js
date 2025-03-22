/**
 * Script to check MongoDB connection and database status
 * Run with: node scripts/check-mongo.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';
console.log(`Attempting to connect to: ${MONGODB_URI}`);

async function checkMongo() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    // Get connection status
    const state = mongoose.connection.readyState;
    console.log(`Connection state: ${state === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Get database info
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in database:');
    if (collections.length === 0) {
      console.log('No collections found (database may be empty)');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Check if User model exists
    try {
      const User = require('../models/User');
      console.log('\nVerifying User model...');
      console.log('✅ User model loaded successfully');
    } catch (err) {
      console.error('❌ Error loading User model:', err.message);
    }
    
    // Try to access the database
    try {
      const adminDb = mongoose.connection.db.admin();
      const serverInfo = await adminDb.serverInfo();
      console.log('\nMongoDB server info:');
      console.log(`- Version: ${serverInfo.version}`);
      console.log(`- Platform: ${serverInfo.platform}`);
    } catch (err) {
      console.error('❌ Error accessing database admin:', err.message);
    }
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔴 MongoDB server is not running. Please start MongoDB with:');
      console.log('   - If using MongoDB Community: mongod');
      console.log('   - If using Docker: docker start mongodb');
      console.log('   - If using MongoDB Atlas: Check your connection string and network access');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\nDisconnected from MongoDB');
    }
  }
}

checkMongo(); 