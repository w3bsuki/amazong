# Frontend ↔ Backend Alignment — Target Rules

## One source of truth per domain
- DB schema + RLS: `supabase/migrations/*`
- Server-side queries: `lib/supabase/queries/*` and `lib/data/*`
- UI state derived from DB: “account status” (type/plan/badges) computed once

## Avoid drift
- Don’t duplicate `.select()` projection strings across routes/components.
- Don’t duplicate plan logic across API routes and pages; centralize.
- Treat server actions as the boundary; client components receive data + callbacks.

