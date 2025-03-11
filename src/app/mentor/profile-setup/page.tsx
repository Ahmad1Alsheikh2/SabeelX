'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { countries } from '@/lib/countries'
import { expertiseCategories } from '@/lib/expertise-categories'

export default function MentorProfileSetup() {
    const router = useRouter()
    const { data: session, update } = useSession()
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        expertise: '',
        bio: '',
        hourlyRate: '',
        availability: '',
        country: '',
        experience: '',
        image: '',
        expertiseCategories: [] as string[],
        focusAreas: [] as string[]
    })
    const [selectedCategory, setSelectedCategory] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        if (formData.expertiseCategories.includes(category)) {
            // Remove the category and its associated focus areas
            const updatedFocusAreas = formData.focusAreas.filter(area =>
                !expertiseCategories.find(cat => cat.name === category)?.focusAreas.includes(area)
            );
            setFormData(prev => ({
                ...prev,
                expertiseCategories: prev.expertiseCategories.filter(cat => cat !== category),
                focusAreas: updatedFocusAreas
            }));
        } else {
            // Add the category
            setFormData(prev => ({
                ...prev,
                expertiseCategories: [...prev.expertiseCategories, category]
            }));
        }
    };

    const handleFocusAreaChange = (focusArea: string) => {
        const newFocusAreas = formData.focusAreas.includes(focusArea)
            ? formData.focusAreas.filter(area => area !== focusArea)
            : [...formData.focusAreas, focusArea];

        setFormData(prev => ({
            ...prev,
            focusAreas: newFocusAreas
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/mentor/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    expertise: formData.focusAreas
                }),
            })

            if (response.ok) {
                await update({ profileCompleted: true })
                router.push('/dashboard')
            } else {
                const data = await response.json()
                setError(data.details || data.message || 'Something went wrong')
            }
        } catch (err) {
            console.error('Profile update error:', err)
            setError('An error occurred while updating your profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Complete Your Mentor Profile
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Share your expertise and help others grow in their careers
                    </p>
                </div>

                <div className="mt-12 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Professional Information */}
                        <div>
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
                                            required
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                                            required
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            name="country"
                                            id="country"
                                            required
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        >
                                            <option value="">Select a country</option>
                                            {countries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                                        Years of Experience
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="experience"
                                            id="experience"
                                            required
                                            min="0"
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Expertise Categories */}
                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Areas of Expertise
                                    </label>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            {expertiseCategories.map((category) => (
                                                <div key={category.name} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={category.name}
                                                        checked={formData.expertiseCategories.includes(category.name)}
                                                        onChange={() => handleCategoryChange(category.name)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                    />
                                                    <label
                                                        htmlFor={category.name}
                                                        className="ml-2 block text-sm text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                                                    >
                                                        {category.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        {formData.expertiseCategories.length > 0 && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Focus Areas
                                                </label>
                                                {expertiseCategories
                                                    .filter(category => formData.expertiseCategories.includes(category.name))
                                                    .map(category => (
                                                        <div key={category.name} className="mb-6">
                                                            <h4 className="font-medium text-gray-700 mb-2">{category.name}</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {category.focusAreas.map(area => (
                                                                    <button
                                                                        key={area}
                                                                        type="button"
                                                                        onClick={() => handleFocusAreaChange(area)}
                                                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${formData.focusAreas.includes(area)
                                                                            ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                            }`}
                                                                    >
                                                                        {area}
                                                                        <span className="ml-1.5">
                                                                            {formData.focusAreas.includes(area) ? '✓' : '+'}
                                                                        </span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
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
                                            required
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Tell us about your experience and what you can offer as a mentor"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
                                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                                        Hourly Rate (USD)
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            id="hourlyRate"
                                            required
                                            min="0"
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="e.g., 100"
                                            value={formData.hourlyRate}
                                            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
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
                                            required
                                            min="1"
                                            max="168"
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="e.g., 10"
                                            value={formData.availability}
                                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Complete Profile'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 