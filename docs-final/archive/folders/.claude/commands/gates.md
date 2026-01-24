---
allowed-tools: Bash(pnpm:*), Bash(tsc:*)
description: Run verification gates (typecheck + e2e smoke)
---

## Verification Gates

Run the project's verification gates to check if code is shippable.

### Step 1: TypeScript Check
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
```

### Step 2: E2E Smoke Test (if dev server running)
```bash
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

Report results clearly:
- ✅ PASS - Ready to ship
- ❌ FAIL - Show what's broken and suggest fixes
