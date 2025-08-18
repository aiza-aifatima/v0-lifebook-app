"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTasks, type Task, type TaskCategory } from "@/lib/tasks-context"
import type { AvatarMood } from "./avatar-companion"

interface TaskListProps {
  onMoodChange?: (mood: AvatarMood) => void
  currentMood?: AvatarMood
}

const categoryEmojis: Record<TaskCategory, string> = {
  study: "📚",
  fitness: "💪",
  money: "💰",
  health: "🏥",
  social: "👥",
  creative: "🎨",
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  hard: "bg-red-100 text-red-700 border-red-200",
}

export function TaskList({ onMoodChange, currentMood }: TaskListProps) {
  const { state, completeTask, failTask, deleteTask } = useTasks()
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending")

  const filteredTasks = state.tasks.filter((task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  // Mood-based task suggestions
  const getMoodBasedTasks = () => {
    if (!currentMood) return filteredTasks

    const moodTaskMap: Record<AvatarMood, TaskCategory[]> = {
      lazy: ["easy"],
      sad: ["health", "social"],
      focused: ["study", "creative"],
      excited: ["fitness", "creative"],
      happy: ["social", "creative"],
      powerful: ["fitness", "money"],
    }

    // This is a simplified version - in real app would filter by actual difficulty/category
    return filteredTasks
  }

  const handleCompleteTask = (task: Task) => {
    completeTask(task.id)
    onMoodChange?.("happy")
  }

  const handleFailTask = (task: Task) => {
    failTask(task.id)
    onMoodChange?.("sad")
  }

  const getProgressPercentage = () => {
    const totalTasks = state.tasks.length
    const completedTasks = state.tasks.filter((t) => t.status === "completed").length
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-serif text-xl flex items-center justify-between">
          <span>Your Tasks</span>
          <Badge variant="secondary">{state.completedTasksToday} completed today</Badge>
        </CardTitle>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Overall Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <Button size="sm" variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
            Pending ({state.tasks.filter((t) => t.status === "pending").length})
          </Button>
          <Button
            size="sm"
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
          >
            Completed ({state.tasks.filter((t) => t.status === "completed").length})
          </Button>
          <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All ({state.tasks.length})
          </Button>
        </div>

        {/* Mood-based suggestions */}
        {currentMood && filter === "pending" && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Based on your {currentMood} mood, try focusing on lighter tasks or take a break!
            </p>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tasks found.</p>
              <p className="text-sm">Create your first task to get started!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => handleCompleteTask(task)}
                onFail={() => handleFailTask(task)}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface TaskCardProps {
  task: Task
  onComplete: () => void
  onFail: () => void
  onDelete: () => void
}

function TaskCard({ task, onComplete, onFail, onDelete }: TaskCardProps) {
  const categoryEmoji = categoryEmojis[task.category]
  const difficultyClass = difficultyColors[task.difficulty]

  return (
    <Card
      className={`transition-all duration-200 ${task.status === "completed" ? "bg-green-50 border-green-200" : task.status === "failed" ? "bg-red-50 border-red-200" : "hover:shadow-md"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{categoryEmoji}</span>
              <h4 className="font-medium">{task.title}</h4>
              <Badge className={`text-xs ${difficultyClass}`}>{task.difficulty}</Badge>
            </div>

            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>⏱️ {task.estimatedMinutes}min</span>
              <span>🪙 +{task.reward}</span>
              <span>💔 -{task.penalty}</span>
              {task.isRecurring && <span>🔄 Recurring</span>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-1 ml-4">
            {task.status === "pending" && (
              <>
                <Button size="sm" onClick={onComplete} className="text-xs">
                  ✅ Complete
                </Button>
                <Button size="sm" variant="destructive" onClick={onFail} className="text-xs">
                  ❌ Failed
                </Button>
              </>
            )}
            {task.status !== "pending" && (
              <Button size="sm" variant="outline" onClick={onDelete} className="text-xs bg-transparent">
                🗑️ Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
