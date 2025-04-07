import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add paths that don't require profile completion
const publicPaths = [
    '/auth/signin',
    '/auth/signup',
    '/api/auth',
    '/',
    '/about',
    '/mentors',
    '/schedule'
]

const profileSetupPaths = [
    '/profile/setup',
    '/mentor/profile-setup'
]

const dashboardPaths = [
    '/dashboard',
    '/mentor/dashboard'
]

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const { pathname } = request.nextUrl

    // Allow public paths
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    try {
        // Get user profile from Supabase
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', token.sub)
            .single()

        if (error) throw error

        // Check if profile is complete and the user's role
        const isProfileComplete = profile?.is_profile_complete || false
        const role = profile?.role || 'USER'

        // For mentors with incomplete profiles, always redirect to mentor profile setup
        if (role === 'MENTOR' && !isProfileComplete) {
            // Only if they're not already on the mentor profile setup page
            if (!pathname.startsWith('/mentor/profile-setup')) {
                return NextResponse.redirect(new URL('/mentor/profile-setup', request.url))
            }
        }

        // For mentees with incomplete profiles, always redirect to mentee profile setup
        if (role === 'USER' && !isProfileComplete) {
            // Only if they're not already on the mentee profile setup page
            if (!pathname.startsWith('/profile/setup')) {
                return NextResponse.redirect(new URL('/profile/setup', request.url))
            }
        }
    } catch (error) {
        console.error('Error in middleware:', error)
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
} 