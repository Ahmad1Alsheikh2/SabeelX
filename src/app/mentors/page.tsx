import Image from 'next/image'
import Link from 'next/link'

// This would typically come from your database
const mentors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'Google',
    expertise: ['React', 'Node.js', 'System Design'],
    rating: 4.9,
    reviews: 24,
    hourlyRate: 150,
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Product Manager',
    company: 'Microsoft',
    expertise: ['Product Strategy', 'UX Design', 'Agile'],
    rating: 4.8,
    reviews: 18,
    hourlyRate: 120,
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  // Add more mock mentors here
]

export default function MentorsPage() {
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
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                  Expertise
                </label>
                <select
                  id="expertise"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>All Skills</option>
                  <option>React</option>
                  <option>Node.js</option>
                  <option>Product Management</option>
                  <option>UX Design</option>
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

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <select
                  id="rating"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>Any Rating</option>
                  <option>4.5+</option>
                  <option>4.0+</option>
                  <option>3.5+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="h-16 w-16 relative rounded-full overflow-hidden">
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-500">{mentor.title}</p>
                  <p className="text-sm text-gray-500">{mentor.company}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {mentor.rating} ({mentor.reviews} reviews)
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">${mentor.hourlyRate}/hour</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 