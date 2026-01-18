'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, ArrowLeft, CheckCircle, Loader } from 'lucide-react'
import Link from 'next/link'
import { validatePasswordResetOTP, resendPasswordResetOTP } from '@/lib/auth/otp-service'

export default function VerifyOTPPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const router = useRouter()
  const otpInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus OTP input
  useEffect(() => {
    otpInputRef.current?.focus()
  }, [])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendTimer])

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)

    // Auto-submit when 6 digits entered
    if (value.length === 6) {
      handleVerifyOTP(value)
    }
  }

  const handleVerifyOTP = async (otpCode: string = otp) => {
    if (!email || !otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('[v0] Verifying OTP:', { email, otpCode })
      const result = await validatePasswordResetOTP(email, otpCode)

      if (result.success) {
        setSuccess(true)
        // Store userId in session storage for password reset
        if (result.userId) {
          sessionStorage.setItem('resetUserId', result.userId)
          sessionStorage.setItem('resetEmail', email)
        }
        // Redirect to password reset page
        setTimeout(() => {
          router.push('/auth/reset-password')
        }, 2000)
      } else {
        setError(result.error || 'Invalid OTP')
        setOtp('')
      }
    } catch (err) {
      console.error('[v0] OTP verification error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsResending(true)
    setError(null)

    try {
      const result = await resendPasswordResetOTP(email)
      if (result.success) {
        setOtp('')
        setResendTimer(60) // 60 second cooldown
        setError(null)
        otpInputRef.current?.focus()
      } else {
        setError(result.error || 'Failed to resend OTP')
      }
    } catch (err) {
      console.error('[v0] Resend OTP error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsResending(false)
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
              {success ? 'OTP Verified!' : 'Enter Verification Code'}
            </CardTitle>
            <CardDescription>
              {success
                ? 'Redirecting you to reset your password...'
                : 'We sent a 6-digit code to your email'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Your OTP has been verified successfully.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader className="w-4 h-4 animate-spin" />
                  Redirecting...
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleVerifyOTP()
                }}
              >
                <div className="flex flex-col gap-5">
                  {/* Email Input */}
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

                  {/* OTP Input */}
                  <div className="grid gap-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <div className="flex gap-2">
                      <Input
                        ref={otpInputRef}
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={handleOTPChange}
                        className="bg-background/50 text-center text-2xl font-mono tracking-widest"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Enter the 6-digit code from your email
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                      {error}
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-1">OTP expires in 10 minutes</p>
                    <p className="text-xs">Check your spam folder if you don't see the email</p>
                  </div>

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>

                  {/* Resend Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleResendOTP}
                    disabled={isResending || resendTimer > 0}
                  >
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : isResending
                        ? 'Sending...'
                        : "Didn't receive code? Resend"}
                  </Button>
                </div>
              </form>
            )}

            {/* Back to Login */}
            {!success && (
              <div className="mt-6 text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Password Reset
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">Created by Aiza Fatima (Azauresthic)</p>
      </div>
    </div>
  )
}
