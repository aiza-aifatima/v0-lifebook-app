'use client'

import { AuthError } from '@supabase/supabase-js'

export interface ErrorResponse {
  title: string
  message: string
  actionText?: string
  actionHref?: string
  severity: 'error' | 'warning' | 'info'
  code: string
}

/**
 * Map Supabase and validation errors to user-friendly messages
 */
export function mapAuthError(error: unknown): ErrorResponse {
  console.log('[v0] Mapping error:', error)

  if (error instanceof AuthError) {
    // Handle Supabase specific errors
    switch (error.status) {
      case 400:
        if (error.message.includes('Invalid login credentials')) {
          return {
            title: 'Invalid Credentials',
            message: 'The email or password you entered is incorrect. Please try again.',
            severity: 'error',
            code: 'INVALID_CREDENTIALS',
            actionText: 'Try again',
          }
        }
        if (error.message.includes('Email not confirmed')) {
          return {
            title: 'Email Not Verified',
            message: 'Please check your email for a verification link to activate your account.',
            severity: 'warning',
            code: 'EMAIL_NOT_CONFIRMED',
            actionText: 'Resend verification email',
          }
        }
        if (error.message.includes('already registered')) {
          return {
            title: 'Account Already Exists',
            message: 'This email is already registered. Try logging in instead.',
            severity: 'warning',
            code: 'USER_ALREADY_EXISTS',
            actionText: 'Go to login',
            actionHref: '/auth/login',
          }
        }
        if (error.message.includes('Password')) {
          return {
            title: 'Invalid Password',
            message: 'Password must be at least 8 characters. Use a mix of letters, numbers, and symbols.',
            severity: 'warning',
            code: 'WEAK_PASSWORD',
          }
        }
        break

      case 401:
        return {
          title: 'Authentication Required',
          message: 'Your session has expired. Please log in again.',
          severity: 'warning',
          code: 'SESSION_EXPIRED',
          actionText: 'Go to login',
          actionHref: '/auth/login',
        }

      case 422:
        if (error.message.includes('Unprocessable Entity')) {
          return {
            title: 'Invalid Email Format',
            message: 'Please enter a valid email address (e.g., name@example.com).',
            severity: 'warning',
            code: 'INVALID_EMAIL',
          }
        }
        break

      case 429:
        return {
          title: 'Too Many Attempts',
          message: 'You have tried too many times. Please wait a few minutes and try again.',
          severity: 'warning',
          code: 'TOO_MANY_ATTEMPTS',
        }

      case 500:
        return {
          title: 'Server Error',
          message: 'We are experiencing technical difficulties. Please try again in a few moments.',
          severity: 'error',
          code: 'SERVER_ERROR',
        }

      default:
        break
    }
  }

  // Handle validation errors
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('password')) {
      return {
        title: 'Password Error',
        message:
          'Passwords must be at least 8 characters and match. Include letters, numbers, and symbols.',
        severity: 'warning',
        code: 'PASSWORD_VALIDATION',
      }
    }

    if (message.includes('email')) {
      return {
        title: 'Email Error',
        message: 'Please enter a valid email address.',
        severity: 'warning',
        code: 'EMAIL_VALIDATION',
      }
    }

    if (message.includes('username')) {
      return {
        title: 'Username Error',
        message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores.',
        severity: 'warning',
        code: 'USERNAME_VALIDATION',
      }
    }

    if (message.includes('network') || message.includes('fetch')) {
      return {
        title: 'Connection Error',
        message: 'Please check your internet connection and try again.',
        severity: 'error',
        code: 'NETWORK_ERROR',
      }
    }
  }

  // Generic fallback
  return {
    title: 'Oops! Something went wrong',
    message:
      'An unexpected error occurred. Please refresh the page and try again. If the problem persists, contact support.',
    severity: 'error',
    code: 'UNKNOWN_ERROR',
    actionText: 'Refresh page',
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean
  feedback: string[]
} {
  const feedback = []

  if (password.length < 8) {
    feedback.push('At least 8 characters')
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('Lowercase letter')
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('Uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    feedback.push('Number')
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Special character (!@#$%)')
  }

  return {
    valid: feedback.length === 0,
    feedback,
  }
}

/**
 * Validate username
 */
export function validateUsername(username: string): {
  valid: boolean
  error?: string
} {
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }
  if (username.length > 30) {
    return { valid: false, error: 'Username must be less than 30 characters' }
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Only letters, numbers, underscores, and hyphens allowed' }
  }
  return { valid: true }
}

/**
 * Check if error is a network/connection error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('connect') ||
      error.message.includes('timeout')
    )
  }
  return false
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('timeout') ||
      error.message.includes('timed out') ||
      error.message.includes('abort')
    )
  }
  return false
}
