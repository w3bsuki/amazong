# Phase 4 — Agent 2: CSS & Styling Cleanup

> **Scope:** Clean up CSS files, eliminate style violations, remove legacy cruft.
> **Read `refactor/shared-rules.md` first.**
> **Also read `docs/DESIGN.md` and `app/globals.css` for design system context.**

---

## Objectives

1. Audit and clean `app/legacy-vars.css` — remove unused variables.
2. Audit and clean `app/utilities.css` and `app/shadcn-components.css`.
3. Find and convert inline styles to Tailwind classes.
4. Remove `!important` wherever possible.
5. Ensure `pnpm -s styles:gate` passes cleanly.

## How to Work

### 1. Audit `app/legacy-vars.css`

For each CSS variable defined:
```bash
grep -rn "var(--variable-name)" app/ components/ --include="*.tsx" --include="*.css"
```
Zero results = unused → remove the variable definition.

### 2. Audit `app/utilities.css`

Same approach — for each utility class or variable, grep for usage. Remove unused ones.

### 3. Audit `app/shadcn-components.css`

Same — remove unused custom component styles. If a shadcn component was deleted in earlier phases, its custom CSS may still linger.

### 4. Find inline styles

```bash
grep -rn "style={{" app/ components/ --include="*.tsx"
```

For each inline style:
- Can it be a Tailwind class? → Convert. Use semantic tokens (`bg-background`, `text-foreground`, etc.)
- Is it truly dynamic (computed at runtime from data)? → Keep, but document why.
- Is it a one-off hack? → Try to eliminate. If CSS variable makes sense, add to `globals.css` theme.

### 5. Find `!important`

```bash
grep -rn "!important" app/ components/ --include="*.tsx" --include="*.css"
```

`!important` is almost always a code smell. For each:
- Is it overriding a third-party library style? → Keep if no alternative. Document why.
- Is it papering over a specificity issue? → Fix the root cause (proper class order, remove conflicting styles).
- Is it unnecessary? → Remove.

### 6. Run style gates

```bash
pnpm -s styles:gate
```

Fix every violation reported. Reference the token maps in `app/globals.css`.

Common violations:
- Palette classes (`bg-gray-100`) → use semantic tokens (`bg-muted`)
- Raw hex values → use CSS variables
- Arbitrary values (`w-[560px]`) → find a standard Tailwind class or define a theme token

### 7. Check for Tailwind v4 anti-patterns

- `@apply` in CSS files with many utilities → consider converting to component classes or inline Tailwind
- Duplicate utility combinations across many files → consider adding a utility class in `globals.css`

## Special Notes

- **DON'T TOUCH** `app/globals.css` `@theme` block — that's the design system source of truth. You can add variables but don't remove or rename existing ones without checking all usages.
- The style gate scripts are in `scripts/` — don't modify them.
- Semantic tokens are defined in `app/globals.css`. Read it to understand the token vocabulary before making changes.

## Verification

See root `AGENTS.md` § Verify.

## Output

- CSS variables removed from `legacy-vars.css` (count)
- CSS variables removed from `utilities.css` (count)
- CSS variables removed from `shadcn-components.css` (count)
- Inline styles converted to Tailwind (count + files)
- `!important` removed (count)
- Style gate violations fixed (count)
- Total lines of CSS removed
