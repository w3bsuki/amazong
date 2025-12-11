-- Store followers table for following stores/sellers
-- Similar to social media follow system

CREATE TABLE IF NOT EXISTS store_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Ensure unique follow relationship
  CONSTRAINT unique_follow UNIQUE (follower_id, seller_id),
  
  -- Prevent self-following
  CONSTRAINT no_self_follow CHECK (follower_id != seller_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_store_followers_follower ON store_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_store_followers_seller ON store_followers(seller_id);
CREATE INDEX IF NOT EXISTS idx_store_followers_created ON store_followers(created_at DESC);

-- Enable RLS
ALTER TABLE store_followers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view follower counts (for public store profiles)
CREATE POLICY "Anyone can view followers"
  ON store_followers FOR SELECT
  USING (true);

-- Users can follow/unfollow stores
CREATE POLICY "Users can follow stores"
  ON store_followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow stores"
  ON store_followers FOR DELETE
  USING (auth.uid() = follower_id);

-- Add comment for documentation
COMMENT ON TABLE store_followers IS 'Tracks users following stores/sellers for updates and notifications';
COMMENT ON COLUMN store_followers.follower_id IS 'The user who is following';
COMMENT ON COLUMN store_followers.seller_id IS 'The seller/store being followed';
