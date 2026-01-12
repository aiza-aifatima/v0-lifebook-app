"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Post, Profile } from "@/lib/types/database"

export function useRealtimePosts(friendIds: string[]) {
  const [posts, setPosts] = useState<Array<Post & { profile: Profile }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Fetch initial posts
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, profile:profiles(*)")
        .in("user_id", friendIds)
        .order("created_at", { ascending: false })
        .limit(50)

      if (data) {
        setPosts(data as Array<Post & { profile: Profile }>)
      }
      setIsLoading(false)
    }

    fetchPosts()

    // Subscribe to new posts from friends
    const channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          const newPost = payload.new as Post

          // Only add if from a friend
          if (friendIds.includes(newPost.user_id)) {
            // Fetch the profile for the new post
            const { data: profile } = await supabase.from("profiles").select("*").eq("id", newPost.user_id).single()

            if (profile) {
              setPosts((prev) => [{ ...newPost, profile } as Post & { profile: Profile }, ...prev])
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          const updatedPost = payload.new as Post
          setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)))
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          const deletedPost = payload.old as Post
          setPosts((prev) => prev.filter((p) => p.id !== deletedPost.id))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [friendIds])

  return { posts, isLoading }
}
