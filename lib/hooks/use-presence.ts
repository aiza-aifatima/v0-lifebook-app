"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface PresenceState {
  id: string
  isOnline: boolean
  lastSeen: string
}

export function usePresence(userId: string) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, PresenceState>>({})

  useEffect(() => {
    const supabase = createClient()

    // Join presence channel
    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        const users: Record<string, PresenceState> = {}

        Object.entries(state).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            users[key] = {
              id: key,
              isOnline: true,
              lastSeen: new Date().toISOString(),
            }
          }
        })

        setOnlineUsers(users)
      })
      .on("presence", { event: "join" }, ({ key }) => {
        setOnlineUsers((prev) => ({
          ...prev,
          [key]: {
            id: key,
            isOnline: true,
            lastSeen: new Date().toISOString(),
          },
        }))
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setOnlineUsers((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            isOnline: false,
            lastSeen: new Date().toISOString(),
          },
        }))
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId,
            onlineAt: new Date().toISOString(),
          })
        }
      })

    // Update user's online status in database
    const updateOnlineStatus = async (isOnline: boolean) => {
      await supabase
        .from("profiles")
        .update({
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        })
        .eq("id", userId)
    }

    updateOnlineStatus(true)

    // Handle visibility change
    const handleVisibilityChange = () => {
      updateOnlineStatus(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Handle before unload
    const handleBeforeUnload = () => {
      updateOnlineStatus(false)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      updateOnlineStatus(false)
      supabase.removeChannel(channel)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [userId])

  const isUserOnline = (checkUserId: string) => {
    return onlineUsers[checkUserId]?.isOnline || false
  }

  return { onlineUsers, isUserOnline }
}
