"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface AvatarType {
  id: string
  name: string
  description: string
  baseEmoji: string
  personality: string
  unlocked: boolean
}

const avatarTypes: AvatarType[] = [
  {
    id: "doraemon",
    name: "Dora",
    description: "A wise and helpful companion with magical gadgets",
    baseEmoji: "🤖",
    personality: "Supportive and encouraging",
    unlocked: true,
  },
  {
    id: "bheem",
    name: "Bheem",
    description: "Strong and brave, always ready for adventure",
    baseEmoji: "💪",
    personality: "Energetic and determined",
    unlocked: true,
  },
  {
    id: "shinchan",
    name: "Shin",
    description: "Playful and mischievous, keeps things fun",
    baseEmoji: "😄",
    personality: "Playful and motivating",
    unlocked: true,
  },
  {
    id: "ninja",
    name: "Kage",
    description: "Stealthy and focused, masters discipline",
    baseEmoji: "🥷",
    personality: "Disciplined and focused",
    unlocked: false,
  },
]

interface AvatarSelectionProps {
  onSelect: (avatar: AvatarType) => void
  selectedAvatar?: AvatarType
}

export function AvatarSelection({ onSelect, selectedAvatar }: AvatarSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Choose Your Companion</h2>
        <p className="text-muted-foreground">Your avatar will grow and evolve with your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {avatarTypes.map((avatar) => (
          <Card
            key={avatar.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedAvatar?.id === avatar.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
            } ${!avatar.unlocked ? "opacity-60" : ""}`}
            onClick={() => avatar.unlocked && onSelect(avatar)}
          >
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">{avatar.baseEmoji}</div>
              <CardTitle className="text-lg flex items-center justify-center gap-2">
                {avatar.name}
                {!avatar.unlocked && <Badge variant="secondary">🔒 Locked</Badge>}
              </CardTitle>
              <CardDescription className="text-sm">{avatar.personality}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground text-center">{avatar.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
