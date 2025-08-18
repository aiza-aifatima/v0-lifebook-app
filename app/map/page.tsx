"use client"

import { ProgressMap } from "@/components/progress-map"
import { MapStats } from "@/components/map-stats"
import { LifeCoinsDisplay } from "@/components/lifecoins-display"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Your Life Journey Map</h1>
          <p className="text-muted-foreground">
            Explore different regions and track your progress across all life domains
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">🏠 Dashboard</Button>
          </Link>
          <Link href="/tasks">
            <Button variant="outline">📋 Tasks</Button>
          </Link>
        </div>

        {/* LifeCoins Display */}
        <LifeCoinsDisplay className="max-w-2xl mx-auto" />

        {/* Main Content */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="stats">Journey Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <ProgressMap />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <MapStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
