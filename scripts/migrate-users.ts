import { createClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabeelx';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Note: This needs to be the service role key, not the anon key
);

async function migrateUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all users from MongoDB
        const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: String,
            password: String,
            firstName: String,
            lastName: String,
            role: String,
            image: String,
            bio: String,
            skills: [String],
            expertise: [String],
            country: String,
            experience: Number,
            hourlyRate: Number,
            title: String,
            company: String,
            availability: Number,
            isProfileComplete: Boolean,
        }));

        const users = await UserModel.find({});
        console.log(`Found ${users.length} users to migrate`);

        // Migrate each user
        for (const user of users) {
            try {
                // Create auth user in Supabase
                const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                    email: user.email,
                    password: user.password ? 'TempPass123!' : undefined, // Temporary password if exists
                    email_confirm: true,
                });

                if (authError) {
                    console.error(`Error creating auth user for ${user.email}:`, authError);
                    continue;
                }

                // Create user profile in users table
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({
                        id: authUser.user.id,
                        email: user.email,
                        first_name: user.firstName,
                        last_name: user.lastName,
                        role: user.role,
                        image_url: user.image,
                        bio: user.bio,
                        skills: user.skills,
                        expertise: user.expertise,
                        country: user.country,
                        experience: user.experience,
                        hourly_rate: user.hourlyRate,
                        title: user.title,
                        company: user.company,
                        availability: user.availability,
                        is_profile_complete: user.isProfileComplete,
                    });

                if (profileError) {
                    console.error(`Error creating profile for ${user.email}:`, profileError);
                    continue;
                }

                console.log(`Successfully migrated user: ${user.email}`);
            } catch (err) {
                console.error(`Error migrating user ${user.email}:`, err);
            }
        }

        console.log('Migration completed');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

migrateUsers(); 