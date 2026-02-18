# AI Documentation Audit — Treido

> Audit date: 2026-02-18
> Sources: Anthropic official docs (CLAUDE.md, Skills, prompt engineering), OpenAI official docs (AGENTS.md spec, prompt engineering, model spec), full read of all 13 project docs.

---

## Executive Summary

**Current state: Strong foundation, meaningful optimization possible.**

Your 3-file model (AGENTS.md + CURRENT.md + task file = ~195 lines) is genuinely good — it aligns with both Anthropic's and OpenAI's official recommendations. You've already avoided the biggest anti-pattern (bloated context files). The doc quality is high: clarity is 5/5 across almost every file.

**The main problems are:**
1. **Massive redundancy** — 6 topics are copy-pasted into 4-5 files each (Supabase clients, auth rules, architecture boundaries, caching, styling, webhooks). This wastes tokens and creates drift risk.
2. **Skills add noise, not signal** — the backend SKILL has almost zero unique content. The treido SKILL duplicates everything from the deep docs.
3. **Missing `.claude/rules/`** — Anthropic's official pattern for modular, path-specific rules. You're not using it at all.
4. **No cross-agent compatibility** — your docs are optimized for Codex CLI and Copilot specifically, but AGENTS.md is now a cross-agent standard (Cursor, Windsurf, Amp, Aider, Devin, Zed all read it).
5. **Correctness bugs** — treido SKILL has a wrong code example (`params.id` instead of `await params`), refactor SKILL has Linux-only commands on a Windows project.

**If you fix redundancy alone, you save ~400 tokens per agent session** (5 duplicated tables × ~80 tokens each). That's context window budget reclaimed for actual work.

---

## What the Official Docs Say (Condensed)

### Anthropic (Claude Code / Skills)

| Principle | Source | Your status |
|-----------|--------|-------------|
| CLAUDE.md loaded every session — only broadly-applicable rules | Memory docs | ✅ AGENTS.md is lean (~85 lines) |
| "Bloated files cause Claude to ignore your actual instructions" | Best practices | ✅ Already cut from 800→85 |
| Skills for domain knowledge (loaded on demand) | Skills docs | ⚠️ Skills exist but are mostly duplicates of deep docs |
| `.claude/rules/*.md` for modular, path-scoped rules | Memory docs | ❌ Not used at all |
| SKILL.md under 500 lines, reference content in separate files | Skills docs | ✅ All under 150 lines |
| First 200 lines of memory auto-load — keep concise | Memory docs | ✅ N/A (your memory is lean) |
| "If removing this instruction wouldn't cause mistakes, cut it" | Best practices | ⚠️ Several rules Claude already follows by default |
| Progressive disclosure: metadata → instructions → resources | Skills docs | ⚠️ Skills lack Level 3 resources (all crammed into SKILL.md) |
| Remove anti-laziness prompts for Claude 4.6 ("be thorough", "think carefully") | Claude 4.6 migration | ⚠️ Not checked, but worth auditing prompts |
| Consistent terminology (one term per concept) | Prompt engineering | ⚠️ Minor inconsistencies found |

### OpenAI (Codex / AGENTS.md)

| Principle | Source | Your status |
|-----------|--------|-------------|
| AGENTS.md = "README for agents" — setup, tests, style, PR rules | AGENTS.md spec | ✅ Your AGENTS.md covers this |
| 32 KiB limit per combined AGENTS.md chain | Spec | ✅ Well under |
| Test/build commands listed → agents auto-execute them | Spec | ✅ § Verify section |
| Nested AGENTS.md for monorepos (deeper = higher precedence) | Spec | ❌ Single root file only (fine for non-monorepo) |
| Reasoning models prefer simple, direct instructions | Reasoning guide | ✅ Already lean |
| Developer message: Identity → Instructions → Examples → Context | Prompt engineering | ⚠️ Your AGENTS.md order: Identity → Context → Constraints → Conventions → Verify (no examples) |
| Static/reusable content first (maximizes prompt caching) | Prompt engineering | ✅ Stack/constraints are stable |
| Specify output format explicitly | Prompt engineering | ⚠️ Not in AGENTS.md (covered in task files sometimes) |

### Both Agree On

1. **Less is more.** Every token competes with conversation history. Be ruthless.
2. **Progressive disclosure.** Index file points to details, loaded on demand.
3. **Verification is mandatory.** Agents must be able to check their own work.
4. **Structured > unstructured.** Use XML tags, tables, consistent headers.
5. **Constants inline, volatile data external.** Constraints that never change → in the main file. Current tasks → separate file.

---

## File-by-File Audit

### Tier 1: Entry Points (always loaded)

| File | Lines | Clarity | Completeness | Unique Value | Issues |
|------|-------|---------|--------------|--------------|--------|
| AGENTS.md | ~85 | 5/5 | 4/5 | ✅ High — single entry point, constraints | Gate commands differ from TASKS.md |
| claude.md | ~85 | 5/5 | 4/5 | ✅ High — Copilot identity, sessions | Still references dead `opus.md` |

### Tier 2: Deep References (loaded on demand)

| File | Lines | Clarity | Completeness | Unique Value | Issues |
|------|-------|---------|--------------|--------------|--------|
| ARCHITECTURE.md | ~195 | 5/5 | 4/5 | ✅ High — module table, data flow, cache profiles | Duplicate `lib/validation/` entry |
| docs/DESIGN.md | ~200 | 5/5 | 5/5 | ✅ High — design thinking, anti-slop, mobile UX | Oldest doc (Feb 15) |
| docs/DOMAINS.md | ~250 | 5/5 | 5/5 | ✅ High — runtime truth paths, edge cases | DB schema details that could drift |
| docs/DECISIONS.md | ~165 | 5/5 | 4/5 | ✅ Unique — only "why" doc in the project | DEC-007 references may be stale |
| docs/PROJECT-MAP.md | ~650 | 5/5 | 5/5 | ✅ High — complete file inventory | Very long; "Generated" but is manual |

### Tier 3: Refactor System (Codex-specific)

| File | Lines | Clarity | Completeness | Unique Value | Issues |
|------|-------|---------|--------------|--------------|--------|
| refactor/CURRENT.md | ~50 | 5/5 | 4/5 | ✅ High — metrics, task queue | File count went UP (unexplained) |
| refactor/shared-rules.md | ~80 | 5/5 | 4/5 | ✅ DO/DON'T/STOP lists | No test naming convention |

### Tier 4: Skills (Copilot-specific)

| File | Lines | Clarity | Completeness | Unique Value | Issues |
|------|-------|---------|--------------|--------------|--------|
| treido SKILL | ~145 | 5/5 | 4/5 | ⚠️ Low — mostly duplicates deep docs | **BUG: `params.id` not awaited** |
| refactor SKILL | ~110 | 5/5 | 4/5 | ⚠️ Medium — "use client" checklist is good | Linux commands on Windows project |
| backend SKILL | ~80 | 4/5 | 3/5 | ❌ Lowest — 95% duplicated from ARCHITECTURE.md + DOMAINS.md | Could be deleted and merged into treido SKILL |

### Verdict: TASKS.md

| File | Lines | Clarity | Completeness | Unique Value | Issues |
|------|-------|---------|--------------|--------------|--------|
| TASKS.md | ~35 | 4/5 | 3/5 | ⚠️ Medium — launch blockers unique | Missing IDs (005, 006), no done criteria, gate mismatch with AGENTS.md |

---

## Critical Issues (Fix Now)

### 1. Bug: Treido SKILL Code Example

The page.tsx example uses `params.id` directly. In Next.js 16 (your stack), `params` is a Promise:

```tsx
// BROKEN (in SKILL.md now)
export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

// CORRECT
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
```

Any agent using this SKILL as a template will write broken code.

### 2. Bug: Refactor SKILL Linux Commands

Metrics measurement uses `grep -r`, `find`, `wc -l` — Linux commands. Your project runs on Windows with PowerShell. Either provide cross-platform alternatives or label them as "for CI (Linux)" only.

### 3. Drift: Gate Commands Inconsistency

- AGENTS.md § Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`
- TASKS.md § Gates: also includes `pnpm -s knip && pnpm -s dupes`

An agent reading only AGENTS.md will skip two gates. These should match.

### 4. Ghost File: `opus.md` Still Exists

`claude.md` says it replaces `opus.md`, but `opus.md` is still in the repo root. Delete it or risk agents loading stale context.

---

## Redundancy Map (The Biggest Win)

These 6 topics appear in 4-5 files each. **Each should exist in exactly ONE authoritative source, with all others pointing to it.**

| Topic | Authoritative Source | Remove from |
|-------|---------------------|-------------|
| Supabase client selection | ARCHITECTURE.md § 2 | DOMAINS.md, treido SKILL, backend SKILL, refactor SKILL |
| Auth rule (`getUser` only) | AGENTS.md § Constraints | ARCHITECTURE.md, DOMAINS.md, treido SKILL, backend SKILL |
| Architecture boundaries | ARCHITECTURE.md § 5 | DESIGN.md, shared-rules.md, treido SKILL, refactor SKILL |
| Caching pattern | ARCHITECTURE.md § 4 | treido SKILL, backend SKILL, refactor SKILL |
| Semantic token enforcement | DESIGN.md § Tokens | AGENTS.md, shared-rules.md, treido SKILL |
| Webhook safety | DOMAINS.md § Payments | AGENTS.md, ARCHITECTURE.md, treido SKILL, backend SKILL |

**Strategy:** Keep the one-liner constraint in AGENTS.md (it's the "don't violate this" signal). Remove the full explanation from everywhere except the authoritative source. In Skills, replace duplicated sections with a pointer: `> See ARCHITECTURE.md § 2 for Supabase client selection rules.`

---

## Proposed Changes

### A. Restructure Skills for Progressive Disclosure

**Current problem:** Skills duplicate deep docs instead of adding unique value.

**Proposed structure:**

```
.agents/skills/treido/
├── SKILL.md          # Quick-reference card: defaults, gotchas, corrected code examples
│                      # Points to deep docs for full details
│                      # Contains ONLY information you'd forget without a reminder
└── (no sub-files needed — deep docs ARE the Level 3 resources)

.agents/skills/refactor/
├── SKILL.md          # "Use client" removal checklist, metrics commands (cross-platform)
│                      # Points to refactor/CURRENT.md and shared-rules.md
└── (same)

.agents/skills/backend/
└── (DELETE or merge unique content into treido SKILL)
```

**Treido SKILL rewrite goals:**
- Remove all tables that exist in ARCHITECTURE.md or DOMAINS.md
- Keep: corrected code examples (the actual patterns to follow), context loading pointers
- Add: error handling pattern, logging convention, response envelope (currently documented nowhere)
- Total: aim for ~80 lines, zero duplication

### B. Add `.claude/rules/` for Path-Specific Rules

This is Anthropic's official pattern for modular rules. Create:

```
.claude/rules/
├── styling.md          # paths: ["app/**", "components/**"]
│                        # Semantic token rules, no palette classes
├── auth.md             # paths: ["app/actions/**", "app/api/**", "lib/auth/**"]
│                        # getUser() only, requireAuth() in actions
├── data.md             # paths: ["lib/data/**", "app/actions/**"]
│                        # Supabase client selection, caching rules
├── payments.md         # paths: ["app/api/webhooks/**", "lib/stripe/**"]
│                        # Webhook safety, idempotency, no-modify zones
└── i18n.md             # paths: ["messages/**", "app/[locale]/**"]
│                        # next-intl rules, Link/redirect from @/i18n/routing
```

**Why this is better:** Rules load only when the agent touches files matching the glob pattern. No wasted tokens loading payment rules when editing a UI component. This is exactly the progressive disclosure both Anthropic and OpenAI recommend.

### C. Align AGENTS.md with Cross-Agent Standard

Your AGENTS.md is already good, but it's optimized for the human→Codex→Copilot workflow. The AGENTS.md standard is now supported by **12+ coding agents**. Small tweaks for universal compatibility:

1. **Add setup commands explicitly** (Codex/Cursor/Windsurf auto-detect these):
   ```markdown
   ## Setup
   - Install: `pnpm install`
   - Dev: `pnpm dev`
   - Build: `pnpm build`
   ```

2. **Unify gate commands** — AGENTS.md § Verify should include ALL gates (add `knip` and `dupes` from TASKS.md, or remove them from TASKS.md).

3. **Add commit/PR conventions** (if you have any — many agents auto-generate commits):
   ```markdown
   ## Commits
   - Format: `type(scope): message` (conventional commits)
   - Run verify before committing
   ```

### D. Fix TASKS.md

Current TASKS.md is the weakest doc. An agent can't execute "LAUNCH-001: Stripe idempotency" without more context.

**Proposal:** Each task gets a one-line "done when" criterion:
```markdown
- [ ] LAUNCH-001: Stripe webhook idempotency — done when: all webhook handlers check idempotency key before DB write, test covers duplicate event
- [ ] LAUNCH-002: Refund flow — done when: refund action exists, Stripe refund webhook handled, buyer sees refund status
```

### E. Add a `docs/GLOSSARY.md` (Optional but High-Value)

Both Anthropic and OpenAI stress **consistent terminology**. Minor inconsistencies found:
- "server action" vs "action" vs "server-side action"
- "route handler" vs "API route" vs "REST endpoint"
- "cached fetcher" vs "data fetcher" vs "query function"

A 20-line glossary eliminates ambiguity for all agents:
```markdown
| Term | Means | Don't say |
|------|-------|-----------|
| server action | Function in `app/actions/` with `"use server"` | action, server-side action |
| route handler | Function in `app/api/` (GET/POST/etc.) | API route, REST endpoint |
| cached fetcher | Function in `lib/data/` using `use cache` | data fetcher, query |
```

### F. Shrink PROJECT-MAP.md Token Footprint

At 650 lines, PROJECT-MAP.md is the most expensive doc to load. Most agents don't need the full inventory — they need to find specific files.

**Options:**
1. **Split by domain:** `docs/maps/routes.md`, `docs/maps/components.md`, `docs/maps/lib.md` — agents load only the relevant section
2. **Keep monolithic but add a 20-line summary at top** that agents can use 90% of the time without reading the rest
3. **Auto-generate it** with a script so it never drifts (you already have scripts infrastructure)

Option 3 is the most robust long-term.

---

## Priority Order

| # | Change | Impact | Effort |
|---|--------|--------|--------|
| 1 | Fix treido SKILL code bug (`params` await) | High — prevents broken code | 5 min |
| 2 | Fix refactor SKILL Linux commands | Medium — cross-platform | 10 min |
| 3 | Delete `opus.md` | Low risk, removes confusion | 1 min |
| 4 | Unify gate commands (AGENTS.md ↔ TASKS.md) | Medium — consistency | 5 min |
| 5 | De-duplicate Skills (remove copied tables, add pointers) | High — token savings | 30 min |
| 6 | Delete backend SKILL (merge scraps into treido) | Medium — less noise | 15 min |
| 7 | Add `.claude/rules/` with path-specific rules | High — progressive disclosure | 45 min |
| 8 | Add setup commands to AGENTS.md | Low effort, cross-agent compat | 5 min |
| 9 | Improve TASKS.md with done criteria | Medium — agent-executable tasks | 15 min |
| 10 | Add GLOSSARY.md | Low effort, high clarity | 15 min |
| 11 | Split or auto-generate PROJECT-MAP.md | Medium — context efficiency | 1 hr |

---

## What You're Doing Right (Keep These)

- **3-file model** (AGENTS.md → CURRENT.md → task file) — perfectly matches progressive disclosure
- **Lean AGENTS.md** (~85 lines) — both vendors say this is correct
- **Constraints as production safety rules** — the "violating these causes production incidents" framing is exactly right
- **Decision log** — the only "why" doc. Invaluable for agents making judgment calls.
- **"Read before writing"** instruction — matches both vendors' "avoid overstepping" principle
- **Verification in one place** — you already learned this lesson (was in 9 places, now in 1)
- **Separate concerns** — docs/, refactor/, .agents/skills/ are well-organized

---

*This audit is a reference document. The human decides which changes to execute and in what order.*
