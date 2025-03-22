/**
 * Script to create a test user in MongoDB
 * Run with: node scripts/create-test-user.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function createTestUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define user model (similar to User.js model)
    const userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      password: {
        type: String,
        required: false
      },
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      role: {
        type: String,
        enum: ['USER', 'MENTOR'],
        default: 'USER',
        required: true
      },
      skills: [{
        type: String
      }],
      expertise: [{
        type: String
      }],
      isProfileComplete: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }, {
      timestamps: true
    });
    
    // Hash password before saving
    userSchema.pre('save', async function (next) {
      if (!this.isModified('password') || !this.password) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists with ID:', existingUser._id.toString());
      return existingUser;
    }
    
    // Create test user
    console.log('Creating test user...');
    const password = 'TestPassword123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const testUser = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      skills: ['JavaScript', 'React'],
      expertise: ['Web Development'],
      isProfileComplete: true
    });
    
    console.log('Test user created successfully!');
    console.log('User details:');
    console.log('- ID:', testUser._id.toString());
    console.log('- Email:', testUser.email);
    console.log('- Name:', testUser.firstName, testUser.lastName);
    console.log('- Role:', testUser.role);
    console.log('- Password (unhashed):', password);
    
    return testUser;
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUser(); 