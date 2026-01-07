# Claude Skills Guide for Treido

## What Are Claude Skills?

Skills are **folders of instructions, scripts, and references** that Claude loads dynamically to improve performance on specialized tasks. Think of them as "expert knowledge modules."

When triggered, Claude:
1. Reads the `SKILL.md` frontmatter (name, description)
2. Loads the main instructions
3. Can access additional `references/` files on demand

## How Skills Get Triggered

Claude matches skills based on **exact phrases** in the `description` field. The current skill triggers on:

- `"add a component"`
- `"fix the product card"`
- `"update a server action"`
- `"add Supabase RLS"`
- `"run E2E tests"`
- `"style with Tailwind"`
- `"fix mobile layout"`
- `"check TypeScript errors"`
- Mentions of: Treido, treido.eu, Next.js 16, shadcn, Bulgarian marketplace

## Directory Structure

```
.claude/
├── CLAUDE.md              # Project memory (always loaded)
├── settings.json          # Claude settings
├── rules/                 # Always-on rules (loaded every session)
└── skills/
    └── treido-dev/        # Our development skill
        ├── SKILL.md       # Core instructions (lean)
        ├── frontend.md    # UI/components reference
        ├── backend.md     # Supabase/caching reference
        ├── styling.md     # Tailwind v4 reference
        ├── testing.md     # Gates/tests reference
        └── tasks.md       # Task tracking reference
```

## SKILL.md Structure (Anthropic's Official Pattern)

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "exact phrase 1", "exact phrase 2", or mentions specific-keyword.
version: 0.1.0
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

1. **Use exact trigger phrases in quotes**
   ```yaml
   description: ...when the user asks to "create a hook", "add a component"...
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

5. **Version your skills** - Add `version: X.Y.Z` to frontmatter

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

To create an agent configuration:

```json
{
  "identifier": "code-reviewer",
  "whenToUse": "Use this agent when code was just written and needs review. <example>Context: User implemented a feature\nuser: 'I added the auth flow'\nassistant: 'Let me review that code'\n</example>",
  "systemPrompt": "You are an expert code reviewer. Analyze changes for:\n1. Security vulnerabilities\n2. Performance issues\n3. Code quality\n4. Project standards from CLAUDE.md\n\nProvide specific findings with line numbers."
}
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
          "type": "prompt",
          "prompt": "Validate this file write. Check: 1) Not touching node_modules 2) Not secrets files 3) Follows project structure. Return 'approve' or 'deny'."
        }
      ]
    }
  ]
}
```

## Testing Your Skill

```bash
# Test skill loading in Claude Code
claude --plugin-dir .claude

# Ask questions that should trigger the skill:
# - "How do I add a new component to Treido?"
# - "Run the E2E tests"
# - "Fix the product card styling"

# Verify skill loads correctly from the response
```

## Updating Skills

1. Edit the skill file
2. Increment version number
3. Test with sample prompts
4. Commit changes

## Resources

- [Anthropic Skills Repo](https://github.com/anthropics/skills)
- [Awesome Claude Skills](https://github.com/composiohq/awesome-claude-skills)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)
