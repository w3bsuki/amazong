-- ============================================================================
-- PREVENT BLOCKED USERS FROM MESSAGING
-- ============================================================================

-- Check if message is allowed (not blocked)
CREATE OR REPLACE FUNCTION public.check_message_allowed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_other_participant UUID;
BEGIN
  -- Get the other participant in the conversation
  SELECT 
    CASE 
      WHEN buyer_id = NEW.sender_id THEN seller_id
      ELSE buyer_id
    END INTO v_other_participant
  FROM conversations
  WHERE id = NEW.conversation_id;
  
  -- Check if either user has blocked the other
  IF is_blocked_bidirectional(NEW.sender_id, v_other_participant) THEN
    RAISE EXCEPTION 'Cannot send message - user is blocked';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to check before inserting messages
DROP TRIGGER IF EXISTS check_message_block ON messages;
CREATE TRIGGER check_message_block
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION check_message_allowed();;
