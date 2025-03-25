'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfileSetup() {
    const router = useRouter()
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        bio: '',
        phoneNumber: '',
        image: null as File | null,
    })
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
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (profileError) throw profileError

                if (profile) {
                    setFormData(prev => ({
                        ...prev,
                        bio: profile.bio || '',
                        phoneNumber: profile.phone_number || '',
                    }))
                }
            } catch (err) {
                console.error('Error loading profile:', err)
                setError('Failed to load profile data')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
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
        if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
            setError('Please enter a valid phone number')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        if (!validateForm() || !session?.user) {
            setIsSubmitting(false)
            return
        }

        try {
            // First, ensure the user exists in the users table
            const { data: existingUser, error: userCheckError } = await supabase
                .from('users')
                .select('id')
                .eq('id', session.user.id)
                .single()

            if (userCheckError) {
                console.error('Error checking user:', userCheckError)
                // If user doesn't exist, create them
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: session.user.id,
                        email: session.user.email,
                        first_name: session.user.user_metadata?.first_name || '',
                        last_name: session.user.user_metadata?.last_name || '',
                        role: 'USER'
                    })

                if (insertError) {
                    console.error('Error creating user:', insertError)
                    throw new Error('Failed to create user profile')
                }
            }

            let imageUrl = null
            if (formData.image) {
                try {
                    // Upload image to Supabase Storage
                    const fileExt = formData.image.name.split('.').pop()
                    const fileName = `${Math.random()}.${fileExt}`
                    const filePath = `${session.user.id}/${fileName}`

                    const { error: uploadError } = await supabase.storage
                        .from('profile-images')
                        .upload(filePath, formData.image)

                    if (uploadError) {
                        console.error('Error uploading image:', uploadError)
                        throw new Error('Failed to upload profile image')
                    }

                    // Get the public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('profile-images')
                        .getPublicUrl(filePath)

                    imageUrl = publicUrl
                } catch (imageError) {
                    console.error('Image upload failed:', imageError)
                    // Continue without image if upload fails
                }
            }

            // Update user profile
            const updateData: any = {
                bio: formData.bio,
                is_profile_complete: true,
                updated_at: new Date().toISOString()
            }

            // Only add image_url if we have one
            if (imageUrl) {
                updateData.image_url = imageUrl
            }

            // Try updating without phone number first
            let { error: updateError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', session.user.id)

            if (updateError && updateError.message.includes('phone_number')) {
                console.log('Adding phone_number column...')
                // Add the phone_number column
                const { error: alterError } = await supabase
                    .rpc('add_phone_number_column')

                if (alterError) {
                    console.error('Error adding phone_number column:', alterError)
                    throw new Error('Failed to update database schema')
                }

                // Try the update again with phone number
                if (formData.phoneNumber) {
                    updateData.phone_number = formData.phoneNumber
                    const { error: retryError } = await supabase
                        .from('users')
                        .update(updateData)
                        .eq('id', session.user.id)

                    if (retryError) {
                        console.error('Error in retry update:', retryError)
                        throw new Error(`Failed to update profile: ${retryError.message}`)
                    }
                }
            } else if (updateError) {
                console.error('Error updating profile:', updateError)
                throw new Error(`Failed to update profile: ${updateError.message}${updateError.details ? ` - ${updateError.details}` : ''}`)
            }

            router.push('/dashboard')
        } catch (err: any) {
            console.error('Profile update error:', err)
            setError(err.message || 'An error occurred while updating your profile')
            // Log the full error object for debugging
            if (err.error) {
                console.error('Detailed error:', {
                    code: err.error.code,
                    message: err.error.message,
                    details: err.error.details,
                    hint: err.error.hint
                })
            }
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
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number (Optional)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="e.g., +1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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