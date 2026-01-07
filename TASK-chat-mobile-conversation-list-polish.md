# TASK: Chat mobile conversation list polish (no redesign)

Owner: Opus 4.5 executor

## Goal
Make the chat conversation list feel clean and stable on mobile (390×844) while preserving existing structure/features (search + bottom filter tabs + list items).

This is a **polish + bugfix** task, not a redesign: keep the same information architecture and components, but tighten spacing, hierarchy, touch targets, and remove "broken"/off-token visuals.

## Constraints (non‑negotiable)
- No redesigns/new IA: keep search, filters, list.
- No gradients. No arbitrary Tailwind values.
- Use existing semantic tokens/classes from `app/globals.css`.
- All user-facing strings via `next-intl` (no hardcoded EN/BG fallbacks in components).
- Small batches (1–3 files ideally; max 5 if i18n keys needed).

## Primary surfaces
- `/{locale}/chat` conversation list on mobile (390×844)
- Also verify desktop sidebar view (>= lg)

## Known issues to fix
1) Visual hierarchy + density
- Current list item spacing feels inconsistent / too loose.
- Time, unread badge, and last message preview don’t read cleanly.

2) i18n / hardcoded strings
- Remove `t(...) || "..."` fallbacks.
- Remove hardcoded `Re:` label.
- Replace custom time abbreviations (`h/d/w`, BG variants) with i18n-backed short labels or a locale-aware formatter.

3) Avatar robustness
- Ensure chat list avatars always pass through `safeAvatarSrc()`.

## Candidate files
- `app/[locale]/(chat)/_components/conversation-list.tsx`
- `messages/en.json` and `messages/bg.json` (Messages namespace)

## Implementation steps
1) Audit the current conversation list item UI
- Ensure list item uses token spacing (`gap-2/3`, `px-3/4`, `py-2.5/3`) and flat visuals.
- Ensure rows align and truncation works (names/product title/last message).

2) Fix i18n and remove hardcoding
- Add missing `Messages.*` keys for:
  - empty state search results
  - empty state hints
  - product reply prefix (instead of hardcoded `Re:`)
  - short time units if still needed
- Remove `|| "No results found"` style fallbacks.

3) Ensure avatar and image behavior is correct
- Continue to render initials when no safe avatar URL.

## Done when
- Mobile conversation list looks consistent with the rest of the app (flat, tokenized spacing, readable hierarchy).
- No hardcoded English/Bulgarian strings remain in the chat list.
- Time label is readable and localized.
- Typecheck passes.
- E2E smoke passes.

## Verification gates
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
