---
name: nextjs-audit
description: Next.js 16 App Router audit (server/client boundaries, caching correctness, build cost). Triggers on "NEXTJS:" prefix and Next.js caching/routing issues.
version: 1.0.0
---

# Next.js Audit (App Router + Cache Components)

Use this skill to prevent “works in dev, breaks/stales in prod” problems: caching misuse, boundary leaks, and accidental build/SSG cost spikes.

## Entry Criteria (ask if missing)

- Scope: specific route(s), folder, or recent diff
- Goal: correctness, performance, build cost, or all three

## On Any "NEXTJS:" Prompt

1. Load canonical rules:
   - `docs/ENGINEERING.md` (caching + boundaries)
   - `docs/FRONTEND.md` (App Router + i18n)
2. Boundary checks:
   - Default to Server Components; use `"use client"` only when needed.
   - No cross-route-group imports of `app/[locale]/(group)/**/_components/**` or `_actions/**`.
3. Cache correctness checks:
   - Any `'use cache'` work must pair with `cacheLife('<profile>')`.
   - No `cookies()` / `headers()` / per-user data inside cached functions.
   - Cache tags are granular; invalidation uses `revalidateTag(tag, profile)` (two args).
4. Cost checks:
   - Watch for routes that accidentally become SSG-heavy and explode build time.
   - Avoid wide data fetches during build for user-specific pages.
5. Output findings with evidence (file paths) and propose the smallest safe fixes.

## Helpful Scans (examples)

```bash
rg -n \"'use cache'\" app lib -S
rg -n \"cacheLife\\(\" app lib -S
rg -n \"\\bcookies\\(\\)|\\bheaders\\(\\)\" app lib -S
rg -n \"revalidateTag\\(\" app lib -S
rg -n '\"use client\"' app components -S
```

## Output Format

```markdown
## Next.js Audit — {date}

### Critical (must fix)
- [ ] Issue → File → Fix

### High
- [ ] Issue → File → Fix
```

## Examples

### Example prompt
`NEXTJS: review caching for the product details route`

### Expected behavior
- Check boundaries, cache usage, and invalidation rules.
- Flag any per-user data inside cached functions.
- Report findings using the output format.
