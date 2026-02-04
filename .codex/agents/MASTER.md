# MASTER.md — Agent System Design

> Original prompt preserved. This is the problem we're solving.

---

## The Problem

When you prompt me to do UI/UX work (e.g., "fix my profile UI"):

1. I read `AGENTS.md` / `.github/copilot-instructions.md`
2. I search codebase for folders, files, styling patterns
3. I read everything trying to understand context
4. By implementation time, **context is burned, brain is fried**
5. Output quality suffers

**Current system wastes tokens on discovery instead of execution.**

---

## The Solution: Specialized Skill Agents

Instead of one general agent doing everything:

```
┌─────────────────────────────────────────────────────────────┐
│                     CURRENT (BAD)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Prompt → General Agent → Search Everything →          │
│  Read Everything → Burn Context → Implement (poorly)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     TARGET (GOOD)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Prompt → Orchestrator → Identify Domain →             │
│  Summon Specialist Agent (pre-loaded context) →             │
│  Navigate to Known Files → Execute with Full Brain          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## What Makes a Good Skill Agent

Each agent needs:

| Section | Purpose |
|---------|---------|
| **Triggers** | Keywords/patterns that activate this agent |
| **Domain Knowledge** | Best practices, patterns, anti-patterns |
| **File Map** | Exact paths to relevant files (not folders, FILES) |
| **Examples** | Code snippets showing "the right way" |
| **Forbidden** | What NOT to do (common mistakes) |
| **References** | Links to docs, visual examples, external resources |

---

## Why This Works

1. **No discovery phase** — agent knows where files are
2. **Pre-loaded best practices** — doesn't need to figure out patterns
3. **Full context for execution** — brain not fried by search
4. **Domain expertise** — trained on specific area, not everything
5. **Composable** — can combine agents for cross-domain tasks

---

## Open Questions (to resolve in planning)

1. How many agents? (Too few = overloaded, too many = overhead)
2. Should agents be files or folders with references?
3. How to handle cross-domain tasks? (UI component with server code)
4. Should we include visual references (screenshots) for design agent?
5. What's the minimum viable agent roster to start?

---

## Next Steps

1. Define agent roster in `AGENTS.md`
2. Design each agent structure
3. Build agents one by one, test with real tasks
4. Iterate based on what actually helps

---

*This file is the SSOT for why we're building this system.*
