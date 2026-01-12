"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock } from "lucide-react"

interface ProfileAchievementsProps {
  achievements: Array<{
    id: string
    unlocked_at: string
    achievement: {
      id: string
      name: string
      description: string
      icon: string
      rarity: string
      xp_reward: number
      coin_reward: number
    }
  }>
}

const rarityColors: Record<string, string> = {
  common: "bg-slate-100 text-slate-700 border-slate-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-purple-100 text-purple-700 border-purple-300",
  legendary: "bg-amber-100 text-amber-700 border-amber-300",
}

export function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No achievements yet</p>
            <p className="text-sm">Complete tasks to earn badges!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border hover:bg-muted transition-colors"
              >
                <div className="text-2xl">{item.achievement.icon || "🏆"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{item.achievement.name}</h4>
                    <Badge className={rarityColors[item.achievement.rarity]}>{item.achievement.rarity}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
