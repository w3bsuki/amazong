---
description: Hunt for AI slop in the codebase
argument-hint: [path or pattern]
---

## Slop Hunt: $ARGUMENTS

Use the **slop-hunter** agent to find and eliminate AI slop in the specified area.

Focus areas:
- Verbose comments that restate code
- Over-abstracted components and hooks
- Unnecessary type aliases
- Cargo-culted patterns
- Over-organized file structures

Target: `$ARGUMENTS` (or entire codebase if blank)

Be aggressive. Less code > more code. Delete > refactor.
