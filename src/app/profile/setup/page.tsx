'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ProfileSetup() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [formData, setFormData] = useState({
        bio: '',
        skills: '',
        hourlyRate: '',
        title: '',
        company: '',
        availability: '',
        image: null as File | null,
    })
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (status === 'loading') {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    }

    if (status === 'unauthenticated') {
        router.push('/auth/signin')
        return null
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] })
        }
    }

    const validateForm = () => {
        if (!formData.bio.trim()) {
            setError('Bio is required')
            return false
        }
        if (!formData.title.trim()) {
            setError('Job Title is required')
            return false
        }
        if (!formData.company.trim()) {
            setError('Company is required')
            return false
        }
        if (!formData.hourlyRate || isNaN(parseFloat(formData.hourlyRate)) || parseFloat(formData.hourlyRate) < 0) {
            setError('Please enter a valid hourly rate')
            return false
        }
        if (!formData.availability || isNaN(parseInt(formData.availability)) || parseInt(formData.availability) < 0 || parseInt(formData.availability) > 168) {
            setError('Please enter a valid weekly availability (0-168 hours)')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        if (!validateForm()) {
            setIsSubmitting(false)
            return
        }

        try {
            // First upload the image if one is selected
            let imageUrl = null
            if (formData.image) {
                const imageFormData = new FormData()
                imageFormData.append('file', formData.image)

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: imageFormData,
                })

                if (uploadResponse.ok) {
                    const { url } = await uploadResponse.json()
                    imageUrl = url
                }
            }

            // Update profile
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bio: formData.bio,
                    skills: formData.skills.split(',').map(skill => skill.trim()),
                    hourlyRate: parseFloat(formData.hourlyRate),
                    title: formData.title,
                    company: formData.company,
                    availability: parseInt(formData.availability),
                    image: imageUrl,
                    isProfileComplete: true,
                }),
            })

            if (response.ok) {
                router.push('/dashboard')
            } else {
                const data = await response.json()
                setError(data.message || 'Something went wrong')
            }
        } catch (err) {
            setError('An error occurred while updating your profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Complete Your Profile</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Tell us more about yourself to get started
                    </p>
                </div>

                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Profile Photo
                            </label>
                            <div className="mt-1">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                                Company <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="company"
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                Bio <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="bio"
                                    rows={4}
                                    required
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                                Skills
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="skills"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="e.g., React, Node.js, System Design (comma separated)"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                                Hourly Rate (USD) <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    id="hourlyRate"
                                    required
                                    value={formData.hourlyRate}
                                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="e.g., 100"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                                Weekly Availability (hours) <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    id="availability"
                                    required
                                    value={formData.availability}
                                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="e.g., 10"
                                    min="0"
                                    max="168"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm">{error}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 