# AGENT 1: Frontend (Opus 4.5)

> Terminal 1 — UI/UX Production Sprint

## Quick Start Prompt
```
Read these files in order, then execute the tasks:
1. agents.md (repo rules)
2. docs/GPTVSOPUSFINAL.md (workflow)
3. docs/frontend_tasks.md (queue)
4. TASK-fix-chat-mobile-scroll-and-avatars.md (active task)

Execute P0 tasks. Run gates after each change. No redesigns.
```

---

## Mission
Ship frontend fixes that unblock production launch. Focus on:
1. Chat mobile scroll + avatars (P0 blocker)
2. UI consistency (token alignment, no gradients)
3. i18n completeness (all strings via next-intl)

## Context Files to Read
- `agents.md` — non-negotiable rails
- `docs/DESIGN.md` — styling rules (no gradients, flat cards, dense spacing)
- `docs/GPTVSOPUSFINAL.md` — workflow + handoff format
- `docs/frontend_tasks.md` — current P0 queue
- `TASK-fix-chat-mobile-scroll-and-avatars.md` — active work

## P0 Execution Queue

### Task 1: Chat Mobile Scroll + Avatars
**Files:** `app/[locale]/(chat)/_components/messages-page-client.tsx`, `app/[locale]/(chat)/_components/conversation-list.tsx`, potentially `lib/utils/avatar.ts`

**Done when:**
- Mobile viewport (390×844): header/tabs fixed, only content scrolls
- No broken avatar images for `boring-avatar:` pseudo URLs
- Gates pass

### Task 2: Chat i18n Sweep
**Files:** `app/[locale]/(chat)/_components/*.tsx`, `messages/en.json`, `messages/bg.json`

**Done when:**
- All hardcoded strings replaced with `t()` calls
- Time abbreviations (h/d/w) use translated equivalents
- Both `/en` and `/bg` render correctly

### Task 3: Product Page i18n Gaps (if time)
**Surface:** `/en/[username]/[productSlug]`

**Done when:**
- "Key Details", "Description", "Shipping & Returns" etc use i18n keys
- Price/VAT spacing cleaned up
- Both locales verified

## Gates (run after EVERY change)
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Rules (from agents.md)
- 1-3 files per change (max 5 if one behavior)
- No gradients, no arbitrary Tailwind values
- No redesigns — preserve layout intent
- All strings via next-intl (en.json + bg.json)
- No secrets in logs

## Handoff Format
After each task, update the TASK file with:
```markdown
## Handoff (Opus)
Files changed:
- `path/file.tsx` — what changed

How to verify:
- Step to manually verify the fix

Gates output:
✓ tsc: 0 errors
✓ e2e:smoke: 15/15 passed

Questions:
- Any blockers or follow-ups
```

## Scan Reports Reference
- `cleanup/palette-scan-report.txt` — gradient/palette drift
- `cleanup/arbitrary-scan-report.txt` — arbitrary values to remove

## MCP Tools Available (if in Claude Code)
- Playwright MCP for visual verification
- Context7 for Tailwind v4 / shadcn docs
- shadcn MCP for component registry checks

---

## Copy-Paste Start Command
```
I'm the Frontend agent. Reading:
- agents.md
- docs/GPTVSOPUSFINAL.md
- docs/frontend_tasks.md
- TASK-fix-chat-mobile-scroll-and-avatars.md

Starting with Task 1: Chat mobile scroll containment + avatar safety.
```
