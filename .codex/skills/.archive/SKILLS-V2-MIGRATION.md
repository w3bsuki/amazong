# Skills V2 Migration (Treido)

This is the practical migration guide from the previous “agent fleet” model (V1) to the simplified “skills are rules + rails” model (V2).

---

## Target State (V2)

Active skills (validated + synced):

- `treido-rails` — project-wide rails, pause conditions, verification gates
- `treido-frontend` — UI/routes/Tailwind v4 tokens/next-intl rules
- `treido-backend` — server actions/Supabase/Stripe/caching rules
- `codex-iteration` — keeps the skill system itself healthy

Legacy skills:

- Archived for reference only under `.codex/skills/.archive/`

---

## Migration Steps

### 1) Keep the legacy system, but archive it

- Move old skills into `.codex/skills/.archive/`
- Do **not** validate/sync archived skills as active skills

### 2) Update SSOT docs to V2 (no prefixes/triggers)

Required docs:

- `docs/AGENTS.md` — entry point + non-negotiables + pause conditions
- `docs/WORKFLOW.md` — “frame → implement → verify”, no audit theater unless requested
- `docs/11-SKILLS.md` — inventory + where legacy lives
- `docs/PROMPT-GUIDE.md` — prompt packet without `ORCH:`/`FRONTEND:` prefixes

### 3) Validate + sync

```bash
pnpm -s validate:skills
pnpm -s skills:sync
```

---

## Is an “Opus audit” justified?

There is an Opus-authored skills audit in `.codex/audit/archive/OBSOLETE_AGENT_SKILLS_AUDIT_2026-01-29.md`. It’s useful as a *historical* idea bank (examples, anti-pattern lists), but it is **not justified as an authoritative gate** for V2 migration because:

1) It’s explicitly archived/obsolete.
2) It contains repo-state claims that can drift quickly (skills/docs changed substantially since 2026-01-29).
3) The “best” part of Opus (teaching intent) is better handled by porting selective content into `references/` and keeping production skills short + enforceable.

### Recommendation

- **Do not require an Opus audit** as a migration step.
- Use deterministic checks instead:
  - `pnpm -s validate:skills`
  - `pnpm -s skills:sync`
  - `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate`
- If you want the *benefits* of Opus, selectively port:
  - concrete code examples
  - explicit anti-patterns
  - short checklists

---

## Acceptance Checks

- [ ] Docs do not mention `ORCH:` / `FRONTEND:` / `BACKEND:` / `VERIFY:` triggers (outside `docs/archive/**`)
- [ ] `pnpm -s validate:skills` passes
- [ ] `pnpm -s skills:sync` succeeds
- [ ] Gates pass: `pnpm -s typecheck`, `pnpm -s lint`, `pnpm -s styles:gate`

