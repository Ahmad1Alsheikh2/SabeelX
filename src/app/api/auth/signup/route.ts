import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { email, password, firstName, lastName } = await req.json()

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { message: 'Missing required fields' },
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

        // Hash the password
        const hashedPassword = await hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        })

        return NextResponse.json(
            { message: 'User created successfully', userId: user.id },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json(
            {
                message: 'Error creating user',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        )
    }
} 