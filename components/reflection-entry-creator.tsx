"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useReflection, type ReflectionType } from "@/lib/reflection-context"
import type { AvatarMood } from "@/components/avatar-companion"
import { useLifeCoins } from "@/lib/lifecoins-context"

interface ReflectionEntryCreatorProps {
  onClose?: () => void
  initialType?: ReflectionType
}

const reflectionTypes: { type: ReflectionType; label: string; emoji: string; description: string }[] = [
  { type: "win", label: "Win", emoji: "🎉", description: "Celebrate your achievements" },
  { type: "loss", label: "Loss", emoji: "💔", description: "Learn from setbacks" },
  { type: "mood", label: "Mood Check", emoji: "😊", description: "Track how you're feeling" },
  { type: "insight", label: "Insight", emoji: "💡", description: "Capture important realizations" },
  { type: "gratitude", label: "Gratitude", emoji: "🙏", description: "What you're thankful for" },
  { type: "challenge", label: "Challenge", emoji: "⚡", description: "Obstacles you're facing" },
]

const moodOptions: { mood: AvatarMood; label: string; emoji: string }[] = [
  { mood: "happy", label: "Happy", emoji: "😊" },
  { mood: "excited", label: "Excited", emoji: "🎉" },
  { mood: "focused", label: "Focused", emoji: "🎯" },
  { mood: "powerful", label: "Powerful", emoji: "💪" },
  { mood: "lazy", label: "Lazy", emoji: "😴" },
  { mood: "sad", label: "Sad", emoji: "😔" },
]

export function ReflectionEntryCreator({ onClose, initialType = "mood" }: ReflectionEntryCreatorProps) {
  const { addEntry, updateCurrentMood } = useReflection()
  const { state: lifeCoinsState } = useLifeCoins()

  const [formData, setFormData] = useState({
    type: initialType,
    title: "",
    content: "",
    mood: "happy" as AvatarMood,
    energy: [7],
    tags: [] as string[],
    isPrivate: true,
  })

  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      return
    }

    addEntry({
      type: formData.type,
      title: formData.title,
      content: formData.content,
      mood: formData.mood,
      energy: formData.energy[0],
      tags: formData.tags,
      lifeCoinsAtTime: lifeCoinsState.balance,
      streakAtTime: lifeCoinsState.streak,
      isPrivate: formData.isPrivate,
    })

    // Update current mood
    updateCurrentMood(formData.mood, formData.energy[0])

    // Reset form
    setFormData({
      type: initialType,
      title: "",
      content: "",
      mood: "happy",
      energy: [7],
      tags: [],
      isPrivate: true,
    })

    onClose?.()
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const selectedType = reflectionTypes.find((t) => t.type === formData.type)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-serif text-xl flex items-center space-x-2">
          <span>{selectedType?.emoji}</span>
          <span>New Reflection Entry</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          🔒 This is your private space - entries are never shared with anyone
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Entry Type */}
          <div className="space-y-2">
            <Label>Entry Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: ReflectionType) => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reflectionTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    <div className="flex items-center space-x-2">
                      <span>{type.emoji}</span>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={`e.g., ${selectedType?.type === "win" ? "Completed my first marathon!" : selectedType?.type === "loss" ? "Missed my study goal today" : "Feeling motivated today"}`}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Reflection</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your thoughts, feelings, and reflections here..."
              rows={5}
              required
            />
          </div>

          {/* Mood and Energy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Mood</Label>
              <Select
                value={formData.mood}
                onValueChange={(value: AvatarMood) => setFormData((prev) => ({ ...prev, mood: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.mood} value={mood.mood}>
                      <div className="flex items-center space-x-2">
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Energy Level: {formData.energy[0]}/10</Label>
              <Slider
                value={formData.energy}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, energy: value }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (Optional)</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              Save Reflection
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
