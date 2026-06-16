'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'

export async function signInWithGoogle() {
  try {
    console.log('[v0] Initiating Google OAuth flow')
    const supabase = await createServerClient()

    // Use signInWithOAuth which will handle the redirect
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`}/auth/callback`,
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

    console.log('[v0] Google OAuth initiated successfully', data)
    return { success: true, data }
  } catch (err) {
    console.error('[v0] Unexpected error in Google OAuth:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    }
  }
}

