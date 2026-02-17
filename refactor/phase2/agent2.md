# Phase 2 — Agent 2: Client Boundary Audit (app/)

> **Scope:** Remove unnecessary `"use client"` from `app/`
> **Read `refactor/shared-rules.md` first.**

---

## The Rule

Same as Agent 1 — a component NEEDS `"use client"` ONLY if it directly uses hooks, event handlers, browser APIs, or `useTranslations()`. See `refactor/phase2/agent1.md` §The Rule for the full list.

## How to Work

**For each file in `app/` that has `"use client"`:**

1. Read the entire file.
2. Does it directly use client-only APIs? (hooks, event handlers, browser APIs, useTranslations)
3. **If NO** → remove `"use client"`. Typecheck immediately.
4. **If YES but splittable** → split into server wrapper + client island.
5. **If YES and can't split** → keep it. Move on.

**Pay special attention to route-level files:**
- `page.tsx` should almost always be a Server Component. If a page has `"use client"`, it's usually wrong — the page should be server, delegating to client `_components/`.
- `layout.tsx` should always be a Server Component. If one has `"use client"`, fix it.
- `loading.tsx`, `error.tsx`, `not-found.tsx` are server by default. `error.tsx` requires `"use client"` (Next.js convention) — don't remove it from error files.

## Priority Order

Highest-traffic routes first:

1. `app/[locale]/(main)/` — homepage, search, categories (most traffic)
2. `app/[locale]/[username]/` — profiles + PDP (product pages)
3. `app/[locale]/(sell)/` — sell flow (many form client components)
4. `app/[locale]/(account)/` — account pages
5. `app/[locale]/_components/` — locale-level shared
6. `app/[locale]/(checkout)/` — ⚠️ payment-adjacent, be careful
7. `app/actions/` — server actions should NEVER have `"use client"`. If any do, that's a bug.
8. Everything else: `(auth)`, `(business)`, `(chat)`, `(admin)`, `(plans)`, `(onboarding)`

## Special Notes

- **DON'T TOUCH** `app/api/` route handlers — they don't use `"use client"`.
- **DON'T TOUCH** payment/auth business logic — only remove unnecessary directives, don't restructure.
- `error.tsx` files MUST have `"use client"` — this is a Next.js requirement. Don't remove it.
- Server actions in `app/actions/` and `_actions/` dirs should never have `"use client"`. If they do, remove it — that's a bug.
- `app/[locale]/_providers/` components are React contexts — they need `"use client"`.

## Verification

After each file: `pnpm -s typecheck`
After each route group: `pnpm -s typecheck && pnpm -s lint`
After full scope: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

## Output

- `"use client"` directives removed (count + file list)
- Files split into server/client islands (list)
- Page/layout files converted from client → server (list — these are high-impact)
- Any issues flagged
