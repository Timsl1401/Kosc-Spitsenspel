-- Update matches table to add is_competitive field
-- Run this in your Supabase SQL editor

-- Add is_competitive column if it doesn't exist
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS is_competitive BOOLEAN DEFAULT true;

-- Update existing matches to set is_competitive = true
UPDATE matches 
SET is_competitive = true 
WHERE is_competitive IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'matches' 
ORDER BY ordinal_position;
