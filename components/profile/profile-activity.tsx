"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, ArrowUp, ArrowDown } from "lucide-react"
import type { Task, LifecoinTransaction } from "@/lib/types/database"

interface ProfileActivityProps {
  recentTasks: Task[]
  transactions: LifecoinTransaction[]
}

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
  failed: <XCircle className="w-4 h-4 text-red-500" />,
  pending: <Clock className="w-4 h-4 text-amber-500" />,
}

const categoryColors: Record<string, string> = {
  study: "bg-blue-100 text-blue-700",
  fitness: "bg-green-100 text-green-700",
  health: "bg-pink-100 text-pink-700",
  money: "bg-amber-100 text-amber-700",
  social: "bg-purple-100 text-purple-700",
  creative: "bg-cyan-100 text-cyan-700",
}

export function ProfileActivity({ recentTasks, transactions }: ProfileActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-4">
            {recentTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tasks yet. Start your journey!</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    {statusIcons[task.status]}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={categoryColors[task.category]} variant="secondary">
                          {task.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(task.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-primary">+{task.xp_reward} XP</p>
                      <p className="text-amber-600">+{task.coin_reward} coins</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    {tx.amount > 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{tx.reason}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</span>
                    </div>
                    <div className={`font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
