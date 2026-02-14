'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGuest } from '@/lib/guest-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles } from 'lucide-react'

export function GuestWelcome() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setGuestName } = useGuest()

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Please enter your name')
      return
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    if (trimmedName.length > 50) {
      setError('Name must be less than 50 characters')
      return
    }

    setIsLoading(true)
    console.log('[v0] Creating guest session for:', trimmedName)

    try {
      // Create guest session
      setGuestName(trimmedName)

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300))

      console.log('[v0] Guest session created, redirecting to dashboard')
      router.push('/dashboard')
    } catch (err) {
      console.error('[v0] Error creating guest session:', err)
      setError('Failed to start. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-sky-100 via-lavender-50 to-purple-100">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground">Lifebook</h1>
          <p className="text-muted-foreground mt-2 text-lg">Level up your real life</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 p-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Welcome, Hero!</h2>
            <p className="text-muted-foreground">
              Start your adventure by telling us your name
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleContinue} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError('')
                }}
                disabled={isLoading}
                className="bg-background/50 text-lg py-6"
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}
            </div>

            {/* Start Button */}
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-base font-semibold py-6 disabled:opacity-50"
            >
              {isLoading ? 'Starting Adventure...' : 'Start Your Adventure'}
            </Button>

            {/* Info Section */}
            <div className="mt-6 pt-6 border-t border-primary/10 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>All your data is saved locally on your device</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>No sign-up or login required</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Start immediately and begin your adventure</span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>No account needed • Your progress is saved locally</p>
          <p className="mt-2">Created by Aiza Fatima (Azauresthic)</p>
        </div>
      </div>
    </div>
  )
}
