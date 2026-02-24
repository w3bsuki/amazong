-- Restrict authenticated users to updating only safe `public.profiles` columns.
--
-- RLS alone is insufficient here because many app-level gates rely on profile
-- fields (role/tier/verification). If authenticated can UPDATE the whole row,
-- they can self-grant entitlements.

-- Remove broad UPDATE grant…
REVOKE UPDATE ON TABLE public.profiles FROM authenticated;

-- …and re-grant UPDATE only on user-editable columns.
GRANT UPDATE (
  full_name,
  avatar_url,
  shipping_region,
  country_code,
  username,
  display_name,
  bio,
  banner_url,
  location,
  website_url,
  social_links,
  business_name,
  last_username_change,
  onboarding_completed,
  default_city,
  updated_at
)
ON TABLE public.profiles
TO authenticated;
;
