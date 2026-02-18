# Phase 3 — Agent 3: Dependency Diet

> **Scope:** Remove unused dependencies, consolidate duplicates, evaluate heavy deps.
> **Read `refactor/shared-rules.md` first.**

---

## How to Work

### Step 1: Run knip

```bash
pnpm -s knip
```

Knip is already configured (`knip.json`). Act on every finding:
- **Unused dependencies** → remove from `package.json` with `pnpm remove <pkg>`
- **Unused devDependencies** → remove
- **Unused exports** → remove the export (keep the function if it's used internally)
- **Unused files** → verify with grep, then delete
- **Unused types** → remove

### Step 2: AI SDK audit

```bash
grep -rn "@ai-sdk/google\|@ai-sdk/groq\|@ai-sdk/openai" app/ lib/ --include="*.ts" --include="*.tsx"
```

The project has 3 AI SDK providers (`@ai-sdk/google`, `@ai-sdk/groq`, `@ai-sdk/openai`). Check which are actually used in code. Remove unused providers:
```bash
pnpm remove @ai-sdk/<unused-provider>
```

Verify remaining AI SDK code is server-only (not leaking to client bundle). AI SDK imports should only appear in server actions or route handlers, never in `"use client"` files.

### Step 3: Heavy dependency evaluation

For each heavy dependency, evaluate whether it's justified:

**framer-motion (~120KB)**
```bash
grep -rn "from ['\"]framer-motion" --include="*.tsx" --include="*.ts" app/ components/ -l | wc -l
```
- If <5 usages → can they be replaced with CSS transitions/animations?
- Count how many unique framer features are used (AnimatePresence, motion.div, variants, etc.)

**recharts (~200KB)**
```bash
grep -rn "from ['\"]recharts" --include="*.tsx" --include="*.ts" app/ components/ -l
```
- Verify it's only used in admin/analytics dashboards (not on public pages).
- Verify it's dynamically imported (Phase 2 should have handled this, but double-check).

**photoswipe (~50KB)**  
**react-markdown + remark-gfm (~100KB)**  
**boring-avatars**
```bash
grep -rn "from ['\"]photoswipe\|from ['\"]react-markdown\|from ['\"]boring-avatars" --include="*.tsx" --include="*.ts" app/ components/ -l
```
- Are they still used? If not → remove.
- Are they dynamically imported? If not → flag for dynamic import.

### Step 4: Duplicate code detection

```bash
pnpm -s dupes
```

If `dupes` script exists, run it and act on findings. For duplicated blocks >10 lines:
- Extract into a shared utility in `lib/` or `components/shared/`
- Update all consumers to use the shared version
- Verify with typecheck

If `dupes` script doesn't exist:
```bash
npx jscpd --min-lines 10 --min-tokens 50 app/ components/ lib/ hooks/ --ignore "**/*.test.*,**/node_modules/**"
```

### Step 5: Check for multiple packages doing the same thing

```bash
# Date libraries — should only have one
grep -rn "from ['\"]date-fns\|from ['\"]dayjs\|from ['\"]moment\|from ['\"]luxon" --include="*.ts" --include="*.tsx" app/ components/ lib/

# Form libraries
grep -rn "from ['\"]react-hook-form\|from ['\"]formik" --include="*.tsx" app/ components/

# Animation libraries
grep -rn "from ['\"]framer-motion\|from ['\"]react-spring\|from ['\"]@react-spring" --include="*.tsx" app/ components/
```

If multiple libraries serve the same purpose → consolidate to one.

## Special Notes

- **DON'T remove** `tailwindcss`, `tw-animate-css` — these are ignored in knip config for a reason.
- **DON'T remove** packages that are only used in config files (`next.config.ts`, `postcss.config.mjs`, etc.) — knip may not detect config-only usage.
- After removing a dependency: `pnpm install` to update lockfile, then `pnpm -s typecheck` to verify nothing breaks.
- After removing many deps at once: do a full `pnpm build` to catch any runtime issues.

## Verification

See root `AGENTS.md` § Verify.
After removing dependencies, also run `pnpm build` to catch runtime issues.

## Output

- Dependencies removed (list + reason)
- Unused exports removed (count)
- Unused files deleted (list)
- Duplicate code consolidated (what → what)
- Heavy deps evaluated (keep/remove/flag + rationale)
- `package.json` size reduction (before/after dep count)
