# Docs Consolidation Plan (`docs/` → `docs-site`)

## Goal
Make `docs/` the **single source of truth today**, while keeping `docs-site` ready to become the **published home** for docs later.

Current posture (per team decision): we are using `docs/` for both development and business/product docs for now, and will migrate/mirror into `docs-site` later.

## Non-goals
- Do not rewrite engineering docs in this pass.
- Do not change app code or build pipelines unless needed for docs-site navigation/search.

## Definitions (for this consolidation)
- **Business docs**: pricing, monetization, competitors, roadmap, strategy, product/UX audits, PRDs, decisions.
- **Development docs**: engineering rules, design system tokens, production runbooks, testing guides, styling refactors.
- **Internal tooling docs**: agent prompts/rules (`.claude/*`, `prompts/*`, etc.).

## Target End State
- `docs/` remains the canonical source of truth (dev + business) until we explicitly switch.
- `docs-site` mirrors `docs/` structure so the eventual migration is mechanical.
- Old locations either:
  - become thin “tombstone” files pointing to the new canonical docs-site page, or
  - move to `docs/archive/` if they’re purely historical.

## Proposed Information Architecture (docs-site)
Create/extend these sections under `docs-site/content/business/`:
- `index.mdx` (overview)
- `pricing.mdx` (already exists)
- `monetization.mdx` (already exists)
- `roadmap.mdx` (already exists)
- `competitors.mdx` (already exists)
- `product/ux/` (migrated UX audits + improvement plans)
- `decisions/` (migrated DEC-* docs)
- `specs/` (migrated PRD/spec docs)
- `ops/` (launch-readiness / business-facing checklists if desired)

## Migration Plan (phased, small batches)
### Phase 0 — Freeze + rules
- Decide canonical sources: **now** → `docs/`, **later** → business/product → `docs-site`.
- Define naming conventions for moved docs: kebab-case filenames, short H1 titles, and “Last updated” note at top.

### Phase 1 — Add skeleton navigation
- Create the new folders under `docs-site/content/business/` (`product/ux`, `decisions`, `specs`, `ops`).
- Update `docs-site/content/business/_meta.js` to include the new subsections.

### Phase 2 — Migrate business/product docs (no rewrites)
For each “Move to docs-site” doc in the inventory below:
- Convert `.md` → `.mdx` as-is.
- Ensure first line is `# Title`.
- Fix any relative links/images (move any referenced assets to `docs-site/public/` or a `docs-site/content/assets/` convention).

### Phase 3 — Deprecate old locations safely
- Replace moved docs in `docs/` (or `GPT+OPUS/`) with short tombstones:
  - “This doc moved to docs-site: <new path>”
  - Keep the old filename temporarily to preserve links.
- Optionally move superseded/dated docs into `docs/archive/`.

### Phase 4 — Governance
- Add a short “Business Docs Rules” page in `docs-site/content/business/`:
  - what belongs here vs `docs/`
  - naming and ownership
  - how to add new pages and update `_meta.js`

## Open Questions (for Opus review)
- Should `docs-site` host *only* business docs, or also keep the existing dev pages (`engineering.mdx`, `production.mdx`, `guides/*`)?
- Do we want PRDs/decisions in docs-site to be public-facing, or internal-only?
- Do we migrate `GPT+OPUS/conversations/*` (likely “no”, keep as internal archive)?

---

## Markdown Inventory (every `.md` / `.mdx` in repo)
This is the consolidation checklist. Update “Need?” and “Proposed action” as decisions change.

| File | What it is | Need? | Proposed action | Target (if moved) |
|------|------------|-------|-----------------|------------------|
| `.claude/agents/code-reviewer.md` | Code Reviewer Agent — You are the last line of defense before code ships. Catch issues that would embarrass us in production. | Maybe | Review | `` |
| `.claude/agents/debugger.md` | Debugger Agent — You are an expert debugger. Your job is to find the root cause fast and apply the minimal fix. | Maybe | Review | `` |
| `.claude/agents/frontend-ui.md` | Frontend UI Agent — You create distinctive, production-grade interfaces that avoid generic "AI slop" aesthetics. Every interface should feel intentionally designed for its specific context. | Maybe | Review | `` |
| `.claude/agents/refactor-planner.md` | Refactor Planner Agent — You plan safe, incremental refactors that can be shipped piece by piece without breaking production. | Maybe | Review | `` |
| `.claude/agents/slop-hunter.md` | Slop Hunter Agent — You hunt and eliminate "AI slop" — the verbose, over-engineered, cargo-culted patterns that AI coding assistants produce. | Maybe | Review | `` |
| `.claude/agents/test-fixer.md` | Test Fixer Agent — You fix failing tests and improve test coverage. Default assumption: the product has the bug, not the test. | Maybe | Review | `` |
| `.claude/CLAUDE.md` | Amazong Marketplace – Project Memory — A modern e-commerce marketplace built with Next.js 16, Supabase, and Stripe. | Maybe | Review | `` |
| `.claude/commands/commit.md` | commit.md — allowed-tools: Bash(git:*) | Maybe | Review | `` |
| `.claude/commands/debug.md` | debug.md — description: Debug an error or failing test | Maybe | Review | `` |
| `.claude/commands/fix-tests.md` | or for E2E: — REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke | Maybe | Review | `` |
| `.claude/commands/gates.md` | gates.md — allowed-tools: Bash(pnpm:*), Bash(tsc:*) | Maybe | Review | `` |
| `.claude/commands/hunt-slop.md` | hunt-slop.md — description: Hunt for AI slop in the codebase | Maybe | Review | `` |
| `.claude/commands/plan-refactor.md` | plan-refactor.md — description: Plan a refactor for a target area | Maybe | Review | `` |
| `.claude/commands/review.md` | review.md — description: Review recent code changes | Maybe | Review | `` |
| `.claude/gpt_suggestions.md` | GPT Suggestions for Claude Agents — Goal: make each agent sharper, faster, and more reliable in its own domain. | Maybe | Review | `` |
| `.claude/QUICK-REFERENCE.md` | Claude Code Setup - Quick Reference — **Usage**: Claude auto-delegates, or say "Use the debugger agent to..." | Maybe | Review | `` |
| `.claude/rules/backend-architect.md` | Backend Architect (Next.js + Supabase + Stripe) — This rule covers **end-to-end backend design**: data modeling, API boundaries, security (auth/RLS), and operational concerns. | Maybe | Review | `` |
| `.claude/rules/frontend-ui.md` | Frontend (Design + UI Implementation) — Single frontend playbook: **visual direction** + **implementation** fitting the existing system. | Maybe | Review | `` |
| `.claude/rules/i18n.md` | i18n (next-intl) — 1. **Add/change message keys**: | Maybe | Review | `` |
| `.claude/rules/nextjs-app-router.md` | Next.js 16 App Router — Server by default. Client only for: | Maybe | Review | `` |
| `.claude/rules/stripe-payments.md` | Stripe Payments — 1. **Identify the operation**: | Maybe | Review | `` |
| `.claude/rules/supabase-auth-db.md` | Supabase (Auth + DB) — 1. **Identify context**: | Maybe | Review | `` |
| `.claude/rules/ux-flows.md` | UX Flow (Sell + Orders) — This rule is for **UX flow design** (not implementation-first). Produces clear, testable plans for: | Maybe | Review | `` |
| `.claude/skills/README.md` | Claude Skills Guide for Treido — Skills are **folders of instructions, scripts, and references** that Claude loads dynamically to improve performance on specialized tasks. Think of them as "expert knowledge modules." | Maybe | Review | `` |
| `.claude/skills/supabase-audit/SKILL.md` | Supabase Audit Skill — 1. Run security advisors: `mcp_supabase_get_advisors({ type: "security" })` | Maybe | Review | `` |
| `.claude/skills/tailwind-audit/SKILL.md` | Tailwind Audit Skill — 1. Run palette/gradient scan: `pnpm -s exec node scripts/scan-tailwind-palette.mjs` | Maybe | Review | `` |
| `.claude/skills/treido-dev/SKILL.md` | Treido Dev — 1. Read `TODO.md` | Maybe | Review | `` |
| `agents.md` | Agents Guide — Amazong Marketplace — This file is for coding agents working in this repo. | Yes | Keep | `agents.md` |
| `docs-site/content/business/competitors.mdx` | Competitor Analysis — Market landscape for Bulgarian classifieds. | Yes | Keep | `docs-site/content/business/competitors.mdx` |
| `docs-site/content/business/index.mdx` | Business Overview — Strategic planning and business model documentation for Amazong Marketplace. | Yes | Keep | `docs-site/content/business/index.mdx` |
| `docs-site/content/business/monetization.mdx` | Monetization Strategy — How Amazong generates revenue. | Yes | Keep | `docs-site/content/business/monetization.mdx` |
| `docs-site/content/business/pricing.mdx` | Pricing Tiers — Seller subscription plans for Amazong Marketplace. | Yes | Keep | `docs-site/content/business/pricing.mdx` |
| `docs-site/content/business/roadmap.mdx` | Product Roadmap — Feature development timeline for Amazong Marketplace. | Yes | Keep | `docs-site/content/business/roadmap.mdx` |
| `docs-site/content/design.mdx` | Design System — Visual design guidelines and component patterns for Amazong Marketplace. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/content/engineering.mdx` | Engineering Guide — Technical documentation for Amazong Marketplace development. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/content/guides/backend.mdx` | Backend Guide — Working with Supabase, API routes, and server-side logic. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/content/guides/deployment.mdx` | Deployment Guide — Deploying Amazong to production. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/content/guides/frontend.mdx` | Frontend Guide — Building UI components and pages in Amazong. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/content/guides/index.mdx` | Development Guides — Step-by-step guides for common development tasks. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/content/guides/testing.mdx` | Testing Guide — Writing and running tests for Amazong. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/content/index.mdx` | Amazong Marketplace Documentation — Welcome to the internal documentation for **Amazong Marketplace** — a Bulgarian classifieds marketplace. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/content/production.mdx` | Production Checklist — Pre-launch requirements for Amazong Marketplace. | Maybe | Decide (keep in docs-site or move to docs/) | `` |
| `docs-site/DOCS_CONSOLIDATION_PLAN.md` | Docs Consolidation Plan (Business Docs → `docs-site`) — Consolidate *business/product* documentation into `docs-site` (Nextra) so pricing, monetization, roadmap, strategy, and product/UX materials live in one place, while keeping *development/engineering* documentation in `docs/`. | Maybe | Review | `` |
| `docs/archive/styling-audit-2026-01-10.md` | Styling Audit (Archive) — 2026-01-10 — This is **archived** (dated) material. | Maybe | Keep archived (do not migrate) | `docs/archive/styling-audit-2026-01-10.md` |
| `docs/audit/competitive/bazar-bg-desktop-audit.md` | Bazar.bg Desktop UX/UI Audit — **Date**: January 12, 2026 | Yes | Move to docs-site (business/product/ux) | `docs-site/content/business/product/ux/bazar-bg-audit.mdx` |
| `docs/audit/competitive/competitive-mobile-ux-audit.md` | Competitive Mobile UX Audit — Treido vs Industry Leaders — **Audit Date:** January 13, 2026 | Yes | Move to docs-site (business/product/ux) | `docs-site/content/business/product/ux/competitive-mobile-ux-audit.mdx` |
| `docs/DESIGN.md` | Design System (Canonical) — This is the **single source of truth** for UI/UX and styling rules in this repo. | Yes | Keep in /docs | `docs/DESIGN.md` |
| `docs/audit/product/desktop-ui-ux-audit.md` | Treido Desktop UI/UX Audit Report — **Date:** January 12, 2026 | Yes | Move to docs-site (business/product/ux) | `docs-site/content/business/product/ux/desktop-ui-ux-audit.mdx` |
| `docs/audit/product/desktop-ux-improvement-plan-2026.md` | Treido Desktop UI/UX Improvement Plan 2026 — **Date:** January 13, 2026 | Yes | Move to docs-site (business/product/ux) | `docs-site/content/business/product/ux/desktop-ux-improvement-plan-2026.mdx` |
| `docs/ENGINEERING.md` | Engineering Guide — This doc captures the “rules of the road” for making changes without regressions or Vercel/Supabase cost spikes. | Yes | Keep in /docs | `docs/ENGINEERING.md` |
| `docs/guides/backend.md` | Backend Development Guide — Reference for Supabase, data fetching, caching, and API work on Treido. This is the **canonical backend guide** for both humans and agents. | Yes | Keep in /docs | `docs/guides/backend.md` |
| `docs/guides/frontend.md` | Frontend Development Guide — Reference for UI/UX work on Treido. This is the **canonical frontend guide** for both humans and agents. | Yes | Keep in /docs | `docs/guides/frontend.md` |
| `docs/guides/STYLING-AUDIT.md` | Styling Audit (Moved) — This guide used to contain a narrative styling audit. | Yes | Keep in /docs | `docs/guides/STYLING-AUDIT.md` |
| `docs/guides/styling.md` | Styling (Moved) — This guide has been consolidated. | Yes | Keep in /docs | `docs/guides/styling.md` |
| `docs/guides/testing.md` | Testing Guide — Reference for verification gates, unit tests, and E2E tests on Treido. This is the **canonical testing guide** for both humans and agents. | Yes | Keep in /docs | `docs/guides/testing.md` |
| `docs/guides/treido-mock-ui-ux-adoption.md` | Treido Mock → Amazong UI/UX Adoption Guide (Next.js 16 + shadcn + Tailwind v4) — **Goal**: Apply the proven mobile UI/UX patterns from `w3bsuki/treido-mock` to this repo while respecting our design rails. | Yes | Keep in /docs | `docs/guides/treido-mock-ui-ux-adoption.md` |
| `docs/audit/product/mobile-ui-ux-audit.md` | Mobile UI/UX Audit Report — Treido Marketplace — **Audit Date:** January 12, 2026 | Yes | Move to docs-site (business/product/ux) | `docs-site/content/business/product/ux/mobile-ui-ux-audit.mdx` |
| `docs/audit/product/mobile-ux-audit-live.md` | 📱 Mobile UX Audit Report - Treido Marketplace — **Date:** January 12, 2026 | Yes | Move to docs-site (business/product/ux) | `docs-site/content/business/product/ux/mobile-ux-audit-live.mdx` |
| `docs/audit/competitive/olx-bg-desktop-audit.md` | OLX.bg Desktop UX/UI Audit & Comparison to Amazong — **Date:** January 12, 2026 | Yes | Move to docs-site (business/product/ux) | `docs-site/content/business/product/ux/olx-bg-desktop-audit.mdx` |
| `docs/PRODUCTION.md` | Production Plan (“Last 5%”) — Goal: ship safely with fewer regressions and lower Vercel/Supabase cost. | Yes | Keep in /docs | `docs/PRODUCTION.md` |
| `docs/README.md` | Docs (Start Here) — This repo keeps documentation surface area intentionally small. | Yes | Keep in /docs | `docs/README.md` |
| `docs/styling/03-tailwind.md` | Phase 3: Tailwind CSS v4 Best Practices Audit ⚠️ PARTIAL — **Priority:** 🟡 Medium | Yes | Keep in /docs | `docs/styling/03-tailwind.md` |
| `docs/styling/04-shadcn.md` | Phase 4: shadcn/ui Best Practices & Audit ✅ CONFIGURED (Ongoing Maintenance) — **Priority:** ✅ Configured | Yes | Keep in /docs | `docs/styling/04-shadcn.md` |
| `docs/styling/ANTI_PATTERNS.md` | Anti-Patterns — What NOT to Do — Common mistakes that break our styling consistency. | Yes | Keep in /docs | `docs/styling/ANTI_PATTERNS.md` |
| `docs/styling/PATTERNS.md` | Approved Styling Patterns — Copy-paste these patterns. Don't invent new ones. | Yes | Keep in /docs | `docs/styling/PATTERNS.md` |
| `docs/styling/README.md` | Styling (Docs) — This folder centralizes **all styling documentation** for the repo. | Yes | Keep in /docs | `docs/styling/README.md` |
| `docs/styling/REFACTOR_PLAN.md` | Styling Refactor Plan — Prioritized cleanup tasks to achieve consistent styling across the codebase. | Yes | Keep in /docs | `docs/styling/REFACTOR_PLAN.md` |
| `docs/styling/STYLE_GUIDE.md` | Treido Style Guide — **Philosophy**: Dense · Flat · Fast · Trustworthy · Mobile-first | Yes | Keep in /docs | `docs/styling/STYLE_GUIDE.md` |
| `e2e/README.md` | E2E Test Suite (Playwright) — This project uses Playwright for end-to-end testing against **both**: | Yes | Keep | `e2e/README.md` |
| `GPT+OPUS/audits/AUDIT-production-readiness.md` | Production Readiness Audit: Treido Marketplace — **Date**: January 13, 2026 | Maybe | Move to docs-site (business/ops) or keep in GPT+OPUS | `docs-site/content/business/ops/audit-production-readiness.mdx` |
| `GPT+OPUS/conversations/CONVERSATION-001.md` | GPT + OPUS Collaboration: Conversation 001 — **Date**: January 13, 2026 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-001.md` |
| `GPT+OPUS/conversations/CONVERSATION-002.md` | GPT + OPUS Collaboration: Conversation 002 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-002.md` |
| `GPT+OPUS/conversations/CONVERSATION-003.md` | GPT + OPUS Collaboration: Conversation 003 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-003.md` |
| `GPT+OPUS/conversations/CONVERSATION-004.md` | GPT + OPUS Collaboration: Conversation 004 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-004.md` |
| `GPT+OPUS/conversations/CONVERSATION-005.md` | GPT + OPUS Collaboration: Conversation 005 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-005.md` |
| `GPT+OPUS/conversations/CONVERSATION-006.md` | GPT + OPUS Collaboration: Conversation 006 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-006.md` |
| `GPT+OPUS/conversations/CONVERSATION-007.md` | GPT + OPUS Collaboration: Conversation 007 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-007.md` |
| `GPT+OPUS/conversations/CONVERSATION-008.md` | GPT + OPUS Collaboration: Conversation 008 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-008.md` |
| `GPT+OPUS/conversations/CONVERSATION-009.md` | CONVERSATION-009 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-009.md` |
| `GPT+OPUS/conversations/CONVERSATION-010.md` | GPT + OPUS Collaboration: Conversation 010 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-010.md` |
| `GPT+OPUS/conversations/CONVERSATION-011.md` | CONVERSATION-011 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-011.md` |
| `GPT+OPUS/conversations/CONVERSATION-012.md` | GPT + OPUS Collaboration: Conversation 012 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-012.md` |
| `GPT+OPUS/conversations/CONVERSATION-013.md` | GPT + OPUS Collaboration: Conversation 013 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-013.md` |
| `GPT+OPUS/conversations/CONVERSATION-014.md` | GPT + OPUS Collaboration: Conversation 014 — **Date**: 2026-01-13 | Maybe | Keep (archive) in GPT+OPUS | `GPT+OPUS/conversations/CONVERSATION-014.md` |
| `GPT+OPUS/decisions/DEC-002-category-navigation.md` | DEC-002 — Category Navigation & Category Selection (Launch) — **Date**: 2026-01-13 | Yes | Move to docs-site (business/decisions) | `docs-site/content/business/decisions/dec-002-category-navigation.mdx` |
| `GPT+OPUS/decisions/DEC-003-monetization-v1.md` | DEC-003 — Launch Mode & Monetization v1 (Classifieds-first) — **Date**: 2026-01-13 | Yes | Move to docs-site (business/decisions) | `docs-site/content/business/decisions/dec-003-monetization-v1.mdx` |
| `GPT+OPUS/PROTOCOL.md` | Dual-AI Collaboration Protocol — How Claude Opus 4.5 and GPT 5.2 XHIGH Codex work together on Treido | Maybe | Keep | `GPT+OPUS/PROTOCOL.md` |
| `GPT+OPUS/README.md` | GPT + OPUS Collaboration Hub — **Purpose**: Cross-AI collaboration for Treido marketplace production push | Maybe | Keep | `GPT+OPUS/README.md` |
| `GPT+OPUS/specs/PRD-monetization-model.md` | PRD: Treido Monetization Model — **Version**: Draft 0.1 | Yes | Move to docs-site (business/specs) | `docs-site/content/business/specs/prd-monetization-model.mdx` |
| `prompts/PHASE-7-DESKTOP-POLISH.md` | Phase 7 — Desktop Polish (Post-Phase 6) — You are working in the Treido marketplace repo (Next.js 16 App Router, React 19, TS, Tailwind v4, shadcn/ui, next-intl). | Maybe | Keep | `prompts/PHASE-7-DESKTOP-POLISH.md` |
| `prompts/README.md` | Audit Prompts — This folder contains structured prompts for auditing different parts of the tech stack. | Maybe | Keep | `prompts/README.md` |
| `README.md` | Amazong Marketplace — A modern e-commerce marketplace built with Next.js 16, Supabase, and Stripe. | Yes | Keep | `README.md` |
| `styling/README.md` | Styling Docs (Moved) — Styling documentation has been consolidated under `docs/styling/`. | Yes | Keep | `styling/README.md` |
| `supabase_audit.md` | Supabase Backend Audit (Amazong) — **Audit date**: January 10, 2026 | Maybe | Move under docs/audit/ or docs/archive/ | `` |
| `temp_log_entry.md` | temp_log_entry.md — Task: Phase 2 - Arbitrary Value Cleanup | No | Delete or move to cleanup/ | `` |
| `TODO.md` | TODO — **Workflow**: See `docs/PRODUCTION-WORKFLOW-GUIDE.md` (comprehensive) or `docs/GPTVSOPUSFINAL.md` (agent roles) | Yes | Keep | `TODO.md` |
