// Database types for Lifebook
export interface Profile {
  id: string
  username: string
  display_name: string
  email: string
  bio?: string
  avatar_id: string
  avatar_customization: Record<string, unknown>
  level: number
  xp: number
  lifecoins: number
  streak_count: number
  longest_streak: number
  legacy_score: number
  is_online: boolean
  last_seen: string
  created_at: string
  updated_at: string
}

export interface Avatar {
  id: string
  name: string
  description?: string
  personality?: string
  image_url: string
  house?: string
  traits: string[]
  unlock_requirement: Record<string, unknown>
  is_premium: boolean
  created_at: string
}

export interface AvatarItem {
  id: string
  name: string
  category: "outfit" | "accessory" | "background" | "power"
  description?: string
  image_url?: string
  price: number
  rarity: "common" | "rare" | "epic" | "legendary"
  unlock_level: number
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  category: "study" | "fitness" | "health" | "money" | "social" | "creative"
  difficulty: "easy" | "medium" | "hard" | "epic"
  xp_reward: number
  coin_reward: number
  status: "pending" | "completed" | "failed" | "skipped"
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface Quest {
  id: string
  title: string
  description?: string
  category?: string
  quest_type: "daily" | "weekly" | "hidden" | "special"
  requirements: Record<string, unknown>
  xp_reward: number
  coin_reward: number
  unlock_condition: Record<string, unknown>
  is_active: boolean
  created_at: string
}

export interface BossType {
  id: string
  name: string
  description?: string
  image_url?: string
  health: number
  difficulty: "easy" | "medium" | "hard"
  penalty_tasks: string[]
  rewards: { coins: number; xp: number }
  created_at: string
}

export interface UserBossBattle {
  id: string
  user_id: string
  boss_id: string
  current_health: number
  damage_dealt: number
  status: "active" | "defeated" | "fled"
  penalty_tasks_completed: string[]
  started_at: string
  completed_at?: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  post_type: "update" | "achievement" | "milestone" | "challenge"
  visibility: "public" | "friends" | "private"
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_id?: string
  content: string
  likes_count: number
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Friendship {
  id: string
  user_id: string
  friend_id: string
  status: "pending" | "accepted" | "blocked"
  created_at: string
  updated_at: string
  friend?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message?: string
  data: Record<string, unknown>
  read: boolean
  created_at: string
}

export interface Achievement {
  id: string
  name: string
  description?: string
  icon?: string
  category?: string
  requirement: Record<string, unknown>
  xp_reward: number
  coin_reward: number
  rarity: "common" | "rare" | "epic" | "legendary"
  created_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  mood: "energized" | "happy" | "calm" | "tired" | "stressed" | "sad"
  energy_level: number
  notes?: string
  created_at: string
}

export interface Reflection {
  id: string
  user_id: string
  type: "win" | "loss" | "insight" | "gratitude" | "challenge"
  title: string
  content: string
  mood?: string
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface MapRegion {
  id: string
  name: string
  description?: string
  category: string
  image_url?: string
  landmarks: string[]
  unlock_requirement: number
  position: { x: number; y: number }
  created_at: string
}

export interface LifecoinTransaction {
  id: string
  user_id: string
  amount: number
  type: "earned" | "spent" | "lost" | "bonus"
  reason: string
  reference_id?: string
  balance_after: number
  created_at: string
}
