"use client"

import { useState } from "react"
import { ReflectionEntryCreator } from "@/components/reflection-entry-creator"
import { ReflectionVault } from "@/components/reflection-vault"
import { WeeklyPlayback } from "@/components/weekly-playback"
import { LifeCoinsDisplay } from "@/components/lifecoins-display"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function ReflectionPage() {
  const [showCreator, setShowCreator] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Reflection Vault</h1>
          <p className="text-muted-foreground">Your private space for personal growth, insights, and self-awareness</p>
        </div>

        {/* Quick Navigation */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">🏠 Dashboard</Button>
          </Link>
          <Link href="/tasks">
            <Button variant="outline">📋 Tasks</Button>
          </Link>
          <Link href="/map">
            <Button variant="outline">🗺️ Progress Map</Button>
          </Link>
        </div>

        {/* LifeCoins Display */}
        <LifeCoinsDisplay className="max-w-2xl mx-auto" />

        {/* Main Content */}
        <Tabs defaultValue="vault" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="vault">My Vault</TabsTrigger>
            <TabsTrigger value="create">New Entry</TabsTrigger>
            <TabsTrigger value="playback">Weekly Review</TabsTrigger>
          </TabsList>

          <TabsContent value="vault" className="space-y-6">
            <ReflectionVault />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <ReflectionEntryCreator />
          </TabsContent>

          <TabsContent value="playback" className="space-y-6">
            <WeeklyPlayback />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
