-- Fix RLS policies for user_teams table

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own teams" ON user_teams;
DROP POLICY IF EXISTS "Users can insert own teams" ON user_teams;
DROP POLICY IF EXISTS "Users can update own teams" ON user_teams;

-- Create new, better policies
CREATE POLICY "Enable read access for own user_teams" ON user_teams
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own user_teams" ON user_teams
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own user_teams" ON user_teams
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Also check if we need to enable RLS on players table for reads
DROP POLICY IF EXISTS "Players are viewable by everyone" ON players;
CREATE POLICY "Enable read access for all players" ON players
    FOR SELECT USING (true);
