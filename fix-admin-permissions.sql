-- Fix Admin Permissions and Create Missing Tables for KOSC Spitsenspel

-- 1. Create game_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS game_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert default game settings if they don't exist
INSERT INTO game_settings (key, value, description) VALUES
('start_deadline', '2025-02-01', 'Deadline voor het kopen van spelers'),
('season_start', '2025-01-01', 'Start van het seizoen'),
('season_end', '2025-06-30', 'Einde van het seizoen'),
('transfer_window_open', '2025-01-01', 'Transfer window opent'),
('transfer_window_close', '2025-02-01', 'Transfer window sluit')
ON CONFLICT (key) DO NOTHING;

-- 4. Enable RLS on new tables
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for admin access
-- Admin can read all data
CREATE POLICY "Admin can read all data" ON players FOR SELECT USING (true);
CREATE POLICY "Admin can read all data" ON user_teams FOR SELECT USING (true);
CREATE POLICY "Admin can read all data" ON game_settings FOR SELECT USING (true);
CREATE POLICY "Admin can read all data" ON feedback FOR SELECT USING (true);

-- Admin can insert/update/delete players
CREATE POLICY "Admin can manage players" ON players FOR ALL USING (true) WITH CHECK (true);

-- Admin can manage game settings
CREATE POLICY "Admin can manage game settings" ON game_settings FOR ALL USING (true) WITH CHECK (true);

-- Admin can read feedback
CREATE POLICY "Admin can read feedback" ON feedback FOR SELECT USING (true);

-- Everyone can insert feedback
CREATE POLICY "Everyone can insert feedback" ON feedback FOR INSERT WITH CHECK (true);

-- 6. Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 7. Create updated_at trigger for game_settings if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for game_settings
DROP TRIGGER IF EXISTS update_game_settings_updated_at ON game_settings;
CREATE TRIGGER update_game_settings_updated_at 
  BEFORE UPDATE ON game_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_settings_key ON game_settings(key);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback(email);

-- 9. Verify the current state
SELECT 'Tables created successfully' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
