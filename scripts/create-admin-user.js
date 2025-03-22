/**
 * Script to create an admin user in MongoDB
 * Run with: node scripts/create-admin-user.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function createAdminUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Define User schema
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      role: { type: String, required: true },
      isProfileComplete: { type: Boolean, default: true },
      skills: [{ type: String }],
      expertise: [{ type: String }],
      isAdmin: { type: Boolean, default: false },
      passwordMatch: { type: Boolean, default: true }
    });
    
    // Define password comparison method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Admin user data
    const adminData = {
      email: 'admin@sabeelx.com',
      password: 'AdminPass123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'USER',
      isAdmin: true,
      skills: ['Administration', 'User Management'],
      expertise: ['System Administration'],
      isProfileComplete: true
    };
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log(`Admin user already exists with email: ${adminData.email}`);
      console.log('Admin user details:');
      console.log(`- ID: ${existingAdmin._id}`);
      console.log(`- Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(`- Role: ${existingAdmin.role}`);
      
      // Ask if we should update the password
      console.log('\nDo you want to update the admin password? (yes/no)');
      const answer = await new Promise(resolve => {
        process.stdin.once('data', data => {
          resolve(data.toString().trim().toLowerCase());
        });
      });
      
      if (answer === 'yes') {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        
        // Update the admin password
        await User.updateOne(
          { _id: existingAdmin._id },
          { $set: { password: hashedPassword } }
        );
        
        console.log('Admin password updated successfully');
      } else {
        console.log('Password update skipped');
      }
    } else {
      // Create new admin user
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      // Create the admin user
      const admin = await User.create({
        ...adminData,
        password: hashedPassword
      });
      
      console.log('Admin user created successfully:');
      console.log(`- ID: ${admin._id}`);
      console.log(`- Email: ${admin.email}`);
      console.log(`- Name: ${admin.firstName} ${admin.lastName}`);
      console.log(`- Role: ${admin.role}`);
      console.log(`- Default Password: ${adminData.password} (please change after first login)`);
    }
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the stdin if it was opened
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdminUser(); 