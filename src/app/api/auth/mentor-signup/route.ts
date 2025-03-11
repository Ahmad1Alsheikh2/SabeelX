import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            company,
            title,
            expertise,
            bio,
            hourlyRate,
            availability,
            image
        } = await req.json()

        // Validate required fields
        if (!email || !password || !firstName || !lastName || !company || !title || !expertise || !bio || !hourlyRate || !availability) {
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

        // Validate hourly rate
        if (isNaN(hourlyRate) || hourlyRate < 0) {
            return NextResponse.json(
                { message: 'Please enter a valid hourly rate' },
                { status: 400 }
            )
        }

        // Validate availability
        if (isNaN(availability) || availability < 0 || availability > 168) {
            return NextResponse.json(
                { message: 'Please enter a valid weekly availability (0-168 hours)' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            )
        }

        // Hash the password
        const hashedPassword = await hash(password, 12)

        // Create mentor
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'MENTOR',
                company,
                title,
                bio,
                skills: Array.isArray(expertise) ? expertise : expertise.split(',').map((s: string) => s.trim()),
                hourlyRate: parseFloat(hourlyRate),
                availability: parseInt(availability),
                image,
                isProfileComplete: true,
            },
        })

        return NextResponse.json(
            { message: 'Mentor account created successfully', userId: user.id },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Mentor registration error:', error)
        return NextResponse.json(
            {
                message: 'Error creating mentor account',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        )
    }
} 