import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '../../auth/auth.config'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            )
        }

        const {
            bio,
            skills,
            hourlyRate,
            title,
            company,
            availability,
            image,
            isProfileComplete
        } = await req.json()

        // Validate bio field (required for all users)
        if (!bio) {
            return NextResponse.json(
                { message: 'Bio is required' },
                { status: 400 }
            )
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                bio,
                skills: Array.isArray(skills) ? skills : skills?.split(',').map((s: string) => s.trim()),
                hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
                title,
                company,
                availability: availability ? parseInt(availability) : undefined,
                image,
                isProfileComplete: true,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error: any) {
        console.error('Profile update error:', error)
        return NextResponse.json(
            { message: 'Error updating profile' },
            { status: 500 }
        )
    }
} 