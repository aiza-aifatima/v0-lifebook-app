"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTasks, type TaskCategory } from "@/lib/tasks-context"
import { useLifeCoins } from "@/lib/lifecoins-context"

interface MapRegion {
  id: TaskCategory
  name: string
  emoji: string
  description: string
  color: string
  position: { x: number; y: number }
  unlockRequirement: number
  landmarks: string[]
}

const mapRegions: MapRegion[] = [
  {
    id: "study",
    name: "Knowledge Kingdom",
    emoji: "🏰",
    description: "Ancient libraries and wisdom towers",
    color: "bg-blue-100 border-blue-300",
    position: { x: 20, y: 30 },
    unlockRequirement: 0,
    landmarks: ["📚 Great Library", "🎓 Academy Tower", "🔬 Research Lab"],
  },
  {
    id: "fitness",
    name: "Strength Jungle",
    emoji: "🌴",
    description: "Wild training grounds and power peaks",
    color: "bg-green-100 border-green-300",
    position: { x: 70, y: 20 },
    unlockRequirement: 3,
    landmarks: ["💪 Power Peak", "🏃 Sprint Valley", "🧘 Zen Garden"],
  },
  {
    id: "money",
    name: "Treasure Island",
    emoji: "🏝️",
    description: "Golden shores and prosperity ports",
    color: "bg-yellow-100 border-yellow-300",
    position: { x: 80, y: 70 },
    unlockRequirement: 5,
    landmarks: ["💰 Gold Mine", "🏦 Prosperity Port", "💎 Diamond Cave"],
  },
  {
    id: "health",
    name: "Wellness Woods",
    emoji: "🌲",
    description: "Healing springs and vitality valleys",
    color: "bg-emerald-100 border-emerald-300",
    position: { x: 15, y: 75 },
    unlockRequirement: 2,
    landmarks: ["🏥 Healing Springs", "🍎 Vitality Valley", "🌿 Herb Garden"],
  },
  {
    id: "social",
    name: "Friendship Fields",
    emoji: "🌻",
    description: "Community centers and connection bridges",
    color: "bg-pink-100 border-pink-300",
    position: { x: 45, y: 60 },
    unlockRequirement: 4,
    landmarks: ["🤝 Unity Bridge", "🎉 Festival Grounds", "💬 Chat Cafe"],
  },
  {
    id: "creative",
    name: "Imagination Isle",
    emoji: "🎨",
    description: "Artistic studios and inspiration peaks",
    color: "bg-purple-100 border-purple-300",
    position: { x: 50, y: 15 },
    unlockRequirement: 6,
    landmarks: ["🎭 Art Studio", "🎵 Music Mountain", "✨ Dream Workshop"],
  },
]

export function ProgressMap() {
  const { state: tasksState, getTasksByCategory } = useTasks()
  const { state: lifeCoinsState } = useLifeCoins()
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null)
  const [showAvatarPath, setShowAvatarPath] = useState(true)

  const getRegionProgress = (region: MapRegion) => {
    const categoryTasks = getTasksByCategory(region.id)
    const completedTasks = categoryTasks.filter((task) => task.status === "completed")
    const totalTasks = categoryTasks.length

    return {
      completed: completedTasks.length,
      total: totalTasks,
      percentage: totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0,
      isUnlocked: completedTasks.length >= region.unlockRequirement,
    }
  }

  const getAvatarPosition = () => {
    // Calculate avatar position based on overall progress
    const totalCompleted = tasksState.tasks.filter((t) => t.status === "completed").length
    const progressFactor = Math.min(totalCompleted / 20, 1) // Max at 20 completed tasks

    // Move avatar along a path through the regions
    const pathPoints = [
      { x: 10, y: 50 }, // Starting point
      { x: 20, y: 30 }, // Knowledge Kingdom
      { x: 35, y: 25 }, // Towards Fitness
      { x: 50, y: 15 }, // Imagination Isle
      { x: 65, y: 20 }, // Strength Jungle
      { x: 75, y: 45 }, // Towards Money
      { x: 80, y: 70 }, // Treasure Island
      { x: 60, y: 65 }, // Towards Social
      { x: 45, y: 60 }, // Friendship Fields
      { x: 25, y: 70 }, // Towards Health
      { x: 15, y: 75 }, // Wellness Woods
    ]

    const pathIndex = Math.floor(progressFactor * (pathPoints.length - 1))
    return pathPoints[pathIndex] || pathPoints[0]
  }

  const avatarPosition = getAvatarPosition()

  return (
    <div className="space-y-6">
      {/* Map Header */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl flex items-center space-x-2">
            <span>🗺️</span>
            <span>Your Life Journey Map</span>
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Explore different regions by completing tasks in each life domain</p>
            <Button variant="outline" size="sm" onClick={() => setShowAvatarPath(!showAvatarPath)}>
              {showAvatarPath ? "Hide" : "Show"} Path
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Map */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full h-96 bg-gradient-to-br from-sky-100 via-green-50 to-blue-100 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
              {/* Clouds */}
              <div className="absolute top-4 left-8 w-12 h-6 bg-white/60 rounded-full blur-sm"></div>
              <div className="absolute top-8 right-16 w-16 h-8 bg-white/60 rounded-full blur-sm"></div>
              <div className="absolute top-12 left-1/3 w-10 h-5 bg-white/60 rounded-full blur-sm"></div>

              {/* Water/Ocean areas */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-200/50 rounded-full blur-lg"></div>
              <div className="absolute top-1/2 left-0 w-24 h-24 bg-blue-200/50 rounded-full blur-lg"></div>
            </div>

            {/* Avatar Path */}
            {showAvatarPath && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <path
                    id="avatar-path"
                    d="M 10,50 Q 20,30 35,25 Q 50,15 65,20 Q 75,45 80,70 Q 60,65 45,60 Q 25,70 15,75"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    opacity="0.6"
                  />
                </defs>
                <use href="#avatar-path" />
              </svg>
            )}

            {/* Map Regions */}
            {mapRegions.map((region) => {
              const progress = getRegionProgress(region)
              const isSelected = selectedRegion?.id === region.id

              return (
                <div
                  key={region.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    progress.isUnlocked ? "opacity-100" : "opacity-50"
                  } ${isSelected ? "scale-110 z-10" : "hover:scale-105"}`}
                  style={{
                    left: `${region.position.x}%`,
                    top: `${region.position.y}%`,
                  }}
                  onClick={() => setSelectedRegion(isSelected ? null : region)}
                >
                  <Card
                    className={`w-24 h-24 ${region.color} ${isSelected ? "ring-2 ring-primary" : ""} ${!progress.isUnlocked ? "grayscale" : ""}`}
                  >
                    <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                      <div className="text-2xl mb-1">{region.emoji}</div>
                      <div className="text-xs font-medium text-center leading-tight">
                        {region.name.split(" ").map((word, i) => (
                          <div key={i}>{word}</div>
                        ))}
                      </div>
                      {progress.isUnlocked && (
                        <div className="absolute -top-1 -right-1">
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {progress.completed}
                          </Badge>
                        </div>
                      )}
                      {!progress.isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <span className="text-lg">🔒</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}

            {/* Avatar Position */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-in-out"
              style={{
                left: `${avatarPosition.x}%`,
                top: `${avatarPosition.y}%`,
              }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-2 bg-black/20 rounded-full blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Region Details */}
      {selectedRegion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">{selectedRegion.emoji}</span>
              <span className="font-serif">{selectedRegion.name}</span>
              {!getRegionProgress(selectedRegion).isUnlocked && <Badge variant="secondary">🔒 Locked</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{selectedRegion.description}</p>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Region Progress</span>
                <span>
                  {getRegionProgress(selectedRegion).completed}/{getRegionProgress(selectedRegion).total} tasks
                </span>
              </div>
              <Progress value={getRegionProgress(selectedRegion).percentage} className="h-2" />
            </div>

            {/* Unlock Requirements */}
            {!getRegionProgress(selectedRegion).isUnlocked && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">🔒 Unlock Requirements</p>
                <p className="text-sm text-muted-foreground">
                  Complete {selectedRegion.unlockRequirement} tasks in this category to unlock this region
                </p>
              </div>
            )}

            {/* Landmarks */}
            {getRegionProgress(selectedRegion).isUnlocked && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">🏛️ Landmarks</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {selectedRegion.landmarks.map((landmark, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-2 text-center">
                        <p className="text-sm">{landmark}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">🧭 Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
              <span>Your Avatar</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Unlocked Region</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded opacity-50"></div>
              <span>Locked Region</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-1 bg-purple-400 rounded"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #8B5CF6 0px, #8B5CF6 5px, transparent 5px, transparent 10px)",
                }}
              ></div>
              <span>Your Journey Path</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
