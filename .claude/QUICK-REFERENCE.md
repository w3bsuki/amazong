# Claude Code Setup - Quick Reference

## 🤖 Custom Agents (`/agents`)

| Agent | Trigger | Use For |
|-------|---------|---------|
| `code-reviewer` | After code changes | Security, caching, style review |
| `debugger` | Errors, failures | Build errors, runtime bugs, hydration |
| `refactor-planner` | Tech debt | Plan incremental rewrites |
| `slop-hunter` | Cleanup | Find/delete AI-generated bloat |
| `test-fixer` | Test failures | Fix unit/E2E tests |

**Usage**: Claude auto-delegates, or say "Use the debugger agent to..."

---

## ⚡ Slash Commands

| Command | Description |
|---------|-------------|
| `/commit` | Generate commit message from staged changes |
| `/gates` | Run typecheck + E2E smoke tests |
| `/review` | Review recent code changes |
| `/debug [error]` | Debug an error or failure |
| `/fix-tests [file]` | Fix failing tests |
| `/hunt-slop [path]` | Find and eliminate AI slop |
| `/plan-refactor [path]` | Plan incremental refactor |

---

## 🎯 Skills (Auto-Triggered)

| Prefix | Skill | Use For |
|--------|-------|---------|
| `TREIDO:` | treido-dev | Daily workflow, pick TODO, execute |
| `TAILWIND:` | tailwind-audit | UI/theme/spacing audit |
| `SUPABASE:` | supabase-audit | RLS, perf, security audit |

---

## 🔧 Hooks (Automatic)

- **PostToolUse (Write/Edit)**: Reminds to run `/gates`
- **SessionStart**: Shows git status, available commands
- **UserPromptSubmit**: Injects project context

---

## 📋 Verification Gates

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E Smoke (with existing dev server)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## 🗂️ File Structure

```
.claude/
├── agents/           # Custom subagents
│   ├── code-reviewer.md
│   ├── debugger.md
│   ├── refactor-planner.md
│   ├── slop-hunter.md
│   └── test-fixer.md
├── commands/         # Slash commands
│   ├── commit.md
│   ├── debug.md
│   ├── fix-tests.md
│   ├── gates.md
│   ├── hunt-slop.md
│   ├── plan-refactor.md
│   └── review.md
├── rules/            # Project rules (auto-loaded)
├── skills/           # Agent skills
├── settings.json     # Permissions + hooks
└── CLAUDE.md         # Project memory
```

---

## 🚀 Daily Workflow

1. `TREIDO: pick a task` - Get next TODO item
2. Make changes (1-5 files max)
3. `/review` - Check your work
4. `/gates` - Verify shippable
5. `/commit` - Generate commit message
6. Repeat

For big reworks: `/plan-refactor path/to/mess`
For AI slop: `/hunt-slop path/to/check`
