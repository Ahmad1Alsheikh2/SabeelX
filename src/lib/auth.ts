import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

declare module 'next-auth' {
    interface User {
        id: string
        email?: string | null
        name?: string | null
        image?: string | null
        role?: 'MENTOR' | 'MENTEE'
        isProfileComplete?: boolean
        subscribed?: boolean
        firstName?: string
        lastName?: string
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
        subscribed?: boolean
        firstName?: string
        lastName?: string
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user?.password) {
                    throw new Error('Invalid credentials')
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials')
                }

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isProfileComplete: user.isProfileComplete,
                    subscribed: user.subscribed
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            profile: (profile: any) => {
                return {
                    id: profile.id,
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    image: profile.image,
                    role: 'MENTEE' as const,
                    isProfileComplete: false,
                    subscribed: false
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isProfileComplete: user.isProfileComplete,
                    subscribed: user.subscribed
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    firstName: token.firstName,
                    lastName: token.lastName,
                    isProfileComplete: token.isProfileComplete,
                    subscribed: token.subscribed
                }
            }
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
}