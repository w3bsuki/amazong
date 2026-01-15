# Task: Fix Chat Mobile Scroll + Avatars

## Why this matters

Chat is a core marketplace retention loop. If chat scroll breaks or avatars are missing, trust drops fast.

## Likely root causes to verify

1) **Avatars bucket/policies missing in production Supabase**
   - Ensure `avatars` bucket exists and policies match per-user folder rules.
   - Apply: `supabase/migrations/20260110153300_ensure_avatars_bucket_and_policies.sql` if missing.

2) **Mobile scroll containment**
   - Repro on iOS Safari and a small Android viewport.
   - Inspect `app/[locale]/(chat)/_components/chat-interface.tsx` and related layout containers for:
     - nested scroll areas
     - missing `min-h-0` / `overflow-hidden` on flex parents
     - safe-area padding issues

## Execution steps

1) Reproduce:
   - Open `/en/chat` on mobile viewport (390×844).
   - Scroll conversation list and message thread; send messages; ensure scroll stays in the intended container.
2) Fix avatars:
   - Confirm profile `avatar_url` values are valid public URLs.
   - Confirm storage bucket exists and objects are readable.
3) Add verification:
   - Run: `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - Run: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
   - Optionally run: `pnpm test:e2e e2e/mobile-responsiveness.spec.ts`

## Done when

- Chat scroll is stable on mobile (no “page scroll fights”).
- Avatars display reliably in chat and profile surfaces.

