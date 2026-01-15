# Dual-AI Collaboration Protocol

> How Claude Opus 4.5 and GPT 5.2 XHIGH Codex work together on Treido

## 🎭 Role Definitions

### Opus (Claude Opus 4.5) — The Executor
**Capabilities:**
- Full MCP access: Supabase queries, file editing, terminal commands
- Next.js DevTools integration for runtime debugging
- Playwright browser automation for E2E testing
- shadcn component generation
- Real-time codebase access

**Responsibilities:**
- Execute code changes
- Run database queries and migrations
- Perform audits with actual data
- Validate changes with tests
- Document executed work

### Codex (GPT 5.2 XHIGH) — The Architect
**Capabilities:**
- Code review and analysis
- Architectural planning
- Spec and PRD writing
- Edge case identification
- Pattern recognition across large codebases

**Responsibilities:**
- Review Opus's proposals and implementations
- Challenge assumptions
- Identify missed edge cases
- Ensure consistency with existing patterns
- Approve/reject approaches before execution

---

## 🔄 Workflow Patterns

### Pattern 1: Feature Implementation
```
1. [Human]  Requests feature
2. [Opus]   Researches codebase, drafts implementation plan
3. [Opus]   Posts plan to GPT+OPUS/conversations/
4. [Codex]  Reviews, suggests improvements or approves
5. [Opus]   Executes implementation
6. [Opus]   Posts diff summary for review
7. [Codex]  Final review, spots issues
8. [Opus]   Fixes issues, runs tests, marks ✅ EXECUTED
```

### Pattern 2: Bug Fix
```
1. [Human]  Reports bug
2. [Opus]   Investigates with MCP tools, identifies root cause
3. [Opus]   Posts diagnosis + proposed fix
4. [Codex]  Validates diagnosis, checks for related issues
5. [Opus]   Implements fix + regression test
6. [Codex]  Reviews test coverage
7. [Opus]   Merges, marks ✅ EXECUTED
```

### Pattern 3: Technical Decision
```
1. [Human]  Asks architectural question
2. [Opus]   Gathers context, proposes options
3. [Codex]  Evaluates options, proposes alternative
4. [Both]   Debate in conversation file
5. [Human]  Breaks tie if needed
6. [Opus]   Documents decision in decisions/DEC-XXX.md
```

### Pattern 4: Audit
```
1. [Human]  Requests audit (UI, security, performance, etc.)
2. [Opus]   Runs automated scans, queries databases
3. [Opus]   Posts raw findings
4. [Codex]  Categorizes, prioritizes, identifies patterns
5. [Both]   Create actionable audit doc in audits/
```

---

## 📝 Conversation File Format

```markdown
# GPT + OPUS Collaboration: Conversation XXX

**Date**: YYYY-MM-DD
**Topic**: [Brief topic description]
**Status**: 🟡 OPUS PROPOSING | 🟣 CODEX PROPOSING | 🟢 AGREED | 🔴 CONTESTED

---

## Context
[What problem are we solving? What's the current state?]

## Opus's Analysis
[Research findings, data, proposed approach]

## Questions for Codex
1. [Specific question]
2. [Specific question]

---

## Codex's Response
[To be filled by Codex]

---

## Resolution
[Final agreed approach or escalation to human]
```

---

## 🏷️ Status Markers

| Marker | Meaning | Next Action |
|--------|---------|-------------|
| 🟡 OPUS PROPOSING | Opus made proposal | Codex reviews |
| 🟣 CODEX PROPOSING | Codex made proposal | Opus reviews |
| 🟢 AGREED | Both aligned | Opus executes |
| 🔴 CONTESTED | Disagreement | Human decides |
| ✅ EXECUTED | Work complete | Close file |
| ⏸️ PARKED | Deprioritized | Revisit later |

---

## 📁 File Organization

```
GPT+OPUS/
├── README.md                 # Index and quick links
├── PROTOCOL.md               # This file
├── conversations/            # Active discussions
│   ├── CONVERSATION-001.md
│   ├── CONVERSATION-002.md
│   └── ...
├── decisions/                # Finalized architectural decisions
│   ├── DEC-001-topic.md
│   └── ...
├── specs/                    # Product and technical specs
│   ├── PRD-feature.md        # Product requirements
│   ├── SPEC-technical.md     # Technical specifications
│   └── ...
├── audits/                   # Completed audits
│   ├── AUDIT-ui-ux.md
│   ├── AUDIT-security.md
│   └── ...
└── checklists/               # Operational checklists
    ├── CHECKLIST-launch.md
    └── ...
```

---

## 🎯 Success Criteria

A collaboration is successful when:
1. Both AIs understand the problem
2. Edge cases are identified before execution
3. Implementation matches agreed approach
4. Tests pass (tsc + e2e:smoke minimum)
5. Work is documented for future reference

---

## ⚡ Efficiency Rules

1. **Don't duplicate work** — Opus has MCP, use it for data gathering
2. **Be specific** — Vague questions get vague answers
3. **Include context** — File paths, line numbers, error messages
4. **One topic per conversation** — Keeps discussions focused
5. **Close completed conversations** — Move to decisions/ or mark ✅
6. **Escalate blockers fast** — If stuck, involve human within 2 rounds
