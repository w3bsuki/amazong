# TASK: Fix /chat mobile scroll + broken avatars

Owner: Opus 4.5 executor

## Goal
Make `/chat` usable on mobile:
- Scrolling should only happen inside the conversation list or the messages area.
- Header and bottom tabs must remain visually stable.
- Avatars must not render as broken images (especially for `boring-avatar:` pseudo URLs).

## Context / Evidence
- `public.profiles.avatar_url` includes non-HTTP pseudo URLs like `boring-avatar:...` (must not be fetched by the browser).
- Chat UI currently derives `avatarUrl` and renders with `next/image` without filtering, which can trigger broken images.
- Mobile scroll instability typically comes from nested flex containers missing `min-h-0` / improper overflow ownership.

## Constraints (non-negotiable)
- No redesigns, no new pages.
- No arbitrary Tailwind values; use existing tokens.
- No new architectural layers.
- Keep changes small (1–3 files per slice where possible).
- All user-facing strings via `next-intl` (no hardcoded EN/BG in components).

## Implementation checklist
### 1) Mobile scroll containment
- Ensure the chat layout root is a full-height flex container (`h-dvh`) and all nested flex columns use `min-h-0`.
- Ensure only the intended pane has `overflow-y-auto` and all ancestor containers use `overflow-hidden` as needed.
- Verify:
  - Conversation list header stays fixed.
  - Bottom filter tabs stay fixed.
  - Messages header + composer stay fixed while messages scroll.

### 2) Avatar safety
- Use `safeAvatarSrc()` everywhere we render user avatars in chat.
- Ensure pseudo URLs like `boring-avatar:` do not get passed into image components.
- Confirm Dicebear avatar URLs still render.

### 3) Remove chat hardcoding (separate small slice)
- Replace hardcoded toast strings and any fallback strings with `next-intl` keys.
- Replace custom time abbreviations (e.g. `h/d/w`) with translated equivalents.

### 4) Realtime + pagination (separate follow-up slice)
- Implement message pagination (initial page + "load older"), then layer realtime updates on top.
- Avoid refetching full history on every realtime event.
- Ensure pagination state is resilient on mobile navigation (back/forward).

## Acceptance criteria
- On mobile viewport (e.g. 390×844), scrolling does not move the chat header or bottom tabs.
- Chat avatars never show broken image icons for profiles with `boring-avatar:`.
- Typecheck passes.
- E2E smoke passes.

## Gates
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
