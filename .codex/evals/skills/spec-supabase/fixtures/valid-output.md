## SUPABASE

### Scope
- Goal: Audit RLS policies and query optimization
- Files:
  - lib/supabase/server.ts
  - app/actions/products.ts
  - supabase/migrations/001_products.sql
- Lines: full file

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SUPABASE-001 | Critical | supabase/migrations/001_products.sql:12 | Table products missing RLS enablement | Add ENABLE ROW LEVEL SECURITY after CREATE TABLE |
| SUPABASE-002 | High | app/actions/products.ts:34 | Uses select('*') in hot path | Replace with projected select('id, name, price, image_url') |
| SUPABASE-003 | Medium | lib/supabase/server.ts:56 | N+1 query pattern in loop | Batch queries or use join |

### Acceptance Checks
- [ ] `pnpm -s typecheck`
- [ ] `pnpm -s lint`

### Risks
- First finding is security-critical; prioritize before production
- Second finding may require schema changes if columns are missing
