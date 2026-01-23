'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Loader } from 'lucide-react'

export default function CallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('Processing authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[v0] Processing OAuth callback')
        const supabase = createClient()

        // Get the session from the URL hash
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('[v0] Session error:', sessionError)
          setError('Failed to establish session')
          setStatus('Error')
          setTimeout(() => router.push('/auth/oauth-signup'), 2000)
          return
        }

        if (!session) {
          console.warn('[v0] No session found - checking hash')
          setStatus('Completing sign-in...')
          // Wait a moment for the session to be established
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const { data: newSession } = await supabase.auth.getSession()

          if (!newSession?.session) {
            setError('Authentication session not found')
            setTimeout(() => router.push('/auth/oauth-signup'), 2000)
            return
          }
        }

        console.log('[v0] OAuth callback successful, redirecting to dashboard')
        setStatus('Redirecting to dashboard...')
        router.push('/dashboard')
      } catch (err) {
        console.error('[v0] Callback error:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        setStatus('Error occurred')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-sky-100 via-lavender-50 to-purple-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-primary/10 p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            {!error ? (
              <>
                <Loader className="w-8 h-8 text-primary animate-spin" />
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-foreground">
                    {status}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    This may take a few seconds
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✕</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-red-600">
                    Authentication Failed
                  </h2>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <p className="text-xs text-muted-foreground pt-2">
                    Redirecting you back...
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
