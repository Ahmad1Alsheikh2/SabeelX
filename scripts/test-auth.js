/**
 * Script to test user authentication in MongoDB
 * Run with: node scripts/test-auth.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function testAuth() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define the comparePassword method for User
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      role: String
    });
    
    userSchema.methods.comparePassword = async function(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Test credentials
    const email = 'test@example.com';
    const password = 'TestPassword123';
    
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', {
      id: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    });
    
    console.log('\nPassword details:');
    console.log('- Stored hash length:', user.password?.length || 0);
    console.log('- Stored hash (first 20 chars):', user.password?.substring(0, 20) + '...');
    console.log('- bcrypt format check:', user.password?.startsWith('$2') ? 'Valid bcrypt format' : 'Not bcrypt format');
    
    // Create a new hash with the same password for comparison
    console.log('\nGenerating a new hash with the same password for comparison...');
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(password, salt);
    console.log('- New hash (first 20 chars):', newHash.substring(0, 20) + '...');
    console.log('- New hash length:', newHash.length);
    
    console.log('\nTesting password authentication...');
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('✅ Authentication successful!');
    } else {
      console.log('❌ Authentication failed - invalid password');
      console.log('This suggests the password was hashed differently when created.');
    }
    
    // Let's try to hash the password again and directly update it
    console.log('\nUpdating the user with a freshly hashed password...');
    const updateSalt = await bcrypt.genSalt(10);
    const updateHash = await bcrypt.hash(password, updateSalt);
    
    await User.updateOne(
      { _id: user._id },
      { $set: { password: updateHash } }
    );
    
    console.log('User password updated successfully.');
    
    // Try authentication again
    const updatedUser = await User.findOne({ email });
    console.log('\nTesting authentication with updated password...');
    const isValidAfterUpdate = await bcrypt.compare(password, updatedUser.password);
    
    if (isValidAfterUpdate) {
      console.log('✅ Authentication successful after update!');
    } else {
      console.log('❌ Authentication still failed after update');
    }
    
  } catch (error) {
    console.error('Error testing authentication:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testAuth(); 