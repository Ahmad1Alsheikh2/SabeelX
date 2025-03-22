import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import UserModel from '@/models/User'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName } = body

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: 'Password should be at least 8 characters long' },
                { status: 400 }
            )
        }

        // Connect to database
        await dbConnect()

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            )
        }

        // Hash password - fix the password hashing to ensure it's compatible
        console.log('Hashing password...');
        let hashedPassword;
        try {
            // Use the direct bcrypt functions instead of relying on the model's pre-save hook
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
            console.log('Password hashed successfully');
            
            // Verify the hash format for debugging
            if (!hashedPassword.startsWith('$2')) {
                console.warn('Warning: Hashed password does not appear to be in bcrypt format');
            }
        } catch (hashError) {
            console.error('Error hashing password:', hashError);
            return NextResponse.json(
                { message: 'Error processing password', details: hashError.message },
                { status: 500 }
            );
        }

        // Create mentor user with the correctly hashed password
        let user;
        try {
            // Create the user with an explicitly hashed password
            user = await UserModel.create({
                email,
                password: hashedPassword, // Use the password we just hashed
                firstName,
                lastName,
                role: 'MENTOR',
                skills: [],
                expertise: [],
                isProfileComplete: false,
            });
            console.log('Mentor created successfully:', { userId: user._id.toString() });
        } catch (createError) {
            console.error('Error creating mentor:', createError);
            return NextResponse.json(
                { message: 'Error creating mentor', details: createError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: 'Mentor registered successfully',
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Mentor registration error:', error)
        
        // Check for database connection errors
        if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError') {
            console.error('Database connection error:', error)
            if (error.message.includes('ECONNREFUSED')) {
                return NextResponse.json(
                    { message: 'Database connection not configured. Please contact support.' },
                    { status: 500 }
                )
            }
        }

        return NextResponse.json(
            { message: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
} 