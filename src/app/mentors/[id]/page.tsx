import Image from 'next/image'

// This would typically come from your database based on the ID
const mentors = {
  1: {
    id: 1,
    name: 'Hamaad Mehal',
    title: 'Co-Founder',
    company: 'SabeelX',
    country: 'USA',
    expertise: ['Healthcare', 'Policy', 'Biology', 'Chemistry', 'Physics', 'Test Prep', 'English'],
    verified: true,
    image: '/founders/hamaad.jpg',
    bio: 'Co-Founder of SabeelX, dedicated to making knowledge accessible to all. Experienced in mentoring students across various disciplines including healthcare, sciences, and test preparation.',
    experience: [
      {
        company: 'SabeelX',
        title: 'Co-Founder',
        duration: '2024 - Present',
      }
    ],
    education: [
      {
        school: 'Harvard College',
        degree: 'B.A. in Social Studies and Chemistry',
        year: '2024',
      }
    ],
  },
  2: {
    id: 2,
    name: 'Ahmad Alsheikh',
    title: 'Co-Founder',
    company: 'SabeelX',
    country: 'USA',
    expertise: ['Healthcare', 'Policy', 'Biology', 'Chemistry', 'Physics', 'Test Prep', 'English'],
    verified: true,
    image: '/founders/ahmad.jpg',
    bio: 'Co-Founder of SabeelX, dedicated to making knowledge accessible to all. Experienced in mentoring students across various disciplines including healthcare, sciences, and test preparation.',
    experience: [
      {
        company: 'SabeelX',
        title: 'Co-Founder',
        duration: '2024 - Present',
      }
    ],
    education: [
      {
        school: 'Harvard College',
        degree: 'B.A. in Government and Chemistry',
        year: '2024',
      }
    ],
  }
}

export default function MentorProfile({ params }: { params: { id: string } }) {
  const mentor = mentors[parseInt(params.id) as keyof typeof mentors]
  if (!mentor) {
    return <div>Mentor not found</div>
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Column - Profile Information */}
        <div className="lg:col-span-8">
          {/* Profile Header */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-24 w-24 relative rounded-full overflow-hidden">
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                    {mentor.verified && (
                      <svg className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-2xl">🇺🇸</span>
                </div>
                <p className="text-lg text-gray-600">{mentor.title}</p>
                <p className="text-lg text-gray-600">{mentor.company}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">About Me</h2>
              <p className="mt-2 text-gray-600">{mentor.bio}</p>
            </div>

            {/* Expertise */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Focus Areas</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {mentor.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
              <div className="mt-2 space-y-4">
                {mentor.experience.map((exp, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-gray-900 font-medium">{exp.company}</p>
                      <p className="text-gray-600">{exp.title}</p>
                    </div>
                    <p className="text-gray-500">{exp.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Education</h2>
              <div className="mt-2 space-y-4">
                {mentor.education.map((edu, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-gray-900 font-medium">{edu.school}</p>
                      <p className="text-gray-600">{edu.degree}</p>
                    </div>
                    <p className="text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Request Form */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900">Request Mentorship</h2>

            <form className="mt-6 space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Tell the mentor about your goals and what you'd like to learn..."
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Session Duration
                </label>
                <select
                  id="duration"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Request Session
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-500 text-center">
              You won't be charged until the mentor accepts your request
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 