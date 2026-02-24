-- =====================================================
-- VERIFICATION & BADGE SYSTEM - COMPLETE SCHEMA
-- Version: 2.0 | December 2025
-- =====================================================

-- =====================================================
-- 1. SELLER FEEDBACK TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.seller_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  item_as_described BOOLEAN DEFAULT true,
  shipping_speed BOOLEAN DEFAULT true,
  communication BOOLEAN DEFAULT true,
  buyer_response TEXT,
  buyer_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK constraint if sellers table exists and constraint doesn't
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'seller_feedback_seller_id_fkey' 
    AND table_name = 'seller_feedback'
  ) THEN
    ALTER TABLE public.seller_feedback 
    ADD CONSTRAINT seller_feedback_seller_id_fkey 
    FOREIGN KEY (seller_id) REFERENCES public.sellers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.seller_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for seller_feedback
DROP POLICY IF EXISTS "seller_feedback_select_all" ON public.seller_feedback;
CREATE POLICY "seller_feedback_select_all" ON public.seller_feedback
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "seller_feedback_insert_buyer" ON public.seller_feedback;
CREATE POLICY "seller_feedback_insert_buyer" ON public.seller_feedback
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "seller_feedback_update_buyer" ON public.seller_feedback;
CREATE POLICY "seller_feedback_update_buyer" ON public.seller_feedback
  FOR UPDATE USING (buyer_id = auth.uid());

-- Index
CREATE INDEX IF NOT EXISTS idx_seller_feedback_seller ON public.seller_feedback(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_feedback_buyer ON public.seller_feedback(buyer_id);
CREATE INDEX IF NOT EXISTS idx_seller_feedback_rating ON public.seller_feedback(rating);

COMMENT ON TABLE public.seller_feedback IS 'Feedback from buyers about sellers';

-- =====================================================
-- 2. BADGE DEFINITIONS (What badges exist)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.badge_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_bg TEXT,
  description TEXT,
  description_bg TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'seller_milestone', 'seller_rating', 'seller_special',
    'buyer_milestone', 'buyer_rating', 'buyer_special',
    'verification', 'subscription'
  )),
  account_type TEXT CHECK (account_type IN ('personal', 'business', 'buyer', 'all')),
  icon TEXT,
  color TEXT,
  tier INTEGER DEFAULT 0,
  is_automatic BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  criteria JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.badge_definitions IS 'Badge definitions with criteria for automatic awarding';

-- =====================================================
-- 3. USER BADGES (Which users have which badges)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badge_definitions(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  awarded_by UUID REFERENCES public.profiles(id),
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, badge_id)
);

COMMENT ON TABLE public.user_badges IS 'Tracks which badges users have earned';

-- =====================================================
-- 4. USER VERIFICATION STATUS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_verification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  phone_number TEXT,
  id_verified BOOLEAN DEFAULT false,
  id_document_type TEXT CHECK (id_document_type IS NULL OR id_document_type IN ('passport', 'id_card', 'drivers_license')),
  id_verified_at TIMESTAMPTZ,
  address_verified BOOLEAN DEFAULT false,
  address_verified_at TIMESTAMPTZ,
  trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_verification IS 'User verification status and trust score';

-- =====================================================
-- 5. BUSINESS VERIFICATION (For business sellers)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.business_verification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE UNIQUE NOT NULL,
  legal_name TEXT,
  vat_number TEXT,
  eik_number TEXT,
  vat_verified BOOLEAN DEFAULT false,
  vat_verified_at TIMESTAMPTZ,
  registration_doc_url TEXT,
  registration_verified BOOLEAN DEFAULT false,
  registration_verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  bank_verified BOOLEAN DEFAULT false,
  bank_verified_at TIMESTAMPTZ,
  verification_level INTEGER DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 5),
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.business_verification IS 'Business seller verification documents and status';

-- =====================================================
-- 6. BUYER FEEDBACK (Sellers rating buyers)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.buyer_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  payment_promptness BOOLEAN DEFAULT true,
  communication BOOLEAN DEFAULT true,
  reasonable_expectations BOOLEAN DEFAULT true,
  seller_response TEXT,
  seller_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seller_id, buyer_id, order_id)
);

COMMENT ON TABLE public.buyer_feedback IS 'Feedback from sellers about buyers';

-- =====================================================
-- 7. SELLER STATS (Cached/Aggregated for performance)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.seller_stats (
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE PRIMARY KEY,
  total_listings INTEGER DEFAULT 0,
  active_listings INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  five_star_reviews INTEGER DEFAULT 0,
  positive_feedback_pct DECIMAL(5, 2) DEFAULT 0,
  item_described_pct DECIMAL(5, 2) DEFAULT 100,
  shipping_speed_pct DECIMAL(5, 2) DEFAULT 100,
  communication_pct DECIMAL(5, 2) DEFAULT 100,
  follower_count INTEGER DEFAULT 0,
  response_time_hours DECIMAL(5, 2),
  response_rate_pct DECIMAL(5, 2) DEFAULT 100,
  shipped_on_time_pct DECIMAL(5, 2) DEFAULT 100,
  repeat_customer_pct DECIMAL(5, 2) DEFAULT 0,
  first_sale_at TIMESTAMPTZ,
  last_sale_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.seller_stats IS 'Cached seller statistics for badge evaluation and display';

-- =====================================================
-- 8. BUYER STATS (Cached/Aggregated)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.buyer_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  reviews_written INTEGER DEFAULT 0,
  stores_following INTEGER DEFAULT 0,
  wishlist_count INTEGER DEFAULT 0,
  conversations_started INTEGER DEFAULT 0,
  disputes_opened INTEGER DEFAULT 0,
  disputes_won INTEGER DEFAULT 0,
  first_purchase_at TIMESTAMPTZ,
  last_purchase_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.buyer_stats IS 'Cached buyer statistics for badge evaluation';

-- =====================================================
-- 9. ENHANCED REVIEWS (Add missing columns if needed)
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'images') THEN
    ALTER TABLE public.reviews ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'verified_purchase') THEN
    ALTER TABLE public.reviews ADD COLUMN verified_purchase BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'seller_response') THEN
    ALTER TABLE public.reviews ADD COLUMN seller_response TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'seller_response_at') THEN
    ALTER TABLE public.reviews ADD COLUMN seller_response_at TIMESTAMPTZ;
  END IF;
END $$;

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_badge_definitions_category ON public.badge_definitions(category);
CREATE INDEX IF NOT EXISTS idx_badge_definitions_account_type ON public.badge_definitions(account_type);
CREATE INDEX IF NOT EXISTS idx_badge_definitions_active ON public.badge_definitions(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_awarded ON public.user_badges(awarded_at);
CREATE INDEX IF NOT EXISTS idx_user_badges_active ON public.user_badges(user_id, badge_id) WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_verification_user ON public.user_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verification_trust ON public.user_verification(trust_score);

CREATE INDEX IF NOT EXISTS idx_business_verification_seller ON public.business_verification(seller_id);
CREATE INDEX IF NOT EXISTS idx_business_verification_vat ON public.business_verification(vat_number);

CREATE INDEX IF NOT EXISTS idx_buyer_feedback_buyer ON public.buyer_feedback(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_seller ON public.buyer_feedback(seller_id);
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_rating ON public.buyer_feedback(rating);

CREATE INDEX IF NOT EXISTS idx_seller_stats_rating ON public.seller_stats(average_rating);
CREATE INDEX IF NOT EXISTS idx_seller_stats_sales ON public.seller_stats(total_sales);

CREATE INDEX IF NOT EXISTS idx_buyer_stats_rating ON public.buyer_stats(average_rating);
CREATE INDEX IF NOT EXISTS idx_buyer_stats_orders ON public.buyer_stats(total_orders);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_stats ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Badge definitions - public read for active badges
DROP POLICY IF EXISTS "badge_definitions_select_all" ON public.badge_definitions;
CREATE POLICY "badge_definitions_select_all" ON public.badge_definitions
  FOR SELECT USING (is_active = true);

-- User badges - public read for non-revoked badges
DROP POLICY IF EXISTS "user_badges_select_all" ON public.user_badges;
CREATE POLICY "user_badges_select_all" ON public.user_badges
  FOR SELECT USING (revoked_at IS NULL);

-- User badges - allow insert for system
DROP POLICY IF EXISTS "user_badges_insert_system" ON public.user_badges;
CREATE POLICY "user_badges_insert_system" ON public.user_badges
  FOR INSERT WITH CHECK (true);

-- User verification - owner can view their own
DROP POLICY IF EXISTS "user_verification_select_own" ON public.user_verification;
CREATE POLICY "user_verification_select_own" ON public.user_verification
  FOR SELECT USING (auth.uid() = user_id);

-- User verification - allow all operations (service role)
DROP POLICY IF EXISTS "user_verification_all" ON public.user_verification;
CREATE POLICY "user_verification_all" ON public.user_verification
  FOR ALL USING (true);

-- Business verification - owner and admin can view
DROP POLICY IF EXISTS "business_verification_select" ON public.business_verification;
CREATE POLICY "business_verification_select" ON public.business_verification
  FOR SELECT USING (
    seller_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Business verification - allow all operations
DROP POLICY IF EXISTS "business_verification_all" ON public.business_verification;
CREATE POLICY "business_verification_all" ON public.business_verification
  FOR ALL USING (true);

-- Buyer feedback - public read
DROP POLICY IF EXISTS "buyer_feedback_select_all" ON public.buyer_feedback;
CREATE POLICY "buyer_feedback_select_all" ON public.buyer_feedback
  FOR SELECT USING (true);

-- Buyer feedback - seller can insert
DROP POLICY IF EXISTS "buyer_feedback_insert_seller" ON public.buyer_feedback;
CREATE POLICY "buyer_feedback_insert_seller" ON public.buyer_feedback
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM sellers WHERE id = seller_id AND id = auth.uid())
  );

-- Buyer feedback - seller can update their own
DROP POLICY IF EXISTS "buyer_feedback_update_seller" ON public.buyer_feedback;
CREATE POLICY "buyer_feedback_update_seller" ON public.buyer_feedback
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM sellers WHERE id = seller_id AND id = auth.uid())
  );

-- Stats tables - public read
DROP POLICY IF EXISTS "seller_stats_select_all" ON public.seller_stats;
CREATE POLICY "seller_stats_select_all" ON public.seller_stats
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "buyer_stats_select_all" ON public.buyer_stats;
CREATE POLICY "buyer_stats_select_all" ON public.buyer_stats
  FOR SELECT USING (true);

-- Stats - allow all operations (for triggers/functions)
DROP POLICY IF EXISTS "seller_stats_all" ON public.seller_stats;
CREATE POLICY "seller_stats_all" ON public.seller_stats
  FOR ALL USING (true);

DROP POLICY IF EXISTS "buyer_stats_all" ON public.buyer_stats;
CREATE POLICY "buyer_stats_all" ON public.buyer_stats
  FOR ALL USING (true);;
