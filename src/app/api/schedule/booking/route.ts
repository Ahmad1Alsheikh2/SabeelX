import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DateTime } from 'luxon'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { startTime, endTime, timeZone } = body

        if (!startTime || !endTime || !timeZone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate the times
        const startDateTime = DateTime.fromISO(startTime)
        const endDateTime = DateTime.fromISO(endTime)

        if (!startDateTime.isValid || !endDateTime.isValid) {
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
        }

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                menteeId: session.user.id,
                startTime: startDateTime.toJSDate(),
                endTime: endDateTime.toJSDate(),
                timeZone,
                status: 'PENDING',
                type: 'CONSULTATION'
            }
        })

        return NextResponse.json(booking)
    } catch (error: any) {
        console.error('Error creating booking:', error)
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const role = searchParams.get('role') // 'mentor' or 'mentee'

        const bookings = await prisma.booking.findMany({
            where: role === 'mentor'
                ? { mentorId: session.user.id }
                : { menteeId: session.user.id },
            include: {
                mentor: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                mentee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json(bookings)
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { bookingId, status } = body

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Only allow mentor to update status or mentee to cancel
        if (
            (session.user.id !== booking.mentorId && status !== 'cancelled') ||
            (session.user.id !== booking.menteeId && status === 'cancelled')
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status }
        })

        return NextResponse.json(updatedBooking)
    } catch (error) {
        console.error('Error updating booking:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 