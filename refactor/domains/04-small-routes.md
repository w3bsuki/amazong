# Domain 4 — (admin) + (chat) + (checkout) + (onboarding) + (auth) + (plans) + [username]

> **Small route groups combined for efficiency.**
> **(admin) 39f/3.4K · (chat) 11f/1.8K · (checkout) 15f/2.1K · (onboarding) 21f/1.2K · (auth) 24f/1.4K · (plans) 6f/1K · [username] 43f/5.7K**
> **Combined: 159 files · 16,614 LOC**
> **Read `refactor/shared-rules.md` first.**

---

## Scope

Seven smaller route groups. Audit each, refactor where gains are material.

## (admin) — 39 files · 3,389 LOC

Sessions 17-18 decomposed notes/tasks/docs. Check remaining:
- Are the extracted sub-components (from sessions 17-18) properly sized? Not over-fragmented?
- `admin-recent-activity.tsx`, other dashboard files — any further consolidation?
- Dead code in admin after decomposition extractions?

## [username] — 43 files · 5,720 LOC

Second-largest here. Public seller profiles.
- `profile-client.tsx` (581L) — oversized, needs split
- 43 files for a profile page seems high — how many are tiny fragments?
- Dead code scan for _components/ exports
- "use client" audit

## (chat) — 11 files · 1,836 LOC

- `chat-interface.tsx` (760L) — massive, needs split
- 11 files total — probably OK file count, just need to break up the big one
- Real-time Supabase subscriptions here — don't break reactivity

## (checkout) — 15 files · 2,145 LOC

- `checkout-page-client.tsx` (660L) — oversized
- `_actions/checkout.ts` (444L) — oversized, uses raw `getUser()`
- Split the page client into hook + sub-components
- Split the action into session/verify/fees
- ⚠️ Don't touch Stripe payment flow logic — split structurally only

## (onboarding) — 21 files · 1,157 LOC

- 21 files for 1.2K LOC = average 55L per file — over-fragmented
- Can onboarding steps be consolidated? 5 separate pages for wizard steps?
- "use client" audit — wizard steps might not all need it

## (auth) — 24 files · 1,374 LOC

- 24 files for 1.4K LOC = average 57L per file — over-fragmented
- `sign-up-form-body.tsx` (413L in components/auth/) — oversized
- How many tiny auth helper files can merge?
- ⚠️ Don't touch auth flow logic — structural refactor only

## (plans) — 6 files · 1,028 LOC

- `plans-page-client.tsx` (658L) — oversized for a plans page
- 6 files is fine count-wise, just need to break up the big one

## Audit Checklist (for each sub-domain)

1. List every file with LOC and purpose
2. Flag dead code (grep for zero usage)
3. Flag tiny files (<50L) for merge
4. Flag oversized files (>300L) for split
5. Flag unnecessary "use client"
6. Execute changes

## DON'T TOUCH
- Auth session/cookie logic
- Stripe checkout session creation internals
- Chat real-time subscription setup logic
- Webhook handlers

## Verification
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```
