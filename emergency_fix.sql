-- EMERGENCY FIX: Maak alle data weer toegankelijk
-- Voer dit UITSLUITEND uit als je geen data meer kunt ophalen!

-- Stap 1: Verwijder alle restrictieve admin policies tijdelijk
DROP POLICY IF EXISTS "Admins can manage all data" ON teams;
DROP POLICY IF EXISTS "Admins can manage all data" ON positions;
DROP POLICY IF EXISTS "Admins can manage all data" ON players;
DROP POLICY IF EXISTS "Admins can manage all data" ON seasons;
DROP POLICY IF EXISTS "Admins can manage all data" ON matches;
DROP POLICY IF EXISTS "Admins can manage all data" ON goals;
DROP POLICY IF EXISTS "Admins can manage all data" ON game_settings;
DROP POLICY IF EXISTS "Admins can manage all data" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all data" ON user_teams;
DROP POLICY IF EXISTS "Admins can manage all data" ON transfers;
DROP POLICY IF EXISTS "Admins can manage all data" ON user_points;
DROP POLICY IF EXISTS "Admins can manage all data" ON feedback;

-- Stap 2: Maak alle tabellen publiek leesbaar voor ingelogde gebruikers
CREATE POLICY "Public read access for authenticated users" ON teams FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public read access for authenticated users" ON positions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public read access for authenticated users" ON players FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public read access for authenticated users" ON seasons FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public read access for authenticated users" ON matches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public read access for authenticated users" ON goals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public read access for authenticated users" ON game_settings FOR SELECT USING (auth.role() = 'authenticated');

-- Stap 3: Zorg dat user_profiles toegankelijk is
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read access for authenticated users" ON user_profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Stap 4: Zorg dat user_teams toegankelijk is
CREATE POLICY "Users can manage own teams" ON user_teams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read access for authenticated users" ON user_teams FOR SELECT USING (auth.role() = 'authenticated');

-- Stap 5: Maak transfers toegankelijk
CREATE POLICY "Users can manage own transfers" ON transfers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read access for authenticated users" ON transfers FOR SELECT USING (auth.role() = 'authenticated');

-- Stap 6: Maak user_points toegankelijk
CREATE POLICY "Users can manage own points" ON user_points FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read access for authenticated users" ON user_points FOR SELECT USING (auth.role() = 'authenticated');

-- Stap 7: Maak feedback toegankelijk
CREATE POLICY "Users can manage own feedback" ON feedback FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read access for authenticated users" ON feedback FOR SELECT USING (auth.role() = 'authenticated');

-- Stap 8: Herstel admin_users tabel als die ontbreekt
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Stap 9: Voeg admin users toe
INSERT INTO admin_users (email) VALUES
  ('timsl.tsl@gmail.com'),
  ('Henkgerardus51@gmail.com'),
  ('Nickveldhuis25@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Stap 10: Success message
SELECT 'EMERGENCY FIX APPLIED: All data should now be accessible again!' as status;
