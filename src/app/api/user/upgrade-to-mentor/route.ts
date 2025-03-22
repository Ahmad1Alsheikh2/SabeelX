import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import UserModel from '@/models/User'
import { authOptions } from '@/app/api/auth/auth.config'

export async function POST(request: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            )
        }
        
        // Connect to database
        await dbConnect()
        
        // Find the user by ID
        const user = await UserModel.findById(session.user.id)
        
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }
        
        // Check if user is already a mentor
        if (user.role === 'MENTOR') {
            return NextResponse.json(
                { message: 'User is already a mentor' },
                { status: 400 }
            )
        }
        
        // Update user to mentor role
        user.role = 'MENTOR'
        user.signupSource = 'USER_SIGNUP' // Keep track that this was upgraded from a regular user
        user.isProfileComplete = false // Reset profile completion status as mentor profile needs different info
        
        await user.save()
        
        return NextResponse.json(
            {
                message: 'User successfully upgraded to mentor',
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    isProfileComplete: user.isProfileComplete
                }
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error upgrading user to mentor:', error)
        
        return NextResponse.json(
            { message: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
} 