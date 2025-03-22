'use client';

import { useRouter } from 'next/navigation';

const Paywall = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Unlock Premium Mentorship
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Get access to verified mentors and exclusive resources to accelerate your growth
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-left">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-4">What You Get</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <svg className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-gray-700">Access to verified expert mentors</p>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-gray-700">Personalized mentor matching</p>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-gray-700">In-house application reviews</p>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-gray-700">Proprietary prep resources</p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-left">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Pro Plan</h3>
                            <div className="mb-4">
                                <p className="text-4xl font-bold text-gray-900">$1100</p>
                                <p className="text-gray-600">for 10 Hours ($110/hour)</p>
                            </div>
                            <ul className="space-y-3 text-gray-600 mb-6">
                                <li>✓ Verified expert mentors</li>
                                <li>✓ Personalized matching</li>
                                <li>✓ Progress tracking</li>
                                <li>✓ Exclusive resources</li>
                            </ul>
                            <button
                                onClick={() => router.push('/auth/signin')}
                                className="w-full bg-indigo-600 text-white rounded-lg px-6 py-3 text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => router.push('/auth/signin')}
                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Paywall; 