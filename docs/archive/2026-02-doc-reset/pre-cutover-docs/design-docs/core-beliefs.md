# Core Beliefs — Treido Agent-First Operating Principles

> These are the foundational beliefs that shape how work is done in this repository.
> Modeled after OpenAI's core-beliefs pattern from Harness Engineering.

---

## 1. Repository Is the Single Source of Truth

Everything an agent needs to do useful work must be discoverable from the repository itself.
Knowledge that lives in Slack, Google Docs, or people's heads is invisible to agents
and therefore effectively does not exist.

**Implication:** When a decision is made, encode it in `docs/`. When a discussion
resolves an ambiguity, write the resolution into the relevant doc. When a pattern
is established, document it or encode it as a lint rule.

---

## 2. AGENTS.md Is a Map, Not an Encyclopedia

`AGENTS.md` is a short table of contents (~170 lines) that tells agents *where to look*.
It is not a monolithic instruction manual. Context is a scarce resource — a giant
instruction file crowds out the task, the code, and the relevant docs.

**Implication:** Keep AGENTS.md lean. When adding new knowledge, add a pointer in
AGENTS.md and create the detailed doc in `docs/`.

---

## 3. Enforce Invariants, Not Implementations

Mechanical enforcement (linters, structural tests, CI gates) keeps the codebase
coherent. We enforce *boundaries* and *correctness*, but allow autonomy in how
solutions are expressed within those boundaries.

**Implication:** When a rule matters, encode it as a test or lint rule — not just
a comment in a doc. Rules that exist only in prose will eventually be violated.

---

## 4. Code Is Runtime Truth

When documentation and code disagree, code is current truth. The fix is always
to update the docs to match reality, then fix the code if the docs were *supposed*
to be right.

**Implication:** Source precedence is: (1) code + migrations, (2) docs/, (3) everything else.

---

## 5. Small Batches, Scoped Changes

Work in small, reviewable batches. Keep changes scoped to the declared paths.
Prefer direct fixes over speculative rewrites. Large changes create merge conflicts,
make review harder, and increase the chance of unintended side effects.

**Implication:** Frame every task with explicit Scope and Non-Goals before implementing.

---

## 6. Pause on High-Risk Domains

Database schema, auth, payments, and destructive operations require human alignment
before finalizing. These systems have irreversible consequences and complex
invariants that are difficult to encode mechanically.

**Implication:** Stop and explicitly align with a human before merging changes to
DB migrations, RLS policies, auth flows, payment logic, or bulk data operations.

---

## 7. Quality Is Mechanical, Not Aspirational

Quality gates must be runnable commands, not prose descriptions of ideals.
A change is correct when it passes `typecheck`, `lint`, `styles:gate`, and
relevant tests. If a quality concern isn't checkable by a command, write a script
or test that makes it checkable.

**Implication:** Every new quality bar must come with a gate command.

---

## 8. Entropy Is the Default — Fight It Continuously

Agent-generated code replicates patterns that already exist, including suboptimal ones.
Without continuous cleanup, drift is inevitable. Technical debt is a high-interest
loan: pay it down continuously in small increments.

**Implication:** Track debt in `docs/exec-plans/tech-debt-tracker.md`. Run cleanup
on a recurring cadence. Grade quality in `docs/QUALITY_SCORE.md`.

---

## 9. Progressive Disclosure Over Information Dump

Agents start with a small, stable entry point (AGENTS.md) and navigate to deeper
context as needed. This is preferable to loading everything upfront, which dilutes
attention and crowds out the actual task.

**Implication:** Structure docs for navigability. Use indexes, cross-links, and
clear headings. Avoid duplicating information across files.

---

## 10. Human Taste Compounds Through Encoding

Human design preferences, architectural opinions, and product judgment are most
valuable when encoded into the repository — as docs, lint rules, tokens, or tests.
A taste preference expressed once and enforced mechanically scales infinitely.

**Implication:** When a reviewer catches a taste issue, the fix should include
both the code change and a rule/doc update that prevents recurrence.

---

*Last updated: 2026-02-12*
