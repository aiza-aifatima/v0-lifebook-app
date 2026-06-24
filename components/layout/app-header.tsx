"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { Home, ListTodo, Map, BookHeart, Swords, Users, Sparkles, LogOut, Download } from "lucide-react"
import { useGuest } from "@/lib/guest-context"
import { useLifeCoins } from "@/lib/lifecoins-context"
import { downloadGuestData } from "@/lib/utils/data-export"
import { useState } from "react"
import type { Profile } from "@/lib/types/database"

const avatarImages: Record<string, string> = {
  harry: "/harry-potter-young-wizard-with-glasses-and-lightni.jpg",
  hermione: "/hermione-granger-young-witch-with-brown-curly-hair.jpg",
  ron: "/ron-weasley-young-wizard-with-red-hair-freckles-fr.jpg",
  luna: "/luna-lovegood-young-witch-with-blonde-wavy-hair-dr.jpg",
  draco: "/draco-malfoy-young-wizard-with-platinum-blonde-hai.jpg",
}

interface AppHeaderProps {
  profile?: Profile
}

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/reflection", icon: BookHeart, label: "Reflection" },
  { href: "/boss-battle", icon: Swords, label: "Battles" },
  { href: "/social", icon: Users, label: "Social" },
]

export function AppHeader({ profile }: AppHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { guest, clearGuest } = useGuest()
  const { state: lifecoinsState } = useLifeCoins()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    clearGuest()
    router.push('/')
  }

  const handleBackup = () => {
    downloadGuestData()
    setShowMenu(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-bold text-xl hidden sm:inline">Lifebook</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button key={item.href} variant={pathname === item.href ? "secondary" : "ghost"} size="sm" asChild>
              <Link href={item.href} className="gap-2">
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3 mr-2 text-sm">
            <span className="flex items-center gap-1">
              <span className="text-amber-500">&#x1FA99;</span>
              <span className="font-medium">{lifecoinsState.balance}</span>
            </span>
            {guest && (
              <span className="flex items-center gap-1 text-muted-foreground text-xs">
                <span>Guest</span>
              </span>
            )}
          </div>

          {/* Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                {guest?.guestName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{guest?.guestName || 'Guest'}</span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-primary/10 rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={() => {
                    router.push('/profile')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm"
                >
                  Profile
                </button>
                <button
                  onClick={handleBackup}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Backup Data
                </button>
                <div className="border-t border-primary/10" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-500/10 transition-colors text-sm text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  New Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <nav className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 text-xs ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
