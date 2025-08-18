"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useLifeCoins } from "./lifecoins-context"
import { useTasks } from "./tasks-context"

export type BossType = "lazy-dragon" | "procrastination-monster" | "distraction-demon" | "negativity-shadow"

export interface Boss {
  id: string
  type: BossType
  name: string
  description: string
  emoji: string
  health: number
  maxHealth: number
  spawnedAt: Date
  defeatedAt?: Date
  penaltyTasks: PenaltyTask[]
}

export interface PenaltyTask {
  id: string
  title: string
  description: string
  type: "physical" | "mental" | "creative" | "reflection"
  duration: number // minutes
  isCompleted: boolean
  completedAt?: Date
}

interface BossBattleState {
  activeBoss: Boss | null
  defeatedBosses: Boss[]
  streakBreakCount: number
  lastStreakBreak: Date | null
}

type BossBattleAction =
  | { type: "SPAWN_BOSS"; bossType: BossType }
  | { type: "COMPLETE_PENALTY_TASK"; taskId: string }
  | { type: "DEFEAT_BOSS" }
  | { type: "RECORD_STREAK_BREAK" }

const bossTemplates: Record<BossType, Omit<Boss, "id" | "spawnedAt" | "penaltyTasks">> = {
  "lazy-dragon": {
    type: "lazy-dragon",
    name: "Lazy Dragon",
    description: "A sluggish dragon that feeds on procrastination and missed opportunities",
    emoji: "🐲",
    health: 100,
    maxHealth: 100,
  },
  "procrastination-monster": {
    type: "procrastination-monster",
    name: "Procrastination Monster",
    description: "A shadowy beast that grows stronger with every delayed task",
    emoji: "👹",
    health: 120,
    maxHealth: 120,
  },
  "distraction-demon": {
    type: "distraction-demon",
    name: "Distraction Demon",
    description: "A chaotic entity that thrives on scattered focus and wasted time",
    emoji: "😈",
    health: 80,
    maxHealth: 80,
  },
  "negativity-shadow": {
    type: "negativity-shadow",
    name: "Negativity Shadow",
    description: "A dark presence that whispers doubts and feeds on self-criticism",
    emoji: "👤",
    health: 150,
    maxHealth: 150,
  },
}

const penaltyTaskTemplates: Record<string, PenaltyTask[]> = {
  physical: [
    {
      id: "pushups",
      title: "20 Push-ups",
      description: "Build physical strength to overcome laziness",
      type: "physical",
      duration: 5,
      isCompleted: false,
    },
    {
      id: "squats",
      title: "30 Squats",
      description: "Power through with leg strength",
      type: "physical",
      duration: 5,
      isCompleted: false,
    },
    {
      id: "plank",
      title: "2-minute Plank",
      description: "Hold steady like your commitment",
      type: "physical",
      duration: 3,
      isCompleted: false,
    },
    {
      id: "jumping-jacks",
      title: "50 Jumping Jacks",
      description: "Jump back into action",
      type: "physical",
      duration: 5,
      isCompleted: false,
    },
  ],
  mental: [
    {
      id: "meditation",
      title: "10-minute Meditation",
      description: "Clear your mind and refocus",
      type: "mental",
      duration: 10,
      isCompleted: false,
    },
    {
      id: "reading",
      title: "Read for 15 minutes",
      description: "Feed your mind with knowledge",
      type: "mental",
      duration: 15,
      isCompleted: false,
    },
    {
      id: "planning",
      title: "Plan Tomorrow",
      description: "Create a clear path forward",
      type: "mental",
      duration: 10,
      isCompleted: false,
    },
  ],
  creative: [
    {
      id: "drawing",
      title: "5-minute Sketch",
      description: "Express creativity to break negative patterns",
      type: "creative",
      duration: 5,
      isCompleted: false,
    },
    {
      id: "writing",
      title: "Write 3 Gratitudes",
      description: "Shift focus to positive thoughts",
      type: "creative",
      duration: 5,
      isCompleted: false,
    },
    {
      id: "music",
      title: "Listen to Uplifting Music",
      description: "Elevate your mood and energy",
      type: "creative",
      duration: 10,
      isCompleted: false,
    },
  ],
  reflection: [
    {
      id: "journal-failure",
      title: "Journal About the Failure",
      description: "Understand what went wrong and how to improve",
      type: "reflection",
      duration: 10,
      isCompleted: false,
    },
    {
      id: "affirmations",
      title: "5 Positive Affirmations",
      description: "Rebuild confidence and self-belief",
      type: "reflection",
      duration: 5,
      isCompleted: false,
    },
    {
      id: "goal-review",
      title: "Review Your Goals",
      description: "Reconnect with your why",
      type: "reflection",
      duration: 8,
      isCompleted: false,
    },
  ],
}

const initialState: BossBattleState = {
  activeBoss: null,
  defeatedBosses: [],
  streakBreakCount: 0,
  lastStreakBreak: null,
}

function bossBattleReducer(state: BossBattleState, action: BossBattleAction): BossBattleState {
  switch (action.type) {
    case "SPAWN_BOSS":
      const template = bossTemplates[action.bossType]
      const penaltyTasks = [
        ...penaltyTaskTemplates.physical.slice(0, 1),
        ...penaltyTaskTemplates.mental.slice(0, 1),
        ...penaltyTaskTemplates.reflection.slice(0, 1),
      ].map((task) => ({ ...task, id: Math.random().toString(36).substr(2, 9) }))

      const newBoss: Boss = {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        spawnedAt: new Date(),
        penaltyTasks,
      }

      return {
        ...state,
        activeBoss: newBoss,
      }

    case "COMPLETE_PENALTY_TASK":
      if (!state.activeBoss) return state

      const updatedBoss = {
        ...state.activeBoss,
        penaltyTasks: state.activeBoss.penaltyTasks.map((task) =>
          task.id === action.taskId ? { ...task, isCompleted: true, completedAt: new Date() } : task,
        ),
      }

      // Calculate damage based on completed tasks
      const completedTasks = updatedBoss.penaltyTasks.filter((task) => task.isCompleted).length
      const totalTasks = updatedBoss.penaltyTasks.length
      const damagePerTask = updatedBoss.maxHealth / totalTasks
      const newHealth = Math.max(0, updatedBoss.maxHealth - completedTasks * damagePerTask)

      return {
        ...state,
        activeBoss: { ...updatedBoss, health: newHealth },
      }

    case "DEFEAT_BOSS":
      if (!state.activeBoss) return state

      const defeatedBoss = {
        ...state.activeBoss,
        defeatedAt: new Date(),
        health: 0,
      }

      return {
        ...state,
        activeBoss: null,
        defeatedBosses: [...state.defeatedBosses, defeatedBoss],
      }

    case "RECORD_STREAK_BREAK":
      return {
        ...state,
        streakBreakCount: state.streakBreakCount + 1,
        lastStreakBreak: new Date(),
      }

    default:
      return state
  }
}

const BossBattleContext = createContext<{
  state: BossBattleState
  spawnBoss: (bossType: BossType) => void
  completePenaltyTask: (taskId: string) => void
  defeatBoss: () => void
  checkForBossSpawn: () => void
} | null>(null)

export function BossBattleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bossBattleReducer, initialState)
  const { state: lifeCoinsState, earnCoins } = useLifeCoins()
  const { state: tasksState } = useTasks()

  const spawnBoss = (bossType: BossType) => {
    dispatch({ type: "SPAWN_BOSS", bossType })
    dispatch({ type: "RECORD_STREAK_BREAK" })
  }

  const completePenaltyTask = (taskId: string) => {
    dispatch({ type: "COMPLETE_PENALTY_TASK", taskId })

    // Award small LifeCoins for completing penalty tasks
    earnCoins(10, "Completed penalty task", "penalty")

    // Check if boss is defeated
    setTimeout(() => {
      if (state.activeBoss) {
        const completedTasks = state.activeBoss.penaltyTasks.filter((task) => task.isCompleted).length
        const totalTasks = state.activeBoss.penaltyTasks.length

        if (completedTasks === totalTasks) {
          defeatBoss()
        }
      }
    }, 100)
  }

  const defeatBoss = () => {
    if (!state.activeBoss) return

    // Award bonus LifeCoins for defeating boss
    const bonusReward = Math.floor(state.activeBoss.maxHealth / 2)
    earnCoins(bonusReward, `Defeated ${state.activeBoss.name}!`, "boss_defeat")

    dispatch({ type: "DEFEAT_BOSS" })
  }

  const checkForBossSpawn = () => {
    // Check if streak was broken (simplified logic)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const hasTasksYesterday = tasksState.tasks.some((task) => {
      if (!task.completedAt) return false
      const taskDate = new Date(task.completedAt)
      return taskDate.toDateString() === yesterday.toDateString()
    })

    // If no boss is active and no tasks were completed yesterday, spawn a boss
    if (!state.activeBoss && !hasTasksYesterday && tasksState.tasks.length > 0) {
      const bossTypes: BossType[] = ["lazy-dragon", "procrastination-monster", "distraction-demon", "negativity-shadow"]
      const randomBoss = bossTypes[Math.floor(Math.random() * bossTypes.length)]
      spawnBoss(randomBoss)
    }
  }

  // Check for boss spawn on component mount and when tasks change
  useEffect(() => {
    checkForBossSpawn()
  }, [tasksState.tasks.length])

  return (
    <BossBattleContext.Provider
      value={{
        state,
        spawnBoss,
        completePenaltyTask,
        defeatBoss,
        checkForBossSpawn,
      }}
    >
      {children}
    </BossBattleContext.Provider>
  )
}

export function useBossBattle() {
  const context = useContext(BossBattleContext)
  if (!context) {
    throw new Error("useBossBattle must be used within a BossBattleProvider")
  }
  return context
}
