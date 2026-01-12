"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Flame, Coins, Star, Trophy, TrendingUp, Target } from "lucide-react"
import type { Profile } from "@/lib/types/database"

interface ProfileStatsProps {
  profile: Profile
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const xpToNextLevel = 100
  const currentLevelXP = profile.xp % xpToNextLevel
  const xpProgress = (currentLevelXP / xpToNextLevel) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Your Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Level {profile.level}</span>
            <span className="text-muted-foreground">
              {currentLevelXP} / {xpToNextLevel} XP
            </span>
          </div>
          <Progress value={xpProgress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {xpToNextLevel - currentLevelXP} XP to Level {profile.level + 1}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg p-4 border border-amber-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-muted-foreground">LifeCoins</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{profile.lifecoins}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg p-4 border border-orange-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{profile.streak_count} days</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{profile.longest_streak} days</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total XP</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{profile.xp}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-4 border border-emerald-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Legacy Score</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{profile.legacy_score}</p>
          </div>

          <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/20 dark:to-cyan-950/20 rounded-lg p-4 border border-sky-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-sky-500" />
              <span className="text-sm text-muted-foreground">Level</span>
            </div>
            <p className="text-2xl font-bold text-sky-600">{profile.level}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
