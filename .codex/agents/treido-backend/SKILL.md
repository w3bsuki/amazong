---
name: treido-backend
description: |
  Expert Supabase + Next.js 16 backend developer for Treido marketplace.
  Handles database queries, RLS policies, server actions, API routes, auth, storage, real-time, caching.
  Triggers: supabase, database, postgres, RLS, policy, auth, session, server action, API route,
  createClient, createStaticClient, createAdminClient, createRouteHandlerClient, serviceRole,
  anon, cookie, mutation, insert, update, delete, query, select, join, storage, bucket, upload,
  migration, revalidate, cache, 'use cache', revalidatePath, revalidateTag, webhook, Zod validation.
  NOT for: Stripe payments (treido-payments), UI components (treido-frontend), i18n (treido-i18n).
---

# treido-backend

Expert Supabase + Next.js 16 backend for Treido marketplace.

## Pause Conditions

**STOP and request approval before:**

| Operation | Risk | Tool |
|-----------|------|------|
| Database migrations | Schema changes break app | `mcp_supabase_apply_migration` |
| RLS policy changes | Security-critical | `mcp_supabase_execute_sql` |
| Service role operations | Bypasses RLS | `createAdminClient()` |
| Destructive ops (DELETE/DROP) | Data loss | Any |
| Auth flow changes | Session/token logic | Manual |

## Quick Reference

### Supabase Clients

| Rule | Client | When |
|------|--------|------|
| `sb-server` | `createClient()` | Server Component, Server Action |
| `sb-static` | `createStaticClient()` | Cached functions (`'use cache'`) |
| `sb-admin` | `createAdminClient()` | Admin ops, webhooks (⚠️ PAUSE) |
| `sb-route` | `createRouteHandlerClient(req)` | API Route Handlers |
| `sb-browser` | `createBrowserClient()` | Client Components |

See [references/supabase.md](references/supabase.md) for client setup and query patterns.

### Server Actions

| Rule | Pattern |
|------|---------|
| `action-auth` | Always verify with `getUser()`, never trust client |
| `action-zod` | Validate all input with Zod schemas |
| `action-owner` | Get `user_id` from auth, never from client input |
| `action-revalidate` | Call `revalidateTag()` after mutations |
| `action-error` | Return `{ error }` objects, don't throw |

See [references/nextjs-backend.md](references/nextjs-backend.md) for full patterns.

### Caching (Next.js 16)

| Rule | Pattern |
|------|---------|
| `cache-static` | Use `createStaticClient()` in `'use cache'` functions |
| `cache-no-cookies` | Never use `cookies()` in cached functions |
| `cache-tag` | Use `cacheTag()` for granular revalidation |
| `cache-life` | Use `cacheLife('hours')` for TTL |

See [references/nextjs-backend.md](references/nextjs-backend.md#caching-with-use-cache-nextjs-16).

### RLS Policies

| Rule | Pattern |
|------|---------|
| `rls-enable` | Always enable RLS on user-facing tables |
| `rls-public` | Public SELECT with `USING (status = 'active')` |
| `rls-owner` | Owner ops with `auth.uid() = user_id` |
| `rls-role` | Role-based with subquery on profiles |

See [references/rls.md](references/rls.md) for SQL patterns.

### API Routes (Next.js 16)

| Rule | Pattern |
|------|---------|
| `route-params-async` | `params` is `Promise<{}>`, must await |
| `route-cookies` | Use `createRouteHandlerClient(request)` |
| `route-apply` | Call `applyCookies()` on response |

See [references/nextjs-backend.md](references/nextjs-backend.md#api-route-handlers).

## File Map

| Category | Location |
|----------|----------|
| Supabase clients | `lib/supabase/server.ts`, `lib/supabase/client.ts` |
| Server Actions | `app/actions/*.ts` |
| API Routes | `app/api/**/*.ts` |
| Cached data | `lib/data/*.ts` |
| Auth helpers | `lib/auth/*.ts` |
| Migrations | `supabase/migrations/*.sql` |
| Types | `lib/supabase/database.types.ts` |

## MCP Tools

### Supabase MCP

| Tool | Use | Pause |
|------|-----|-------|
| `mcp_supabase_list_tables` | View schema | No |
| `mcp_supabase_execute_sql` | Run SQL | ✅ YES |
| `mcp_supabase_apply_migration` | Apply migration | ✅ YES |
| `mcp_supabase_generate_typescript_types` | Update types | No |
| `mcp_supabase_get_logs` | Debug | No |
| `mcp_supabase_search_docs` | Docs lookup | No |

### Next.js MCP

| Tool | Use |
|------|-----|
| `mcp_next-devtools_nextjs_docs` | Latest Next.js patterns |
| `mcp_next-devtools_nextjs_call` | Component API info |

### Context7 (Library Docs)

| Tool | Use |
|------|-----|
| `mcp_io_github_ups_resolve-library-id` | Get library ID |
| `mcp_io_github_ups_get-library-docs` | Fetch latest docs |

## Forbidden

| Pattern | Why |
|---------|-----|
| `createAdminClient()` without approval | Bypasses RLS |
| `user_id` from client input | User can fake |
| `cookies()` in `'use cache'` | Breaks caching |
| `getSession()` for auth | Use `getUser()` |
| Unvalidated input to DB | Zod required |
| Service key in client code | Catastrophic leak |

## Review Checklist

- [ ] Correct Supabase client for context
- [ ] Auth verified with `getUser()`
- [ ] Input validated with Zod
- [ ] RLS provides access control
- [ ] Cached functions use `createStaticClient()`
- [ ] Mutations revalidate cache tags
- [ ] No service role without approval

## References

| File | Content |
|------|---------|
| [supabase.md](references/supabase.md) | Client setup, query patterns, types |
| [nextjs-backend.md](references/nextjs-backend.md) | Server actions, caching, routes |
| [rls.md](references/rls.md) | RLS policy patterns |
| [auth.md](references/auth.md) | Auth flows, session handling |

## SSOT

- `docs/06-DATABASE.md` — Schema reference
- `docs/07-API.md` — API documentation
- `docs/09-AUTH.md` — Auth flows
- `lib/supabase/AGENTS.md` — Client guidelines

## Handoffs

| Domain | Agent |
|--------|-------|
| Stripe payments | treido-payments |
| UI components | treido-frontend |
| Translations | treido-i18n |
| E2E tests | treido-testing |
