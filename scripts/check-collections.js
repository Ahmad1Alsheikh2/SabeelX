/**
 * Script to check all collections in MongoDB
 * Run with: node scripts/check-collections.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function checkCollections() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log(`\nDatabase name: ${mongoose.connection.db.databaseName}`);
    console.log(`Total collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('\nCollections:');
      for (const collection of collections) {
        // Count documents in each collection
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        console.log(`- ${collection.name}: ${count} documents`);
      }
    }
    
    // Check for other users collections that might be named differently
    const potentialUserCollections = [
      'users', 'Users', 'user', 'User', 'accounts', 'Accounts', 'member', 'members', 'Members'
    ];
    
    for (const collName of potentialUserCollections) {
      if (!collections.find(c => c.name === collName) && 
          await mongoose.connection.db.listCollections({ name: collName }).hasNext()) {
        const count = await mongoose.connection.db.collection(collName).countDocuments();
        console.log(`- ${collName} (hidden): ${count} documents`);
      }
    }
    
  } catch (error) {
    console.error('Error checking collections:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkCollections(); 