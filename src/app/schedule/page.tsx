'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DateTime } from 'luxon'
import { supabase } from '@/lib/supabase'
import Calendar from '@/components/Calendar'

export default function SchedulePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [subscription, setSubscription] = useState<any>(null)

  const mentorId = searchParams.get('mentorId')
  const isConsultation = searchParams.get('type') === 'consultation'

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/signin')
        return
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true)
      setError('')

      try {
        const startDateTime = DateTime.fromJSDate(selectedDate).startOf('day')
        const endDateTime = DateTime.fromJSDate(selectedDate).endOf('day')

        let query = supabase
          .from('mentor_availability')
          .select(`
            *,
            mentor:users!mentor_id (
              id,
              first_name,
              last_name,
              image_url
            )
          `)
          .gte('start_time', startDateTime.toISO())
          .lte('end_time', endDateTime.toISO())
          .not('id', 'in', (sub: any) => {
            return sub
              .from('bookings')
              .select('availability_id')
              .in('status', ['PENDING', 'CONFIRMED'])
          })

        // If specific mentor, filter by mentor_id
        if (mentorId) {
          query = query.eq('mentor_id', mentorId)
        }

        const { data: slots, error: fetchError } = await query

        if (fetchError) throw fetchError

        setAvailableSlots(slots || [])
      } catch (err) {
        console.error('Error fetching availability:', err)
        setError('Failed to load available time slots')
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()

    // Set up real-time subscription
    const subscription = supabase
      .channel('mentor_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentor_availability'
        },
        (payload) => {
          // Refresh availability when changes occur
          fetchAvailability()
        }
      )
      .subscribe()

    setSubscription(subscription)

    return () => {
      // Clean up subscription
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [selectedDate, mentorId, router])

  const handleBookSlot = async (slotId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/signin')
        return
      }

      const { data: slot } = await supabase
        .from('mentor_availability')
        .select('*')
        .eq('id', slotId)
        .single()

      if (!slot) {
        throw new Error('Slot not found')
      }

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          mentor_id: slot.mentor_id,
          mentee_id: session.user.id,
          availability_id: slotId,
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: 'PENDING'
        })

      if (bookingError) throw bookingError

      router.push('/dashboard')
    } catch (err) {
      console.error('Error booking slot:', err)
      setError('Failed to book the slot')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {isConsultation ? 'Book a Consultation' : 'Schedule a Session'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Select a date and available time slot to schedule your session.
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <Calendar
                selectedDate={selectedDate}
                onChange={setSelectedDate}
              />

              {loading ? (
                <div className="mt-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500"></div>
                </div>
              ) : error ? (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="mt-6 text-center text-gray-500">
                  No available slots for this date.
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="focus:outline-none">
                          <p className="text-sm font-medium text-gray-900">
                            {DateTime.fromISO(slot.start_time).toLocaleString(DateTime.TIME_SIMPLE)}
                            {' - '}
                            {DateTime.fromISO(slot.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
                          </p>
                          {slot.mentor && (
                            <p className="text-sm text-gray-500">
                              with {slot.mentor.first_name} {slot.mentor.last_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleBookSlot(slot.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 