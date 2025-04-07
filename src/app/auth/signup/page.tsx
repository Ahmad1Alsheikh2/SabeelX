'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'MENTOR' | 'MENTEE'>('MENTEE')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    const password = formData.password
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
    })
  }, [formData.password])

  const validatePassword = () => {
    return Object.values(passwordRequirements).every(Boolean) &&
      formData.password === formData.confirmPassword
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setShowSuccessMessage(false)

    try {
      if (!validatePassword()) {
        setError('Please ensure all password requirements are met and passwords match')
        setLoading(false)
        return
      }

      // Check if user exists in either table
      const { data: existingMentor } = await supabase
        .from('mentors')
        .select('email')
        .eq('email', formData.email)
        .single()

      const { data: existingMentee } = await supabase
        .from('mentees')
        .select('email')
        .eq('email', formData.email)
        .single()

      if (existingMentor || existingMentee) {
        throw new Error('An account with this email already exists. Please sign in instead.')
      }

      // First, sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: activeTab
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        console.error('Signup error:', signUpError)
        if (signUpError.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.')
        }
        throw new Error(signUpError.message)
      }

      if (!authData.user) {
        throw new Error('No user data returned after signup')
      }

      // Show success message
      setShowSuccessMessage(true)
    } catch (err) {
      console.error('Error in signup:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during signup. Please try again.')
    } finally {
      setLoading(false)
    }
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
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Role Selection Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('MENTEE')}
                className={`
                  whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm
                  ${activeTab === 'MENTEE'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                I want to be a Mentee
              </button>
              <button
                onClick={() => setActiveTab('MENTOR')}
                className={`
                  whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm
                  ${activeTab === 'MENTOR'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                I want to be a Mentor
              </button>
            </nav>
          </div>

          {/* Role Description */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {activeTab === 'MENTEE' ? (
                'As a mentee, you can connect with experienced mentors who will guide you in your learning journey.'
              ) : (
                'As a mentor, you can share your expertise and help others grow in their careers.'
              )}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside">
                  <li className={passwordRequirements.minLength ? 'text-green-600' : 'text-gray-400'}>
                    At least 8 characters
                  </li>
                  <li className={passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-400'}>
                    At least one uppercase letter
                  </li>
                  <li className={passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-400'}>
                    At least one lowercase letter
                  </li>
                  <li className={passwordRequirements.hasNumbers ? 'text-green-600' : 'text-gray-400'}>
                    At least one number
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'MENTOR'
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
              >
                {loading ? 'Creating account...' : `Create ${activeTab === 'MENTOR' ? 'Mentor' : 'Mentee'} account`}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>

          {showSuccessMessage && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    A verification link has been sent to your email address. Please check your inbox and click the link to verify your account.
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}