'use client'

import type React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { GoogleSignIn } from '@/components/auth/google-sign-in'

export default function OAuthSignupPage() {
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
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-serif">Create Your Account</CardTitle>
            <CardDescription>Get started in seconds with your Google account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign-in Button */}
            <GoogleSignIn size="lg" variant="default" />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">That's it!</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">No passwords to remember</h3>
                <p className="text-xs text-blue-800">Use your Google account to sign in anywhere</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-green-900 mb-1">Your data is safe</h3>
                <p className="text-xs text-green-800">We use Supabase for secure authentication</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-purple-900 mb-1">Quick onboarding</h3>
                <p className="text-xs text-purple-800">Complete your profile in just a few taps</p>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
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
