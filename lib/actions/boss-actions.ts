"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get active boss battle
export async function getActiveBossBattle() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("user_boss_battles")
    .select("*, boss:boss_types(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  return data
}

// Spawn boss (when streak breaks)
export async function spawnBoss(bossId?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Check if there's already an active boss
  const { data: existingBattle } = await supabase
    .from("user_boss_battles")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (existingBattle) {
    return existingBattle
  }

  // Get available bosses
  const { data: bosses } = await supabase.from("boss_types").select("*")

  if (!bosses || bosses.length === 0) {
    throw new Error("No bosses available")
  }

  // Select random boss or specified boss
  const selectedBoss = bossId ? bosses.find((b) => b.id === bossId) : bosses[Math.floor(Math.random() * bosses.length)]

  if (!selectedBoss) {
    throw new Error("Boss not found")
  }

  const { data, error } = await supabase
    .from("user_boss_battles")
    .insert({
      user_id: user.id,
      boss_id: selectedBoss.id,
      current_health: selectedBoss.health,
      damage_dealt: 0,
      status: "active",
      penalty_tasks_completed: [],
    })
    .select("*, boss:boss_types(*)")
    .single()

  if (error) throw error

  // Create notification
  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "boss_spawn",
    title: "Boss Appeared!",
    message: `The ${selectedBoss.name} has appeared! Complete penalty tasks to defeat it.`,
    data: { boss_id: selectedBoss.id, battle_id: data.id },
  })

  revalidatePath("/dashboard")
  revalidatePath("/boss-battle")
  return data
}

// Complete penalty task
export async function completePenaltyTask(battleId: string, taskName: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Get battle
  const { data: battle } = await supabase
    .from("user_boss_battles")
    .select("*, boss:boss_types(*)")
    .eq("id", battleId)
    .eq("user_id", user.id)
    .single()

  if (!battle || battle.status !== "active") {
    throw new Error("Battle not found or not active")
  }

  const completedTasks = [...(battle.penalty_tasks_completed || []), taskName]
  const damagePerTask = Math.ceil(battle.boss.health / battle.boss.penalty_tasks.length)
  const newDamage = battle.damage_dealt + damagePerTask
  const newHealth = Math.max(0, battle.current_health - damagePerTask)

  // Check if boss is defeated
  const isDefeated = newHealth <= 0

  await supabase
    .from("user_boss_battles")
    .update({
      penalty_tasks_completed: completedTasks,
      damage_dealt: newDamage,
      current_health: newHealth,
      status: isDefeated ? "defeated" : "active",
      completed_at: isDefeated ? new Date().toISOString() : null,
    })
    .eq("id", battleId)

  // Award coins for completing penalty task
  const { data: profile } = await supabase.from("profiles").select("lifecoins").eq("id", user.id).single()

  if (profile) {
    const coinsEarned = 10
    await supabase
      .from("profiles")
      .update({ lifecoins: profile.lifecoins + coinsEarned })
      .eq("id", user.id)

    await supabase.from("lifecoin_transactions").insert({
      user_id: user.id,
      amount: coinsEarned,
      type: "earned",
      reason: `Completed penalty task: ${taskName}`,
      reference_id: battleId,
      balance_after: profile.lifecoins + coinsEarned,
    })
  }

  // If defeated, award bonus rewards
  if (isDefeated) {
    const { data: currentProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (currentProfile) {
      const rewards = battle.boss.rewards as { coins: number; xp: number }
      await supabase
        .from("profiles")
        .update({
          lifecoins: currentProfile.lifecoins + rewards.coins,
          xp: currentProfile.xp + rewards.xp,
          level: Math.floor((currentProfile.xp + rewards.xp) / 100) + 1,
        })
        .eq("id", user.id)

      await supabase.from("lifecoin_transactions").insert({
        user_id: user.id,
        amount: rewards.coins,
        type: "bonus",
        reason: `Defeated ${battle.boss.name}!`,
        reference_id: battleId,
        balance_after: currentProfile.lifecoins + rewards.coins,
      })

      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "achievement",
        title: "Boss Defeated!",
        message: `You defeated the ${battle.boss.name} and earned ${rewards.coins} coins and ${rewards.xp} XP!`,
        data: { boss_id: battle.boss.id, rewards },
      })
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/boss-battle")

  return { isDefeated, newHealth }
}

// Flee from boss (with penalty)
export async function fleeBoss(battleId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Update battle status
  await supabase
    .from("user_boss_battles")
    .update({
      status: "fled",
      completed_at: new Date().toISOString(),
    })
    .eq("id", battleId)
    .eq("user_id", user.id)

  // Apply flee penalty
  const { data: profile } = await supabase.from("profiles").select("lifecoins").eq("id", user.id).single()

  if (profile) {
    const penalty = 25
    const newBalance = Math.max(0, profile.lifecoins - penalty)

    await supabase.from("profiles").update({ lifecoins: newBalance }).eq("id", user.id)

    await supabase.from("lifecoin_transactions").insert({
      user_id: user.id,
      amount: -penalty,
      type: "lost",
      reason: "Fled from boss battle",
      reference_id: battleId,
      balance_after: newBalance,
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/boss-battle")
}

// Get boss battle history
export async function getBossBattleHistory(limit = 20) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("user_boss_battles")
    .select("*, boss:boss_types(*)")
    .eq("user_id", user.id)
    .neq("status", "active")
    .order("completed_at", { ascending: false })
    .limit(limit)

  return data || []
}
