"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get map regions with progress
export async function getMapProgress() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { regions: [], userProgress: [] }

  const { data: regions } = await supabase.from("map_regions").select("*")

  const { data: userProgress } = await supabase.from("user_map_progress").select("*").eq("user_id", user.id)

  return {
    regions: regions || [],
    userProgress: userProgress || [],
  }
}

// Update region progress
export async function updateRegionProgress(regionId: string, progressAmount: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Get current progress
  const { data: existingProgress } = await supabase
    .from("user_map_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("region_id", regionId)
    .single()

  if (existingProgress) {
    const newProgress = Math.min(100, existingProgress.progress + progressAmount)
    const wasLocked = !existingProgress.unlocked
    const nowUnlocked = newProgress >= 100

    await supabase
      .from("user_map_progress")
      .update({
        progress: newProgress,
        unlocked: nowUnlocked,
        unlocked_at: nowUnlocked && wasLocked ? new Date().toISOString() : existingProgress.unlocked_at,
      })
      .eq("id", existingProgress.id)

    // If newly unlocked, create notification
    if (nowUnlocked && wasLocked) {
      const { data: region } = await supabase.from("map_regions").select("name").eq("id", regionId).single()

      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "quest_unlock",
        title: "New Region Unlocked!",
        message: `You've unlocked the ${region?.name || "new region"}!`,
        data: { region_id: regionId },
      })
    }
  } else {
    await supabase.from("user_map_progress").insert({
      user_id: user.id,
      region_id: regionId,
      progress: progressAmount,
      unlocked: progressAmount >= 100,
      unlocked_at: progressAmount >= 100 ? new Date().toISOString() : null,
    })
  }

  revalidatePath("/map")
  revalidatePath("/dashboard")
}

// Get category progress (for updating map based on completed tasks)
export async function getCategoryProgress() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return {}

  const { data: tasks } = await supabase
    .from("tasks")
    .select("category")
    .eq("user_id", user.id)
    .eq("status", "completed")

  const categoryCount: Record<string, number> = {}
  tasks?.forEach((task) => {
    categoryCount[task.category] = (categoryCount[task.category] || 0) + 1
  })

  return categoryCount
}
