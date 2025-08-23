-- Volledige database setup voor KOSC Spitsenspel
-- Voer dit uit in je Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL CHECK (team IN ('KOSC 1', 'KOSC 2', 'KOSC 3', 'KOSC 4', 'KOSC 5', 'KOSC 6', 'KOSC 7', 'KOSC 2 (Zaterdag)', 'KOSC 3 (Zaterdag)')),
  position TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  goals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  competition TEXT NOT NULL DEFAULT 'competitie' CHECK (competition IN ('competitie', 'beker')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
  is_competitive BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  minute INTEGER NOT NULL CHECK (minute > 0 AND minute <= 120),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User teams table
CREATE TABLE IF NOT EXISTS user_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  bought_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sold_at TIMESTAMP WITH TIME ZONE,
  points_earned DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User points table
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  total_points DECIMAL(10,2) DEFAULT 0,
  team_value INTEGER DEFAULT 0,
  unique_goal_scorers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period)
);

-- Transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('buy', 'sell')),
  price INTEGER NOT NULL,
  transfer_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game settings table
CREATE TABLE IF NOT EXISTS game_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team);
CREATE INDEX IF NOT EXISTS idx_players_price ON players(price);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_competition ON matches(competition);
CREATE INDEX IF NOT EXISTS idx_goals_match ON goals(match_id);
CREATE INDEX IF NOT EXISTS idx_goals_player ON goals(player_id);
CREATE INDEX IF NOT EXISTS idx_user_teams_user ON user_teams(user_id);
CREATE INDEX IF NOT EXISTS idx_user_teams_player ON user_teams(player_id);
CREATE INDEX IF NOT EXISTS idx_user_teams_bought ON user_teams(bought_at);
CREATE INDEX IF NOT EXISTS idx_user_teams_sold ON user_teams(sold_at);
CREATE INDEX IF NOT EXISTS idx_user_points_user ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_period ON user_points(period);

-- Insert some sample data for testing
INSERT INTO players (name, team, position, price, goals) VALUES
('Jan Jansen', 'KOSC 1', 'Aanvaller', 15000, 5),
('Piet Pietersen', 'KOSC 1', 'Middenvelder', 12000, 3),
('Klaas Klaassen', 'KOSC 2', 'Verdediger', 8000, 1),
('Henk Henksen', 'KOSC 3', 'Keeper', 5000, 0),
('Bart Bartsen', 'KOSC 4', 'Aanvaller', 3000, 2),
('Mark Markussen', 'KOSC 2 (Zaterdag)', 'Middenvelder', 7000, 2),
('Tom Tomassen', 'KOSC 3 (Zaterdag)', 'Aanvaller', 4000, 1)
ON CONFLICT DO NOTHING;

-- Insert sample matches
INSERT INTO matches (home_team, away_team, match_date, competition, status, is_competitive) VALUES
('KOSC 1', 'VV Oldenzaal', NOW() + INTERVAL '7 days', 'competitie', 'scheduled', true),
('VV Losser', 'KOSC 2', NOW() + INTERVAL '14 days', 'competitie', 'scheduled', true),
('KOSC 3', 'VV Weerselo', NOW() + INTERVAL '21 days', 'beker', 'scheduled', false)
ON CONFLICT DO NOTHING;

-- Insert game settings
INSERT INTO game_settings (key, value, description) VALUES
('start_deadline', '2025-01-31T23:59:59Z', 'Deadline voor het samenstellen van teams'),
('transfer_limit', '3', 'Maximum aantal transfers na start van het seizoen'),
('budget_limit', '100000', 'Maximum budget per team in euro')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verify tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
