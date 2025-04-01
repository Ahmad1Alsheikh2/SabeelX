'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const checkProfileAndRedirect = async (userId: string) => {
    try {
      // Check both mentors and mentees tables
      const { data: mentorProfile } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', userId)
        .single()

      const { data: menteeProfile } = await supabase
        .from('mentees')
        .select('*')
        .eq('id', userId)
        .single()

      // Get user metadata to determine role
      const { data: { user } } = await supabase.auth.getUser()
      const userRole = user?.user_metadata?.role || 'MENTEE'

      if (userRole === 'MENTOR') {
        if (mentorProfile) {
          if (mentorProfile.is_profile_complete) {
            router.replace('/mentor/dashboard')
          } else {
            router.replace('/mentor/profile-setup')
          }
        } else {
          // If no mentor profile exists, redirect to mentor profile setup
          router.replace('/mentor/profile-setup')
        }
      } else {
        if (menteeProfile) {
          if (menteeProfile.is_profile_complete) {
            router.replace('/dashboard')
          } else {
            router.replace('/profile/setup')
          }
        } else {
          // If no mentee profile exists, redirect to mentee profile setup
          router.replace('/profile/setup')
        }
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
      } else if (event === 'SIGNED_OUT') {
        setError('')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('No account found with this email. Please sign up first.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email address before signing in.')
        } else if (error.message.includes('Too many requests')) {
          setError('Too many attempts. Please try again later.')
        } else {
          setError('An error occurred while signing in. Please try again.')
        }
      } else if (data?.user) {
        await checkProfileAndRedirect(data.user.id)
      }
    } catch (err) {
      console.error('Error signing in:', err)
      setError('An error occurred while signing in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                  }
                })}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 