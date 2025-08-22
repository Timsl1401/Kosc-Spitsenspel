# Simplified Database Schema for KOSC Spitsenspel

## 🎯 **Why Simplify?**

The original schema had 6 tables with complex relationships. The simplified version uses just **3 tables** while maintaining all functionality:

### **Original Schema (6 tables)**
- `teams` - Team information
- `players` - Player information (with team_id foreign key)
- `matches` - Match results
- `goals` - Individual goal records
- `user_players` - User's selected players
- `rankings` - User standings

### **Simplified Schema (3 tables)**
- `players` - Player info + team info combined
- `matches` - Match results (simplified)
- `user_teams` - User selections + rankings combined

## 🗄️ **Table Structure**

### **1. `players` Table**
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  team_name TEXT NOT NULL,        -- Team name directly stored
  team_level INTEGER NOT NULL,    -- Team level (1-8)
  points_multiplier DECIMAL(3,1), -- Points per goal
  price INTEGER NOT NULL,         -- Player price
  goals_scored INTEGER DEFAULT 0, -- Goals scored this season
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Benefits:**
- ✅ No need for JOINs to get team info
- ✅ Simpler queries
- ✅ Faster performance
- ✅ Easier to maintain

### **2. `matches` Table**
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  match_date DATE NOT NULL,
  is_competitive BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);
```

**Benefits:**
- ✅ Simpler structure
- ✅ No complex goal tracking needed
- ✅ Goals are stored directly in players table

### **3. `user_teams` Table**
```sql
CREATE TABLE user_teams (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  player_ids UUID[] NOT NULL,     -- Array of selected player IDs
  total_points INTEGER DEFAULT 0,
  team_value INTEGER DEFAULT 0,
  goals_count INTEGER DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'current',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Benefits:**
- ✅ Combines user selections and rankings
- ✅ Uses PostgreSQL arrays for efficient storage
- ✅ Single table for user data
- ✅ Easier to query and update

## 🔄 **Data Flow**

### **Adding Goals**
Instead of creating separate goal records, simply update the player:
```sql
UPDATE players 
SET goals_scored = goals_scored + 1 
WHERE id = 'player-uuid';
```

### **Calculating Points**
Points are calculated directly from player data:
```sql
SELECT SUM(points_multiplier * goals_scored) as total_points
FROM players 
WHERE id = ANY(user_team.player_ids);
```

### **User Team Management**
```sql
-- Add player to team
UPDATE user_teams 
SET player_ids = array_append(player_ids, 'new-player-uuid')
WHERE user_id = 'user-uuid';

-- Remove player from team
UPDATE user_teams 
SET player_ids = array_remove(player_ids, 'player-uuid')
WHERE user_id = 'user-uuid';
```

## 📊 **Sample Queries**

### **Get All Players with Team Info**
```sql
SELECT * FROM players ORDER BY team_level, name;
```

### **Get User's Team Value**
```sql
SELECT SUM(p.price) as team_value
FROM user_teams ut
JOIN unnest(ut.player_ids) AS player_id(id) ON true
JOIN players p ON p.id = player_id.id
WHERE ut.user_id = 'user-uuid';
```

### **Get Team Overview**
```sql
SELECT * FROM team_overview ORDER BY team_level;
```

### **Calculate User Points**
```sql
SELECT calculate_user_points('user-uuid', 'current') as total_points;
```

## 🚀 **Performance Benefits**

1. **Fewer JOINs**: Direct access to team info in players table
2. **Array Operations**: PostgreSQL arrays are very efficient
3. **Simplified Queries**: Easier to write and optimize
4. **Reduced Complexity**: Less chance for errors

## 🔧 **Migration from Original Schema**

If you have existing data, you can migrate it:

```sql
-- Migrate teams data to players
UPDATE players 
SET 
  team_name = (SELECT name FROM teams WHERE id = players.team_id),
  team_level = (SELECT level FROM teams WHERE id = players.team_id),
  points_multiplier = (SELECT points_multiplier FROM teams WHERE id = players.team_id);

-- Migrate goals to players
UPDATE players 
SET goals_scored = (
  SELECT COUNT(*) FROM goals WHERE player_id = players.id
);

-- Migrate user selections
INSERT INTO user_teams (user_id, player_ids, period)
SELECT 
  user_id, 
  array_agg(player_id) as player_ids,
  'current' as period
FROM user_players 
GROUP BY user_id;
```

## ✅ **What You Get**

- **Simpler Code**: Fewer database queries
- **Better Performance**: Faster data access
- **Easier Maintenance**: Less complex relationships
- **Same Functionality**: All features preserved
- **Future-Proof**: Easier to extend and modify

## 🎯 **Use Cases**

This simplified schema is perfect for:
- ✅ Fantasy sports applications
- ✅ User team management
- ✅ Real-time scoring updates
- ✅ Simple reporting and analytics
- ✅ Mobile applications

---

**Bottom Line**: You get the same functionality with 50% fewer tables and much simpler code! 🚀
