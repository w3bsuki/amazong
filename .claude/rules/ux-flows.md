---
paths: app/**/sell/**/*.{ts,tsx}, app/**/account/**/*.{ts,tsx}, app/**/orders/**/*.{ts,tsx}, components/seller/**/*.{ts,tsx}, components/orders/**/*.{ts,tsx}
---

# UX Flow (Sell + Orders)

This rule is for **UX flow design** (not implementation-first). Produces clear, testable plans for:

- Listing creation/editing (`/sell`, `/account/selling/...`)
- Seller order management (`/sell/orders`, dashboards)
- Buyer order tracking (`/account/orders/...`)
- Messaging / disputes / returns touchpoints

Pairs with `frontend-ui.md` (build the UI) and `backend-architect.md` (data/state).

## Non-negotiables

- This rule is for *flow definition + IA + state mapping* — UI implementation is `frontend-ui.md`
- Respect routing/layout boundaries in App Router grouping under `app/[locale]/(...)`
- Keep outputs **actionable**: plan that can be implemented route-by-route

## Workflow (What to Produce)

1. **Scope the job-to-be-done**
   - User (buyer/seller/admin)?
   - Primary goal and "success moment"?

2. **Map the happy path (steps + screens)**
   - Numbered list of steps
   - Each step: inputs, outputs (state/navigation), validation rules

3. **Define required states**
   - Loading, saving, success, empty, error, offline, retry
   - Draft vs published vs archived

4. **Edge cases & friction audit**
   - Top 5 drop-off reasons
   - Fixes: clearer copy, progressive disclosure, defaults, inline previews

5. **Information architecture + components**
   - Reusable sections/components
   - Prefer existing shadcn/ui patterns

6. **Acceptance criteria + analytics hooks**
   - "Done" checks
   - Measurable events (e.g., `draft_save_success`, `listing_publish_success`)

## Sell Flow Heuristics

- **Draft-first**: drafts that can be returned to later
- **Progressive disclosure**: minimum fields to proceed, then expand
- **Preview early**: show how listing will look while editing
- **Inline validation** beats page-level errors
- **Autosave** with explicit "Saved" status

## Order Management Heuristics

- Default view answers: **What needs attention today?**
- Quick filters: New, Pending shipment, Shipped, Delivered, Returns, Disputes
- Bulk actions where safe + auditability
- Always show "next best action" and who is waiting

## Trigger Prompts

- "The /sell form is confusing; redesign the flow"
- "Design order management UX for sellers"
- "Map buyer order tracking screens and error states"
- "Step-by-step listing creation with drafts and autosave"
