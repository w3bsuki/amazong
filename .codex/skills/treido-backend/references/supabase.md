# Supabase Playbook (Backend Lane)

This is the Treido-specific guide for Supabase Auth/RLS/Storage + query performance.

SSOT: `.codex/project/ARCHITECTURE.md`

## Golden rules

- RLS is mandatory for user data.
- Prefer `authenticated` roles; do not rely on `anon` for write paths.
- Avoid `select('*')` in hot paths; project fields.
- Don’t serialize full DB rows into client props; map to minimal DTOs.
- Never “guess” schema: introspect first (MCP-first when DB truth is needed).

## RLS policy patterns

Ownership (typical):

- row belongs to a user id column
- enforce `auth.uid() = <owner_column>`

Role scoping:

- use `to authenticated` for protected tables
- only use broader roles with clear rationale and minimal columns

## SECURITY DEFINER RPCs

Treat as high-risk:

- validate `auth.uid()` inside the function
- revoke `EXECUTE` from `PUBLIC`/`anon` unless explicitly needed
- only expose the minimal parameters

## Query performance (practical)

- project only fields you render
- paginate list endpoints
- put hard caps on `limit`/`range`
- avoid nested wildcards (`order_items(*)`)

## Migration workflow

When schema/RLS changes are needed:

- create a migration (do not do ad-hoc DDL in production)
- validate RLS + roles
- re-run advisors (security + performance)
- regenerate TypeScript types

## Storage (quick rules)

Storage access is controlled via RLS on `storage.objects`:

- define bucket naming conventions
- use policies that scope by owner + bucket

