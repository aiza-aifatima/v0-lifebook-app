'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/client' // Import createClient for handleGoogleCallback

export async function signInWithGoogle() {
  try {
    console.log('[v0] Initiating Google OAuth flow')
    const supabase = createServerClient()

    // Use signInWithOAuth which will handle the redirect
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || 'http://localhost:3000'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('[v0] Google OAuth error:', error)
      return { success: false, error: error.message }
    }

    console.log('[v0] Google OAuth initiated successfully')
    return { success: true }
  } catch (err) {
    console.error('[v0] Unexpected error in Google OAuth:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    }
  }
}

export async function handleGoogleCallback() {
  try {
    console.log('[v0] Processing Google OAuth callback')
    const supabase = createClient()

    // Get the session from the URL hash
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error || !session) {
      console.error('[v0] No session found in callback')
      return { success: false, error: 'Authentication failed' }
    }

    console.log('[v0] Google OAuth callback processed successfully')
    return { success: true, session }
  } catch (err) {
    console.error('[v0] Error in Google callback:', err)
    return { success: false, error: 'Callback processing failed' }
  }
}
