import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { LifeCoinsProvider } from "@/lib/lifecoins-context"
import { TasksProvider } from "@/lib/tasks-context"
import { ReflectionProvider } from "@/lib/reflection-context"
import { BossBattleProvider } from "@/lib/boss-battle-context"

const playfair = Playfair_Display({ subsets: ["latin"] })
const sourceSans = Source_Sans_3({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
      <head>
        <style>{`
html {
  font-family: ${sourceSans.style.fontFamily};
  --font-sans: ${sourceSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
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
