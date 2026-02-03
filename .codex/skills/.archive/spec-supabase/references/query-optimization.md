# Query Optimization (Supabase JS) - Audit Guide

Treido rails:
- no `select('*')` in hot paths
- project only needed fields
- avoid wide joins in list views; use RPCs for complex aggregates

SSOT:
- `.codex/project/ARCHITECTURE.md`

## High-signal smells

### Wildcard selects

Flag:
- `.select('*')`
- `.select()` with no args (defaults to all columns)

Why it matters:
- larger payloads, slower queries
- increased RSC serialization cost
- more frequent schema coupling and breaking changes

Fix pattern:
- `.select('id,name,price')` (only what the view needs)

### N+1 queries

Flag patterns like:
- fetching a list, then mapping and issuing one query per item

Fix patterns:
- use a single query with joins (if narrow and indexed)
- use an RPC for complex aggregation
- batch by ids with `in('id', ids)`

### Wide joins in list views

Flag:
- selecting deep related graphs for list pages

Fix patterns:
- split into:
  - list query with essential fields
  - detail query for the selected item
- precompute aggregates in a view/materialized view or RPC

### Missing indexes (migration task)

Flag when you see frequent filters/orderings on:
- `user_id`
- `status`
- `created_at`
- foreign keys used in joins

Fix patterns:
- propose an index migration (do not implement during audit-only)

## Evidence and suggestions

For each query finding, cite:
- file:line of the offending select
- whether it runs in a list view / hot route
- suggested projection list (concrete columns)

Acceptance checks:
- sanity: request still renders the page
- perf: query returns fewer columns / fewer round trips

