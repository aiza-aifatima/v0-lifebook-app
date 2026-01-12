import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the user to create their profile
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

        // Create profile if it doesn't exist
        if (!existingProfile) {
          const metadata = user.user_metadata || {}
          await supabase.from("profiles").insert({
            id: user.id,
            username: metadata.username || user.email?.split("@")[0] || `user_${Date.now()}`,
            display_name: metadata.display_name || "New Adventurer",
            email: user.email || "",
            avatar_id: "harry",
            level: 1,
            xp: 0,
            lifecoins: 100,
            streak_count: 0,
            longest_streak: 0,
            legacy_score: 0,
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to error page if something went wrong
  return NextResponse.redirect(`${origin}/auth/error`)
}
