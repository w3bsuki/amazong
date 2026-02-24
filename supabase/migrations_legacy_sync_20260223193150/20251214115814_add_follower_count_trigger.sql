-- Function to update follower count when someone follows/unfollows
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE seller_stats 
    SET follower_count = COALESCE(follower_count, 0) + 1,
        updated_at = now()
    WHERE seller_id = NEW.seller_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE seller_stats 
    SET follower_count = GREATEST(0, COALESCE(follower_count, 0) - 1),
        updated_at = now()
    WHERE seller_id = OLD.seller_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update follower count
CREATE TRIGGER on_store_follower_change
  AFTER INSERT OR DELETE ON store_followers
  FOR EACH ROW
  EXECUTE FUNCTION update_follower_count();;
