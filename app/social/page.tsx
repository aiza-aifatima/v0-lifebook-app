import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SocialFeed } from "@/components/social/social-feed"
import { CreatePost } from "@/components/social/create-post"
import { FriendsList } from "@/components/social/friends-list"

export default async function SocialPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get posts for feed
  const { data: friendships } = await supabase
    .from("friendships")
    .select("friend_id, user_id")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .eq("status", "accepted")

  const friendIds = friendships?.map((f) => (f.user_id === user.id ? f.friend_id : f.user_id)) || []
  friendIds.push(user.id)

  const { data: posts } = await supabase
    .from("posts")
    .select(`*, profile:profiles(*)`)
    .in("user_id", friendIds)
    .order("created_at", { ascending: false })
    .limit(20)

  // Get friends for sidebar
  const { data: friends } = await supabase
    .from("friendships")
    .select(`*, friend:profiles!friendships_friend_id_fkey(*)`)
    .eq("user_id", user.id)
    .eq("status", "accepted")
    .limit(10)

  // Get pending friend requests
  const { data: pendingRequests } = await supabase
    .from("friendships")
    .select(`*, requester:profiles!friendships_user_id_fkey(*)`)
    .eq("friend_id", user.id)
    .eq("status", "pending")

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-lavender-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold mb-6">Social Hub</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <CreatePost profile={profile!} />
            <SocialFeed posts={posts || []} currentUserId={user.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FriendsList friends={friends || []} pendingRequests={pendingRequests || []} currentUserId={user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
