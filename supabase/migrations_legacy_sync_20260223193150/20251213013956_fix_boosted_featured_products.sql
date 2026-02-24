-- Step 1: Reset ALL products to not boosted/featured (clean slate)
UPDATE products 
SET 
  is_boosted = false,
  is_featured = false,
  listing_type = 'normal',
  boost_expires_at = null
WHERE is_boosted = true OR is_featured = true;

-- Step 2: Re-enable boosts ONLY for products with ACTIVE paid boosts
UPDATE products p
SET 
  is_boosted = true,
  listing_type = 'boosted',
  boost_expires_at = lb.expires_at
FROM listing_boosts lb
WHERE lb.product_id = p.id 
  AND lb.is_active = true 
  AND lb.expires_at > NOW();

-- Step 3: Create a function to auto-expire boosts (runs on a schedule)
CREATE OR REPLACE FUNCTION expire_listing_boosts()
RETURNS void AS $$
BEGIN
  -- Deactivate expired boosts
  UPDATE listing_boosts
  SET is_active = false
  WHERE is_active = true AND expires_at < NOW();
  
  -- Reset product flags for expired boosts
  UPDATE products p
  SET 
    is_boosted = false,
    listing_type = 'normal',
    boost_expires_at = null
  WHERE is_boosted = true 
    AND boost_expires_at IS NOT NULL 
    AND boost_expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create a trigger to auto-set product boost when a boost is purchased
CREATE OR REPLACE FUNCTION on_listing_boost_created()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new boost is created, mark the product as boosted
  UPDATE products
  SET 
    is_boosted = true,
    listing_type = 'boosted',
    boost_expires_at = NEW.expires_at
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_listing_boost_insert ON listing_boosts;
CREATE TRIGGER on_listing_boost_insert
  AFTER INSERT ON listing_boosts
  FOR EACH ROW
  EXECUTE FUNCTION on_listing_boost_created();;
