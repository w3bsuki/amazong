# Codex — AI Agent Surfaces (where it lives, what it does)

## Guiding rule
AI should **reduce steps**, not add UI chrome.

## Existing anchor
There is already an assistant route:
- `app/[locale]/(main)/assistant/page.tsx`

We expand from this rather than inventing a second AI surface.

## Phase 1 (production) — 3 AI surfaces
1) **AI Search (primary)**
   - Natural language queries: “winter boots size 38 under 120 in Sofia”
   - Produces structured filters + results
   - Always show “what the AI did” (chips / filter summary)

2) **AI Listing assistant (Sell flow)**
   - From photos/title: suggest category, condition, price range, tags
   - Generates description that user can edit
   - Never auto-publishes; user confirms

3) **AI Help / support**
   - Search help center, policies, and onboarding guidance
   - Deflect support load without hiding real contact options

## Phase 2 (post-production)
- Business dashboard: AI copilot for bulk ops and import mapping.
- Buyer experience: “find me X” guided search flows.

## UX requirements (trust + control)
- AI outputs must be editable.
- Deterministic controls remain accessible (filters/sort).
- No “mystery state”: show applied filters and allow one-tap reset.

