"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react"
import { likePost } from "@/lib/actions/social-actions"
import type { Post, Profile } from "@/lib/types/database"

const avatarImages: Record<string, string> = {
  harry: "/harry-potter-young-wizard-with-glasses-and-lightni.jpg",
  hermione: "/hermione-granger-young-witch-with-brown-curly-hair.jpg",
  ron: "/ron-weasley-young-wizard-with-red-hair-freckles-fr.jpg",
  luna: "/luna-lovegood-young-witch-with-blonde-wavy-hair-dr.jpg",
  draco: "/draco-malfoy-young-wizard-with-platinum-blonde-hai.jpg",
}

const postTypeColors: Record<string, string> = {
  update: "bg-blue-100 text-blue-700",
  achievement: "bg-amber-100 text-amber-700",
  milestone: "bg-purple-100 text-purple-700",
  challenge: "bg-red-100 text-red-700",
}

interface SocialFeedProps {
  posts: Array<Post & { profile: Profile }>
  currentUserId: string
}

export function SocialFeed({ posts, currentUserId }: SocialFeedProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId)
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  if (posts.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src={avatarImages[post.profile?.avatar_id || "harry"] || avatarImages.harry}
                    alt={post.profile?.display_name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.profile?.display_name || "Unknown"}</span>
                    <Badge variant="outline" className="text-xs">
                      Lvl {post.profile?.level || 1}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {post.post_type !== "update" && (
                  <Badge className={postTypeColors[post.post_type]}>{post.post_type}</Badge>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <p className="whitespace-pre-wrap">{post.content}</p>
            {post.image_url && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <img
                  src={post.image_url || "/placeholder.svg"}
                  alt="Post image"
                  className="w-full object-cover max-h-96"
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t pt-3">
            <div className="flex items-center gap-6 w-full">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-red-500"
                onClick={() => handleLike(post.id)}
              >
                <Heart className="w-4 h-4" />
                {post.likes_count > 0 && <span>{post.likes_count}</span>}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                {post.comments_count > 0 && <span>{post.comments_count}</span>}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Share2 className="w-4 h-4" />
                {post.shares_count > 0 && <span>{post.shares_count}</span>}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
