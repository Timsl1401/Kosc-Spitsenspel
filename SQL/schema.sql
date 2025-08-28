-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');

-- Users table (replaces Laravel users table)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    budget BIGINT DEFAULT 100000000,
    points BIGINT,
    substitutes INTEGER DEFAULT 0,
    email_verified_at TIMESTAMP,
    current_team_id UUID,
    profile_photo_path TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Positions table
CREATE TABLE positions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    age INTEGER,
    position_id UUID REFERENCES positions(id),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    time TIME DEFAULT '11:00:00',
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    score VARCHAR(255),
    goals INTEGER DEFAULT 0,
    home_team_id UUID REFERENCES teams(id),
    away_team_id UUID REFERENCES teams(id),
    opponent VARCHAR(255),
    comments TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Goals table
CREATE TABLE goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    amount_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Points table
CREATE TABLE points (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Periods table
CREATE TABLE periods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sub leagues table
CREATE TABLE sub_leagues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    invite_code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Rankings table
CREATE TABLE rankings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    period_id UUID REFERENCES periods(id) ON DELETE CASCADE,
    points DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Dashboard notifications table
CREATE TABLE dashboard_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User logs table
CREATE TABLE user_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Default values table
CREATE TABLE default_values (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Junction tables
CREATE TABLE player_user (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id, user_id)
);

CREATE TABLE subleague_user (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sub_league_id UUID REFERENCES sub_leagues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(sub_league_id, user_id)
);

-- Add foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_current_team 
    FOREIGN KEY (current_team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_matches_team_id ON matches(team_id);
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_goals_match_id ON goals(match_id);
CREATE INDEX idx_goals_player_id ON goals(player_id);
CREATE INDEX idx_points_user_id ON points(user_id);
CREATE INDEX idx_points_player_id ON points(player_id);
CREATE INDEX idx_rankings_user_id ON rankings(user_id);
CREATE INDEX idx_rankings_period_id ON rankings(period_id);
CREATE INDEX idx_player_user_user_id ON player_user(user_id);
CREATE INDEX idx_player_user_player_id ON player_user(player_id);
CREATE INDEX idx_subleague_user_user_id ON subleague_user(user_id);
CREATE INDEX idx_subleague_user_sub_league_id ON subleague_user(sub_league_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE points ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE default_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE subleague_user ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view other users' public info" ON users
    FOR SELECT USING (true);

-- RLS Policies for teams (public read, admin write)
CREATE POLICY "Anyone can view teams" ON teams
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify teams" ON teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for players (public read, admin write)
CREATE POLICY "Anyone can view players" ON players
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify players" ON players
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for matches (public read, admin write)
CREATE POLICY "Anyone can view matches" ON matches
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify matches" ON matches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for points (users can only see their own)
CREATE POLICY "Users can view their own points" ON points
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can modify their own points" ON points
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for player_user (users can only see their own)
CREATE POLICY "Users can view their own player associations" ON player_user
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can modify their own player associations" ON player_user
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for rankings (public read)
CREATE POLICY "Anyone can view rankings" ON rankings
    FOR SELECT USING (true);

-- RLS Policies for articles (public read, admin write)
CREATE POLICY "Anyone can view articles" ON articles
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify articles" ON articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for sub_leagues
CREATE POLICY "Anyone can view sub leagues" ON sub_leagues
    FOR SELECT USING (true);

CREATE POLICY "Users can create sub leagues" ON sub_leagues
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Sub league creators can modify their leagues" ON sub_leagues
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM subleague_user 
            WHERE subleague_user.sub_league_id = sub_leagues.id 
            AND subleague_user.user_id = auth.uid()
        )
    );

-- RLS Policies for subleague_user
CREATE POLICY "Users can view their sub league memberships" ON subleague_user
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can join/leave sub leagues" ON subleague_user
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for dashboard_notifications (public read, admin write)
CREATE POLICY "Anyone can view notifications" ON dashboard_notifications
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify notifications" ON dashboard_notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for user_logs (users can only see their own)
CREATE POLICY "Users can view their own logs" ON user_logs
    FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for default_values (public read, admin write)
CREATE POLICY "Anyone can view default values" ON default_values
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify default values" ON default_values
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_points_updated_at BEFORE UPDATE ON points
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_periods_updated_at BEFORE UPDATE ON periods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_leagues_updated_at BEFORE UPDATE ON sub_leagues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rankings_updated_at BEFORE UPDATE ON rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_notifications_updated_at BEFORE UPDATE ON dashboard_notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_default_values_updated_at BEFORE UPDATE ON default_values
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_user_updated_at BEFORE UPDATE ON player_user
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subleague_user_updated_at BEFORE UPDATE ON subleague_user
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
