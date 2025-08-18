"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { AvatarMood } from "@/components/avatar-companion"

export type ReflectionType = "win" | "loss" | "mood" | "insight" | "gratitude" | "challenge"

export interface ReflectionEntry {
  id: string
  type: ReflectionType
  title: string
  content: string
  mood: AvatarMood
  energy: number // 1-10 scale
  tags: string[]
  createdAt: Date
  lifeCoinsAtTime: number
  streakAtTime: number
  isPrivate: boolean
}

export interface MoodSnapshot {
  date: Date
  mood: AvatarMood
  energy: number
  lifeCoins: number
  streak: number
  tasksCompleted: number
  reflectionCount: number
}

interface ReflectionState {
  entries: ReflectionEntry[]
  moodHistory: MoodSnapshot[]
  currentMood: AvatarMood
  currentEnergy: number
  weeklyGoals: string[]
  insights: string[]
}

type ReflectionAction =
  | { type: "ADD_ENTRY"; entry: ReflectionEntry }
  | { type: "UPDATE_ENTRY"; entryId: string; updates: Partial<ReflectionEntry> }
  | { type: "DELETE_ENTRY"; entryId: string }
  | { type: "ADD_MOOD_SNAPSHOT"; snapshot: MoodSnapshot }
  | { type: "UPDATE_CURRENT_MOOD"; mood: AvatarMood; energy: number }
  | { type: "ADD_WEEKLY_GOAL"; goal: string }
  | { type: "ADD_INSIGHT"; insight: string }

const initialState: ReflectionState = {
  entries: [],
  moodHistory: [],
  currentMood: "happy",
  currentEnergy: 7,
  weeklyGoals: [],
  insights: [],
}

function reflectionReducer(state: ReflectionState, action: ReflectionAction): ReflectionState {
  switch (action.type) {
    case "ADD_ENTRY":
      return {
        ...state,
        entries: [action.entry, ...state.entries],
      }

    case "UPDATE_ENTRY":
      return {
        ...state,
        entries: state.entries.map((entry) => (entry.id === action.entryId ? { ...entry, ...action.updates } : entry)),
      }

    case "DELETE_ENTRY":
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== action.entryId),
      }

    case "ADD_MOOD_SNAPSHOT":
      return {
        ...state,
        moodHistory: [action.snapshot, ...state.moodHistory].slice(0, 100), // Keep last 100 snapshots
      }

    case "UPDATE_CURRENT_MOOD":
      return {
        ...state,
        currentMood: action.mood,
        currentEnergy: action.energy,
      }

    case "ADD_WEEKLY_GOAL":
      return {
        ...state,
        weeklyGoals: [...state.weeklyGoals, action.goal],
      }

    case "ADD_INSIGHT":
      return {
        ...state,
        insights: [action.insight, ...state.insights].slice(0, 50), // Keep last 50 insights
      }

    default:
      return state
  }
}

const ReflectionContext = createContext<{
  state: ReflectionState
  addEntry: (entry: Omit<ReflectionEntry, "id" | "createdAt">) => void
  updateEntry: (entryId: string, updates: Partial<ReflectionEntry>) => void
  deleteEntry: (entryId: string) => void
  addMoodSnapshot: (snapshot: Omit<MoodSnapshot, "date">) => void
  updateCurrentMood: (mood: AvatarMood, energy: number) => void
  getEntriesByType: (type: ReflectionType) => ReflectionEntry[]
  getEntriesByDateRange: (startDate: Date, endDate: Date) => ReflectionEntry[]
  getMoodTrends: () => { mood: AvatarMood; count: number }[]
  getWeeklyReflection: () => {
    wins: ReflectionEntry[]
    losses: ReflectionEntry[]
    insights: ReflectionEntry[]
    moodChanges: MoodSnapshot[]
  }
} | null>(null)

export function ReflectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reflectionReducer, initialState)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addEntry = (entryData: Omit<ReflectionEntry, "id" | "createdAt">) => {
    const entry: ReflectionEntry = {
      ...entryData,
      id: generateId(),
      createdAt: new Date(),
    }
    dispatch({ type: "ADD_ENTRY", entry })
  }

  const updateEntry = (entryId: string, updates: Partial<ReflectionEntry>) => {
    dispatch({ type: "UPDATE_ENTRY", entryId, updates })
  }

  const deleteEntry = (entryId: string) => {
    dispatch({ type: "DELETE_ENTRY", entryId })
  }

  const addMoodSnapshot = (snapshotData: Omit<MoodSnapshot, "date">) => {
    const snapshot: MoodSnapshot = {
      ...snapshotData,
      date: new Date(),
    }
    dispatch({ type: "ADD_MOOD_SNAPSHOT", snapshot })
  }

  const updateCurrentMood = (mood: AvatarMood, energy: number) => {
    dispatch({ type: "UPDATE_CURRENT_MOOD", mood, energy })
  }

  const getEntriesByType = (type: ReflectionType) => {
    return state.entries.filter((entry) => entry.type === type)
  }

  const getEntriesByDateRange = (startDate: Date, endDate: Date) => {
    return state.entries.filter((entry) => entry.createdAt >= startDate && entry.createdAt <= endDate)
  }

  const getMoodTrends = () => {
    const moodCounts: Record<AvatarMood, number> = {
      happy: 0,
      sad: 0,
      lazy: 0,
      powerful: 0,
      excited: 0,
      focused: 0,
    }

    state.moodHistory.forEach((snapshot) => {
      moodCounts[snapshot.mood]++
    })

    return Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood: mood as AvatarMood, count }))
      .sort((a, b) => b.count - a.count)
  }

  const getWeeklyReflection = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weekEntries = getEntriesByDateRange(oneWeekAgo, new Date())
    const weekMoodHistory = state.moodHistory.filter((snapshot) => snapshot.date >= oneWeekAgo)

    return {
      wins: weekEntries.filter((entry) => entry.type === "win"),
      losses: weekEntries.filter((entry) => entry.type === "loss"),
      insights: weekEntries.filter((entry) => entry.type === "insight"),
      moodChanges: weekMoodHistory,
    }
  }

  return (
    <ReflectionContext.Provider
      value={{
        state,
        addEntry,
        updateEntry,
        deleteEntry,
        addMoodSnapshot,
        updateCurrentMood,
        getEntriesByType,
        getEntriesByDateRange,
        getMoodTrends,
        getWeeklyReflection,
      }}
    >
      {children}
    </ReflectionContext.Provider>
  )
}

export function useReflection() {
  const context = useContext(ReflectionContext)
  if (!context) {
    throw new Error("useReflection must be used within a ReflectionProvider")
  }
  return context
}
