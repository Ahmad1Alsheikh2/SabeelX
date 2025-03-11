import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function POST(req: Request) {
    try {
        const { email, password, firstName, lastName } = await req.json()

        console.log('Received signup request for:', { email, firstName, lastName })

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
            console.error('Database connection error:', {
                error: dbError.message,
                stack: dbError.stack,
                cause: dbError.cause
            })
            if (dbError.message.includes('DATABASE_URL')) {
                return NextResponse.json(
                    { message: 'Database connection not configured. Please contact support.' },
                    { status: 500 }
                )
            }
            throw dbError // Re-throw if it's a different error
        }

        // Hash the password
        const hashedPassword = await hash(password, 12)

        console.log('Creating new user with data:', {
            email,
            firstName,
            lastName,
            role: 'USER'
        })

        // Create user with isProfileComplete set to false
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'USER',
                isProfileComplete: false,
                skills: [],
            } as Prisma.UserCreateInput,
        })

        console.log('User created successfully:', { userId: user.id })

        return NextResponse.json(
            { message: 'User created successfully', userId: user.id },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Registration error details:', {
            error: error.message,
            stack: error.stack,
            cause: error.cause,
            code: error.code,
            meta: error.meta
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