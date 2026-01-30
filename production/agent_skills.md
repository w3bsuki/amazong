# Agent Skills Strategy (Treido) — 2026-01-29

Goal: a **small set of specialist agents** that consistently ship **clean, production-ready changes** on Treido’s stack (Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase + Stripe + next-intl) without over-engineering.

This document is **non-SSOT**. SSOT remains `AGENTS.md` + `docs/*`.

## Ecosystem Snapshot (What “Skills” Look Like Elsewhere)

Different tools use different names, but they’re converging on the same idea: **project-scoped instructions + reusable workflows + tool recipes**.

- OpenAI Codex: `AGENTS.md` + “Skills” (`SKILL.md` packages)  
  - Docs: https://developers.openai.com/codex/skills
  - Official skill library: https://github.com/openai/skills
- Open “Agent Skills” standard (format + portability): https://agentskills.io/specification
- Anthropic Claude Code: “Skills”, custom slash commands, and subagents  
  - Skills: https://docs.anthropic.com/en/docs/claude-code/skills
  - Slash commands: https://docs.anthropic.com/en/docs/claude-code/slash-commands
  - Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- GitHub Copilot: agent skills (GitHub-hosted docs)  
  - https://docs.github.com/en/copilot/customizing-copilot/creating-customizations/using-agent-skills-with-github-copilot
- Cursor / Windsurf / Continue: “rules” files (same intent, different packaging)  
  - Cursor rules: https://docs.cursor.com/context/rules
  - Windsurf rules: https://docs.windsurf.com/windsurf/cascade/memories#rules-directory
  - Continue rules: https://docs.continue.dev/customize/deep-dives/rules

## Design Goal For Treido Skills

We want skills to act like **guardrails + muscle memory**:

- Make the agent ask the *right questions* up front.
- Keep changes **small (1–3 files)** and avoid scope creep.
- Encode the non-negotiables (no i18n drift, no Tailwind drift, no secrets in logs, no Supabase `select('*')`, idempotent Stripe webhooks).
- Produce verifiable output (commands to run + what “done” means).

## Skill Design Principles (What We Copy From The Best Repos)

1. **Skills are procedural, not encyclopedic**  
   Put checklists + tool recipes in `SKILL.md`. Put deep reference material in `references/`.
2. **Separate builders from auditors**  
   Builders change code. Auditors verify and report. Don’t blur the roles.
3. **Default to “verify always”**  
   Skills should end with a minimal, deterministic verification step.
4. **Tool-first when tools exist**  
   If we have a tool (e.g., Supabase MCP), use it instead of guessing.
5. **Explicit anti-patterns**  
   Spell out what *not* to do (Tailwind arbitrary values, gradients, secrets in logs, auth key exposure, etc.).

## Proposed “Army” (Minimal, High-Leverage)

Keep it small. These cover 95% of work:

### 1) `treido-orchestrator` (new)
Use when the request is ambiguous, touches multiple areas, or is high-stakes. It:

- Creates a short plan.
- Decides which specialist owns the change.
- Spawns fast sub-reviews (design / Tailwind / Supabase) when relevant.
- Enforces “1–3 files + gates”.

### 2) `treido-designer` (new)
Use for UI/UX changes. It:

- Produces a *spec* (layout, hierarchy, components, states) mapped to shadcn/ui + tokens.
- Enforces “anti-slop” (no gradients/glows; stable UX; consistent tokens).
- Checks accessibility basics (contrast, focus, touch targets).

### 3) `treido-frontend` (existing)
Use for UI implementation (Next.js App Router UI + next-intl + Tailwind v4/shadcn).

### 4) `treido-backend` (existing)
Use for server actions, route handlers, Stripe webhooks, and backend glue code.

### 5) `treido-supabase-mcp` (new)
Use for Supabase schema/RLS/policies/storage/auth debugging and performance work. It:

- Introspects schema via MCP.
- Applies DDL via migrations (not ad-hoc SQL).
- Runs advisors and regenerates types.

### 6) `tailwind-audit` (existing, fix/upgrade)
Use to verify Tailwind v4 compliance (no gradients/arbitrary values/hardcoded colors) and token correctness.

### 7) `supabase-audit` (existing, fix/upgrade)
Use to run advisors + sanity check RLS, hot-path queries, and missing indexes.

### 8) `treido-testing` / `treido-refactor` (existing)
Use as needed for test work and safe refactors.

## Standard Workflows (What We Actually Do)

### UI / Styling Change

1. `treido-orchestrator`: clarify scope → pick 1–3 files → plan → spawn `treido-designer` quick spec review.
2. `treido-frontend`: implement with next-intl + shadcn + tokens.
3. `tailwind-audit`: run `pnpm -s styles:gate` + scan for arbitrary/gradients.
4. Run gates (`typecheck`, `lint`, plus tests based on touched area).

### Supabase / RLS / Schema Change

1. `treido-supabase-mcp`: inspect schema + existing policies → write migration → regenerate types.
2. `supabase-audit`: run security + performance advisors → flag missing RLS / indexes / hot-path `select('*')`.
3. Run gates and any relevant e2e smoke.

### Stripe / Webhooks / Connect Change

1. `treido-backend`: implement smallest safe change; keep logs redacted; verify signature and idempotency.
2. Run `treido-testing` checks; e2e smoke if flows touched.

## Designer “Anti-Slop” Rules (Hard Requirements)

Treido’s UI must look like a real product, not “AI demo UI”:

- No gradients/glows/neon aesthetics.
- No random color additions; tokens only.
- No one-off spacing/type/radius decisions; follow existing patterns.
- No new animations (keep UX stable).
- Accessibility first: clear hierarchy, visible focus, adequate contrast, consistent hit targets.

Helpful external references (not SSOT):

- Apple Design Tips (hit targets, layout, typography): https://developer.apple.com/design/tips
- Nielsen heuristics workbook (usability heuristics): https://media.nngroup.com/media/articles/attachments/Heuristic_worksheet_2020.pdf

## Tech Stack References (Official)

- Next.js 16: https://nextjs.org/blog/next-16 and https://nextjs.org/docs/app
- React 19: https://react.dev/blog/2024/12/05/react-19 and https://react.dev/reference/rsc/server-components
- TypeScript: https://www.typescriptlang.org/tsconfig/
- Tailwind CSS v4: https://tailwindcss.com/blog/tailwindcss-v4 and https://tailwindcss.com/docs/theme
- shadcn/ui theming: https://ui.shadcn.com/docs/theming and Tailwind v4 guide: https://ui.shadcn.com/docs/tailwind-v4
- Supabase:
  - Auth: https://supabase.com/docs/guides/auth
  - RLS deep dive: https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security
  - Storage access control: https://supabase.com/docs/guides/storage/security/access-control
  - Database advisors: https://supabase.com/docs/guides/database/database-advisors
- Stripe:
  - Webhooks: https://docs.stripe.com/webhooks
  - Connect webhooks: https://docs.stripe.com/connect/webhooks
  - Checkout flow: https://docs.stripe.com/payments/checkout/how-checkout-works
- next-intl: https://next-intl.dev/docs

## GitHub Repos Worth Tracking (Skills + Patterns)

- OpenAI official skills library: https://github.com/openai/skills
- OpenAI Codex (docs + examples): https://github.com/openai/codex
- Agent Skills standard + ecosystem: https://github.com/agentskills/agentskills
- Community examples:
  - https://github.com/robanderson/claude-my-skills
  - https://github.com/feiskyer/codex-settings
  - https://github.com/cokac/awesome-agent-skills

