// About Us Page
import Image from 'next/image'
import React from 'react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center text-white">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              About SabeelX
            </h1>
            <p className="mt-6 text-xl leading-8 max-w-3xl mx-auto">
              Transforming careers and lives through meaningful connections.
              We're building bridges between talented students and brilliant mentors, between aspiring professionals and industry leaders.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </section>

      {/* Founders Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Founders
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
            <div className="text-center">
              <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/founders/hamaad.jpg"
                  alt="Hamaad Mehal"
                  width={160}
                  height={160}
                  className="object-cover"
                  priority
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Hamaad Mehal</h3>
              <p className="text-indigo-600">Co-Founder</p>
              <p className="mt-2 text-gray-600 max-w-sm mx-auto">
                I am a recent graduate of Harvard College holding a degree in Social Studies and Chemistry with Honors. I am passionate about democratizing access to knowledge and creating opportunities for growth for students and aspiring professionals alike.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/founders/ahmad.jpg"
                  alt="Ahmad Alsheikh"
                  width={160}
                  height={160}
                  className="object-cover"
                  priority
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Ahmad Alsheikh</h3>
              <p className="text-indigo-600">Co-Founder</p>
              <p className="mt-2 text-gray-600 max-w-sm mx-auto">
                I am a recent graduate of Harvard College holding a degree in Government and Chemistry with Honors. I am a technology innovator dedicated to building impactful solutions that empower mentors and mentees worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Story
            </h2>
            <div className="mt-6 max-w-3xl mx-auto">
              <p className="text-xl leading-8 text-gray-600">
                SabeelX was born from a simple observation: the power of mentorship and human knowledge to transform lives.
                We recognized that while talent is universal, opportunities often aren't. Our platform bridges this gap,
                connecting ambitious individuals with experienced mentors who can guide them toward success.
                We were fortunate to get exposure to a lot of great networks with many brilliant mentors. <strong>Our mission is to deliver this to the world.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-indigo-600 mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Excellence</h3>
              <p className="mt-4 text-gray-600">
                We strive for excellence in every interaction, ensuring the highest quality mentorship experience.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-indigo-600 mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Knowledge</h3>
              <p className="mt-4 text-gray-600">
                We believe in the transformative power of shared knowledge and expertise to create lasting impact.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-indigo-600 mb-4">
                <svg className="h-8 w-8" viewBox="0 0 489.486 489.486" fill="currentColor">
                  <path d="M471.073,2.673c-98.5-11.5-149.6,16.1-176.2,44.8c-50,53.9-42,155.8-53.2,193.9c-19.3,18-32.6,40.9-42.7,64.8 c-5.6-10.5-12.4-20.2-20.9-28.3c-9.6-96.6-22.9-114.6-36.5-130.3c-18.8-20.8-57.8-40-123-32.3c-7.3,0-13.5,5.2-16.7,11.5 c-3.1,7.3-2.1,14.6,2.1,20.8c11.5,14.6,20.8,31.3,28.1,47.9c2.1,4.2,20.3,56.3,46.9,74c11.5,9.4,24.7,15.9,37.5,18.8 c42.9,9.7,56.3,52.1,62.5,74l-11.5,104.2c-1,11.5,6.3,21.9,17.7,22.9c11.2,1.2,20-7.3,20.8-17.7c9.8-117,33.3-174,65.7-202.2 c12.5-12,35.4-20.8,50-26.1c17.7-7.3,36.9-15.5,54.2-27.1c38-25.6,63.6-101.1,66.7-107.3c11.5-26.1,26.1-51.1,42.7-74 C497.773,14.373,478.773,1.773,471.073,2.673z M74.973,191.273c-2.1-4.2-13.5-28.1-17.7-36.5c58.6-1.2,66.7,42.7,70.9,56.3 c2.1,8.3,4.2,25,6.3,40.6C132.273,251.673,93.973,246.673,74.973,191.273z M398.073,110.973c-28.8,55.5-22.5,72.9-111.5,102.1 c6.8-83.3,26.1-125.1,39.6-140.7c13.5-14.5,49.7-36.2,107.3-32.2C424.173,56.873,401.173,104.773,398.073,110.973z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Growth</h3>
              <p className="mt-4 text-gray-600">
                We foster continuous learning and development, helping individuals reach their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Impact
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-indigo-600">500+</p>
              <p className="mt-2 text-lg text-gray-600">Successful Mentorships</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">50+</p>
              <p className="mt-2 text-lg text-gray-600">Industry Experts</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">95%</p>
              <p className="mt-2 text-lg text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Join Our Journey
          </h2>
          <p className="mt-6 text-xl leading-8 text-white max-w-3xl mx-auto">
            Whether you're looking to grow your career or share your expertise,
            we invite you to be part of our mission to make quality mentorship accessible to all.
          </p>
          <div className="mt-10">
            <a
              href="/auth/signup"
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-gray-100"
            >
              Sign Up
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 