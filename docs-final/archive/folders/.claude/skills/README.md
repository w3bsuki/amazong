# Claude Skills Guide for Treido

## What Are Claude Skills?

Skills are **folders of instructions, scripts, and references** that Claude loads dynamically to improve performance on specialized tasks. Think of them as "expert knowledge modules."

When triggered, Claude:
1. Reads the `SKILL.md` frontmatter (name, description)
2. Loads the main instructions
3. Can access additional `references/` files on demand

## How Skills Get Triggered

Claude decides when to load a skill based on whether the **user request matches the skill's `description`**. In Treido we primarily use explicit prefix triggers (deterministic):

- `TREIDO:` (daily workflow)
- `COORD:` (orchestration: pick next spec/task)
- `SPEC:` (spec writing: create/update `.specs/*`)
- `BACKEND:` (routes, server actions, Supabase, Stripe)
- `FRONTEND:` (UI/components, styling, i18n)
- `REFACTOR:` (incremental refactors)
- `ARCH:` (architecture/design)
- `AUDIT:` (review/audit)
- `TEST:` (tests/e2e stabilization)
- `NEXTJS:` (App Router boundaries/caching)
- `I18N:` (next-intl parity/routing)
- `TS:` (TypeScript safety gate)
- `SHADCN:` (primitives/tokens discipline)
- `STRIPE:` (payments/webhooks)
- `PERF:` (performance audits)
- `A11Y:` (accessibility audits)
- `SUPABASE:` (Supabase RLS/perf audit)
- `TAILWIND:` (Tailwind v4 + shadcn token/theme audit)

## Directory Structure

```
.claude/
├── CLAUDE.md              # Project memory (always loaded)
├── settings.json          # Claude settings
├── rules/                 # Always-on rules (loaded every session)
└── skills/
    ├── treido-dev/        # Daily workflow
    ├── treido-backend/    # Backend tasks
    ├── treido-frontend/   # Frontend tasks
    ├── treido-refactor/   # Refactor workflow
    ├── treido-architect/  # Architecture/design
    ├── treido-audit/      # Audits/reviews
    └── treido-testing/    # Testing workflow
```

## SKILL.md Structure (Anthropic's Official Pattern)

```yaml
---
name: skill-name
description: Brief description of what this skill does and when to use it (include the terms users will actually say).
---

# Skill Title

[Brief overview - what this enables]

## When to Use
- Bullet point scenarios

## Instructions
[Imperative instructions - "Read the file", NOT "You should read the file"]

## Additional Resources

### Reference Files
- **`file.md`** - Description

### Examples
[Real input/output examples]
```

## Best Practices (From Anthropic)

### ✅ DO

1. **Make `description` specific (what + when)**
   ```yaml
   description: Use when creating or editing UI components, fixing styling drift, or adding i18n keys for new UI strings.
   ```

2. **Write in imperative form**
   ```markdown
   ✅ Read the configuration file.
   ✅ Run tsc before committing.
   ❌ You should read the configuration file.
   ❌ You can run tsc before committing.
   ```

3. **Progressive disclosure** - Keep SKILL.md lean (~500-2000 words), put details in `references/`

4. **Include examples** - Show good/bad patterns with real code

5. **Keep skill metadata clean** - Put only supported metadata in frontmatter; keep repo-only versioning in the body if you want it.

6. **Explicit resource references** - List all files Claude can access

### 🚫 DON'T (Slop Patterns)

1. **Vague triggers** - `"frontend"` matches everything
2. **Second-person instructions** - Makes Claude hesitant
3. **Monolithic files** - 8000+ words bloats context
4. **Missing examples** - Claude guesses behavior
5. **Over-engineering requests** - "Fix X" shouldn't become "refactor Y"

## How to Create Expert Agents

### Option 1: Skills (Current Approach)
Skills are **passive** — they provide knowledge when triggered.

### Option 2: Claude Code Agents (Active)
Agents are **active** — they have personalities and perform specific tasks.

To create an agent configuration (Treido pattern: Markdown + YAML frontmatter):

```markdown
---
name: code-reviewer
description: Use after code changes to review security, caching, i18n, and style. Provide file:line findings and a verdict.
tools: Read, Grep, Glob, Bash(git:*), Bash(pnpm:*)
model: inherit
---

# Code Reviewer
…
```

### Option 3: Hooks (Automated Triggers)
Hooks run **automatically** on specific events:

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "node .claude/hooks/pretooluse-guardrails.mjs"
        }
      ]
    }
  ]
}
```

## Testing Your Skill

```bash
# Ask questions that should trigger the skill:
# - "TREIDO: pick the next TODO and do it"
# - "COORD: pick the next spec to start"
# - "SPEC: write a spec for <feature>"
# - "BACKEND: fix this route handler"
# - "FRONTEND: update this page styling"
# - "REFACTOR: split this file safely"
# - "TEST: fix failing e2e smoke"

# Verify skill loads correctly from the response
```

## Updating Skills

1. Edit the skill file
2. (Optional) Update any repo-local version marker
3. Test with sample prompts
4. Commit changes

## Resources

- [Anthropic Skills Repo](https://github.com/anthropics/skills)
- [Awesome Claude Skills](https://github.com/composiohq/awesome-claude-skills)
- [Claude Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Building Skills for Claude Code](https://claude.com/blog/building-skills-for-claude-code)
