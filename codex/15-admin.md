# [15] Admin

> Admin panel: users · orders · products · sellers · internal tools

## What Must Work

- Admin dashboard at `/admin`
- User list and management
- Order oversight
- Product moderation
- Seller management
- `requireAdmin()` on all admin routes

**Question to resolve:** Are docs/notes/tasks pages functional or empty shells? If they're internal tooling that doesn't need to ship — consider removing for launch.

## Files to Audit

```
app/[locale]/(admin)/                   → All pages + _components/

lib/auth/admin.ts
```

## Instructions

1. Read every file listed above
2. Audit for: empty shell pages, duplication with account/business patterns, dead code
3. Delete pages that are placeholders with no real content
4. Refactor — same features, less code
5. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
6. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, auth logic, admin permission checks.
