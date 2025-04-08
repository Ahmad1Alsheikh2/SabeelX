'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function UpdateAvailability() {
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState('')

    useEffect(() => {
        if (session?.user?.id) {
            console.log('Your Mentor ID:', session.user.id)
        }
    }, [session])

    // Redirect if not authenticated or not a mentor
    useEffect(() => {
        if (sessionStatus === 'unauthenticated') {
            router.push('/auth/signin')
        } else if (session?.user?.role !== 'MENTOR') {
            router.push('/dashboard')
        }
    }, [session, sessionStatus, router])

    const updateAvailability = async () => {
        setStatus('loading')
        setError('')

        try {
            const response = await fetch('/api/schedule/availability/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}) // Empty object as we don't need to send any data
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setStatus('success')
            setTimeout(() => {
                router.push('/mentor/dashboard')
            }, 2000)
        } catch (error) {
            console.error('Error updating availability:', error)
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('An unexpected error occurred')
            }
            setStatus('error')
        }
    }

    // Show loading state while checking session
    if (sessionStatus === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    // Only render the main content if user is authenticated and is a mentor
    if (sessionStatus === 'authenticated' && session?.user?.role === 'MENTOR') {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Update Availability Schedule</h1>

                            <div className="space-y-4 mb-6">
                                <h2 className="text-lg font-medium text-gray-900">New Schedule:</h2>
                                <div className="space-y-2 text-gray-600">
                                    <p><strong>Monday - Friday:</strong></p>
                                    <ul className="list-disc list-inside ml-4">
                                        <li>7:00 AM - 8:00 AM EST</li>
                                        <li>7:00 PM - 10:00 PM EST</li>
                                    </ul>

                                    <p className="mt-2"><strong>Saturday & Sunday:</strong></p>
                                    <ul className="list-disc list-inside ml-4">
                                        <li>7:00 AM - 5:00 PM EST</li>
                                    </ul>
                                </div>
                            </div>

                            {status === 'success' ? (
                                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                    <p className="text-green-700">
                                        Availability updated successfully! Redirecting to dashboard...
                                    </p>
                                </div>
                            ) : status === 'error' ? (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            ) : null}

                            <button
                                onClick={updateAvailability}
                                disabled={status === 'loading'}
                                className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center justify-center">
                                        <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></span>
                                        Updating...
                                    </span>
                                ) : (
                                    'Update Availability'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
} 