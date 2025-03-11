import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

// Add paths that don't require profile completion
const publicPaths = [
    '/auth/signin',
    '/auth/signup',
    '/auth/mentor-signup',
    '/api/auth',
    '/',
    '/about',
    '/mentors'
]

const profileSetupPaths = [
    '/profile/setup',
    '/mentor/profile-setup'
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

    // Allow access to profile setup pages
    if (profileSetupPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    // Check if profile is complete
    const isProfileComplete = token.isProfileComplete as boolean
    const role = token.role as string

    // If profile is not complete, redirect to appropriate setup page
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