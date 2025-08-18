"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTasks, type TaskCategory, type TaskDifficulty } from "@/lib/tasks-context"

interface TaskCreatorProps {
  onClose?: () => void
}

const categoryEmojis: Record<TaskCategory, string> = {
  study: "📚",
  fitness: "💪",
  money: "💰",
  health: "🏥",
  social: "👥",
  creative: "🎨",
}

const difficultyRewards = {
  easy: { reward: 25, penalty: 10, time: 15 },
  medium: { reward: 50, penalty: 20, time: 30 },
  hard: { reward: 100, penalty: 40, time: 60 },
}

export function TaskCreator({ onClose }: TaskCreatorProps) {
  const { addTask } = useTasks()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as TaskCategory,
    difficulty: "" as TaskDifficulty,
    isRecurring: false,
    estimatedMinutes: 30,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.category || !formData.difficulty) {
      return
    }

    const difficultyData = difficultyRewards[formData.difficulty]

    addTask({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      reward: difficultyData.reward,
      penalty: difficultyData.penalty,
      status: "pending",
      isRecurring: formData.isRecurring,
      estimatedMinutes: formData.estimatedMinutes,
    })

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "" as TaskCategory,
      difficulty: "" as TaskDifficulty,
      isRecurring: false,
      estimatedMinutes: 30,
    })

    onClose?.()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Create New Task</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Study for 30 minutes"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details about this task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: TaskCategory) => setFormData((prev) => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryEmojis).map(([category, emoji]) => (
                    <SelectItem key={category} value={category}>
                      {emoji} {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: TaskDifficulty) => {
                  const diffData = difficultyRewards[value as TaskDifficulty]
                  setFormData((prev) => ({
                    ...prev,
                    difficulty: value,
                    estimatedMinutes: diffData.time,
                  }))
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">🟢 Easy (+25 coins)</SelectItem>
                  <SelectItem value="medium">🟡 Medium (+50 coins)</SelectItem>
                  <SelectItem value="hard">🔴 Hard (+100 coins)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Estimated Time (minutes)</Label>
            <Input
              id="time"
              type="number"
              value={formData.estimatedMinutes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, estimatedMinutes: Number.parseInt(e.target.value) || 30 }))
              }
              min="5"
              max="480"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecurring: checked }))}
            />
            <Label htmlFor="recurring">Make this a recurring task</Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Task
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
