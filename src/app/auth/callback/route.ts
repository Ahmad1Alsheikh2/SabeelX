import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createRouteHandlerClient({ cookies });

        // Exchange the code for a session
        await supabase.auth.exchangeCodeForSession(code);

        // Get the user
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Check if user exists in either mentors or mentees table
            const { data: mentorProfile } = await supabase
                .from('mentors')
                .select('*')
                .eq('id', user.id)
                .single();

            const { data: menteeProfile } = await supabase
                .from('mentees')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!mentorProfile && !menteeProfile) {
                // Get the user's role from metadata
                const role = user.user_metadata?.role || 'MENTEE';
                const tableName = role === 'MENTOR' ? 'mentors' : 'mentees';

                // Create new user profile in the appropriate table
                const { error: insertError } = await supabase
                    .from(tableName)
                    .insert({
                        id: user.id,
                        email: user.email,
                        first_name: user.user_metadata?.first_name || '',
                        last_name: user.user_metadata?.last_name || '',
                        is_profile_complete: false
                    });

                if (insertError) {
                    console.error('Error creating user profile:', insertError);
                    return NextResponse.redirect(
                        `${requestUrl.origin}/auth/signin?error=profile_creation_failed`
                    );
                }

                // Redirect to appropriate profile setup
                return NextResponse.redirect(
                    role === 'MENTOR'
                        ? `${requestUrl.origin}/mentor/profile-setup`
                        : `${requestUrl.origin}/profile/setup`
                );
            }

            // Redirect based on profile completion and role
            const profile = mentorProfile || menteeProfile;
            const isMentor = !!mentorProfile;

            if (profile.is_profile_complete) {
                return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
            } else {
                return NextResponse.redirect(
                    isMentor
                        ? `${requestUrl.origin}/mentor/profile-setup`
                        : `${requestUrl.origin}/profile/setup`
                );
            }
        }
    }

    // Something went wrong, redirect to sign in
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=callback_failed`);
} 