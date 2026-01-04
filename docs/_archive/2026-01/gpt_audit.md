## Site Audit (treido.eu) — 2025-12-29

### What I observed (runtime, Playwright MCP)
- Cookie banner strings missing: repeated `MISSING_MESSAGE: Cookies.*` in console on `/en/search` and product detail; dialog shows raw keys (Cookies.descriptionShort, Cookies.acceptAll, etc.).
- Cookie dialog blocks content: persistent modal on search/product pages; page still scrolls, but UX is broken and text is placeholder/English-only.
- Product detail rendering appears empty/placeholder: `/en/tech_haven/next-gen-gaming-console` shows header/footer only; main content absent while cookie errors spam console.
- Search page ships seeded/demo data: 20+ “tech_haven” products with fake ratings/discounts; likely non-production content.
- Navigation links point to stubs or 404s (e.g., social links are `#`, many footer links likely unimplemented); Sell redirects straight to login (no guest funnel).

### Prioritized remediation plan (MAX depth)
**P0: Stop broken UI/UX regressions**
- Fix i18n keys for cookie banner; add missing `Cookies.*` strings for `en` (and other locales) in `messages/` and ensure banner renders human text.
- Ensure cookie banner can be dismissed and stores consent; add automated test to assert no `MISSING_MESSAGE` console errors on load.
- Restore product detail rendering: confirm route `/[locale]/[username]/[productSlug]` or `/[locale]/product/[id]` fetches data; add fallback skeleton + error boundary so page never renders empty.

**P1: Replace placeholder content with real or gated experiences**
- Swap demo catalog on `/en/search` with live inventory API (or hide sections behind “Coming soon” with clear copy). Remove fake ratings/discounts.
- Audit nav/footer links; either implement destinations or mark them as disabled with honest labels. Replace `#` social URLs.
- Revisit Sell flow: if auth-gated, show pre-login marketing explainer instead of abrupt redirect; add CTA to login/signup.

**P2: Hardening & quality gates**
- Add Playwright smoke to load: home, search, product detail, sell/login, cookie banner dismissal; fail on console `MISSING_MESSAGE` or empty main content.
- Add i18n lint: ensure all message keys referenced in UI exist for supported locales.
- Monitor runtime logs: wire `nextjs_call:get_errors` into CI gate; fail build on new errors.

### Suggested work queue
1) I18n: add missing `Cookies.*` strings; re-run Playwright to confirm zero console errors.
2) Cookie UX: make consent modal dismissible, persist choice, and ensure body scroll lock.
3) PDP: trace data source for `/[locale]/[username]/[productSlug]`; add loading/error states and render core product info. Create regression test.
4) Search data: replace seeded listings; if backend not ready, gate section with “Coming soon” copy and hide fake ratings/prices.
5) Navigation hygiene: fix or hide dead links (social, footer, dashboard/admin stubs); add 404 handling where needed.
6) Tests: add Playwright smoke + console-error assertion; add i18n key check in CI.

### Coverage executed
- Home `/en`
- Login `/en/auth/login`
- Sell `/en/sell` (redirected to login)
- Search `/en/search` (captured cookie errors + demo data)
- Product detail `/en/tech_haven/next-gen-gaming-console` (render empty + cookie errors)