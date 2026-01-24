# .specs Quick Start

> Get productive in 2 minutes

## For Claude (Implementation)

### 1. See what's next
```
COORD: What should I work on?
```

### 2. Start a spec
```bash
# Coordinator will tell you, but manually:
# Move from queue to active
```

### 3. Read the spec
- `.specs/active/<spec>/requirements.md` — What to build
- `.specs/active/<spec>/tasks.md` — Checklist

### 4. Do the work
```
TREIDO: Complete task 1.1 from .specs/active/<spec>
```

### 5. Update progress
Check off tasks in `tasks.md`, add notes to `context.md`

### 6. Signal completion
```
Ready for Codex verification
```

---

## For Codex (Verification)

### 1. Check for pending verification
```
/verify active/<spec-name>
```

### 2. Run gates
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

### 3. Review changes
Check files mentioned in `context.md`

### 4. Decision
- **APPROVED**: Move to completed, create summary
- **REJECTED**: Document issues in context.md

---

## Workflow Visual

```
Queue → Active → Completed
          ↓
       Blocked
```

## Key Commands

| Action | Command |
|--------|---------|
| Create new spec | `SPEC: <description>` |
| Pick next task | `COORD: What's next?` |
| Execute task | `TREIDO: <task from spec>` |
| Verify spec | `/verify active/<spec>` |
| Run gates | `pnpm -s exec tsc --noEmit && pnpm test:e2e:smoke` |

## Current Priority

1. **P0 specs first** (release blockers)
2. Then P1 (auth/onboarding)
3. Then P2-P6 in order

See `.specs/ROADMAP.md` for full plan.
