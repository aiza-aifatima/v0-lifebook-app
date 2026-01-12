"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Check, X } from "lucide-react"
import { acceptFriendRequest } from "@/lib/actions/social-actions"
import type { Profile } from "@/lib/types/database"

const avatarImages: Record<string, string> = {
  harry: "/harry-potter-young-wizard-with-glasses-and-lightni.jpg",
  hermione: "/hermione-granger-young-witch-with-brown-curly-hair.jpg",
  ron: "/ron-weasley-young-wizard-with-red-hair-freckles-fr.jpg",
  luna: "/luna-lovegood-young-witch-with-blonde-wavy-hair-dr.jpg",
  draco: "/draco-malfoy-young-wizard-with-platinum-blonde-hai.jpg",
}

interface FriendsListProps {
  friends: Array<{ id: string; friend: Profile }>
  pendingRequests: Array<{ id: string; requester: Profile }>
  currentUserId: string
}

export function FriendsList({ friends, pendingRequests, currentUserId }: FriendsListProps) {
  const handleAccept = async (friendshipId: string) => {
    try {
      await acceptFriendRequest(friendshipId)
    } catch (error) {
      console.error("Failed to accept friend request:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Friend Requests
              <Badge variant="secondary">{pendingRequests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full overflow-hidden border">
                    <img
                      src={avatarImages[request.requester?.avatar_id || "harry"]}
                      alt={request.requester?.display_name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{request.requester?.display_name}</p>
                    <p className="text-xs text-muted-foreground">Level {request.requester?.level}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAccept(request.id)}>
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Friends
            <Badge variant="secondary">{friends.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <p className="text-center text-muted-foreground py-4 text-sm">No friends yet. Start connecting!</p>
          ) : (
            <div className="space-y-3">
              {friends.map((friendship) => (
                <div
                  key={friendship.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border">
                      <img
                        src={avatarImages[friendship.friend?.avatar_id || "harry"]}
                        alt={friendship.friend?.display_name || "Friend"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {friendship.friend?.is_online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{friendship.friend?.display_name}</p>
                    <p className="text-xs text-muted-foreground">Level {friendship.friend?.level}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
