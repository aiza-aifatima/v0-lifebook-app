"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AvatarType } from "./avatar-selection"

export type AvatarMood = "happy" | "sad" | "lazy" | "powerful" | "excited" | "focused"

interface AvatarCompanionProps {
  avatar: AvatarType
  mood: AvatarMood
  level: number
  lifeCoins: number
  className?: string
}

const moodEmojis: Record<string, Record<AvatarMood, string>> = {
  doraemon: {
    happy: "🤖✨",
    sad: "🤖💧",
    lazy: "🤖😴",
    powerful: "🤖⚡",
    excited: "🤖🎉",
    focused: "🤖🎯",
  },
  bheem: {
    happy: "💪😊",
    sad: "💪😔",
    lazy: "💪😪",
    powerful: "💪🔥",
    excited: "💪🎊",
    focused: "💪🧘",
  },
  shinchan: {
    happy: "😄🌟",
    sad: "😄😢",
    lazy: "😄💤",
    powerful: "😄💥",
    excited: "😄🚀",
    focused: "😄📚",
  },
  ninja: {
    happy: "🥷😌",
    sad: "🥷😞",
    lazy: "🥷😑",
    powerful: "🥷⚔️",
    excited: "🥷🌪️",
    focused: "🥷🎯",
  },
}

const moodMessages: Record<AvatarMood, string[]> = {
  happy: ["Great job! Keep it up!", "You're doing amazing!", "I'm proud of you!", "This is awesome progress!"],
  sad: [
    "It's okay, we all have tough days",
    "Tomorrow is a new opportunity",
    "I believe in you!",
    "Let's try again together",
  ],
  lazy: [
    "Feeling tired? Let's start small",
    "Even tiny steps count",
    "How about just 5 minutes?",
    "I'll help you get motivated",
  ],
  powerful: ["You're unstoppable!", "Look at that strength!", "Nothing can stop us now!", "You're leveling up fast!"],
  excited: ["This is so exciting!", "New adventures await!", "Let's conquer today!", "Ready for the challenge!"],
  focused: ["Great concentration!", "Stay in the zone", "You've got this!", "Perfect focus!"],
}

export function AvatarCompanion({ avatar, mood, level, lifeCoins, className }: AvatarCompanionProps) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const messages = moodMessages[mood]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setCurrentMessage(randomMessage)

    // Trigger animation when mood changes
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 600)

    return () => clearTimeout(timer)
  }, [mood])

  const avatarEmoji = moodEmojis[avatar.id]?.[mood] || avatar.baseEmoji

  return (
    <Card className={`bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Avatar Display */}
          <div className={`text-6xl transition-transform duration-300 ${isAnimating ? "scale-110" : "scale-100"}`}>
            {avatarEmoji}
          </div>

          {/* Avatar Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-foreground">{avatar.name}</h3>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Level {level}
              </Badge>
            </div>

            {/* Mood Message */}
            <div className="bg-card/80 rounded-lg p-3 border border-border/50">
              <p className="text-sm text-foreground italic">"{currentMessage}"</p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">🪙</span>
                <span className="font-medium">{lifeCoins}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-500">⚡</span>
                <span className="font-medium">Mood: {mood}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
