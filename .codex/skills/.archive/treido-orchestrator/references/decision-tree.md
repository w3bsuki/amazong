# treido-orchestrator - Decision Tree (full)

This is the full orchestration decision tree. The SKILL.md includes the summary; this is the "no excuses" version.

---

## Step 0 - Pause conditions (escalate before execution)

If any requested change touches:
- DB schema/migrations/RLS/policies
- Auth/access control
- Payments/Stripe/billing

Then:
1) Run AUDIT first (you can still audit safely).
2) Pause before delegating IMPL. Surface options plus a recommended default.

---

## Step 1 - Choose scope (avoid audit explosions)

If the user provided exact files/routes:
- Use those, but cap to 12 paths.

If the user is vague:
- Use `.codex/TASKS.md` Ready items as scope.

If there are no Ready items:
- Infer scope from request intent (UI vs Next.js vs Supabase), then pick 3-12 likely entrypoints.

Hard limits:
- <=10 findings per specialist.
- <=10 acceptance checks per specialist.
- <=5 risks per specialist.

Escalate if:
- The request implies a multi-week refactor or unclear product scope ("redesign the marketplace").

---

## Step 2 - Select bundle (intent -> specialists -> executor)

Use `.codex/AGENTS.md` bundle matrix (SSOT). Quick map:

- UI polish / tokens / component styling -> `spec-tailwind` + `spec-shadcn` -> `treido-frontend`
- Design execution / lovable-quality UI -> `spec-tailwind` + `spec-shadcn` -> `treido-ui`
- RSC/caching/routing/layouts -> `spec-nextjs` -> `treido-frontend`
- Webhooks/server actions/back-of-house -> `spec-nextjs` + `spec-supabase` -> `treido-backend`
- Schema/RLS/policies/migrations -> `spec-supabase` -> `treido-backend`
- Missing fields / contract gaps -> `treido-alignment` -> `treido-backend` + `treido-frontend`

If multiple bundles apply:
- Run all required specialists in parallel, but keep scope narrow.

---

## Step 3 - Run AUDIT (parallel, read-only)

For each specialist:
- Provide: goal/context (1-2 sentences) plus scope hints (3-12 paths).
- Require: output contract `.codex/skills/treido-orchestrator/references/audit-payload.md`.

If output is not mergeable:
- Reject it and request a re-run in contract format.

---

## Step 4 - MERGE (single writer)

Create `.codex/audit/YYYY-MM-DD_<context>.md` using `new-audit.mjs`.
Paste each specialist's payload verbatim, ordered by bundle.

Lint merged file:
- `node .codex/skills/treido-orchestrator/scripts/lint-audit.mjs .codex/audit/<file>.md`

---

## Step 5 - PLAN (single writer)

Promote findings -> tasks in `.codex/TASKS.md`:
- Each task has: Priority, Owner, Verify commands, Files list, Audit reference.
- Keep tasks executable: 1-3 files per batch.
- Enforce limits: <=20 total tasks; <=15 Ready.

Lint tasks:
- `node .codex/skills/treido-orchestrator/scripts/lint-tasks.mjs`

---

## Step 6 - Delegate IMPL (one lane at a time)

If tasks are frontend-owned:
- Delegate to `treido-frontend` with `IMPL:` mode plus the task blocks.

If tasks are backend-owned:
- Delegate to `treido-backend` with `IMPL:` mode plus the task blocks.

If tasks are design-owned:
- Delegate to `treido-ui` with `IMPL:` mode plus the task blocks.

Never let two lanes patch simultaneously.

---

## Step 7 - VERIFY

After each implementation batch:
- Request `VERIFY:` to run gates plus the smallest relevant tests.

If verify fails:
- Promote a single "Fix verify failures" task and delegate the smallest patch.

