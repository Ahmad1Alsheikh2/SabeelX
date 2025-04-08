import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'MENTOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { availabilities } = body

        if (!Array.isArray(availabilities)) {
            return NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
        }

        const createdAvailabilities = await Promise.all(
            availabilities.map(async (availability) => {
                const { dayOfWeek, startTime, endTime, timeZone } = availability
                return prisma.mentorAvailability.create({
                    data: {
                        mentorId: session.user.id,
                        dayOfWeek,
                        startTime,
                        endTime,
                        timeZone
                    }
                })
            })
        )

        return NextResponse.json(createdAvailabilities)
    } catch (error) {
        console.error('Error creating batch availability:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to create batch availability'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
} 