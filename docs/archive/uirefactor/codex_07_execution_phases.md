# Codex — Phased Execution Plan (to avoid thrash)

## Phase 0 — Freeze the patterns (1–2 days)
Lock decisions from `codex_02_pattern_decisions.md`:
- Bottom nav destinations
- Search surface ownership (sheet)
- Home feed structure (seller-led modules + grid fallback)
- Onboarding steps and required fields

Acceptance:
- Team agrees on nav + onboarding state machine (no more bikeshedding mid-impl).

## Phase 1 — Onboarding: move account type out of sign-up (high impact)
Scope:
- Remove account type selection from sign-up form
- Extend onboarding to start with account type selection
- Ensure first login always triggers onboarding

Acceptance:
- New users: first login → onboarding (account type step is first)
- Existing users: no regression; onboarding only when needed
- Data persistence: `account_type` is stored, and onboarding rules don’t depend on `username` being pre-set

Risk:
- Touches auth/onboarding routing logic; treat as “auth flow change” (needs careful verify).

## Phase 2 — Search tab upgrade (rename + AI-first sheet)
Scope:
- Rename Categories/Обяви → Search (copy/i18n)
- Put AI search at the top of the sheet
- Keep categories inside the same sheet (no lost functionality)

Acceptance:
- “Search” is clearly the place to find anything
- One tap from anywhere (tab + search bar)
- Parity: categories are still accessible (Search sheet includes the existing circles grid)

## Phase 3 — Home feed redesign (seller-led modules)
Scope:
- Replace most category carousels with seller cards
- Add feed/grid toggle

Acceptance:
- Home feels social and alive, not a static catalog
- Users can still reach classic grid quickly

## Phase 4 — Business dashboard v1 (export + identity)
Scope:
- Business settings fields in profile (as needed)
- Export listings to CSV from dashboard

Acceptance:
- Business user can export their products (no PII leak)

## Phase 5 — Polish + parity
Scope:
- A11y pass (labels, focus states, touch targets)
- Performance pass (avoid layout shift)
- Desktop parity layouts

Acceptance:
- Gates stay green (`pnpm -s typecheck`, `pnpm -s lint`, `pnpm -s styles:gate`)
