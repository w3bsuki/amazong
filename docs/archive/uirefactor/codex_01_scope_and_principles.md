# Codex — UI/UX Finalization Scope + Principles

**Goal:** Production-ready, mobile-first Treido UI that still feels consistent on desktop — “social commerce” (feed + marketplace) with AI-assisted discovery and selling.

## What “production-ready” means (for this refactor)
- Mobile-first, touch-first (375px baseline), no layout thrash, consistent spacing rhythm.
- One clear primary action per screen; everything else becomes secondary (drawer/sheet/overflow).
- Discovery is fast: search is always accessible; categories are predictable; filters never feel “lost”.
- The platform feels “native”: stable UI, restrained surfaces, complete interaction states, minimal friction.

## Hard rails (repo SSOT constraints)
- Tailwind v4 semantic tokens only; no gradients/palette classes/arbitrary values.
- next-intl for all user-facing strings (no hardcoded copy).
- Avoid new/extra animations (keep UX stable + fast; use subtle transitions only).
- Keep changes shippable in small batches (1–3 files), verify after each batch.

## North Star: the “Treido loop”
1) **Open app → instantly browse** (feed + categories + AI search).
2) **Find something** via: AI search OR category → subcategory → filter → product.
3) **Trust** via seller identity + social proof + clear policies.
4) **Act** via chat/buy/offer/sell with minimal steps.
5) **Return** because the feed and sellers feel alive (new items, follows, alerts).

## UX principles (how we choose patterns)
1) **Discovery first**: search is a primary navigation surface, not a secondary page.
2) **Zero clutter**: dense rows of pills/buttons are a smell; hide complexity behind a sheet.
3) **Stable layout**: avoid patterns that push content down/up repeatedly (pills expanding inline).
4) **Predictable controls**: AI augments, but deterministic filters/sorting stay first-class.
5) **Social presence everywhere**: sellers are visible (avatar/name/location) in browsing views.
6) **Desktop parity**: same information architecture; only the “container” changes (bottom tab → side rail).

## Non-goals (for the first production push)
- “Shopify backend” parity in one sprint (we phase it).
- Re-skin every screen at once (we standardize primitives and ship incrementally).
- Rebuilding the AI system from scratch (we reuse the existing assistant surface and expand).

