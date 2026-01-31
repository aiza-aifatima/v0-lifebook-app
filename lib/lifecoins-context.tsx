"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface LifeCoinsTransaction {
  id: string
  type: "earned" | "spent" | "lost"
  amount: number
  reason: string
  timestamp: Date
  category: "task" | "purchase" | "failure" | "bonus" | "penalty"
}

interface LifeCoinsState {
  balance: number
  totalEarned: number
  totalSpent: number
  totalLost: number
  transactions: LifeCoinsTransaction[]
  streak: number
  lastActivity: Date | null
}

type LifeCoinsAction =
  | { type: "EARN"; amount: number; reason: string; category: "task" | "bonus" }
  | { type: "SPEND"; amount: number; reason: string; category: "purchase" }
  | { type: "LOSE"; amount: number; reason: string; category: "failure" | "penalty" }
  | { type: "UPDATE_STREAK"; streak: number }
  | { type: "RESET_STREAK" }

const initialState: LifeCoinsState = {
  balance: 150,
  totalEarned: 150,
  totalSpent: 0,
  totalLost: 0,
  transactions: [
    {
      id: "initial",
      type: "earned",
      amount: 150,
      reason: "Welcome bonus",
      timestamp: new Date(),
      category: "bonus",
    },
  ],
  streak: 0,
  lastActivity: null,
}

function lifeCoinsReducer(state: LifeCoinsState, action: LifeCoinsAction): LifeCoinsState {
  const generateId = () => Math.random().toString(36).substr(2, 9)

  switch (action.type) {
    case "EARN":
      const earnTransaction: LifeCoinsTransaction = {
        id: generateId(),
        type: "earned",
        amount: action.amount,
        reason: action.reason,
        timestamp: new Date(),
        category: action.category,
      }
      return {
        ...state,
        balance: state.balance + action.amount,
        totalEarned: state.totalEarned + action.amount,
        transactions: [earnTransaction, ...state.transactions],
        lastActivity: new Date(),
      }

    case "SPEND":
      if (state.balance < action.amount) {
        return state // Insufficient funds
      }
      const spendTransaction: LifeCoinsTransaction = {
        id: generateId(),
        type: "spent",
        amount: action.amount,
        reason: action.reason,
        timestamp: new Date(),
        category: action.category,
      }
      return {
        ...state,
        balance: state.balance - action.amount,
        totalSpent: state.totalSpent + action.amount,
        transactions: [spendTransaction, ...state.transactions],
        lastActivity: new Date(),
      }

    case "LOSE":
      const loseAmount = Math.min(action.amount, state.balance) // Can't lose more than you have
      const loseTransaction: LifeCoinsTransaction = {
        id: generateId(),
        type: "lost",
        amount: loseAmount,
        reason: action.reason,
        timestamp: new Date(),
        category: action.category,
      }
      return {
        ...state,
        balance: state.balance - loseAmount,
        totalLost: state.totalLost + loseAmount,
        transactions: [loseTransaction, ...state.transactions],
        lastActivity: new Date(),
      }

    case "UPDATE_STREAK":
      return {
        ...state,
        streak: action.streak,
      }

    case "RESET_STREAK":
      return {
        ...state,
        streak: 0,
      }

    default:
      return state
  }
}

const LifeCoinsContext = createContext<{
  state: LifeCoinsState
  earnCoins: (amount: number, reason: string, category?: "task" | "bonus") => void
  spendCoins: (amount: number, reason: string) => boolean
  loseCoins: (amount: number, reason: string, category?: "failure" | "penalty") => void
  updateStreak: (streak: number) => void
  resetStreak: () => void
} | null>(null)

export function LifeCoinsProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const getInitialState = () => {
    if (typeof window === 'undefined') return initialState
    const savedState = localStorage.getItem('lifebook_lifecoins_state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        // Convert timestamps back to Date objects
        return {
          ...parsed,
          lastActivity: parsed.lastActivity ? new Date(parsed.lastActivity) : null,
          transactions: parsed.transactions.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp),
          })),
        }
      } catch (e) {
        console.log('[v0] Failed to parse lifecoins state')
        return initialState
      }
    }
    return initialState
  }

  const [state, dispatch] = useReducer(lifeCoinsReducer, initialState, getInitialState)

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      ...state,
      transactions: state.transactions.map(t => ({
        ...t,
        timestamp: t.timestamp.toISOString(),
      })),
    }
    localStorage.setItem('lifebook_lifecoins_state', JSON.stringify(stateToSave))
  }, [state])

  const earnCoins = (amount: number, reason: string, category: "task" | "bonus" = "task") => {
    dispatch({ type: "EARN", amount, reason, category })
  }

  const spendCoins = (amount: number, reason: string): boolean => {
    if (state.balance >= amount) {
      dispatch({ type: "SPEND", amount, reason, category: "purchase" })
      return true
    }
    return false
  }

  const loseCoins = (amount: number, reason: string, category: "failure" | "penalty" = "failure") => {
    dispatch({ type: "LOSE", amount, reason, category })
  }

  const updateStreak = (streak: number) => {
    dispatch({ type: "UPDATE_STREAK", streak })
  }

  const resetStreak = () => {
    dispatch({ type: "RESET_STREAK" })
  }

  return (
    <LifeCoinsContext.Provider
      value={{
        state,
        earnCoins,
        spendCoins,
        loseCoins,
        updateStreak,
        resetStreak,
      }}
    >
      {children}
    </LifeCoinsContext.Provider>
  )
}

export function useLifeCoins() {
  const context = useContext(LifeCoinsContext)
  if (!context) {
    throw new Error("useLifeCoins must be used within a LifeCoinsProvider")
  }
  return context
}
