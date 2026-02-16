# CODEX MISSION — Production Codebase Cleanup (ROUND 3)

> Two previous sessions ran cleanup. Renames and obvious dead files are done.
> But most folders were NEVER deeply audited. You need to finish the job.
>
> **DO NOT CREATE NEW FILES, FEATURES, ROUTES, OR COMPONENTS.**
> This is DELETION and CLEANUP only. If you find yourself writing new code, stop.
>
> Another terminal is actively developing new features — don't touch new untracked files.
> Only audit and clean files that are already committed/tracked in git.

---

## What's Already Done (Skip These)

- ✅ Version suffix renames (`-v4`, `-v3`, `-v2` all gone)
- ✅ Demo route renames (`v2→feed`, `v3→category-rails`, `v4→discovery`)
- ✅ `cleanup/`, `production-audit/`, `docs-revamp/` removed
- ✅ Dead scripts removed (6 scripts)
- ✅ Dead public assets removed (28+ images)
- ✅ `CODEX-PRODUCTION-PUSH.md` removed
- ✅ Empty `app/[locale]/_lib/` removed
- ✅ `use-mobile→use-is-mobile` rename
- ✅ Sell schema rename
- ✅ Home pools + discovery feed renames
- ✅ Dead mobile components in `(main)/_components/mobile/`
- ✅ Some dead export removal in `lib/`, `hooks/`, `components/`
- ✅ Stale E2E specs removed
- ✅ Health endpoint hardening

## What Was NOT Deeply Audited (Your Job)

The previous sessions checked naming and removed obvious dead files, but did NOT do
file-by-file import verification for most of these directories. You need to go through
each one with a subagent, read every file, grep for its imports, and delete anything dead.

### Route Groups — NONE were audited beyond surface level:
- `app/[locale]/(account)/` — full audit (every `_components/`, page, layout)
- `app/[locale]/(auth)/` — full audit (`_actions/`, `_components/`)
- `app/[locale]/(sell)/` — audit beyond the schema rename (`_actions/`, `_components/`, `_lib/`)
- `app/[locale]/(checkout)/` — full audit (`_actions/`, `_components/`)
- `app/[locale]/(business)/` — full audit (`_components/`)
- `app/[locale]/(chat)/` — full audit (`_actions/`, `_components/`)
- `app/[locale]/(plans)/` — full audit (`_components/`)
- `app/[locale]/(admin)/` — full audit (`_components/`)
- `app/[locale]/(onboarding)/` — full audit
- `app/[locale]/[username]/` — full audit (`_components/`)
- `app/[locale]/(main)/` — deeper audit of subroutes: `cart/`, `categories/`, `search/`, `seller/`, `sellers/`, `wishlist/`, `todays-deals/`, `gift-cards/`, `members/`, `registry/`, `about/`, `accessibility/`, `assistant/`, `demo/`, `messages/`, `(legal)/`, `(support)/`

### Component directories — most NOT individually audited:
- `components/shared/product/` — file-by-file audit
- `components/shared/category/` — file-by-file audit
- `components/shared/filters/` — file-by-file audit
- `components/shared/search/` — file-by-file audit
- `components/shared/profile/` — file-by-file audit
- `components/shared/wishlist/` — file-by-file audit
- `components/layout/header/` and all subfolders (`mobile/`, `desktop/`, `cart/`)
- `components/layout/sidebar/`
- `components/mobile/drawers/`
- `components/mobile/category-nav/`
- `components/desktop/`
- `components/auth/`
- `components/providers/` (including `_lib/`, `messages/`)
- `components/dropdowns/`
- `components/grid/`

### App-level shared — not individually audited:
- `app/[locale]/_components/auth/`
- `app/[locale]/_components/charts/`
- `app/[locale]/_components/drawers/`
- `app/[locale]/_components/nav/`
- `app/[locale]/_components/navigation/`
- `app/[locale]/_components/orders/`
- `app/[locale]/_components/providers/`
- `app/[locale]/_components/search/`
- `app/[locale]/_components/seller/`

### Server actions and API routes:
- `app/actions/` — every action file (beyond the 2 helpers already removed)
- `app/api/` — EVERY subfolder individually (admin, assistant, auth, badges, billing, boost, categories, checkout, connect, health, orders, payments, plans, products, revalidate, sales, seller, subscriptions, upload-chat-image, upload-image, wishlist)

### Supporting:
- `__tests__/` — verify every test file still has a matching source file
- `__tests__/api/` and `__tests__/hooks/`
- `e2e/` — remaining specs
- `scripts/` — remaining scripts (verify each is still referenced in package.json)
- `docs/` — check for stale docs
- `i18n/` — verify structure
- `context/` — what's in here?
- `messages/` — check for unused translation keys (optional, low priority)

---

## How To Work

### CRITICAL RULES
1. **DO NOT CREATE NEW FILES** — no new components, routes, hooks, or utilities
2. **DO NOT MODIFY BUSINESS LOGIC** — only delete dead code and clean up
3. **Only touch tracked files** — ignore untracked files (another terminal is working on those)
4. **Use subagents** — one per folder, deep audit

### Per-Folder Subagent Process
1. List every file in the folder
2. For each file, grep the entire codebase: `grep -rn "filename-without-ext" --include="*.ts" --include="*.tsx" --include="*.mjs" .`
3. If zero imports AND not a Next.js entry point (page/layout/loading/error/not-found/route) → **delete it**
4. If a file has large commented-out blocks (>5 lines) → remove them
5. Check for unused exports within files → remove them
6. Check for dead functions/components within files → remove them
7. Report what was done

### Verification
After each folder: `pnpm -s typecheck`
After each layer: `pnpm -s typecheck && pnpm -s lint`
When done: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

---

## What NOT To Touch
- DB schema, RLS, migrations (`supabase/`)
- Payment/webhook logic
- npm dependencies
- Translation files (`messages/*.json`)
- Config files
- Test infrastructure (`test/setup.ts`, `test/shims/`, `e2e/fixtures/`, `e2e/global-setup.ts`)
- Untracked files (they belong to another terminal's work)
- Don't push to git

## Decision Logging
Append to `.codex/CLEANUP-DECISIONS.md`

## Success
Every folder listed above has been individually audited by a subagent, all dead code removed, typecheck + lint pass.
