import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import UserModel from '@/models/User'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, confirmPassword, firstName, lastName } = body

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
        
        // Check if password and confirmPassword match
        const passwordsMatch = password === confirmPassword;
        console.log('Passwords match check:', passwordsMatch);
        
        if (!passwordsMatch && confirmPassword !== undefined) {
            console.log('Passwords do not match');
            return NextResponse.json(
                { message: 'Passwords do not match' },
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

        // IMPORTANT: Password hashing is now handled by the model's pre-save hook
        // We should NOT manually hash the password here to avoid double-hashing
        console.log('Creating new mentor - password will be hashed by schema pre-save hook');

        // Create mentor user with the plain password - schema will hash it
        let user;
        try {
            // Create the user with plain password - let the schema handle hashing
            user = await UserModel.create({
                email,
                password, // Use plain password - model's pre-save hook will hash it
                firstName,
                lastName,
                role: 'MENTOR',
                skills: [],
                expertise: [],
                isProfileComplete: false,
                passwordMatch: passwordsMatch || false, // Store password match status for debugging
                signupSource: 'MENTOR_SIGNUP' // Mark as coming from mentor signup
            });
            console.log('Mentor created successfully:', { 
                userId: user._id.toString(),
                passwordMatch: user.passwordMatch 
            });
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