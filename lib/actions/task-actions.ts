"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get user tasks
export async function getUserTasks(status?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data } = await query
  return data || []
}

// Create task
export async function createTask(taskData: {
  title: string
  description?: string
  category: string
  difficulty: string
  due_date?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Calculate rewards based on difficulty
  const rewards: Record<string, { xp: number; coins: number }> = {
    easy: { xp: 10, coins: 5 },
    medium: { xp: 25, coins: 15 },
    hard: { xp: 50, coins: 30 },
    epic: { xp: 100, coins: 60 },
  }

  const reward = rewards[taskData.difficulty] || rewards.medium

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      difficulty: taskData.difficulty,
      xp_reward: reward.xp,
      coin_reward: reward.coins,
      due_date: taskData.due_date,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/dashboard")
  revalidatePath("/tasks")
  return data
}

// Complete task
export async function completeTask(taskId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Get task details
  const { data: task } = await supabase.from("tasks").select("*").eq("id", taskId).eq("user_id", user.id).single()

  if (!task) throw new Error("Task not found")

  // Update task status
  await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)

  // Get current profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile) {
    const newXP = profile.xp + task.xp_reward
    const newCoins = profile.lifecoins + task.coin_reward
    const newLevel = Math.floor(newXP / 100) + 1

    // Update profile
    await supabase
      .from("profiles")
      .update({
        xp: newXP,
        lifecoins: newCoins,
        level: newLevel,
        legacy_score: profile.legacy_score + task.xp_reward,
      })
      .eq("id", user.id)

    // Record transaction
    await supabase.from("lifecoin_transactions").insert({
      user_id: user.id,
      amount: task.coin_reward,
      type: "earned",
      reason: `Completed task: ${task.title}`,
      reference_id: taskId,
      balance_after: newCoins,
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/tasks")
  return { xp: task.xp_reward, coins: task.coin_reward }
}

// Fail task
export async function failTask(taskId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Get task details
  const { data: task } = await supabase.from("tasks").select("*").eq("id", taskId).eq("user_id", user.id).single()

  if (!task) throw new Error("Task not found")

  // Update task status
  await supabase.from("tasks").update({ status: "failed" }).eq("id", taskId)

  // Get current profile and apply penalty
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile) {
    const penalty = Math.floor(task.coin_reward / 2)
    const newCoins = Math.max(0, profile.lifecoins - penalty)

    await supabase.from("profiles").update({ lifecoins: newCoins, streak_count: 0 }).eq("id", user.id)

    // Record transaction
    await supabase.from("lifecoin_transactions").insert({
      user_id: user.id,
      amount: -penalty,
      type: "lost",
      reason: `Failed task: ${task.title}`,
      reference_id: taskId,
      balance_after: newCoins,
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/tasks")
}

// Delete task
export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/dashboard")
  revalidatePath("/tasks")
}
