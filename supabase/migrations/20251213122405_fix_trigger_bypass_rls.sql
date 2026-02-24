-- Fix the trigger function to properly handle RLS
-- The issue is that even with SECURITY DEFINER, RLS may still apply
-- We need to add a policy that allows the system to create conversations for orders

-- Option 1: Add a service-level policy for INSERT
-- First, let's create a more permissive INSERT policy for when order_id is provided
CREATE POLICY conversations_insert_for_orders ON conversations
FOR INSERT
WITH CHECK (
  -- Allow if buyer is the current user
  buyer_id = auth.uid()
  OR 
  -- Allow if this is linked to an order where the user is the buyer
  EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.id = order_id 
    AND o.user_id = auth.uid()
  )
);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS conversations_insert_buyer ON conversations;

-- Also add a policy for messages table to allow system messages
CREATE POLICY messages_insert_system ON messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  OR 
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

-- Drop old message insert policy if it's too restrictive
DROP POLICY IF EXISTS messages_insert_sender ON messages;;
