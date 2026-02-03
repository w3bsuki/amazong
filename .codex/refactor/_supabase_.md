# Folder: `supabase/`

Status: Not audited

## Why this folder exists (expected)

Supabase schema/migrations/policies/types generation. Must stay safe and append-only for migrations.

## Audit checklist

- [ ] Inventory migrations and ensure they are append-only.
- [ ] Inventory policies and storage rules; ensure they match expected app flows.
- [ ] Identify drift between DB schema and frontend types.

