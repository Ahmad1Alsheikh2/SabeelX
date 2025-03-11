'use client'

import Link from 'next/link'
import Image from 'next/image'
import Features from '@/components/Features'
import { useState } from 'react'

type CategoryType = 'Admissions' | 'Professional Opportunities' | 'Tutoring'
type SubCategoryType = 'College' | 'Business School' | 'Law School' | 'Medical School' | 'Dental School' | 
                      'Masters in Public Health' | 'Masters in Public Policy' | 'PhD' |
                      'Tech' | 'Finance' | 'Consulting' | 'Healthcare' | 'Strategy' | 'Accounting' | 
                      'Marketing' | 'Engineering' | 'Research' | 'Policy' | 'Government' |
                      'Test Prep' | 'Math' | 'Biology' | 'Chemistry' | 'Physics' | 'Computer Science' | 
                      'History' | 'Economics' | 'Social Sciences' | 'English' | 'Arabic'

interface SubCategories {
  Admissions: SubCategoryType[]
  'Professional Opportunities': SubCategoryType[]
  Tutoring: SubCategoryType[]
}

interface CountryOptions {
  [key: string]: string[]
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | ''>('')
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType | ''>('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const categories: CategoryType[] = ['Admissions', 'Professional Opportunities', 'Tutoring']
  
  const subCategories: SubCategories = {
    'Admissions': ['College', 'Business School', 'Law School', 'Medical School', 'Dental School', 'Masters in Public Health', 'Masters in Public Policy', 'PhD'],
    'Professional Opportunities': ['Tech', 'Finance', 'Consulting', 'Healthcare', 'Strategy', 'Accounting', 'Marketing', 'Engineering', 'Research', 'Policy', 'Government'],
    'Tutoring': ['Test Prep', 'Math', 'Biology', 'Chemistry', 'Physics', 'Computer Science', 'History', 'Economics', 'Social Sciences', 'English', 'Arabic']
  }
  
  const countryOptions: CountryOptions = {
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

  const handleCategoryChange = (category: CategoryType | '') => {
    setSelectedCategory(category)
    setSelectedSubCategory('')
    setSelectedCountry('')
  }

  const handleSubCategoryChange = (subCategory: SubCategoryType | '') => {
    setSelectedSubCategory(subCategory)
    setSelectedCountry('')
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 lg:w-1/2 text-white">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Find Your Perfect Mentor
            </h1>
            <p className="mt-6 text-xl leading-8">
              Connect with experienced professionals who can guide you through your educational and career journey.
              Get personalized mentorship to achieve your goals faster.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/about"
                className="text-lg font-semibold leading-6 text-white hover:text-gray-100"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </section>

      {/* Search Bar Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Find Your Mentor</h2>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
              {/* Category Dropdown */}
              <div className="flex-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as CategoryType | '')}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Focus Area Dropdown */}
              <div className="flex-1">
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Focus Area
                </label>
                <select
                  id="subcategory"
                  value={selectedSubCategory}
                  onChange={(e) => handleSubCategoryChange(e.target.value as SubCategoryType | '')}
                  disabled={!selectedCategory}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Focus Area</option>
                  {selectedCategory && subCategories[selectedCategory]?.map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Dropdown */}
              <div className="flex-1">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={!selectedSubCategory}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Country</option>
                  {selectedSubCategory && countryOptions[selectedSubCategory]?.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                href={`/mentors?category=${selectedCategory}&focusArea=${selectedSubCategory}&country=${selectedCountry}`}
                className={`w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-center ${!selectedCountry ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => !selectedCountry && e.preventDefault()}
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <div className="mt-6 max-w-3xl mx-auto">
              <p className="text-xl leading-8 text-gray-600">
                At SabeelX, we believe in making the most important form of human capital - knowledge - accessible to all. We're revolutionizing educational and professional development through personalized mentorship. We connect ambitious individuals with industry-leading mentors, creating a powerful ecosystem where knowledge flows freely and people flourish.
              </p>
              <div className="mt-8">
                <Link
                  href="/mentors"
                  className="inline-flex rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Browse
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-indigo-600">Unlock Opportunity</h3>
                  <p className="mt-2 text-gray-600">
                    Unlock your potential with guidance from our world-class mentors who've walked the path before you. Transform challenges into opportunities for success.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-indigo-600">Foster Connection</h3>
                  <p className="mt-2 text-gray-600">
                    Build lasting relationships that go beyond traditional mentorship. Join a community where collaboration and mutual growth are at the core.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-indigo-600">Drive Innovation</h3>
                  <p className="mt-2 text-gray-600">
                    Stay ahead in your field with cutting-edge insights and practical wisdom from mentors who are shaping the future of their industries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Subscriptions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Select the mentorship plan that aligns with your growth journey
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
              <p className="mt-4 text-gray-600">Access to Unverified Mentors</p>
              <div className="mt-6">
                <p className="text-4xl font-bold text-gray-900">Free<span className="text-lg font-normal text-gray-500"> (Mentor Pricing Varies)</span></p>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="ml-3 text-gray-600">Verified Mentors</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="ml-3 text-gray-600">In-house Essay/Resume/Application Reviews</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="ml-3 text-gray-600">Mentor Matching</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="ml-3 text-gray-600">Proprietary Prep Resources</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-sm border-2 border-indigo-600 p-8 hover:shadow-lg transition-shadow relative">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
              <p className="mt-4 text-gray-600">Premium Mentorship Experience</p>
              <div className="mt-6">
                <p className="text-4xl font-bold text-gray-900">$1100<span className="text-lg font-normal text-gray-500"> for 10 Hours</span></p>
                <p className="mt-2 text-lg text-gray-600">($110/hour)</p>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Verified Mentors</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">High Priority Tutoring</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">In-house Essay/Resume/Application Reviews</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Mentor Matching</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Proprietary Prep Resources</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Expert Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">Expert</h3>
              <p className="mt-4 text-gray-600">Complete Mentorship Package</p>
              <div className="mt-6">
                <p className="text-4xl font-bold text-gray-900">$2000<span className="text-lg font-normal text-gray-500"> for 20 Hours</span></p>
                <p className="mt-2 text-lg text-gray-600">($100/hour)</p>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Verified Mentors</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">High Priority Tutoring</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">In-house Essay/Resume/Application Reviews</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Mentor Matching</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Proprietary Prep Resources</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Diagnostic Exams and Interviews</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Biweekly Progress Tracking Reports</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Access to Proprietary AI College and Professional Consulting Tool</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
