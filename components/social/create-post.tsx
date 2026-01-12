"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Globe, Users, Lock } from "lucide-react"
import { createPost } from "@/lib/actions/social-actions"
import type { Profile } from "@/lib/types/database"

const avatarImages: Record<string, string> = {
  harry: "/harry-potter-young-wizard-with-glasses-and-lightni.jpg",
  hermione: "/hermione-granger-young-witch-with-brown-curly-hair.jpg",
  ron: "/ron-weasley-young-wizard-with-red-hair-freckles-fr.jpg",
  luna: "/luna-lovegood-young-witch-with-blonde-wavy-hair-dr.jpg",
  draco: "/draco-malfoy-young-wizard-with-platinum-blonde-hai.jpg",
}

interface CreatePostProps {
  profile: Profile
}

export function CreatePost({ profile }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState("friends")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      await createPost(content, "update", visibility)
      setContent("")
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const visibilityIcons: Record<string, React.ReactNode> = {
    public: <Globe className="w-4 h-4" />,
    friends: <Users className="w-4 h-4" />,
    private: <Lock className="w-4 h-4" />,
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
            <img
              src={avatarImages[profile.avatar_id] || avatarImages.harry}
              alt={profile.display_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share your adventure..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Public
                    </span>
                  </SelectItem>
                  <SelectItem value="friends">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> Friends
                    </span>
                  </SelectItem>
                  <SelectItem value="private">
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Private
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSubmit} disabled={!content.trim() || isLoading}>
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
