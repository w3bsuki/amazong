# Pencil Guide (Treido)

This folder is the source of truth for Treido’s **mobile-first screen designs** that map 1:1 to our Next.js App Router routes.

## Files

- `designs/treido.pen` — **the** canonical Treido Pencil file (components, templates, screens, explorations).
- `designs/archive/*.pen` — legacy snapshots kept for reference only (do not edit).

Task lists:
- `designs/pencil-tasks-1.md` — commerce screens (execute top→bottom).
- `designs/pencil-tasks-2.md` — user screens (execute top→bottom).

Route inventory + mapping:
- `designs/route-inventory.json` — generated from `app/[locale]` pages.
- `docs/generated/pencil-route-map.md` — route→template map (generated).

## Screen conventions

- **Device:** Mobile 375×812 (“M375”).
- **Screen naming:** `M375 / <route> / <short title>` (example: `M375 / /checkout / Checkout`).
- **Templates:** Every route uses exactly one base template:
  - `FeedGridPage` (browse grids)
  - `DetailPage (PDP)` (product detail / other “detail” routes)
  - `ListPage` (lists/settings/forms)
  - `ReadingPage` (static/reading)
  - `Wizard` (multi-step flows)
  - `Chat`
  - `Checkout`
  - `Desktop-first placeholder` (admin/dashboard)

## Styling rules (match product)

- Use **semantic tokens only** (the `.pen` files use `$--*` variables).
- Tap targets ≥ **44px**.
- Use clear hierarchy: title → primary content → secondary/meta.
- Bottom nav must not cover content; keep adequate bottom padding.

## Workflow (how to execute tasks)

For each checkbox task (top to bottom):
1. Create the screen in `designs/treido.pen` via `batch_design` (usually copy a template, then update the title/labels).
2. Verify with `get_screenshot` (catch clipped content, misalignment, or missing titles).
3. Check the task box in the `.md` file.

## Generators

- Regenerate route inventory:
  - `powershell -File designs/generate-route-inventory.ps1`
- Regenerate route map doc:
  - `node scripts/generate-pencil-route-map.mjs`

