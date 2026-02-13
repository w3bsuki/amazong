# Phase X: <Title>

> Use this template to create or refresh a production-audit phase document.

| Field | Value |
|-------|-------|
| Scope | <what this phase validates> |
| Routes | <routes under test> |
| Priority | <P0 | P1 | P2 | P3> |
| Devices | Pixel 5 (393×851) · iPhone 12 (390×844) |
| Auth Required | <Yes/No> |
| Owner | <name> |
| Last verified | <YYYY-MM-DD> |
| Status | <⬜ Plan | 🧪 Ready | 🔄 In Progress | ✅ Complete | 🔴 Blocked> |

---

## Source Files

| File | Role |
|------|------|
| `<path>` | <why it matters> |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | <prereq> | <command or check> |

---

## Scenarios

### SX.1 — <Scenario Title>

**Goal:** <what to validate>

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | <action> | <detail> |

**Expected:**
- <expected outcome>

---

## Evidence Log (v2)

Fixed columns. Add one row per scenario run (or per sub-scenario if needed).

| Scenario | Method | Artifact | Result | Issue ID | Severity | Owner | Date |
|----------|--------|----------|--------|----------|----------|-------|------|
| SX.1 | runtime | `playwright-report/...` | Pass | — | — | <name> | <YYYY-MM-DD> |

Method suggestions: `runtime` | `code trace` | `manual` (keep it consistent within a phase).

---

## Findings

| ID | Summary | Severity | Status |
|----|---------|----------|--------|
| <ID> | <what failed + why> | <P0..P3> | <Open/Fixed> |

