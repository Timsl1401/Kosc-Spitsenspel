BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Utility: updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $fn$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$fn$ LANGUAGE plpgsql;

-- 1) players
CREATE TABLE IF NOT EXISTS public.players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  position TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  goals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_players_updated_at ON public.players;
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2) matches
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  match_date TIMESTAMPTZ NOT NULL,
  competition TEXT NOT NULL DEFAULT 'competitie',
  status TEXT NOT NULL DEFAULT 'scheduled',
  is_competitive BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_matches_updated_at ON public.matches;
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3) goals
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  team_code TEXT,
  minute INTEGER NOT NULL CHECK (minute > 0 AND minute <= 120),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) user_teams
CREATE TABLE IF NOT EXISTS public.user_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  bought_at TIMESTAMPTZ NOT NULL,
  sold_at TIMESTAMPTZ,
  points_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_user_teams_updated_at ON public.user_teams;
CREATE TRIGGER update_user_teams_updated_at BEFORE UPDATE ON public.user_teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5) game_settings
CREATE TABLE IF NOT EXISTS public.game_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_game_settings_updated_at ON public.game_settings;
CREATE TRIGGER update_game_settings_updated_at BEFORE UPDATE ON public.game_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6) user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7) feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8) Indexes
CREATE INDEX IF NOT EXISTS idx_players_team ON public.players(team);
CREATE INDEX IF NOT EXISTS idx_players_price ON public.players(price);
CREATE INDEX IF NOT EXISTS idx_goals_match ON public.goals(match_id);
CREATE INDEX IF NOT EXISTS idx_goals_player ON public.goals(player_id);
CREATE INDEX IF NOT EXISTS idx_user_teams_user ON public.user_teams(user_id);
CREATE INDEX IF NOT EXISTS idx_user_teams_player ON public.user_teams(player_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback(created_at);

-- 9) RLS and Policies
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DO $do$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE tablename IN ('players','matches','goals','user_teams','game_settings','user_profiles','feedback')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END
$do$;

-- players
CREATE POLICY "players_select_all" ON public.players FOR SELECT USING (true);
CREATE POLICY "players_insert_auth" ON public.players FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "players_update_auth" ON public.players FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "players_delete_auth" ON public.players FOR DELETE USING (auth.uid() IS NOT NULL);

-- matches
CREATE POLICY "matches_select_all" ON public.matches FOR SELECT USING (true);
CREATE POLICY "matches_insert_auth" ON public.matches FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "matches_update_auth" ON public.matches FOR UPDATE USING (auth.uid() IS NOT NULL);

-- goals
CREATE POLICY "goals_select_all" ON public.goals FOR SELECT USING (true);
CREATE POLICY "goals_insert_auth" ON public.goals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- user_teams: SELECT open for leaderboard; write only own
CREATE POLICY "user_teams_select_all" ON public.user_teams FOR SELECT USING (true);
CREATE POLICY "user_teams_insert_own" ON public.user_teams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_teams_update_own" ON public.user_teams FOR UPDATE USING (auth.uid() = user_id);

-- game_settings
CREATE POLICY "game_settings_select_all" ON public.game_settings FOR SELECT USING (true);
CREATE POLICY "game_settings_upsert_auth" ON public.game_settings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "game_settings_update_auth" ON public.game_settings FOR UPDATE USING (auth.uid() IS NOT NULL);

-- user_profiles
CREATE POLICY "user_profiles_select_all" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "user_profiles_upsert_own" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_profiles_update_own" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- feedback
CREATE POLICY "feedback_select_all" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "feedback_insert_anyone" ON public.feedback FOR INSERT WITH CHECK (true);

-- 10) Seeds for settings
INSERT INTO public.game_settings (key, value, description) VALUES
  ('start_deadline', '2025-02-01', 'Deadline voor het kopen van spelers'),
  ('season_start', '2025-01-01', 'Start van het seizoen'),
  ('season_end', '2025-06-30', 'Einde van het seizoen'),
  ('transfer_window_open', '2025-01-01', 'Transfer window opent'),
  ('transfer_window_close', '2025-02-01', 'Transfer window sluit'),
  ('weekend_transfers_allowed', 'false', 'Of transfers in het weekend toegestaan zijn')
ON CONFLICT (key) DO NOTHING;

COMMIT;

-- 11) Grants (nodig naast RLS)
BEGIN;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.players TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.players TO authenticated;

GRANT SELECT ON public.matches TO anon, authenticated;
GRANT INSERT, UPDATE ON public.matches TO authenticated;

GRANT SELECT ON public.goals TO anon, authenticated;
GRANT INSERT ON public.goals TO authenticated;

GRANT SELECT ON public.user_teams TO anon, authenticated;
GRANT INSERT, UPDATE ON public.user_teams TO authenticated;

GRANT SELECT ON public.game_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.game_settings TO authenticated;

GRANT SELECT ON public.user_profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.user_profiles TO authenticated;

GRANT SELECT ON public.feedback TO anon, authenticated;
GRANT INSERT ON public.feedback TO anon, authenticated;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
COMMIT;

-- Refresh PostgREST cache (optioneel; anders via Dashboard > Restart project)
NOTIFY pgrst, 'reload schema';


