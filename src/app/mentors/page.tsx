'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type CategoryType = 'Admissions' | 'Professional Opportunities' | 'Tutoring'
type SubCategoryType = 'College' | 'Business School' | 'Law School' | 'Medical School' | 'Dental School' |
  'Masters in Public Health' | 'Masters in Public Policy' | 'PhD' |
  'Tech' | 'Finance' | 'Consulting' | 'Healthcare' | 'Strategy' | 'Accounting' |
  'Marketing' | 'Engineering' | 'Research' | 'Policy' | 'Government' |
  'Test Prep' | 'Math' | 'Biology' | 'Chemistry' | 'Physics' | 'Computer Science' |
  'History' | 'Economics' | 'Social Sciences' | 'English' | 'Arabic'

const subCategories = {
  'Admissions': ['College', 'Business School', 'Law School', 'Medical School', 'Dental School', 'Masters in Public Health', 'Masters in Public Policy', 'PhD'],
  'Professional Opportunities': ['Tech', 'Finance', 'Consulting', 'Healthcare', 'Strategy', 'Accounting', 'Marketing', 'Engineering', 'Research', 'Policy', 'Government'],
  'Tutoring': ['Test Prep', 'Math', 'Biology', 'Chemistry', 'Physics', 'Computer Science', 'History', 'Economics', 'Social Sciences', 'English', 'Arabic']
}

const countryOptions = {
  'College': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Business School': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'Law School': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Medical School': ['United States', 'United Kingdom', 'Canada', 'Ireland'],
  'Dental School': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Masters in Public Health': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Masters in Public Policy': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'PhD': ['United States', 'United Kingdom', 'Canada', 'Germany'],
  'Tech': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'Finance': ['United States', 'United Kingdom', 'Hong Kong', 'Singapore'],
  'Consulting': ['United States', 'United Kingdom', 'Canada', 'Dubai'],
  'Healthcare': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Strategy': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'Accounting': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'Marketing': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Engineering': ['United States', 'United Kingdom', 'Canada', 'Germany'],
  'Research': ['United States', 'United Kingdom', 'Canada', 'Germany'],
  'Policy': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'Government': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Test Prep': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Math': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'Biology': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Chemistry': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Physics': ['United States', 'United Kingdom', 'Canada', 'Germany'],
  'Computer Science': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'History': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Economics': ['United States', 'United Kingdom', 'Canada', 'Singapore'],
  'Social Sciences': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'English': ['United States', 'United Kingdom', 'Canada', 'Australia'],
  'Arabic': ['United States', 'United Kingdom', 'Canada', 'Dubai']
}

// This would typically come from your database
const mentors = [
  {
    id: 1,
    name: 'Hamaad Mehal',
    title: 'Co-Founder',
    company: 'SabeelX',
    country: 'United States',
    expertise: ['Healthcare', 'Policy', 'Biology', 'Chemistry', 'Physics', 'Test Prep', 'English'],
    verified: true,
    image: '/founders/hamaad.jpg',
  },
  {
    id: 2,
    name: 'Ahmad Alsheikh',
    title: 'Co-Founder',
    company: 'SabeelX',
    country: 'United States',
    expertise: ['Healthcare', 'Policy', 'Biology', 'Chemistry', 'Physics', 'Test Prep', 'English'],
    verified: true,
    image: '/founders/ahmad.jpg',
  },
]

export default function MentorsPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | ''>(searchParams.get('category') as CategoryType || '')
  const [selectedFocusArea, setSelectedFocusArea] = useState<SubCategoryType | ''>(searchParams.get('focusArea') as SubCategoryType || '')
  const [selectedCountry, setSelectedCountry] = useState<string>(searchParams.get('country') || '')

  const handleCategoryChange = (category: CategoryType | '') => {
    setSelectedCategory(category)
    setSelectedFocusArea('')
    setSelectedCountry('')
  }

  const handleFocusAreaChange = (focusArea: SubCategoryType | '') => {
    setSelectedFocusArea(focusArea)
    setSelectedCountry('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:text-4xl sm:tracking-tight">
            Available Mentors
          </h2>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Filters Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as CategoryType)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Professional Opportunities">Professional Opportunities</option>
                  <option value="Tutoring">Tutoring</option>
                </select>
              </div>

              <div>
                <label htmlFor="focusArea" className="block text-sm font-medium text-gray-700">
                  Focus Area
                </label>
                <select
                  id="focusArea"
                  value={selectedFocusArea}
                  onChange={(e) => handleFocusAreaChange(e.target.value as SubCategoryType)}
                  disabled={!selectedCategory}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Focus Areas</option>
                  {selectedCategory && subCategories[selectedCategory]?.map((focusArea) => (
                    <option key={focusArea} value={focusArea}>
                      {focusArea}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={!selectedFocusArea}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Countries</option>
                  {selectedFocusArea && countryOptions[selectedFocusArea]?.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <select
                  id="price"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>Any Price</option>
                  <option>$0 - $50</option>
                  <option>$51 - $100</option>
                  <option>$101 - $150</option>
                  <option>$150+</option>
                </select>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select
                  id="availability"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>Any Time</option>
                  <option>This Week</option>
                  <option>Next Week</option>
                  <option>This Month</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        {mentors.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No mentors available</h3>
            <p className="mt-2 text-sm text-gray-500">Check back later or adjust your filters.</p>
          </div>
        ) : (
          mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 relative rounded-full overflow-hidden">
                    {mentor.image ? (
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-500">
                          {mentor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      {mentor.name}
                      {mentor.verified && (
                        <svg
                          className="ml-2 h-5 w-5 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {mentor.title} at {mentor.company}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">{mentor.country}</span>
                  </div>
                  <Link
                    href={`/mentors/${mentor.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 