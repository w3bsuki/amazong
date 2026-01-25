-- Prevent privilege escalation via self-updating `public.profiles`.
--
-- Authenticated users may update their own profile row, but must NOT be able to
-- self-grant admin/seller/entitlement flags by writing sensitive columns.
--
-- NOTE: Server-side actions that legitimately mutate these fields should use
-- the service-role (admin) client and perform their own auth checks.

REVOKE UPDATE (role, is_seller, verified, tier, is_verified_business, account_type)
  ON TABLE public.profiles
  FROM authenticated;

