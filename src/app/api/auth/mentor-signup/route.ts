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

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create mentor user
        const user = await UserModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: 'MENTOR',
            skills: [],
            expertise: [],
            isProfileComplete: false,
        })

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