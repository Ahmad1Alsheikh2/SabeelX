'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MentorSignupRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the regular signup page
    router.push('/auth/signup?redirect=mentor')
  }, [router])
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Redirecting...
        </h2>
        <p className="mt-4 text-center text-sm text-gray-600">
          Our mentor signup process has changed. You can now sign up as a regular user and upgrade to mentor status from your dashboard.
        </p>
      </div>
    </div>
  )
} 