-- Drop existing policies
DROP POLICY IF EXISTS "conversations_select_participant" ON conversations;
DROP POLICY IF EXISTS "conversations_insert_buyer" ON conversations;
DROP POLICY IF EXISTS "conversations_update_participant" ON conversations;

-- Recreate with optimized auth.uid() pattern
CREATE POLICY "conversations_select_participant" ON conversations
  FOR SELECT USING (
    buyer_id = (SELECT auth.uid()) OR seller_id = (SELECT auth.uid())
  );

CREATE POLICY "conversations_insert_buyer" ON conversations
  FOR INSERT WITH CHECK (
    buyer_id = (SELECT auth.uid())
  );

CREATE POLICY "conversations_update_participant" ON conversations
  FOR UPDATE USING (
    buyer_id = (SELECT auth.uid()) OR seller_id = (SELECT auth.uid())
  );

-- Also fix messages policies
DROP POLICY IF EXISTS "messages_select_participant" ON messages;
DROP POLICY IF EXISTS "messages_insert_sender" ON messages;
DROP POLICY IF EXISTS "messages_update_sender" ON messages;

CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = messages.conversation_id 
      AND (c.buyer_id = (SELECT auth.uid()) OR c.seller_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY "messages_insert_sender" ON messages
  FOR INSERT WITH CHECK (
    sender_id = (SELECT auth.uid()) AND
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = messages.conversation_id 
      AND (c.buyer_id = (SELECT auth.uid()) OR c.seller_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY "messages_update_sender" ON messages
  FOR UPDATE USING (
    sender_id = (SELECT auth.uid())
  );;
