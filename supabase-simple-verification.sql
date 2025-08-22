-- Add verification columns to existing users table
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS verification_code TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to set verification code for user
CREATE OR REPLACE FUNCTION set_verification_code(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  verification_code TEXT;
BEGIN
  -- Generate a unique 4-digit code
  verification_code := generate_verification_code();
  
  -- Update the user with the verification code
  UPDATE auth.users 
  SET verification_code = verification_code,
      is_verified = FALSE
  WHERE email = user_email;
  
  RETURN verification_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to verify code
CREATE OR REPLACE FUNCTION verify_user_code(user_email TEXT, input_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if code matches and mark as verified
  UPDATE auth.users 
  SET is_verified = TRUE,
      verification_code = NULL,
      email_confirmed_at = NOW()
  WHERE email = user_email 
    AND verification_code = input_code;
  
  -- Return true if a row was updated
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
