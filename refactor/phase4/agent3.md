# Phase 4 — Agent 3: Code Quality

> **Scope:** Split oversized files, remove dead code, triage TODOs, fix tests, verify i18n.
> **Read `refactor/shared-rules.md` first.**

---

## Objectives

1. Split files over 300 lines into focused modules.
2. Remove commented-out code blocks (>3 lines).
3. Triage TODO/FIXME/HACK comments.
4. Verify all tests pass (fix broken imports from refactoring).
5. Verify i18n translation parity (EN ↔ BG).

## How to Work

### 1. Find oversized files

```bash
Get-ChildItem -Recurse -Include *.tsx,*.ts app/,components/,lib/,hooks/ | ForEach-Object { $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines; if ($lines -gt 300) { "{0}`t{1}" -f $lines, $_.FullName } } | Sort-Object -Descending
```

For files over 300 lines, split by extracting:
- **Types/interfaces** into a colocated `types.ts`
- **Utility functions** into a colocated `utils.ts`
- **Sub-components** into their own files (colocated in same directory)
- **Constants/config** into a colocated `constants.ts`

After each split: update all imports, run `pnpm -s typecheck`.

### 2. Remove commented-out code

```bash
grep -rn "^\s*//" app/ components/ lib/ hooks/ --include="*.tsx" --include="*.ts" | head -200
```

Look for multi-line commented-out blocks (>3 consecutive commented lines). These are dead weight — they live in git history. Delete them.

**Don't remove:**
- Single-line explanatory comments (`// This handles edge case X`)
- JSDoc comments
- Type annotations in comments
- `// eslint-disable` directives

### 3. Triage TODO/FIXME/HACK comments

```bash
grep -rn "TODO\|FIXME\|HACK\|XXX\|TEMP" app/ components/ lib/ hooks/ --include="*.tsx" --include="*.ts"
```

For each:
- **Is it still relevant?** Does the TODO describe work that was already done? → Remove the comment.
- **Is it actionable right now?** Can you fix the issue in <5 minutes? → Fix it and remove the comment.
- **Is it stale?** References old code, old features, or conditions that no longer apply? → Remove.
- **Is it a genuine TODO for later?** → Keep it. But make sure it's descriptive enough to be useful.

### 4. Fix test health

```bash
pnpm -s test:unit
```

If any tests fail:
- **Broken imports** (from files moved/renamed in previous phases) → fix the import path.
- **Missing test subject** (tested file was deleted) → delete the test file.
- **Changed signatures** (function signature changed) → update the test to match new signature.
- **DON'T change test assertions** — if a test assertion fails, the code is wrong, not the test. Flag it.

Also run:
```bash
pnpm -s test:unit -- -t "architecture"
```
Architecture boundary tests must pass. If they detect violations from earlier phases, fix the violations.

### 5. Verify i18n parity

```bash
pnpm -s test:unit -- -t "i18n"
```

The existing i18n test checks EN ↔ BG key parity. If it fails, fix the translation files:
- Missing keys in `messages/bg.json` → add them (copy EN value as placeholder, prefix with `[BG] ` to mark for human translation).
- Missing keys in `messages/en.json` → add them.
- Extra keys in one but not the other → remove the extra keys (dead translations).

Also check for hardcoded strings:
```bash
grep -rn "\"[A-Z][a-z].*\"" components/ app/ --include="*.tsx" | grep -v "className\|import\|from\|type\|interface\|const.*=\|export" | head -50
```
If you find English strings hardcoded in JSX that should be translated — flag them (don't add translations yourself, just note them).

## Special Notes

- When splitting files, keep the primary export in the original file. Move secondary exports to new files.
- Colocate extracted files: `component.tsx` → types in `component.types.ts`, utils in `component.utils.ts`, sub-components in `component-part.tsx`.
- **DON'T split** files that are cohesive — if a 350-line file is one well-structured component with no extractable parts, leave it.
- **DON'T modify test assertions.** If tests fail because of logic changes, flag it.

## Verification

See root `AGENTS.md` § Verify.

## Output

- Files split (list: original → what was extracted)
- Commented-out code blocks removed (count)
- TODO/FIXME resolved or removed (count)
- TODO/FIXME kept (list with brief note)
- Tests fixed (list of what was broken and why)
- i18n issues found (missing keys, hardcoded strings)
- Lines of code removed (rough estimate)
