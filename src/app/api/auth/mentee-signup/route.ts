import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    try {
        const { email, password, firstName, lastName } = await request.json()

        // Sign up the user with Supabase Auth
        const { data: { user }, error: signUpError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    role: 'MENTEE'
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
            return NextResponse.json(
                { error: 'User creation failed' },
                { status: 400 }
            )
        }

        console.log('Creating mentee profile for user:', user.id)

        // Create mentee profile using admin client
        const { data: profileData, error: profileError } = await supabaseAdmin
            .from('mentees')
            .insert({
                id: user.id,
                email: user.email,
                first_name: firstName,
                last_name: lastName,
                role: 'MENTEE',
                is_profile_complete: false
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
                { error: `Failed to create mentee profile: ${profileError.message}` },
                { status: 400 }
            )
        }

        console.log('Successfully created mentee profile:', profileData)

        return NextResponse.json({
            message: 'Mentee account created successfully. Please check your email for verification link.',
            user: {
                id: user.id,
                email: user.email
            },
            emailSent: true
        })
    } catch (error: any) {
        console.error('Mentee signup error:', error)
        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        )
    }
} 