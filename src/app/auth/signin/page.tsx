'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const checkProfileAndRedirect = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      if (profile) {
        if (profile.is_profile_complete) {
          router.replace('/dashboard')
        } else if (profile.role === 'MENTOR') {
          router.replace('/mentor/profile-setup')
        } else {
          router.replace('/profile/setup')
        }
      } else {
        // If no profile exists yet, redirect to profile setup
        router.replace('/profile/setup')
      }
    } catch (err) {
      console.error('Error checking profile:', err)
      setError('An error occurred while checking your profile')
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (session?.user?.id) {
          await checkProfileAndRedirect(session.user.id)
        }
      } catch (err) {
        console.error('Error checking session:', err)
        setError('An error occurred while checking your session')
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        await checkProfileAndRedirect(session.user.id)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-4xl font-bold text-indigo-600">
            SabeelX
          </h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4F46E5',
                    brandAccent: '#4338CA'
                  }
                }
              }
            }}
            providers={['google']}
            theme="light"
            socialLayout="horizontal"
            redirectTo={window.location.origin}
            showLinks={true}
            view="sign_in"
          />

          {error && (
            <div className="mt-4 p-3 rounded bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 