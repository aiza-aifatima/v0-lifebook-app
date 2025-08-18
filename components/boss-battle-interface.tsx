"use client"

import { useState } from "react"
import { useBossBattle } from "@/lib/boss-battle-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Zap, Sword } from "lucide-react"

export function BossBattleInterface() {
  const { state, completePenaltyTask, defeatBoss } = useBossBattle()
  const [completingTask, setCompletingTask] = useState<string | null>(null)

  if (!state.activeBoss) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">No Active Boss Battles</h3>
            <p className="text-green-600">Keep up your streaks to avoid spawning failure bosses!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const boss = state.activeBoss
  const healthPercentage = (boss.health / boss.maxHealth) * 100
  const completedTasks = boss.penaltyTasks.filter((task) => task.isCompleted).length
  const totalTasks = boss.penaltyTasks.length

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTask(taskId)

    // Simulate task completion time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    completePenaltyTask(taskId)
    setCompletingTask(null)
  }

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case "physical":
        return "bg-red-100 text-red-800"
      case "mental":
        return "bg-blue-100 text-blue-800"
      case "creative":
        return "bg-purple-100 text-purple-800"
      case "reflection":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Boss Display */}
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{boss.emoji}</div>
          <CardTitle className="text-2xl text-red-800">{boss.name}</CardTitle>
          <CardDescription className="text-red-600">{boss.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Boss Health</span>
                <span>
                  {Math.round(boss.health)}/{boss.maxHealth}
                </span>
              </div>
              <Progress value={healthPercentage} className="h-3" />
            </div>

            <div className="text-center">
              <Badge variant="destructive" className="text-sm">
                <Sword className="w-4 h-4 mr-1" />
                {completedTasks}/{totalTasks} Penalty Tasks Completed
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Penalty Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Defeat the Boss - Complete Penalty Tasks
          </CardTitle>
          <CardDescription>
            Complete these redemption tasks to damage the boss and restore your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {boss.penaltyTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  task.isCompleted ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold ${task.isCompleted ? "text-green-800" : "text-gray-800"}`}>
                        {task.title}
                      </h4>
                      <Badge className={getTaskTypeColor(task.type)}>{task.type}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {task.duration}min
                      </div>
                    </div>
                    <p className={`text-sm ${task.isCompleted ? "text-green-600" : "text-gray-600"}`}>
                      {task.description}
                    </p>
                  </div>

                  <div className="ml-4">
                    {task.isCompleted ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={completingTask === task.id}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {completingTask === task.id ? "Completing..." : "Complete Task"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Victory Message */}
      {boss.health === 0 && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Boss Defeated!</h3>
              <p className="text-green-600 mb-4">
                You've overcome your failure and turned it into growth. Your LifeCoins have been restored!
              </p>
              <Button onClick={defeatBoss} className="bg-green-600 hover:bg-green-700">
                Claim Victory Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
