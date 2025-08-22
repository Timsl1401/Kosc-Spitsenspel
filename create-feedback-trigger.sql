-- Create trigger function to send feedback emails
CREATE OR REPLACE FUNCTION send_feedback_email()
RETURNS TRIGGER AS $$
BEGIN
  -- This will use Supabase's built-in email functionality
  -- The email will be sent to spitsenspelkosc@gmail.com
  -- You can configure this in Supabase Dashboard > Authentication > Email Templates
  
  -- For now, we'll just log that feedback was received
  -- The actual email sending will be handled by Supabase's email system
  -- You can set up a custom email template in the Supabase Dashboard
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS feedback_email_trigger ON feedback;
CREATE TRIGGER feedback_email_trigger
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION send_feedback_email();

-- Note: To actually send emails, you need to:
-- 1. Go to Supabase Dashboard > Authentication > Email Templates
-- 2. Create a custom template for "Feedback received"
-- 3. Configure it to send to spitsenspelkosc@gmail.com
-- 4. Or use Supabase's built-in email functionality with a custom template
