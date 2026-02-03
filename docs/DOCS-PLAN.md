# DOCS-PLAN.md — Treido Documentation System

> **Purpose:** Master plan for Treido documentation. **SSOT docs are the canonical ones linked from `docs/00-INDEX.md`.** `docs/archive/*` is explicitly **not SSOT** (historical/reference). Prefer docs that are easy to scan; split when it improves clarity (no hard line limit).

---

## 🎯 Goal

Create a **complete, AI-readable documentation system** that enables:
- AI agents to understand the project without scanning the entire codebase
- Humans to quickly onboard and reference canonical decisions
- Zero ambiguity on what's built, what's planned, and how things work

## 📁 Structure

```
/docs
├── DOCS-PLAN.md          ← You are here (this file)
├── PROMPT-GUIDE.md       ← How to prompt AI effectively
├── AGENTS.md             ← Agent entry point + rails (SSOT)
├── WORKFLOW.md           ← Agent workflow ops (SSOT)
├── 00-INDEX.md           ← Entry point for agents (links to all docs)
├── 01-PRD.md             ← Product Requirements Document
├── 02-FEATURES.md        ← Feature checklist (✅/🚧/⬜)
├── 03-ARCHITECTURE.md    ← Technical architecture & boundaries
├── 04-DESIGN.md          ← UI/UX design system rules
├── 05-ROUTES.md          ← All routes and their purpose
├── 06-DATABASE.md        ← Supabase schema reference
├── 07-API.md             ← Server actions & endpoints
├── 08-PAYMENTS.md        ← Stripe integration reference
├── 09-AUTH.md            ← Authentication flows
├── 10-I18N.md            ← Internationalization setup
├── 11-SKILLS.md          ← AI skills reference (V2)
├── 12-LAUNCH.md          ← Launch checklist & ops
├── 13-PRODUCTION-PUSH.md ← Production push plan
├── 14-UI-UX-PLAN.md      ← UI/UX roadmap
└── 15-DEV-DEPARTMENT.md  ← Roles + ownership + maintenance cadence
```

### Source-of-truth rules (non-negotiable)

1) **Stable documentation lives in `docs/`.**
2) **Runtime/high-churn docs live in `.codex/`** (tasks, refactor workspace, audit notes).
3) **No markdown sprawl:** `*.md` files must be only in:
   - `docs/**`
   - `.codex/**`
   - `**/AGENTS.md`
   - `README.md`
   - `.github/**` (repo meta: templates/instructions)
   - `.agent/**`, `.agents/**`, `.claude/**`, `.cursor/**`, `.gemini/**`, `.kiro/**`, `.qoder/**`, `.qwen/**`, `.trae/**`, `.windsurf/**` (tooling skills/configs)

---

## 📋 Doc Manifest

### Core Docs (PRIORITY 1)

| # | File | Purpose | Status | Lines Est |
|---|------|---------|--------|-----------|
| 0 | `00-INDEX.md` | Docs hub + navigation | ✅ | ~50 |
| 1 | `01-PRD.md` | What Treido is, vision, scope | ✅ | ~200 |
| 2 | `02-FEATURES.md` | Feature status checklist | ✅ | ~300 |
| 3 | `03-ARCHITECTURE.md` | Module boundaries, caching, data flow | ✅ | ~400 |
| 4 | `04-DESIGN.md` | Tailwind v4, tokens, UI rules | ✅ | ~300 |

### Domain Docs (PRIORITY 2)

| # | File | Purpose | Status | Lines Est |
|---|------|---------|--------|-----------|
| 5 | `05-ROUTES.md` | Route map with groups | ✅ | ~200 |
| 6 | `06-DATABASE.md` | Tables, RLS policies, key queries | ✅ | ~400 |
| 7 | `07-API.md` | Server actions, route handlers | ✅ | ~300 |
| 8 | `08-PAYMENTS.md` | Stripe Checkout, Connect, webhooks | ✅ | ~250 |
| 9 | `09-AUTH.md` | Auth flows, session, gating | ✅ | ~200 |
| 10 | `10-I18N.md` | Locales, messages, routing | ✅ | ~150 |

### Operations Docs (PRIORITY 3)

| # | File | Purpose | Status | Lines Est |
|---|------|---------|--------|-----------|
| 11 | `11-SKILLS.md` | AI skills reference (V2) | ✅ | ~200 |
| 12 | `12-LAUNCH.md` | Launch checklist, ops | ✅ | ~150 |
| 13 | `13-PRODUCTION-PUSH.md` | Production push plan | ✅ | ~250 |
| 14 | `14-UI-UX-PLAN.md` | App-feel UI/UX roadmap | ✅ | ~250 |
| 15 | `15-DEV-DEPARTMENT.md` | Roles + ownership + maintenance | ✅ | ~200 |
| — | `AGENTS.md` | Agent entry point + rails | ✅ | ~200 |
| — | `WORKFLOW.md` | Agent workflow ops | ✅ | ~250 |
| — | `PROMPT-GUIDE.md` | How to prompt AI | ✅ | ~200 |
| — | `DOCS-PLAN.md` | Docs system plan | ✅ | ~300 |
| — | `13-CHANGELOG.md` | SKIPPED — use `.codex/SHIPPED.md` | ❌ | — |

---

## 📐 Doc Pattern (Template)

Every doc follows this structure for AI readability:

```markdown
# TITLE.md — Short Description

> One-line purpose statement.

---

## Quick Reference

- Bullet point summaries
- Key facts an AI needs immediately

## Section 1

Content in tables, code blocks, or compact prose.

## Section 2

...

---

## See Also

- [Related Doc](relative-link.md)

---

*Last updated: YYYY-MM-DD*
```

### Rules

1. Prefer “one screen per concept” — split if it improves scanability
2. **Tables over prose** — faster to scan
3. **Code blocks** — exact file paths, commands
4. **Checkmarks** — ✅ done, 🚧 wip, ⬜ not started
5. **No marketing fluff** — facts only
6. **Relative links** — always use `./file.md` format
7. **Update dates** — bottom of every doc
8. **Consistent headings** — same H2/H3 depth across docs
9. **Metadata block** — top of each doc with scope, audience
10. **Doc types** — keep reference vs how-to separate

### Doc Type Classification

| Type | Purpose | Example |
|------|---------|---------|
| **Reference** | Facts, specs, status | FEATURES, DATABASE, ROUTES |
| **Concept** | Architecture, patterns | ARCHITECTURE, DESIGN |
| **How-To** | Step-by-step guides | AUTH, PAYMENTS |
| **Index** | Navigation | INDEX, DOCS-PLAN |

---

## 🔗 Integration with AGENTS.md

After docs are created/changed, update:
- `docs/00-INDEX.md` (hub + doc map)
- `AGENTS.md` (root entry point)
- `docs/AGENTS.md` (rails + routing)

Note: `.codex/AGENTS.md` is a deprecated pointer for backwards compatibility — do not edit it.

```markdown
## Canonical Docs (SSOT)

- `docs/00-INDEX.md` — entry point for all project docs
- `docs/01-PRD.md` — what Treido is + launch scope
- `docs/02-FEATURES.md` — feature checklist (✅/🚧/⬜)
- `docs/03-ARCHITECTURE.md` — module boundaries, caching, data flow
- `docs/04-DESIGN.md` — Tailwind v4, UI rules, forbidden patterns
```

---

## 🤖 AI Agent Usage Examples

### Example 1: "How many features are implemented?"

```
Agent reads: docs/00-INDEX.md → docs/02-FEATURES.md
Answer: Check Summary table at bottom
```

### Example 2: "What's the auth flow?"

```
Agent reads: docs/00-INDEX.md → docs/09-AUTH.md
Answer: Signup → Email Confirm → Session → Protected Routes
```

### Example 3: "Design a new component"

```
Agent reads: docs/00-INDEX.md → docs/04-DESIGN.md
Uses: treido-design + treido-tailwind-v4 + treido-shadcn-ui + treido-rails
Applies: Token rails, forbidden patterns, boundaries
```

### Example 4: "Add a new route"

```
Agent reads: docs/05-ROUTES.md → docs/03-ARCHITECTURE.md
Follows: Route group conventions, boundary rules
```

---

## 📊 Migration from Existing Docs

### Sources to Consolidate

| Source | Destination | Action |
|--------|-------------|--------|
| `.codex/project/PRD.md` | `docs/01-PRD.md` | ✅ Done (`.codex/project/*` is now deprecated pointers) |
| `.codex/project/FEATURES.md` | `docs/02-FEATURES.md` | ✅ Done (`.codex/project/*` is now deprecated pointers) |
| `.codex/project/ARCHITECTURE.md` | `docs/03-ARCHITECTURE.md` | ✅ Done (`.codex/project/*` is now deprecated pointers) |
| `.codex/project/DESIGN.md` | `docs/04-DESIGN.md` | ✅ Done (`.codex/project/*` is now deprecated pointers) |
| `docs/archive/uirefactor/*` | Reference only | Extract patterns if needed |
| `docs-site/content/business/*` | Reference only | Business context |

### Retirement Plan

Current state (2026-02-02):
1. `/docs` is the SSOT.
2. `.codex/project/*` files are deprecated pointers to `/docs`.
3. Historical planning docs are kept under `docs/archive/`.
4. `docs-site/` remains for public-facing docs.

---

## 🚀 Execution Order

```
Phase 1: Core (do first)
├── [1] 00-INDEX.md       ← Agent entry point
├── [2] 01-PRD.md         ← What we're building
├── [3] 02-FEATURES.md    ← What's done
└── [4] 04-DESIGN.md      ← How to style

Phase 2: Domain
├── [5] 03-ARCHITECTURE.md
├── [6] 05-ROUTES.md
├── [7] 09-AUTH.md
└── [8] 08-PAYMENTS.md

Phase 3: Reference
├── [9] 06-DATABASE.md
├── [10] 07-API.md
├── [11] 10-I18N.md
└── [12] 11-SKILLS.md

Phase 4: Ops
├── [13] 12-LAUNCH.md
└── [14] 13-PRODUCTION-PUSH.md
```

---

## 🔄 Chat Prompt Template

Copy this prompt into a new chat to create the next doc:

```
Read /docs/DOCS-PLAN.md first.

Create doc: [DOC_NUMBER]-[DOC_NAME].md

Rules:
1. Follow the Doc Pattern template in DOCS-PLAN.md
2. Prefer short docs (split when it improves scanability), tables over prose, no fluff
3. Include metadata block (Scope, Audience, Type)
4. Use existing sources: docs/, docs/archive/uirefactor/ (patterns only), codebase
5. After creating, update DOCS-PLAN.md checklist: mark [x] complete
6. Update 00-INDEX.md Doc Map status to ✅

Sources to reference:
- docs/[RELEVANT].md
- docs/archive/uirefactor/ (patterns only)
- Codebase for actual implementation details

When done, confirm with: "DOC COMPLETE: [filename]"
```

### Quick Prompts (Copy-Paste)

**01-PRD.md:**
```
Read /docs/DOCS-PLAN.md. Update 01-PRD.md — Product vision, scope, business model. Source: docs/01-PRD.md + codebase. Max 200 lines. Update checklist when done.
```

**02-FEATURES.md:**
```
Read /docs/DOCS-PLAN.md. Update 02-FEATURES.md — Feature checklist (✅/🚧/⬜). Source: docs/02-FEATURES.md + codebase. Max 300 lines. Update checklist when done.
```

**03-ARCHITECTURE.md:**
```
Read /docs/DOCS-PLAN.md. Update 03-ARCHITECTURE.md — Module boundaries, caching, data flow. Source: docs/03-ARCHITECTURE.md + codebase. Max 400 lines. Update checklist when done.
```

**04-DESIGN.md:**
```
Read /docs/DOCS-PLAN.md. Update 04-DESIGN.md — Tailwind v4 tokens, UI rules, forbidden patterns. Source: docs/04-DESIGN.md + docs/archive/uirefactor/ (patterns only). Max 300 lines. Update checklist when done.
```

**05-ROUTES.md:**
```
Read /docs/DOCS-PLAN.md. Create 05-ROUTES.md — All routes with groups, purpose, auth requirements. Scan app/[locale]/ for actual routes. Max 200 lines. Update checklist when done.
```

**06-DATABASE.md:**
```
Read /docs/DOCS-PLAN.md. Create 06-DATABASE.md — Supabase tables, key columns, RLS summary. Use mcp_supabase tools to get schema. Max 400 lines. Update checklist when done.
```

**07-API.md:**
```
Read /docs/DOCS-PLAN.md. Create 07-API.md — Server actions in app/actions/, route handlers in app/api/. List with purpose. Max 300 lines. Update checklist when done.
```

**08-PAYMENTS.md:**
```
Read /docs/DOCS-PLAN.md. Create 08-PAYMENTS.md — Stripe Checkout flow, Connect onboarding, webhooks. Scan lib/stripe/ and app/api/ for implementation. Max 250 lines. Update checklist when done.
```

**09-AUTH.md:**
```
Read /docs/DOCS-PLAN.md. Create 09-AUTH.md — Auth flows, session handling, route gating. Scan app/[locale]/(auth)/ and lib/auth/. Max 200 lines. Update checklist when done.
```

**10-I18N.md:**
```
Read /docs/DOCS-PLAN.md. Create 10-I18N.md — Locales, message files, routing setup. Scan i18n/ and messages/. Max 150 lines. Update checklist when done.
```

**11-SKILLS.md:**
```
Read /docs/DOCS-PLAN.md. Create 11-SKILLS.md — AI skill agents, triggers, when to use. Source: docs/AGENTS.md + .codex/skills/ + .codex/stack.yml. Max 200 lines. Update checklist when done.
```

**12-LAUNCH.md:**
```
Read /docs/DOCS-PLAN.md. Create 12-LAUNCH.md — Launch checklist, env setup, deployment. Source: docs-site/content/production.mdx + .codex/. Max 150 lines. Update checklist when done.
```

**13-CHANGELOG.md:**
```
Read /docs/DOCS-PLAN.md. Create 13-CHANGELOG.md — Version history template, current state. Keep minimal, max 100 lines. Update checklist when done.
```

---

## ✅ Completion Checklist

- [x] `00-INDEX.md` created
- [x] `01-PRD.md` created
- [x] `02-FEATURES.md` created
- [x] `03-ARCHITECTURE.md` created
- [x] `04-DESIGN.md` created
- [x] `05-ROUTES.md` created
- [x] `06-DATABASE.md` created
- [x] `07-API.md` created
- [x] `08-PAYMENTS.md` created
- [x] `09-AUTH.md` created
- [x] `10-I18N.md` created
- [x] `11-SKILLS.md` created
- [x] `12-LAUNCH.md` created
- [x] `13-PRODUCTION-PUSH.md` created
- [x] `14-UI-UX-PLAN.md` created
- [x] `15-DEV-DEPARTMENT.md` created
- [x] `AGENTS.md` created (moved from .codex/)
- [x] `WORKFLOW.md` created (moved from .codex/)
- [x] `PROMPT-GUIDE.md` created (human prompting guide)
- [❌] `13-CHANGELOG.md` SKIPPED — use `.codex/SHIPPED.md` instead
- [x] `.codex/AGENTS.md` now redirects to `/docs/AGENTS.md`
- [x] `.codex/WORKFLOW.md` now redirects to `/docs/WORKFLOW.md`
- [x] Old docs deprecated

---

## 📝 Notes

- Each doc is self-contained — can be read in isolation
- Cross-references use relative links
- Tables preferred for structured data
- Mermaid diagrams allowed for workflows
- ASCII art for simple diagrams
- HTML examples for component patterns

---

*Created: 2026-02-01*
*Status: ACTIVE (SSOT established; keep docs in sync)*
