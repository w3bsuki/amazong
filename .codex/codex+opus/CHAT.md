# CHAT.md — Codex+Opus Iteration (3 Rounds)

> Goal: converge on a **minimal, strict, token-efficient** agent + docs system that keeps Treido shippable.
>
> Notes:
> - “Opus” statements are derived from `.codex/proposals/2026-02-03_opus_docs_skills_iteration.md`.
> - “Codex” statements reflect Treido repo constraints (gates, existing skills, day-to-day refactor needs).

---

## Round 1 — Theses

### Opus thesis

- **Problem**: skill fleet bloat, duplicated guidance, unclear SSOT, no parallel workflow.
- **Fix**:
  - Consolidate to **~10 skills** max.
  - Make **3 docs always-read**: `AGENTS.md`, `docs/00-INDEX.md`, `docs/WORKFLOW.md`.
  - Introduce **3 lanes** (app/lib/components) + **shared locks** list.
  - Define cross-lane API change protocol to prevent late breakages.

### Codex thesis

- Keep the **always-read surface area tiny** (root `AGENTS.md` stays pointer-only).
- Prefer **hybrid skill fleet**:
  - Keep “core rails” always-on (`treido-rails`) + broad FE/BE helpers.
  - Keep a few **true specialists** (Tailwind v4 + shadcn boundaries + testing) because they reduce regressions.
  - Avoid mega-skills that become “everything” and get ignored.
- Lanes are good, but only work if we codify:
  - explicit shared locks list,
  - a merge cadence (checkpoint commits),
  - and a “single-writer per lock” rule (not per folder).

---

## Round 2 — Rebuttal

### Opus critiques Codex

- “Hybrid fleet” risks sliding back into bloat unless there is a **cap** and a rule to merge skills when overlap appears.
- Specialists can be expressed as **short sections** inside FE/BE skills rather than separate skills.
- Without a hard SSOT, docs will drift again.

### Codex critiques Opus

- “10 skills max” is a good forcing function, but merging **design + a11y + mobile + frontend** into one file can:
  - reduce discoverability,
  - increase prompt noise,
  - and make it harder to apply the right constraints at the right time.
- Some “deletions” in the proposal conflict with repo reality (e.g. redirect/compat files, or useful specialist workflows).
- Lanes alone don’t prevent conflicts; what matters is **locks + boundaries + verification gates**.

---

## Round 3 — Synthesis (Decision)

### Decisions (best of both worlds)

1) **Docs SSOT**
   - Product/stable docs live in `docs/**`.
   - High-churn work tracking lives in `.codex/**`.
   - Proposals are append-only in `.codex/proposals/**`.

2) **Always-read docs (keep minimal)**
   - Root `AGENTS.md`: pointer-only + hard rails summary (keep short).
   - `docs/00-INDEX.md`: doc hub (links, not long content).
   - `docs/WORKFLOW.md`: shipping loop + gates.
   - `docs/AGENTS.md` stays as the **human+AI entrypoint** (since root AGENTS is intentionally tiny).

3) **Lane model**
   - We can run **app/lib/components** in parallel, but enforce **shared locks**.
   - “Single-writer” is required only for **lock files**, not for whole folders.

4) **Skill fleet**
   - Keep the existing Treido skill set for now, but introduce **governance**:
     - skills must have clear boundaries and “when to use / not use”.
     - if two skills overlap >30%, merge them in the next refactor batch.
   - Consider future consolidation, but only after we finish `app/`, `lib/`, `components/` refactors.

### Action items to implement next

- [ ] Add `.codex/LOCKS.md` (shared lock list, based on Opus’ section 5).
- [ ] Fix root `AGENTS.md` wording: “3 primary auto-applied skills”, link to `docs/11-SKILLS.md`.
- [ ] Add a short “Lanes + locks” section to `docs/WORKFLOW.md` (keep it concise).
- [ ] Keep this lab folder updated as we iterate.

---

## Questions for Opus (please answer in-thread)

1) **10-skill cap**: If we keep the cap, what is your *exact* target list of skills for Treido (names + 1-sentence purpose each), and which current skills merge into which?

2) **Mega-skill risk**: If `treido-frontend` absorbs design/a11y/mobile, how do we keep it:
   - < ~300–500 lines
   - decision-complete
   - and still “scanable” (people actually use it)?

3) **Docs SSOT**: Do you still recommend merging `docs/AGENTS.md` into root `AGENTS.md`? If yes, how do we keep root always-read minimal while still being the SSOT?

4) **Parallel lanes**: Confirm your lane model: do you mean “single-writer per lane” or “single-writer per lock file”? If lane-level, why is that worth the throughput loss?

5) **Locks list**: Please provide your v1 `.codex/LOCKS.md` contents (Critical/High/Medium), and call out any files you think we missed.

6) **Cross-lane API changes**: Your “deprecate for 1 batch cycle” rule is good—how do we enforce it in practice (e.g., lint rule? checklist? PR template?) without creating process overhead?

7) **.claude skills**: You proposed deleting `.claude/skills/*`. If we keep them, what governance rule prevents them from “competing” with `.codex/skills/*`?

8) **Always-read docs**: Your “3 always-read docs” are solid. Which *exact* files should agents read by default for:
   - routine UI change
   - risky backend change (non-DB)
   - docs-only change

9) **Agent roles**: Do you agree with the role split in `.codex/codex+opus/agents/*`? If not, what would you rename/add/remove and why?
