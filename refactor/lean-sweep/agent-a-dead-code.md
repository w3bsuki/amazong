# Phase A — Dead Code Purge

> **Scope:** Remove dead weight — unused deps, files, exports, CSS, commented code.
> **Read `refactor/shared-rules.md` first.**
> **This is the safest phase.** Everything here is provably unused.

---

## Step 1: Run knip

```bash
pnpm -s knip
```

Act on every finding:
- **Unused dependencies** → `pnpm remove <pkg>`
- **Unused devDependencies** → `pnpm remove -D <pkg>`
- **Unused exports** → remove the export keyword (keep function if used internally)
- **Unused files** → grep to double-confirm zero usage, then delete

**Exceptions — DON'T remove:**
- Packages only used in config files (`next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`)
- `tailwindcss`, `tw-animate-css` — ignored in knip config for a reason
- Packages used in scripts (`scripts/*.mjs`)

After removing deps: `pnpm install` to update lockfile.

## Step 2: Remove dead UI component

`components/ui/toggle.tsx` has **zero imports** anywhere in the codebase.
Confirm: `grep -rn "toggle" components/ app/ --include="*.tsx" --include="*.ts" | grep -i "from.*ui/toggle"`
If zero → delete it.

## Step 3: Clean CSS files

### `app/legacy-vars.css`
For each CSS variable defined, check usage:
```bash
grep -rn "var(--VARIABLE-NAME)" app/ components/ --include="*.tsx" --include="*.css"
```
Zero usage → remove the variable definition.

### `app/utilities.css`
Same — grep for each utility class or variable. Remove unused.

### `app/shadcn-components.css`
Same — any custom component CSS for deleted shadcn components.

## Step 4: Remove commented-out code blocks

```bash
grep -rn "^\s*//" app/ components/ lib/ hooks/ --include="*.tsx" --include="*.ts" | head -300
```

Delete blocks of 3+ consecutive `//` comment lines that contain code (not explanatory comments).

**Keep:**
- Single-line explanatory comments
- JSDoc/TSDoc
- `// eslint-disable` directives
- Type annotations in comments

## Step 5: Triage TODO/FIXME/HACK

```bash
grep -rn "TODO\|FIXME\|HACK\|XXX\|TEMP" app/ components/ lib/ hooks/ --include="*.tsx" --include="*.ts"
```

For each:
- **Already done?** → Remove comment
- **Fixable in <5 min?** → Fix it, remove comment
- **Stale (references old code)?** → Remove
- **Genuine future work?** → Keep

## Step 6: AI SDK audit

```bash
grep -rn "@ai-sdk/google\|@ai-sdk/groq\|@ai-sdk/openai" app/ lib/ --include="*.ts" --include="*.tsx"
```

3 AI SDK providers installed. Check which are actually imported and used.
Remove unused: `pnpm remove @ai-sdk/<unused>`

## Verification

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

## Output

Log in `refactor/lean-sweep/extractions.md`:
- Dependencies removed (list + reason)
- Files deleted (list)
- Exports removed (count)
- CSS lines removed (count)
- Commented code blocks removed (count)
- TODOs resolved/removed (count)
