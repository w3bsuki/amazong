-- =====================================================
-- SELLER-BUYER MESSAGING SYSTEM
-- Date: 2025-11-27
-- Purpose: Enable communication between buyers and sellers
-- Phase 5.5 from PRODUCTION.md
-- =====================================================

-- Step 1: Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL, -- Optional product reference
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL, -- Optional order reference
  subject VARCHAR(255),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  buyer_unread_count INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Prevent duplicate conversations for same buyer/seller/product combo
  UNIQUE(buyer_id, seller_id, product_id)
);

-- Step 2: Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'order_update', 'system')),
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Prevent empty messages
  CONSTRAINT messages_content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

-- Step 3: Enable RLS on new tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for conversations

-- Users can view conversations they are part of
CREATE POLICY "conversations_select_participant"
  ON public.conversations FOR SELECT
  USING (
    buyer_id = (SELECT auth.uid()) OR 
    seller_id = (SELECT auth.uid()) OR 
    public.is_admin()
  );

-- Buyers can create conversations with sellers
CREATE POLICY "conversations_insert_buyer"
  ON public.conversations FOR INSERT
  WITH CHECK (
    buyer_id = (SELECT auth.uid()) AND
    EXISTS (SELECT 1 FROM public.sellers WHERE id = seller_id)
  );

-- Participants can update conversations (close, archive)
CREATE POLICY "conversations_update_participant"
  ON public.conversations FOR UPDATE
  USING (
    buyer_id = (SELECT auth.uid()) OR 
    seller_id = (SELECT auth.uid())
  )
  WITH CHECK (
    buyer_id = (SELECT auth.uid()) OR 
    seller_id = (SELECT auth.uid())
  );

-- Step 5: Create RLS policies for messages

-- Users can view messages in conversations they are part of
CREATE POLICY "messages_select_participant"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = (SELECT auth.uid()) OR c.seller_id = (SELECT auth.uid()))
    ) OR public.is_admin()
  );

-- Users can send messages in conversations they are part of
CREATE POLICY "messages_insert_participant"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = (SELECT auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = (SELECT auth.uid()) OR c.seller_id = (SELECT auth.uid()))
      AND c.status = 'open'
    )
  );

-- Users can update their own messages (for read receipts)
CREATE POLICY "messages_update_own"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = (SELECT auth.uid()) OR c.seller_id = (SELECT auth.uid()))
    )
  );

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON public.conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller_id ON public.conversations(seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_product_id ON public.conversations(product_id);
CREATE INDEX IF NOT EXISTS idx_conversations_order_id ON public.conversations(order_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read) WHERE is_read = false;

-- Step 7: Trigger to update conversation last_message_at and unread counts
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS trigger AS $$
DECLARE
  conv RECORD;
BEGIN
  -- Get conversation details
  SELECT buyer_id, seller_id INTO conv 
  FROM public.conversations 
  WHERE id = NEW.conversation_id;

  -- Update last message time
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at,
    -- Increment unread count for the other party
    buyer_unread_count = CASE 
      WHEN NEW.sender_id = conv.seller_id THEN buyer_unread_count + 1 
      ELSE buyer_unread_count 
    END,
    seller_unread_count = CASE 
      WHEN NEW.sender_id = conv.buyer_id THEN seller_unread_count + 1 
      ELSE seller_unread_count 
    END
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS update_conversation_on_new_message ON public.messages;
CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_on_message();

-- Step 8: Function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_read(p_conversation_id UUID)
RETURNS void AS $$
DECLARE
  current_user_id UUID := (SELECT auth.uid());
  conv RECORD;
BEGIN
  -- Get conversation
  SELECT buyer_id, seller_id INTO conv
  FROM public.conversations
  WHERE id = p_conversation_id;

  -- Mark messages as read where current user is not the sender
  UPDATE public.messages
  SET 
    is_read = true,
    read_at = NOW()
  WHERE 
    conversation_id = p_conversation_id
    AND sender_id != current_user_id
    AND is_read = false;

  -- Reset unread count for current user
  UPDATE public.conversations
  SET
    buyer_unread_count = CASE WHEN current_user_id = conv.buyer_id THEN 0 ELSE buyer_unread_count END,
    seller_unread_count = CASE WHEN current_user_id = conv.seller_id THEN 0 ELSE seller_unread_count END
  WHERE id = p_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 9: Function to get unread message count for a user
CREATE OR REPLACE FUNCTION public.get_total_unread_messages()
RETURNS INTEGER AS $$
DECLARE
  current_user_id UUID := (SELECT auth.uid());
  total_unread INTEGER;
BEGIN
  SELECT COALESCE(SUM(
    CASE 
      WHEN buyer_id = current_user_id THEN buyer_unread_count
      WHEN seller_id = current_user_id THEN seller_unread_count
      ELSE 0
    END
  ), 0) INTO total_unread
  FROM public.conversations
  WHERE buyer_id = current_user_id OR seller_id = current_user_id;

  RETURN total_unread;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 10: Function to get or create a conversation
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  p_seller_id UUID,
  p_product_id UUID DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_subject VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  current_user_id UUID := (SELECT auth.uid());
  conv_id UUID;
BEGIN
  -- Check if user is trying to message themselves
  IF current_user_id = p_seller_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;

  -- Try to find existing conversation
  SELECT id INTO conv_id
  FROM public.conversations
  WHERE 
    buyer_id = current_user_id 
    AND seller_id = p_seller_id
    AND (
      (p_product_id IS NULL AND product_id IS NULL) OR 
      product_id = p_product_id
    )
  LIMIT 1;

  -- If no existing conversation, create one
  IF conv_id IS NULL THEN
    INSERT INTO public.conversations (buyer_id, seller_id, product_id, order_id, subject)
    VALUES (current_user_id, p_seller_id, p_product_id, p_order_id, p_subject)
    RETURNING id INTO conv_id;
  END IF;

  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Step 11: Add updated_at trigger for conversations
DROP TRIGGER IF EXISTS handle_conversations_updated_at ON public.conversations;
CREATE TRIGGER handle_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Step 12: Add comments for documentation
COMMENT ON TABLE public.conversations IS 'Messaging conversations between buyers and sellers';
COMMENT ON TABLE public.messages IS 'Individual messages within conversations';
COMMENT ON FUNCTION public.mark_messages_read IS 'Mark all unread messages in a conversation as read';
COMMENT ON FUNCTION public.get_total_unread_messages IS 'Get total unread message count for current user';
COMMENT ON FUNCTION public.get_or_create_conversation IS 'Get existing or create new conversation with a seller';

-- Grant permissions
GRANT SELECT ON public.conversations TO anon;
GRANT ALL ON public.conversations TO authenticated;
GRANT SELECT ON public.messages TO anon;
GRANT ALL ON public.messages TO authenticated;

-- Migration complete
