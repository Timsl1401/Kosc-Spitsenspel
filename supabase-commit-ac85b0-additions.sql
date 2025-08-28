-- Additions on top of commit ac85b073d2731668c35db7bda6c9b7b2c81f441c
-- - Adds user_profiles and feedback tables used by the UI
-- - Aligns game_settings key to weekend_transfers_allowed
-- - Minimal RLS policies so AdminDashboard can insert/update via authenticated client

-- Extensions (safe to re-run)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'user_profiles') THEN
    EXECUTE 'DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'feedback') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Everyone can submit feedback" ON feedback';
    EXECUTE 'DROP POLICY IF EXISTS "Feedback are viewable by everyone" ON feedback';
  END IF;
END $$;

-- user_profiles policies: public read (only display_name exposed by UI), owner write
CREATE POLICY "User profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- feedback policies: anyone can insert, everyone can read
CREATE POLICY "Everyone can submit feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Feedback are viewable by everyone" ON feedback FOR SELECT USING (true);

-- AdminDashboard requires insert/update on players, matches, goals, game_settings via authenticated client
-- Add permissive policies (UI restricts to admins; tighten later if needed)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'players') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Players are modifiable by authenticated users (insert)" ON players';
    EXECUTE 'DROP POLICY IF EXISTS "Players are modifiable by authenticated users (update)" ON players';
    EXECUTE 'DROP POLICY IF EXISTS "Players are modifiable by authenticated users (delete)" ON players';
    EXECUTE 'CREATE POLICY "Players are modifiable by authenticated users (insert)" ON players FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
    EXECUTE 'CREATE POLICY "Players are modifiable by authenticated users (update)" ON players FOR UPDATE USING (auth.uid() IS NOT NULL)';
    EXECUTE 'CREATE POLICY "Players are modifiable by authenticated users (delete)" ON players FOR DELETE USING (auth.uid() IS NOT NULL)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'matches') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Matches are insertable by authenticated users" ON matches';
    EXECUTE 'DROP POLICY IF EXISTS "Matches are updatable by authenticated users" ON matches';
    EXECUTE 'CREATE POLICY "Matches are insertable by authenticated users" ON matches FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
    EXECUTE 'CREATE POLICY "Matches are updatable by authenticated users" ON matches FOR UPDATE USING (auth.uid() IS NOT NULL)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'goals') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Goals are insertable by authenticated users" ON goals';
    EXECUTE 'CREATE POLICY "Goals are insertable by authenticated users" ON goals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'game_settings') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Game settings are modifiable by authenticated users (insert)" ON game_settings';
    EXECUTE 'DROP POLICY IF EXISTS "Game settings are modifiable by authenticated users (update)" ON game_settings';
    EXECUTE 'CREATE POLICY "Game settings are modifiable by authenticated users (insert)" ON game_settings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
    EXECUTE 'CREATE POLICY "Game settings are modifiable by authenticated users (update)" ON game_settings FOR UPDATE USING (auth.uid() IS NOT NULL)';
  END IF;
END $$;

-- Align setting key used by UI
INSERT INTO game_settings (key, value, description)
VALUES ('weekend_transfers_allowed', 'false', 'Of transfers in het weekend toegestaan zijn')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;



