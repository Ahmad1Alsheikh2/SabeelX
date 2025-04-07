'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { countries } from '@/lib/countries'
import { universities } from '@/lib/universities'
import { admissionsServices } from '@/lib/admissions-services'

export default function MentorProfileSetup() {
    const router = useRouter()
    const [session, setSession] = useState<any>(null)
    const [formData, setFormData] = useState({
        university: '',
        bio: '',
        hourlyRate: '',
        country: '',
        years_of_experience: '',
        image: '',
        serviceCategories: [] as string[],
        focusAreas: [] as string[]
    })
    const [selectedCategory, setSelectedCategory] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        // Check authentication
        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error) throw error

                if (!session) {
                    router.replace('/auth/signin')
                    return
                }

                setSession(session)

                // Get existing profile data
                const { data: profile, error: profileError } = await supabase
                    .from('mentors')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                // Only log errors, don't show them to the user during initial load
                if (profileError && !profileError.message.includes('No rows found')) {
                    console.error('Error loading profile:', profileError)
                }

                if (profile) {
                    setFormData(prev => ({
                        ...prev,
                        university: profile.university || '',
                        bio: profile.bio || '',
                        hourlyRate: profile.hourly_rate?.toString() || '',
                        country: profile.country || '',
                        years_of_experience: profile.years_of_experience?.toString() || '',
                        image: profile.image || '',
                        focusAreas: profile.expertise || []
                    }))
                }
            } catch (err) {
                console.error('Error checking auth:', err)
                router.replace('/auth/signin')
            }
        }

        checkAuth()
    }, [router])

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        if (formData.serviceCategories.includes(category)) {
            // Remove the category and its associated focus areas
            const updatedFocusAreas = formData.focusAreas.filter(area =>
                !admissionsServices.find(cat => cat.name === category)?.focusAreas.includes(area)
            );
            setFormData(prev => ({
                ...prev,
                serviceCategories: prev.serviceCategories.filter(cat => cat !== category),
                focusAreas: updatedFocusAreas
            }));
        } else {
            // Add the category
            setFormData(prev => ({
                ...prev,
                serviceCategories: [...prev.serviceCategories, category]
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
            // Validate that at least one service category is selected
            if (formData.serviceCategories.length === 0) {
                setError('Please select at least one admissions service')
                setIsSubmitting(false)
                return
            }

            // Validate that at least one focus area is selected
            if (formData.focusAreas.length === 0) {
                setError('Please select at least one focus area')
                setIsSubmitting(false)
                return
            }

            if (!session?.user?.id) {
                throw new Error('No authenticated user found')
            }

            console.log('Checking user profile for ID:', session.user.id)

            // First, ensure the user exists in the mentors table
            const { data: existingUsers, error: userCheckError } = await supabase
                .from('mentors')
                .select('*')
                .eq('id', session.user.id)

            if (userCheckError) {
                console.error('Error checking user profile:', userCheckError)
                throw new Error(`Failed to check user profile: ${userCheckError.message}`)
            }

            // Get the first user if multiple exist, or null if none exist
            const existingUser = existingUsers?.[0]

            // If user doesn't exist, create them
            if (!existingUser) {
                console.log('Creating new mentor profile for user:', session.user.id)
                const { error: insertError } = await supabase
                    .from('mentors')
                    .insert({
                        id: session.user.id,
                        email: session.user.email,
                        first_name: session.user.user_metadata?.first_name || '',
                        last_name: session.user.user_metadata?.last_name || '',
                        university: formData.university,
                        expertise: formData.focusAreas,
                        bio: formData.bio,
                        hourly_rate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
                        country: formData.country,
                        years_of_experience: Number(formData.years_of_experience),
                        image: formData.image,
                        is_profile_complete: true,
                        role: 'MENTOR'
                    })

                if (insertError) {
                    console.error('Error creating user:', insertError)
                    throw new Error(`Failed to create user profile: ${insertError.message}`)
                }
                console.log('Successfully created new mentor profile')
            } else {
                // Update mentor profile
                console.log('Updating mentor profile with data:', {
                    university: formData.university,
                    expertise: formData.focusAreas,
                    bio: formData.bio,
                    hourly_rate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
                    country: formData.country,
                    years_of_experience: Number(formData.years_of_experience),
                    image: formData.image,
                    is_profile_complete: true
                })

                const { error: updateError } = await supabase
                    .from('mentors')
                    .update({
                        university: formData.university,
                        expertise: formData.focusAreas,
                        bio: formData.bio,
                        hourly_rate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
                        country: formData.country,
                        years_of_experience: Number(formData.years_of_experience),
                        image: formData.image,
                        is_profile_complete: true
                    })
                    .eq('id', session.user.id)

                if (updateError) {
                    console.error('Error updating profile:', updateError)
                    throw new Error(`Failed to update profile: ${updateError.message}`)
                }
            }

            console.log('Successfully updated mentor profile, redirecting to dashboard')
            // Redirect to mentor dashboard
            router.replace('/mentor/dashboard')
        } catch (err) {
            console.error('Profile update error:', err)
            setError(err instanceof Error ? err.message : 'An error occurred while updating your profile')
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
                        Share your expertise and help others with their admissions journey
                    </p>
                </div>

                <div className="mt-12 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Professional Information */}
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Professional Information</h3>
                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                                        University
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            name="university"
                                            id="university"
                                            required
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                        >
                                            <option value="">Select your university</option>
                                            {universities.map((university) => (
                                                <option key={university} value={university}>
                                                    {university}
                                                </option>
                                            ))}
                                        </select>
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
                                    <label htmlFor="years_of_experience" className="block text-sm font-medium text-gray-700">
                                        Years of Experience
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="years_of_experience"
                                            id="years_of_experience"
                                            required
                                            min="0"
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            value={formData.years_of_experience}
                                            onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Admissions Services */}
                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admissions Services
                                    </label>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {admissionsServices.map((category) => (
                                                <div key={category.name} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={category.name}
                                                        checked={formData.serviceCategories.includes(category.name)}
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

                                        {formData.serviceCategories.length > 0 && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Focus Areas
                                                </label>
                                                {admissionsServices
                                                    .filter(category => formData.serviceCategories.includes(category.name))
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
                                            placeholder="Tell us about your experience and what you can offer as an admissions mentor"
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