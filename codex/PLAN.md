# Master Refactor Plan

> Execute phases in order. Each phase is independently verifiable.
> After each phase: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

---

## Phase 1: Cleanup

**Goal:** Remove all dead weight — files, deps, code, docs, configs that serve no purpose.

**Scan for:**
- Unused files (run `pnpm knip` — reports unused exports, files, deps)
- `console.log` / `console.debug` / `console.info` statements (keep `console.error` and `console.warn`)
- `TODO` / `FIXME` / `HACK` / `XXX` comments — resolve or remove
- Dead imports (ESLint catches these, but double-check)
- Unused dependencies in `package.json` (knip reports these)
- Stale docs in `docs/` or `refactor/` that reference completed work
- Orphan config files that aren't referenced
- Debug artifacts: test snapshots, `.log` files, temp files
- Empty files or files with only imports and no exports

**Reference:** No specific ref needed — this is housekeeping.

**Done criteria:**
- `pnpm knip` reports zero unused exports/files/deps (or remaining items are documented as intentional)
- Zero `console.log` in app code (check with `grep -r "console\.log" app/ components/ lib/ hooks/`)
- Zero `TODO`/`FIXME` in production code
- All gates pass

**Verify:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
pnpm knip
```

---

## Phase 2: Next.js Alignment

**Goal:** Every file follows perfect Next.js 16 App Router patterns — correct component types, proper caching, clean boundaries.

**Read:** `codex/refs/nextjs.md`

**Scan for:**
- Components with `"use client"` that don't need it (no state, effects, event handlers, or browser APIs)
- Server Components that should use `"use cache"` for cacheable data
- `"use cache"` blocks that contain `cookies()`, `headers()`, or `createClient()` (should use `createStaticClient()`)
- Missing `cacheLife()` or `cacheTag()` in `"use cache"` blocks (must always pair both)
- `revalidate` / `{ cache: 'no-store' }` / ISR patterns (deprecated — replace with `"use cache"`)
- Missing `loading.tsx` or `error.tsx` in route segments that should have them
- Missing or stale `generateMetadata` exports
- `next/link` imports (should be `Link` from `@/i18n/routing`)
- `next/navigation` imports for `redirect`/`useRouter`/`usePathname` (should be from `@/i18n/routing`)
- Data fetching in Client Components (should be prop-driven from Server Components)
- Route handlers that could be server actions
- `_components/`, `_actions/`, `_lib/` files imported across route groups

**Done criteria:**
- Every `"use client"` is justified (needs state/effects/handlers/browser APIs)
- All cacheable queries use `"use cache"` + `cacheLife()` + `cacheTag()`
- Zero `next/link` or `next/navigation` imports for navigation (all through `@/i18n/routing`)
- No cross-route-group imports of private dirs
- All gates pass

**Verify:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
grep -r "from ['\"]next/link" app/ components/
grep -r "from ['\"]next/navigation" app/ components/ --include="*.tsx" --include="*.ts" | grep -v "generateStaticParams\|generateMetadata"
```

---

## Phase 3: Tailwind v4 + shadcn Theming

**Goal:** Zero styling violations — semantic tokens only, no palette classes, no arbitrary values, no gradients.

**Read:** `codex/refs/tailwind-v4.md` + `codex/refs/shadcn.md`

**Scan for:**
- Palette color classes: `bg-blue-*`, `bg-gray-*`, `bg-zinc-*`, `text-red-*`, etc.
- Arbitrary values: `bg-[#...]`, `w-[...]px`, `text-[...]`, etc.
- Gradient classes: `bg-gradient-*`, `from-*`, `via-*`, `to-*`
- `hsl(var(--...))` patterns (should be OKLCH or semantic)
- Inline `style={{ color: ... }}` for things that should be tokens
- Hardcoded hex/rgb/hsl values in TSX files
- Non-token spacing or sizing that should use the scale

**Done criteria:**
- `pnpm -s styles:gate` passes with zero findings
- Zero palette/arbitrary/gradient classes in any `.tsx` or `.css` file
- All colors use semantic tokens (`bg-background`, `text-primary`, etc.) or CSS variables

**Verify:**
```bash
pnpm -s styles:gate
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

---

## Phase 4: Component Architecture

**Goal:** Clean component hierarchy — no duplication, proper server/client split, correct directory placement.

**Read:** `codex/refs/shadcn.md` + `codex/refs/react-19.md`

**Scan for:**
- Duplicate components (same UI, different files)
- Components in wrong directory (`ui/` should be primitives only, business logic in `shared/`)
- Unnecessary wrapper components (one component that just renders another)
- Deep nesting that can be flattened
- Large components (>300 lines) that should be split
- Client components that could be made server components by pushing client boundary lower
- Components importing from `components/ui/` that should use composition, not modification

**Done criteria:**
- No duplicate components (same visual result from different code)
- `components/ui/` contains only shadcn primitives
- `components/shared/` contains cross-route composites
- `components/layout/` contains layout shells only
- No component exceeds 300 lines
- All gates pass

**Verify:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
pnpm -s architecture:gate
```

---

## Phase 5: Supabase Patterns

**Goal:** Every database query uses the correct client, proper error handling, typed responses, minimal selects.

**Read:** `codex/refs/supabase.md`

**Scan for:**
- `getSession()` calls anywhere (must be `getUser()`)
- `createClient()` inside `"use cache"` (must be `createStaticClient()`)
- `select('*')` in list views or hot paths (specify columns)
- Wide joins (`.select("*, relation(*)")`) in list views
- Missing error handling on Supabase responses (unchecked `error`)
- Server actions without `requireAuth()` at the top
- `createBrowserClient()` used in Server Components
- Wrong client type for context (see reference table)

**Done criteria:**
- Zero `getSession()` calls
- Zero `select('*')` in hot paths
- All `"use cache"` blocks use `createStaticClient()`
- All mutating server actions use `requireAuth()`
- All Supabase queries have error handling
- All gates pass

**Verify:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
grep -r "getSession" app/ lib/ components/ --include="*.ts" --include="*.tsx"
grep -r "select\(['\"]\\*['\"]" app/ lib/ --include="*.ts" --include="*.tsx"
```

---

## Phase 6: Type Safety

**Goal:** Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. Full type safety.

**Read:** `codex/refs/typescript.md`

**Scan for:**
- `any` type annotations (replace with proper types or `unknown`)
- `@ts-ignore` comments (fix the underlying type error)
- `@ts-expect-error` comments (fix the underlying type error)
- `as` type assertions used for widening (not narrowing)
- `!` non-null assertions (handle null explicitly)
- `enum` usage (replace with `as const` unions)
- Missing return types on exported functions
- Untyped function parameters
- `// eslint-disable` comments that suppress type errors

**Done criteria:**
- `grep -r "any" --include="*.ts" --include="*.tsx"` shows zero type-annotation `any` (string "any" in variable names is ok)
- Zero `@ts-ignore` or `@ts-expect-error`
- Zero `!` non-null assertions (or each one has a comment justifying it)
- All gates pass, including `pnpm -s ts:gate`

**Verify:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
pnpm -s ts:gate
grep -rn "@ts-ignore\|@ts-expect-error" app/ lib/ components/ hooks/
```

---

## Phase 7: Code Reduction

**Goal:** Same functionality, fewer lines. Remove over-engineering, verbose patterns, unnecessary abstractions.

**Read:** No specific ref — use judgment.

**Scan for:**
- Abstraction layers that are only used once (inline them)
- Verbose conditionals that can be ternaries or `??` / `&&`
- Helper functions that could be a one-liner at the call site
- Intermediate variables that don't add clarity
- Overly defensive error handling for cases that can't happen
- Files with more imports than logic
- Configuration that duplicates defaults
- Wrapper functions that just pass through

**Done criteria:**
- No file contains an abstraction used in only one place
- No unnecessarily verbose code patterns
- Total LOC is measurably lower (track before/after)
- All gates pass

**Verify:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Phase 8: i18n Completeness

**Goal:** Every user-facing string goes through next-intl. Both en/bg are complete and in sync.

**Read:** `codex/refs/next-intl.md`

**Scan for:**
- Hardcoded English/Bulgarian strings in TSX files (not in `messages/`)
- String literals in JSX that should be translated: button labels, headings, descriptions, error messages, placeholders, aria-labels, alt text
- Keys in `messages/en.json` missing from `messages/bg.json` (or vice versa)
- Navigation using `next/link` or `next/navigation` instead of `@/i18n/routing`
- `getTranslations` without `setRequestLocale()` in the layout/page
- Client Components using `getTranslations` (should use `useTranslations`)

**Done criteria:**
- Zero hardcoded user-facing strings in TSX/TSX files
- `messages/en.json` and `messages/bg.json` have identical key structures
- Existing i18n parity test passes
- All gates pass

**Verify:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Phase 9: Testing Hygiene

**Goal:** Tests are accurate, non-stale, and cover critical paths.

**Scan for:**
- Tests that reference moved/renamed files or functions
- Tests that are skipped (`it.skip`, `describe.skip`, `xit`, `xdescribe`)
- Tests that always pass (empty test bodies, no assertions)
- Stale snapshot files
- Missing tests for: server actions, utility functions, critical business logic
- Test files that don't match the current file they're testing

**Done criteria:**
- All tests pass: `pnpm -s test:unit` shows 0 failures
- Zero skipped tests
- Zero empty test bodies
- All gates pass

**Verify:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Phase 10: Final Gate

**Goal:** Full verification — every gate green, no regressions, clean codebase.

**Run the full battery:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
pnpm -s architecture:gate
pnpm -s ts:gate
pnpm knip
```

**Manual checks:**
- Scan for any remaining `console.log`
- Scan for any remaining `any` types
- Scan for any remaining `@ts-ignore` / `@ts-expect-error`
- Scan for any remaining palette/arbitrary classes
- Verify `messages/en.json` and `messages/bg.json` key parity

**Done criteria:**
- ALL automated gates pass with zero warnings
- No manual check finds violations
- The codebase is cleaner, smaller, and more correct than when you started

---

## Cross-Phase Rules

These apply to EVERY phase:

1. **Never touch auth/payments/RLS/migrations.** Flag for human if you find issues.
2. **Run gates after each phase.** Don't accumulate debt.
3. **Preserve all existing functionality.** This is a refactor, not a rewrite.
4. **If a test breaks, fix the test IF the code change is correct.** Don't change code to make a stale test pass.
5. **If unsure, leave a `// REVIEW:` comment** for the human. Don't guess on ambiguous patterns.
