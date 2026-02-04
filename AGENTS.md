# AGENTS.md

**All stable documentation lives in `/docs/`.**

## Project (Quick Context)

- **Product**: Treido marketplace (BG-first)
- **Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase + Stripe + next-intl
- **Non-negotiables**: next-intl for copy, Tailwind v4 tokens only, cached-server rules, no secrets/PII

## FORBIDDEN — Never Create These Folders

**DO NOT create, copy, or mirror skills/config to these folders:**
- `.agent/`, `.agents/`, `.cursor/`, `.gemini/`, `.kiro/`, `.qoder/`, `.qwen/`, `.trae/`, `.windsurf/`

**Allowed AI config folders (ONLY these):**
- `.claude/` — Claude/Anthropic config
- `.codex/` — Treido agent skills and operational state

Creating folders for "other AI tools" is bloat and forbidden. This repo uses `.claude/` and `.codex/` only.

## Start Here

- **How to prompt AI**: [docs/PROMPT-GUIDE.md](docs/PROMPT-GUIDE.md)
- **Agent entry point**: [docs/AGENTS.md](docs/AGENTS.md)
- **Dev department (roles/ownership)**: [docs/15-DEV-DEPARTMENT.md](docs/15-DEV-DEPARTMENT.md)
- **All docs index**: [docs/00-INDEX.md](docs/00-INDEX.md)
- **Workflow spec**: [docs/WORKFLOW.md](docs/WORKFLOW.md)

## Docs (SSOT)

- **SSOT**: `docs/**` (start at `docs/00-INDEX.md`)
- **Internal portal (not SSOT)**: `docs-site/` (mirrors from `/docs`)
- **Admin ops docs (not SSOT)**: `/admin/docs` (Supabase `admin_docs`, editable)
- **Public legal/policies/help**: main app routes (`/[locale]/…`), sourced from `docs/public/**`

## Folder Rules (AGENTS.md)

- `app/AGENTS.md`
- `app/actions/AGENTS.md`
- `components/AGENTS.md`
- `components/ui/AGENTS.md`
- `hooks/AGENTS.md`
- `i18n/AGENTS.md`
- `messages/AGENTS.md`
- `lib/AGENTS.md`
- `lib/supabase/AGENTS.md`
- `supabase/AGENTS.md`

## Operational State (Runtime)

- Active tasks: [.codex/TASKS.md](.codex/TASKS.md)
- Shipped log: [.codex/SHIPPED.md](.codex/SHIPPED.md)
- Decisions: [.codex/DECISIONS.md](.codex/DECISIONS.md)
- Refactor workspace: [.codex/refactor/](.codex/refactor/)

## Skills (primary, auto-applied by context)

| Skill | File |
|-------|------|
| Frontend | `.codex/skills/treido-frontend/SKILL.md` |
| Backend | `.codex/skills/treido-backend/SKILL.md` |
| Rails | `.codex/skills/treido-rails/SKILL.md` |

Full skill inventory: `docs/11-SKILLS.md`
