import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        try {
            // Exchange the code for a session
            const { data: { session }, error: sessionError } = await supabaseAdmin.auth.exchangeCodeForSession(code)

            if (sessionError) {
                console.error('Session error:', sessionError)
                return NextResponse.redirect(
                    `${requestUrl.origin}/auth/signin?error=session_error&details=${encodeURIComponent(sessionError.message)}`
                )
            }

            const user = session?.user

            if (!user) {
                return NextResponse.redirect(
                    `${requestUrl.origin}/auth/signin?error=no_user`
                )
            }

            console.log('User verified:', {
                id: user.id,
                email: user.email,
                role: user.user_metadata?.role
            })

            // Check if user already has a profile in either mentors or mentees table
            const { data: mentorProfile } = await supabaseAdmin
                .from('mentors')
                .select('*')
                .eq('id', user.id)
                .single()

            const { data: menteeProfile } = await supabaseAdmin
                .from('mentees')
                .select('*')
                .eq('id', user.id)
                .single()

            if (!mentorProfile && !menteeProfile) {
                // Get the user's role from metadata
                const role = user.user_metadata?.role || 'MENTEE'
                const tableName = role === 'MENTOR' ? 'mentors' : 'mentees'

                console.log('Creating profile for user:', {
                    id: user.id,
                    email: user.email,
                    role,
                    tableName
                })

                // Create new user profile in the appropriate table
                const { error: insertError } = await supabaseAdmin
                    .from(tableName)
                    .insert({
                        id: user.id,
                        email: user.email,
                        first_name: user.user_metadata?.first_name || '',
                        last_name: user.user_metadata?.last_name || '',
                        is_profile_complete: false,
                        role: role
                    })

                if (insertError) {
                    console.error('Error creating user profile:', insertError)
                    return NextResponse.redirect(
                        `${requestUrl.origin}/auth/signin?error=profile_creation_failed&details=${encodeURIComponent(insertError.message)}`
                    )
                }

                // Redirect to appropriate profile setup based on role
                return NextResponse.redirect(
                    role === 'MENTOR'
                        ? `${requestUrl.origin}/mentor/profile-setup`
                        : `${requestUrl.origin}/profile/setup`
                )
            }

            // Redirect based on profile completion and role
            const profile = mentorProfile || menteeProfile
            const isMentor = !!mentorProfile
            const role = isMentor ? 'MENTOR' : 'MENTEE'

            if (profile.is_profile_complete) {
                return NextResponse.redirect(
                    `${requestUrl.origin}/${isMentor ? 'mentor' : ''}/dashboard`
                )
            } else {
                return NextResponse.redirect(
                    `${requestUrl.origin}/${isMentor ? 'mentor' : ''}/profile-setup`
                )
            }
        } catch (error) {
            console.error('Error in callback route:', error)
            return NextResponse.redirect(
                `${requestUrl.origin}/auth/signin?error=callback_error`
            )
        }
    }

    // Return to sign-in page if no code is present
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin`)
} 