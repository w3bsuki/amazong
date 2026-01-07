# TODO

> **Workflow**: See `docs/GPTVSOPUSFINAL.md` (current) and `WORKFLOW.md` (quick gates)

## Gates (run after changes)
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## UI/UX Sprint — Design System Refactor

See `AGENT-ORCHESTRATION.md` for full execution plan.

### Phase 0: Foundation ✅ COMPLETE
- [x] **AGENT-0**: Token inventory audit — All tokens verified in `app/globals.css`
- [x] **AGENT-0**: Dark mode parity check — ~95% coverage, no critical gaps
- [x] **AGENT-0**: Gradient baseline — **13 violations** (see `cleanup/DESIGN-SYSTEM-STATUS.md`)
- [x] **AGENT-0**: Arbitrary values baseline — **189 violations** (97 files)
- [x] **AGENT-0**: Created reference sheets for parallel agents

### Phase 1: Parallel Execution (Ready to Launch)
- [ ] **AGENT-1**: Typography audit (font sizes/weights/line-heights)
- [ ] **AGENT-2**: Spacing & layout audit (gaps/padding/containers/touch targets)
- [ ] **AGENT-3**: Colors & theming audit (**13 gradients**, shadows, dark mode, border radius)

### Targets
| Metric | Current | Target |
|--------|---------|--------|
| Gradient violations | 13 | 0 |
| Arbitrary values | 189 | < 20 |
| Palette violations | 0 | 0 |

## Open (Other)

- [ ] E2E: auto-pick free port (`playwright.config.ts`)
- [ ] Tooling: reduce Tailwind palette/gradient scan false positives (`scripts/scan-tailwind-palette.mjs`)
- [ ] Chat: fix mobile scroll containment + broken avatars (see `TASK-fix-chat-mobile-scroll-and-avatars.md`)
- [ ] Supabase: resolve Security advisor warning (leaked password protection) — dashboard-only (see `TASK-enable-leaked-password-protection.md`)
- [ ] Supabase: review Performance advisors (unused indexes) and decide keep/drop (requires DB query review before any DDL)

## Blocked on Human

_(none)_

## Done Today

- [x] **AGENT-0 Design System Audit COMPLETE** — Created `cleanup/DESIGN-SYSTEM-STATUS.md` baseline
- [x] Cache Components: verify `'use cache'` + `cacheLife()` pairing — All 17 usages in `lib/data/` verified correct
- [x] Created `docs/OPUSvsGPT.md` — v3 workflow for Codex (architect/reviewer) + Opus (executor with MCPs)
