"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLifeCoins } from "@/lib/lifecoins-context"
import type { LifeCoinsTransaction } from "@/lib/lifecoins-context"

interface LifeCoinsDisplayProps {
  showDetails?: boolean
  className?: string
}

export function LifeCoinsDisplay({ showDetails = false, className }: LifeCoinsDisplayProps) {
  const { state } = useLifeCoins()
  const [showTransactions, setShowTransactions] = useState(false)

  const getTransactionColor = (transaction: LifeCoinsTransaction) => {
    switch (transaction.type) {
      case "earned":
        return "text-green-600"
      case "spent":
        return "text-blue-600"
      case "lost":
        return "text-red-600"
      default:
        return "text-foreground"
    }
  }

  const getTransactionIcon = (transaction: LifeCoinsTransaction) => {
    switch (transaction.type) {
      case "earned":
        return "+"
      case "spent":
        return "-"
      case "lost":
        return "-"
      default:
        return ""
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-serif text-xl">LifeCoins Wallet</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🪙</span>
            <span className="text-2xl font-bold text-yellow-600">{state.balance}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Balance Overview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-lg font-semibold text-green-600">{state.totalEarned}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-lg font-semibold text-blue-600">{state.totalSpent}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Lost</p>
            <p className="text-lg font-semibold text-red-600">{state.totalLost}</p>
          </div>
        </div>

        {/* Streak Display */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔥</span>
            <span className="font-medium">Current Streak</span>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {state.streak} days
          </Badge>
        </div>

        {showDetails && (
          <>
            {/* Transaction History Toggle */}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setShowTransactions(!showTransactions)}
            >
              {showTransactions ? "Hide" : "Show"} Transaction History
            </Button>

            {/* Transaction History */}
            {showTransactions && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-sm text-muted-foreground">Recent Transactions</h4>
                {state.transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{transaction.reason}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.timestamp)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className={`font-semibold ${getTransactionColor(transaction)}`}>
                        {getTransactionIcon(transaction)}
                        {transaction.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
