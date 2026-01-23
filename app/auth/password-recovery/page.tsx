'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Mail, CheckCircle, Loader } from 'lucide-react'
import { requestPasswordResetOTP, validatePasswordResetOTP } from '@/lib/auth/otp-service'

type Step = 'email' | 'otp' | 'success'

export default function PasswordRecoveryPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const router = useRouter()
  const otpInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      otpInputRef.current?.focus()
    }
  }, [step])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendTimer])

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await requestPasswordResetOTP(email)

      if (result.success) {
        setStep('otp')
        setError(null)
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.')
      }
    } catch (err) {
      console.error('[v0] Password recovery error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await validatePasswordResetOTP(email, otpCode)

      if (result.success) {
        // Store userId in session storage for password reset
        if (result.userId) {
          sessionStorage.setItem('resetUserId', result.userId)
          sessionStorage.setItem('resetEmail', email)
        }
        setStep('success')
        // Redirect to password reset page
        setTimeout(() => {
          router.push('/auth/reset-password')
        }, 2000)
      } else {
        setError(result.error || 'Invalid code. Please try again.')
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
    setIsLoading(true)
    setError(null)

    try {
      const result = await requestPasswordResetOTP(email)
      if (result.success) {
        setOtp('')
        setResendTimer(60)
        setError(null)
        otpInputRef.current?.focus()
      } else {
        setError(result.error || 'Failed to resend code. Please try again.')
      }
    } catch (err) {
      console.error('[v0] Resend OTP error:', err)
      setError('An error occurred. Please try again.')
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
          {step === 'email' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-serif">Recover Your Password</CardTitle>
                <CardDescription>
                  Enter your email and we'll send you a verification code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestOTP} className="flex flex-col gap-5">
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
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 flex gap-2">
                      <span className="text-base">⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-2">How it works:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>We'll send a 6-digit code to your email</li>
                      <li>Enter the code on the next screen</li>
                      <li>Set your new password</li>
                    </ol>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Verification Code
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/auth/login"
                      className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {step === 'otp' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-serif">Verify Your Email</CardTitle>
                <CardDescription>
                  Enter the 6-digit code we sent to {email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }} className="flex flex-col gap-5">
                  <div className="grid gap-3">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      ref={otpInputRef}
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={handleOTPChange}
                      className="text-center text-2xl tracking-widest bg-background/50 font-mono"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Auto-submits when 6 digits entered
                    </p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 flex gap-2">
                      <span className="text-base">⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                    <p className="font-medium mb-1">Code expires in 10 minutes</p>
                    <p>Check your spam folder if you don't see the email</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Code
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={handleResendOTP}
                      disabled={isLoading || resendTimer > 0}
                    >
                      {resendTimer > 0 ? (
                        <>Resend in {resendTimer}s</>
                      ) : (
                        <>Resend Code</>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setStep('email')
                        setOtp('')
                        setError(null)
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Change Email
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {step === 'success' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-serif">Code Verified!</CardTitle>
                <CardDescription>
                  Redirecting you to reset your password...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Your verification was successful.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader className="w-4 h-4 animate-spin" />
                      Redirecting...
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Created by Aiza Fatima (Azauresthic)
        </p>
      </div>
    </div>
  )
}
