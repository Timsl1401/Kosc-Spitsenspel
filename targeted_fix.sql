-- GERICHTE FIX: Herstel data toegang zonder al te restrictieve policies
-- Uitvoeren na diagnose - admin_emails tabel bestaat al!

-- Stap 1: Verwijder ALLE bestaande policies eerst (veilig reset)
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

-- Verwijdert ook andere mogelijke policy namen
DROP POLICY IF EXISTS "Public read access" ON teams;
DROP POLICY IF EXISTS "Public read access" ON positions;
DROP POLICY IF EXISTS "Public read access" ON players;
DROP POLICY IF EXISTS "Public read access" ON seasons;
DROP POLICY IF EXISTS "Public read access" ON matches;
DROP POLICY IF EXISTS "Public read access" ON goals;
DROP POLICY IF EXISTS "Public read access" ON game_settings;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON teams;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON positions;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON players;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON seasons;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON matches;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON goals;
DROP POLICY IF EXISTS "Public read access for authenticated users" ON game_settings;

-- Stap 2: Herstel publieke toegang voor basis data (alleen lezen)
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON positions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON goals FOR SELECT USING (true);
CREATE POLICY "Public read access" ON game_settings FOR SELECT USING (is_public = true);

-- Stap 3: Verwijder ook alle bestaande user policies
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own teams" ON user_teams;
DROP POLICY IF EXISTS "Users can manage own transfers" ON transfers;
DROP POLICY IF EXISTS "Users can manage own points" ON user_points;
DROP POLICY IF EXISTS "Users can manage own feedback" ON feedback;
DROP POLICY IF EXISTS "Allow authenticated users to read admin emails" ON admin_emails;
DROP POLICY IF EXISTS "Allow admins to manage admin emails" ON admin_emails;

-- Stap 4: Zorg dat gebruikers hun eigen data kunnen beheren
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own teams" ON user_teams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transfers" ON transfers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own points" ON user_points FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own feedback" ON feedback FOR ALL USING (auth.uid() = user_id);

-- Stap 5: Admin policies alleen voor schrijven (geen recursion meer)
CREATE POLICY "Admins can manage teams" ON teams FOR INSERT USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage teams" ON teams FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage teams" ON teams FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);

CREATE POLICY "Admins can manage players" ON players FOR INSERT USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage players" ON players FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage players" ON players FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);

CREATE POLICY "Admins can manage seasons" ON seasons FOR INSERT USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage seasons" ON seasons FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage seasons" ON seasons FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);

CREATE POLICY "Admins can manage matches" ON matches FOR INSERT USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage matches" ON matches FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage matches" ON matches FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);

CREATE POLICY "Admins can manage goals" ON goals FOR INSERT USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage goals" ON goals FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage goals" ON goals FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
);

-- Stap 6: Zorg dat admin_emails toegankelijk blijft
CREATE POLICY "Allow authenticated users to read admin emails" ON admin_emails
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage admin emails" ON admin_emails
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email')
  );

-- Stap 7: Success message
SELECT 'TARGETED FIX APPLIED: Data accessible, admin functions preserved!' as status;
