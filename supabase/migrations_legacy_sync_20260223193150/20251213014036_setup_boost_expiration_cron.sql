-- Enable pg_cron extension (must run as superuser on Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule the expire_listing_boosts function to run every hour
SELECT cron.schedule(
  'expire-listing-boosts',
  '0 * * * *', -- Every hour at minute 0
  $$SELECT expire_listing_boosts()$$
);;
