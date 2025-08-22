-- KOSC Spitsenspel Simplified Database Schema for Supabase
-- Single table approach for easier management

-- Create the main players table with team info included
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  team_name TEXT NOT NULL,
  team_level INTEGER NOT NULL,
  points_multiplier DECIMAL(3,1) NOT NULL,
  price INTEGER NOT NULL,
  goals_scored INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table (simplified)
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  match_date DATE NOT NULL,
  is_competitive BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_teams table (combines user selections and rankings)
CREATE TABLE user_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  player_ids UUID[] NOT NULL, -- Array of selected player IDs
  total_points INTEGER DEFAULT 0,
  team_value INTEGER DEFAULT 0,
  goals_count INTEGER DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'current',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data directly into players table
INSERT INTO players (name, position, team_name, team_level, points_multiplier, price) VALUES
  ('Jan Jansen', 'Aanvaller', 'KOSC 1', 1, 3.0, 8000),
  ('Piet Pietersen', 'Middenvelder', 'KOSC 1', 1, 3.0, 7500),
  ('Klaas Klaassen', 'Verdediger', 'KOSC 1', 1, 3.0, 7000),
  ('Bas Bruns', 'Aanvaller', 'KOSC 2', 2, 2.5, 6000),
  ('Mark de Vries', 'Middenvelder', 'KOSC 2', 2, 2.5, 5500),
  ('Tom Bakker', 'Verdediger', 'KOSC 3', 3, 2.0, 4500),
  ('Lars Smit', 'Aanvaller', 'KOSC 4', 4, 1.0, 3500),
  ('Rick Visser', 'Middenvelder', 'KOSC 5', 5, 1.0, 3000),
  ('Daan Meijer', 'Verdediger', 'KOSC 6', 6, 1.0, 2500),
  ('Niels Mulder', 'Aanvaller', 'KOSC 7', 7, 1.0, 2000),
  ('Tim de Boer', 'Middenvelder', 'KOSC 8', 8, 1.0, 1500);

-- Insert sample matches
INSERT INTO matches (home_team, away_team, match_date, is_competitive) VALUES
  ('KOSC 1', 'Rival Team A', '2024-01-15', true),
  ('KOSC 2', 'Rival Team B', '2024-01-16', true),
  ('KOSC 3', 'Rival Team C', '2024-01-17', false),
  ('KOSC 1', 'Rival Team D', '2024-01-22', true);

-- Create indexes for better performance
CREATE INDEX idx_players_team_name ON players(team_name);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_user_teams_user_id ON user_teams(user_id);
CREATE INDEX idx_user_teams_period ON user_teams(period);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Matches are viewable by everyone" ON matches FOR SELECT USING (true);

-- Create policies for user-specific data
CREATE POLICY "Users can view their own teams" ON user_teams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own teams" ON user_teams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own teams" ON user_teams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own teams" ON user_teams FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_teams_updated_at BEFORE UPDATE ON user_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy team queries
CREATE VIEW team_overview AS
SELECT 
  team_name,
  team_level,
  points_multiplier,
  COUNT(*) as player_count,
  SUM(price) as total_value,
  SUM(goals_scored) as total_goals
FROM players 
GROUP BY team_name, team_level, points_multiplier
ORDER BY team_level;

-- Create a function to calculate user points
CREATE OR REPLACE FUNCTION calculate_user_points(user_uuid UUID, period_name TEXT DEFAULT 'current')
RETURNS INTEGER AS $$
DECLARE
  total_points INTEGER := 0;
  player_record RECORD;
BEGIN
  FOR player_record IN 
    SELECT p.points_multiplier, p.goals_scored
    FROM user_teams ut
    JOIN unnest(ut.player_ids) WITH ORDINALITY AS player_id(id, ord) ON true
    JOIN players p ON p.id = player_id.id
    WHERE ut.user_id = user_uuid AND ut.period = period_name
  LOOP
    total_points := total_points + (player_record.points_multiplier * player_record.goals_scored);
  END LOOP;
  
  RETURN total_points;
END;
$$ LANGUAGE plpgsql;
