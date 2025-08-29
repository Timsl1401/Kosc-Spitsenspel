# KOSC Spitsenspel - Troubleshooting Guide

## 🎯 **Huidige Status**
- ✅ Development server draait op port 3000
- ✅ Database schema bestaat (gedeeltelijk)
- ❌ Sommige functies werken nog niet volledig

## 🔍 **Diagnose Uitvoeren**

### Stap 1: Check Database State
```sql
-- Run dit in Supabase SQL Editor
\i SQL/diagnose_current_state.sql
```

Dit toont:
- Welke tabellen bestaan
- Welke RPC functies bestaan
- Welke RLS policies actief zijn
- Aantallen records per tabel

### Stap 2: Test Belangrijkste Functies
```sql
-- Test RPC functies
SELECT get_team_points('KOSC1');
SELECT is_transfer_allowed();
SELECT calculate_user_points();

-- Test data queries
SELECT COUNT(*) FROM players;
SELECT COUNT(*) FROM teams;
SELECT * FROM game_settings WHERE is_public = true;
```

## 🛠️ **Comprehensive Fix**

Als de diagnose problemen toont, run dan:

```sql
-- VOLLEDIGE RESET - Run dit in Supabase SQL Editor
\i SQL/comprehensive_fix.sql
```

Dit lost ALLE problemen op:
- ✅ Verwijdert alle conflicterende policies
- ✅ Herbouwt alle tabellen veilig
- ✅ Creëert alle RPC functies
- ✅ Seeds alle benodigde data
- ✅ Stelt veilige RLS policies in
- ✅ Herlaadt schema cache

## 📋 **Wat de Comprehensive Fix Doet**

### Database Tabellen
- `teams`, `positions`, `players`, `seasons`
- `matches`, `goals`, `user_profiles`
- `game_settings`, `user_teams`, `transfers`
- `user_points`, `feedback`, `admin_users`, `admin_emails`

### RPC Functies
- `get_team_points(team_code)` - Voor puntenberekening
- `is_transfer_allowed()` - Voor transfer restricties
- `calculate_user_points()` - Voor puntenberekening

### RLS Policies
- Public read voor reference data
- User-specific policies voor eigen data
- Admin policies zonder infinite recursion

### Seed Data
- Teams (KOSC 1-5, Zondag teams)
- Positions (Aanvaller, Middenvelder, Verdediger, Doelman)
- Seasons (2024-2025)
- Game settings
- Sample players

## 🎮 **Test Plan**

Na het uitvoeren van de comprehensive fix:

### 1. Dashboard Testen
- ✅ Login en navigation
- ✅ Team punten weergave (geen Promise errors)
- ✅ Speler kopen/verkochen (geen bought_price errors)
- ✅ Leaderboard laden

### 2. Admin Dashboard Testen
- ✅ Login als admin
- ✅ Game settings updaten (geen permission errors)
- ✅ Players beheren
- ✅ Goals toevoegen

### 3. Algemene Functionaliteit
- ✅ Transfer restricties
- ✅ Puntenberekening
- ✅ Feedback systeem

## 🚨 **Als Er Nog Problemen Zijn**

### Probleem: Nog steeds errors
```sql
-- Reset volledig naar werkende staat
\i SQL/final_working_schema.sql
```

### Probleem: Admin permissions
```sql
-- Fix alleen admin permissions
\i SQL/fix_admin_permissions.sql
```

### Probleem: Specifieke functie mist
```sql
-- Check welke functies bestaan
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public';
```

## 📞 **Support**

Als er nog problemen zijn na het uitvoeren van de comprehensive fix:

1. **Run diagnose eerst**: `\i SQL/diagnose_current_state.sql`
2. **Deel de output** van de diagnose queries
3. **Beschrijf specifiek** welke fouten je ziet

## 🎯 **Einddoel**

Na succesvolle uitvoering van de comprehensive fix:
- ✅ Alle database fouten opgelost
- ✅ Alle frontend integratie werkt
- ✅ Admin functies volledig werkend
- ✅ Backup systeem actief voor herstel

**Veel succes met het oplossen van de resterende problemen!** 🚀


