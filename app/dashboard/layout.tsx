import type React from "react"
import { AppHeader } from "@/components/layout/app-header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Guest mode: no authentication required
  // For authenticated users, authentication can be checked client-side if needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-lavender-50 to-purple-50">
      <AppHeader />
      <main>{children}</main>
    </div>
  )
}
