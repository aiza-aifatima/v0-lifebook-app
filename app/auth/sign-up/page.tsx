'use client'

import type React from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Wand2, AlertCircle, CheckCircle2, Loader } from 'lucide-react'
import {
  mapAuthError,
  validateEmail,
  validatePassword,
  validateUsername,
  isNetworkError,
  type ErrorResponse,
} from '@/lib/auth/error-handler'
import { ValidationFeedback, PasswordStrengthFeedback } from '@/components/auth/validation-feedback'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Validation states
  const [emailValid, setEmailValid] = useState('')
  const [passwordValid, setPasswordValid] = useState('')
  const [usernameValid, setUsernameValid] = useState('')

  const router = useRouter()

  // Real-time email validation
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value && !validateEmail(value)) {
      setEmailValid('Invalid email format')
    } else {
      setEmailValid('')
    }
  }

  // Real-time username validation
  const handleUsernameChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^\w-]/g, '_')
    setUsername(cleaned)
    const validation = validateUsername(cleaned)
    setUsernameValid(validation.error || '')
  }

  // Password strength feedback
  const passwordFeedback = validatePassword(password)

  // Form validation
  const isFormValid =
    validateEmail(email) &&
    password === confirmPassword &&
    validatePassword(password).valid &&
    validateUsername(username).valid &&
    displayName.trim().length > 0

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Sign-up attempt started')

    // Comprehensive validation
    if (!displayName.trim()) {
      setError(mapAuthError(new Error('Display name is required')))
      return
    }

    if (!validateEmail(email)) {
      setError(mapAuthError(new Error('Please enter a valid email address')))
      return
    }

    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      setError(mapAuthError(new Error(usernameValidation.error || 'Invalid username')))
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(
        mapAuthError(
          new Error(
            'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
          )
        )
      )
      return
    }

    if (password !== confirmPassword) {
      setError(mapAuthError(new Error('Passwords do not match')))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      console.log('[v0] Creating account for:', email)

      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
          data: {
            display_name: displayName,
            username: username,
          },
        },
      })

      if (authError) {
        console.error('[v0] Auth error:', authError)
        throw authError
      }

      console.log('[v0] Account created, redirecting to verification page')
      router.push('/auth/sign-up-success')
    } catch (err: unknown) {
      console.error('[v0] Sign-up error:', err)
      const mappedError = mapAuthError(err)
      setError(mappedError)

      if (isNetworkError(err)) {
        console.warn('[v0] Network error during sign-up')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-sky-100 via-lavender-50 to-purple-100">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-amber-300/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Lifebook</h1>
          <p className="text-muted-foreground mt-1">Begin your magical journey</p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-primary/10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-serif">Create Your Account</CardTitle>
            <CardDescription>Set up your profile and start leveling up</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Error Alert */}
              <ValidationFeedback error={error} />

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Harry Potter"
                  autoComplete="name"
                  required
                  disabled={isLoading}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-background/50 disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground">This is how others will see you</p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="the_chosen_one"
                    autoComplete="username"
                    required
                    disabled={isLoading}
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="bg-background/50 disabled:opacity-50 pr-10"
                  />
                  {username && !usernameValid && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                  )}
                </div>
                {usernameValid && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {usernameValid}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">3-30 characters, letters/numbers/underscores</p>
              </div>

              {/* Email */}
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
                  className="bg-background/50 disabled:opacity-50"
                />
                {emailValid && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {emailValid}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 disabled:opacity-50"
                />
                {password && <PasswordStrengthFeedback feedback={passwordFeedback.feedback} isValid={passwordFeedback.valid} />}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/50 disabled:opacity-50 pr-10"
                  />
                  {confirmPassword && password === confirmPassword && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                  )}
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords don't match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity disabled:opacity-70 mt-6"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Sign In Link */}
              <div className="text-center text-sm border-t pt-4">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
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
