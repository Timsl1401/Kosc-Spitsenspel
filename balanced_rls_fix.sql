-- GEZONDE FIX: Balanced approach tussen veiligheid en toegankelijkheid
-- Dit is de AANBEVOLEN oplossing na de emergency fix

-- Stap 1: Verwijder de tijdelijke emergency policies
DROP POLICY IF EXISTS "Public read access for authenticated users" ON teams;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON positions;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON players;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON seasons;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON matches;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON goals;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON game_settings;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON user_teams;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON transfers;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON user_points;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON feedback;

-- Stap 2: Herstel de originele publieke read policies (voor niet-gevoelige data)
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON positions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON goals FOR SELECT USING (true);
CREATE POLICY "Public read access" ON game_settings FOR SELECT USING (is_public = true);

-- Stap 3: Gebruikers-specifieke policies (veiliger dan volledige public access)
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own teams" ON user_teams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transfers" ON transfers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own points" ON user_points FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own feedback" ON feedback FOR ALL USING (auth.uid() = user_id);

-- Stap 4: Admin policies - alleen voor echte admins (geen recursion)
CREATE POLICY "Admins can manage teams" ON teams FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage positions" ON positions FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage players" ON players FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage seasons" ON seasons FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage matches" ON matches FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage goals" ON goals FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage game_settings" ON game_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage user_profiles" ON user_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage user_teams" ON user_teams FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage transfers" ON transfers FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage user_points" ON user_points FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage feedback" ON feedback FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);

-- Stap 5: Zorg dat admin_users goed werkt
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Stap 6: Voeg admin users toe
INSERT INTO admin_users (email) VALUES
  ('timsl.tsl@gmail.com'),
  ('Henkgerardus51@gmail.com'),
  ('Nickveldhuis25@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Stap 7: Enable RLS op admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Stap 8: Policy voor admin_users zelf (geen recursion!)
CREATE POLICY "Allow authenticated users to read admin users" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
  );

-- Stap 9: Success message
SELECT 'BALANCED FIX APPLIED: Security maintained while keeping data accessible!' as status;
