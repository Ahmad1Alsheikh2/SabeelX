import { NextAuthOptions } from 'next-auth'
import { User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Extend built-in types
declare module 'next-auth' {
    interface User {
        id: string
        role?: 'MENTOR' | 'MENTEE'
        isProfileComplete?: boolean
    }
    interface Session {
        user: User & {
            role?: 'MENTOR' | 'MENTEE'
            isProfileComplete?: boolean
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: 'MENTOR' | 'MENTEE'
        isProfileComplete?: boolean
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Missing credentials')
                }

                // Sign in with Supabase
                const { data: { user }, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                })

                if (error || !user) {
                    throw new Error(error?.message || 'Invalid credentials')
                }

                // Get user role and profile status
                const { data: mentorProfile } = await supabase
                    .from('mentors')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                const { data: menteeProfile } = await supabase
                    .from('mentees')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                // Determine role and profile completion status
                const role = mentorProfile ? 'MENTOR' : 'MENTEE'
                const isProfileComplete = mentorProfile
                    ? mentorProfile.is_profile_complete
                    : menteeProfile?.is_profile_complete

                return {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name,
                    role,
                    isProfileComplete,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.isProfileComplete = user.isProfileComplete
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role
                session.user.isProfileComplete = token.isProfileComplete
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
} 