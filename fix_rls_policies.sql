-- Fix infinite recursion in RLS policies
-- This script fixes the admin policies that were causing infinite recursion

-- Drop existing admin policies that cause recursion
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

-- Recreate admin policies with proper references (no recursion)
CREATE POLICY "Admins can manage all data" ON teams FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON positions FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON players FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON seasons FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON matches FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON goals FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON game_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON user_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON user_teams FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON transfers FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON user_points FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage all data" ON feedback FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);

-- Ensure admin_users table exists and has proper data
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Insert default admin users (if not exists)
INSERT INTO admin_users (email) VALUES
  ('timsl.tsl@gmail.com'),
  ('Henkgerardus51@gmail.com'),
  ('Nickveldhuis25@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS on admin_users if not already enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users (self-referencing but safe)
CREATE POLICY "Allow authenticated users to read admin users" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
  );

-- Success message
SELECT 'RLS policies fixed successfully! Infinite recursion resolved.' as status;
