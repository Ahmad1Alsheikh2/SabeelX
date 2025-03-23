import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized - No session found' }, { status: 401 })
        }

        // Check if user is a mentor
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        })

        if (!user || user.role !== 'MENTOR') {
            return NextResponse.json({ error: 'Unauthorized - Must be a mentor' }, { status: 401 })
        }

        // First, delete all existing availability slots
        await prisma.mentorAvailability.deleteMany({
            where: {
                mentorId: session.user.id
            }
        })

        const slots = [
            // Monday-Friday morning slots (7-8 AM)
            ...[1, 2, 3, 4, 5].map(day => ({ dayOfWeek: day, startTime: '07:00', endTime: '08:00' })),

            // Monday-Friday evening slots (7-10 PM)
            ...[1, 2, 3, 4, 5].map(day => ({ dayOfWeek: day, startTime: '19:00', endTime: '22:00' })),

            // Weekend slots (7 AM - 5 PM)
            ...[0, 6].map(day => ({ dayOfWeek: day, startTime: '07:00', endTime: '17:00' }))
        ].map(slot => ({
            ...slot,
            timeZone: 'America/New_York',
            mentorId: session.user.id
        }))

        // Create all new availability slots
        const createdSlots = await prisma.mentorAvailability.createMany({
            data: slots
        })

        return NextResponse.json({
            message: 'Availability slots updated successfully',
            created: createdSlots.count
        })
    } catch (error) {
        console.error('Error updating availability slots:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 })
    }
} 