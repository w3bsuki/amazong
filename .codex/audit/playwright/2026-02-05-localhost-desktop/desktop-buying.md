# Desktop Buying Flow — 2026-02-05 (1440×900)

## Summary

- Console errors: **0** observed on tested buying routes (see per-route console artifacts).
- Primary risk: cookie consent banner behavior + quick-view vs navigation expectations.

## Home — `/bg`

Artifacts:
- Screenshot: `screenshots/01-home-bg.png`
- Console: `console-home-bg.txt`

Notes:
- Skip links are present and reachable via keyboard; first `Tab` focuses “Skip to main content”.
- Focus ring appears tokenized (2px solid oklch) on skip link.
- Header search has “AI Режим” toggle (see Search notes).

## Search — `/bg/search?q=iphone`

Artifacts:
- Screenshot: `screenshots/02-search-bg-iphone.png`
- Console: `console-search-bg-iphone.txt`

Notes:
- Filters/sort controls render; pagination not present for this query (2 results).
- AI Mode opens modal (see next section).

## Search (AI modal) — `/bg/search?q=iphone`

Artifacts:
- Screenshot: `screenshots/03-search-bg-iphone-ai-modal.png`

Notes:
- AI modal opens and closes with `Esc` (no console errors).
- Integration (sending a prompt) not exercised in this run to avoid external calls/cost.
- Tracked as **FE-004** (integration risk).

## Categories index — `/bg/categories`

Artifacts:
- Screenshot: `screenshots/04-categories-bg.png`
- Console: `console-categories-bg.txt`

Notes:
- Category list is dense but scannable on desktop.

## Category page — `/bg/categories/electronics`

Artifacts:
- Screenshot: `screenshots/05-category-electronics-bg.png`
- Console: `console-category-electronics-bg.txt`

Notes:
- Pagination links preserve locale: `/bg/categories/electronics?page=2` etc.
- Cookie banner can overlap product grid in the viewport → **FE-001**.

## Product quick view (from category grid)

Artifacts:
- Screenshot: `screenshots/06-category-electronics-product-drawer.png`

Notes:
- Primary click on the product card opens quick view (URL stays the category URL).
- “Виж пълната страница” exists to reach PDP.
- This behavior may be intentional, but it’s a conversion/expectation risk on desktop → **FE-003**.

## PDP — `/bg/tech_haven/macbook-pro-16-m3-max`

Artifacts:
- Screenshot: `screenshots/07-pdp-macbook-bg.png`
- Console: `console-pdp-macbook-bg.txt`

Notes:
- Gallery, price, quantity controls, and “Добави в количката” render as expected.
- Cookie banner can overlap the gallery controls in the viewport → **FE-001**.
- “Store” link present (navigates to seller page).

## Seller store/profile — `/bg/tech_haven`

Artifacts:
- Screenshot: `screenshots/08-store-tech_haven-bg.png`
- Console: `console-store-tech_haven-bg.txt`

Notes:
- Store page loads and lists products; layout looks narrow/dense on desktop but functional.

## Cart — `/bg/cart` (empty)

Artifacts:
- Screenshot: `screenshots/09-cart-bg.png`
- Console: `console-cart-bg.txt`

Notes:
- Empty state renders with clear “Продължи пазаруването”.
- Cookie banner overlaps bottom-of-viewport on standard pages → **FE-001**.

## Checkout — `/bg/checkout` (empty cart)

Artifacts:
- Screenshot: `screenshots/10-checkout-bg.png`
- Console: `console-checkout-bg.txt`

Notes:
- Checkout shell + progress indicator render.
- Empty cart state shown (no auth gating triggered in this path).

## EN spot-checks

- Home `/en`: `screenshots/21-home-en.png`
- Search `/en/search?q=iphone`: `screenshots/22-search-en-iphone.png`

Notes:
- Cookie consent UI appears similarly in EN; overlap risk remains (**FE-001**).
