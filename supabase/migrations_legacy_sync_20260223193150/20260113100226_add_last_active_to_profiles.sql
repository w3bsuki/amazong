-- Add last_active column to profiles for "Last active" indicator
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT now();

-- Add index for sorting/filtering by last active
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active DESC);

-- Comment for documentation
COMMENT ON COLUMN public.profiles.last_active IS 'Timestamp of user last activity (login, message, listing, etc). Used for "Last active X ago" display.';;
