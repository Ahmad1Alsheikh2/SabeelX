/**
 * Script to generate multiple test users in MongoDB
 * This will create a mix of mentors and regular users with various stages of profile completion
 * Run with: node scripts/generate-test-users.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';

async function generateTestUsers() {
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
      isProfileComplete: { type: Boolean, default: false },
      skills: [{ type: String }],
      expertise: [{ type: String }],
      country: { type: String },
      experience: { type: Number },
      hourlyRate: { type: Number },
      title: { type: String },
      company: { type: String },
      bio: { type: String },
      isVerified: { type: Boolean, default: false },
      passwordMatch: { type: Boolean, default: true },
      signupSource: { type: String, enum: ['MENTOR_SIGNUP', 'USER_SIGNUP', 'ADMIN'], default: 'USER_SIGNUP' }
    });
    
    // Define password comparison method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    };
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Define test users
    const basePassword = 'TestPass123';
    
    // Hash the password once for all users (in production each would have a different salt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(basePassword, salt);
    
    // Mentors - these would come from the mentor signup flow
    const mentorUsers = [
      {
        email: 'mentor1@example.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'MENTOR',
        isProfileComplete: true,
        skills: ['JavaScript', 'React', 'Node.js'],
        expertise: ['Frontend Development', 'Web Development'],
        country: 'United States',
        experience: 5,
        hourlyRate: 75,
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        bio: 'Experienced web developer specializing in React and modern JavaScript.',
        isVerified: true,
        signupSource: 'MENTOR_SIGNUP'
      },
      {
        email: 'mentor2@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'MENTOR',
        isProfileComplete: true,
        skills: ['Python', 'Data Science', 'Machine Learning'],
        expertise: ['Machine Learning', 'Data Science'],
        country: 'Canada',
        experience: 7,
        hourlyRate: 90,
        title: 'Data Scientist',
        company: 'AI Innovations',
        bio: 'Data scientist with expertise in machine learning algorithms and predictive modeling.',
        isVerified: true,
        signupSource: 'MENTOR_SIGNUP'
      },
      {
        email: 'mentor3@example.com',
        firstName: 'Michael',
        lastName: 'Wong',
        role: 'MENTOR',
        isProfileComplete: false,
        skills: ['Java', 'Spring', 'Microservices'],
        country: 'Singapore',
        signupSource: 'MENTOR_SIGNUP'
      }
    ];
    
    // Regular users - these would come from the user signup flow
    const regularUsers = [
      {
        email: 'user1@example.com',
        firstName: 'Alex',
        lastName: 'Taylor',
        role: 'USER',
        isProfileComplete: true,
        skills: ['JavaScript', 'HTML', 'CSS'],
        expertise: ['Frontend Basics'],
        signupSource: 'USER_SIGNUP'
      },
      {
        email: 'user2@example.com',
        firstName: 'Jessica',
        lastName: 'Brown',
        role: 'USER',
        isProfileComplete: false,
        skills: ['Python'],
        signupSource: 'USER_SIGNUP'
      },
      {
        email: 'user3@example.com',
        firstName: 'David',
        lastName: 'Miller',
        role: 'USER',
        isProfileComplete: false,
        signupSource: 'USER_SIGNUP'
      }
    ];
    
    // Combine all users
    const allTestUsers = [...mentorUsers, ...regularUsers].map(user => ({
      ...user,
      password: hashedPassword,
      passwordMatch: true
    }));
    
    // Count existing test users
    const existingUserCount = await User.countDocuments({
      email: { $in: allTestUsers.map(user => user.email) }
    });
    
    if (existingUserCount > 0) {
      console.log(`${existingUserCount} test users already exist in the database`);
      console.log('Deleting existing test users before creating new ones...');
      
      await User.deleteMany({
        email: { $in: allTestUsers.map(user => user.email) }
      });
      
      console.log('Existing test users deleted successfully');
    }
    
    // Create all users
    const result = await User.insertMany(allTestUsers);
    
    console.log(`Successfully created ${result.length} test users:`);
    console.log(`- ${mentorUsers.length} mentors (from mentor signup flow)`);
    console.log(`- ${regularUsers.length} regular users (from user signup flow)`);
    
    console.log('\nAll test users have the password:', basePassword);
    
    console.log('\nTest mentors (mentor signup flow):');
    mentorUsers.forEach(mentor => {
      console.log(`- ${mentor.firstName} ${mentor.lastName} (${mentor.email}) - ${mentor.isProfileComplete ? 'Complete Profile' : 'Incomplete Profile'}`);
    });
    
    console.log('\nTest regular users (user signup flow):');
    regularUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - ${user.isProfileComplete ? 'Complete Profile' : 'Incomplete Profile'}`);
    });
    
  } catch (error) {
    console.error('Error generating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

generateTestUsers(); 