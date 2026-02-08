# MASTER.md — Documentation Architecture Blueprint

> **Purpose:** This file defines the complete spec-driven documentation structure Treido will migrate to.
> It is the SSOT for what files exist, where they live, what they contain, and how AI/humans navigate them.
>
> **Status:** Blueprint (Phase 1). Files listed below will be created in subsequent phases.
>
> **Created:** 2026-02-08

---

## Why This Exists

The current `docs/` has **~95 files** across 30 root docs (14 of which are 7-line redirect stubs), 65 subdirectory files, plus 16 `codex/` playbook files. Problems:

1. **No actionable requirements list.** Feature progress is buried in `FEATURES.md` (87% of 119 items) with no "execute requirement X" workflow.
2. **No production readiness tracker.** Three overlapping launch/production docs (`LAUNCH.md`, `PRODUCTION-PUSH.md`, `status/LAUNCH-READINESS.yaml`) — none gives a clear "what's shipped" signal.
3. **5× duplication** of app-feel/UI-UX patterns across `APP-FEEL-GUIDE.md`, `APP-FEEL-COMPONENTS.md`, `APP-FEEL-CHECKLIST.md`, `14-UI-UX-PLAN.md`, and `DESIGN.md` §8.5.
4. **3× launch overlap** across `LAUNCH.md`, `PRODUCTION-PUSH.md`, and `business/ops/launch-plan.mdx`.
5. **Stale artifacts** — `PROJECT-CLEANUP-MASTER-PLAN.md` (superseded by codex), `refactor.md` (points to deleted `.codex/`), empty `guides/ios-marketplace-ui-pack/`.
6. **3-hop AI navigation** — root `AGENTS.md` → `docs/AGENTS.md` → `WORKFLOW.md` → gates. No direct pointers.
7. **14 numbered stub files** (`00-INDEX.md` through `15-DEV-DEPARTMENT.md`) that are pure 7-line redirects to their adjacent canonical files.

### Goal

Replace this with a clean spec-driven structure:
- **5 root workflow files** AI reads immediately
- **~11 core reference docs** in `docs/`
- **8-10 feature specs** in `docs/features/`
- **Existing business/ and public/ subdirs** preserved (they're well-organized)
- **Total: ~60 authored files** down from ~110+

---

## Structure Overview

```
ROOT (5 files — AI entry points, read first)
├── AGENTS.md              AI execution contract + context loading map
├── TASKS.md               Active work queue (existing, keep as-is)
├── REQUIREMENTS.md        NEW — actionable requirement IDs (R1.1, R2.3, etc.)
├── DESIGN.md              Design system SSOT (promoted from docs/)
└── README.md              Project quickstart (existing, keep as-is)

docs/ (core reference — 11 files)
├── PRD.md                 Full product vision, business model, personas (~850 lines)
├── ARCHITECTURE.md        Directory structure, data flow, import rules, component patterns
├── DATABASE.md            60+ tables, RLS, functions, triggers, key queries
├── API.md                 Server actions + API endpoints, schemas, auth, webhooks
├── AUTH.md                Auth flows, protected routes, roles, security
├── PAYMENTS.md            Stripe integration consolidated (fees, Connect, webhooks, escrow)
├── I18N.md                97 namespaces, ICU syntax, provider chain, test coverage
├── ROUTES.md              77 routes, 40 API endpoints, auth levels, special patterns
├── PRODUCTION.md          NEW — production readiness tracker (✅/🟡/⬜ per area)
├── TESTING.md             NEW — testing strategy, commands, coverage, QA plan
└── WORKFLOW.md            Dev shipping loop + prompt formatting (fold in PROMPT-GUIDE)

docs/features/ (8-10 per-feature specs)
├── selling.md             Sell form, listing management, image upload, seller dashboard
├── buying.md              Browse, search, purchase flow, order tracking, cart, checkout
├── chat.md                Real-time messaging, conversations, attachments, blocking
├── monetization.md        Commission rates, fees, boosts, revenue model, pricing tiers
├── plans.md               Platform subscription tiers (personal, business, enterprise)
├── trust-safety.md        Reputation, badges, ratings, moderation, KYC, disputes
├── search-discovery.md    Categories, filters, search, recommendations, saved searches
├── app-feel.md            Mobile-first UX patterns, bottom nav, drawers, gestures, tap states
└── onboarding.md          Signup → first listing/purchase flow, seller/buyer paths

docs/business/ (~30 files — keep existing structure)
├── 00-INDEX.md
├── boosts.mdx, competitors.mdx, guardrails.mdx, index.mdx
├── monetization.mdx, pricing.mdx, roadmap.mdx
├── decisions/             ADRs (category navigation, monetization v1)
├── investors/             Fundraising, one-pager, unit economics, KPIs, risk register
├── ops/                   Incident response, moderation, support, launch plan, audit
├── product/               Product specs, UX
└── specs/                 Feature PRDs (8 mini-PRD specs)

docs/public/ (~22 files — keep existing, production content)
├── legal/                 Terms, privacy, cookies (EN + BG)
├── help/                  Buyer protection, disputes, shipping, account security (EN + BG)
└── policies/              KYC, prohibited items, returns, jurisdictions (EN + BG)

docs/guides/ (4 files — dev how-tos)
├── backend.md
├── frontend.md
├── deployment.md
└── testing.md

docs/runbooks/ (keep existing)
└── PROD-DATA-002-junk-listings.md

docs/archive/ (historical reference only)
└── codex/                 Completed refactor playbooks (all 7 phases done, -6185 LOC)
    ├── master-refactor-plan.md
    ├── dead-code.md, i18n.md, nextjs.md, scripts.md, shadcn.md, supabase.md
    ├── tailwindv4.md, typescript.md
    └── phases/            phase-00 through phase-06 execution logs
```

---

## File Specifications

### Root Files

#### `AGENTS.md` (rewrite)

The enhanced AI contract. Single entry point that tells any AI agent exactly where to find every category of context. No more hop chains.

```markdown
# AGENTS.md — AI Execution Contract

## Context Loading (read these for full project understanding)
- What to build         → REQUIREMENTS.md (root) — actionable requirement IDs
- What's active now     → TASKS.md (root) — current sprint/work queue
- Design system         → DESIGN.md (root) — tokens, spacing, typography, components
- Production status     → docs/PRODUCTION.md — what's shipped, what's blocked
- Feature deep-dives    → docs/features/{area}.md — per-feature specs
- Architecture          → docs/ARCHITECTURE.md — code patterns, directory structure
- Database schema       → docs/DATABASE.md — tables, RLS, functions
- API reference         → docs/API.md — endpoints, server actions
- Auth                  → docs/AUTH.md — flows, roles, security
- Payments              → docs/PAYMENTS.md — Stripe, escrow, webhooks
- Internationalization  → docs/I18N.md — locales, namespaces, ICU
- Routes                → docs/ROUTES.md — all routes, auth levels

## Execution Rules
- Default mode: implement directly (no permission loops)
- Verify after every change: pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
- Risk-based (business logic): pnpm -s test:unit && pnpm -s test:e2e:smoke
- PAUSE for alignment: DB schema/RLS, auth, payments, destructive data ops

## Coding Conventions
[condensed from existing AGENTS.md — structure, style, testing, commits]
```

#### `REQUIREMENTS.md` (new)

Actionable feature requirements extracted from PRD.md and FEATURES.md. Each requirement has an ID so you can say "execute R2.3 from REQUIREMENTS.md." Status synced from actual implementation state.

```markdown
# REQUIREMENTS.md — Feature Requirements Checklist

Progress: 103/119 features (~87%) | 18 categories

## R1: Authentication & Accounts (8/8) ✅
- [x] R1.1: Email signup with verification
- [x] R1.2: Email login with session management
- [x] R1.3: Email confirmation flow
- [x] R1.4: OAuth (Google) callback
- [x] R1.5: Password reset flow
- [x] R1.6: Session persistence (cookie-based)
- [x] R1.7: Post-signup onboarding wizard
- [x] R1.8: Protected route gating (middleware)
→ Deep dive: docs/AUTH.md | docs/features/onboarding.md

## R2: Selling & Listings (7/8)
- [x] R2.1: Auth-gated sell entry (/sell)
- [x] R2.2: Multi-step listing wizard (title, desc, category, attributes, images, price)
- [x] R2.3: Image upload (multi-image, drag-reorder, compression)
- [x] R2.4: Category + attribute selection
- [x] R2.5: Draft → publish flow
- [x] R2.6: Edit listing
- [x] R2.7: Delete / unpublish listing
- [ ] R2.8: Listing analytics (business tier only)
→ Deep dive: docs/features/selling.md

## R3: Cart & Checkout (8/8) ✅
...

## R4: Orders — Buyer (5/6)
...
```

Each section ends with `→ Deep dive:` pointers to the relevant docs.

#### `DESIGN.md` (promoted from docs/DESIGN.md)

The existing `docs/DESIGN.md` (~450 lines) is excellent. Promote to root, consolidate the APP-FEEL §8.5 content that currently lives there (already present), and ensure `docs/features/app-feel.md` cross-references it for implementation details.

No structural changes needed — just move to root and ensure it's the single authority for tokens, spacing, typography, colors, component patterns.

#### `TASKS.md` (keep as-is)

Already well-structured active work queue with gates. No changes needed.

#### `README.md` (keep as-is)

Minimal quickstart. No changes needed.

---

### Core Reference Docs (docs/)

#### `docs/PRD.md` (keep as-is)

Excellent ~850-line document. Full vision, personas, business model with fee formulas and worked examples, 12 feature sections, NFRs, launch criteria, success metrics, risk analysis, roadmap, ops/compliance, tech stack, glossary. This is the monolithic "what is Treido" document. No changes needed.

#### `docs/ARCHITECTURE.md` (keep, fold in DEV-DEPARTMENT.md)

~350 lines covering directory structure, route groups, lib modules, Supabase clients, data flow, caching, import rules, component patterns. Fold in `DEV-DEPARTMENT.md` (~50 lines, ownership domains) as a new section.

#### `docs/DATABASE.md` (keep as-is)

~400+ lines. 60+ tables, RLS policies, functions/triggers, cron jobs, key queries. No changes.

#### `docs/API.md` (keep as-is)

~400+ lines. Server actions and API endpoints reference. No changes.

#### `docs/AUTH.md` (keep as-is)

~300 lines. Auth flows, protected routes, roles, DB integration. No changes.

#### `docs/PAYMENTS.md` (consolidate)

Merge the top-level `PAYMENTS.md` (~500 lines) with `docs/payments/` subdirectory (6 files: escrow lifecycle, Stripe Connect, webhooks, refunds/disputes, ops runbook). The top-level file becomes the single authority; delete the subdirectory.

#### `docs/I18N.md` (keep as-is)

~350 lines. 97 namespaces, usage patterns, ICU syntax. No changes.

#### `docs/ROUTES.md` (keep as-is)

~400+ lines. 77 routes, 40 API endpoints. No changes.

#### `docs/PRODUCTION.md` (new — replaces LAUNCH.md + PRODUCTION-PUSH.md + status/)

Production readiness tracker. Clear, scannable status for every feature area.

```markdown
# PRODUCTION.md — Production Readiness Tracker

Last verified: YYYY-MM-DD

## Feature Readiness

| Area                | Status    | Blockers / Notes                          |
|---------------------|-----------|-------------------------------------------|
| Auth & Accounts     | ✅ Ready   | All 8 features complete                   |
| Cart & Checkout     | ✅ Ready   | All 8 features, webhooks idempotent       |
| Orders (Buyer)      | 🟡 Partial | Cancel pre-shipment incomplete            |
| Orders (Seller)     | 🟡 Partial | Refund processing admin-assisted          |
| Selling / Listings  | 🟡 Partial | Listing analytics missing (business tier) |
| Stripe Connect      | ✅ Ready   | All 6 features complete                   |
| Marketplace Search  | 🟡 Partial | Saved searches client-only                |
| Product Pages       | 🟡 Partial | Related items deferred to V1.1            |
| Wishlist            | 🟡 Partial | Sharing UI not exposed                    |
| Messaging           | ✅ Ready   | All 7 features complete                   |
| Reviews & Ratings   | ✅ Ready   | All 8 features complete                   |
| Profiles & Account  | 🟡 Partial | Notifications UI partial, email notif N/A |
| Trust & Safety      | 🟡 Partial | Admin moderation basic, prohibited manual |
| Business Dashboard  | 🟡 Partial | Analytics basic                           |
| Admin               | 🟡 Partial | Metrics, user mgmt, moderation WIP        |
| i18n                | ✅ Ready   | EN + BG complete                          |
| Accessibility       | 🟡 Partial | Screen reader labels, WCAG AA in progress |
| Infrastructure      | ✅ Ready   | Vercel, Supabase, Stripe, health, revalidation |

## Infrastructure Checklist

- [ ] Sentry error monitoring active with alerting
- [ ] Stripe webhooks idempotent (duplicate event test)
- [ ] RLS enabled on all user-data tables
- [ ] Support playbooks for top 10 scenarios
- [ ] LCP < 2s on core pages
- [ ] No secrets in logs (security audit)
- [ ] DNS / domain configured
- [ ] SSL certificate active
- [ ] Rate limiting on auth endpoints

## Environment

- [ ] All env vars documented in .env.local.example
- [ ] Production Supabase project configured
- [ ] Production Stripe keys set
- [ ] Vercel production deployment verified

## Post-Launch Monitoring

- [ ] Error rate dashboard
- [ ] Revenue tracking
- [ ] User signup funnel
- [ ] Support ticket SLA
```

#### `docs/TESTING.md` (new)

Consolidated testing strategy. Replaces scattered testing info across multiple files.

```markdown
# TESTING.md — Testing Strategy & QA Plan

## Quick Commands
- `pnpm -s test:unit` — Vitest unit tests (jsdom)
- `pnpm -s test:unit:coverage` — with coverage enforcement
- `pnpm -s test:e2e` — full Playwright E2E (Chromium)
- `pnpm -s test:e2e:smoke` — smoke tests only
- `pnpm -s test:a11y` — accessibility project

## Unit Tests
- Framework: Vitest + jsdom
- Setup: test/setup.ts
- Location: __tests__/*.test.ts(x)
- Coverage thresholds: lines 80%, functions 70%, branches 60%, statements 80%

## E2E Tests
- Framework: Playwright (Chromium)
- Location: e2e/*.spec.ts
- Smoke suite: e2e/smoke.spec.ts

## QA Verification Protocol
[condensed from PRODUCTION-TEST-PLAN.md — 13-phase checklist]

## Current Test Health
- Unit: 405 tests passing
- E2E Smoke: 22/23 passing
- All gates green (typecheck + lint + styles:gate)
```

#### `docs/WORKFLOW.md` (keep, fold in PROMPT-GUIDE.md)

Keep the existing shipping workflow (frame → implement → verify → report). Fold `PROMPT-GUIDE.md` (~80 lines, prompt formatting examples) as an appendix section.

---

### Feature Specs (docs/features/)

Each file follows this template:

```markdown
# {Feature Area}

## Goal
One-paragraph description of what this feature area achieves for users.

## Current Status
- Requirements: X/Y complete (see REQUIREMENTS.md §RN)
- Production: ✅ Ready | 🟡 Partial | ⬜ Not started

## Requirements Mapping
| Req ID | Description | Status |
|--------|-------------|--------|
| R2.1   | Auth-gated sell entry | ✅ |
| R2.2   | Multi-step listing wizard | ✅ |
| ...    | ...                       | ... |

## Implementation Notes
Key routes, components, actions, and DB tables involved.

## Known Gaps & V1.1+ Items
What's deferred and why.

## Cross-References
- docs/API.md §{section}
- docs/DATABASE.md §{section}
- DESIGN.md §{section}
```

#### File List

| File | Covers | Source Material |
|------|--------|----------------|
| `selling.md` | Sell form wizard, listing CRUD, image upload, seller dashboard, listing analytics | FEATURES.md §5, PRD.md §5, existing /sell routes |
| `buying.md` | Browse, add to cart, checkout, order tracking, wishlist | FEATURES.md §2-4,8-9, PRD.md §3-4 |
| `chat.md` | Conversations, real-time messaging, attachments, blocking, reporting | FEATURES.md §10, PRD.md §7 |
| `monetization.md` | Commission (9%), buyer protection (3%), boosts, pricing tiers | PRD.md §Business Model, docs/business/monetization.mdx |
| `plans.md` | Personal (free), Business ($29/mo), Enterprise (custom) tiers | PRD.md §Account Types, docs/business/pricing.mdx |
| `trust-safety.md` | Ratings, reviews, reporting, moderation, KYC, disputes, buyer protection | FEATURES.md §11,13, PRD.md §9 |
| `search-discovery.md` | Categories, subcategories, filters, sorting, saved searches, home feed | FEATURES.md §7, PRD.md §6 |
| `app-feel.md` | Bottom nav, sell drawer, sticky header, tap states, card hierarchy, gestures | APP-FEEL trilogy + 14-UI-UX-PLAN.md + DESIGN.md §8.5 (consolidates 5 files) |
| `onboarding.md` | Signup → profile setup → first listing/purchase, seller vs buyer paths | FEATURES.md §1, PRD.md §2 |

---

### Preserved Subdirectories

#### `docs/business/` — Keep as-is (~30 files)

Well-organized business documentation. Subfolders: `decisions/`, `investors/`, `ops/`, `product/`, `specs/`. No changes needed — these serve a different audience (investors, ops, business strategy) than the engineering docs.

#### `docs/public/` — Keep as-is (~22 files)

Production-ready public-facing legal/help/policy content in EN + BG. Served to users. No changes.

#### `docs/guides/` — Slim to 4 files

Keep: `backend.md`, `frontend.md`, `deployment.md`, `testing.md`
Delete: empty `ios-marketplace-ui-pack/` directory.
Rename `.mdx` → `.md` for consistency (no MDX rendering needed in guides).

#### `docs/runbooks/` — Keep as-is

One file: `PROD-DATA-002-junk-listings.md`. More runbooks will be added as needed.

#### `docs/archive/codex/` — Move from root `codex/`

All 16 files from the completed refactor. Historical reference only — all 7 phases verified complete (-6185 LOC, 405 tests, 0 knip findings). Move here to declutter root.

---

## What Gets Deleted (Phase 7)

These files will be removed when `docs/` is replaced by `docs-v2/`:

| File(s) | Reason |
|---------|--------|
| 14 numbered stubs (`00-INDEX.md` through `15-DEV-DEPARTMENT.md`) | 7-line redirect shims with no content |
| `APP-FEEL-GUIDE.md` | Consolidated into `features/app-feel.md` |
| `APP-FEEL-COMPONENTS.md` | Consolidated into `features/app-feel.md` |
| `APP-FEEL-CHECKLIST.md` | Consolidated into `features/app-feel.md` |
| `14-UI-UX-PLAN.md` | Consolidated into `features/app-feel.md` |
| `INDEX.md` | Replaced by AGENTS.md context loading map |
| `DOCS-PLAN.md` | Replaced by this MASTER.md |
| `PROMPT-GUIDE.md` | Folded into WORKFLOW.md |
| `DEV-DEPARTMENT.md` | Folded into ARCHITECTURE.md |
| `PROJECT-CLEANUP-MASTER-PLAN.md` | Stale — superseded by completed codex refactor |
| `refactor.md` | Stale — points to deleted `.codex/` directory |
| `PRODUCTION-PUSH.md` | Merged into PRODUCTION.md |
| `LAUNCH.md` | Merged into PRODUCTION.md |
| `FEATURES.md` | Replaced by root REQUIREMENTS.md |
| `docs/AGENTS.md` | Consolidated into root AGENTS.md |
| `PRODUCTION-TEST-PLAN.md` | Relevant parts → TESTING.md, rest archived |
| `docs/payments/` (6 files) | Merged into top-level PAYMENTS.md |
| `status/LAUNCH-READINESS.yaml` + schema | Replaced by PRODUCTION.md |
| `guides/ios-marketplace-ui-pack/` | Empty directory |
| `admin/00-INDEX.md` | Thin admin docs governance stub |

---

## Migration Phases

### Phase 1: Blueprint ✅ (this file)
- [x] Audit existing docs (95+ files analyzed)
- [x] Design target structure
- [x] Create `docs-v2/MASTER.md`

### Phase 2: Root Workflow Files
- [x] Create `REQUIREMENTS.md` in root — extract from PRD.md + FEATURES.md
- [x] Draft enhanced `AGENTS.md` — context loading map + execution contract
- [x] Promote `DESIGN.md` to root (copy from docs/, verify completeness)

### Phase 3: New Core Docs ✅
- [x] Create `docs-v2/PRODUCTION.md` — merge LAUNCH + PROD-PUSH + status/
- [x] Create `docs-v2/TESTING.md` — extract from PRODUCTION-TEST-PLAN + guides
- [x] Create `docs-v2/WORKFLOW.md` — fold in PROMPT-GUIDE.md

### Phase 4: Migrate Existing Reference Docs
- [x] Copy PRD.md, ARCHITECTURE.md, DATABASE.md, API.md, AUTH.md, I18N.md, ROUTES.md → docs-v2/
- [x] Fold DEV-DEPARTMENT.md into ARCHITECTURE.md
- [x] Consolidate PAYMENTS.md + payments/ subdirectory → single PAYMENTS.md

### Phase 5: Feature Specs
- [ ] Create `docs-v2/features/selling.md`
- [ ] Create `docs-v2/features/buying.md`
- [ ] Create `docs-v2/features/chat.md`
- [ ] Create `docs-v2/features/monetization.md`
- [ ] Create `docs-v2/features/plans.md`
- [ ] Create `docs-v2/features/trust-safety.md`
- [ ] Create `docs-v2/features/search-discovery.md`
- [ ] Create `docs-v2/features/app-feel.md` (consolidates 5 overlapping files)
- [ ] Create `docs-v2/features/onboarding.md`

### Phase 6: Subdirectory Migration
- [ ] Copy `business/` → `docs-v2/business/`
- [ ] Copy `public/` → `docs-v2/public/`
- [ ] Slim `guides/` → `docs-v2/guides/` (4 files, delete empty dir)
- [ ] Copy `runbooks/` → `docs-v2/runbooks/`
- [ ] Move `codex/` → `docs-v2/archive/codex/`

### Phase 7: Cutover
- [ ] Delete old `docs/` directory
- [ ] Rename `docs-v2/` → `docs/`
- [ ] Delete root `codex/` (now in `docs/archive/codex/`)
- [ ] Update `docs-site/` sync script to match new structure
- [ ] Run `pnpm docs:sync` to verify portal regeneration
- [ ] Update all cross-references in root AGENTS.md
- [ ] Final verification: `pnpm -s typecheck && pnpm -s lint`
- [ ] Delete this MASTER.md (its purpose is fulfilled)

---

## File Count Comparison

| Location | Current (docs/) | Target (docs-v2/) | Delta |
|----------|-----------------|-------------------|-------|
| Root `.md` | 3 | 5 | +2 (REQUIREMENTS, DESIGN promoted) |
| Core reference | 30 (14 stubs + 16 docs) | 11 | -19 |
| Features | 0 | 9 | +9 |
| Business | ~30 | ~30 | 0 |
| Public | ~22 | ~22 | 0 |
| Guides | 6 + 1 empty | 4 | -3 |
| Runbooks | 1 | 1 | 0 |
| Archive | 0 | ~16 (codex) | +16 (historical) |
| **Total authored** | **~95** | **~60 active** | **-35 active files** |

---

## Key Design Decisions

1. **Root gets 5 files** — AGENTS, TASKS, REQUIREMENTS, DESIGN, README. These are what AI reads first, always. No hops.

2. **REQUIREMENTS.md uses `R{n}.{m}` IDs** — enables "execute R2.3 from REQUIREMENTS.md" workflow. Each ID maps to one concrete feature. Status is ✅/⬜ with one-line description.

3. **Features/ subfolder over monolithic features.md** — each feature area gets its own spec following a standard template (Goal → Status → Requirements → Implementation → Gaps → Cross-refs). Scales better; one feature at a time context loading.

4. **PRODUCTION.md replaces 3 files** — single table showing ship-readiness per area. No more hunting across LAUNCH.md + PRODUCTION-PUSH.md + status/LAUNCH-READINESS.yaml.

5. **APP-FEEL 5-way consolidation** — `APP-FEEL-GUIDE.md` + `APP-FEEL-COMPONENTS.md` + `APP-FEEL-CHECKLIST.md` + `14-UI-UX-PLAN.md` + `DESIGN.md §8.5` → single `features/app-feel.md`. DESIGN.md keeps its §8.5 as the token/pattern authority; app-feel.md adds implementation plan and component specs.

6. **codex/ archived, not deleted** — completed refactor with verified metrics (-6185 LOC, 405 tests). Historical value for understanding past decisions. Moved to `docs/archive/codex/`.

7. **business/ and public/ untouched** — well-organized, different audience (investors, ops, legal, users). No engineering refactor needed.

8. **docs-site/ unchanged** — auto-regenerated from docs/ via sync script. Will need `pnpm docs:sync` rerun after cutover.

---

## AI Workflow After Migration

```
Human: "Execute R2.3 from REQUIREMENTS.md"

AI reads:
1. REQUIREMENTS.md → finds R2.3: "Image upload (multi-image, drag-reorder, compression)"
2. docs/features/selling.md → implementation details, routes, components
3. DESIGN.md → relevant UI patterns
4. docs/ARCHITECTURE.md → where the code lives
5. Implements, verifies, marks R2.3 as [x] in REQUIREMENTS.md