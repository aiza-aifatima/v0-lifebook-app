"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get user feed (posts from friends)
export async function getFeed(limit = 20, offset = 0) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  // Get friend IDs
  const { data: friendships } = await supabase
    .from("friendships")
    .select("friend_id, user_id")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .eq("status", "accepted")

  const friendIds = friendships?.map((f) => (f.user_id === user.id ? f.friend_id : f.user_id)) || []
  friendIds.push(user.id) // Include own posts

  const { data } = await supabase
    .from("posts")
    .select(`*, profile:profiles(*)`)
    .in("user_id", friendIds)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  return data || []
}

// Create post
export async function createPost(content: string, postType = "update", visibility = "friends", imageUrl?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content,
      post_type: postType,
      visibility,
      image_url: imageUrl,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/social")
  return data
}

// Like post
export async function likePost(postId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (existingLike) {
    // Unlike
    await supabase.from("post_likes").delete().eq("id", existingLike.id)
    await supabase.rpc("decrement_likes", { post_id: postId })
  } else {
    // Like
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id })
    await supabase.rpc("increment_likes", { post_id: postId })

    // Create notification
    const { data: post } = await supabase.from("posts").select("user_id").eq("id", postId).single()
    if (post && post.user_id !== user.id) {
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single()
      await supabase.from("notifications").insert({
        user_id: post.user_id,
        type: "like",
        title: "New Like",
        message: `${profile?.display_name || "Someone"} liked your post`,
        data: { post_id: postId },
      })
    }
  }

  revalidatePath("/social")
}

// Add comment
export async function addComment(postId: string, content: string, parentId?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
      parent_id: parentId,
    })
    .select()
    .single()

  if (error) throw error

  // Increment comment count
  await supabase.rpc("increment_comments", { post_id: postId })

  // Create notification
  const { data: post } = await supabase.from("posts").select("user_id").eq("id", postId).single()
  if (post && post.user_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single()
    await supabase.from("notifications").insert({
      user_id: post.user_id,
      type: "comment",
      title: "New Comment",
      message: `${profile?.display_name || "Someone"} commented on your post`,
      data: { post_id: postId, comment_id: data.id },
    })
  }

  revalidatePath("/social")
  return data
}

// Send friend request
export async function sendFriendRequest(friendId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("friendships").insert({
    user_id: user.id,
    friend_id: friendId,
    status: "pending",
  })

  if (error) throw error

  // Create notification
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single()
  await supabase.from("notifications").insert({
    user_id: friendId,
    type: "friend_request",
    title: "Friend Request",
    message: `${profile?.display_name || "Someone"} wants to be your friend`,
    data: { from_user_id: user.id },
  })

  revalidatePath("/social")
}

// Accept friend request
export async function acceptFriendRequest(friendshipId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId)

  if (error) throw error

  revalidatePath("/social")
}

// Get notifications
export async function getNotifications(unreadOnly = false) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (unreadOnly) {
    query = query.eq("read", false)
  }

  const { data } = await query
  return data || []
}

// Mark notification as read
export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  await supabase.from("notifications").update({ read: true }).eq("id", notificationId).eq("user_id", user.id)

  revalidatePath("/social")
}
