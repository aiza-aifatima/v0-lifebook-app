import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"
import { LifeCoinsProvider } from "@/lib/lifecoins-context"
import { TasksProvider } from "@/lib/tasks-context"
import { ReflectionProvider } from "@/lib/reflection-context"
import { BossBattleProvider } from "@/lib/boss-battle-context"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lifebook - Level Up Your Real Life",
  description: "Transform your daily tasks into an epic RPG adventure. Created by Aiza Fatima.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
      <body className="font-sans">
        <LifeCoinsProvider>
          <TasksProvider>
            <ReflectionProvider>
              <BossBattleProvider>{children}</BossBattleProvider>
            </ReflectionProvider>
          </TasksProvider>
        </LifeCoinsProvider>
      </body>
    </html>
  )
}
