# treido-frontend - Decision Tree (full)

This is the full decision tree for the frontend execution lane.

---

## Step 0 - Mode selection

- If the request includes `AUDIT:` -> run AUDIT mode (read-only).
- If the request includes `IMPL:` -> run IMPL mode (patch code).
- If unclear -> default:
  - "audit/review/scan" language -> AUDIT
  - otherwise -> IMPL

---

## Step 1 - CHECK FIRST (mandatory)

Before creating new files/patterns:
1) `ls` / `cat` the likely location
2) `rg -n` to find existing patterns
3) Prefer editing existing files over adding new ones

Escalate to orchestrator if the plan would touch >3 files for a single task.

---

## Step 2 - Boundary decisions

### Server vs client
- Default to Server Components.
- Add `'use client'` only when hooks/event handlers/browser APIs are required.
- Keep client components "dumb": serializable props only; no server-only imports.

### Component placement
- Primitive -> `components/ui/*`
- Composite -> `components/shared/*`
- Route-private -> `app/[locale]/(group)/**/_components/*`

---

## Step 3 - Rails enforcement

### Tailwind v4
- No palette colors, gradients, arbitrary values, or hardcoded colors.
- Use semantic tokens from `app/globals.css`.
- Run `pnpm -s styles:gate` before claiming "done".

### i18n (next-intl)
- User strings must go through translations.
- Update both `messages/en.json` and `messages/bg.json`.

---

## Step 4 - Escalations

Escalate/pause (human approval needed) if the change touches:
- DB schema/migrations/RLS/policies
- Auth/access control
- Payments/Stripe/billing

Escalate to specialists if needed:
- Token rails ambiguity -> `spec-tailwind`
- Primitive boundary ambiguity -> `spec-shadcn`
- RSC/caching ambiguity -> `spec-nextjs`

---

## Step 5 - Verify

After each IMPL batch:
- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`

Run e2e smoke only when the change touches routing/auth/checkout/webhooks:
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

