# lib/supabase/ — Supabase Client + RLS Rules

These rules apply to everything under `lib/supabase/`.

## Non‑negotiables

- Assume RLS is always on; design queries/actions accordingly.
- Never expose service-role/admin credentials to the client.
- Avoid `select('*')` in hot paths; project fields.

## Cached server reads

- Cached reads (`'use cache'`) must not touch `cookies()`/`headers()`.
- Use the correct “static”/cookie-less Supabase client for cached, public reads.

## See SSOT

- `docs/06-DATABASE.md`
- `docs/09-AUTH.md`

