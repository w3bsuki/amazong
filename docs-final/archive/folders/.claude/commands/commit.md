---
allowed-tools: Bash(git:*)
description: Generate a commit message from staged changes
---

## Context
- Staged changes: !`git diff --staged --stat`
- Detailed diff: !`git diff --staged`
- Branch: !`git branch --show-current`

## Task

Generate a conventional commit message for the staged changes.

Format: `type(scope): brief description`

Types: feat, fix, refactor, style, docs, test, chore

Rules:
- Summary under 50 chars
- Body explains WHAT and WHY, not HOW
- Reference related issues if obvious

Then show the commit command (don't execute):
```bash
git commit -m "type(scope): message"
```
