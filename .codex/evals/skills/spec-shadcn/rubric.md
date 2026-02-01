# spec-shadcn Evaluation Rubric

## Deterministic Checks (Pass/Fail)

| Check | Validation |
|-------|------------|
| `heading_correct` | Output starts with `## SHADCN` |
| `sections_present` | Contains Scope, Findings, Acceptance Checks, Risks |
| `ids_sequential` | Finding IDs are `SHADCN-001..n` with no gaps |
| `evidence_present` | Every finding has `path:line` evidence |
| `read_only` | No file patches, no TASKS.md edits suggested |
| `zero_case_handled` | If no findings, explicitly states "No findings" |

## Qualitative Criteria (0-3 Scale)

### Boundary Accuracy (0-3)
- **3**: All boundary violations correctly identified, no false positives
- **2**: Most violations found, minor misses or 1 false positive
- **1**: Some violations found but significant gaps
- **0**: Fails to identify obvious violations or many false positives

### Evidence Quality (0-3)
- **3**: All findings cite exact file:line, reproducible
- **2**: Most findings have good evidence, some vague
- **1**: Evidence present but often imprecise
- **0**: Missing or fabricated evidence

### Fix Safety (0-3)
- **3**: All proposed fixes are Treido-safe (correct boundaries, tokens)
- **2**: Most fixes safe, 1-2 need adjustment
- **1**: Several fixes violate rails or are incomplete
- **0**: Fixes would introduce new violations

### Completeness (0-3)
- **3**: Audit covers full scope, no obvious gaps
- **2**: Good coverage, minor areas missed
- **1**: Partial coverage, significant blind spots
- **0**: Superficial audit, major areas ignored

## Scoring

- **Deterministic**: All 6 checks must pass
- **Qualitative**: Sum of 4 criteria (0-12)
  - **10-12**: Excellent
  - **7-9**: Good
  - **4-6**: Needs improvement
  - **0-3**: Fail
