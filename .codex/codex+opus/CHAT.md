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

