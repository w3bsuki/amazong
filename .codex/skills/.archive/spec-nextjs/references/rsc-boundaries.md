# RSC vs Client Boundaries (Next.js 16 App Router)

Treido defaults to Server Components. `"use client"` is an opt-in escape hatch.

## Boundary Rules (Treido Rails)

- Default: Server Components everywhere in `app/**`.
- Add `"use client"` only when you must use:
  - React state/effects/contexts in that module
  - event handlers (`onClick`, `onChange`, etc.)
  - client-only libraries (Radix interactive primitives, browser APIs)
- Never import server-only modules into client components.

### Server-only imports that must not reach client bundles

High-signal imports to flag inside `"use client"` modules (and their transitive deps):
- `next/headers` (cookies/headers)
- `next/server` (NextRequest/NextResponse helpers are for middleware/route handlers)
- `server-only`
- Node-only packages (`fs`, `path`, `crypto` in browser contexts, etc.)
- server Supabase clients (`lib/supabase/server.ts`, admin client)
- Stripe secret-side SDKs

If a file needs both server and client logic, split it:
- server wrapper: fetch/authorize/transform
- client leaf: interactive UI only

## Practical Heuristics (What To Scan)

### 1) `"use client"` placement

Smell: `"use client"` at the top of large modules that also do data fetching, parsing, or business logic.

Fix patterns:
- Split into:
  - `.../server.ts` (server fetch/validation; exports serializable props)
  - `.../client.tsx` (UI + event handlers)
- Keep client components pure: props in, callbacks out.

### 2) Hooks without `"use client"`

Smell: `useState/useEffect/useMemo/...` in a file without `"use client"`.

Fix patterns:
- Add `"use client"` if truly needed, OR
- Move hook usage into a leaf client component and keep parent server component.

### 3) Route-private imports leaking across groups

Smell: `components/` importing from `app/[locale]/(group)/_components/*` or `_actions/*`.

Fix patterns:
- Promote shared pieces to `components/shared/*` or `app/actions/*`.
- Keep route-private modules route-private.

### 4) `next/navigation` usage

Treido uses next-intl routing helpers; importing from `next/navigation` often indicates:
- locale drift
- incorrect link building
- navigation hooks used in server components (not allowed)

Fix patterns:
- Use `@/i18n/routing` exports (Link/router/hooks) per `.codex/project/ARCHITECTURE.md`.

## Evidence To Collect (for findings)

For each boundary finding, include:
- file path + line where `"use client"` exists (or is missing)
- file path + line for the server-only import/hook usage
- note whether the issue is direct or transitive (import chain)

## Common Pitfalls (Specific)

- Client component imports a "barrel" (`index.ts`) that re-exports server-only modules.
- A shared `lib/*` helper imports `next/headers` "just for one thing", contaminating all dependents.
- Calling `cookies()` or `headers()` inside cached server functions: makes output request-specific and violates caching rails.
- Using non-serializable props across RSC->client boundary (Dates, Maps, class instances, functions except callbacks).

