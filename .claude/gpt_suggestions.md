# GPT Suggestions for Claude Agents

Goal: make each agent sharper, faster, and more reliable in its own domain.

## Can I use these agents?
Yes. I can follow the same workflows and output formats defined in
`.claude/agents/*.md`. I will not auto-delegate like Claude, but if you say
"Use the slop-hunter agent to scan components for AI bloat" I will apply that
agent's rules and output format.

---

## Global Improvements (apply to all agents)

1) Add "Entry Criteria" and "Exit Criteria" to each agent.
   - Entry: required inputs before running (logs, paths, commands, repro steps).
   - Exit: explicit verification checklist (gates + specific route checks).

2) Add "Scope Guardrails":
   - Max files touched per task (1-3, or 5 if same behavior).
   - No redesigns; no new architectures; preserve styling.
   - No secrets in logs, no dumping full request bodies.

3) Add "Evidence First" requirement:
   - Always cite file/line or log snippet in findings.
   - Avoid general statements without references.

4) Add "Cost-aware defaults":
   - Minimize SSG count, use `generateStaticParams` only when necessary.
   - Avoid `select('*')`, avoid wide joins in list views.
   - Prefer `createStaticClient` inside cached functions.

5) Add "i18n enforcement":
   - Require new strings to be added to `messages/en.json` + `messages/bg.json`.
   - Block raw strings in UI unless already localized.

---

## Agent-Specific Strengthening

### code-reviewer
Add these checks:
- Next.js cache rules: `cacheLife('<profile>')` is present for any `use cache`.
- `revalidateTag(tag, profile)` uses 2 args.
- Check for accidental dynamic calls in cached code (`cookies`, `headers`).
- Supabase: `createClient` only in request scope; admin client only for internal ops.
- Tailwind: no gradients; no arbitrary values unless justified.

Add a quick "Diff Summary" block:
- List changed files + purpose (from code).
- Flag any unrelated or risky changes (scope creep).

Suggested output additions:
- "Tests Missing" section listing which gates were skipped.

### debugger
Add "Fast Triage" step (2 minutes):
- Confirm environment (local vs Vercel).
- Collect the smallest failing command and error snippet.
- Identify the first failing route/file.

Add "Production-first" debug path:
- Vercel logs: `vercel inspect --logs <url>` (if deploy related).
- Confirm build phase: install, build, typecheck, SSG, deploy outputs.

Add "Failure Taxonomy":
- Build OOM -> reduce SSG or make route dynamic.
- `_not-found` + next-intl -> set request locale explicitly.
- Pre-render fetch rejected -> mark dynamic (`connection()`).

### refactor-planner
Add required metrics:
- File size, export count, import count.
- Hot-path or critical route identification.

Add step constraints:
- Each step is 1-3 files; each step is shippable.
- Each step lists exact verification commands.

Add "Rollback" detail:
- File-level rollback instructions (revert specific file only).

### slop-hunter
Add "Hunt Targets" presets:
- `_components`, `components/common`, `components/layout`.
- Files > 250 LOC or components < 10 LOC.

Add "Preserve Behavior" clause:
- Simplify without changing UI or behavior.
- Do not delete if used in more than one route group unless verified.

Add "Delete vs Inline" rubric:
- Delete unused wrappers.
- Inline 1-liner components.
- Collapse over-typed types only when they add no semantics.

### test-fixer
Add "Triage Matrix":
- Is it a test bug, product bug, or env flake?
- Default to product bug unless proven otherwise.

Add "Minimal Fix" rule:
- No refactors while fixing tests.
- Prefer explicit waits over timeouts.

Add "Verification" details:
- Run targeted spec first, then smoke gate.

---

## Workflow Proposals (cross-agent)

1) "Deploy-safe" flow:
   - change -> `/review` -> `/gates` -> deploy
   - requires passing typecheck + smoke before deploy.

2) "SSG Health" audit:
   - Count static pages, identify top SSG generators.
   - Cap SSG on heavy routes; prefer dynamic fallback.

3) "Supabase Health" audit:
   - Check RLS policy coverage.
   - Verify no `select('*')` in list views.

4) "UI Slop Sweep":
   - Run `slop-hunter` on `components/common` and `app/**/_components`.
   - Remove redundant wrappers + verbose comments.

---

## Example Prompts (ready to use)

- "Use the code-reviewer agent to review the last 3 files touched."
- "Use the debugger agent to investigate the build failure from Vercel logs."
- "Use the refactor-planner agent to split `app/[locale]/(main)/search/page.tsx`."
- "Use the slop-hunter agent to scan `components/common` for AI bloat."
- "Use the test-fixer agent to fix failing Playwright smoke tests."

---

## Optional Add-ons

- Add a `deployment-ops` agent focused on Vercel builds, cache, and ISR cost.
- Add a "security-audit" agent for Supabase RLS + Next.js auth flows.

If you want, I can draft those agents too.
