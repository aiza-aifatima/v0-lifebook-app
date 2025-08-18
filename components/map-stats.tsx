"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTasks, type TaskCategory } from "@/lib/tasks-context"
import { useLifeCoins } from "@/lib/lifecoins-context"

const categoryEmojis: Record<TaskCategory, string> = {
  study: "📚",
  fitness: "💪",
  money: "💰",
  health: "🏥",
  social: "👥",
  creative: "🎨",
}

const categoryNames: Record<TaskCategory, string> = {
  study: "Knowledge Kingdom",
  fitness: "Strength Jungle",
  money: "Treasure Island",
  health: "Wellness Woods",
  social: "Friendship Fields",
  creative: "Imagination Isle",
}

export function MapStats() {
  const { state: tasksState, getTasksByCategory } = useTasks()
  const { state: lifeCoinsState } = useLifeCoins()

  const getOverallProgress = () => {
    const totalTasks = tasksState.tasks.length
    const completedTasks = tasksState.tasks.filter((t) => t.status === "completed").length
    return {
      completed: completedTasks,
      total: totalTasks,
      percentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    }
  }

  const getCategoryStats = () => {
    const categories: TaskCategory[] = ["study", "fitness", "money", "health", "social", "creative"]

    return categories.map((category) => {
      const categoryTasks = getTasksByCategory(category)
      const completedTasks = categoryTasks.filter((task) => task.status === "completed")

      return {
        category,
        name: categoryNames[category],
        emoji: categoryEmojis[category],
        completed: completedTasks.length,
        total: categoryTasks.length,
        percentage: categoryTasks.length > 0 ? (completedTasks.length / categoryTasks.length) * 100 : 0,
      }
    })
  }

  const overallProgress = getOverallProgress()
  const categoryStats = getCategoryStats()
  const exploredRegions = categoryStats.filter((stat) => stat.completed > 0).length

  return (
    <div className="space-y-6">
      {/* Overall Journey Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl flex items-center space-x-2">
            <span>🌟</span>
            <span>Journey Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">{overallProgress.completed}</p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-secondary">{exploredRegions}</p>
              <p className="text-sm text-muted-foreground">Regions Explored</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-yellow-600">{lifeCoinsState.balance}</p>
              <p className="text-sm text-muted-foreground">LifeCoins</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">{lifeCoinsState.streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Journey Progress</span>
              <span>{Math.round(overallProgress.percentage)}%</span>
            </div>
            <Progress value={overallProgress.percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Region Progress Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">🗺️ Region Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{stat.emoji}</span>
                    <span className="font-medium">{stat.name}</span>
                    {stat.completed === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Unexplored
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {stat.completed}/{stat.total}
                  </span>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl flex items-center space-x-2">
            <span>🏆</span>
            <span>Journey Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-lg border ${overallProgress.completed >= 5 ? "bg-green-50 border-green-200" : "bg-muted/30 border-border"}`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{overallProgress.completed >= 5 ? "🎯" : "⭕"}</span>
                <div>
                  <p className="font-medium text-sm">First Steps</p>
                  <p className="text-xs text-muted-foreground">Complete 5 tasks</p>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border ${exploredRegions >= 3 ? "bg-green-50 border-green-200" : "bg-muted/30 border-border"}`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{exploredRegions >= 3 ? "🗺️" : "⭕"}</span>
                <div>
                  <p className="font-medium text-sm">Explorer</p>
                  <p className="text-xs text-muted-foreground">Explore 3 regions</p>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border ${lifeCoinsState.balance >= 500 ? "bg-green-50 border-green-200" : "bg-muted/30 border-border"}`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{lifeCoinsState.balance >= 500 ? "💰" : "⭕"}</span>
                <div>
                  <p className="font-medium text-sm">Wealthy Traveler</p>
                  <p className="text-xs text-muted-foreground">Earn 500 LifeCoins</p>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border ${lifeCoinsState.streak >= 7 ? "bg-green-50 border-green-200" : "bg-muted/30 border-border"}`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{lifeCoinsState.streak >= 7 ? "🔥" : "⭕"}</span>
                <div>
                  <p className="font-medium text-sm">Consistent Journeyer</p>
                  <p className="text-xs text-muted-foreground">7-day streak</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
