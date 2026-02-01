## NEXTJS

### Scope
- Goal: Audit RSC vs client boundaries and caching hazards
- Files:
  - app/[locale]/page.tsx
  - app/actions/products.ts
  - lib/cache/products.ts
- Lines: full file

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | Critical | lib/cache/products.ts:45 | cookies() called inside use cache function | Move cookies() call outside cached scope or pass as parameter |
| NEXTJS-002 | High | app/[locale]/page.tsx:23 | useState in Server Component without use client | Add use client directive or lift state to client wrapper |
| NEXTJS-003 | Medium | app/actions/products.ts:78 | Server action missing input validation | Add zod schema validation |

### Acceptance Checks
- [ ] `pnpm -s typecheck`
- [ ] `pnpm -s lint`
- [ ] `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

### Risks
- First finding affects caching strategy; may need architecture review
