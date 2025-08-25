-- Fix Goals Table Schema - Add Missing Teams
-- Run this in Supabase SQL Editor

-- First, check current constraint
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'goals'::regclass 
AND contype = 'c';

-- Drop the existing CHECK constraint
ALTER TABLE goals DROP CONSTRAINT IF EXISTS goals_team_code_check;

-- Add new CHECK constraint with all teams
ALTER TABLE goals ADD CONSTRAINT goals_team_code_check 
CHECK (team_code IN (
    'KOSC 1', 
    'KOSC 2', 
    'KOSC 3', 
    'KOSC 4', 
    'KOSC 5', 
    'KOSC 6', 
    'KOSC 7', 
    'KOSC 8',          -- ← Added KOSC 8
    'KOSC 2 Zaterdag', 
    'KOSC 3 Zaterdag', 
    'KOSC A1'
));

-- Verify the new constraint
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'goals'::regclass 
AND contype = 'c';

-- Test insert with different team codes
-- This should work now:
-- INSERT INTO goals (player_id, minute, team_code) VALUES 
-- ('test-uuid', 90, 'KOSC 8');


