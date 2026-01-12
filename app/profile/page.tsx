import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileAchievements } from "@/components/profile/profile-achievements"
import { ProfileActivity } from "@/components/profile/profile-activity"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: achievements } = await supabase
    .from("user_achievements")
    .select("*, achievement:achievements(*)")
    .eq("user_id", user.id)
    .limit(6)

  const { data: recentTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: transactions } = await supabase
    .from("lifecoin_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-lavender-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ProfileHeader profile={profile} isOwnProfile={true} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <ProfileStats profile={profile} />
            <ProfileActivity recentTasks={recentTasks || []} transactions={transactions || []} />
          </div>
          <div className="space-y-6">
            <ProfileAchievements achievements={achievements || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
