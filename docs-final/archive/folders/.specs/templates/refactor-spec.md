# Refactor Spec: {{REFACTOR_NAME}}

> Created: {{DATE}}
> Status: Queue | Active | Completed | Blocked
> Owner: Claude (impl) | Codex (verify)
> Risk Level: {{Low|Medium|High}}

---

## Goal

**Improve** {{what aspect — performance, maintainability, clarity}}
**Without** changing external behavior

## Non-Goals

- No feature changes
- No API/schema changes (unless explicitly stated)
- No new dependencies

---

## Current State

### Problem
{{Describe the issue with current code}}

### Location
- `{{path/to/file1.tsx}}` — {{what's wrong}}
- `{{path/to/file2.ts}}` — {{what's wrong}}

### Impact
- {{How this affects development/performance/maintainability}}

---

## Target State

### Desired Outcome
{{What the code should look like after refactor}}

### Success Criteria
- [ ] {{Measurable criterion 1}}
- [ ] {{Measurable criterion 2}}
- [ ] External behavior unchanged (verified by tests)

---

## Refactor Strategy

### Approach
- [ ] **Extract**: Pull out reusable logic
- [ ] **Consolidate**: Merge duplicated code
- [ ] **Rename**: Improve naming clarity
- [ ] **Restructure**: Change file/folder organization
- [ ] **Simplify**: Remove unnecessary complexity

### Safety Rails
- [ ] Existing tests pass before AND after
- [ ] No new `any` types introduced
- [ ] No new arbitrary Tailwind values
- [ ] Type-check passes throughout

---

## Tasks (Incremental)

> Each task must leave the codebase in a working state

### Task 1: {{Description}}
- **Files**: `{{path}}`
- **Change**: {{What exactly changes}}
- **Verify**: `tsc --noEmit` + run affected tests

### Task 2: {{Description}}
- **Files**: `{{path}}`
- **Change**: {{What exactly changes}}
- **Verify**: {{How to verify}}

### Task 3: {{Description}}
- **Files**: `{{path}}`
- **Change**: {{What exactly changes}}
- **Verify**: {{How to verify}}

---

## Verification

### Before Starting
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit` — PASS
- [ ] `pnpm test:unit` — {{X}} tests pass
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` — PASS

### After Each Task
- [ ] Same gates pass
- [ ] No new errors introduced

### After Completion
- [ ] All gates pass
- [ ] Test count unchanged or improved
- [ ] No behavioral regressions (manual spot check if needed)

---

## Rollback Plan

**If something breaks:**
1. `git stash` or `git checkout -- <file>`
2. Re-run gates to confirm working state
3. Investigate in smaller increments

**Safe to merge when:**
- All tasks completed
- All verification gates pass
- Codex approval received

---

## Agent Prompts

### REFACTOR
```
REFACTOR: {{Specific refactor task}}
Files: {{paths}}
Strategy: {{extract|consolidate|rename|simplify}}
Constraint: No behavior change, tests must pass
```

### Verify Unchanged Behavior
```
TEST: Verify {{area}} behavior unchanged after refactor
Run: `pnpm test:unit --testPathPattern={{pattern}}`
Check: Output matches pre-refactor baseline
```
