-- Create basic tables for KOSC Spitsenspel

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  position TEXT NOT NULL,
  price INTEGER NOT NULL,
  goals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Users can view own teams" ON user_teams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own teams" ON user_teams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own teams" ON user_teams FOR UPDATE USING (auth.uid() = user_id);
