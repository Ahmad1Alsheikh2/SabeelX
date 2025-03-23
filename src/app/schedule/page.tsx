'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DayPicker } from 'react-day-picker'
import { DateTime } from 'luxon'
import AutoLogout from '@/components/AutoLogout'
import 'react-day-picker/dist/style.css'

export default function SchedulePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string>()
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>('')

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate)
    }
  }, [selectedDate, timeZone])

  const fetchAvailability = async (date: Date) => {
    try {
      setLoading(true)
      setError('')

      const startDateTime = DateTime.fromJSDate(date).startOf('day')
      const endDateTime = DateTime.fromJSDate(date).endOf('day')

      if (!startDateTime.isValid || !endDateTime.isValid) {
        throw new Error('Invalid date selected')
      }

      const params = new URLSearchParams({
        startDate: startDateTime.toISO(),
        endDate: endDateTime.toISO()
      })

      const response = await fetch(`/api/schedule/availability?${params}`)
      if (!response.ok) {
        const text = await response.text()
        console.error('API Response:', text)
        throw new Error('Failed to fetch availability')
      }

      const data = await response.json()
      console.log('Received availability data:', data)

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }

      // Process the availability slots
      const availableSlots = data.map(slot => {
        try {
          // Convert times from EST to user's timezone
          const startTime = DateTime.fromFormat(`${startDateTime.toFormat('yyyy-MM-dd')} ${slot.startTime}`, 'yyyy-MM-dd HH:mm', { zone: slot.timeZone })
          const endTime = DateTime.fromFormat(`${startDateTime.toFormat('yyyy-MM-dd')} ${slot.endTime}`, 'yyyy-MM-dd HH:mm', { zone: slot.timeZone })

          // Convert to user's timezone
          const localStartTime = startTime.setZone(timeZone)
          const localEndTime = endTime.setZone(timeZone)

          return {
            id: slot.id,
            startTime: localStartTime.toFormat('HH:mm'),
            endTime: localEndTime.toFormat('HH:mm')
          }
        } catch (err) {
          console.error('Error processing slot:', err, slot)
          return null
        }
      }).filter(Boolean)

      console.log('Processed slots:', availableSlots)
      setAvailableSlots(availableSlots)
    } catch (error) {
      console.error('Error fetching availability:', error)
      setError(error instanceof Error ? error.message : 'Failed to load available time slots')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedSlot || !selectedDate) return

    setLoading(true)
    setError('')

    try {
      const slot = availableSlots.find(s => `${s.startTime}-${s.endTime}` === selectedSlot)
      if (!slot) throw new Error('Invalid slot selected')

      const startDateTime = DateTime.fromFormat(slot.startTime, 'HH:mm', { zone: timeZone })
        .set({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() + 1, day: selectedDate.getDate() })

      const endDateTime = DateTime.fromFormat(slot.endTime, 'HH:mm', { zone: timeZone })
        .set({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() + 1, day: selectedDate.getDate() })

      const response = await fetch('/api/schedule/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: startDateTime.toISO(),
          endTime: endDateTime.toISO(),
          timeZone
        })
      })

      if (!response.ok) {
        throw new Error('Failed to book appointment')
      }

      router.push('/dashboard?booking=success')
    } catch (err) {
      setError('Failed to book appointment')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <AutoLogout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
            Schedule Your Free Consultation
          </h1>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-8 text-center">
            <h2 className="text-xl font-semibold text-indigo-900 mb-2">
              Free 30-Minute Consultation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet with one of our expert mentors to discuss your goals, experience, and find the perfect mentor match for your journey.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Date</h2>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                  className="mx-auto"
                />
              </div>

              {/* Time Slots */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex flex-col gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Select a Time</h2>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">Your timezone:</span>
                    <select
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="flex-1 border rounded-md p-2 bg-white shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {Intl.supportedValuesOf('timeZone').map(tz => {
                        const offset = DateTime.now().setZone(tz).toFormat('ZZZZ')
                        const friendlyName = tz.split('/').pop()?.replace(/_/g, ' ')
                        const displayName = tz === 'Asia/Riyadh' ? 'Riyadh/Jeddah' : friendlyName
                        return (
                          <option key={tz} value={tz}>
                            {displayName} ({offset})
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-600 text-center py-8 rounded-lg">{error}</div>
                ) : !selectedDate ? (
                  <div className="bg-indigo-50 text-indigo-600 text-center py-8 rounded-lg">
                    Please select a date to view available time slots
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="bg-yellow-50 text-yellow-600 text-center py-8 rounded-lg">
                    No available slots for the selected date. Please select a weekend (Saturday or Sunday).
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={`${slot.startTime}-${slot.endTime}`}
                        onClick={() => setSelectedSlot(`${slot.startTime}-${slot.endTime}`)}
                        className={`p-3 text-sm rounded-lg transition-all duration-200 ${selectedSlot === `${slot.startTime}-${slot.endTime}`
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
                          }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}

                {selectedSlot && (
                  <button
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full mt-6 bg-indigo-600 text-white rounded-lg px-6 py-3 text-base font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></span>
                        Booking...
                      </span>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 