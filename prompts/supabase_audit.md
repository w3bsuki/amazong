# SUPABASE BEST PRACTICES AUDIT

## MANDATORY FIRST STEPS - READ DOCS BEFORE ANYTHING

```
1. mcp_context7_resolve-library-id → libraryName: "supabase"
2. mcp_context7_get-library-docs → topics: "best practices", "PostgREST", "RLS", "Next.js"
3. mcp_supabase_search_docs → queries:
   - "RPC vs PostgREST filters"
   - "Row Level Security best practices"
   - "Next.js Server Components"
   - "caching strategies"
   - "hierarchical data queries"
   - "ltree vs recursive CTE vs materialized path"
```

---

## AUDIT SCOPE

### 1. CLIENT CREATION PATTERNS
**Files to check:**
- `lib/supabase/server.ts`
- `lib/supabase/client.ts`
- `lib/supabase/middleware.ts`

**Questions:**
- [ ] Are we using `createServerClient` for Server Components?
- [ ] Are we using `createBrowserClient` for Client Components?
- [ ] Is cookie handling correct for SSR?
- [ ] Are we creating new clients per-request or reusing incorrectly?
- [ ] Is `createStaticClient` pattern valid or anti-pattern?

### 2. RPC vs POSTGREST
**Red flags to check:**
- [ ] Are we using RPC when `.select().filter()` would work?
- [ ] Are RPC functions duplicating PostgREST capabilities?
- [ ] Is RPC being used to bypass RLS (bad) or for complex logic (acceptable)?

**Current RPC functions to audit:**
```sql
-- Check supabase/migrations/ for these:
- get_products_in_category()
- count_products_in_category()
- get_category_ancestor_ids()
```

**Question:** Can hierarchical category queries be done with:
- PostgREST's `!inner` joins?
- Supabase's native array `@>` contains operator via REST?
- `ltree` extension instead of custom `category_ancestors`?

### 3. ROW LEVEL SECURITY (RLS)
**Check for:**
- [ ] Are all tables that need RLS enabled?
- [ ] Are policies using `auth.uid()` correctly?
- [ ] Are we bypassing RLS with service role when we shouldn't?
- [ ] Are SELECT policies too permissive?
- [ ] Are INSERT/UPDATE/DELETE policies correctly restrictive?

**Run this audit query:**
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 4. QUERY PATTERNS
**Anti-patterns to find:**
- [ ] N+1 queries (fetching list then details in loop)
- [ ] Missing `.single()` when expecting one row
- [ ] Not using `.select('specific,columns')` (selecting *)
- [ ] Missing indexes on filtered columns
- [ ] Over-fetching related data

**Good patterns to verify:**
- [ ] Using `.select('col1,col2,relation(col3)')` for joins
- [ ] Using `.range()` for pagination
- [ ] Using `{ count: 'exact' }` only when needed
- [ ] Proper error handling with `{ data, error }`

### 5. REALTIME & SUBSCRIPTIONS
- [ ] Are subscriptions cleaned up on unmount?
- [ ] Are we subscribing to minimal channels?
- [ ] Is RLS configured for realtime tables?

### 6. STORAGE
- [ ] Are storage policies configured?
- [ ] Are we using signed URLs when needed?
- [ ] Is public bucket access intentional?

---

## SPECIFIC CODE AUDIT

### Check these patterns in codebase:

```typescript
// FIND: All supabase client usages
grep_search: "supabase.from\(|supabase.rpc\(|createClient|createServerClient"

// FIND: RPC calls
grep_search: "\.rpc\("

// FIND: Potential N+1 queries
grep_search: "forEach.*supabase|map.*supabase|for.*await.*supabase"
```

---

## DELIVERABLES

1. **WRONG**: List patterns violating Supabase docs with citations
2. **OVER-ENGINEERED**: Identify where simpler PostgREST would work
3. **MISSING**: RLS policies, indexes, or security gaps
4. **CORRECT**: Patterns that follow best practices
5. **FIXES**: Specific code changes with before/after

---

## REFERENCE QUERIES FOR MCP

```graphql
# Search Supabase docs
query {
  searchDocs(query: "PostgREST vs RPC functions", limit: 5) {
    nodes {
      title
      href
      content
    }
  }
}
```

```graphql
# Find specific error handling
query {
  error(code: "PGRST", service: AUTH) {
    code
    message
  }
}
```
