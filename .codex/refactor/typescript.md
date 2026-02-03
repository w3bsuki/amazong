# TypeScript Audit + Refactor Playbook

Goal: reduce TypeScript surface area and complexity while improving safety (fewer files, fewer types, fewer “index barrels”).

## Audit checklist

### 1) Project config sanity

- [ ] Review `tsconfig*.json` and ensure strictness and module resolution are intentional.
- [ ] Identify paths/aliases that encourage boundary violations.

### 2) Module boundaries (biggest source of bloat)

- [ ] Identify folders exporting “everything” via `index.ts` barrels.
- [ ] Replace mega-barrels with explicit imports OR narrow public APIs per module.
- [ ] Ensure server-only types/utilities are not imported by client components.

### 3) Type duplication + overengineering

- [ ] Find duplicate DTO/types across `app/`, `lib/`, `components/`.
- [ ] Prefer a single canonical type per domain object.
- [ ] Remove “type gymnastics” that don’t protect behavior (excess generics/conditional types).

### 4) Safety debt

- [ ] Inventory `any`, casts, `ts-ignore`, unsafe parsing.
- [ ] Replace with minimal runtime validation where needed (especially boundary inputs).

## “Search patterns” (manual audit)

```powershell
rg -n \"\\bany\\b|as unknown as|ts-ignore|eslint-disable\" app components hooks lib
rg -n --glob \"**/index.ts\" \"export \\*\" app components hooks lib
```

## Subagent prompt (copy/paste)

```text
Stack audit: TypeScript

Tasks:
1) Identify where TS complexity is coming from (barrels, duplicated types, unsafe patterns).
2) List top 20 delete/merge candidates (types/util files) with evidence.
3) Propose a module-boundary approach for lib/ and components/ that prevents over-importing.
4) Provide 3 smallest safe refactor batches + verification commands (typecheck first).
```

