-- Admin emails table for storing admin user emails
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
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Allow authenticated users to read admin emails" ON admin_emails;
DROP POLICY IF EXISTS "Allow admins to manage admin emails" ON admin_emails;

-- Create policy to allow authenticated users to read admin emails
CREATE POLICY "Allow authenticated users to read admin emails" ON admin_emails
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to manage admin emails
CREATE POLICY "Allow authenticated users to manage admin emails" ON admin_emails
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_emails_email ON admin_emails(email);
