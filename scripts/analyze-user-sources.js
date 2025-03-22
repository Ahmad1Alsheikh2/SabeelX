/**
 * Script to analyze user data by signup source
 * This script shows statistics about users from different signup sources
 * Run with: node scripts/analyze-user-sources.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function analyzeUserSources() {
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
      signupSource: String,
      createdAt: Date,
      updatedAt: Date
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    console.log('\n===== USER DATA ANALYSIS BY SIGNUP SOURCE =====');
    
    // Get total users
    const totalUsers = await User.countDocuments({});
    console.log(`Total users: ${totalUsers}`);
    
    // Get count by signup source
    const sourceStats = await User.aggregate([
      {
        $group: {
          _id: { source: "$signupSource", role: "$role" },
          count: { $sum: 1 },
          completedProfiles: { 
            $sum: { $cond: [ "$isProfileComplete", 1, 0 ] } 
          }
        }
      },
      { $sort: { "_id.source": 1, "_id.role": 1 } }
    ]);
    
    // Process and display results
    const sources = [...new Set(sourceStats.map(item => item._id.source))];
    sources.forEach(source => {
      // Filter stats for this source
      const sourceItems = sourceStats.filter(item => item._id.source === source);
      const totalForSource = sourceItems.reduce((sum, item) => sum + item.count, 0);
      const completedForSource = sourceItems.reduce((sum, item) => sum + item.completedProfiles, 0);
      
      console.log(`\n${source || 'UNKNOWN SOURCE'}: ${totalForSource} users`);
      console.log(`- Completed profiles: ${completedForSource} (${Math.round(completedForSource/totalForSource*100)}%)`);
      
      // Show breakdown by role
      sourceItems.forEach(item => {
        const { role } = item._id;
        const completion = item.completedProfiles / item.count * 100;
        console.log(`  • ${role || 'UNKNOWN ROLE'}: ${item.count} users (${Math.round(completion)}% complete)`);
      });
    });
    
    // Show recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSignups = await User.find({ 
      createdAt: { $gte: sevenDaysAgo } 
    }).sort({ createdAt: -1 });
    
    console.log(`\nRecent signups (last 7 days): ${recentSignups.length}`);
    
    if (recentSignups.length > 0) {
      const recentBySource = {};
      
      recentSignups.forEach(user => {
        const source = user.signupSource || 'UNKNOWN';
        if (!recentBySource[source]) {
          recentBySource[source] = [];
        }
        recentBySource[source].push(user);
      });
      
      Object.keys(recentBySource).forEach(source => {
        console.log(`- ${source}: ${recentBySource[source].length} new users`);
      });
      
      // Show the 5 most recent signups
      console.log('\nMost recent signups:');
      recentSignups.slice(0, 5).forEach(user => {
        const date = new Date(user.createdAt).toLocaleString();
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}): ${user.role} via ${user.signupSource || 'UNKNOWN'} on ${date}`);
      });
    }
    
  } catch (error) {
    console.error('Error analyzing user data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

analyzeUserSources(); 