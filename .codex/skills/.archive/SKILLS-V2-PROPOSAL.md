# Skills V2 Proposal

> **This document proposes a simplified agent skills system** inspired by [skills.sh](https://skills.sh) patterns from Vercel and Anthropic.

## Current State vs Proposed

| Current | Proposed |
|---------|----------|
| 14 skills with complex orchestration | 3 focused knowledge skills |
| Manual prefixes (`ORCH:`, `FRONTEND:`, etc.) | No prefixes - context determines application |
| Orchestrator skill managing lanes | Human + AI chat = orchestration |
| Audit payloads and dated artifacts | Simple inline verification |
| ~3000+ lines of skill definitions | ~500 lines total |

## Why This Change?

### What Vercel/Anthropic Skills Actually Are

Top skills on skills.sh are **reference documentation**, not workflow managers:

```
vercel-react-best-practices
├── 57 rules organized by priority
├── No orchestration
├── No lanes
└── Just: "Here's what to do and what to avoid"
```

### What We Had Wrong

1. **Orchestration overkill** - The chat IS orchestration
2. **Too many boundaries** - Frontend/UI/spec-tailwind/spec-shadcn are all "UI work"
3. **Manual routing** - Prefixes like `ORCH:` add friction
4. **Workflow theater** - Audit payloads, single-writer rules for a single-user chat

---

## Proposed Skills

### 1. `treido-frontend.md` 
All UI, styling, routing, i18n rules in one place.

### 2. `treido-backend.md`
All server actions, Supabase, Stripe, API rules in one place.

### 3. `treido-rails.md`
Project-wide rules: pause conditions, file organization, verification commands.

---

## Skill Template (Vercel-Style)

```markdown
# skill-name

Brief description of what this skill covers.

## When to Apply
- Bullet list of contexts where this knowledge applies

## Rules by Priority

### CRITICAL
- `rule-id` - Brief rule description

### HIGH
- `rule-id` - Brief rule description

### MEDIUM
- `rule-id` - Brief rule description

## Do / Don't Examples
Brief code examples showing correct vs incorrect patterns.

## Verification
Commands to run after changes.
```

---

## Full Skill Definitions

See the following files in this directory:

- [treido-frontend-v2.md](./treido-frontend-v2.md) - Consolidated frontend skill
- [treido-backend-v2.md](./treido-backend-v2.md) - Consolidated backend skill
- [treido-rails-v2.md](./treido-rails-v2.md) - Project rails and verification

---

## Migration Path

See also: [SKILLS-V2-MIGRATION.md](./SKILLS-V2-MIGRATION.md)

### Phase 1: Try V2 Skills (Now)
Use the V2 skills in this folder alongside existing skills. See if they work better in practice.

### Phase 2: Deprecate V1 (After Validation)
If V2 works well, move V1 skills to `.codex/skills/archive/`.

### Phase 3: Update Copilot Instructions
Update `.github/copilot-instructions.md` to reference V2 skills.

---

## FAQ

### "What about the orchestrator?"

You are the orchestrator. When you say "fix the button", I know to apply frontend knowledge. When you say "add a server action", I know to apply backend knowledge. No prefix needed.

### "What about audit trails?"

If you want to track decisions, use `.codex/DECISIONS.md`. If you want to track tasks, use `.codex/TASKS.md`. But these are optional notes, not workflow requirements.

### "What about the spec agents?"

Merged into the main skills. `spec-tailwind` knowledge is now in `treido-frontend-v2.md`. `spec-supabase` knowledge is now in `treido-backend-v2.md`.

### "What about VERIFY?"

Each skill has a "Verification" section. After any change, I run the relevant commands. No separate verify skill needed.

