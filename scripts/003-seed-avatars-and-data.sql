-- Seed Human-Like Avatars (Harry Potter themed)
INSERT INTO avatars (id, name, description, personality, image_url, house, traits, unlock_requirement, is_premium) VALUES
('harry', 'Harry Potter', 'The Chosen One - brave, loyal, and determined to do what is right', 'Courageous and selfless', '/avatars/harry.png', 'Gryffindor', '["brave", "loyal", "determined"]', '{}', false),
('hermione', 'Hermione Granger', 'The brightest witch of her age - intelligent, resourceful, and hardworking', 'Studious and dedicated', '/avatars/hermione.png', 'Gryffindor', '["intelligent", "hardworking", "logical"]', '{}', false),
('ron', 'Ron Weasley', 'A loyal friend with a heart of gold - humorous and brave when it counts', 'Loyal and supportive', '/avatars/ron.png', 'Gryffindor', '["loyal", "humorous", "brave"]', '{}', false),
('luna', 'Luna Lovegood', 'Unique and insightful - sees the world differently and embraces creativity', 'Creative and open-minded', '/avatars/luna.png', 'Ravenclaw', '["creative", "unique", "insightful"]', '{"level": 5}', false),
('draco', 'Draco Malfoy', 'Ambitious and cunning - strives for excellence and personal growth', 'Ambitious and resourceful', '/avatars/draco.png', 'Slytherin', '["ambitious", "cunning", "determined"]', '{"level": 10}', false),
('neville', 'Neville Longbottom', 'The underdog hero - proves that courage comes in many forms', 'Persistent and brave', '/avatars/neville.png', 'Gryffindor', '["brave", "persistent", "humble"]', '{"tasks_completed": 50}', false),
('ginny', 'Ginny Weasley', 'Fierce and independent - a natural leader with unstoppable spirit', 'Fierce and independent', '/avatars/ginny.png', 'Gryffindor', '["fierce", "independent", "athletic"]', '{"streak": 7}', false),
('dumbledore', 'Albus Dumbledore', 'The wise mentor - guides with wisdom and believes in the power of love', 'Wise and compassionate', '/avatars/dumbledore.png', 'Gryffindor', '["wise", "powerful", "compassionate"]', '{"level": 25}', true);

-- Seed Avatar Items
INSERT INTO avatar_items (name, category, description, price, rarity, unlock_level) VALUES
('Gryffindor Robes', 'outfit', 'Official Gryffindor house robes', 50, 'common', 1),
('Ravenclaw Robes', 'outfit', 'Official Ravenclaw house robes', 50, 'common', 1),
('Slytherin Robes', 'outfit', 'Official Slytherin house robes', 50, 'common', 1),
('Hufflepuff Robes', 'outfit', 'Official Hufflepuff house robes', 50, 'common', 1),
('Invisibility Cloak', 'outfit', 'Harry legendary invisibility cloak', 500, 'legendary', 20),
('Golden Snitch', 'accessory', 'The elusive golden snitch', 100, 'rare', 5),
('Elder Wand', 'accessory', 'The most powerful wand in existence', 1000, 'legendary', 30),
('Time Turner', 'accessory', 'Travel through time itself', 300, 'epic', 15),
('Marauders Map', 'accessory', 'I solemnly swear I am up to no good', 200, 'epic', 10),
('Hogwarts Castle', 'background', 'The magical castle background', 150, 'rare', 8),
('Forbidden Forest', 'background', 'Dark and mysterious forest', 100, 'common', 3),
('Quidditch Pitch', 'background', 'The famous quidditch stadium', 120, 'rare', 6),
('Patronus Charm', 'power', 'Summon your protective patronus', 250, 'epic', 12),
('Expecto Patronum', 'power', 'Advanced patronus ability', 400, 'legendary', 18);

-- Seed Boss Types
INSERT INTO boss_types (id, name, description, health, difficulty, penalty_tasks, rewards) VALUES
('lazy_dragon', 'The Lazy Dragon', 'A massive beast born from procrastination and comfort zones', 100, 'medium', '["10 pushups", "5 minute meditation", "Write 3 goals"]', '{"coins": 50, "xp": 100}'),
('procrastination_monster', 'Procrastination Monster', 'A shadowy creature that feeds on delayed tasks', 80, 'easy', '["Complete 1 pending task", "10 jumping jacks", "Drink water"]', '{"coins": 30, "xp": 60}'),
('distraction_demon', 'Distraction Demon', 'A hypnotic entity that steals focus and time', 120, 'hard', '["30 minute focused work", "Delete social media for 1 hour", "Journal reflection"]', '{"coins": 75, "xp": 150}'),
('anxiety_specter', 'Anxiety Specter', 'A whispering ghost that amplifies fears and worries', 90, 'medium', '["5 deep breaths", "List 3 things you are grateful for", "10 minute walk"]', '{"coins": 40, "xp": 80}'),
('doubt_dragon', 'Doubt Dragon', 'A cunning serpent that questions every decision', 110, 'hard', '["Affirm 5 positive things about yourself", "Complete a challenging task", "Cold shower"]', '{"coins": 60, "xp": 120}');

-- Seed Map Regions
INSERT INTO map_regions (id, name, description, category, landmarks, unlock_requirement, position) VALUES
('library_tower', 'Library Tower', 'A towering spire filled with ancient knowledge and study chambers', 'study', '["Reading Room", "Exam Hall", "Research Lab", "Knowledge Summit"]', 0, '{"x": 20, "y": 30}'),
('fitness_jungle', 'Fitness Jungle', 'A wild terrain where strength and endurance are forged', 'fitness', '["Training Grounds", "Endurance Valley", "Strength Peak", "Champion Arena"]', 0, '{"x": 50, "y": 20}'),
('treasure_island', 'Treasure Island', 'An island of financial wisdom and wealth building', 'money', '["Savings Beach", "Investment Harbor", "Wealth Mountain", "Fortune Palace"]', 5, '{"x": 80, "y": 40}'),
('healing_springs', 'Healing Springs', 'Mystical waters that restore health and vitality', 'health', '["Wellness Oasis", "Nutrition Garden", "Rest Haven", "Vitality Temple"]', 3, '{"x": 35, "y": 60}'),
('social_village', 'Social Village', 'A vibrant community where connections flourish', 'social', '["Friendship Plaza", "Communication Bridge", "Community Hall", "Bond Temple"]', 5, '{"x": 65, "y": 70}'),
('creative_peaks', 'Creative Peaks', 'Majestic mountains where imagination runs wild', 'creative', '["Inspiration Valley", "Art Studio", "Innovation Lab", "Masterpiece Summit"]', 8, '{"x": 15, "y": 80}');

-- Seed Quests
INSERT INTO quests (title, description, category, quest_type, requirements, xp_reward, coin_reward, unlock_condition) VALUES
('Daily Warrior', 'Complete 3 tasks today', NULL, 'daily', '{"tasks_completed": 3}', 30, 15, '{}'),
('Early Bird', 'Complete a task before 9 AM', NULL, 'daily', '{"early_task": true}', 20, 10, '{}'),
('Streak Master', 'Maintain a 7-day streak', NULL, 'weekly', '{"streak": 7}', 100, 50, '{}'),
('Study Champion', 'Complete 10 study tasks this week', 'study', 'weekly', '{"category_tasks": 10}', 80, 40, '{}'),
('Fitness Hero', 'Complete 5 fitness tasks', 'fitness', 'weekly', '{"category_tasks": 5}', 60, 30, '{}'),
('Hidden Scholar', 'Unlock the secret of the Library Tower', 'study', 'hidden', '{"region_progress": 100}', 200, 100, '{"streak": 5}'),
('Boss Slayer', 'Defeat 3 failure bosses', NULL, 'hidden', '{"bosses_defeated": 3}', 150, 75, '{"bosses_defeated": 1}'),
('Reflection Master', 'Write 10 reflections', NULL, 'hidden', '{"reflections": 10}', 100, 50, '{"reflections": 3}');

-- Seed Achievements
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward, coin_reward, rarity) VALUES
('first_task', 'First Step', 'Complete your first task', 'trophy', 'tasks', '{"tasks_completed": 1}', 10, 5, 'common'),
('task_master', 'Task Master', 'Complete 100 tasks', 'medal', 'tasks', '{"tasks_completed": 100}', 200, 100, 'epic'),
('streak_starter', 'Streak Starter', 'Achieve a 3-day streak', 'fire', 'streaks', '{"streak": 3}', 30, 15, 'common'),
('streak_warrior', 'Streak Warrior', 'Achieve a 30-day streak', 'flame', 'streaks', '{"streak": 30}', 300, 150, 'legendary'),
('boss_hunter', 'Boss Hunter', 'Defeat your first boss', 'sword', 'battles', '{"bosses_defeated": 1}', 50, 25, 'rare'),
('boss_slayer', 'Boss Slayer', 'Defeat 10 bosses', 'crown', 'battles', '{"bosses_defeated": 10}', 250, 125, 'epic'),
('coin_collector', 'Coin Collector', 'Earn 1000 LifeCoins total', 'coins', 'currency', '{"total_coins": 1000}', 100, 50, 'rare'),
('social_butterfly', 'Social Butterfly', 'Make 10 friends', 'users', 'social', '{"friends": 10}', 150, 75, 'epic'),
('map_explorer', 'Map Explorer', 'Unlock all map regions', 'map', 'exploration', '{"regions_unlocked": 6}', 500, 250, 'legendary'),
('level_up', 'Rising Star', 'Reach level 10', 'star', 'progress', '{"level": 10}', 100, 50, 'rare');
