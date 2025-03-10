'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

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
            <div className="max-w-7xl mx-auto">
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
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Stats */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Sessions</p>
                                <p className="text-2xl font-semibold text-gray-900">0</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Hours Mentored</p>
                                <p className="text-2xl font-semibold text-gray-900">0</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Average Rating</p>
                                <p className="text-2xl font-semibold text-gray-900">N/A</p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Sessions */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Sessions</h2>
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