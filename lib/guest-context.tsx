'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface GuestSession {
  guestName: string
  guestId: string
  isAuthenticated: boolean
}

interface GuestContextType {
  guest: GuestSession | null
  setGuestName: (name: string) => void
  clearGuest: () => void
}

const GuestContext = createContext<GuestContextType | undefined>(undefined)

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<GuestSession | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load guest session from localStorage on mount
  useEffect(() => {
    const savedGuest = localStorage.getItem('lifebook_guest')
    if (savedGuest) {
      try {
        setGuest(JSON.parse(savedGuest))
      } catch (e) {
        console.log('[v0] Failed to parse saved guest session')
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
    }
    setGuest(newGuest)
    localStorage.setItem('lifebook_guest', JSON.stringify(newGuest))
    console.log('[v0] Guest session created:', guestId)
  }

  const clearGuest = () => {
    setGuest(null)
    localStorage.removeItem('lifebook_guest')
  }

  if (!isLoaded) {
    return <>{children}</>
  }

  return (
    <GuestContext.Provider value={{ guest, setGuestName, clearGuest }}>
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
