import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // First get the user ID using the email from the session
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        const body = await request.json()
        const {
            title,
            company,
            expertise,
            bio,
            hourlyRate,
            availability,
            country,
            experience,
            image
        } = body

        // Validate required fields
        if (!title || !company || !expertise || !bio || !country || !experience) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate numeric fields
        if (hourlyRate && isNaN(Number(hourlyRate))) {
            return NextResponse.json(
                { message: 'Hourly rate must be a number' },
                { status: 400 }
            )
        }

        if (availability && isNaN(Number(availability))) {
            return NextResponse.json(
                { message: 'Availability must be a number' },
                { status: 400 }
            )
        }

        if (isNaN(Number(experience))) {
            return NextResponse.json(
                { message: 'Experience must be a number' },
                { status: 400 }
            )
        }

        console.log('Updating user profile with:', {
            userId: user.id,
            expertise: Array.isArray(expertise) ? expertise : [expertise]
        })

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                title,
                company,
                expertise: Array.isArray(expertise) ? expertise : [expertise],
                bio,
                hourlyRate: hourlyRate ? Number(hourlyRate) : null,
                availability: availability ? Number(availability) : null,
                country,
                experience: Number(experience),
                image,
                isProfileComplete: true
            }
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email
            }
        })
    } catch (error: any) {
        console.error('Profile update error:', {
            error: error.message,
            stack: error.stack,
            cause: error.cause
        })
        return NextResponse.json(
            {
                message: 'Error updating profile',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        )
    }
} 