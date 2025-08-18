"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomizationItem {
  id: string
  name: string
  emoji: string
  cost: number
  unlocked: boolean
  category: "outfit" | "accessory" | "power"
}

const customizationItems: CustomizationItem[] = [
  // Outfits
  { id: "casual", name: "Casual Wear", emoji: "👕", cost: 0, unlocked: true, category: "outfit" },
  { id: "hero", name: "Hero Costume", emoji: "🦸", cost: 100, unlocked: false, category: "outfit" },
  { id: "ninja", name: "Ninja Gear", emoji: "🥷", cost: 150, unlocked: false, category: "outfit" },
  { id: "wizard", name: "Wizard Robes", emoji: "🧙", cost: 200, unlocked: false, category: "outfit" },

  // Accessories
  { id: "glasses", name: "Smart Glasses", emoji: "🤓", cost: 50, unlocked: false, category: "accessory" },
  { id: "crown", name: "Victory Crown", emoji: "👑", cost: 300, unlocked: false, category: "accessory" },
  { id: "headphones", name: "Focus Headphones", emoji: "🎧", cost: 75, unlocked: false, category: "accessory" },

  // Powers
  { id: "speed", name: "Speed Boost", emoji: "💨", cost: 250, unlocked: false, category: "power" },
  { id: "strength", name: "Super Strength", emoji: "💪", cost: 300, unlocked: false, category: "power" },
  { id: "focus", name: "Laser Focus", emoji: "🎯", cost: 200, unlocked: false, category: "power" },
]

interface AvatarCustomizationProps {
  lifeCoins: number
  onPurchase: (item: CustomizationItem) => void
}

export function AvatarCustomization({ lifeCoins, onPurchase }: AvatarCustomizationProps) {
  const [selectedCategory, setSelectedCategory] = useState<"outfit" | "accessory" | "power">("outfit")

  const getItemsByCategory = (category: string) => {
    return customizationItems.filter((item) => item.category === category)
  }

  const canAfford = (cost: number) => lifeCoins >= cost

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Avatar Customization</CardTitle>
        <CardDescription>Spend LifeCoins to unlock new looks and powers for your companion</CardDescription>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">🪙</span>
          <span className="font-semibold">{lifeCoins} LifeCoins</span>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="outfit">Outfits</TabsTrigger>
            <TabsTrigger value="accessory">Accessories</TabsTrigger>
            <TabsTrigger value="power">Powers</TabsTrigger>
          </TabsList>

          <TabsContent value="outfit" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {getItemsByCategory("outfit").map((item) => (
                <CustomizationCard key={item.id} item={item} canAfford={canAfford(item.cost)} onPurchase={onPurchase} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accessory" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {getItemsByCategory("accessory").map((item) => (
                <CustomizationCard key={item.id} item={item} canAfford={canAfford(item.cost)} onPurchase={onPurchase} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="power" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {getItemsByCategory("power").map((item) => (
                <CustomizationCard key={item.id} item={item} canAfford={canAfford(item.cost)} onPurchase={onPurchase} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface CustomizationCardProps {
  item: CustomizationItem
  canAfford: boolean
  onPurchase: (item: CustomizationItem) => void
}

function CustomizationCard({ item, canAfford, onPurchase }: CustomizationCardProps) {
  return (
    <Card
      className={`transition-all duration-200 ${item.unlocked ? "bg-green-50 border-green-200" : canAfford ? "hover:shadow-md cursor-pointer" : "opacity-60"}`}
    >
      <CardContent className="p-4 text-center">
        <div className="text-3xl mb-2">{item.emoji}</div>
        <h4 className="font-medium text-sm mb-1">{item.name}</h4>

        {item.unlocked ? (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Owned
          </Badge>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-1 text-sm">
              <span className="text-yellow-500">🪙</span>
              <span className={canAfford ? "text-foreground" : "text-red-500"}>{item.cost}</span>
            </div>
            <Button
              size="sm"
              variant={canAfford ? "default" : "secondary"}
              disabled={!canAfford}
              onClick={() => canAfford && onPurchase(item)}
              className="w-full text-xs"
            >
              {canAfford ? "Buy" : "Need More"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
