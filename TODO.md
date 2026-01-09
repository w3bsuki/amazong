# TODO

> **Workflow**: See `docs/PRODUCTION-WORKFLOW-GUIDE.md` (comprehensive) or `docs/GPTVSOPUSFINAL.md` (agent roles)
> 
> **Prefixes**: `TREIDO:` (general dev), `TAILWIND:` (UI audit), `SUPABASE:` (DB audit)

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

### Phase 2: Treido UI/UX Refactor 🚀 IN PROGRESS
> **Plan:** See `TREIDO-UI-REFACTOR-PLAN.md` (comprehensive implementation guide)
> **Reference:** `inspiration/treido-mock/` (latest clone from GitHub)

- [x] **Week 1: Foundation** ✅ COMPLETE
  - [x] Update `globals.css` with Treido tokens (radius 6px, 48px rhythm, no shadows)
  - [x] Override shadcn Button (active:opacity-90, h-10, rounded-md, zinc-900 default)
  - [x] Override shadcn Input (bg-zinc-50, h-11, text-[16px], focus:border-zinc-900)
  - [x] Override shadcn Card (shadow-none, border-zinc-200)
  - [x] Update `DoubleDeckNav` component (Treido styling)
  - [x] Add Treido utility classes (min-touch, tap-highlight-transparent)

- [x] **Week 2: Category Navigation** ✅ COMPLETE
  - [x] Refactor contextual-category-header to 48px standard
  - [x] Update inline filter bar (Treido dense styling)
  - [x] Update mobile-bottom-nav (48px, 5-grid, center sell button)

- [ ] **Week 3: Product Display**
  - [ ] Refactor ProductCard to Treido spec (dense, rounded-sm images, tags)
  - [ ] Update product grids to `gap-2`
  - [ ] Test transitions

- [ ] **Week 4: Navigation & Polish**
  - [ ] Update homepage category section (gender tabs, department circles)
  - [ ] Create Treido-style filter sheet (bottom slide, rounded-t-xl)
  - [ ] Full E2E testing

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
- [x] **Treido UI/UX Week 1 & 2 COMPLETE** — Foundation + Category Navigation
  - Updated `globals.css` with Treido tokens (48px rhythm, flat shadows, tight radius)
  - Updated `button.tsx` (zinc-900 default, active:opacity-90, h-10)
  - Updated `input.tsx` (bg-zinc-50, h-11, focus:border-zinc-900)
  - Updated `card.tsx` (border-zinc-200, shadow-none)
  - Updated `mobile-tab-bar.tsx` (48px, 5-grid, center black sell button)
  - Updated `contextual-category-header.tsx` (48px, Treido styling)
  - Updated `contextual-double-decker-nav.tsx` (zinc colors, animation)
  - Updated `inline-filter-bar.tsx` (dense Treido style)
