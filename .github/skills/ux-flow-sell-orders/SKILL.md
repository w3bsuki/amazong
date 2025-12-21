---
name: ux-flow-sell-orders
description: Design UX flows for the marketplace sell and order-management experiences in this repo (steps, states, edge cases, information architecture). Use when asked to improve the /sell form, order management dashboards, status flows, or reduce friction/confusion.
---

# UX Flow (Sell + Orders)

This skill is for **UX flow design** (not implementation-first). It produces a clear, testable plan for flows like:

- Listing creation and editing (`/sell`, `/account/selling/...`)
- Seller order management (`/sell/orders`, dashboards)
- Buyer order tracking (`/account/orders/...`)
- Messaging / disputes / returns touchpoints (where they intersect orders)

It pairs well with `frontend-ui-shadcn-tailwind` (build the UI) and `backend-architect` (rules/data/state).

## Non-negotiables for this repo

- **No new frontend skill collisions**: this skill is for *flow definition + IA + state mapping*. UI implementation lives in `frontend-ui-shadcn-tailwind`.
- Respect routing/layout boundaries in `STRUCTURE.md` and the App Router grouping under `app/[locale]/(...)`.
- Keep outputs **actionable**: the goal is a plan that can be implemented route-by-route with minimal ambiguity.

## Workflow (what to produce)

1. **Scope the job-to-be-done**
   - Who is the user (buyer/seller/admin)?
   - What is the primary goal and the “success moment”?

2. **Map the happy path (steps + screens)**
   - Write a numbered list of steps.
   - For each step, specify:
     - Inputs (fields/actions)
     - Outputs (saved state, navigation)
     - Validation rules (what blocks progression)

3. **Define required states**
   - Loading, saving, success, empty, error, offline, retry.
   - Draft vs published vs archived.

4. **Edge cases & friction audit**
   - List the top 5 drop-off reasons.
   - Add the “fix”: clearer copy, progressive disclosure, defaults, inline previews, better confirmation.

5. **Information architecture + components**
   - Identify reusable sections/components.
   - Prefer existing patterns and primitives (shadcn/ui) when later implemented.

6. **Acceptance criteria + analytics hooks**
   - Define “done” checks (what must be true).
   - Suggest a few measurable events (e.g., draft_save_success, listing_publish_success, order_status_changed).

## Templates

### Flow spec template

- **Flow name**:
- **Primary user**:
- **Primary goal**:
- **Entry points**:
- **Success criteria**:

**Steps**
1. …
2. …

**States**
- Loading:
- Error:
- Empty:
- Success:

**Rules**
- …

**Edge cases**
- …

**Acceptance criteria**
- …

## Sell flow heuristics (marketplace-optimized)

- Prefer **draft-first**: a draft listing that can be returned to later.
- Use **progressive disclosure**: show the minimum fields needed to proceed, then expand.
- Add **preview early**: show how the listing will look (title, price, cover image) while editing.
- Inline validation beats page-level errors.
- Autosave with explicit “Saved” status reduces anxiety.

## Order management heuristics

- Default view answers: **What needs attention today?**
- Provide quick filters: New, Pending shipment, Shipped, Delivered, Returns, Disputes.
- Bulk actions where safe (print labels, mark shipped) + auditability.
- Always show “next best action” and who is waiting.

## Examples (prompts that should trigger this skill)

- “The `/sell` form is confusing; redesign the flow and reduce friction.”
- “Design an order management UX for sellers: statuses, filters, and actions.”
- “Map buyer order tracking screens and error/empty states.”
- “Propose a step-by-step listing creation experience with drafts and autosave.”
