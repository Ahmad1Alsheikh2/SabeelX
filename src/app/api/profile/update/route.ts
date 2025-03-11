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

        // Validate required fields
        if (!bio || !title || !company || !hourlyRate || !availability) {
            return NextResponse.json(
                { message: 'Please fill in all fields' },
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

        const user = await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                bio,
                skills: Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim()),
                hourlyRate: parseFloat(hourlyRate),
                title,
                company,
                availability: parseInt(availability),
                image,
                isProfileComplete: true,
            },
        })

        return NextResponse.json(user)
    } catch (error: any) {
        console.error('Profile update error:', error)
        return NextResponse.json(
            { message: 'Error updating profile' },
            { status: 500 }
        )
    }
} 