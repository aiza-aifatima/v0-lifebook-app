"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get all achievements
export async function getAllAchievements() {
  const supabase = await createClient()

  const { data } = await supabase.from("achievements").select("*").order("rarity", { ascending: true })

  return data || []
}

// Get user achievements
export async function getUserAchievements() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("user_achievements")
    .select("*, achievement:achievements(*)")
    .eq("user_id", user.id)
    .order("unlocked_at", { ascending: false })

  return data || []
}

// Check and unlock achievements
export async function checkAchievements() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  // Get user stats
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) return []

  // Get task counts
  const { count: tasksCompleted } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed")

  // Get boss defeat count
  const { count: bossesDefeated } = await supabase
    .from("user_boss_battles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "defeated")

  // Get friend count
  const { count: friendsCount } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .eq("status", "accepted")

  // Get unlocked regions count
  const { count: regionsUnlocked } = await supabase
    .from("user_map_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("unlocked", true)

  // Get all achievements
  const { data: allAchievements } = await supabase.from("achievements").select("*")

  // Get already unlocked achievements
  const { data: unlockedAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", user.id)

  const unlockedIds = new Set(unlockedAchievements?.map((a) => a.achievement_id) || [])

  // Check each achievement
  const stats = {
    tasks_completed: tasksCompleted || 0,
    streak: profile.streak_count,
    bosses_defeated: bossesDefeated || 0,
    total_coins: profile.lifecoins,
    friends: friendsCount || 0,
    regions_unlocked: regionsUnlocked || 0,
    level: profile.level,
  }

  const newlyUnlocked: string[] = []

  for (const achievement of allAchievements || []) {
    if (unlockedIds.has(achievement.id)) continue

    const requirement = achievement.requirement as Record<string, number>
    let isUnlocked = true

    for (const [key, value] of Object.entries(requirement)) {
      if (stats[key as keyof typeof stats] < value) {
        isUnlocked = false
        break
      }
    }

    if (isUnlocked) {
      // Unlock achievement
      await supabase.from("user_achievements").insert({
        user_id: user.id,
        achievement_id: achievement.id,
      })

      // Award rewards
      await supabase
        .from("profiles")
        .update({
          xp: profile.xp + achievement.xp_reward,
          lifecoins: profile.lifecoins + achievement.coin_reward,
        })
        .eq("id", user.id)

      // Create notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "achievement",
        title: "Achievement Unlocked!",
        message: `You unlocked "${achievement.name}" and earned ${achievement.coin_reward} coins!`,
        data: { achievement_id: achievement.id },
      })

      newlyUnlocked.push(achievement.id)
    }
  }

  if (newlyUnlocked.length > 0) {
    revalidatePath("/dashboard")
    revalidatePath("/profile")
  }

  return newlyUnlocked
}
