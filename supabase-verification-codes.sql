-- Create verification codes table
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_code ON verification_codes(email, code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON verification_codes(user_id);

-- Function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to create verification code
CREATE OR REPLACE FUNCTION create_verification_code(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  verification_code TEXT;
BEGIN
  -- Generate a unique 4-digit code
  LOOP
    verification_code := generate_verification_code();
    
    -- Check if code already exists and is not expired
    IF NOT EXISTS (
      SELECT 1 FROM verification_codes 
      WHERE code = verification_code 
      AND email = user_email 
      AND expires_at > NOW()
    ) THEN
      EXIT;
    END IF;
  END LOOP;
  
  -- Insert the verification code
  INSERT INTO verification_codes (user_id, email, code, expires_at)
  SELECT id, email, verification_code, NOW() + INTERVAL '5 minutes'
  FROM auth.users
  WHERE email = user_email;
  
  RETURN verification_code;
END;
$$ LANGUAGE plpgsql;

-- Function to verify code
CREATE OR REPLACE FUNCTION verify_code(user_email TEXT, input_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  code_record RECORD;
BEGIN
  -- Find the verification code
  SELECT * INTO code_record
  FROM verification_codes
  WHERE email = user_email 
    AND code = input_code 
    AND expires_at > NOW() 
    AND NOT used;
  
  -- If code found and valid, mark as used
  IF FOUND THEN
    UPDATE verification_codes 
    SET used = TRUE 
    WHERE id = code_record.id;
    
    -- Mark user as email confirmed
    UPDATE auth.users 
    SET email_confirmed_at = NOW() 
    WHERE email = user_email;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- RLS policies
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own verification codes
CREATE POLICY "Users can view own verification codes" ON verification_codes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own verification codes
CREATE POLICY "Users can insert own verification codes" ON verification_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own verification codes
CREATE POLICY "Users can update own verification codes" ON verification_codes
  FOR UPDATE USING (auth.uid() = user_id);

-- Clean up expired codes (run this periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_codes()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM verification_codes 
  WHERE expires_at < NOW() OR used = TRUE;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
