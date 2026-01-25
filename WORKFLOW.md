# Workflow (SSOT)

Simple development loop for this repo.

## The Loop

```
1. Read PRD.md        → Understand what we're building
2. Check FEATURES.md  → What's built (✅) vs pending (⬜)?
3. Check TASKS.md     → Pick a task or create new
4. Implement          → Small batch, 1-3 files max
5. Verify             → Run gates (typecheck + e2e:smoke)
6. Update             → Mark task done, update FEATURES.md if feature ships
```

## Roles (Claude ↔ Codex)

- **Opus/Claude**: implement, fix, create
- **Codex**: verify, review, run gates, prevent regressions

## Rails (Non-Negotiable)

- No secrets/PII in logs
- All user-facing strings via `next-intl` (`messages/en.json` + `messages/bg.json`)
- No gradients; no arbitrary Tailwind values
- Small, verifiable batches (no rewrites / no redesigns)

## Canonical Docs (Root)

### Core Workflow (Always Read)

| Doc | Purpose |
|-----|---------|
| `CLAUDE.md` | Agent entry point |
| `PRD.md` | Product vision, scope, roadmap |
| `FEATURES.md` | Feature checklist (✅/🚧/⬜) |
| `TASKS.md` | Current sprint tasks |
| `ISSUES.md` | Bug/issue registry |

### Reference (Read When Needed)

| Doc | Purpose |
|-----|---------|
| `ARCHITECTURE.md` | Stack, boundaries, caching, backend |
| `DESIGN.md` | UI tokens, patterns |
| `TESTING.md` | Gates, debugging |
| `PRODUCTION.md` | Deployment checklist |
| `REQUIREMENTS.md` | Detailed requirements |

### Detailed PRDs

- Located in `docs-site/content/business/specs/`

### Legacy/Archive

- Located in `docs-final/archive/` (reference only)

## Task Writing Rules

- Each task references an issue: `(ISSUE-####)` when applicable
- Include verification note ("how we know it's done")
- Keep tasks small (≤ 1 day)
- If task changes scope, update `FEATURES.md` in the same batch

---

*Last updated: 2026-01-25*

