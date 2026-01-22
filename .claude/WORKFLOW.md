# Agent Workflow (Spec → Execute → Verify)

This repo works best when you run a tight loop: spec a small slice → ship it → verify → record progress.

## The Core Loop

1. Pick one task
   - If stuck: use `COORD:` to pick the best next task from `TODO.md` + `codex-xhigh/STATUS.md`.
2. Define “done”
   - One sentence outcome + acceptance criteria (what you will verify).
3. Spec (only when needed)
   - If the task is bigger than ~3 files or unclear, run `SPEC:` first.
4. Execute with the right role
   - UI work: `FRONTEND:`
   - Backend/data/payments: `BACKEND:`
   - Refactor-only: `REFACTOR:` (plan-first if large)
   - Tests/flakes: `TEST:`
5. Run specialist audits only when they apply
   - UI drift: `TAILWIND:` / `SHADCN:`
   - Caching/boundaries: `NEXTJS:`
   - i18n parity/routing: `I18N:`
   - RLS/migrations: `SUPABASE:`
   - TS drift: `TS:`
   - Accessibility/perf: `A11Y:` / `PERF:`
   - Payments: `STRIPE:`
6. Review + gates
   - `/review` (code-reviewer agent)
   - `/gates` (typecheck + e2e smoke)
7. Record progress
   - Check the item in `TODO.md`.
   - Update `codex-xhigh/STATUS.md` (phase/blockers) when relevant.

## Prompt Templates (Copy/Paste)

### Coordinator (when stuck)

```text
COORD: I have <45m/2h/today>. Pick the single best next task that unblocks shipping.
Constraints: <no refactors / no schema changes / preserve UI>.
Output: an execution card + copy/paste prompts for the right roles.
```

### Spec pack (when scope is unclear)

```text
SPEC: Write a one-page spec + task breakdown for: <feature>.
Constraints: <no new deps / keep existing routes / etc>.
Include: UX states, data/auth notes, cache/invalidation, i18n keys, verification.
Output: copy/paste prompts for FRONTEND/BACKEND/SUPABASE/TEST as needed.
```

### Frontend execution

```text
FRONTEND: Implement <UI change>.
Paths: <app/.../page.tsx, components/...>.
Constraints: no gradients, no arbitrary Tailwind values, all strings via next-intl.
Verify: tsc + e2e:smoke (+ styles:scan if needed).
```

### Backend execution

```text
BACKEND: Implement <server action/route/webhook>.
Entrypoint: <path>.
Constraints: no secrets in logs, avoid select('*') in hot paths, keep boundaries clean.
Verify: tsc + e2e:smoke (+ unit tests if area already covered).
```

## Anti-Loop Rules (Avoid Context Loss)

- Keep one source of truth for the task: a spec file or a single TODO item.
- Don’t start implementing until “done” is written down.
- If a task crosses lanes (UI + DB + caching), run `SPEC:` and then execute lane-by-lane.
- Prefer shipping a smaller slice today over “finishing the whole system”.
