# Recipes

Screen-level guidance for core flows. Use these as defaults before bespoke design.

## Search / Browse
- Mobile: sticky search + chips; 2-up grid `gap-2`; bottom sheet filters; show price, shipping badge, rating count, short title (2 lines).
- Desktop: 4–6 cols `gap-3`; left rail filters, top sort dropdown; keep cards dense with `p-2`.
- Empty: short copy, primary CTA to browse categories, optional promo card.

## Category Landing
- Hero optional; otherwise start with chips and featured subcategories in 2-up cards.
- Keep banners flat: border, `p-3`, no shadow; one CTA.

## Product Detail
- Mobile gallery: swipe; thumb strip optional at `md+`.
- Price block: `text-2xl font-semibold`, promo badge if sale; shipping and delivery meta in `text-sm` with dividers.
- Action bar: sticky bottom; primary add/buy `h-9`, secondary save/share ghost.
- Info sections: specs in 2-col grid at `md+`, stack at base; reviews preview with rating + link to full.

## Cart / Checkout
- Line items: image, title (2 lines), price, qty stepper (`h-8`), remove in menu.
- Summary card: border, `p-3` mobile / `p-4` desktop; totals in `text-base font-semibold`.
- Address/payment forms: stacked labels, inline validation, no modal interruptions.

## Orders / Dashboard
- Row layout: status pill, date, total, actions in dropdown for mobile; desktop can show inline buttons.
- Filters: status pills, date range; export/download as ghost button.
- Detail: timeline with border-left markers; avoid complex tables on mobile—use definition lists.

## Messaging / Support
- Chat bubbles flat, `rounded-md`; `gap-2` between messages; timestamps `text-xs muted`.
- Composer: `h-9` input, attach as icon button `size-7`; send as primary.

## Auth
- Single-column cards; `p-4` mobile, `p-6` desktop; no social-only walls—always email/password present.
- Errors inline under fields; success states subtle (no modal); keep button `h-8`/`h-9`.
