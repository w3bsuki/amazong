# app/actions/ — Server Actions Rules

These rules apply to everything under `app/actions/`.

## Non‑negotiables

- Server actions are **server-only**. Do not add `"use client"` here.
- Never log secrets/PII.
- All user-facing errors/messages must go through `next-intl` (no hardcoded copy).

## Supabase + auth

- Use the correct Supabase server client pattern for RLS-protected access.
- Do not use service-role/admin patterns unless explicitly approved (high-risk).

## Caching + invalidation

- If you mutate data that is also served from cached reads, you must invalidate the correct cache tags (`revalidateTag(...)`) as part of the mutation flow.
- Do not call `cookies()`/`headers()` inside cached functions (`'use cache'`).

## See SSOT

- `docs/06-DATABASE.md`
- `docs/07-API.md`
- `docs/09-AUTH.md`

