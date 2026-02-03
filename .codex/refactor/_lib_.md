# Folder: `lib/`

Status: Not audited

## Why this folder exists (expected)

Shared domain logic and server utilities. This should be the main “dedupe target”.

## Audit checklist

- [ ] Inventory modules and identify duplication with `app/` and `components/`.
- [ ] Enforce boundaries: server-only utilities must not leak to client.
- [ ] Remove mega-barrels (`index.ts`) that export everything.
- [ ] Consolidate duplicated query/builders/util functions.

