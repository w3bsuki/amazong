---
name: a11y-audit
description: Accessibility audit for this repo (labels, focus, keyboard, Playwright a11y project). Triggers on "A11Y:" prefix and accessibility verification work.
version: 1.0.0
---

# Accessibility Audit (A11Y)

Use this skill to prevent regressions in keyboard/focus/labels and to verify a11y via the repo’s Playwright accessibility project.

## Entry Criteria (ask if missing)

- Scope: route(s) / component(s) / “entire flow”
- Expected interactions: forms, dialogs, menus, navigation

## On Any "A11Y:" Prompt

1. Apply the baseline checklist:
   - Every control has a label (visible or `aria-label`).
   - Focus is visible and logically ordered.
   - Dialogs/menus trap focus and close via Escape.
   - Touch targets ≥32px (see `docs/DESIGN.md`).
2. Run the automated a11y suite when relevant:
   - `pnpm test:a11y`
3. Report findings with exact routes/components and propose smallest fixes.

## Output Format

```markdown
## A11Y Audit — {date}

### Critical (must fix)
- [ ] Issue → Route/File → Fix

### High
- [ ] Issue → Route/File → Fix
```

## Examples

### Example prompt
`A11Y: audit the account settings form`

### Expected behavior
- Apply the checklist for labels, focus, and keyboard support.
- Run `pnpm test:a11y` when relevant.
- Report findings using the output format.
