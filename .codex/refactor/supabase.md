# Supabase Audit + Refactor Playbook

Goal: keep data + auth behavior identical while simplifying client creation, tightening query shapes, and enforcing RLS-first safety.

## Hard rules (Treido)

- Prefer explicit selects (avoid `select('*')`, especially on hot paths).
- No secrets/PII in logs.
- RLS is the default; admin/service-role usage must be isolated and justified.
- SSR client patterns must respect Next.js request boundaries (cookies/headers access).

## Audit checklist

### 1) Client creation patterns

- [ ] Inventory all Supabase client factories and where they’re used.
- [ ] Ensure there’s a clear split between:
  - auth-aware server client (dynamic; request-bound), and
  - static/public cached client (safe for cached reads).

### 2) Query hygiene and performance

- [ ] Identify hot-path queries (product page, search, category listing).
- [ ] Ensure explicit field selection and stable ordering.
- [ ] Remove duplicated query builders (one canonical per domain use-case).

### 3) Security posture

- [ ] Inventory RLS policies (tables + Storage buckets) and ensure coverage of core flows.
- [ ] Identify endpoints/actions that should be gated but are not.

### 4) Types and schema drift

- [ ] Identify how types are generated/kept up to date.
- [ ] Remove duplicate hand-written types that drift from the DB.

## “Search patterns” (manual audit)

```powershell
# Star selects
rg -n \"select\\('\\*'\\)|select\\(\\*\\)\" app lib

# Service role / admin
rg -n \"service_role|SUPABASE_SERVICE\" .
```

## Subagent prompt (copy/paste)

```text
Stack audit: Supabase

Tasks:
1) Identify all Supabase client creation points and classify (auth-aware vs static/cached).
2) Identify risky or duplicated query patterns and propose canonical helpers.
3) Identify security posture gaps (RLS/policies assumptions, unsafe endpoints).
4) Provide 3 smallest safe refactor batches + verification commands (typecheck + targeted flows).
```

