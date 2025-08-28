-- Seizoen aanmaken voor de applicatie
CREATE TABLE IF NOT EXISTS seasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  transfer_deadline TIMESTAMP WITH TIME ZONE,
  max_team_size INTEGER DEFAULT 15,
  initial_budget INTEGER DEFAULT 100000,
  transfers_after_deadline INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (end_date > start_date)
);

-- Actief seizoen aanmaken
INSERT INTO seasons (
  name, 
  start_date, 
  end_date, 
  is_active, 
  transfer_deadline, 
  max_team_size, 
  initial_budget, 
  transfers_after_deadline
) VALUES (
  'Seizoen 2024',
  '2024-01-01',
  '2024-12-31',
  true,
  '2024-12-31T23:59:59Z',
  15,
  100000,
  3
) ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

-- Policies voor seasons
CREATE POLICY "Allow authenticated users to read seasons" ON seasons
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage seasons" ON seasons
  FOR ALL USING (auth.role() = 'authenticated');

-- Index voor betere performance
CREATE INDEX IF NOT EXISTS idx_seasons_active ON seasons(is_active);
