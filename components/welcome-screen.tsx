"use client"

import { useEffect, useState } from "react"

interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // Show text after a brief delay
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 500)

    // Auto-complete after 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      {/* Subtle cloud decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-16 h-8 bg-white rounded-full blur-sm"></div>
        <div className="absolute top-32 right-20 w-20 h-10 bg-white rounded-full blur-sm"></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-6 bg-white rounded-full blur-sm"></div>
        <div className="absolute bottom-60 right-1/3 w-24 h-12 bg-white rounded-full blur-sm"></div>
      </div>

      <div className="text-center z-10 px-6">
        {showText && (
          <>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
              <span className="animate-glow">Level up</span> your real life
            </h1>
            <h2 className="font-serif text-2xl md:text-3xl text-white/90 mb-8 animate-fade-in-up [animation-delay:0.3s]">
              like a game
            </h2>
            <p className="font-sans text-lg text-white/80 animate-fade-in-up [animation-delay:0.6s]">
              Created by Aiza Fatima
            </p>
          </>
        )}
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-bounce"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>
    </div>
  )
}
