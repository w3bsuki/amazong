# Task: Tailwind v4 Styling Audit & Refactor

> **Read `codex/AGENTS.md` first.** It contains the project context, folder map, non-negotiables, and verification gates.

## Objective

Enforce Tailwind v4 semantic-token-only styling across the entire codebase. Eliminate all palette classes, arbitrary values, hardcoded colors, gradients, and opacity hacks. Clean up the massive CSS token system in `globals.css` — remove tokens nobody uses.

---

## Phase 1: Automated Scanning

### 1.1 Run All Style Scanners

```bash
pnpm -s styles:scan
```

This runs 5 scanners in sequence:
1. **Palette scan** (`scan-tailwind-palette.mjs`) — Finds raw Tailwind palette classes like `bg-red-500`, `text-blue-700`
2. **Arbitrary scan** (`scan-tailwind-arbitrary.mjs`) — Finds arbitrary values like `[#ff0000]`, `[rgb(0,0,0)]`
3. **Semantic token scan** (`scan-tailwind-semantic-tokens.mjs`) — Verifies tokens are used correctly
4. **Token alpha scan** (`scan-tailwind-token-alpha.mjs`) — Finds opacity modifier hacks like `bg-primary/10`
5. **Mobile Chrome scan** (`scan-mobile-chrome-consistency.mjs`) — Checks mobile-specific consistency

Fix EVERY finding. No exceptions. The project rule is: semantic tokens only.

### 1.2 Run the Gate (Fail Mode)

After fixing all findings:

```bash
pnpm -s styles:gate
```

This runs the same scanners with `FAIL_ON_FINDINGS=1`. It must exit 0.

---

## Phase 2: CSS File Audit

### 2.1 `app/globals.css` — Token Cleanup

This file is huge (~600+ lines). It defines the entire design system. Audit it in sections:

**`:root` and `.dark` CSS custom properties:**
- For every CSS custom property (e.g., `--category-tech-bg`, `--social-instagram`, `--urgency-stock-bg`), grep the codebase for usage.
- Search for the token in both its CSS variable form (`var(--token)`) and its Tailwind mapped form (e.g., `bg-category-tech-bg`, `text-social-instagram`).
- If a token has ZERO usages in any `.ts`, `.tsx`, or `.css` file (other than its own definition), delete it from `:root`, `.dark`, and `@theme inline`.
- Be thorough: check both the raw `--var-name` and the mapped `--color-var-name` in `@theme inline`.

**`@theme inline` block:**
- This block maps CSS vars to Tailwind `--color-*` tokens. Every entry here must correspond to a CSS var in `:root`/`.dark`.
- Remove any mapping that doesn't have a corresponding CSS var definition.
- Remove any mapping where the resulting Tailwind utility class is never used in the codebase.

**`@theme` block (marketplace tokens):**
- Contains font definitions, spacing tokens, sizing tokens, layout tokens, shadow definitions, and hundreds of color aliases.
- For each token, grep for usage. Delete unused tokens.
- Pay special attention to alias chains. If `--color-badge-condition-new` points to `--color-foreground`, and `bg-badge-condition-new` is never used in any TSX file, delete the alias.
- Check for tokens that are defined but have equivalent semantic tokens already (e.g., `--color-brand` aliased to `--color-primary` — if nobody uses `bg-brand`, delete `--color-brand`).

**`@layer base` block:**
- Keep the essentials (border defaults, selection styling, focus-visible, html/body styles).
- Remove any commented-out code.
- Verify the header isolation rules are still needed.

### 2.2 `app/legacy-vars.css`

Read this file. It likely contains old CSS variables migrated from a previous design system. For each variable:
1. Search the codebase for usage.
2. If unused, mark for deletion.
3. If used, check if there's a semantic token equivalent in `globals.css` — migrate the usage and delete the legacy var.
4. If the file becomes empty after cleanup, delete it and remove its `@import` from `globals.css`.

### 2.3 `app/utilities.css`

Read this file. It contains custom Tailwind utilities. For each utility:
1. Search the codebase for usage.
2. Delete unused utilities.
3. If the file becomes empty, delete it and remove its `@import` from `globals.css`.

### 2.4 `app/shadcn-components.css`

Read this file. It contains component-specific CSS overrides. For each rule:
1. Verify the component it targets still exists.
2. Verify the override is still needed (shadcn may have been updated since).
3. Delete stale rules.
4. If the file becomes empty, delete it and remove its `@import` from `globals.css`.

### 2.5 `components/design-system2/theme.css`

This is the ONLY file in the `components/design-system2/` folder. Read it:
1. If it contains tokens/rules not in `globals.css`, merge them into `globals.css`.
2. If it's a duplicate of what's already in `globals.css`, delete it.
3. Delete the `components/design-system2/` folder after.

---

## Phase 3: Codebase-Wide Violations

### 3.1 Palette Classes

Search for raw Tailwind palette classes that bypass semantic tokens:

```bash
grep -rn "bg-\(red\|blue\|green\|yellow\|orange\|purple\|pink\|indigo\|gray\|slate\|zinc\|neutral\|stone\|amber\|lime\|emerald\|teal\|cyan\|sky\|violet\|fuchsia\|rose\)-" --include="*.tsx" --include="*.ts" app/ components/ lib/
```

Replace each with the appropriate semantic token (e.g., `bg-red-500` → `bg-destructive`, `text-gray-500` → `text-muted-foreground`).

### 3.2 Hardcoded Colors

```bash
grep -rn "\[#\|rgb(\|rgba(\|hsl(\|hsla(" --include="*.tsx" --include="*.ts" app/ components/
```

Replace with semantic tokens or delete.

### 3.3 Gradient Classes

```bash
grep -rn "bg-gradient-\|from-\|via-\|to-" --include="*.tsx" --include="*.ts" app/ components/
```

Gradients are banned. Replace with solid semantic colors.

### 3.4 `text-white` and `text-black`

```bash
grep -rn "text-white\|text-black\|bg-white\|bg-black" --include="*.tsx" --include="*.ts" app/ components/
```

Replace with semantic tokens:
- `text-white` → `text-primary-foreground` (on primary bg), `text-background` (on dark bg), or appropriate foreground token
- `text-black` → `text-foreground`
- `bg-white` → `bg-background`
- `bg-black` → `bg-foreground` or `bg-surface-gallery` depending on context

### 3.5 Opacity Modifiers

```bash
grep -rn "/[0-9]\{1,3\}\b" --include="*.tsx" --include="*.ts" app/ components/ | grep -v "//\|/\*\|http\|path\|import\|from\|src="
```

Find Tailwind opacity modifiers like `bg-primary/10`, `border-border/50`. Replace with dedicated semantic tokens (e.g., `bg-primary-subtle`, `border-border-subtle`).

---

## Phase 4: Inline Style Audit

### 4.1 Find All `style=` Props

```bash
grep -rn "style=" --include="*.tsx" app/ components/
```

Inline styles bypass the design system. For each one:
1. If it can be expressed with Tailwind utilities, convert it.
2. If it uses CSS variables, that's acceptable (e.g., `style={{ '--progress': value }}`).
3. If it's dynamic styling that can't be tokenized, leave it but add a comment explaining why.

### 4.2 Find All `className` String Concatenation

```bash
grep -rn "className={`\|className={'" --include="*.tsx" app/ components/
```

Ensure string concatenation doesn't introduce palette classes or arbitrary values. All dynamic classes should still use semantic tokens.

---

## Verification

After all changes:

```bash
pnpm -s styles:gate   # Must exit 0 (zero findings)
pnpm -s typecheck     # Must pass
pnpm -s lint          # Must pass
```

---

## Completion Criteria

- `pnpm -s styles:gate` exits 0 with zero findings across all 5 scanners
- Zero palette classes in TSX/TS files
- Zero hardcoded hex/rgb/hsl colors in TSX/TS files
- Zero gradient classes
- Zero `text-white`, `text-black`, `bg-white`, `bg-black` in TSX/TS files
- All CSS token files (`globals.css`, `legacy-vars.css`, `utilities.css`, `shadcn-components.css`) contain only actively-used tokens/rules
- `components/design-system2/` folder deleted
- Every remaining CSS custom property has at least one consumer in the codebase
