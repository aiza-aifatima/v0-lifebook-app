'use client'

import { useState } from 'react'
import { AvatarCompanion, type AvatarMood } from '@/components/avatar-companion'
import { AvatarCustomization } from '@/components/avatar-customization'
import { AvatarSelection, type AvatarType } from '@/components/avatar-selection'
import { LifeCoinsDisplay } from '@/components/lifecoins-display'
import { LifeCoinsActions } from '@/components/lifecoins-actions'
import { useLifeCoins } from '@/lib/lifecoins-context'
import { useReflection } from '@/lib/reflection-context'
import { useBossBattle } from '@/lib/boss-battle-context'
import { useGuest } from '@/lib/guest-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

// Mock data - in real app this would come from state management/database
const defaultAvatar: AvatarType = {
  id: "doraemon",
  name: "Dora",
  description: "A wise and helpful companion with magical gadgets",
  baseEmoji: "🤖",
  personality: "Supportive and encouraging",
  unlocked: true,
}

export default function Dashboard() {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>(defaultAvatar)
  const [avatarMood, setAvatarMood] = useState<AvatarMood>('happy')
  const [avatarLevel, setAvatarLevel] = useState(1)
  const [showCustomization, setShowCustomization] = useState(false)
  const [showAvatarSelection, setShowAvatarSelection] = useState(false)

  const { state: lifeCoinsState, spendCoins } = useLifeCoins()
  const { updateCurrentMood, addMoodSnapshot } = useReflection()
  const { state: bossBattleState } = useBossBattle()
  const { guest, clearGuest } = useGuest()

  const handlePurchase = (item: any) => {
    const success = spendCoins(item.cost, `Purchased ${item.name}`)
    if (success) {
      console.log("Purchased:", item.name)
      setAvatarMood("excited")
      updateCurrentMood("excited", 8)
    } else {
      setAvatarMood("sad")
      updateCurrentMood("sad", 4)
    }
  }

  const handleMoodChange = (mood: AvatarMood) => {
    setAvatarMood(mood)
    updateCurrentMood(mood, 7)

    // Add mood snapshot for tracking
    addMoodSnapshot({
      mood,
      energy: 7,
      lifeCoins: lifeCoinsState.balance,
      streak: lifeCoinsState.streak,
      tasksCompleted: 0, // Would get from tasks context
      reflectionCount: 0, // Would get from reflection context
    })
  }

  const moodButtons: { mood: AvatarMood; label: string; emoji: string }[] = [
    { mood: "happy", label: "Happy", emoji: "😊" },
    { mood: "excited", label: "Excited", emoji: "🎉" },
    { mood: "focused", label: "Focused", emoji: "🎯" },
    { mood: "powerful", label: "Powerful", emoji: "💪" },
    { mood: "lazy", label: "Lazy", emoji: "😴" },
    { mood: "sad", label: "Sad", emoji: "😔" },
  ]

  if (showAvatarSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <AvatarSelection
            onSelect={(avatar) => {
              setSelectedAvatar(avatar)
              setShowAvatarSelection(false)
            }}
            selectedAvatar={selectedAvatar}
          />
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setShowAvatarSelection(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <div className="text-center flex-1">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Welcome, {guest?.guestName}!
            </h1>
            <p className="text-muted-foreground">Level up your real life with your companion</p>
          </div>

          {/* Auth Options - Guest or Sign In */}
          <div className="flex gap-2">
            {!guest?.isAuthenticated && (
              <>
                <Link href="/auth/sign-up">
                  <Button variant="outline" size="sm">
                    Create Account
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </>
            )}
            {guest?.isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearGuest()}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            )}
          </div>
        </div>

        {/* Avatar Companion Display */}
        <AvatarCompanion
          avatar={selectedAvatar}
          mood={avatarMood}
          level={avatarLevel}
          lifeCoins={lifeCoinsState.balance}
          className="max-w-2xl mx-auto"
        />

        {/* LifeCoins Display */}
        <LifeCoinsDisplay showDetails={true} className="max-w-2xl mx-auto" />

        {/* Quick Navigation */}
        <div className="flex justify-center space-x-4">
          <Link href="/tasks">
            <Button className="bg-primary hover:bg-primary/90">📋 Manage Tasks</Button>
          </Link>
          <Link href="/map">
            <Button className="bg-secondary hover:bg-secondary/90">🗺️ View Progress Map</Button>
          </Link>
          <Link href="/reflection">
            <Button className="bg-accent hover:bg-accent/90">🔒 Reflection Vault</Button>
          </Link>
          <Link href="/boss-battle">
            <Button
              className={`relative ${
                bossBattleState.activeBoss
                  ? "bg-red-600 hover:bg-red-700 animate-pulse"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              ⚔️ Boss Battle
              {bossBattleState.activeBoss && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1">!</Badge>
              )}
            </Button>
          </Link>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mood Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Avatar Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {moodButtons.map(({ mood, label, emoji }) => (
                  <Button
                    key={mood}
                    variant={avatarMood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMoodChange(mood)}
                    className="flex flex-col items-center space-y-1 h-auto py-3"
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avatar Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Avatar Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowAvatarSelection(true)}>
                Change Avatar
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setShowCustomization(!showCustomization)}
              >
                {showCustomization ? "Hide" : "Show"} Customization
              </Button>
            </CardContent>
          </Card>

          {/* LifeCoins Actions */}
          <LifeCoinsActions onMoodChange={handleMoodChange} />
        </div>

        {/* Customization Panel */}
        {showCustomization && (
          <div className="max-w-4xl mx-auto">
            <AvatarCustomization lifeCoins={lifeCoinsState.balance} onPurchase={handlePurchase} />
          </div>
        )}
      </div>
    </div>
  )
}
