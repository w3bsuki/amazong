---
description: Fix failing tests
argument-hint: [test file or pattern]
---

## Fix Tests: $ARGUMENTS

Use the **test-fixer** agent to fix failing tests.

Target: `$ARGUMENTS` (or run all tests if blank)

First, run the tests to see failures:
```bash
pnpm test:unit
# or for E2E:
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

Then fix each failure:
1. Understand what the test verifies
2. Determine if code or test is wrong
3. Apply minimal fix
4. Re-run to verify
