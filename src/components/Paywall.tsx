'use client';

import { useRouter } from 'next/navigation';

const Paywall = () => {
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Unlock Premium Mentorship
                    </h2>
                    <p className="text-lg text-gray-600">
                        Choose the plan that best fits your needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic Plan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-600 transition-colors">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
                            <div className="mb-4">
                                <p className="text-3xl font-bold text-gray-900">$600</p>
                                <p className="text-gray-600">for 5 Hours ($120/hour)</p>
                            </div>
                            <ul className="space-y-3 text-gray-600 mb-6 text-left">
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>5 hours of mentorship</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Basic resources access</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Email support</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={() => router.push('/auth/signin')}
                            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-gradient-to-b from-indigo-50 to-white rounded-xl border-2 border-indigo-600 p-6 relative">
                        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                            <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                Most Popular
                            </span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
                            <div className="mb-4">
                                <p className="text-3xl font-bold text-gray-900">$1100</p>
                                <p className="text-gray-600">for 10 Hours ($110/hour)</p>
                            </div>
                            <ul className="space-y-3 text-gray-600 mb-6 text-left">
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>10 hours of mentorship</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Premium resources access</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Priority support</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Mock interviews</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={() => router.push('/auth/signin')}
                            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-600 transition-colors">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                            <div className="mb-4">
                                <p className="text-3xl font-bold text-gray-900">$1500</p>
                                <p className="text-gray-600">for 15 Hours ($100/hour)</p>
                            </div>
                            <ul className="space-y-3 text-gray-600 mb-6 text-left">
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>15 hours of mentorship</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>All premium features</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>24/7 priority support</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Application review</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Custom study plan</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={() => router.push('/auth/signin')}
                            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => router.push('/auth/signin')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Paywall; 