"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Sparkles } from "lucide-react"
import type { Avatar } from "@/lib/types/database"

const defaultAvatars: Avatar[] = [
  {
    id: "harry",
    name: "Harry Potter",
    description: "The Chosen One - brave, loyal, and determined to do what is right",
    personality: "Courageous and selfless",
    image_url: "/harry-potter-young-wizard-with-glasses-and-lightni.jpg",
    house: "Gryffindor",
    traits: ["brave", "loyal", "determined"],
    unlock_requirement: {},
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "hermione",
    name: "Hermione Granger",
    description: "The brightest witch of her age - intelligent, resourceful, and hardworking",
    personality: "Studious and dedicated",
    image_url: "/hermione-granger-young-witch-with-brown-curly-hair.jpg",
    house: "Gryffindor",
    traits: ["intelligent", "hardworking", "logical"],
    unlock_requirement: {},
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "ron",
    name: "Ron Weasley",
    description: "A loyal friend with a heart of gold - humorous and brave when it counts",
    personality: "Loyal and supportive",
    image_url: "/ron-weasley-young-wizard-with-red-hair-freckles-fr.jpg",
    house: "Gryffindor",
    traits: ["loyal", "humorous", "brave"],
    unlock_requirement: {},
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "luna",
    name: "Luna Lovegood",
    description: "Unique and insightful - sees the world differently and embraces creativity",
    personality: "Creative and open-minded",
    image_url: "/luna-lovegood-young-witch-with-blonde-wavy-hair-dr.jpg",
    house: "Ravenclaw",
    traits: ["creative", "unique", "insightful"],
    unlock_requirement: { level: 5 },
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "draco",
    name: "Draco Malfoy",
    description: "Ambitious and cunning - strives for excellence and personal growth",
    personality: "Ambitious and resourceful",
    image_url: "/draco-malfoy-young-wizard-with-platinum-blonde-hai.jpg",
    house: "Slytherin",
    traits: ["ambitious", "cunning", "determined"],
    unlock_requirement: { level: 10 },
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "neville",
    name: "Neville Longbottom",
    description: "The underdog hero - proves that courage comes in many forms",
    personality: "Persistent and brave",
    image_url: "/neville-longbottom-young-wizard-with-round-face-ki.jpg",
    house: "Gryffindor",
    traits: ["brave", "persistent", "humble"],
    unlock_requirement: { tasks_completed: 50 },
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "ginny",
    name: "Ginny Weasley",
    description: "Fierce and independent - a natural leader with unstoppable spirit",
    personality: "Fierce and independent",
    image_url: "/ginny-weasley-young-witch-with-long-red-hair-athle.jpg",
    house: "Gryffindor",
    traits: ["fierce", "independent", "athletic"],
    unlock_requirement: { streak: 7 },
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "dumbledore",
    name: "Albus Dumbledore",
    description: "The wise mentor - guides with wisdom and believes in the power of love",
    personality: "Wise and compassionate",
    image_url: "/albus-dumbledore-elderly-wizard-with-long-white-be.jpg",
    house: "Gryffindor",
    traits: ["wise", "powerful", "compassionate"],
    unlock_requirement: { level: 25 },
    is_premium: true,
    created_at: new Date().toISOString(),
  },
]

// House colors for badges
const houseColors: Record<string, string> = {
  Gryffindor: "bg-red-600 text-white",
  Ravenclaw: "bg-blue-600 text-white",
  Slytherin: "bg-green-600 text-white",
  Hufflepuff: "bg-yellow-500 text-black",
}

interface AvatarSelectionProps {
  onSelect: (avatar: Avatar) => void
  selectedAvatar?: Avatar
  userLevel?: number
  userStreak?: number
  tasksCompleted?: number
  avatars?: Avatar[]
}

export function AvatarSelection({
  onSelect,
  selectedAvatar,
  userLevel = 1,
  userStreak = 0,
  tasksCompleted = 0,
  avatars = defaultAvatars,
}: AvatarSelectionProps) {
  const isUnlocked = (avatar: Avatar): boolean => {
    const req = avatar.unlock_requirement as Record<string, number>
    if (!req || Object.keys(req).length === 0) return true
    if (req.level && userLevel < req.level) return false
    if (req.streak && userStreak < req.streak) return false
    if (req.tasks_completed && tasksCompleted < req.tasks_completed) return false
    return true
  }

  const getUnlockMessage = (avatar: Avatar): string => {
    const req = avatar.unlock_requirement as Record<string, number>
    if (req.level) return `Reach level ${req.level} to unlock`
    if (req.streak) return `Achieve ${req.streak}-day streak to unlock`
    if (req.tasks_completed) return `Complete ${req.tasks_completed} tasks to unlock`
    return "Locked"
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Choose Your Companion</h2>
        <p className="text-muted-foreground">Your avatar will grow and evolve with your progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {avatars.map((avatar) => {
          const unlocked = isUnlocked(avatar)
          return (
            <Card
              key={avatar.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl group ${
                selectedAvatar?.id === avatar.id
                  ? "ring-2 ring-primary bg-primary/5 shadow-lg"
                  : unlocked
                    ? "hover:bg-muted/50 hover:-translate-y-1"
                    : "opacity-60 cursor-not-allowed"
              }`}
              onClick={() => unlocked && onSelect(avatar)}
            >
              <CardHeader className="text-center pb-2 relative">
                {avatar.is_premium && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </div>
                )}
                <div className="relative mx-auto mb-3">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-muted mx-auto bg-gradient-to-br from-primary/20 to-secondary/20">
                    <img
                      src={avatar.image_url || "/placeholder.svg"}
                      alt={avatar.name}
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                        !unlocked ? "grayscale blur-sm" : ""
                      }`}
                    />
                  </div>
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-background/80 rounded-full p-2">
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg flex items-center justify-center gap-2">{avatar.name}</CardTitle>
                {avatar.house && <Badge className={`mt-1 ${houseColors[avatar.house]}`}>{avatar.house}</Badge>}
                <CardDescription className="text-sm mt-2">{avatar.personality}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground text-center line-clamp-2">
                  {unlocked ? avatar.description : getUnlockMessage(avatar)}
                </p>
                {unlocked && avatar.traits && (
                  <div className="flex flex-wrap gap-1 justify-center mt-3">
                    {avatar.traits.slice(0, 3).map((trait) => (
                      <Badge key={trait} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
