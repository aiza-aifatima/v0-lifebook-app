'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { requestPasswordResetOTP } from '@/lib/auth/otp-service'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('[v0] Requesting OTP for:', email)
      const result = await requestPasswordResetOTP(email)

      if (result.success) {
        setSuccess(true)
        // Redirect to OTP verification page after 2 seconds
        setTimeout(() => {
          sessionStorage.setItem('resetEmail', email)
          router.push('/auth/verify-otp')
        }, 2000)
      } else {
        setError(result.error || 'Failed to send OTP')
      }
    } catch (error: unknown) {
      console.error('[v0] OTP request error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('[v0] Requesting OTP for:', email)
      const result = await requestPasswordResetOTP(email)

      if (result.success) {
        setSuccess(true)
        // Redirect to OTP verification page after 2 seconds
        setTimeout(() => {
          sessionStorage.setItem('resetEmail', email)
          router.push('/auth/verify-otp')
        }, 2000)
      } else {
        setError(result.error || 'Failed to send OTP')
      }
    } catch (error: unknown) {
      console.error('[v0] OTP request error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
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
              {success ? 'OTP Sent Successfully' : 'Forgot Password?'}
            </CardTitle>
            <CardDescription>
              {success
                ? 'Check your email for a one-time password'
                : 'Enter your email and we will send you a 6-digit code'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">OTP sent to:</p>
                  <p className="font-medium flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {email}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">OTP Details:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>6-digit code valid for 10 minutes</li>
                    <li>Check spam/junk folder if needed</li>
                    <li>You can request a new code anytime</li>
                  </ul>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestOTP}>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hero@hogwarts.edu"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                      {error}
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-1">Secure OTP Process:</p>
                    <p className="text-xs">
                      We will send you a one-time password that expires in 10 minutes for enhanced security.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP Code'}
                  </Button>
                </div>
              </form>
            )}
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">Created by Aiza Fatima (Azauresthic)</p>
      </div>
    </div>
  )
}
