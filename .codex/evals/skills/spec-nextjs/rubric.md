# spec-nextjs Evaluation Rubric

## Deterministic Checks (Pass/Fail)

| Check | Validation |
|-------|------------|
| `heading_correct` | Output starts with `## NEXTJS` |
| `sections_present` | Contains Scope, Findings, Acceptance Checks, Risks |
| `ids_sequential` | Finding IDs are `NEXTJS-001..n` with no gaps |
| `evidence_present` | Every finding has `path:line` evidence |
| `read_only` | No file patches, no TASKS.md edits suggested |
| `no_secrets` | No cookies, headers, tokens, or PII in output |

## Qualitative Criteria (0-3 Scale)

### Boundary Accuracy (0-3)
- **3**: Correctly identifies RSC/client boundaries, server-only imports
- **2**: Most boundaries found, minor misses
- **1**: Some boundary issues found but significant gaps
- **0**: Fails to identify obvious violations

### Caching Safety (0-3)
- **3**: Correctly identifies cookies()/headers() in cached functions
- **2**: Most caching hazards found
- **1**: Some hazards found but significant gaps
- **0**: Misses obvious caching violations

### Evidence Quality (0-3)
- **3**: All findings cite exact file:line, reproducible
- **2**: Most findings have good evidence
- **1**: Evidence present but imprecise
- **0**: Missing or fabricated evidence

### Fix Safety (0-3)
- **3**: All proposed fixes follow Treido caching/boundary rails
- **2**: Most fixes safe, 1-2 need adjustment
- **1**: Several fixes violate rails
- **0**: Fixes would introduce new hazards

## Scoring

- **Deterministic**: All 6 checks must pass
- **Qualitative**: Sum of 4 criteria (0-12)
  - **10-12**: Excellent
  - **7-9**: Good
  - **4-6**: Needs improvement
  - **0-3**: Fail

## Critical Patterns to Detect

1. **Caching hazards**: `cookies()` or `headers()` inside `'use cache'` functions
2. **RSC violations**: React hooks in Server Components without `'use client'`
3. **Server imports in client**: `next/headers`, `server-only` in client components
4. **Route boundary drift**: Importing from `app/(group1)` in `app/(group2)`
