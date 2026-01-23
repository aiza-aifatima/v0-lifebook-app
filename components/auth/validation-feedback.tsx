'use client'

import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import type { ErrorResponse } from '@/lib/auth/error-handler'

interface ValidationFeedbackProps {
  error?: ErrorResponse | null
  className?: string
}

const severityStyles = {
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const severityIcons = {
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
}

export function ValidationFeedback({ error, className = '' }: ValidationFeedbackProps) {
  if (!error) return null

  const IconComponent = severityIcons[error.severity]
  const styles = severityStyles[error.severity]

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 duration-200 ${styles} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm">{error.title}</p>
        <p className="text-sm mt-1 opacity-90">{error.message}</p>
      </div>
    </div>
  )
}

interface PasswordStrengthProps {
  feedback: string[]
  isValid: boolean
}

export function PasswordStrengthFeedback({ feedback, isValid }: PasswordStrengthProps) {
  if (feedback.length === 0) return null

  return (
    <div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
      <p className="text-xs font-semibold text-blue-900 mb-2">Password requirements:</p>
      <ul className="space-y-1">
        {feedback.map((item) => (
          <li key={item} className="text-xs text-blue-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface InputFeedbackProps {
  label: string
  hint?: string
  error?: string
  isValid?: boolean
}

export function InputFeedback({ label, hint, error, isValid }: InputFeedbackProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-red-600 flex items-center gap-1">{error}</p>}
      {isValid && <p className="text-xs text-green-600 flex items-center gap-1">✓ Looks good</p>}
    </div>
  )
}
