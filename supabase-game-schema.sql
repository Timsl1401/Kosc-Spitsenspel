-- KOSC Spitsenspel Database Schema
-- This script creates all necessary tables for the game

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL CHECK (team IN ('KOSC 1', 'KOSC 2', 'KOSC 3', 'KOSC 4', 'KOSC 5', 'KOSC 6', 'KOSC 7', 'KOSC 8')),
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
CREATE INDEX IF NOT EXISTS idx_transfers_user ON transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(transfer_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_teams_updated_at BEFORE UPDATE ON user_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_settings_updated_at BEFORE UPDATE ON game_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample players
INSERT INTO players (name, team, position, price, goals) VALUES
('Bas Bruns', 'KOSC 1', 'Aanvaller', 15000, 3),
('Martijn ten Kate', 'KOSC 1', 'Middenvelder', 12000, 2),
('Hugo aan de Stegge', 'KOSC 1', 'Keeper', 8000, 0),
('Fabian Harperink', 'KOSC 2', 'Aanvaller', 10000, 4),
('Erik Stokman', 'KOSC 2', 'Verdediger', 9000, 1),
('Koos Kaptein', 'KOSC 3', 'Middenvelder', 7000, 2),
('Teun Bossink', 'KOSC 4', 'Aanvaller', 5000, 1),
('Peter Breed', 'KOSC 5', 'Verdediger', 4000, 0),
('Lotte Letteboer', 'KOSC 6', 'Middenvelder', 6000, 3),
('Hessel Oude Hengelo', 'KOSC 7', 'Aanvaller', 4500, 1),
('Martijn ten Kate Jr', 'KOSC 8', 'Keeper', 3500, 0);

-- Insert sample matches
INSERT INTO matches (home_team, away_team, match_date, competition, status) VALUES
('KOSC 1', 'VV Haaksbergen', '2025-01-25 14:00:00+01', 'competitie', 'finished'),
('KOSC 2', 'Langeveen', '2025-01-26 14:00:00+01', 'competitie', 'finished'),
('KOSC 3', 'Buurse', '2025-01-27 14:00:00+01', 'competitie', 'finished'),
('KOSC 1', 'FC Twente', '2025-02-01 14:00:00+01', 'beker', 'scheduled'),
('KOSC 2', 'Heracles', '2025-02-02 14:00:00+01', 'competitie', 'scheduled');

-- Insert sample goals
INSERT INTO goals (match_id, player_id, minute) VALUES
((SELECT id FROM matches WHERE home_team = 'KOSC 1' AND away_team = 'VV Haaksbergen'), 
 (SELECT id FROM players WHERE name = 'Bas Bruns'), 15),
((SELECT id FROM matches WHERE home_team = 'KOSC 1' AND away_team = 'VV Haaksbergen'), 
 (SELECT id FROM players WHERE name = 'Bas Bruns'), 67),
((SELECT id FROM matches WHERE home_team = 'KOSC 1' AND away_team = 'VV Haaksbergen'), 
 (SELECT id FROM players WHERE name = 'Bas Bruns'), 89),
((SELECT id FROM matches WHERE home_team = 'KOSC 2' AND away_team = 'Langeveen'), 
 (SELECT id FROM players WHERE name = 'Fabian Harperink'), 23),
((SELECT id FROM matches WHERE home_team = 'KOSC 2' AND away_team = 'Langeveen'), 
 (SELECT id FROM players WHERE name = 'Fabian Harperink'), 78);

-- Insert game settings
INSERT INTO game_settings (key, value, description) VALUES
('start_deadline', '2025-02-01', 'Deadline voor het kopen van spelers'),
('max_players', '15', 'Maximum aantal spelers per team'),
('budget', '100000', 'Budget per gebruiker in eurocenten'),
('max_transfers', '3', 'Maximum aantal transfers na start'),
('weekend_transfers', 'false', 'Of transfers in het weekend toegestaan zijn');

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Players: everyone can read
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);

-- Matches: everyone can read
CREATE POLICY "Matches are viewable by everyone" ON matches FOR SELECT USING (true);

-- Goals: everyone can read
CREATE POLICY "Goals are viewable by everyone" ON goals FOR SELECT USING (true);

-- User teams: users can only see their own
CREATE POLICY "Users can view own teams" ON user_teams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own teams" ON user_teams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own teams" ON user_teams FOR UPDATE USING (auth.uid() = user_id);

-- User points: users can only see their own
CREATE POLICY "Users can view own points" ON user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own points" ON user_points FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own points" ON user_points FOR UPDATE USING (auth.uid() = user_id);

-- Transfers: users can only see their own
CREATE POLICY "Users can view own transfers" ON transfers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transfers" ON transfers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Game settings: everyone can read
CREATE POLICY "Game settings are viewable by everyone" ON game_settings FOR SELECT USING (true);

-- Function to calculate user points
CREATE OR REPLACE FUNCTION calculate_user_points(user_uuid UUID, period_name TEXT DEFAULT 'seizoen')
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total_points DECIMAL(10,2) := 0;
BEGIN
  SELECT COALESCE(SUM(
    CASE 
      WHEN p.team = 'KOSC 1' THEN g.minute * 3
      WHEN p.team = 'KOSC 2' THEN g.minute * 2.5
      WHEN p.team = 'KOSC 3' THEN g.minute * 2
      ELSE g.minute * 1
    END
  ), 0)
  INTO total_points
  FROM goals g
  JOIN players p ON g.player_id = p.id
  JOIN user_teams ut ON p.id = ut.player_id
  WHERE ut.user_id = user_uuid
    AND ut.bought_at <= g.created_at
    AND (ut.sold_at IS NULL OR ut.sold_at > g.created_at);
  
  RETURN total_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if transfers are allowed
CREATE OR REPLACE FUNCTION is_transfer_allowed()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXTRACT(DOW FROM NOW()) NOT IN (0, 6); -- 0 = Sunday, 6 = Saturday
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
