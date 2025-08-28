-- Import script voor KOSC teams en spelers data (alleen complete data)
-- Dit script maakt de benodigde tabellen aan en importeert alleen spelers met volledige informatie

-- Eerst de teams tabel aanmaken (als deze nog niet bestaat)
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  points_per_goal DECIMAL(3,1) NOT NULL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posities tabel aanmaken
CREATE TABLE IF NOT EXISTS positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  short_name VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spelers tabel aanmaken
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  position_id UUID NOT NULL REFERENCES positions(id) ON DELETE RESTRICT,
  price INTEGER NOT NULL CHECK (price > 0),
  total_goals INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, team_id)
);

-- Posities invoegen
INSERT INTO positions (name, short_name) VALUES 
  ('Keeper', 'K'),
  ('Verdediger', 'V'),
  ('Middenvelder', 'M'),
  ('Aanvaller', 'A')
ON CONFLICT (name) DO NOTHING;

-- Teams invoegen met punten per goal
INSERT INTO teams (name, code, points_per_goal) VALUES 
  ('KOSC 1', 'KOSC1', 3.0),
  ('KOSC 2', 'KOSC2', 2.5),
  ('KOSC 3', 'KOSC3', 2.0),
  ('KOSC 4', 'KOSC4', 1.5),
  ('KOSC 5', 'KOSC5', 1.0),
  ('KOSC 6', 'KOSC6', 1.0),
  ('KOSC 7', 'KOSC7', 1.0),
  ('KOSC A1', 'KOSCA1', 1.0),
  ('Zaterdag 2', 'ZAT2', 1.0),
  ('Zaterdag 3', 'ZAT3', 1.0)
ON CONFLICT (name) DO NOTHING;

-- Spelers data invoegen (ALLEEN met volledige informatie)
-- KOSC 1 spelers (alleen met positie)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Ralph Muller', 'Keeper', 1000000),
  ('Jorrit Weierink', 'Aanvaller', 1000000),
  ('Timo Bonke', 'Verdediger', 1000000),
  ('Thijs Hulskotte', 'Middenvelder', 1000000),
  ('Stijn Teders', 'Middenvelder', 1000000),
  ('Job oude Roelink', 'Middenvelder', 1000000),
  ('Jasper Keupink', 'Middenvelder', 1000000),
  ('Ramon oude Nijhuis', 'Middenvelder', 1000000),
  ('Dirk Huusken', 'Middenvelder', 1000000),
  ('Derk Breed', 'Middenvelder', 1000000),
  ('Luuk Scholte Lubberink', 'Middenvelder', 1000000),
  ('Luuk Velers', 'Verdediger', 1000000),
  ('Nils Brouwer', 'Middenvelder', 1000000),
  ('Bill Kottink', 'Aanvaller', 1000000),
  ('Robbie Schulten', 'Middenvelder', 1000000),
  ('Kay Kamphuis', 'Middenvelder', 1000000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'KOSC 1' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- KOSC 2 spelers (alleen met positie)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Dries Arens', 'Middenvelder', 1000000),
  ('Rens Bekhuis', 'Keeper', 1000000),
  ('Joost Brons', 'Verdediger', 1000000),
  ('Michiel Brons', 'Verdediger', 1000000),
  ('Wout Huiskes', 'Middenvelder', 1000000),
  ('Guus Kaptein', 'Middenvelder', 1000000),
  ('Stan Kaptein', 'Middenvelder', 1000000),
  ('Ief Kottink', 'Middenvelder', 1000000),
  ('Bram Veldhuis', 'Middenvelder', 1000000),
  ('Rens Luttikhuis', 'Verdediger', 1000000),
  ('Bas Nijhuis', 'Aanvaller', 1000000),
  ('Guus Rekers', 'Middenvelder', 1000000),
  ('Jim Velthuis', 'Middenvelder', 1000000),
  ('Joris Velthuis', 'Middenvelder', 1000000),
  ('Guus van Wanrooij', 'Middenvelder', 1000000),
  ('Dani Leussink', 'Verdediger', 1000000),
  ('Hugo aan de Stegge', 'Keeper', 1000000),
  ('Leon Heerink', 'Middenvelder', 1000000),
  ('Nijs olde Klieverink', 'Verdediger', 1000000),
  ('Sep Busscher', 'Middenvelder', 1000000),
  ('Mart Busscher', 'Aanvaller', 1000000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'KOSC 2' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- KOSC 3 spelers (alleen met positie)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Jesse Bonke', 'Middenvelder', 1000000),
  ('Stefan Bonke', 'Middenvelder', 1000000),
  ('Jan Jaap Braad', 'Middenvelder', 1000000),
  ('Teun Groeneveld', 'Middenvelder', 1000000),
  ('Nick Hagedoorn', 'Aanvaller', 1000000),
  ('Niels Hakkenes', 'Middenvelder', 1000000),
  ('Mick Hesselink', 'Middenvelder', 1000000),
  ('Arjen Hulskotte', 'Middenvelder', 1000000),
  ('Bart van Koersveld', 'Middenvelder', 1000000),
  ('Cas van Kuilenburg', 'Middenvelder', 1000000),
  ('Diederik Lohuis', 'Verdediger', 1000000),
  ('Diederik Nijhuis', 'Aanvaller', 1000000),
  ('Bram Luft', 'Keeper', 1000000),
  ('Jochem Oude Hengel', 'Middenvelder', 1000000),
  ('Marlon Sanchez', 'Middenvelder', 1000000),
  ('Remco Schulte', 'Middenvelder', 1000000),
  ('Bart Weghorst', 'Middenvelder', 1000000),
  ('Rens Oortman', 'Middenvelder', 1000000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'KOSC 3' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- KOSC 7 spelers (met waarden)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Tom Linders', 'Keeper', 1000000),
  ('Ties Bolscher', 'Middenvelder', 9000000),
  ('Harm Boswerger', 'Aanvaller', 17500000),
  ('Job Eertman', 'Verdediger', 3000000),
  ('Guus van Emmerik', 'Middenvelder', 11000000),
  ('Robert Geerdink', 'Verdediger', 5000000),
  ('Bram Groeneveld', 'Verdediger', 4000000),
  ('Stijn Kamphuis', 'Verdediger', 3000000),
  ('Koen Kaptein', 'Middenvelder', 15000000),
  ('Nick Lammerink', 'Middenvelder', 11000000),
  ('Thijs Lammerink', 'Middenvelder', 9000000),
  ('Wout Morsink', 'Aanvaller', 25000000),
  ('Niek Muller', 'Aanvaller', 13000000),
  ('Luc Nijhuis', 'Verdediger', 4000000),
  ('Sander Nijhuis', 'Middenvelder', 10000000),
  ('Sven Onland', 'Verdediger', 5000000),
  ('Ivo Rouwers', 'Verdediger', 5000000),
  ('Jari Korbee', 'Aanvaller', 15000000),
  ('Yannick Weierink', 'Aanvaller', 17500000),
  ('Kai Brunnikhuis', 'Aanvaller', 12500000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'KOSC 7' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- Zaterdag 2 spelers (alleen met positie)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Gijs Broekhuis', 'Aanvaller', 1000000),
  ('Daan Groeneveld', 'Keeper', 1000000),
  ('Sam Holsink', 'Verdediger', 1000000),
  ('Matthijs Luft', 'Verdediger', 1000000),
  ('Douwe Plettenburg', 'Aanvaller', 1000000),
  ('Detlef Rorink', 'Verdediger', 1000000),
  ('Marc Sanders', 'Middenvelder', 1000000),
  ('Mart Scholten', 'Aanvaller', 1000000),
  ('Mick Schulten', 'Middenvelder', 1000000),
  ('Teun Swennenhuis', 'Aanvaller', 1000000),
  ('Jarmo Veenhuis', 'Verdediger', 1000000),
  ('Stef Brons', 'Middenvelder', 1000000),
  ('Nick Veldhuis', 'Middenvelder', 1000000),
  ('Stijn Steghuis', 'Verdediger', 1000000),
  ('Bas Velers', 'Middenvelder', 1000000),
  ('Tijmen Kruse', 'Verdediger', 1000000),
  ('Stef Velers', 'Verdediger', 1000000),
  ('Tom Velthuis', 'Middenvelder', 1000000),
  ('Sem Vonder', 'Verdediger', 1000000),
  ('Wessel Broekhuis', 'Middenvelder', 1000000),
  ('Max Weustink', 'Aanvaller', 1000000),
  ('Julian Broekhuis', 'Aanvaller', 1000000),
  ('Mark Wortelboer', 'Middenvelder', 1000000),
  ('Tjerk Baasdam', 'Aanvaller', 1000000),
  ('Jorg Smellink', 'Aanvaller', 1000000),
  ('Tijn Veldboer', 'Middenvelder', 1000000),
  ('Thijs Kaptein', 'Aanvaller', 1000000),
  ('Pepijn Kokhuis', 'Verdediger', 1000000),
  ('Tim Scholte Lubberink', 'Aanvaller', 1000000),
  ('Cisse Luft', 'Middenvelder', 1000000),
  ('Lars Heerink', 'Verdediger', 1000000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'Zaterdag 2' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- Zaterdag 3 spelers (alleen met positie)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Gijs Boswerger', 'Middenvelder', 1000000),
  ('Milan Sanders', 'Middenvelder', 1000000),
  ('Max Holsbeek', 'Middenvelder', 1000000),
  ('Niels Bodde', 'Middenvelder', 1000000),
  ('Nijs Kemna', 'Middenvelder', 1000000),
  ('Philip Lammers', 'Middenvelder', 1000000),
  ('Luka Lammers', 'Middenvelder', 1000000),
  ('Jurre Stevelink', 'Aanvaller', 1000000),
  ('Rens Bonke', 'Verdediger', 1000000),
  ('David Groeneveld', 'Verdediger', 1000000),
  ('Stef Brons', 'Middenvelder', 1000000),
  ('Stijn Steghuis', 'Verdediger', 1000000),
  ('Tijmen Kruse', 'Verdediger', 1000000),
  ('Tom Velthuis', 'Middenvelder', 1000000),
  ('Wessel Broekhuis', 'Middenvelder', 1000000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'Zaterdag 3' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- KOSC 4 spelers (met waarden)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Stijn Bruns', 'Verdediger', 8000000),
  ('Bas Bruns', 'Aanvaller', 15000000),
  ('Tim Bruns', 'Middenvelder', 10000000),
  ('Wouter Engbers', 'Verdediger', 8000000),
  ('Tom Eppink', 'Verdediger', 3000000),
  ('Dirk Hemmer', 'Middenvelder', 12000000),
  ('Mike Hesselink', 'Middenvelder', 10000000),
  ('Ties Kamphuis', 'Aanvaller', 6000000),
  ('Jelle Keupink', 'Verdediger', 6000000),
  ('Cliff Roetenberg', 'Aanvaller', 17500000),
  ('Tony Sijtsma', 'Verdediger', 6000000),
  ('Wouter Sleiderink', 'Middenvelder', 15000000),
  ('Tom Steggink', 'Verdediger', 6000000),
  ('Kevin Stroot', 'Middenvelder', 12000000),
  ('Wessel Vrerink', 'Aanvaller', 15000000),
  ('Jelme Weierink', 'Aanvaller', 17500000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'KOSC 4' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- KOSC 5 spelers (alleen met positie)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Kevin Bonnes', 'Middenvelder', 1000000),
  ('Tom Borgerink', 'Middenvelder', 1000000),
  ('Ruud Bossink', 'Middenvelder', 1000000),
  ('Ivo Burink', 'Middenvelder', 1000000),
  ('Daan Holsink', 'Middenvelder', 1000000),
  ('Oscar Hoogslag', 'Middenvelder', 1000000),
  ('Stef Kamphuis', 'Middenvelder', 1000000),
  ('Stefan Kamphuis', 'Middenvelder', 1000000),
  ('Dennis Kreuwel', 'Aanvaller', 1000000),
  ('Niels Kuipers', 'Middenvelder', 1000000),
  ('Rens Leussink', 'Middenvelder', 1000000),
  ('Gijs Nijhuis', 'Middenvelder', 1000000),
  ('Thijs Nijhuis', 'Middenvelder', 1000000),
  ('Sam ten Oever', 'Middenvelder', 1000000),
  ('Lars Telgenhof oude Koehorst', 'Middenvelder', 1000000),
  ('Wout Velthuis', 'Keeper', 1000000),
  ('Mart Weusthof', 'Middenvelder', 1000000),
  ('Tijn Weusthof', 'Middenvelder', 1000000),
  ('Stan Zeevat', 'Middenvelder', 1000000),
  ('Lard Laarhuis', 'Middenvelder', 1000000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'KOSC 5' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- KOSC 6 spelers (alleen met positie)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Ralph Brandehof', 'Middenvelder', 1000000),
  ('Stijn Busscher', 'Middenvelder', 1000000),
  ('Boet Hagedoorn', 'Verdediger', 1000000),
  ('Jurre Ter Horst', 'Aanvaller', 1000000),
  ('Wout Huusken', 'Keeper', 1000000),
  ('Jorni Krop', 'Middenvelder', 1000000),
  ('Rense Luft', 'Middenvelder', 1000000),
  ('Roy Nieuwe Weme', 'Middenvelder', 1000000),
  ('Rogier Oldenkamp', 'Middenvelder', 1000000),
  ('Gijs Poelsma', 'Middenvelder', 1000000),
  ('Jasper Roozeboom', 'Middenvelder', 1000000),
  ('Sverre Rorink', 'Middenvelder', 1000000),
  ('Twan Schulte', 'Middenvelder', 1000000),
  ('Ruben Sleiderink', 'Middenvelder', 1000000),
  ('Teun Snoeijink', 'Aanvaller', 1000000),
  ('Stan Velthuis', 'Middenvelder', 1000000),
  ('Stef de Witte', 'Middenvelder', 1000000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'KOSC 6' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- KOSC A1 spelers (alleen met positie)
INSERT INTO players (name, team_id, position_id, price) 
SELECT p.name, t.id, pos.id, p.price
FROM (VALUES 
  ('Alan Groeneveld', 'Verdediger', 1000000),
  ('Bouw Snoeijink', 'Middenvelder', 1000000),
  ('Kaylan van Gemerden', 'Aanvaller', 1000000),
  ('Mika Smellink', 'Middenvelder', 1000000),
  ('Tijmen oude Hengel', 'Middenvelder', 1000000),
  ('Axel Groothuis', 'Middenvelder', 1000000),
  ('Hidde Brunnikhuis', 'Middenvelder', 1000000),
  ('Pieter olde Klieverink', 'Middenvelder', 1000000),
  ('Sebas Kruse', 'Middenvelder', 1000000),
  ('Tijn Eertman', 'Middenvelder', 1000000),
  ('Xen Brandehof', 'Aanvaller', 1000000),
  ('Douwe Wolkorte', 'Middenvelder', 1000000),
  ('Constantijn Dijkhof', 'Middenvelder', 1000000),
  ('Sebastiaan Geuke', 'Keeper', 1000000)
) AS p(name, position, price)
CROSS JOIN teams t
CROSS JOIN positions pos
WHERE t.name = 'KOSC A1' AND pos.name = p.position
ON CONFLICT (name, team_id) DO NOTHING;

-- Enable RLS op alle tabellen
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Policies voor teams
CREATE POLICY "Allow authenticated users to read teams" ON teams
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage teams" ON teams
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies voor positions
CREATE POLICY "Allow authenticated users to read positions" ON positions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage positions" ON positions
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies voor players
CREATE POLICY "Allow authenticated users to read players" ON players
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage players" ON players
  FOR ALL USING (auth.role() = 'authenticated');

-- Indexes voor betere performance
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_position_id ON players(position_id);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(name);
CREATE INDEX IF NOT EXISTS idx_teams_code ON teams(code);
