"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTasks, type Quest } from "@/lib/tasks-context"
import { useLifeCoins } from "@/lib/lifecoins-context"

export function QuestSystem() {
  const { state, checkQuestProgress } = useTasks()
  const { earnCoins } = useLifeCoins()

  const handleCompleteQuest = (quest: Quest) => {
    earnCoins(quest.reward, `Completed quest: ${quest.title}`, "bonus")
    // In real app, would dispatch quest completion
  }

  const getQuestProgress = (quest: Quest) => {
    const completedTasks = state.tasks.filter((t) => t.status === "completed")

    if (quest.requirements.completedTasks) {
      let relevantTasks = completedTasks

      if (quest.requirements.category) {
        relevantTasks = relevantTasks.filter((t) => t.category === quest.requirements.category)
      }

      if (quest.requirements.difficulty) {
        relevantTasks = relevantTasks.filter((t) => t.difficulty === quest.requirements.difficulty)
      }

      const progress = relevantTasks.length
      const target = quest.requirements.completedTasks
      return { progress, target, percentage: Math.min((progress / target) * 100, 100) }
    }

    return { progress: 0, target: 1, percentage: 0 }
  }

  const unlockedQuests = state.quests.filter((q) => q.isUnlocked && !q.isCompleted)
  const hiddenQuests = state.quests.filter((q) => !q.isUnlocked)
  const completedQuests = state.quests.filter((q) => q.isCompleted)

  return (
    <div className="space-y-6">
      {/* Available Quests */}
      {unlockedQuests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center space-x-2">
              <span>🎯</span>
              <span>Available Quests</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unlockedQuests.map((quest) => {
              const { progress, target, percentage } = getQuestProgress(quest)
              const isReady = percentage >= 100

              return (
                <Card key={quest.id} className={`${isReady ? "bg-green-50 border-green-200" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{quest.title}</h4>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            🪙 {quest.reward}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{quest.description}</p>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {progress}/{target}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      </div>

                      {isReady && (
                        <Button size="sm" onClick={() => handleCompleteQuest(quest)} className="ml-4">
                          Claim Reward
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Hidden Quests Hints */}
      {hiddenQuests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center space-x-2">
              <span>🔒</span>
              <span>Hidden Quests</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Complete more tasks to unlock secret quests with bonus rewards!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hiddenQuests.slice(0, 4).map((quest, index) => (
                <Card key={quest.id} className="bg-muted/30">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">❓</span>
                      <div>
                        <p className="text-sm font-medium">Mystery Quest #{index + 1}</p>
                        <p className="text-xs text-muted-foreground">Reward: 🪙 {quest.reward}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center space-x-2">
              <span>🏆</span>
              <span>Completed Quests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedQuests.map((quest) => (
                <Card key={quest.id} className="bg-green-50 border-green-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{quest.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Completed {quest.completedAt?.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">🪙 {quest.reward}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
