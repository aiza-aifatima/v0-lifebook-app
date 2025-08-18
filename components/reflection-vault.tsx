"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReflection, type ReflectionEntry, type ReflectionType } from "@/lib/reflection-context"

const typeEmojis: Record<ReflectionType, string> = {
  win: "🎉",
  loss: "💔",
  mood: "😊",
  insight: "💡",
  gratitude: "🙏",
  challenge: "⚡",
}

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😔",
  lazy: "😴",
  powerful: "💪",
  excited: "🎉",
  focused: "🎯",
}

export function ReflectionVault() {
  const { state, deleteEntry } = useReflection()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<ReflectionType | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "mood" | "energy">("date")

  const filteredEntries = state.entries
    .filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = filterType === "all" || entry.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "energy":
          return b.energy - a.energy
        case "mood":
          return a.mood.localeCompare(b.mood)
        default:
          return 0
      }
    })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return "text-green-600"
    if (energy >= 6) return "text-yellow-600"
    if (energy >= 4) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl flex items-center space-x-2">
            <span>🔒</span>
            <span>Your Private Reflection Vault</span>
          </CardTitle>
          <p className="text-muted-foreground">
            A safe space for your thoughts, wins, losses, and personal growth. Only you can see these entries.
          </p>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Type</label>
              <Select value={filterType} onValueChange={(value: ReflectionType | "all") => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="win">🎉 Wins</SelectItem>
                  <SelectItem value="loss">💔 Losses</SelectItem>
                  <SelectItem value="mood">😊 Mood Checks</SelectItem>
                  <SelectItem value="insight">💡 Insights</SelectItem>
                  <SelectItem value="gratitude">🙏 Gratitude</SelectItem>
                  <SelectItem value="challenge">⚡ Challenges</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <Select value={sortBy} onValueChange={(value: "date" | "mood" | "energy") => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="energy">Energy Level</SelectItem>
                  <SelectItem value="mood">Mood</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No reflection entries found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start by creating your first reflection to track your journey.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <ReflectionEntryCard key={entry.id} entry={entry} onDelete={() => deleteEntry(entry.id)} />
          ))
        )}
      </div>
    </div>
  )
}

interface ReflectionEntryCardProps {
  entry: ReflectionEntry
  onDelete: () => void
}

function ReflectionEntryCard({ entry, onDelete }: ReflectionEntryCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return "text-green-600"
    if (energy >= 6) return "text-yellow-600"
    if (energy >= 4) return "text-orange-600"
    return "text-red-600"
  }

  const truncatedContent = entry.content.length > 200 ? entry.content.substring(0, 200) + "..." : entry.content

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{typeEmojis[entry.type]}</span>
              <div>
                <h3 className="font-semibold text-lg">{entry.title}</h3>
                <p className="text-sm text-muted-foreground">{formatDate(entry.createdAt)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              🗑️
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <p className="text-foreground leading-relaxed">{showFullContent ? entry.content : truncatedContent}</p>
            {entry.content.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-primary hover:text-primary/80 p-0 h-auto"
              >
                {showFullContent ? "Show less" : "Read more"}
              </Button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span>{moodEmojis[entry.mood]}</span>
                <span className="text-sm capitalize">{entry.mood}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>⚡</span>
                <span className={`text-sm font-medium ${getEnergyColor(entry.energy)}`}>{entry.energy}/10</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🪙</span>
                <span className="text-sm">{entry.lifeCoinsAtTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🔥</span>
                <span className="text-sm">{entry.streakAtTime}</span>
              </div>
            </div>

            {/* Tags */}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
