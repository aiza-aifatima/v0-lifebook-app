"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useLifeCoins } from "./lifecoins-context"

export type TaskDifficulty = "easy" | "medium" | "hard"
export type TaskCategory = "study" | "fitness" | "money" | "health" | "social" | "creative"
export type TaskStatus = "pending" | "completed" | "failed" | "skipped"

export interface Task {
  id: string
  title: string
  description: string
  category: TaskCategory
  difficulty: TaskDifficulty
  reward: number
  penalty: number
  dueDate?: Date
  createdAt: Date
  completedAt?: Date
  status: TaskStatus
  isRecurring: boolean
  recurringDays?: number[]
  estimatedMinutes: number
}

export interface Quest {
  id: string
  title: string
  description: string
  type: "hidden" | "bonus" | "streak" | "challenge"
  requirements: {
    streakDays?: number
    completedTasks?: number
    category?: TaskCategory
    difficulty?: TaskDifficulty
  }
  reward: number
  isUnlocked: boolean
  isCompleted: boolean
  unlockedAt?: Date
  completedAt?: Date
}

interface TasksState {
  tasks: Task[]
  quests: Quest[]
  completedTasksToday: number
  currentStreak: number
  lastCompletionDate: Date | null
}

type TasksAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; taskId: string; updates: Partial<Task> }
  | { type: "DELETE_TASK"; taskId: string }
  | { type: "COMPLETE_TASK"; taskId: string }
  | { type: "FAIL_TASK"; taskId: string }
  | { type: "UNLOCK_QUEST"; questId: string }
  | { type: "COMPLETE_QUEST"; questId: string }
  | { type: "UPDATE_DAILY_STATS" }

const initialQuests: Quest[] = [
  {
    id: "first-week",
    title: "First Week Warrior",
    description: "Complete tasks for 7 consecutive days",
    type: "streak",
    requirements: { streakDays: 7 },
    reward: 200,
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: "study-master",
    title: "Study Master",
    description: "Complete 10 study tasks",
    type: "hidden",
    requirements: { completedTasks: 10, category: "study" },
    reward: 150,
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: "fitness-champion",
    title: "Fitness Champion",
    description: "Complete 5 hard fitness tasks",
    type: "hidden",
    requirements: { completedTasks: 5, category: "fitness", difficulty: "hard" },
    reward: 300,
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: "daily-grind",
    title: "Daily Grind",
    description: "Complete 5 tasks in a single day",
    type: "challenge",
    requirements: { completedTasks: 5 },
    reward: 100,
    isUnlocked: true,
    isCompleted: false,
  },
]

const initialState: TasksState = {
  tasks: [],
  quests: initialQuests,
  completedTasksToday: 0,
  currentStreak: 0,
  lastCompletionDate: null,
}

function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.task],
      }

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.taskId ? { ...task, ...action.updates } : task)),
      }

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
      }

    case "COMPLETE_TASK":
      const completedTask = state.tasks.find((task) => task.id === action.taskId)
      if (!completedTask) return state

      const today = new Date().toDateString()
      const lastCompletion = state.lastCompletionDate?.toDateString()
      const isNewDay = today !== lastCompletion

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, status: "completed", completedAt: new Date() } : task,
        ),
        completedTasksToday: isNewDay ? 1 : state.completedTasksToday + 1,
        lastCompletionDate: new Date(),
      }

    case "FAIL_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.taskId ? { ...task, status: "failed" } : task)),
      }

    case "UNLOCK_QUEST":
      return {
        ...state,
        quests: state.quests.map((quest) =>
          quest.id === action.questId ? { ...quest, isUnlocked: true, unlockedAt: new Date() } : quest,
        ),
      }

    case "COMPLETE_QUEST":
      return {
        ...state,
        quests: state.quests.map((quest) =>
          quest.id === action.questId ? { ...quest, isCompleted: true, completedAt: new Date() } : quest,
        ),
      }

    default:
      return state
  }
}

const TasksContext = createContext<{
  state: TasksState
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  completeTask: (taskId: string) => void
  failTask: (taskId: string) => void
  checkQuestProgress: () => void
  getTasksByCategory: (category: TaskCategory) => Task[]
  getAvailableQuests: () => Quest[]
} | null>(null)

export function TasksProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const getInitialState = () => {
    if (typeof window === 'undefined') return initialState
    const savedState = localStorage.getItem('lifebook_tasks_state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        // Convert timestamps back to Date objects
        return {
          ...parsed,
          tasks: parsed.tasks.map((t: any) => ({
            ...t,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
            createdAt: new Date(t.createdAt),
            completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
          })),
          lastCompletionDate: parsed.lastCompletionDate ? new Date(parsed.lastCompletionDate) : null,
        }
      } catch (e) {
        console.log('[v0] Failed to parse tasks state')
        return initialState
      }
    }
    return initialState
  }

  const [state, dispatch] = useReducer(tasksReducer, initialState, getInitialState)
  const { earnCoins, loseCoins, updateStreak, state: lifeCoinsState } = useLifeCoins()

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      ...state,
      tasks: state.tasks.map(t => ({
        ...t,
        dueDate: t.dueDate?.toISOString(),
        createdAt: t.createdAt.toISOString(),
        completedAt: t.completedAt?.toISOString(),
      })),
      lastCompletionDate: state.lastCompletionDate?.toISOString(),
    }
    localStorage.setItem('lifebook_tasks_state', JSON.stringify(stateToSave))
  }, [state])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const task: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
    }
    dispatch({ type: "ADD_TASK", task })
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: "UPDATE_TASK", taskId, updates })
  }

  const deleteTask = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", taskId })
  }

  const completeTask = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return

    // Award LifeCoins
    earnCoins(task.reward, `Completed: ${task.title}`, "task")

    // Update streak
    updateStreak(lifeCoinsState.streak + 1)

    // Complete the task
    dispatch({ type: "COMPLETE_TASK", taskId })

    // Check for quest progress
    setTimeout(() => checkQuestProgress(), 100)
  }

  const failTask = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return

    // Lose LifeCoins
    loseCoins(task.penalty, `Failed: ${task.title}`, "failure")

    // Mark as failed
    dispatch({ type: "FAIL_TASK", taskId })
  }

  const checkQuestProgress = () => {
    const completedTasks = state.tasks.filter((t) => t.status === "completed")

    state.quests.forEach((quest) => {
      if (quest.isCompleted || quest.isUnlocked) return

      let shouldUnlock = false

      // Check requirements
      if (quest.requirements.streakDays && lifeCoinsState.streak >= quest.requirements.streakDays) {
        shouldUnlock = true
      }

      if (quest.requirements.completedTasks) {
        let relevantTasks = completedTasks

        if (quest.requirements.category) {
          relevantTasks = relevantTasks.filter((t) => t.category === quest.requirements.category)
        }

        if (quest.requirements.difficulty) {
          relevantTasks = relevantTasks.filter((t) => t.difficulty === quest.requirements.difficulty)
        }

        if (relevantTasks.length >= quest.requirements.completedTasks) {
          shouldUnlock = true
        }
      }

      if (shouldUnlock) {
        dispatch({ type: "UNLOCK_QUEST", questId: quest.id })
      }
    })
  }

  const getTasksByCategory = (category: TaskCategory) => {
    return state.tasks.filter((task) => task.category === category)
  }

  const getAvailableQuests = () => {
    return state.quests.filter((quest) => quest.isUnlocked && !quest.isCompleted)
  }

  return (
    <TasksContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        failTask,
        checkQuestProgress,
        getTasksByCategory,
        getAvailableQuests,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}
