# New User Onboarding

> Product spec for the new user onboarding flow.

| Feature IDs | R3.1, R3.2 |
|-------------|------------|
| Status | Implemented |

---

## Overview

When a user signs up, `onboarding_completed` is set to `false` on their profile.
They are redirected to `/onboarding` where they complete:

1. **Welcome step** — greeting + value prop
2. **Profile setup** — display name, avatar, optional bio
3. **Interests** — select categories they care about (used for personalized feed)
4. **Completion** — `onboarding_completed` → `true`, redirect to home

## Key Rules

- Onboarding is skippable but the redirect persists until completed
- Middleware checks `onboarding_completed` on protected routes
- Profile fields are pre-filled if available from OAuth
- Mobile: full-screen stepper, no header/footer

## Files

- `app/[locale]/(main)/onboarding/` — route
- `components/shared/onboarding/` — step components
- `app/actions/onboarding.ts` — server actions

---

*Last updated: 2026-02-12*
