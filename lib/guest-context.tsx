'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface GuestSession {
  guestName: string
  guestId: string
  isAuthenticated: boolean
  createdAt: string
  theme?: 'light' | 'dark' | 'auto'
}

interface GuestContextType {
  guest: GuestSession | null
  setGuestName: (name: string) => void
  clearGuest: () => void
  updateGuestTheme: (theme: 'light' | 'dark' | 'auto') => void
  getSessionDuration: () => number
}

const GuestContext = createContext<GuestContextType | undefined>(undefined)

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<GuestSession | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load guest session from localStorage on mount
  useEffect(() => {
    const savedGuest = localStorage.getItem('lifebook_guest_session')
    if (savedGuest) {
      try {
        setGuest(JSON.parse(savedGuest))
      } catch (e) {
        console.log('[v0] Failed to parse saved guest session')
        localStorage.removeItem('lifebook_guest_session')
      }
    }
    setIsLoaded(true)
  }, [])

  const setGuestName = (name: string) => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newGuest: GuestSession = {
      guestName: name.trim(),
      guestId,
      isAuthenticated: false,
      createdAt: new Date().toISOString(),
      theme: 'auto',
    }
    setGuest(newGuest)
    localStorage.setItem('lifebook_guest_session', JSON.stringify(newGuest))
    localStorage.setItem('lifebook_guest_id', guestId)
    console.log('[v0] Guest session created:', guestId)
  }

  const updateGuestTheme = (theme: 'light' | 'dark' | 'auto') => {
    if (guest) {
      const updatedGuest = { ...guest, theme }
      setGuest(updatedGuest)
      localStorage.setItem('lifebook_guest_session', JSON.stringify(updatedGuest))
    }
  }

  const getSessionDuration = () => {
    if (!guest) return 0
    const createdTime = new Date(guest.createdAt).getTime()
    const currentTime = new Date().getTime()
    return Math.floor((currentTime - createdTime) / 1000 / 60) // return minutes
  }

  const clearGuest = () => {
    // Keep user data, only clear session info (they can start fresh or recover data)
    setGuest(null)
    localStorage.removeItem('lifebook_guest_session')
    localStorage.removeItem('lifebook_guest_id')
  }

  if (!isLoaded) {
    return <>{children}</>
  }

  return (
    <GuestContext.Provider
      value={{
        guest,
        setGuestName,
        clearGuest,
        updateGuestTheme,
        getSessionDuration,
      }}
    >
      {children}
    </GuestContext.Provider>
  )
}

export function useGuest() {
  const context = useContext(GuestContext)
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider')
  }
  return context
}
