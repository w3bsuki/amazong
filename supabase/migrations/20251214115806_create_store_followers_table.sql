-- Create store_followers table for tracking who follows which sellers
CREATE TABLE store_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT store_followers_unique UNIQUE (follower_id, seller_id)
);

-- Create indexes for fast lookups
CREATE INDEX idx_store_followers_follower ON store_followers(follower_id);
CREATE INDEX idx_store_followers_seller ON store_followers(seller_id);

-- Enable RLS
ALTER TABLE store_followers ENABLE ROW LEVEL SECURITY;

-- Users can see their own follows
CREATE POLICY "Users can view their own follows"
  ON store_followers FOR SELECT
  USING (auth.uid() = follower_id);

-- Anyone can see follower counts (for seller profiles)
CREATE POLICY "Anyone can view follows for seller stats"
  ON store_followers FOR SELECT
  USING (true);

-- Users can follow sellers
CREATE POLICY "Users can follow sellers"
  ON store_followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id AND auth.uid() != seller_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow"
  ON store_followers FOR DELETE
  USING (auth.uid() = follower_id);

-- Add comment
COMMENT ON TABLE store_followers IS 'Tracks which users follow which sellers';;
