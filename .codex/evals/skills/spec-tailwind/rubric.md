# spec-tailwind Evaluation Rubric

## Deterministic Checks (Pass/Fail)

| Check | Validation |
|-------|------------|
| `heading_correct` | Output starts with `## TW4` |
| `sections_present` | Contains Scope, Findings, Acceptance Checks, Risks |
| `ids_sequential` | Finding IDs are `TW4-001..n` with no gaps |
| `evidence_present` | Every finding has `path:line` evidence |
| `read_only` | No file patches, no TASKS.md edits suggested |
| `token_fixes` | All proposed fixes use semantic tokens from globals.css |

## Qualitative Criteria (0-3 Scale)

### Pattern Detection (0-3)
- **3**: All forbidden patterns found (gradients, palette, arbitrary, opacity hacks)
- **2**: Most patterns found, minor misses
- **1**: Some patterns found but significant gaps
- **0**: Fails to identify obvious violations

### Token Correctness (0-3)
- **3**: All fix suggestions use valid semantic tokens
- **2**: Most fixes correct, 1-2 invalid tokens suggested
- **1**: Several fixes use non-existent or wrong tokens
- **0**: Fixes suggest palette colors or arbitrary values

### Evidence Quality (0-3)
- **3**: All findings cite exact file:line, reproducible via grep
- **2**: Most findings have good evidence
- **1**: Evidence present but imprecise
- **0**: Missing or fabricated evidence

### v4 Awareness (0-3)
- **3**: Correctly handles CSS-first patterns, @theme, oklch in CSS vs TSX
- **2**: Good v4 understanding, minor confusion
- **1**: Some v3/v4 confusion
- **0**: Treats v3 and v4 interchangeably

## Scoring

- **Deterministic**: All 6 checks must pass
- **Qualitative**: Sum of 4 criteria (0-12)
  - **10-12**: Excellent
  - **7-9**: Good
  - **4-6**: Needs improvement
  - **0-3**: Fail

## Token Validation

Valid tokens are defined in `app/globals.css`. Common semantic tokens:
- Surfaces: `bg-background`, `bg-card`, `bg-surface-subtle`, `bg-surface-page`
- Interactive: `bg-hover`, `bg-active`, `bg-selected`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Status: `text-success`, `text-warning`, `text-error`, `text-deal`
- Price: `text-price-regular`, `text-price-sale`, `text-price-original`
