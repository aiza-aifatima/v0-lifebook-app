-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_boss_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_map_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecoin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_warp_sessions ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- AVATARS & ITEMS (Read-only for users, public access)
CREATE POLICY "Anyone can view avatars" ON avatars FOR SELECT USING (true);
CREATE POLICY "Anyone can view avatar items" ON avatar_items FOR SELECT USING (true);

-- USER AVATAR ITEMS
CREATE POLICY "Users can view their own avatar items" ON user_avatar_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own avatar items" ON user_avatar_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own avatar items" ON user_avatar_items FOR UPDATE USING (auth.uid() = user_id);

-- TASKS
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- QUESTS (Read-only for users)
CREATE POLICY "Anyone can view quests" ON quests FOR SELECT USING (true);

-- USER QUESTS
CREATE POLICY "Users can view their own quests" ON user_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quests" ON user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quests" ON user_quests FOR UPDATE USING (auth.uid() = user_id);

-- BOSS TYPES (Read-only)
CREATE POLICY "Anyone can view boss types" ON boss_types FOR SELECT USING (true);

-- USER BOSS BATTLES
CREATE POLICY "Users can view their own boss battles" ON user_boss_battles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own boss battles" ON user_boss_battles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own boss battles" ON user_boss_battles FOR UPDATE USING (auth.uid() = user_id);

-- MAP REGIONS (Read-only)
CREATE POLICY "Anyone can view map regions" ON map_regions FOR SELECT USING (true);

-- USER MAP PROGRESS
CREATE POLICY "Users can view their own map progress" ON user_map_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own map progress" ON user_map_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own map progress" ON user_map_progress FOR UPDATE USING (auth.uid() = user_id);

-- MOOD ENTRIES (Private)
CREATE POLICY "Users can view their own mood entries" ON mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mood entries" ON mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood entries" ON mood_entries FOR DELETE USING (auth.uid() = user_id);

-- REFLECTIONS (Private)
CREATE POLICY "Users can view their own reflections" ON reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reflections" ON reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reflections" ON reflections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reflections" ON reflections FOR DELETE USING (auth.uid() = user_id);

-- LIFECOIN TRANSACTIONS
CREATE POLICY "Users can view their own transactions" ON lifecoin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON lifecoin_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FRIENDSHIPS
CREATE POLICY "Users can view their friendships" ON friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can create friend requests" ON friendships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their friendships" ON friendships FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can delete their friendships" ON friendships FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- POSTS
CREATE POLICY "Users can view public posts" ON posts FOR SELECT USING (
  visibility = 'public' OR 
  auth.uid() = user_id OR
  (visibility = 'friends' AND EXISTS (
    SELECT 1 FROM friendships 
    WHERE status = 'accepted' 
    AND ((user_id = auth.uid() AND friend_id = posts.user_id) OR (friend_id = auth.uid() AND user_id = posts.user_id))
  ))
);
CREATE POLICY "Users can insert their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- POST LIKES
CREATE POLICY "Users can view post likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- COMMENTS
CREATE POLICY "Users can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- COMMENT LIKES
CREATE POLICY "Users can view comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ACHIEVEMENTS (Read-only)
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);

-- USER ACHIEVEMENTS
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- DAILY CHECKINS
CREATE POLICY "Users can view their own checkins" ON daily_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own checkins" ON daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own checkins" ON daily_checkins FOR UPDATE USING (auth.uid() = user_id);

-- LEADERBOARD ENTRIES
CREATE POLICY "Anyone can view leaderboard" ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Users can insert their own entries" ON leaderboard_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own entries" ON leaderboard_entries FOR UPDATE USING (auth.uid() = user_id);

-- TIME WARP SESSIONS
CREATE POLICY "Users can view their own time warp sessions" ON time_warp_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own time warp sessions" ON time_warp_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own time warp sessions" ON time_warp_sessions FOR UPDATE USING (auth.uid() = user_id);
