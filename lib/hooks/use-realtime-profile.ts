"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types/database"

export function useRealtimeProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Fetch initial profile
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (data) {
        setProfile(data)
      }
      setIsLoading(false)
    }

    fetchProfile()

    // Subscribe to profile updates
    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setProfile(payload.new as Profile)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { profile, isLoading }
}
