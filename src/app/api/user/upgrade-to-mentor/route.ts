import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { createClient } from '@supabase/supabase-js'
import { authOptions } from '@/lib/auth'

// Create Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            )
        }

        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        // Update user role in profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'MENTOR' })
            .eq('id', userId)

        if (profileError) {
            console.error('Error updating profile:', profileError)
            return NextResponse.json(
                { error: 'Failed to update user role' },
                { status: 400 }
            )
        }

        // Create mentor profile
        const { error: mentorError } = await supabase
            .from('mentors')
            .insert({
                id: userId,
                role: 'MENTOR',
                is_profile_complete: false
            })

        if (mentorError) {
            console.error('Error creating mentor profile:', mentorError)
            return NextResponse.json(
                { error: 'Failed to create mentor profile' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            message: 'Successfully upgraded to mentor',
            userId
        })
    } catch (error: any) {
        console.error('Upgrade to mentor error:', error)
        return NextResponse.json(
            { error: 'An error occurred while upgrading to mentor' },
            { status: 500 }
        )
    }
} 