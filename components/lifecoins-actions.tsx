"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLifeCoins } from "@/lib/lifecoins-context"
import type { AvatarMood } from "./avatar-companion"

interface LifeCoinsActionsProps {
  onMoodChange?: (mood: AvatarMood) => void
  className?: string
}

export function LifeCoinsActions({ onMoodChange, className }: LifeCoinsActionsProps) {
  const { earnCoins, loseCoins, updateStreak, state } = useLifeCoins()
  const [lastAction, setLastAction] = useState<string>("")

  const handleTaskComplete = (difficulty: "easy" | "medium" | "hard") => {
    const rewards = { easy: 25, medium: 50, hard: 100 }
    const amount = rewards[difficulty]

    earnCoins(amount, `Completed ${difficulty} task`, "task")
    updateStreak(state.streak + 1)
    setLastAction(`Earned ${amount} coins!`)
    onMoodChange?.("happy")
  }

  const handleTaskFail = () => {
    const penalty = Math.min(30, state.balance) // Lose up to 30 coins
    loseCoins(penalty, "Failed to complete task", "failure")
    setLastAction(`Lost ${penalty} coins for task failure`)
    onMoodChange?.("sad")
  }

  const handleStreakBreak = () => {
    const penalty = Math.min(state.streak * 5, state.balance) // Lose 5 coins per streak day
    loseCoins(penalty, "Broke streak", "penalty")
    updateStreak(0)
    setLastAction(`Lost ${penalty} coins for breaking streak`)
    onMoodChange?.("lazy")
  }

  const handleBonusReward = () => {
    const bonus = 75
    earnCoins(bonus, "Daily login bonus", "bonus")
    setLastAction(`Earned ${bonus} bonus coins!`)
    onMoodChange?.("excited")
  }

  const handleTimeWarp = () => {
    // Time-Warp Mode: Detected wasted screen time
    const penalty = 20
    loseCoins(penalty, "Time wasted on screen", "penalty")
    setLastAction(`Lost ${penalty} coins for wasted time`)
    onMoodChange?.("lazy")
  }

  const handleRedemption = () => {
    // Redemption Quest: Complete to restore some lost coins
    const restoration = 15
    earnCoins(restoration, "Completed redemption quest", "bonus")
    setLastAction(`Restored ${restoration} coins through redemption!`)
    onMoodChange?.("focused")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-serif text-lg">LifeCoins Actions</CardTitle>
        {lastAction && <p className="text-sm text-muted-foreground italic">"{lastAction}"</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Task Completion */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Complete Tasks</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTaskComplete("easy")}
              className="flex flex-col items-center space-y-1 h-auto py-2"
            >
              <span className="text-green-500">+25</span>
              <span className="text-xs">Easy</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTaskComplete("medium")}
              className="flex flex-col items-center space-y-1 h-auto py-2"
            >
              <span className="text-blue-500">+50</span>
              <span className="text-xs">Medium</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTaskComplete("hard")}
              className="flex flex-col items-center space-y-1 h-auto py-2"
            >
              <span className="text-purple-500">+100</span>
              <span className="text-xs">Hard</span>
            </Button>
          </div>
        </div>

        {/* Failure Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Failure Consequences</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleTaskFail}
              className="flex flex-col items-center space-y-1 h-auto py-2"
            >
              <span className="text-white">-30</span>
              <span className="text-xs">Task Fail</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleStreakBreak}
              className="flex flex-col items-center space-y-1 h-auto py-2"
            >
              <span className="text-white">-{state.streak * 5}</span>
              <span className="text-xs">Break Streak</span>
            </Button>
          </div>
        </div>

        {/* Special Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Special Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleBonusReward}
              className="flex flex-col items-center space-y-1 h-auto py-2"
            >
              <span className="text-yellow-600">+75</span>
              <span className="text-xs">Daily Bonus</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRedemption}
              className="flex flex-col items-center space-y-1 h-auto py-2 bg-transparent"
            >
              <span className="text-green-600">+15</span>
              <span className="text-xs">Redemption</span>
            </Button>
          </div>
        </div>

        {/* Time-Warp Mode */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Time-Warp Mode</h4>
          <Button
            size="sm"
            variant="outline"
            onClick={handleTimeWarp}
            className="w-full flex items-center justify-center space-x-2 bg-transparent"
          >
            <span className="text-red-500">-20</span>
            <span className="text-xs">Screen Time Penalty</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
