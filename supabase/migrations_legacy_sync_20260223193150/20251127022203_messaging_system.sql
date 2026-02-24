-- =====================================================
-- SELLER-BUYER MESSAGING SYSTEM MIGRATION
-- Date: 2025-11-27
-- Purpose: Create messaging system for seller-buyer communication
-- Phase 5.5 from PRODUCTION.md
-- =====================================================

-- Step 1: Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  subject VARCHAR(255),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived')),
  buyer_unread_count INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT different_participants CHECK (buyer_id != seller_id)
);

-- Step 2: Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

-- Step 3: Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies for conversations
CREATE POLICY "conversations_select_participant"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
  );

CREATE POLICY "conversations_insert_buyer"
  ON public.conversations FOR INSERT
  WITH CHECK (
    auth.uid() = buyer_id
  );

CREATE POLICY "conversations_update_participant"
  ON public.conversations FOR UPDATE
  USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
  );

-- Step 5: RLS policies for messages
CREATE POLICY "messages_select_participant"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = conversation_id
      AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
    )
  );

CREATE POLICY "messages_insert_participant"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = conversation_id
      AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
    )
  );

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON public.conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller_id ON public.conversations(seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Step 7: Function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_read(p_conversation_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_is_buyer BOOLEAN;
BEGIN
  SELECT buyer_id = v_user_id INTO v_is_buyer
  FROM public.conversations
  WHERE id = p_conversation_id;
  
  UPDATE public.messages
  SET is_read = true, read_at = now()
  WHERE conversation_id = p_conversation_id
  AND sender_id != v_user_id
  AND is_read = false;
  
  IF v_is_buyer THEN
    UPDATE public.conversations
    SET buyer_unread_count = 0, updated_at = now()
    WHERE id = p_conversation_id;
  ELSE
    UPDATE public.conversations
    SET seller_unread_count = 0, updated_at = now()
    WHERE id = p_conversation_id;
  END IF;
END;
$$;

-- Step 8: Function to update unread counts on new message
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_buyer BOOLEAN;
BEGIN
  SELECT buyer_id = NEW.sender_id INTO v_is_buyer
  FROM public.conversations
  WHERE id = NEW.conversation_id;
  
  IF v_is_buyer THEN
    UPDATE public.conversations
    SET 
      seller_unread_count = seller_unread_count + 1,
      last_message_at = NEW.created_at,
      updated_at = now()
    WHERE id = NEW.conversation_id;
  ELSE
    UPDATE public.conversations
    SET 
      buyer_unread_count = buyer_unread_count + 1,
      last_message_at = NEW.created_at,
      updated_at = now()
    WHERE id = NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 9: Create trigger for new messages
DROP TRIGGER IF EXISTS tr_update_conversation_on_message ON public.messages;
CREATE TRIGGER tr_update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_on_message();

-- Step 10: Function to get total unread messages for a user
CREATE OR REPLACE FUNCTION public.get_total_unread_messages()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_total INTEGER;
BEGIN
  SELECT 
    COALESCE(SUM(
      CASE 
        WHEN buyer_id = v_user_id THEN buyer_unread_count
        WHEN seller_id = v_user_id THEN seller_unread_count
        ELSE 0
      END
    ), 0)
  INTO v_total
  FROM public.conversations
  WHERE buyer_id = v_user_id OR seller_id = v_user_id;
  
  RETURN v_total;
END;
$$;

-- Step 11: Function to get or create a conversation
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  p_seller_id UUID,
  p_product_id UUID DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_subject VARCHAR DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_buyer_id UUID := auth.uid();
  v_conversation_id UUID;
BEGIN
  SELECT id INTO v_conversation_id
  FROM public.conversations
  WHERE buyer_id = v_buyer_id
  AND seller_id = p_seller_id
  AND (
    (p_product_id IS NULL AND product_id IS NULL) OR product_id = p_product_id
  )
  AND (
    (p_order_id IS NULL AND order_id IS NULL) OR order_id = p_order_id
  )
  AND status = 'open'
  LIMIT 1;
  
  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations (buyer_id, seller_id, product_id, order_id, subject)
    VALUES (v_buyer_id, p_seller_id, p_product_id, p_order_id, p_subject)
    RETURNING id INTO v_conversation_id;
  END IF;
  
  RETURN v_conversation_id;
END;
$$;;
