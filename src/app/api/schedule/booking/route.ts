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
        const { mentorId, startTime, endTime, date } = body

        if (!mentorId || !startTime || !endTime || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if the time slot is available
        const existingBooking = await prisma.booking.findFirst({
            where: {
                mentorId,
                date,
                startTime,
                endTime
            }
        })

        if (existingBooking) {
            return NextResponse.json({ error: 'Time slot is already booked' }, { status: 400 })
        }

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                mentorId,
                menteeId: session.user.id,
                date,
                startTime,
                endTime,
                status: 'PENDING'
            }
        })

        return NextResponse.json(booking)
    } catch (error) {
        console.error('Error creating booking:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to create booking'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const mentorId = searchParams.get('mentorId')
        const date = searchParams.get('date')

        if (!mentorId || !date) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
        }

        const bookings = await prisma.booking.findMany({
            where: {
                mentorId,
                date
            }
        })

        return NextResponse.json(bookings)
    } catch (error) {
        console.error('Error fetching bookings:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
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