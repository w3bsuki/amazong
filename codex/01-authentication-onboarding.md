# Authentication And Onboarding Audit

## Scope

- `app/[locale]/(auth)`
- `app/[locale]/(onboarding)`
- `app/auth/confirm/route.ts`
- `components/providers/auth-state-manager.tsx`
- `lib/supabase/middleware.ts`
- `app/actions/onboarding.ts`

## Current State Summary

- Auth and onboarding behavior is split across multiple entry points.
- Onboarding appears to have dual surfaces (`welcome` and dedicated onboarding flow).
- Session management client code has grown complex in `auth-state-manager`.

## Findings

## P0

- Duplicated onboarding completion flow across:
  - `app/[locale]/(auth)/_components/welcome-client.tsx`
  - `app/[locale]/(onboarding)/*`
  - `app/[locale]/api/onboarding/complete/route.ts`
  - `app/actions/onboarding.ts`
- Risk: logic drift and inconsistent completion behavior.

## P1

- `components/providers/auth-state-manager.tsx` has high orchestration complexity (throttling + refresh scheduling + navigation coupling).
- `app/auth/confirm/route.ts` repeats profile/onboarding redirect logic across code paths.
- `lib/supabase/middleware.ts` auth check coverage and onboarding routing are not unified under one clear contract.

## P2

- `app/actions/onboarding.ts` has no call-site evidence in `app/components/lib/hooks` search; likely dead or stale abstraction.

## Simplification Targets

1. Keep one onboarding completion backend path as the only source of truth.
2. Reduce `AuthStateManager` to essential session lifecycle behavior.
3. Extract shared confirm-route redirect logic into a single helper.
4. Clarify middleware-vs-server gating for onboarding routes in documentation and code comments.

## Candidate Refactor Moves (No Behavior Change)

- Consolidate onboarding write/update logic into one server module used by route/action callers.
- Move avatar generation and username normalization helpers into shared utility modules.
- Replace duplicated flow-specific branches with a single onboarding outcome resolver.

## High-Risk Pause Areas

- Any change in `lib/supabase/middleware.ts` auth gating.
- Any auth/session state behavior in `components/providers/auth-state-manager.tsx`.
- Any route redirect logic affecting email confirmation and first-login onboarding.

## Success Criteria

- One onboarding completion path.
- No duplicated redirect logic in confirm flow.
- Smaller `auth-state-manager` with equivalent auth UX behavior.
- All auth E2E tests pass with no regression in redirect/session behavior.
