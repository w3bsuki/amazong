# Agent Skill Evaluations

Eval infrastructure for testing agent skills systematically.

## Structure

```
evals/
├── skills/
│   ├── spec-shadcn/
│   │   ├── prompts.jsonl      # Test scenarios
│   │   ├── rubric.md          # Grading criteria
│   │   └── checks.mjs         # Deterministic validators
│   ├── spec-tailwind/
│   ├── spec-nextjs/
│   └── spec-supabase/
└── run-evals.mjs              # Eval runner
```

## Best Practices (OpenAI Eval-Skills Pattern)

1. **Define success before testing**: Each skill should have clear DoD + success criteria
2. **Targeted prompt sets**: 10-30 scenarios per skill
3. **Deterministic checks**: Validate output format, required fields, ID sequencing
4. **Rubric-based grading**: Qualitative checks (0-3 scale) for accuracy/completeness
5. **Regression prevention**: Add failing prompts as new test cases

## Running Evals

```bash
# Run all skill evals
node .codex/evals/run-evals.mjs

# Run specific skill
node .codex/evals/run-evals.mjs --skill spec-tailwind
```

## Adding New Test Cases

When you discover a skill failure:
1. Add the failing prompt to `prompts.jsonl`
2. Note the expected behavior
3. Fix the skill
4. Verify the eval passes
