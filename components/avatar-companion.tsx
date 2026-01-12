"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Avatar } from "@/lib/types/database"

export type AvatarMood = "happy" | "sad" | "lazy" | "powerful" | "excited" | "focused"

const defaultAvatars: Record<string, Avatar> = {
  harry: {
    id: "harry",
    name: "Harry Potter",
    description: "The Chosen One",
    personality: "Courageous and selfless",
    image_url: "/harry-potter-young-wizard-with-glasses-and-lightni.jpg",
    house: "Gryffindor",
    traits: ["brave", "loyal", "determined"],
    unlock_requirement: {},
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  hermione: {
    id: "hermione",
    name: "Hermione Granger",
    description: "The brightest witch",
    personality: "Studious and dedicated",
    image_url: "/hermione-granger-young-witch-with-brown-curly-hair.jpg",
    house: "Gryffindor",
    traits: ["intelligent", "hardworking", "logical"],
    unlock_requirement: {},
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  ron: {
    id: "ron",
    name: "Ron Weasley",
    description: "A loyal friend",
    personality: "Loyal and supportive",
    image_url: "/ron-weasley-young-wizard-with-red-hair-freckles-fr.jpg",
    house: "Gryffindor",
    traits: ["loyal", "humorous", "brave"],
    unlock_requirement: {},
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  luna: {
    id: "luna",
    name: "Luna Lovegood",
    description: "Unique and insightful",
    personality: "Creative and open-minded",
    image_url: "/luna-lovegood-young-witch-with-blonde-wavy-hair-dr.jpg",
    house: "Ravenclaw",
    traits: ["creative", "unique", "insightful"],
    unlock_requirement: { level: 5 },
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  draco: {
    id: "draco",
    name: "Draco Malfoy",
    description: "Ambitious and cunning",
    personality: "Ambitious and resourceful",
    image_url: "/draco-malfoy-young-wizard-with-platinum-blonde-hai.jpg",
    house: "Slytherin",
    traits: ["ambitious", "cunning", "determined"],
    unlock_requirement: { level: 10 },
    is_premium: false,
    created_at: new Date().toISOString(),
  },
}

interface AvatarCompanionProps {
  avatarId: string
  avatar?: Avatar
  mood: AvatarMood
  level: number
  lifeCoins: number
  className?: string
}

const moodMessages: Record<AvatarMood, Record<string, string[]>> = {
  happy: {
    harry: [
      "Brilliant work! You're a true Gryffindor!",
      "Expecto Patronum! Your positivity is shining!",
      "Even Dumbledore would be proud!",
    ],
    hermione: [
      "Excellent progress! I knew you could do it!",
      "This is better than getting an Outstanding!",
      "You're mastering this like a true scholar!",
    ],
    ron: ["Bloody brilliant, mate!", "You're doing better than me at wizard chess!", "This calls for a celebration!"],
    luna: [
      "The Nargles are definitely impressed!",
      "Your aura is absolutely radiant today!",
      "Wonderful! The Wrackspurts are leaving you alone!",
    ],
    draco: ["Impressive. Father would approve.", "You're showing real potential.", "Not bad. Not bad at all."],
    default: ["Great job! Keep it up!", "You're doing amazing!", "I'm proud of you!"],
  },
  sad: {
    harry: [
      "It's okay. Even I had to face Voldemort multiple times.",
      "Tomorrow's another chance to fight back.",
      "Remember, help will always be given at Hogwarts.",
    ],
    hermione: [
      "Don't worry, we can study this together.",
      "Failure is just another lesson to learn from.",
      "Even I failed at flying once. We'll get through this.",
    ],
    ron: [
      "Chin up, mate. Even I mess up sometimes.",
      "We Weasleys never give up!",
      "How about some chocolate frogs to cheer you up?",
    ],
    luna: [
      "Sometimes the journey matters more than the destination.",
      "The Thestrals understand. So do I.",
      "Sadness passes, like clouds before the moon.",
    ],
    draco: ["Malfoys don't sulk. We strategize.", "Use this setback as motivation.", "Tomorrow, we rise stronger."],
    default: ["It's okay, we all have tough days.", "Tomorrow is a new opportunity.", "I believe in you!"],
  },
  lazy: {
    harry: [
      "Even heroes need rest. But shall we do just one small quest?",
      "The Dursleys never let me rest, but a little break is fine.",
      "Ready when you are, no pressure.",
    ],
    hermione: [
      "A short break can improve productivity by 40%!",
      "Even I take study breaks. Want to start small?",
      "How about we read just one page together?",
    ],
    ron: [
      "I get it, mate. But mum would have my head if I didn't try.",
      "Just 5 minutes? Then back to the couch?",
      "Fred and George would say 'make it fun'!",
    ],
    luna: [
      "The Blibbering Humdingers say rest is wisdom.",
      "Perhaps the universe wants you to pause.",
      "When you're ready, the adventure awaits.",
    ],
    draco: ["Even Slytherins need to recharge.", "Rest now, dominate later.", "A strategic pause. Clever."],
    default: ["Feeling tired? Let's start small.", "Even tiny steps count.", "How about just 5 minutes?"],
  },
  powerful: {
    harry: [
      "You're channeling pure magic!",
      "This is how I felt when I cast my first Patronus!",
      "You could defeat a Dementor right now!",
    ],
    hermione: [
      "Your performance is exceeding all expectations!",
      "This is N.E.W.T. level excellence!",
      "Even Professor McGonagall would award points!",
    ],
    ron: [
      "Merlin's beard! You're on fire!",
      "This is better than winning the Quidditch Cup!",
      "You're absolutely smashing it!",
    ],
    luna: [
      "Your inner magic is fully awakened!",
      "The Crumple-Horned Snorkack would be honored!",
      "You're radiating pure brilliance!",
    ],
    draco: [
      "Now THIS is power worthy of a Malfoy!",
      "Unstoppable. Exactly as it should be.",
      "You're destined for greatness!",
    ],
    default: ["You're unstoppable!", "Nothing can stop us now!", "You're leveling up fast!"],
  },
  excited: {
    harry: [
      "This is like getting my Hogwarts letter all over again!",
      "Adventure awaits! Let's go!",
      "I feel like I'm about to catch the Golden Snitch!",
    ],
    hermione: [
      "Oh, I love starting new projects!",
      "This is more exciting than finding a rare book!",
      "Let's make a detailed plan!",
    ],
    ron: ["Wicked! This is gonna be great!", "Better than a box of Every Flavour Beans!", "Let's do this, mate!"],
    luna: ["The universe is aligning for us!", "I sense wonderful possibilities!", "How delightfully unexpected!"],
    draco: ["Finally, something worthy of my attention.", "This could be... interesting.", "Let's make it legendary."],
    default: ["This is so exciting!", "New adventures await!", "Ready for the challenge!"],
  },
  focused: {
    harry: [
      "Eyes on the Snitch. We've got this.",
      "Constant vigilance, as Mad-Eye would say.",
      "Stay sharp, stay ready.",
    ],
    hermione: [
      "Concentration is key. You're doing brilliantly.",
      "Focus like you're brewing Polyjuice Potion.",
      "Perfect attention to detail!",
    ],
    ron: [
      "Right, let's focus like we're in a chess match.",
      "No distractions. We're winning this.",
      "Steady on, mate. You've got this.",
    ],
    luna: [
      "Your mind is clear as a Pensieve.",
      "The Wrackspurts can't break your focus.",
      "Such beautiful concentration.",
    ],
    draco: ["Precision. Excellence. Focus.", "This is how champions work.", "Maintain this intensity."],
    default: ["Great concentration!", "Stay in the zone!", "Perfect focus!"],
  },
}

const houseColors: Record<string, string> = {
  Gryffindor: "from-red-600/20 to-amber-500/20 border-red-500/30",
  Ravenclaw: "from-blue-600/20 to-sky-400/20 border-blue-500/30",
  Slytherin: "from-green-600/20 to-emerald-400/20 border-green-500/30",
  Hufflepuff: "from-yellow-500/20 to-amber-300/20 border-yellow-500/30",
}

export function AvatarCompanion({ avatarId, avatar, mood, level, lifeCoins, className }: AvatarCompanionProps) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  const currentAvatar = avatar || defaultAvatars[avatarId] || defaultAvatars.harry
  const house = currentAvatar.house || "Gryffindor"

  useEffect(() => {
    const avatarMessages = moodMessages[mood][avatarId] || moodMessages[mood].default
    const randomMessage = avatarMessages[Math.floor(Math.random() * avatarMessages.length)]
    setCurrentMessage(randomMessage)

    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 600)

    return () => clearTimeout(timer)
  }, [mood, avatarId])

  return (
    <Card className={`bg-gradient-to-br ${houseColors[house]} border ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className={`relative transition-transform duration-300 ${isAnimating ? "scale-105" : "scale-100"}`}>
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
              <img
                src={currentAvatar.image_url || "/placeholder.svg"}
                alt={currentAvatar.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Mood indicator */}
            <div className="absolute -bottom-1 -right-1 text-2xl">
              {mood === "happy" && "😊"}
              {mood === "sad" && "😢"}
              {mood === "lazy" && "😴"}
              {mood === "powerful" && "⚡"}
              {mood === "excited" && "🎉"}
              {mood === "focused" && "🎯"}
            </div>
          </div>

          {/* Avatar Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-serif text-lg font-semibold text-foreground">{currentAvatar.name}</h3>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Level {level}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {house}
                </Badge>
              </div>
            </div>

            {/* Mood Message */}
            <div className="bg-card/80 rounded-lg p-3 border border-border/50">
              <p className="text-sm text-foreground italic">"{currentMessage}"</p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">🪙</span>
                <span className="font-medium">{lifeCoins} LifeCoins</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="capitalize text-muted-foreground">Mood: {mood}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
