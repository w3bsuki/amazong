# Skill Enhancement Prompt (Codex CLI)

Reusable prompt for auditing and enhancing agent skills with domain expertise depth.

## Usage

```bash
codex --model claude-sonnet-4-20250514 --approval auto-edit "$(cat .codex/prompts/skill-enhancement.md)"
```

Or copy the prompt below directly.

---

## Prompt

```
## Objective
Audit + enhance all SKILL.md files under .codex/skills/ for domain expertise depth.

## Rubric (score 0-5 each)
1. **Domain DNA**: Does it teach WHY, not just WHAT? (5 = senior practitioner voice)
2. **Teaches vs Checklists**: Does it explain tradeoffs, failure modes, edge cases? (5 = mental models, not rules)
3. **Decision Frameworks**: Does it help with ambiguous situations? (5 = 'when to break rules' guidance)
4. **Senior Wisdom**: Does it sound like a principal engineer teaching? (5 = battle-tested insights)

## Workflow
### Phase 1: Audit
- Read each skill's SKILL.md
- Score against rubric
- Output table: skill | D1 | D2 | D3 | D4 | SEVERITY (CRITICAL/HIGH/MEDIUM/MINOR/ADEQUATE)

### Phase 2: Enhance (by severity)
For each skill scoring < 4 average:
- Add 2-3 new sections after section 2 (Domain Expertise)
- Focus on: WHY behind rules, decision frameworks for edge cases, 'when to break rules'
- Voice: senior practitioner teaching junior, not documentation
- Renumber subsequent sections
- Keep existing triggers/commands stable

### Phase 3: Validate
- Run: pnpm -s validate:skills
- Run: pnpm -s skills:sync
- Fix any failures

## Style Guide
- Markdown headers: ## N) Section Name
- Examples use code blocks with comments
- Reference repo-specific files (globals.css, proxy.ts, etc.)
- Max 100 lines added per skill

## Output
- Final score table (before/after)
- List of files changed
- Validation results
```

---

## Subagent Pattern (for parallelization)

When running with subagent support:

1. **Auditor subagents** (N parallel, 1 per skill):
   - Input: skill folder path
   - Output: `{scores, gaps, proposed_sections[]}`

2. **Editor agent** (sequential):
   - Normalizes tone across all proposals
   - Applies edits in batches of 3-4 skills
   - Runs validation after each batch

3. **Fix agent** (on-demand):
   - Triggered if validation fails
   - Scoped to failing skill only
