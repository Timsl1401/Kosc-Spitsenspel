-- Admin users table for storing admin status
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Insert default admin users
INSERT INTO admin_users (email) VALUES
  ('timsl.tsl@gmail.com'),
  ('Henkgerardus51@gmail.com'),
  ('Nickveldhuis25@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Admin emails table for storing admin user emails (for backward compatibility)
CREATE TABLE IF NOT EXISTS admin_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Insert default admin emails
INSERT INTO admin_emails (email) VALUES
  ('timsl.tsl@gmail.com'),
  ('Henkgerardus51@gmail.com'),
  ('Nickveldhuis25@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin users
CREATE POLICY "Allow authenticated users to read admin users" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow only existing admins to manage admin users
CREATE POLICY "Allow admins to manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Create policy to allow authenticated users to read admin emails
CREATE POLICY "Allow authenticated users to read admin emails" ON admin_emails
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow only existing admins to manage admin emails
CREATE POLICY "Allow admins to manage admin emails" ON admin_emails
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_emails_email ON admin_emails(email);
