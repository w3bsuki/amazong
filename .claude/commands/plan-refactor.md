---
description: Plan a refactor for a target area
argument-hint: [file or directory path]
---

## Refactor Plan: $ARGUMENTS

Use the **refactor-planner** agent to create an incremental refactor plan.

Target: `$ARGUMENTS`

Requirements:
1. Map current state (file sizes, complexity, issues)
2. Define concrete goal state
3. Create step-by-step plan where each step is deployable
4. Include verification gates for each phase
5. Provide rollback strategy

No big bang rewrites. Each step must be independently shippable.
