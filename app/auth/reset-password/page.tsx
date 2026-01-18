'use client'

import type React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Sparkles, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { resetPasswordWithOTP } from '@/lib/auth/otp-service'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hasValidOTP, setHasValidOTP] = useState(false)
  const router = useRouter()

  // Check if user has valid OTP from previous step
  useEffect(() => {
    const resetUserId = sessionStorage.getItem('resetUserId')
    if (!resetUserId) {
      setError('No valid OTP session. Please start over.')
      setTimeout(() => {
        router.push('/auth/forgot-password')
      }, 3000)
    } else {
      setHasValidOTP(true)
    }
  }, [router])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      const userId = sessionStorage.getItem('resetUserId')
      if (!userId) {
        setError('Session expired. Please try again.')
        router.push('/auth/forgot-password')
        return
      }

      console.log('[v0] Resetting password for user:', userId)
      const result = await resetPasswordWithOTP(userId, password)

      if (result.success) {
        setSuccess(true)
        // Clear session data
        sessionStorage.removeItem('resetUserId')
        sessionStorage.removeItem('resetEmail')
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } else {
        setError(result.error || 'Failed to reset password')
      }
    } catch (err) {
      console.error('[v0] Password reset error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-sky-100 via-lavender-50 to-purple-100">
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
            <CardTitle className="text-2xl font-serif">
              {success ? 'Password Updated!' : 'Create New Password'}
            </CardTitle>
            <CardDescription>
              {success ? 'Your password has been successfully reset' : 'Choose a strong password for your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasValidOTP && !success ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-amber-600" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {error || 'Redirecting you back...'}
                </p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Redirecting you to login...
                </p>
                <Link href="/auth/login">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                    Go to Login Now
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-background/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {/* Password strength indicator */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Password requirements:</p>
                    <ul className="text-xs space-y-1">
                      <li className={password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
                        {password.length >= 8 ? '✓' : '○'} At least 8 characters
                      </li>
                      <li
                        className={
                          password === confirmPassword && password.length > 0
                            ? 'text-green-600'
                            : 'text-muted-foreground'
                        }
                      >
                        {password === confirmPassword && password.length > 0 ? '✓' : '○'} Passwords match
                      </li>
                    </ul>
                  </div>
                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                      {error}
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-1">OTP-Verified Reset:</p>
                    <p className="text-xs">
                      Your password is being reset securely after OTP verification for maximum account safety.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    disabled={
                      isLoading || password.length < 8 || password !== confirmPassword
                    }
                  >
                    {isLoading ? 'Updating password...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">Created by Aiza Fatima (Azauresthic)</p>
      </div>
    </div>
  )
}
