'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import AutoLogout from '@/components/AutoLogout'

export default function Dashboard() {
    const { data: session, status, update: updateSession } = useSession()
    const router = useRouter()
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)
    const [upgradeError, setUpgradeError] = useState('')

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true)
            // Start the sign out process but don't wait for redirect
            await signOut({ redirect: false })
            // Use client-side navigation for a smoother transition
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        } finally {
            setIsSigningOut(false)
        }
    }

    const handleUpgradeToMentor = async () => {
        try {
            setIsUpgrading(true)
            setUpgradeError('')

            const response = await fetch('/api/user/upgrade-to-mentor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if (response.ok) {
                // Update the session to reflect the new role
                await updateSession()
                // Redirect to mentor profile setup with a return URL to the schedule page
                router.push('/mentor/profile-setup?returnUrl=/schedule')
            } else {
                setUpgradeError(data.message || 'Failed to upgrade to mentor status')
            }
        } catch (error) {
            console.error('Error upgrading to mentor:', error)
            setUpgradeError('An unexpected error occurred')
        } finally {
            setIsUpgrading(false)
        }
    }

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <AutoLogout />
            <div className="max-w-7xl mx-auto">
                {/* Profile Completion Alert */}
                {!session?.user?.isProfileComplete && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Your profile is incomplete.
                                    <button
                                        onClick={() => router.push('/profile/setup')}
                                        className="ml-2 font-medium underline text-yellow-700 hover:text-yellow-600"
                                    >
                                        Complete your profile now
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Overview */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex items-center">
                        <div className="h-20 w-20 relative rounded-full overflow-hidden bg-gray-100">
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || 'Profile'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, {session?.user?.name || 'User'}!
                            </h1>
                            <p className="text-gray-600">{session?.user?.email}</p>
                            {/* Display role badge */}
                            <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session?.user?.role === 'MENTOR' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                {session?.user?.role === 'MENTOR' ? 'Mentor' : 'User'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Payment Details */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/payment/methods')}
                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Manage Payment Methods
                            </button>
                            <button
                                onClick={() => router.push('/payment/history')}
                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                View Payment History
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Sessions */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Sessions</h2>
                        <div className="space-y-4">
                            {/* Free Consultation Card */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                                    Get Started with a Free Consultation
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Book a free 30-minute consultation with one of our expert mentors to discuss your goals and find the perfect match.
                                </p>
                                <button
                                    onClick={() => router.push('/schedule?type=consultation')}
                                    className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200"
                                >
                                    Schedule Free Consultation
                                </button>
                            </div>

                            {/* Upcoming Sessions List */}
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Your Sessions</h3>
                                <div className="text-center text-gray-500 py-4">
                                    <p>No upcoming sessions</p>
                                    <button
                                        onClick={() => router.push('/mentors')}
                                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Find a Mentor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/profile/setup')}
                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Edit Profile
                            </button>

                            {/* Mentor Upgrade Button - only show if user is not already a mentor */}
                            {session?.user?.role !== 'MENTOR' && (
                                <button
                                    onClick={handleUpgradeToMentor}
                                    disabled={isUpgrading}
                                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpgrading ? 'Upgrading...' : 'Become a Mentor'}
                                </button>
                            )}

                            {/* Show error if upgrade fails */}
                            {upgradeError && (
                                <div className="text-sm text-red-600">{upgradeError}</div>
                            )}

                            <button
                                onClick={() => router.push('/mentors')}
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Browse Mentors
                            </button>
                            <button
                                onClick={() => router.push('/settings')}
                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Settings
                            </button>
                            <button
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="w-full flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSigningOut ? 'Signing out...' : 'Sign Out'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                    <div className="text-center text-gray-500 py-4">
                        <p>No recent activity</p>
                    </div>
                </div>
            </div>
        </div>
    )
}