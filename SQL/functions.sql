-- Function to buy a player
CREATE OR REPLACE FUNCTION buy_player(
    p_user_id UUID,
    p_player_id UUID,
    p_price BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update user budget (subtract player price)
    UPDATE users 
    SET budget = budget - p_price
    WHERE id = p_user_id;
    
    -- Add player to user's team
    INSERT INTO player_user (user_id, player_id)
    VALUES (p_user_id, p_player_id);
    
    -- Log the transaction
    INSERT INTO user_logs (user_id, action, details)
    VALUES (
        p_user_id, 
        'buy_player', 
        jsonb_build_object(
            'player_id', p_player_id,
            'price', p_price,
            'timestamp', now()
        )
    );
END;
$$;

-- Function to sell a player
CREATE OR REPLACE FUNCTION sell_player(
    p_user_id UUID,
    p_player_id UUID,
    p_price BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update user budget (add player price)
    UPDATE users 
    SET budget = budget + p_price
    WHERE id = p_user_id;
    
    -- Remove player from user's team
    DELETE FROM player_user 
    WHERE user_id = p_user_id AND player_id = p_player_id;
    
    -- Log the transaction
    INSERT INTO user_logs (user_id, action, details)
    VALUES (
        p_user_id, 
        'sell_player', 
        jsonb_build_object(
            'player_id', p_player_id,
            'price', p_price,
            'timestamp', now()
        )
    );
END;
$$;

-- Function to calculate user points based on goals
CREATE OR REPLACE FUNCTION calculate_user_points(p_user_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_points BIGINT := 0;
BEGIN
    -- Calculate points from goals scored by user's players
    SELECT COALESCE(SUM(g.amount_points), 0)
    INTO total_points
    FROM goals g
    JOIN player_user pu ON g.player_id = pu.player_id
    WHERE pu.user_id = p_user_id;
    
    -- Update user's total points
    UPDATE users 
    SET points = total_points
    WHERE id = p_user_id;
    
    RETURN total_points;
END;
$$;

-- Function to update all user points
CREATE OR REPLACE FUNCTION update_all_user_points()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM users LOOP
        PERFORM calculate_user_points(user_record.id);
    END LOOP;
END;
$$;

-- Function to get user team with player details
CREATE OR REPLACE FUNCTION get_user_team(p_user_id UUID)
RETURNS TABLE (
    player_id UUID,
    player_name VARCHAR,
    team_name VARCHAR,
    position_name VARCHAR,
    price BIGINT,
    age INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as player_id,
        p.name as player_name,
        t.name as team_name,
        pos.name as position_name,
        p.price,
        p.age
    FROM player_user pu
    JOIN players p ON pu.player_id = p.id
    JOIN teams t ON p.team_id = t.id
    LEFT JOIN positions pos ON p.position_id = pos.id
    WHERE pu.user_id = p_user_id
    ORDER BY p.name;
END;
$$;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(p_user_id UUID)
RETURNS TABLE (
    total_players INTEGER,
    total_value BIGINT,
    total_points BIGINT,
    substitutes INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(pu.player_id)::INTEGER as total_players,
        COALESCE(SUM(p.price), 0) as total_value,
        COALESCE(u.points, 0) as total_points,
        COALESCE(u.substitutes, 0) as substitutes
    FROM users u
    LEFT JOIN player_user pu ON u.id = pu.user_id
    LEFT JOIN players p ON pu.player_id = p.id
    WHERE u.id = p_user_id
    GROUP BY u.id, u.points, u.substitutes;
END;
$$;

-- Function to get rankings with user details
CREATE OR REPLACE FUNCTION get_rankings(p_period_id UUID DEFAULT NULL)
RETURNS TABLE (
    rank INTEGER,
    user_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    points DECIMAL,
    period_name VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY r.points DESC)::INTEGER as rank,
        r.user_id,
        u.first_name,
        u.last_name,
        r.points,
        p.name as period_name
    FROM rankings r
    JOIN users u ON r.user_id = u.id
    JOIN periods p ON r.period_id = p.id
    WHERE (p_period_id IS NULL OR r.period_id = p_period_id)
    ORDER BY r.points DESC;
END;
$$;

-- Function to create a new sub league
CREATE OR REPLACE FUNCTION create_sub_league(
    p_name VARCHAR,
    p_creator_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_sub_league_id UUID;
    invite_code VARCHAR;
BEGIN
    -- Generate unique invite code
    invite_code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Create sub league
    INSERT INTO sub_leagues (name, invite_code)
    VALUES (p_name, invite_code)
    RETURNING id INTO new_sub_league_id;
    
    -- Add creator as member
    INSERT INTO subleague_user (sub_league_id, user_id)
    VALUES (new_sub_league_id, p_creator_id);
    
    RETURN new_sub_league_id;
END;
$$;

-- Function to join a sub league
CREATE OR REPLACE FUNCTION join_sub_league(
    p_invite_code VARCHAR,
    p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    sub_league_id UUID;
BEGIN
    -- Find sub league by invite code
    SELECT id INTO sub_league_id
    FROM sub_leagues
    WHERE invite_code = p_invite_code;
    
    IF sub_league_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if already member
    IF EXISTS (
        SELECT 1 FROM subleague_user 
        WHERE sub_league_id = sub_league_id AND user_id = p_user_id
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Add user to sub league
    INSERT INTO subleague_user (sub_league_id, user_id)
    VALUES (sub_league_id, p_user_id);
    
    RETURN TRUE;
END;
$$;

-- Function to get sub league members
CREATE OR REPLACE FUNCTION get_sub_league_members(p_sub_league_id UUID)
RETURNS TABLE (
    user_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    points BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.points
    FROM subleague_user su
    JOIN users u ON su.user_id = u.id
    WHERE su.sub_league_id = p_sub_league_id
    ORDER BY u.points DESC;
END;
$$;

-- Function to reset user transfers (admin function)
CREATE OR REPLACE FUNCTION reset_user_transfers(p_admin_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM users 
        WHERE id = p_admin_user_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Admin access required';
    END IF;
    
    -- Delete all player associations
    DELETE FROM player_user;
    
    -- Reset user budgets to default
    UPDATE users SET budget = 100000000;
    
    -- Log the action
    INSERT INTO user_logs (user_id, action, details)
    VALUES (
        p_admin_user_id, 
        'reset_transfers', 
        jsonb_build_object(
            'timestamp', now(),
            'description', 'All user transfers reset'
        )
    );
END;
$$;

-- Function to add match result
CREATE OR REPLACE FUNCTION add_match_result(
    p_match_id UUID,
    p_score VARCHAR,
    p_admin_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM users 
        WHERE id = p_admin_user_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Admin access required';
    END IF;
    
    -- Update match score
    UPDATE matches 
    SET score = p_score
    WHERE id = p_match_id;
    
    -- Log the action
    INSERT INTO user_logs (user_id, action, details)
    VALUES (
        p_admin_user_id, 
        'add_match_result', 
        jsonb_build_object(
            'match_id', p_match_id,
            'score', p_score,
            'timestamp', now()
        )
    );
END;
$$;

-- Function to get match statistics
CREATE OR REPLACE FUNCTION get_match_statistics(p_match_id UUID)
RETURNS TABLE (
    total_goals INTEGER,
    total_points INTEGER,
    players_with_goals INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_goals,
        COALESCE(SUM(amount_points), 0)::INTEGER as total_points,
        COUNT(DISTINCT player_id)::INTEGER as players_with_goals
    FROM goals
    WHERE match_id = p_match_id;
END;
$$;
