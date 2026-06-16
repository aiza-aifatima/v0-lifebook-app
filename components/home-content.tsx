'use client'

import { useGuest } from '@/lib/guest-context'
import { GuestWelcome } from '@/components/guest-welcome'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomeContent() {
  const { guest } = useGuest()
  const router = useRouter()

  useEffect(() => {
    // If guest already has a session, redirect to dashboard
    if (guest?.guestName) {
      router.push('/dashboard')
    }
  }, [guest, router])

  // Show guest welcome if no session exists
  if (!guest?.guestName) {
    return <GuestWelcome />
  }

  // This shouldn't be reached due to redirect, but just in case
  return null
}
