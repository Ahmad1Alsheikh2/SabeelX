export default function MentorSignup() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Apply to be a Mentor
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Share your expertise and help others grow in their careers
          </p>
        </div>

        <div className="mt-12 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                    Profile photo
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="pt-8">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Professional Information</h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Current Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                    Areas of Expertise
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="expertise"
                      id="expertise"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., React, Node.js, System Design (comma separated)"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Tell us about your experience and what you can offer as a mentor"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mentorship Preferences */}
            <div className="pt-8">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Mentorship Preferences</h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate (USD)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="hourly_rate"
                      id="hourly_rate"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                    Weekly Availability (hours)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="availability"
                      id="availability"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 