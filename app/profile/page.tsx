'use client'

import { useGuest } from '@/lib/guest-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import GuestProfilePageContent from '@/app/guest-profile/page'

export default function ProfilePage() {
  const { guest } = useGuest()
  const router = useRouter()

  useEffect(() => {
    // If guest exists, show guest profile page
    if (guest?.guestName) {
      router.push('/guest-profile')
    }
  }, [guest, router])

  // If guest exists, redirect to guest-profile
  if (guest?.guestName) {
    return null
  }

  // For future authenticated users
  // For now, just show a placeholder that redirects to guest mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-lavender-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
