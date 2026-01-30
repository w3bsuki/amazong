# Treido Skills for Claude

This directory contains agent skills following the [Anthropic Skills Specification](https://agentskills.io/).

## Available Skills

| Skill | Description | Trigger |
|-------|-------------|---------|
| `treido-frontend` | Next.js UI, components, styling, i18n | UI changes, component work |
| `treido-backend` | Server actions, API routes, Stripe, caching | Backend logic, payments |
| `treido-supabase` | Database schema, RLS policies, migrations | Schema changes, security |
| `treido-design` | UI specifications, design review | "looks off", layout issues |
| `treido-audit` | Code review, compliance checking | Pre-merge validation |

## How Skills Work

Skills use **progressive disclosure** to manage context efficiently:

1. **Metadata (always loaded)** - Name and description (~100 tokens)
2. **SKILL.md (on trigger)** - Main instructions (<5k tokens)
3. **References (as needed)** - Detailed docs in `references/` folder

When you ask about UI work, Claude loads `treido-frontend/SKILL.md`. If you need Tailwind details, Claude reads `references/tailwind.md`.

## Skill Structure

```
.claude/skills/
├── treido-frontend/
│   ├── SKILL.md              # Main instructions
│   └── references/
│       ├── nextjs.md         # Next.js patterns
│       ├── tailwind.md       # Tailwind v4 rules
│       └── shadcn.md         # Component patterns
├── treido-backend/
│   ├── SKILL.md
│   └── references/
│       ├── caching.md
│       └── stripe.md
├── treido-supabase/
│   ├── SKILL.md
│   └── references/
│       ├── rls.md
│       └── schema.md
├── treido-design/
│   ├── SKILL.md
│   └── references/
│       ├── patterns.md
│       └── tokens.md
└── treido-audit/
    ├── SKILL.md
    ├── scripts/
    │   ├── verify_skills.py
    │   └── quick_audit.py
    └── references/
        └── security.md
```

## Quick Start

### For UI Work
```
"Fix the spacing on the product card"
→ Claude loads treido-frontend skill
→ References tailwind.md for spacing tokens
```

### For Backend Work
```
"Add a server action for checkout"
→ Claude loads treido-backend skill
→ References stripe.md for payment patterns
```

### For Database Changes
```
"Add a new table for reviews"
→ Claude loads treido-supabase skill
→ References schema.md for conventions
```

### For Design Review
```
"The mobile layout looks off"
→ Claude loads treido-design skill
→ Creates UI spec with acceptance criteria
```

### For Code Review
```
"Review this PR for security issues"
→ Claude loads treido-audit skill
→ References security.md checklist
```

## Verification Commands

Run these before committing:

```bash
# Type checking
pnpm -s typecheck

# Linting
pnpm -s lint

# Tailwind compliance
pnpm -s styles:gate

# Quick audit
python .claude/skills/treido-audit/scripts/quick_audit.py
```

## Creating New Skills

Follow the Anthropic pattern:

1. Create folder: `.claude/skills/skill-name/`
2. Create `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: Clear description of what it does and WHEN to use it
   ---
   ```
3. Add `references/` for detailed docs
4. Add `scripts/` for deterministic operations
5. Validate: `python .claude/skills/treido-audit/scripts/verify_skills.py`

## Differences from .codex/skills

This `.claude/` folder replaces the older `.codex/skills/` with:

- **Cleaner SKILL.md files** - No bureaucratic phases, just actionable instructions
- **Better descriptions** - Clear triggers for when to use each skill
- **Progressive disclosure** - References loaded only when needed
- **Executable scripts** - Deterministic operations for common tasks
- **Proper structure** - Following Anthropic's specification

The old `.codex/skills/` had:
- Overly complex phase-based workflows (Phase 1, 2, 3...)
- Redundant pnpm commands in every skill
- Vague descriptions that didn't clearly specify triggers
- No executable scripts for automation
