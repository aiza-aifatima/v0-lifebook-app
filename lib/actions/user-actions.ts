"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get current user profile
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
}

// Update user profile
export async function updateProfile(formData: {
  display_name?: string
  bio?: string
  avatar_id?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("profiles")
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw error

  revalidatePath("/dashboard")
  revalidatePath("/profile")
}

// Add LifeCoins
export async function addLifeCoins(amount: number, reason: string, referenceId?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Get current balance
  const { data: profile } = await supabase.from("profiles").select("lifecoins").eq("id", user.id).single()

  if (!profile) throw new Error("Profile not found")

  const newBalance = profile.lifecoins + amount

  // Update profile
  await supabase.from("profiles").update({ lifecoins: newBalance }).eq("id", user.id)

  // Record transaction
  await supabase.from("lifecoin_transactions").insert({
    user_id: user.id,
    amount,
    type: amount > 0 ? "earned" : "lost",
    reason,
    reference_id: referenceId,
    balance_after: newBalance,
  })

  revalidatePath("/dashboard")
  return newBalance
}

// Update XP and level
export async function addXP(amount: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase.from("profiles").select("xp, level, legacy_score").eq("id", user.id).single()

  if (!profile) throw new Error("Profile not found")

  const newXP = profile.xp + amount
  const xpPerLevel = 100
  const newLevel = Math.floor(newXP / xpPerLevel) + 1
  const newLegacyScore = profile.legacy_score + amount

  await supabase
    .from("profiles")
    .update({
      xp: newXP,
      level: newLevel,
      legacy_score: newLegacyScore,
    })
    .eq("id", user.id)

  revalidatePath("/dashboard")
  return { xp: newXP, level: newLevel }
}

// Update streak
export async function updateStreak(increment: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_count, longest_streak")
    .eq("id", user.id)
    .single()

  if (!profile) throw new Error("Profile not found")

  const newStreak = increment ? profile.streak_count + 1 : 0
  const newLongestStreak = Math.max(profile.longest_streak, newStreak)

  await supabase
    .from("profiles")
    .update({
      streak_count: newStreak,
      longest_streak: newLongestStreak,
    })
    .eq("id", user.id)

  revalidatePath("/dashboard")
  return { streak: newStreak, longestStreak: newLongestStreak }
}

// Sign out
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/")
}
