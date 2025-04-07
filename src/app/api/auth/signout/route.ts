import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
    try {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Error signing out from Supabase:', error)
        }

        // Clear the session cookie
        const response = NextResponse.json({ success: true })
        response.cookies.delete('next-auth.session-token')
        response.cookies.delete('next-auth.callback-url')
        response.cookies.delete('next-auth.csrf-token')

        return response
    } catch (error) {
        console.error('Error during sign out:', error)
        return NextResponse.json(
            { error: 'Failed to sign out' },
            { status: 500 }
        )
    }
} 