import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createRouteHandlerClient({ cookies });

        try {
            // Exchange the code for a session
            const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
            if (sessionError) {
                console.error('Session exchange error:', sessionError);
                return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=session_error`);
            }

            // Get the user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error('User fetch error:', userError);
                return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=user_fetch_error`);
            }

            // Check if user exists in either mentors or mentees table
            const { data: mentorProfile, error: mentorError } = await supabase
                .from('mentors')
                .select('*')
                .eq('id', user.id)
                .single();

            const { data: menteeProfile, error: menteeError } = await supabase
                .from('mentees')
                .select('*')
                .eq('id', user.id)
                .single();

            if (mentorError && !mentorError.message.includes('No rows found')) {
                console.error('Mentor profile check error:', mentorError);
            }
            if (menteeError && !menteeError.message.includes('No rows found')) {
                console.error('Mentee profile check error:', menteeError);
            }

            if (!mentorProfile && !menteeProfile) {
                // Get the user's role from metadata
                const role = user.user_metadata?.role || 'MENTEE';
                const tableName = role === 'MENTOR' ? 'mentors' : 'mentees';

                console.log('Creating profile for user:', {
                    id: user.id,
                    email: user.email,
                    role,
                    tableName
                });

                // Create new user profile in the appropriate table
                const { error: insertError } = await supabase
                    .from(tableName)
                    .insert({
                        id: user.id,
                        email: user.email,
                        first_name: user.user_metadata?.first_name || '',
                        last_name: user.user_metadata?.last_name || '',
                        is_profile_complete: false,
                        role: role // Add role to the profile
                    });

                if (insertError) {
                    console.error('Error creating user profile:', insertError);
                    return NextResponse.redirect(
                        `${requestUrl.origin}/auth/signin?error=profile_creation_failed&details=${encodeURIComponent(insertError.message)}`
                    );
                }

                // Redirect to appropriate profile setup based on role
                return NextResponse.redirect(
                    role === 'MENTOR'
                        ? `${requestUrl.origin}/mentor/profile-setup`
                        : `${requestUrl.origin}/profile/setup`
                );
            }

            // Redirect based on profile completion and role
            const profile = mentorProfile || menteeProfile;
            const isMentor = !!mentorProfile;
            const role = isMentor ? 'MENTOR' : 'MENTEE';

            if (profile.is_profile_complete) {
                return NextResponse.redirect(
                    role === 'MENTOR'
                        ? `${requestUrl.origin}/mentor/dashboard`
                        : `${requestUrl.origin}/dashboard`
                );
            } else {
                return NextResponse.redirect(
                    role === 'MENTOR'
                        ? `${requestUrl.origin}/mentor/profile-setup`
                        : `${requestUrl.origin}/profile/setup`
                );
            }
        } catch (error) {
            console.error('Unexpected error in callback:', error);
            return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=callback_error`);
        }
    }

    // Something went wrong, redirect to sign in
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=callback_failed`);
} 