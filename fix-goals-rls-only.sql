-- Fix RLS for Goals Table Only
-- Run this in Supabase SQL Editor

-- Check your current user email first
SELECT auth.email() as current_user_email;

-- Check existing policies on goals table
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'goals';

-- Create a simple admin function (replace with your actual admin email)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Replace 'your-email@gmail.com' with your actual admin email
  RETURN auth.email() IN (
    'admin@kosc.nl',
    'timscholtelubberink@gmail.com',  -- ← REPLACE WITH YOUR EMAIL
    'your-admin-email@example.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add INSERT policy for admin users on goals table
DROP POLICY IF EXISTS "Admin can insert goals" ON goals;
CREATE POLICY "Admin can insert goals" 
ON goals FOR INSERT 
TO authenticated
WITH CHECK (is_admin_user());

-- Also ensure admin can select/update/delete goals if needed
DROP POLICY IF EXISTS "Admin can manage goals" ON goals;
CREATE POLICY "Admin can manage goals" 
ON goals FOR ALL 
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Test the admin function
SELECT 
  auth.email() as current_user_email,
  is_admin_user() as is_admin,
  CASE 
    WHEN is_admin_user() THEN '✅ Admin access granted - can insert goals' 
    ELSE '❌ No admin access' 
  END as status;

-- Show final policies on goals table
SELECT 
  policyname, 
  permissive,
  roles,
  cmd as command,
  qual as using_clause,
  with_check as check_clause
FROM pg_policies 
WHERE tablename = 'goals'
ORDER BY policyname;



