import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function PUT(request: Request) {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        // Get the current user's session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session?.user?.id) {
            console.error('Session error:', sessionError)
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Verify the user is a mentor
        const { data: mentorProfile, error: mentorError } = await supabase
            .from('mentors')
            .select('id')
            .eq('id', session.user.id)
            .single()

        if (mentorError || !mentorProfile) {
            console.error('Mentor verification error:', mentorError)
            return NextResponse.json({ message: 'User is not a mentor' }, { status: 403 })
        }

        const body = await request.json()
        const {
            university,
            expertise,
            bio,
            hourlyRate,
            country,
            experience,
            image
        } = body

        // Validate required fields
        if (!university || !expertise || !bio || !country || !experience) {
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

        if (isNaN(Number(experience))) {
            return NextResponse.json(
                { message: 'Experience must be a number' },
                { status: 400 }
            )
        }

        // Update mentor profile
        const { data: updatedProfile, error: updateError } = await supabase
            .from('mentors')
            .update({
                university,
                expertise: Array.isArray(expertise) ? expertise : [expertise],
                bio,
                hourly_rate: hourlyRate ? Number(hourlyRate) : null,
                country,
                experience: Number(experience),
                image,
                is_profile_complete: true
            })
            .eq('id', session.user.id)
            .select()
            .single()

        if (updateError) {
            console.error('Profile update error:', updateError)
            return NextResponse.json(
                { message: 'Failed to update profile', details: updateError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedProfile.id,
                email: updatedProfile.email
            }
        })
    } catch (error: any) {
        console.error('Profile update error:', error)
        return NextResponse.json(
            { message: 'An error occurred while updating your profile', details: error.message },
            { status: 500 }
        )
    }
} 