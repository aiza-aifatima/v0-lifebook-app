"use client"

import { useState, useEffect } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { LoginScreen } from "@/components/login-screen"
import { useRouter } from "next/navigation"

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Auto-transition to login after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleStartJourney = () => {
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen">
      {showWelcome ? (
        <WelcomeScreen onComplete={() => setShowWelcome(false)} />
      ) : (
        <LoginScreen onStartJourney={handleStartJourney} />
      )}
    </main>
  )
}
