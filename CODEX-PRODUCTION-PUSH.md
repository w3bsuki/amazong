# Codex Production Push — Master Execution Plan

> Created: 2026-02-15
> Goal: Get Treido to production-ready state by cleaning the codebase, fixing docs, and closing the final 10% gap.

## Context

Treido is a Next.js 16 / React 19 / Tailwind CSS v4 / shadcn/ui / Supabase marketplace at 87% feature completion.
The code quality is solid (0 `as any`, clean style gates, good architecture). What's blocking production is doc/process bloat and ~15 concrete gaps.

## Verification Commands (Run After Every Batch)

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Risk-based:
```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

## High-Risk Pause (STOP and ask human)

- DB schema / migrations / RLS changes
- Auth / session / access control changes
- Payments / webhooks / billing changes

---

## WORKSTREAM 1: Codebase Cleanup & Dead Weight Removal (Low-Risk)

**Goal:** Remove unused code, dead deps, stale artifacts, and reduce surface area.

### Tasks (execute in order):

#### 1.1 Delete dead artifacts
```
DELETE cleanup/                           # All 6 reports show 0 findings — gate is clean
DELETE COMPONENTS_AUDIT.md                # Stale root audit file
DELETE docs/archive/                      # Pre-cutover legacy docs (132+ old files). Keep docs/ current files only.
DELETE context/business/                  # Flagged for Google Drive migration since DEC-007. Not implementation SSOT.
DELETE production-audit/TEMPLATE.md       # Template consumed; phases use it already
DELETE production-audit/01-shell-navigation.md through 18-cross-cutting.md  # Historical audit-only docs, findings absorbed into launch-hardening/
```

#### 1.2 Remove Capacitor (out of scope)
```
DELETE capacitor.config.ts
REMOVE from package.json: @capacitor/android, @capacitor/core, @capacitor/ios, @capacitor/cli
REMOVE from package.json scripts: cap:build, cap:android, cap:ios, cap:sync
Run: pnpm install
```

#### 1.3 Remove duplicate icon libraries
The project uses `lucide-react` as canonical (per ARCHITECTURE.md).
```
AUDIT: grep for @phosphor-icons/react and @tabler/icons-react usage in app/ components/ lib/
IF usage exists: migrate to lucide-react equivalents
THEN remove from package.json: @phosphor-icons/react, @tabler/icons-react
Run: pnpm install
```

#### 1.4 Run knip to find unused exports/files
```bash
pnpm -s knip
```
Fix all findings. Then:
```bash
pnpm -s dupes
```
Fix any meaningful duplications (>10 lines).

#### 1.5 Clean up package.json scripts
Remove scripts for deleted features:
- `docs:sync`, `docs:site:sync`, `docs:site:check` (if docs-site is not shipping)
- `seed:admin-docs`, `export:admin-docs` (if not in production scope)
- `ux:screenshot` (audit tool, not production)
- Storybook-related scripts if storybook is not shipping

#### 1.6 Verify everything still works
```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
```

---

## WORKSTREAM 2: Docs Consolidation (Low-Risk)

**Goal:** Flatten 132 doc files into ~15 essential files. Make docs Codex-friendly (scannable, non-redundant, action-oriented).

### The problem:
- 12 golden principles + 12 architectural decisions + workflow + QA + risk + quality grades = same rules repeated 3-4 times
- Feature docs (10 files) mostly point back to REQUIREMENTS.md
- Domain docs (6 files) are useful but could be appendices to ARCHITECTURE.md
- An agent burns 30K+ tokens reading meta-docs before writing code

### Target state (15 files max in docs/):

```
docs/
  INDEX.md           # 20 lines max — just links
  PROJECT.md         # Keep as-is (already lean)
  ARCHITECTURE.md    # Merge domain docs (AUTH, PAYMENTS, DATABASE, API, ROUTES, I18N) as sections
  DESIGN.md          # Merge DESIGN.md + FRONTEND.md into one file
  QA.md              # Keep as-is (already lean)
  RISK.md            # Keep as-is (already lean)
  generated/
    db-schema.md     # Keep (auto-generated)
```

### What to merge/delete:

| Current File | Action |
|---|---|
| `docs/PRINCIPLES.md` | Merge into AGENTS.md as a "Key Rules" appendix (5-line summaries, not 12 sections) |
| `docs/DECISIONS.md` | Archive or delete. Decisions are already implemented in code. |
| `docs/QUALITY.md` | Delete. Quality is measured by running gates, not reading grades. |
| `docs/WORKFLOW.md` | Merge the 4-line task loop into AGENTS.md. Delete file. |
| `docs/REFERENCE.md` | Delete. It's just links to other files. INDEX.md does this. |
| `docs/domain/AUTH.md` | Merge essentials into ARCHITECTURE.md §Auth |
| `docs/domain/PAYMENTS.md` | Merge essentials into ARCHITECTURE.md §Payments |
| `docs/domain/DATABASE.md` | Merge essentials into ARCHITECTURE.md §Database |
| `docs/domain/API.md` | Merge essentials into ARCHITECTURE.md §API |
| `docs/domain/ROUTES.md` | Merge essentials into ARCHITECTURE.md §Routes |
| `docs/domain/I18N.md` | Merge essentials into ARCHITECTURE.md §I18N |
| `docs/features/*.md` (10 files) | Delete. Feature specs are in REQUIREMENTS.md. Code is truth. |
| `docs/ui/DESIGN.md` + `docs/ui/FRONTEND.md` | Merge into single `docs/DESIGN.md` |
| `docs/public/` | Keep only if shipping help/legal pages |
| `docs/archive/` | Already deleted in Workstream 1 |

### Rewrite AGENTS.md to be self-contained (~100 lines):

```markdown
# AGENTS.md — Treido

## Stack
Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase, Stripe, next-intl

## Key Rules (non-negotiable)
1. Parse at boundary (Zod), trust typed data inside
2. Code is runtime truth (not docs)
3. Semantic tokens only (no palette classes, no hex, no oklch in components)
4. getUser() not getSession() for auth checks
5. No select('*') in hot paths
6. Correct Supabase client per context (server/static/route-handler/admin/browser)
7. Route-private code (_components/) stays private
8. Webhooks verify signature before writing
9. Server Components by default
10. High-risk domains (DB/auth/payments): stop and ask human

## Verification (every change)
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate

## Risk-based verification
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

## Deeper context (load only when needed)
- Architecture: ARCHITECTURE.md
- Requirements: REQUIREMENTS.md
- Active tasks: TASKS.md
- Design system: docs/DESIGN.md
- QA gates: docs/QA.md
- Risk policy: docs/RISK.md
- DB schema: docs/generated/db-schema.md
```

### Consolidate task tracking:
- Move all active tasks from `production-audit/launch-hardening-2026-02-15/TASKS.md` into root `TASKS.md`
- Delete launch-hardening subfolder (or keep as read-only archive)
- Root TASKS.md: purge all completed items to a `## Completed Archive` collapsed section
- One board, one issue ID system

---

## WORKSTREAM 3: Production Gap Closure (Mixed Risk)

**Goal:** Close the 15 launch gaps identified in the gap audit.

### Phase A: Low-Risk Frontend Fixes (can run in parallel with Workstreams 1+2)

| Task | Files | Verification |
|---|---|---|
| Fix AUTH-001: auth state sync after login (stale UI) | `components/providers/auth-state-manager.tsx`, header/tab-bar consumers | typecheck + lint + e2e:smoke |
| Fix SELL-001: sell form stuck on review step | `app/[locale]/(sell)/_components/sell-form-*.tsx` | typecheck + lint + styles:gate |
| Fix CAT-001: product cards show L4 instead of L0 category | Already fixed P2-01 — verify with e2e | e2e:smoke |
| Fix LG-012: DesktopShell muted variant alignment | Already fixed P2-00 — verify | styles:gate |
| Fix HYDRA-002: useIsMobile SSR flash | `hooks/use-is-mobile.ts` or related | typecheck + lint |
| Accessibility sweep: ARIA labels on icon-only buttons | `components/ui/`, `components/shared/`, `components/mobile/` | lint + styles:gate |
| Shell/canvas consistency: normalize PageShell/DesktopShell tokens | layout components | styles:gate |

### Phase B: Low-Risk Backend Fixes

| Task | Files | Verification |
|---|---|---|
| R4.5: Buyer cancel order (pre-shipment only) | `app/actions/orders.ts`, checkout action | typecheck + lint + test:unit |
| LG-008: Notification surface completion | `app/[locale]/(account)/.../notifications/`, `hooks/use-notification-count.ts` | typecheck + lint |
| LAUNCH-007: Product data sanity audit | DB query + document findings | manual |

### Phase C: High-Risk (REQUIRES HUMAN APPROVAL BEFORE EACH)

| Task | Risk Domain | What |
|---|---|---|
| LAUNCH-001: Webhook idempotency replay test | Payments | Manual Stripe replay + document evidence |
| LAUNCH-002: Refund/dispute E2E validation | Payments | Test full flow + document |
| LAUNCH-003: Stripe env separation | Payments | Verify env vars + document |
| LAUNCH-004: Leaked password protection | Auth/Security | Enable in Supabase + re-run advisor |
| R5.5: Seller refund process | Payments | Order state machine + admin assist |
| LG-009/010/011: Admin moderation completion | Auth/Admin | Role gating + moderation UI |

---

## Execution Order for Codex

1. **Workstream 1** (cleanup) — run first, takes ~1 session
2. **Workstream 2** (docs) — run second, takes ~1 session  
3. **Workstream 3 Phase A** (frontend fixes) — can start during Workstream 2
4. **Workstream 3 Phase B** (backend fixes) — after Workstream 1 cleanup
5. **Workstream 3 Phase C** (high-risk) — last, requires human in the loop

## Success Criteria

- [ ] `pnpm -s typecheck` passes
- [ ] `pnpm -s lint` passes
- [ ] `pnpm -s styles:gate` passes (0 violations)
- [ ] `pnpm -s test:unit` passes (all 45+ tests)
- [ ] `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` passes
- [ ] `pnpm -s knip` clean (no unused exports)
- [ ] Docs: ≤15 files in docs/ (excluding generated/)
- [ ] No `as any`, `@ts-ignore`, or `@ts-nocheck` in production code
- [ ] All LAUNCH-001..004 evidence documented
- [ ] Root TASKS.md is the single active task board
