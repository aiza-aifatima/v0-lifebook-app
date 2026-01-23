"use client"

import { Label } from "@/components/ui/label"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sparkles, AlertCircle, Loader } from "lucide-react"
import { ValidationFeedback } from "@/components/auth/validation-feedback"
import { mapAuthError, validateEmail, isNetworkError, type ErrorResponse } from '@/lib/auth/error-handler'
import { GoogleSignIn } from '@/components/auth/google-sign-in'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailValidation, setEmailValidation] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)
  const router = useRouter()

  // Real-time email validation
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value && !validateEmail(value)) {
      setEmailValidation('Please enter a valid email address')
    } else {
      setEmailValidation('')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Login attempt started for:', email)

    // Client-side validation
    if (!email) {
      setError(
        mapAuthError(
          new Error('Email is required')
        )
      )
      return
    }

    if (!validateEmail(email)) {
      setError(mapAuthError(new Error('Please enter a valid email address')))
      return
    }

    if (!password) {
      setError(mapAuthError(new Error('Password is required')))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      console.log('[v0] Initiating Supabase authentication')

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error('[v0] Auth error:', authError)
        throw authError
      }

      console.log('[v0] Authentication successful, redirecting to dashboard')
      router.push('/dashboard')
    } catch (err: unknown) {
      console.error('[v0] Login error:', err)
      const mappedError = mapAuthError(err)
      setError(mappedError)

      // Log network errors for monitoring
      if (isNetworkError(err)) {
        console.warn('[v0] Network error detected - user may be offline')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = async () => {
    console.log('[v0] User clicked retry')
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
    }, 500)
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Lifebook</h1>
          <p className="text-muted-foreground mt-1">Level up your real life</p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue your adventure</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign-in Option */}
            <div className="mb-6">
              <GoogleSignIn />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error Alert */}
              <ValidationFeedback error={error} />

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hero@hogwarts.edu"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  aria-invalid={!!emailValidation}
                  className="bg-background/50 disabled:opacity-50"
                />
                {emailValidation && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {emailValidation}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/auth/password-recovery"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 disabled:opacity-50"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity disabled:opacity-70"
                disabled={isLoading || !!emailValidation}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-sm border-t pt-5">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                  Create one
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
          <p>Created by Aiza Fatima (Azauresthic)</p>
          <p>All rights reserved © 2025</p>
        </div>
      </div>
    </div>
  )
}
