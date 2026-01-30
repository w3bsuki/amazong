-- Migration: Add participant check to mark_messages_read
-- Security fix: Prevent marking messages in conversations user isn't part of
-- Issue: Function only checked sender_id != user, not that user is buyer/seller

CREATE OR REPLACE FUNCTION public.mark_messages_read(p_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_is_buyer BOOLEAN;
BEGIN
  -- SECURITY FIX: Verify user is a participant in this conversation
  IF NOT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = p_conversation_id
    AND (buyer_id = v_user_id OR seller_id = v_user_id)
  ) THEN
    RAISE EXCEPTION 'Access denied: not a conversation participant';
  END IF;

  -- Determine if user is buyer (for field updates)
  SELECT buyer_id = v_user_id INTO v_is_buyer
  FROM public.conversations
  WHERE id = p_conversation_id;

  -- Mark unread messages from other party as read
  UPDATE public.messages
  SET is_read = true, read_at = now()
  WHERE conversation_id = p_conversation_id
  AND sender_id != v_user_id
  AND is_read = false;

  -- Clear unread count for this user
  IF v_is_buyer THEN
    UPDATE public.conversations
    SET buyer_unread = 0, updated_at = now()
    WHERE id = p_conversation_id;
  ELSE
    UPDATE public.conversations
    SET seller_unread = 0, updated_at = now()
    WHERE id = p_conversation_id;
  END IF;
END;
$function$;

-- Ensure only authenticated users can execute
REVOKE ALL ON FUNCTION public.mark_messages_read(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.mark_messages_read(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.mark_messages_read(uuid) TO authenticated;

COMMENT ON FUNCTION public.mark_messages_read IS 'Mark messages as read for current user in a conversation. Security: validates user is buyer or seller in conversation.';
