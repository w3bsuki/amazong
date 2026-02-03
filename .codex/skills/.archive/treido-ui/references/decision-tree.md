# treido-ui - Decision Tree (full)

This is the full decision tree for Treido UI execution.

---

## Step 0 - Scope control

If the request is:
- "make it nicer" without scope -> pick 1-2 screens/components and ask orchestrator to confirm scope in TASKS (do not expand forever).

If the request implies new feature scope:
- escalate to orchestrator (PRD/FEATURES update needed).

Keep every batch 1-3 files.

---

## Step 1 - Component placement

- Primitive -> `components/ui/*`
- Reusable composite -> `components/shared/*`
- Route-private -> `app/[locale]/(group)/**/_components/*`

If a change would put app logic into `components/ui/*`:
- Create a wrapper component in `components/shared/*` or route-private `_components`.

---

## Step 2 - Styling rails (Tailwind v4)

Forbidden:
- gradients
- palette utilities
- arbitrary values
- hardcoded colors in TS/TSX
- opacity hacks on base tokens

Required:
- semantic tokens from `app/globals.css`

If the only way to achieve the design is a new token:
- escalate with options and a recommended default.

---

## Step 3 - Navigation + overlays (app-feel default)

- Prefer **URL-as-state** overlays (parallel routes + intercepting routes) over `useState`-only modals.
- Mobile default: `Sheet` (bottom). Desktop default: `Dialog`.
- Golden path reference: `docs/14-UI-UX-PLAN.md` + `app/[locale]/(main)/search/@modal/*`.

---

## Step 4 - Interaction and a11y basics

- Focus states must remain visible (shadcn defaults are fine).
- Labels must be associated with inputs.
- Touch targets should be at least 44px for primary actions (use button sizes).

Avoid introducing new animations (Treido rail).

---

## Step 5 - Verify

After every batch:
- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`

Run e2e smoke when routing/auth/checkout is involved:
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

