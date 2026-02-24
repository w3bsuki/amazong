-- Drop the old function with varchar signature
DROP FUNCTION IF EXISTS public.get_or_create_conversation(UUID, UUID, UUID, VARCHAR);
DROP FUNCTION IF EXISTS public.get_or_create_conversation(UUID, UUID, UUID, TEXT);

-- ============================================================================
-- FIX: get_or_create_conversation should find ANY existing conversation
-- when no product_id is specified (for "Contact Store" from profile page)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  p_seller_id UUID,
  p_product_id UUID DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_subject TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id UUID;
  v_buyer_id UUID;
BEGIN
  v_buyer_id := auth.uid();
  
  -- Check if user is trying to message themselves
  IF v_buyer_id = p_seller_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;
  
  -- Check if blocked (either direction) - function may not exist yet
  BEGIN
    IF public.is_blocked_bidirectional(v_buyer_id, p_seller_id) THEN
      RAISE EXCEPTION 'Cannot start conversation - user is blocked';
    END IF;
  EXCEPTION WHEN undefined_function THEN
    -- Function doesn't exist, skip block check
    NULL;
  END;
  
  -- PRIORITY 1: If specific product_id provided, look for that exact conversation
  IF p_product_id IS NOT NULL THEN
    SELECT id INTO v_conversation_id
    FROM conversations
    WHERE buyer_id = v_buyer_id
      AND seller_id = p_seller_id
      AND product_id = p_product_id
    LIMIT 1;
  END IF;
  
  -- PRIORITY 2: If specific order_id provided, look for that exact conversation
  IF v_conversation_id IS NULL AND p_order_id IS NOT NULL THEN
    SELECT id INTO v_conversation_id
    FROM conversations
    WHERE buyer_id = v_buyer_id
      AND seller_id = p_seller_id
      AND order_id = p_order_id
    LIMIT 1;
  END IF;
  
  -- PRIORITY 3: No product or order specified (general store contact)
  -- Find ANY existing conversation with this seller (most recent)
  IF v_conversation_id IS NULL AND p_product_id IS NULL AND p_order_id IS NULL THEN
    SELECT id INTO v_conversation_id
    FROM conversations
    WHERE buyer_id = v_buyer_id
      AND seller_id = p_seller_id
    ORDER BY last_message_at DESC NULLS LAST, created_at DESC
    LIMIT 1;
  END IF;
  
  -- Create new conversation if none found
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (buyer_id, seller_id, product_id, order_id, subject)
    VALUES (v_buyer_id, p_seller_id, p_product_id, p_order_id, p_subject)
    RETURNING id INTO v_conversation_id;
  END IF;
  
  RETURN v_conversation_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_or_create_conversation(UUID, UUID, UUID, TEXT) TO authenticated;

COMMENT ON FUNCTION public.get_or_create_conversation IS 
'Get existing or create new conversation with a seller. 
When no product_id or order_id specified, returns the most recent conversation with that seller.';;
