import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import UserModel from '@/models/User'

export async function POST(request: NextRequest) {
    try {
        console.log('Starting signup process...');
        
        // Parse request body
        let body;
        try {
            body = await request.json();
            console.log('Request body parsed successfully');
        } catch (parseError) {
            console.error('Error parsing request body:', parseError);
            return NextResponse.json(
                { message: 'Invalid request body', details: parseError.message },
                { status: 400 }
            );
        }
        
        const { email, password, confirmPassword, firstName, lastName } = body

        console.log('Received signup request for:', { email, firstName, lastName });

        if (!email || !password || !firstName || !lastName) {
            console.log('Missing required fields:', { 
                email: !!email, 
                password: !!password, 
                firstName: !!firstName, 
                lastName: !!lastName 
            });
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            console.log('Password too short');
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
        console.log('Connecting to MongoDB...');
        try {
            await dbConnect();
            console.log('Connected to MongoDB successfully');
        } catch (dbConnectError) {
            console.error('Database connection error:', dbConnectError);
            return NextResponse.json(
                { message: 'Failed to connect to database', details: dbConnectError.message },
                { status: 500 }
            );
        }

        // Check if user already exists
        console.log('Checking if user already exists...');
        let existingUser;
        try {
            existingUser = await UserModel.findOne({ email });
            console.log('User existence check complete:', { exists: !!existingUser });
        } catch (findError) {
            console.error('Error checking user existence:', findError);
            return NextResponse.json(
                { message: 'Error checking user existence', details: findError.message },
                { status: 500 }
            );
        }

        if (existingUser) {
            console.log('User already exists with email:', email);
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            )
        }

        // IMPORTANT: Password hashing is now handled by the model's pre-save hook
        // We should NOT manually hash the password here to avoid double-hashing
        console.log('Creating new user - password will be hashed by schema pre-save hook');

        // Create user with the plain password - schema will hash it
        let user;
        try {
            // Create the user with plain password - let the schema handle hashing
            user = await UserModel.create({
                email,
                password, // Use plain password - model's pre-save hook will hash it
                firstName,
                lastName,
                role: 'USER',
                skills: [],
                expertise: [],
                isProfileComplete: false,
                passwordMatch: passwordsMatch || false, // Store password match status for debugging
                signupSource: 'USER_SIGNUP' // Mark as coming from regular user signup
            });
            console.log('User created successfully:', { 
                userId: user._id.toString(),
                passwordMatch: user.passwordMatch
            });
        } catch (createError) {
            console.error('Error creating user:', createError);
            return NextResponse.json(
                { message: 'Error creating user', details: createError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: 'User registered successfully',
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
        console.error('Registration error:', error);
        console.error('Error stack:', error.stack);
        
        // Check for database connection errors
        if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError') {
            console.error('Database connection error:', error);
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