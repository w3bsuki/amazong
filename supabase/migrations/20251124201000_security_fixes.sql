-- Security fix: Move pg_trgm extension to extensions schema
-- This addresses the Supabase security advisor warning

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_trgm extension to extensions schema
ALTER EXTENSION pg_trgm SET SCHEMA extensions;

-- Grant usage on extensions schema to authenticated users (if needed)
GRANT USAGE ON SCHEMA extensions TO authenticated;

-- Note: Leaked password protection must be enabled manually in Supabase Dashboard
-- Dashboard > Authentication > Settings > Password Protection
-- Enable "Prevent sign ups with leaked passwords"
