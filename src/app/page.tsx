import Link from 'next/link'
import Image from 'next/image'
import Features from '@/components/Features'

export default function Home() {
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
              Connect with experienced professionals who can guide you through your career journey.
              Get personalized mentorship to achieve your goals faster.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/mentors"
                className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-gray-100"
              >
                Browse Mentors
              </Link>
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

      {/* Features Section */}
      <Features />
    </div>
  )
}
