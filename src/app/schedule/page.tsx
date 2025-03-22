'use client'

import Link from 'next/link'

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Schedule Your Free Consultation
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Thank you for signing up! We're excited to help you find the perfect mentor.
          </p>
        </div>

        <div className="mt-10 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    This page is a placeholder. In the future, you'll be able to schedule your consultation here.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900">What happens next?</h2>
              <ul className="mt-4 text-left text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mr-3">1</span>
                  <span>Our team will review your profile information</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mr-3">2</span>
                  <span>We'll match you with mentors based on your needs</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mr-3">3</span>
                  <span>You'll receive an email to schedule your consultation</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link href="/mentors" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Browse Mentors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 