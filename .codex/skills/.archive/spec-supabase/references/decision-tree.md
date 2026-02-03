# Supabase Decision Tree

Quick decision framework for auditing Supabase usage in Treido.

## RLS Decision Tree

```
Is this table user-facing?
├── Does it have RLS enabled?
│   ├── No → ❌ CRITICAL — Enable RLS immediately
│   └── Yes → Continue checking policies
├── Do all CRUD operations have policies?
│   ├── Missing SELECT? → ❌ HIGH — Add read policy
│   ├── Missing INSERT? → ⚠️ Check if intentional
│   ├── Missing UPDATE? → ⚠️ Check if intentional
│   └── Missing DELETE? → ⚠️ Check if intentional
└── Do policies use auth.uid() correctly?
    ├── Raw auth.uid() in WHERE? → Prefer (SELECT auth.uid())
    └── No ownership check? → ⚠️ Review access scope
```

## Client Selection Decision Tree

```
Where is this Supabase call?
├── Server Component (no 'use client')
│   └── → createClient() from lib/supabase/server.ts
├── Cached function ('use cache')
│   └── → createStaticClient() (no cookies!)
├── Route Handler (route.ts)
│   └── → createRouteHandlerClient(request)
├── Server Action ('use server')
│   └── → createClient() from lib/supabase/server.ts
├── Client Component ('use client')
│   └── → createClient() from lib/supabase/client.ts (browser)
└── Admin operation (service role needed)
    └── → createAdminClient() (server-only, justified)
```

## Query Optimization Decision Tree

```
Is this a Supabase query?
├── Uses select('*')?
│   └── ❌ FAIL — Project specific columns
├── Uses bare select() (no args)?
│   └── ❌ FAIL — Same as select('*')
├── In a loop (N+1 risk)?
│   └── ❌ HIGH — Batch or join instead
├── Hot path (list views, feeds)?
│   └── ⚠️ Review — Project only what's needed, paginate
├── Wide join without LIMIT?
│   └── ⚠️ WARN — Consider pagination
└── Proper column projection?
    └── ✅ PASS
```

## Auth Pattern Decision Tree

```
Checking auth in this function?
├── Inside cached function ('use cache')?
│   └── ❌ FAIL — Never check auth in cached functions
├── Using getUser() correctly?
│   └── ✅ PASS — Validates JWT server-side
├── Using getSession() only?
│   └── ⚠️ WARN — getSession() doesn't validate; use getUser()
├── Trust client-passed user ID?
│   └── ❌ FAIL — Always get user from auth.getUser()
└── Admin client for user data?
    └── ⚠️ Review — Admin bypasses RLS; is it needed?
```

## Migration Safety Decision Tree

```
Creating or modifying a migration?
├── Editing an existing migration file?
│   └── ❌ FAIL — Migrations are append-only
├── New table without RLS?
│   └── ❌ FAIL — Always include ENABLE ROW LEVEL SECURITY
├── New table without policies?
│   └── ❌ FAIL — Include at least read policy
├── DROP or TRUNCATE without confirmation?
│   └── ❌ FAIL — Destructive; needs explicit approval
├── ALTER COLUMN on production data?
│   └── ⚠️ WARN — Review data compatibility
└── Adding security definer function?
    └── ⚠️ WARN — Must have tight search_path
```

## Storage Policy Decision Tree

```
Is this a storage bucket?
├── Public read intended?
│   └── Add policy for SELECT where true
├── Authenticated upload?
│   └── Add policy for INSERT with auth.uid() check
├── Owner-only access?
│   └── Add policy checking owner field
├── World-writable by accident?
│   └── ❌ CRITICAL — Add proper policies
└── Proper policies for all operations?
    └── ✅ PASS
```

## Severity Classification

| Pattern | Severity | Reason |
|---------|----------|--------|
| RLS disabled on user table | Critical | Data exposure |
| select('*') in hot path | High | Performance, data leakage |
| Auth in cached function | High | User data cached across users |
| Admin client without justification | High | Bypasses RLS |
| Missing policy for CRUD ops | Medium | Incomplete access control |
| getSession() without getUser() | Medium | Unvalidated JWT |
| Editing old migrations | Medium | Drift risk |
| N+1 query pattern | Low | Performance |

## Quick Regex Checks

```bash
# Wildcard selects
rg -n "select\(\s*\*\s*\)" app lib --glob "*.ts" --glob "*.tsx"
rg -n "\.select\(\s*\)" app lib --glob "*.ts" --glob "*.tsx"

# Admin client usage
rg -n "\bcreateAdminClient\b|SUPABASE_SERVICE_ROLE_KEY" app components lib

# Client selection
rg -n "createClient|createStaticClient|createRouteHandlerClient" app lib

# RLS in migrations
rg -n "enable row level security|create policy" supabase/migrations

# Auth patterns
rg -n "\.auth\.getUser|\.auth\.getSession" app lib
```

## MCP Commands (When Available)

```
# Check RLS status
mcp__supabase__list_tables({ schemas: ["public"] })

# Run advisors
mcp__supabase__get_advisors({ type: "security" })
mcp__supabase__get_advisors({ type: "performance" })

# Inspect policies
mcp__supabase__execute_sql({ query: "SELECT * FROM pg_policies WHERE schemaname = 'public'" })
```
