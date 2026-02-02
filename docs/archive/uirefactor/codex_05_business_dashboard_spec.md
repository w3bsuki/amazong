# Codex — Business Experience (“Shopify-like”, phased)

## Principle
Business users need a backend that feels like a tool, not a consumer profile page.

We should phase:
- **v1**: “Manage listings + identity + export”
- **v2**: “Bulk operations + imports + analytics”
- **v3**: “Automation + AI copilots”

## v1 (production) — minimum “pro seller” set
### Business profile
- Business name/logo/banner
- Public-facing “store” page (already exists via seller profile patterns)
- Business details in settings (website, socials, VAT if required)

### Listings manager (dashboard)
- Product list with:
  - Search + filter (status, category)
  - Quick edit (price, availability)
  - Export CSV (own listings)

Export scope (safe):
- Only seller-owned products
- No buyer PII

### CSV export (v1) — define early to avoid rework
Baseline columns (suggested):
- `product_id`
- `title`
- `status` (draft/active/sold/archived)
- `price_amount`
- `price_currency`
- `category_slug`
- `condition`
- `created_at`
- `updated_at`

Constraints:
- UTF-8, comma-separated, stable header names
- Cap rows and/or file size (avoid timeouts)
- Rate limit export per seller
- Never include buyer data, chat data, or payment details

## v2 — “real Shopify energy”
- Bulk edit (price updates, category changes)
- CSV import (mapping + validation preview)
- Inventory views (draft/active/sold)
- Orders/payments page (if relevant to Treido checkout)

## v3 — AI everywhere (without clutter)
- “AI operations” panel:
  - Suggest missing fields, improve titles/descriptions
  - Detect duplicates
  - Recommend pricing bands
  - Auto-generate collections

## Implementation anchors (existing structure)
- Business route group exists: `app/[locale]/(business)/dashboard/*`
- Add exports/imports as dashboard subpages + server actions/route handlers (Supabase-backed).
