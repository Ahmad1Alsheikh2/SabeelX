import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

// Add paths that don't require profile completion
const publicPaths = [
    '/auth/signin',
    '/auth/signup',
    '/api/auth',
    '/',
    '/about',
    '/mentors'
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

    // Check if profile is complete and the user's role
    const isProfileComplete = token.isProfileComplete as boolean
    const role = token.role as string

    // For mentors with incomplete profiles, always redirect to profile setup, even from dashboard
    if (role === 'MENTOR' && !isProfileComplete) {
        // Only if they're not already on the profile setup page
        if (!pathname.startsWith('/mentor/profile-setup')) {
            return NextResponse.redirect(new URL('/mentor/profile-setup', request.url))
        }
    }

    // For users with complete profiles or non-mentors, allow access to dashboard and profile setup
    if (profileSetupPaths.some(path => pathname.startsWith(path)) || 
        dashboardPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    // For other users (non-mentors) with incomplete profiles
    if (!isProfileComplete) {
        const setupPath = role === 'MENTOR' ? '/mentor/profile-setup' : '/profile/setup'
        if (!pathname.startsWith(setupPath)) {
            return NextResponse.redirect(new URL(setupPath, request.url))
        }
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