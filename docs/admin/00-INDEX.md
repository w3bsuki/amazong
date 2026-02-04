# 00-INDEX.md — Admin Docs Governance (SSOT)

> Defines what belongs in `/admin/docs` (Supabase `admin_docs`) vs `/docs/**`.

| Scope | Admin docs governance |
|-------|------------------------|
| Audience | Admins, operators, developers |
| Type | Reference |

---

## TL;DR

| Surface | Use for | SSOT? |
|---------|---------|-------|
| `docs/**` | Stable docs (product, engineering, business, public policies) | ✅ |
| `/admin/docs` (`admin_docs`) | Operational docs: SOPs, incident notes, admin workflows | ❌ |
| `docs/public/**` | Public legal/policy/help copy (versioned per locale) | ✅ |

---

## What belongs in `/admin/docs` (allowed)

- Support and moderation playbooks (internal SOPs)
- Incident response notes and checklists
- Operational runbooks (what to do when X breaks)
- Admin workflows (how to review users/sellers/orders)
- Internal checklists and short-term operational notes

## What does NOT belong in `/admin/docs` (SSOT elsewhere)

- Canonical legal/policy text (Terms/Privacy/Cookies/Returns/etc.)
  - **SSOT:** `docs/public/**` (rendered by the main app `/[locale]/…` routes)
- Stable product/engineering docs (PRD, architecture, schema)
  - **SSOT:** `docs/**` (start at `docs/00-INDEX.md`)

---

## Seeding policy

Admin doc templates are only for bootstrap and include **ops-only** docs.

- Seed command: `pnpm -s seed:admin-docs`
- Seed endpoint: `POST /api/admin/docs/seed` (admin-only)

---

## Export (audit / diff)

Exports the current `admin_docs` content (both locales) for internal review:

- `pnpm -s export:admin-docs`
- Output: `.codex/audit/admin-docs-export/YYYY-MM-DD.json`

---

*Last updated: 2026-02-04*

