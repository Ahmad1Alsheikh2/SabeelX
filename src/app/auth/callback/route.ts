import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Error exchanging code for session:', error);
            return NextResponse.redirect(
                `${requestUrl.origin}/auth/signin?error=code_exchange_failed`
            );
        }

        if (!user) {
            return NextResponse.redirect(
                `${requestUrl.origin}/auth/signin?error=no_user`
            );
        }

        try {
            // Check if user already has a profile in either mentors or mentees table
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
                        role: role
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
                    `${requestUrl.origin}/${isMentor ? 'mentor' : ''}/dashboard`
                );
            } else {
                return NextResponse.redirect(
                    `${requestUrl.origin}/${isMentor ? 'mentor' : ''}/profile-setup`
                );
            }
        } catch (error) {
            console.error('Error in callback route:', error);
            return NextResponse.redirect(
                `${requestUrl.origin}/auth/signin?error=callback_error`
            );
        }
    }

    // Return to sign-in page if no code is present
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin`);
} 