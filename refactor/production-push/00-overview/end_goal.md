# 00 — Overview: End Goal

> What "done" looks like after the full production push refactor.

---

## Target Metrics

| Metric | Current | Target | Delta |
|--------|---------|--------|-------|
| Source files | 1,139 | <1,050 | -8% (dead code removal) |
| Unsafe casts | 46 | <5 (audited adapter layer only) | -89% |
| Console.* in prod | 111 | 0 (all through logger) | -100% |
| `pb-20` hacks | 14 | 0 (all use `pb-tabbar-safe`) | -100% |
| Non-Envelope actions | 29/40 | 0/40 (100% Envelope) | -100% |
| Root clutter files | ~16 | 0 (moved or gitignored) | -100% |
| Duplicate clones | 89 clusters | <40 clusters | -55% |
| `generateStaticParams` dupes | 11 identical | 1 shared helper | -91% |
| Migration fallbacks | 8+ paths | 0 (post MIG-001) | -100% |
| Tailwind collisions | 6 | 0 | -100% |
| CSS files | 1 monolith (1,090 lines) | 5+ modular files | organized |
| Global JS bundle | bloated by MotionProvider | motion loaded on-demand | smaller |

---

## Architecture End State

### File Organization
- `/app` = composition only (layouts, pages, route-private components)
- `/components/ui` = pure shadcn primitives (no domain logic, no app imports)
- `/components/shared` = cross-route composites (product cards, fields, drawers)
- `/components/layout` = app shells (header, sidebar, bottom nav, footer)
- `/components/providers` = client state contexts (lean, no direct DB calls)
- `/lib` = domain logic, typed queries, utilities, validation
- `/hooks` = client hooks (no duplicate logic)

### Data Flow Standard
```
User Action → Zod parse → requireAuth() → lib/domain.ts → revalidateTag() → Envelope<T>
```

### Styling Architecture
```
app/styles/tokens.css       → OKLCH design tokens (light + dark)
app/styles/theme-bridge.css → @theme inline mappings for Tailwind
app/styles/base.css         → Global resets, focus styles, body
app/styles/overrides.css    → Component-specific CSS overrides
app/globals.css             → @import orchestrator only
```

### Mobile Chrome
- Layout provides `pb-tabbar-safe` — pages never handle bottom spacing
- Tab bar derives state from `AuthStateManager` — no duplicate queries
- All touch targets ≥44px
- No overflow on 375px viewport

### Logging
- `lib/logger.ts` wraps all production logging
- Structured, redacted, environment-aware
- Zero `console.*` in production code outside logger

### Type Safety
- `Envelope<TSuccess, TError>` for all server action returns
- Typed Supabase query helpers eliminate row-level casting
- `as unknown as` only in audited adapter files (max 5)
- `allowJs: false` in tsconfig

---

## Quality Gates (Must All Pass)

```bash
pnpm -s typecheck        # Zero errors
pnpm -s lint             # Zero warnings
pnpm -s styles:gate      # Semantic tokens only
pnpm -s test:unit        # 455+ tests passing
pnpm -s architecture:gate # Boundary invariants
pnpm -s knip             # Zero unused exports/files
```

---

## Phase Completion Criteria

### After REF-CLEANUP
- [ ] Knip reports 0 unused files/exports
- [ ] Root directory clean (no audit artifacts)
- [ ] Logger replaces all console.* in safe zones
- [ ] `allowJs: false`
- [ ] Unsafe casts reduced by 50%+
- [ ] All gates green

### After REF-ALIGNMENT
- [ ] globals.css split into modular imports
- [ ] 100% of server actions use Envelope
- [ ] Cross-route chrome in components/layout
- [ ] Mobile spacing uses tokens only (zero pb-20)
- [ ] Typed Supabase helpers in use
- [ ] shadcn primitives are domain-free

### After REF-POLISH
- [ ] MotionProvider removed globally
- [ ] All routes have loading/error states
- [ ] Metadata on every page
- [ ] Bundle reduced (measured with analyzer)
- [ ] Mobile UX sweep complete for all route groups
- [ ] E2E smoke green
- [ ] State docs updated

---

*Target date: Phase completion within 2-3 weeks of execution start*
