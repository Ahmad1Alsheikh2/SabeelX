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
        
        const { email, password, firstName, lastName } = body

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

        console.log('Creating new user with data:', {
            email,
            firstName,
            lastName,
            role: 'USER'
        });

        // Create user with the correctly hashed password
        let user;
        try {
            // Create the user with an explicitly hashed password
            user = await UserModel.create({
                email,
                password: hashedPassword, // Use the password we just hashed
                firstName,
                lastName,
                role: 'USER',
                skills: [],
                expertise: [],
                isProfileComplete: false,
            });
            console.log('User created successfully:', { userId: user._id.toString() });
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