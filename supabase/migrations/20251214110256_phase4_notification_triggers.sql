-- ============================================================================
-- TRIGGER: Auto-create notification on new message (except for sender)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv RECORD;
  recipient_id UUID;
  sender_name TEXT;
  conv_subject TEXT;
BEGIN
  -- Get conversation details
  SELECT * INTO conv FROM conversations WHERE id = NEW.conversation_id;
  
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  
  -- Determine recipient (the other party)
  IF NEW.sender_id = conv.buyer_id THEN
    recipient_id := conv.seller_id;
  ELSE
    recipient_id := conv.buyer_id;
  END IF;
  
  -- Get sender name
  SELECT full_name INTO sender_name 
  FROM profiles 
  WHERE id = NEW.sender_id;
  
  -- Get conversation subject or product title
  conv_subject := COALESCE(conv.subject, 'New message');
  
  -- Don't create notification for system messages
  IF NEW.message_type = 'system' THEN
    RETURN NEW;
  END IF;
  
  -- Create notification for recipient
  INSERT INTO notifications (user_id, type, title, body, conversation_id, data)
  VALUES (
    recipient_id,
    'message',
    COALESCE(sender_name, 'Someone') || ' sent you a message',
    LEFT(NEW.content, 100),
    NEW.conversation_id,
    jsonb_build_object(
      'sender_id', NEW.sender_id,
      'sender_name', sender_name,
      'message_preview', LEFT(NEW.content, 100)
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger (if not exists pattern)
DROP TRIGGER IF EXISTS on_message_notify ON public.messages;
CREATE TRIGGER on_message_notify
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_new_message();;
