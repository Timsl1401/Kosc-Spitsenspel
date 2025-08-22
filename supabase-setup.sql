-- KOSC Spitsenspel Database Schema for Supabase

-- Note: JWT secret is automatically managed by Supabase
-- Row Level Security will be enabled after table creation

-- Create teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  points_multiplier DECIMAL(3,1) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create players table
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  match_date DATE NOT NULL,
  is_competitive BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  minute INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_players table (junction table for users and players)
CREATE TABLE user_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, player_id)
);

-- Create rankings table
CREATE TABLE rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  period TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  team_value INTEGER DEFAULT 0,
  goals_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample teams data
INSERT INTO teams (name, level, points_multiplier) VALUES
  ('KOSC 1', 1, 3.0),
  ('KOSC 2', 2, 2.5),
  ('KOSC 3', 3, 2.0),
  ('KOSC 4', 4, 1.0),
  ('KOSC 5', 5, 1.0),
  ('KOSC 6', 6, 1.0),
  ('KOSC 7', 7, 1.0),
  ('KOSC 8', 8, 1.0);

-- Insert sample players data
INSERT INTO players (name, position, team_id, price) VALUES
  ('Jan Jansen', 'Aanvaller', (SELECT id FROM teams WHERE name = 'KOSC 1'), 8000),
  ('Piet Pietersen', 'Middenvelder', (SELECT id FROM teams WHERE name = 'KOSC 1'), 7500),
  ('Klaas Klaassen', 'Verdediger', (SELECT id FROM teams WHERE name = 'KOSC 1'), 7000),
  ('Bas Bruns', 'Aanvaller', (SELECT id FROM teams WHERE name = 'KOSC 2'), 6000),
  ('Mark de Vries', 'Middenvelder', (SELECT id FROM teams WHERE name = 'KOSC 2'), 5500),
  ('Tom Bakker', 'Verdediger', (SELECT id FROM teams WHERE name = 'KOSC 3'), 4500),
  ('Lars Smit', 'Aanvaller', (SELECT id FROM teams WHERE name = 'KOSC 4'), 3500),
  ('Rick Visser', 'Middenvelder', (SELECT id FROM teams WHERE name = 'KOSC 5'), 3000),
  ('Daan Meijer', 'Verdediger', (SELECT id FROM teams WHERE name = 'KOSC 6'), 2500),
  ('Niels Mulder', 'Aanvaller', (SELECT id FROM teams WHERE name = 'KOSC 7'), 2000),
  ('Tim de Boer', 'Middenvelder', (SELECT id FROM teams WHERE name = 'KOSC 8'), 1500);

-- Insert sample matches data
INSERT INTO matches (home_team, away_team, match_date, is_competitive) VALUES
  ('KOSC 1', 'Rival Team A', '2024-01-15', true),
  ('KOSC 2', 'Rival Team B', '2024-01-16', true),
  ('KOSC 3', 'Rival Team C', '2024-01-17', false),
  ('KOSC 1', 'Rival Team D', '2024-01-22', true);

-- Insert sample goals data
INSERT INTO goals (match_id, player_id, minute) VALUES
  ((SELECT id FROM matches WHERE home_team = 'KOSC 1' AND away_team = 'Rival Team A'), 
   (SELECT id FROM players WHERE name = 'Jan Jansen'), 15),
  ((SELECT id FROM matches WHERE home_team = 'KOSC 1' AND away_team = 'Rival Team A'), 
   (SELECT id FROM players WHERE name = 'Piet Pietersen'), 67),
  ((SELECT id FROM matches WHERE home_team = 'KOSC 2' AND away_team = 'Rival Team B'), 
   (SELECT id FROM players WHERE name = 'Bas Bruns'), 23);

-- Create indexes for better performance
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_goals_match_id ON goals(match_id);
CREATE INDEX idx_goals_player_id ON goals(player_id);
CREATE INDEX idx_user_players_user_id ON user_players(user_id);
CREATE INDEX idx_user_players_player_id ON user_players(player_id);
CREATE INDEX idx_rankings_user_id ON rankings(user_id);
CREATE INDEX idx_rankings_period ON rankings(period);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_competitive ON matches(is_competitive);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to teams, players, and matches
CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Matches are viewable by everyone" ON matches FOR SELECT USING (true);
CREATE POLICY "Goals are viewable by everyone" ON goals FOR SELECT USING (true);

-- Create policies for user-specific data
CREATE POLICY "Users can view their own player selections" ON user_players FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own player selections" ON user_players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own player selections" ON user_players FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own rankings" ON rankings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rankings" ON rankings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rankings" ON rankings FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rankings_updated_at BEFORE UPDATE ON rankings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
