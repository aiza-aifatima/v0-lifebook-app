'use client'

import { useGuest } from '@/lib/guest-context'
import { useLifeCoins } from '@/lib/lifecoins-context'
import { useTasks } from '@/lib/tasks-context'
import { useReflection } from '@/lib/reflection-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataManagement } from '@/components/data-management'
import { Calendar, Trophy, Flame } from 'lucide-react'

export default function GuestProfilePage() {
  const { guest } = useGuest()
  const router = useRouter()
  const { state: lifecoinsState } = useLifeCoins()
  const { state: tasksState } = useTasks()
  const { state: reflectionState } = useReflection()

  useEffect(() => {
    if (!guest?.guestName) {
      router.push('/')
    }
  }, [guest, router])

  if (!guest?.guestName) {
    return null
  }

  const completedTasks = tasksState.tasks.filter((t) => t.status === 'completed').length
  const totalTasks = tasksState.tasks.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-lavender-50 to-purple-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
              {guest.guestName.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              {guest.guestName}
            </h1>
            <p className="text-muted-foreground">
              Guest Session • Local Data Storage
            </p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* LifeCoins Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">LifeCoins</p>
                <p className="text-3xl font-bold text-foreground">
                  {lifecoinsState.balance}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </Card>

          {/* Tasks Completed Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold text-foreground">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
          </Card>

          {/* Streak Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-foreground">
                  {lifecoinsState.streak} days
                </p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Activity Summary */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reflections</p>
              <p className="text-2xl font-bold text-foreground">
                {reflectionState.entries.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quests Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {tasksState.quests.filter((q) => q.isCompleted).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground">
                {lifecoinsState.transactions.filter((t) => t.type === 'earn').length}
              </p>
            </div>
          </div>
        </Card>

        {/* Data Management Section */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Data Management</h2>
          <DataManagement />
        </div>

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-foreground mb-2">About Guest Mode</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All your data is stored locally on your device</li>
            <li>• No account or sign-up required</li>
            <li>• Your data persists across browser sessions</li>
            <li>• You can backup and restore your data anytime</li>
            <li>• Switch devices by exporting and importing your data</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
