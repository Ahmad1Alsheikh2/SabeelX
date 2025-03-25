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
            // Check if user exists in our users table
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!profile) {
                // Create new user profile
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: user.id,
                        email: user.email,
                        first_name: user.user_metadata?.first_name || '',
                        last_name: user.user_metadata?.last_name || '',
                        image_url: user.user_metadata?.avatar_url,
                        is_profile_complete: false
                    });

                if (insertError) {
                    console.error('Error creating user profile:', insertError);
                    return NextResponse.redirect(
                        `${requestUrl.origin}/auth/signin?error=profile_creation_failed`
                    );
                }

                // Redirect to profile setup
                return NextResponse.redirect(`${requestUrl.origin}/profile/setup`);
            }

            // Redirect based on profile completion
            if (profile.is_profile_complete) {
                return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
            } else if (profile.role === 'MENTOR') {
                return NextResponse.redirect(`${requestUrl.origin}/mentor/profile-setup`);
            } else {
                return NextResponse.redirect(`${requestUrl.origin}/profile/setup`);
            }
        }
    }

    // Something went wrong, redirect to sign in
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=callback_failed`);
} 