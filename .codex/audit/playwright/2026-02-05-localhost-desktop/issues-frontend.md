# Frontend Issues — Desktop localhost audit (2026-02-05)

Viewport: Desktop `1440×900`  
Base URL: `http://127.0.0.1:3000`  
Locales: `/bg` primary, `/en` spot-check

## Severity rubric

- **P0 (Blocker)**: breaks critical path, blocks interaction, or causes major trust loss
- **P1 (High)**: strong conversion/retention hit, wrong locale/route, or high-likelihood user confusion
- **P2 (Medium)**: noticeable UX/a11y problems, but workaround exists
- **P3 (Low)**: polish / warnings / minor inconsistencies

---

## FE-001 — P0 — Cookie consent banner is a dialog + can cover critical UI

Affected routes (examples):
- `/bg/categories/electronics` (`screenshots/05-category-electronics-bg.png`)
- `/bg/tech_haven/macbook-pro-16-m3-max` (`screenshots/07-pdp-macbook-bg.png`)
- `/bg/terms` (`screenshots/18-terms-bg.png`)
- `/bg/privacy` (`screenshots/19-privacy-bg.png`)
- `/bg/customer-service` (`screenshots/20-customer-service-bg.png`)
- `/en` (`screenshots/21-home-en.png`)

Repro:
1) Open any standard page (non-auth, non-checkout), guest state.
2) Wait ~1s for cookie consent to appear.
3) Observe bottom-of-viewport content and attempt to interact with controls near the bottom.

Expected:
- Consent UI is non-modal (no dialog semantics) and does not obscure critical controls/content.
- Page reserves space or offsets critical sticky UI when the banner is visible.

Actual:
- Consent wrapper uses `role="dialog"` and appears as a dialog in the accessibility tree.
- Banner can cover bottom-of-viewport content on desktop (notably in product/category views).

Evidence:
- Screenshots above; console captures show **0 errors** for these routes.

Likely code area:
- `components/layout/cookie-consent.tsx:65` (fixed positioning)
- `components/layout/cookie-consent.tsx:67` (`role="dialog"` + aria labels)

---

## FE-002 — P1 — Auth “next” is locale-agnostic in some gated flows (locale drop risk)

Affected routes:
- `/bg/sell` (`screenshots/14-sell-bg-gated.png`) → `/bg/auth/login?next=%2Fsell`
- `/bg/chat` (`screenshots/15-chat-bg-gated.png`) → `/bg/auth/login?next=%2Fchat`
- (code indicates similar patterns for plans/checkout via direct links; see below)

Repro:
1) Visit a gated route as guest (e.g. `/en/sell` or `/en/chat`).
2) Click “Sign in”.
3) After successful auth, verify you return to the same locale route you started from.

Expected:
- Post-auth return path preserves locale (`/en/...` stays `/en/...`, `/bg/...` stays `/bg/...`).

Actual:
- Some gated surfaces pass `nextPath` as locale-agnostic (`/sell`, `/chat`, etc.), producing `next=%2F...`.
- Other surfaces (account redirects) include locale in `next` (`next=%2Fbg%2Faccount`), so behavior is inconsistent.

Evidence:
- `/bg/sell` screenshot shows locale-agnostic `next` param: `screenshots/14-sell-bg-gated.png`
- `/bg/chat` screenshot shows locale-agnostic `next` param: `screenshots/15-chat-bg-gated.png`
- `/bg/account` redirect includes locale: `screenshots/16-account-redirect-to-login.png`

Likely code area:
- `app/[locale]/(sell)/_components/sign-in-prompt.tsx:15` (`nextPath="/sell"`)
- `app/[locale]/(chat)/chat/page.tsx:42` (`nextPath="/chat"`)
- `components/shared/auth/auth-gate-card.tsx:39` (strips locale prefix before building `next`)
- Additional occurrences found by grep:
  - `app/[locale]/(plans)/_components/plans-page-client.tsx:257` (`/auth/login?next=/plans`)
  - `app/[locale]/(checkout)/_components/checkout-page-client.tsx:157` (`/auth/login?next=/checkout`)

---

## FE-003 — P2 — Product card primary click opens quick-view (no URL change)

Affected routes:
- Category grid (example): `/bg/categories/electronics`

Repro:
1) Open `/bg/categories/electronics`.
2) Click a product card.
3) Observe the quick-view dialog opens while the URL remains the category URL.

Expected (desktop convention):
- Primary click navigates to PDP, with optional quick view on secondary affordance; or modal route updates URL + supports back-button close.

Actual:
- Primary click opens quick view and calls `preventDefault()` (no URL change).
- “View full page” exists, but this adds a step and can be surprising.

Evidence:
- `screenshots/06-category-electronics-product-drawer.png`

Likely code area:
- `components/shared/product/product-card.tsx:260` (quick-view click policy: “no URL change”)
- `components/shared/product/product-card.tsx:270` (`e.preventDefault()`)
- `components/shared/product/product-card.tsx:295` (`openProductQuickView(...)`)
- `components/shared/product/quick-view/product-quick-view-content.tsx:294` (“view full page” label)

---

## FE-004 — P2 — AI Mode modal opens; availability/failure mode not validated end-to-end

Affected routes:
- `/bg/search?q=iphone` (`screenshots/03-search-bg-iphone-ai-modal.png`)

Repro:
1) Navigate to `/bg/search?q=iphone`.
2) Toggle “AI Режим”.
3) Observe AI chat modal opens; close with `Esc`.

Expected:
- If AI is unavailable in local/dev, UI clearly communicates and fails gracefully.

Actual:
- Modal opens and closes cleanly (no console errors captured), but prompt submission wasn’t exercised in this audit run.

Likely code area:
- `components/desktop/desktop-search.tsx:39` (AI mode state)
- `components/shared/search/search-ai-chat.tsx:151` (AI modal header)

---

## FE-005 — P3 — PDP shows a console warning about an image source

Affected route:
- `/bg/tech_haven/macbook-pro-16-m3-max` (`screenshots/07-pdp-macbook-bg.png`)

Observed:
- Console shows `0 errors, 1 warnings` on the PDP (see `console-pdp-macbook-bg.txt`).

Impact:
- Likely non-blocking, but can hide real issues if warnings become noisy.
