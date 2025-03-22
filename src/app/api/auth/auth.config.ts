import { AuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import MongoDBAdapter from '@/lib/mongodb-adapter'
import dbConnect from '@/lib/mongodb'
import UserModel from '@/models/User'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email?: string | null
            name?: string | null
            image?: string | null
        }
    }
}

export const authOptions: AuthOptions = {
    adapter: MongoDBAdapter(),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Incorrect email or password')
                }

                await dbConnect();
                const user = await UserModel.findOne({ email: credentials.email });

                if (!user || !user.password) {
                    throw new Error('Email address not found')
                }

                const isPasswordValid = await user.comparePassword(credentials.password);

                if (!isPasswordValid) {
                    throw new Error('Incorrect password')
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt' as const,
    },
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && session.user) {
                session.user.id = token.sub!
            }
            return session
        },
    },
} 