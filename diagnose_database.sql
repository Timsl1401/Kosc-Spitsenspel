-- Diagnose script om te zien wat er in de database zit
-- Voer dit uit in Supabase SQL Editor

-- Check welke tabellen bestaan
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check welke policies er zijn
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check admin_users tabel
SELECT * FROM admin_users;

-- Check admin_emails tabel
SELECT * FROM admin_emails;

-- Check user_profiles tabel (als die bestaat)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        RAISE NOTICE 'user_profiles table exists';
        -- Uncomment om te zien: SELECT * FROM user_profiles LIMIT 5;
    ELSE
        RAISE NOTICE 'user_profiles table does NOT exist';
    END IF;
END $$;

-- Check seasons tabel
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'seasons') THEN
        RAISE NOTICE 'seasons table exists';
        -- Uncomment om te zien: SELECT * FROM seasons;
    ELSE
        RAISE NOTICE 'seasons table does NOT exist';
    END IF;
END $$;

-- Check teams tabel
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'teams') THEN
        RAISE NOTICE 'teams table exists';
        -- Uncomment om te zien: SELECT * FROM teams LIMIT 5;
    ELSE
        RAISE NOTICE 'teams table does NOT exist';
    END IF;
END $$;
