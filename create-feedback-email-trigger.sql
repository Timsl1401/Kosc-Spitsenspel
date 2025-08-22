-- Create trigger function to send feedback emails automatically
CREATE OR REPLACE FUNCTION send_feedback_email_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- This function will be called every time feedback is inserted
  -- We'll use Supabase's built-in email functionality
  
  -- For now, we'll just log that feedback was received
  -- The actual email sending will be configured in Supabase Dashboard
  
  RAISE NOTICE 'Feedback received from % with subject: %', NEW.name, NEW.subject;
  
  -- You can configure email sending in Supabase Dashboard:
  -- 1. Go to Authentication > Email Templates
  -- 2. Create a new template for "Feedback received"
  -- 3. Set it to send to spitsenspelkosc@gmail.com
  -- 4. Configure the template with the feedback data
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS feedback_email_trigger ON feedback;
CREATE TRIGGER feedback_email_trigger
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION send_feedback_email_trigger();

-- Note: To actually send emails automatically, you need to:
-- 1. Go to Supabase Dashboard > Authentication > Email Templates
-- 2. Create a custom template for feedback
-- 3. Configure it to send to spitsenspelkosc@gmail.com
-- 4. Use the feedback data in your template
