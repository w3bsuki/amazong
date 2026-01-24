# Tasks: P0 Turbopack Crash

> Last updated: 2026-01-23
> Status: Not Started

---

## Phase 1: Investigation

- [ ] **1.1** Reproduce crash — capture exact error message
- [ ] **1.2** Search for OnboardingProvider — trace import chain
- [ ] **1.3** Check auth layout — identify client/server boundary issues
- [ ] **1.4** Document findings in `context.md`

## Phase 2: Fix

- [ ] **2.1** Fix identified boundary violation
- [ ] **2.2** Test with Turbopack (`pnpm dev`)
- [ ] **2.3** Test with Webpack (`pnpm dev --webpack`)

## Phase 3: Verify

- [ ] **3.1** Run `tsc --noEmit` — PASS
- [ ] **3.2** Run `e2e:smoke` — PASS
- [ ] **3.3** Manual QA: sign in flow works
- [ ] **3.4** Codex review + approval

---

## Completion Criteria

All tasks checked + Codex approval = move to `completed/`
