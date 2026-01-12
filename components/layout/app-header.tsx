"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { Home, ListTodo, Map, BookHeart, Swords, Users, Sparkles } from "lucide-react"
import type { Profile } from "@/lib/types/database"

const avatarImages: Record<string, string> = {
  harry: "/harry-potter-young-wizard-with-glasses-and-lightni.jpg",
  hermione: "/hermione-granger-young-witch-with-brown-curly-hair.jpg",
  ron: "/ron-weasley-young-wizard-with-red-hair-freckles-fr.jpg",
  luna: "/luna-lovegood-young-witch-with-blonde-wavy-hair-dr.jpg",
  draco: "/draco-malfoy-young-wizard-with-platinum-blonde-hai.jpg",
}

interface AppHeaderProps {
  profile: Profile
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
              <span className="font-medium">{profile.lifecoins}</span>
            </span>
            <span className="flex items-center gap-1 text-primary">
              <span>Lvl</span>
              <span className="font-medium">{profile.level}</span>
            </span>
          </div>

          <NotificationBell userId={profile.id} />

          <Link href="/profile">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <img
                src={avatarImages[profile.avatar_id] || avatarImages.harry}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
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
