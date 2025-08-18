"use client"

import { useState } from "react"
import { TaskCreator } from "@/components/task-creator"
import { TaskList } from "@/components/task-list"
import { QuestSystem } from "@/components/quest-system"
import { LifeCoinsDisplay } from "@/components/lifecoins-display"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AvatarMood } from "@/components/avatar-companion"

export default function TasksPage() {
  const [showTaskCreator, setShowTaskCreator] = useState(false)
  const [currentMood, setCurrentMood] = useState<AvatarMood>("happy")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Tasks & Quests</h1>
          <p className="text-muted-foreground">Complete tasks to earn LifeCoins and unlock hidden quests</p>
        </div>

        {/* LifeCoins Display */}
        <LifeCoinsDisplay className="max-w-2xl mx-auto" />

        {/* Main Content */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="quests">Quests</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-center">
              <Button onClick={() => setShowTaskCreator(!showTaskCreator)} className="bg-primary hover:bg-primary/90">
                {showTaskCreator ? "Hide Creator" : "Create New Task"}
              </Button>
            </div>

            {showTaskCreator && (
              <div className="max-w-md mx-auto">
                <TaskCreator onClose={() => setShowTaskCreator(false)} />
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              <TaskList onMoodChange={setCurrentMood} currentMood={currentMood} />
            </div>
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <QuestSystem />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
