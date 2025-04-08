import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DateTime } from 'luxon'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        if (!startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
        }

        try {
            const startDateTime = DateTime.fromISO(startDate)
            if (!startDateTime.isValid) {
                throw new Error('Invalid start date format')
            }
            const dayOfWeek = startDateTime.weekday % 7 // Convert from Luxon's 1-7 to our 0-6

            // Check if it's a weekend (6 = Saturday, 0 = Sunday)
            const isWeekend = dayOfWeek === 6 || dayOfWeek === 0

            if (isWeekend) {
                // Generate slots from 7 AM to 5 PM EST
                const availableSlots = [];
                for (let hour = 7; hour < 17; hour++) {
                    availableSlots.push({
                        id: `slot-${hour}`,
                        startTime: `${hour.toString().padStart(2, '0')}:00`,
                        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
                        timeZone: 'America/New_York',
                        mentor: {
                            id: 'default',
                            firstName: 'Available',
                            lastName: 'Mentor',
                            role: 'MENTOR'
                        }
                    });
                }

                return NextResponse.json(availableSlots);
            }

            // For non-weekend days, return empty array
            return NextResponse.json([])

        } catch (error) {
            console.error('Error processing date:', error)
            const errorMessage = error instanceof Error ? error.message : 'Invalid date format'
            return NextResponse.json({ error: errorMessage }, { status: 400 })
        }
    } catch (error) {
        console.error('Error fetching availability:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch availability'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'MENTOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { dayOfWeek, startTime, endTime, timeZone } = body

        const availability = await prisma.mentorAvailability.create({
            data: {
                mentorId: session.user.id,
                dayOfWeek,
                startTime,
                endTime,
                timeZone
            }
        })

        return NextResponse.json(availability)
    } catch (error) {
        console.error('Error creating availability:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to create availability'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
} 