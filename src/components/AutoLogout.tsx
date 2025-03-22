'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AutoLogout() {
  const { data: session } = useSession()
  const router = useRouter()
  const [lastFocusTime, setLastFocusTime] = useState<number>(Date.now())

  // Store a key in sessionStorage when the window loads or gets focus
  useEffect(() => {
    if (!session) return

    // Set a unique session identifier
    const setSessionId = () => {
      const sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('sabeelx_session_id', sessionId)
      setLastFocusTime(Date.now())
    }

    // Check session when window gets focus
    const handleFocus = () => {
      const currentTime = Date.now()
      const storedFocusTime = lastFocusTime
      
      // If we've been away for more than 2 seconds, check if session storage was cleared
      if (currentTime - storedFocusTime > 2000) {
        const sessionId = sessionStorage.getItem('sabeelx_session_id')
        if (!sessionId) {
          // Session storage was cleared, which means user navigated away
          console.log('User navigated away and back - logging out')
          signOut({ redirect: true, callbackUrl: '/auth/signin?reason=navigation' })
          return
        }
      }
      
      setLastFocusTime(currentTime)
    }

    // Initial setup
    setSessionId()
    
    // Set up event listeners
    window.addEventListener('focus', handleFocus)
    window.addEventListener('pageshow', (event) => {
      // If page is loaded from cache (user navigated back using browser back button)
      if (event.persisted) {
        handleFocus()
      }
    })
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [session, lastFocusTime])

  // Log out on unload
  useEffect(() => {
    if (!session) return
    
    const handleBeforeUnload = () => {
      // Clear the session storage when user leaves the site
      sessionStorage.removeItem('sabeelx_session_id')
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [session])

  // Idle timer logic
  useEffect(() => {
    if (!session) return

    // Set up idle detection - log out after 30 minutes of inactivity
    let inactivityTimer: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        // Sign out after inactivity
        signOut({ redirect: false })
        router.push('/auth/signin?reason=inactivity')
      }, 30 * 60 * 1000) // 30 minutes
    }

    // Reset the timer when there's user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer)
    })
    
    // Initial timer setup
    resetTimer()
    
    return () => {
      clearTimeout(inactivityTimer)
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimer)
      })
    }
  }, [session, router])

  return null
} 