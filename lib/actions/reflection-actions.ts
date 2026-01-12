"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get mood entries
export async function getMoodEntries(limit = 30) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  return data || []
}

// Create mood entry
export async function createMoodEntry(mood: string, energyLevel: number, notes?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("mood_entries")
    .insert({
      user_id: user.id,
      mood,
      energy_level: energyLevel,
      notes,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/reflection")
  revalidatePath("/dashboard")
  return data
}

// Get reflections
export async function getReflections(type?: string, limit = 50) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase
    .from("reflections")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (type) {
    query = query.eq("type", type)
  }

  const { data } = await query
  return data || []
}

// Create reflection
export async function createReflection(reflectionData: {
  type: string
  title: string
  content: string
  mood?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("reflections")
    .insert({
      user_id: user.id,
      type: reflectionData.type,
      title: reflectionData.title,
      content: reflectionData.content,
      mood: reflectionData.mood,
      is_private: true,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/reflection")
  return data
}

// Update reflection
export async function updateReflection(
  reflectionId: string,
  updates: {
    title?: string
    content?: string
    mood?: string
  },
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("reflections")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", reflectionId)
    .eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/reflection")
}

// Delete reflection
export async function deleteReflection(reflectionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("reflections").delete().eq("id", reflectionId).eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/reflection")
}

// Get weekly summary
export async function getWeeklySummary() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data: moods } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", weekAgo.toISOString())

  const { data: reflections } = await supabase
    .from("reflections")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", weekAgo.toISOString())

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .gte("completed_at", weekAgo.toISOString())

  return {
    moods: moods || [],
    reflections: reflections || [],
    tasksCompleted: tasks?.length || 0,
    averageEnergy: moods?.length ? moods.reduce((sum, m) => sum + m.energy_level, 0) / moods.length : 0,
    moodDistribution: moods?.reduce(
      (acc, m) => {
        acc[m.mood] = (acc[m.mood] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  }
}
