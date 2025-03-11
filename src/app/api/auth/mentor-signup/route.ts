import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName } = body

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate password requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { message: 'Password does not meet security requirements' },
                { status: 400 }
            )
        }

        // Check if user already exists
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            })

            if (existingUser) {
                return NextResponse.json(
                    { message: 'User already exists' },
                    { status: 400 }
                )
            }
        } catch (dbError: any) {
            console.error('Database connection error:', dbError)
            if (dbError.message.includes('DATABASE_URL')) {
                return NextResponse.json(
                    { message: 'Database connection not configured. Please contact support.' },
                    { status: 500 }
                )
            }
            throw dbError // Re-throw if it's a different error
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user with mentor role
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'MENTOR',
                skills: [], // Initialize empty skills array
                isProfileComplete: false, // Use isProfileComplete instead of profileCompleted
            } as Prisma.UserCreateInput,
        })

        return NextResponse.json(
            { message: 'User created successfully', user: { id: user.id, email: user.email } },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Mentor signup error details:', {
            error: error.message,
            stack: error.stack,
            cause: error.cause
        })
        return NextResponse.json(
            {
                message: 'Error creating user',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        )
    }
} 