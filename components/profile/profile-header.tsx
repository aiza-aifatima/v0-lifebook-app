"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Edit2, Save, X, LogOut } from "lucide-react"
import { updateProfile, signOut } from "@/lib/actions/user-actions"
import { useRouter } from "next/navigation"
import type { Profile } from "@/lib/types/database"

const avatarImages: Record<string, string> = {
  harry: "/harry-potter-young-wizard-with-glasses-and-lightni.jpg",
  hermione: "/hermione-granger-young-witch-with-brown-curly-hair.jpg",
  ron: "/ron-weasley-young-wizard-with-red-hair-freckles-fr.jpg",
  luna: "/luna-lovegood-young-witch-with-blonde-wavy-hair-dr.jpg",
  draco: "/draco-malfoy-young-wizard-with-platinum-blonde-hai.jpg",
  neville: "/neville-longbottom-young-wizard-with-round-face-ki.jpg",
  ginny: "/ginny-weasley-young-witch-with-long-red-hair-athle.jpg",
  dumbledore: "/albus-dumbledore-elderly-wizard-with-long-white-be.jpg",
}

interface ProfileHeaderProps {
  profile: Profile
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [bio, setBio] = useState(profile.bio || "")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile({ display_name: displayName, bio })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const avatarUrl = avatarImages[profile.avatar_id] || avatarImages.harry

  return (
    <Card className="overflow-hidden">
      {/* Cover gradient */}
      <div className="h-32 bg-gradient-to-r from-primary via-secondary to-primary" />

      <CardContent className="relative pt-0 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl">
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={profile.display_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Actions */}
        {isOwnProfile && (
          <div className="flex justify-end gap-2 pt-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isLoading}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push("/settings")}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}

        {/* Profile Info */}
        <div className="mt-8 ml-2">
          {isEditing ? (
            <div className="space-y-4 max-w-md">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="text-xl font-bold"
              />
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
                rows={3}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-serif font-bold">{profile.display_name}</h1>
                <Badge variant="secondary">@{profile.username}</Badge>
                <Badge className="bg-primary/20 text-primary">Level {profile.level}</Badge>
              </div>
              {profile.bio && <p className="text-muted-foreground mt-2 max-w-2xl">{profile.bio}</p>}
            </>
          )}

          {/* Quick Stats */}
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="font-bold text-foreground">{profile.xp}</span>{" "}
              <span className="text-muted-foreground">XP</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{profile.lifecoins}</span>{" "}
              <span className="text-muted-foreground">LifeCoins</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{profile.streak_count}</span>{" "}
              <span className="text-muted-foreground">Day Streak</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{profile.legacy_score}</span>{" "}
              <span className="text-muted-foreground">Legacy Score</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
