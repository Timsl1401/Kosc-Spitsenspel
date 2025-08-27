-- ============================================================================
-- IMPROVED KOSC FANTASY DATABASE SCHEMA
-- Ontworpen voor schaalbaarheid en 300+ gebruikers
-- ============================================================================

-- ============================================================================
-- STAP 1: VERWIJDER OUDE TABELLEN (ALS ZE BESTAAN)
-- ============================================================================

-- Verwijder oude tabellen in juiste volgorde (vanwege foreign keys)
DROP TABLE IF EXISTS user_teams CASCADE;
DROP TABLE IF EXISTS user_points CASCADE;
DROP TABLE IF EXISTS transfers CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_settings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;

-- ============================================================================
-- STAP 2: MAAK NIEUWE, ROBUUSTE TABELLEN
-- ============================================================================

-- 1. TEAMS TABEL - Centrale team informatie
CREATE TABLE teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    points_per_goal DECIMAL(3,1) NOT NULL DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. POSITIONS TABEL - Speler posities
CREATE TABLE positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    short_name VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PLAYERS TABEL - Verbeterde speler informatie
CREATE TABLE players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    position_id UUID NOT NULL REFERENCES positions(id) ON DELETE RESTRICT,
    price INTEGER NOT NULL CHECK (price > 0),
    total_goals INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, team_id) -- Voorkom dubbele spelers in hetzelfde team
);

-- 4. SEASONS TABEL - Seizoen management
CREATE TABLE seasons (
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

-- 5. MATCHES TABEL - Verbeterde wedstrijd informatie
CREATE TABLE matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
    competition_type VARCHAR(20) DEFAULT 'league' CHECK (competition_type IN ('league', 'cup', 'friendly')),
    is_competitive BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (home_team_id != away_team_id)
);

-- 6. GOALS TABEL - Gedetailleerde goal tracking
CREATE TABLE goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    minute INTEGER NOT NULL CHECK (minute >= 1 AND minute <= 120),
    is_own_goal BOOLEAN DEFAULT false,
    is_penalty BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, player_id, minute) -- Voorkom dubbele goals in dezelfde minuut
);

-- 7. USER_PROFILES TABEL - Uitgebreide gebruikersprofielen
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 8. USER_TEAMS TABEL - Verbeterde team management
CREATE TABLE user_teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    bought_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sold_at TIMESTAMP WITH TIME ZONE NULL,
    bought_price INTEGER NOT NULL,
    sold_price INTEGER,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, season_id, player_id, bought_at) -- Voorkom dubbele aankopen
);

-- 9. TRANSFERS TABEL - Gedetailleerde transfer tracking
CREATE TABLE transfers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    action VARCHAR(10) NOT NULL CHECK (action IN ('buy', 'sell')),
    price INTEGER NOT NULL CHECK (price > 0),
    transfer_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_after_deadline BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. USER_POINTS TABEL - Gestructureerde punten tracking
CREATE TABLE user_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'season')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_points INTEGER DEFAULT 0,
    team_value INTEGER DEFAULT 0,
    unique_goal_scorers INTEGER DEFAULT 0,
    transfers_made INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, season_id, period, period_start)
);

-- 11. GAME_SETTINGS TABEL - Flexibele instellingen
CREATE TABLE game_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. FEEDBACK TABEL - Gebruikers feedback
CREATE TABLE feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature', 'general')),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STAP 3: MAAK INDEXES VOOR PERFORMANCE
-- ============================================================================

-- Teams indexes
CREATE INDEX idx_teams_active ON teams(is_active);
CREATE INDEX idx_teams_code ON teams(code);

-- Players indexes
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_players_position ON players(position_id);
CREATE INDEX idx_players_active ON players(is_active);
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_price ON players(price);

-- Seasons indexes
CREATE INDEX idx_seasons_active ON seasons(is_active);
CREATE INDEX idx_seasons_dates ON seasons(start_date, end_date);

-- Matches indexes
CREATE INDEX idx_matches_season ON matches(season_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);

-- Goals indexes
CREATE INDEX idx_goals_match ON goals(match_id);
CREATE INDEX idx_goals_player ON goals(player_id);
CREATE INDEX idx_goals_date ON goals(created_at);

-- User teams indexes
CREATE INDEX idx_user_teams_user ON user_teams(user_id);
CREATE INDEX idx_user_teams_season ON user_teams(season_id);
CREATE INDEX idx_user_teams_player ON user_teams(player_id);
CREATE INDEX idx_user_teams_bought ON user_teams(bought_at);
CREATE INDEX idx_user_teams_sold ON user_teams(sold_at);
CREATE INDEX idx_user_teams_active ON user_teams(user_id, season_id) WHERE sold_at IS NULL;

-- Transfers indexes
CREATE INDEX idx_transfers_user ON transfers(user_id);
CREATE INDEX idx_transfers_season ON transfers(season_id);
CREATE INDEX idx_transfers_date ON transfers(transfer_date);
CREATE INDEX idx_transfers_after_deadline ON transfers(is_after_deadline);

-- User points indexes
CREATE INDEX idx_user_points_user ON user_points(user_id);
CREATE INDEX idx_user_points_season ON user_points(season_id);
CREATE INDEX idx_user_points_period ON user_points(period, period_start, period_end);

-- ============================================================================
-- STAP 4: MAAK TRIGGERS VOOR AUTOMATISERING
-- ============================================================================

-- Trigger functie voor updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated_at triggers
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_teams_updated_at BEFORE UPDATE ON user_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_settings_updated_at BEFORE UPDATE ON game_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger om total_goals bij te werken bij nieuwe goals
CREATE OR REPLACE FUNCTION update_player_goals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE players SET total_goals = total_goals + 1 WHERE id = NEW.player_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE players SET total_goals = total_goals - 1 WHERE id = OLD.player_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_player_goals
    AFTER INSERT OR DELETE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_player_goals();

-- ============================================================================
-- STAP 5: MAAK HELPER FUNCTIES
-- ============================================================================

-- Functie om punten per team te krijgen
CREATE OR REPLACE FUNCTION get_team_points(team_code VARCHAR(10))
RETURNS DECIMAL(3,1) AS $$
DECLARE
    points DECIMAL(3,1);
BEGIN
    SELECT points_per_goal INTO points
    FROM teams
    WHERE code = team_code AND is_active = true;
    
    RETURN COALESCE(points, 1.0);
END;
$$ LANGUAGE plpgsql;

-- Functie om te checken of transfers toegestaan zijn
CREATE OR REPLACE FUNCTION is_transfer_allowed(user_uuid UUID, season_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_season RECORD;
  now_time TIMESTAMP WITH TIME ZONE;
  day_of_week INTEGER;
  weekend_transfers_allowed BOOLEAN;
BEGIN
  -- Haal seizoen informatie op
  SELECT * INTO current_season FROM seasons WHERE id = season_uuid AND is_active = true;
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  now_time := NOW();
  
  -- Check transfer deadline
  IF current_season.transfer_deadline IS NOT NULL AND now_time > current_season.transfer_deadline THEN
    -- Check transfers na deadline
    SELECT COUNT(*) INTO day_of_week
    FROM transfers
    WHERE user_id = user_uuid 
      AND season_id = season_uuid 
      AND is_after_deadline = true;
    
    IF day_of_week >= current_season.transfers_after_deadline THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Check weekend regel
  SELECT value::BOOLEAN INTO weekend_transfers_allowed
  FROM game_settings
  WHERE key = 'weekend_transfers_allowed';
  
  IF NOT FOUND OR NOT weekend_transfers_allowed THEN
    day_of_week := EXTRACT(DOW FROM now_time);
    IF day_of_week IN (0, 6) THEN -- Zondag of zaterdag
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Functie om gebruikerspunten te berekenen
CREATE OR REPLACE FUNCTION calculate_user_points(user_uuid UUID, season_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_points INTEGER := 0;
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN t.points_per_goal IS NOT NULL THEN g.count * t.points_per_goal
            ELSE g.count
        END
    ), 0) INTO total_points
    FROM user_teams ut
    JOIN players p ON ut.player_id = p.id
    JOIN teams t ON p.team_id = t.id
    LEFT JOIN (
        SELECT 
            player_id,
            COUNT(*) as count
        FROM goals g
        JOIN matches m ON g.match_id = m.id
        WHERE m.season_id = season_uuid
        GROUP BY player_id
    ) g ON p.id = g.player_id
    WHERE ut.user_id = user_uuid 
      AND ut.season_id = season_uuid
      AND ut.sold_at IS NULL;
    
    RETURN total_points;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STAP 6: ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS op alle tabellen
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STAP 7: MAAK RLS POLICIES
-- ============================================================================

-- Publieke tabellen (iedereen kan lezen)
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON positions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON goals FOR SELECT USING (true);
CREATE POLICY "Public read access" ON game_settings FOR SELECT USING (is_public = true);

-- Gebruikers kunnen alleen eigen data beheren
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own teams" ON user_teams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transfers" ON transfers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own points" ON user_points FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own feedback" ON feedback FOR ALL USING (auth.uid() = user_id);

-- Admin policies (voor admin gebruikers)
CREATE POLICY "Admins can manage all data" ON teams FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON positions FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON players FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON seasons FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON matches FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON goals FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON game_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON user_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON user_teams FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON transfers FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON user_points FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage all data" ON feedback FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- ============================================================================
-- STAP 8: VOEG SEED DATA TOE
-- ============================================================================

-- Voeg posities toe
INSERT INTO positions (name, short_name) VALUES
('Aanvaller', 'AAN'),
('Middenvelder', 'MID'),
('Verdediger', 'VER'),
('Doelman', 'DOEL');

-- Voeg teams toe
INSERT INTO teams (name, code, points_per_goal) VALUES
('KOSC 1', 'KOSC1', 3.0),
('KOSC 2', 'KOSC2', 2.5),
('KOSC 3', 'KOSC3', 2.0),
('KOSC 4', 'KOSC4', 1.0),
('KOSC 5', 'KOSC5', 1.0),
('KOSC 6', 'KOSC6', 1.0),
('KOSC 7', 'KOSC7', 1.0),
('KOSC 8', 'KOSC8', 1.0);

-- Voeg seizoen toe
INSERT INTO seasons (name, start_date, end_date, is_active, transfer_deadline, max_team_size, initial_budget, transfers_after_deadline) VALUES
('Seizoen 2024-2025', '2024-08-01', '2025-06-30', true, '2024-09-01 12:00:00+00', 15, 100000, 3);

-- Voeg game settings toe
INSERT INTO game_settings (key, value, description, is_public) VALUES
('weekend_transfers_allowed', 'false', 'Of transfers toegestaan zijn in het weekend', true),
('max_transfers_per_day', '5', 'Maximum aantal transfers per dag', true),
('points_calculation_method', 'after_purchase', 'Methode voor punten berekening', true);

-- ============================================================================
-- STAP 9: TOON RESULTAAT
-- ============================================================================

-- Toon overzicht van alle tabellen
SELECT 
    'IMPROVED DATABASE SCHEMA GECREËERD' as info,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Toon alle tabellen met status
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('teams', 'positions', 'players', 'seasons', 'matches', 'goals', 'user_profiles', 'user_teams', 'transfers', 'user_points', 'game_settings', 'feedback') 
        THEN '✅ NIEUWE TABEL'
        ELSE '❌ ONBEKEND'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================================================
-- EINDE IMPROVED DATABASE SCHEMA
-- ============================================================================
