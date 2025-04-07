import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { email, password, firstName, lastName } = await request.json()

        console.log('Starting mentor signup process for:', email)

        // First, create the user with regular client
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    role: 'MENTOR'
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
            }
        })

        if (signUpError) {
            console.error('Signup error:', signUpError)
            return NextResponse.json(
                { error: signUpError.message },
                { status: 400 }
            )
        }

        if (!user) {
            console.error('No user returned from signup')
            return NextResponse.json(
                { error: 'User creation failed' },
                { status: 400 }
            )
        }

        console.log('User created successfully:', user.id)

        // Wait a moment to ensure the user is fully created
        await new Promise(resolve => setTimeout(resolve, 2000))

        try {
            // Create mentor profile using admin client
            const { data: profileData, error: profileError } = await supabaseAdmin
                .from('mentors')
                .insert({
                    id: user.id,
                    email: user.email,
                    first_name: firstName,
                    last_name: lastName,
                    role: 'MENTOR',
                    is_profile_complete: false,
                    university: '',
                    bio: '',
                    hourly_rate: null,
                    country: '',
                    years_of_experience: null,
                    image: '',
                    expertise: [],
                    service_categories: []
                })
                .select()
                .single()

            if (profileError) {
                console.error('Profile creation error details:', {
                    error: profileError,
                    user: {
                        id: user.id,
                        email: user.email
                    }
                })
                return NextResponse.json(
                    { error: `Failed to create mentor profile: ${profileError.message}` },
                    { status: 400 }
                )
            }

            console.log('Successfully created mentor profile:', profileData)

            return NextResponse.json({
                message: 'Mentor account created successfully. Please check your email for verification link.',
                user: {
                    id: user.id,
                    email: user.email
                },
                emailSent: true
            })
        } catch (profileError: any) {
            console.error('Profile creation error:', profileError)
            return NextResponse.json(
                { error: `Failed to create mentor profile: ${profileError.message}` },
                { status: 500 }
            )
        }
    } catch (error: any) {
        console.error('Mentor signup error:', error)
        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        )
    }
} 