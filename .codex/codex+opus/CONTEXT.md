# CONTEXT.md — Treido Agent + Docs System (Consolidated)

This is the current **decision** for how we keep Treido clean while refactoring aggressively.

## North Star

- Reduce useless LOC by ~50% without behavior regressions.
- Keep “how to work here” extremely easy for humans + AI.
- Minimize token waste: small always-read docs, strict boundaries, high signal.

---

## SSOT (Where Things Live)

### Stable docs (product + engineering)

- `docs/**` is the SSOT for stable documentation.
- Keep docs **link-heavy** and concise; avoid duplicate explanations across multiple docs.

### High-churn ops (runtime)

- `.codex/**` is for:
  - active task queues (`.codex/TASKS.md`)
  - shipped log (`.codex/SHIPPED.md`)
  - decisions (`.codex/DECISIONS.md`)
  - refactor workspace (`.codex/refactor/**`)
  - proposals (`.codex/proposals/**`)

---

## Always-read surface area (keep tiny)

1) Root `AGENTS.md` — quick context + pointers + rails
2) `docs/00-INDEX.md` — doc hub
3) `docs/WORKFLOW.md` — shipping loop + verification gates
4) `docs/AGENTS.md` — full agent entrypoint (read when doing non-trivial work)

Rationale: root `AGENTS.md` is read constantly, so it must stay short. Everything else is linked.

---

## Parallel Work Model (Lanes + Locks)

### Lanes

- **app lane**: `app/**` (routes, RSC boundaries, route-private UI/actions)
- **components lane**: `components/**` (shared composites + `components/ui` primitives)
- **lib lane**: `lib/**` (pure utilities, Supabase clients, shared types)

Working in multiple terminals is fine **as long as** each terminal stays within its lane **and** respects locks.

### Locks (single-writer rule)

We enforce single-writer **only** for shared lock files (cross-cutting blast radius), not for entire folders.

Implementation target: `.codex/LOCKS.md` (planned).

---

## Agent Team (Roles)

We operate as a “dev team” of specialists. The orchestrator owns coordination; specialists own correctness in their domain.

- **Orchestrator**: decomposes work into lanes/batches, delegates audits, merges safely.
- **Frontend**: Next.js UI + RSC/client boundaries + i18n hygiene.
- **Backend**: server actions + Supabase + Stripe; enforces pause conditions.
- **Design**: UI/UX quality, hierarchy, interaction, mobile feel.
- **Tailwind**: Tailwind v4 token rails + forbiddens; fixes styles gate failures.
- **shadcn**: `components/ui/*` primitives boundary + Radix composition + CVA discipline.
- **Testing**: Playwright/unit strategy, selectors, deflaking, CI stability.
- **Docs**: keeps `docs/**` coherent, deduped, indexed; maintains “always-read” minimalism.
- **Security**: PII/logging/secrets rails; reviews auth/payments surface changes.

Role playbooks live in `agents/*.md`.

---

## Skill Fleet Governance (Anti-bloat)

We keep skills only if they:

1) encode Treido-specific rails/gates (not generic web advice),
2) prevent recurring regressions,
3) reduce token waste (short, scoped, high-signal),
4) have a clear “when to use / not use”.

If two skills overlap >30% in practice, schedule a merge batch after the current folder refactor.

---

## Implementation Notes (for upcoming refactor work)

- For folder refactors, follow `.codex/refactor/ORCHESTRATION.md` and update the relevant `.codex/refactor/_*.md`.
- Ship in small batches (1–3 files) and run gates from `docs/WORKFLOW.md`.
- Use lane model to parallelize: app/lib/components can move simultaneously if lock files are coordinated.

