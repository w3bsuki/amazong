# Desktop Playwright MCP Audit — Localhost (2026-02-05)

Base URL: `http://127.0.0.1:3000`  
Primary locale: `/bg` (spot-check `/en`)  
Viewport: Desktop `1440×900`  
State: Guest (cookies/storage cleared at start)

## Gate status

See: `gates.md`

| Gate | Status | Notes |
|---|---:|---|
| Preflight `/bg` | ✅ Pass | HTTP `200` |
| Health `/api/health/env` | ✅ Pass | `ok=true`, `missing=[]`, `appUrl=https://treido.eu` (safe fields only) |
| `pnpm -s typecheck` | ✅ Pass | Clean |
| `pnpm -s lint` | ✅ Pass | 0 errors, **539 warnings** |
| `pnpm -s styles:gate` | ✅ Pass | 0 findings |
| `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` | ✅ Pass | `20 passed`, `1 skipped` |

## Coverage (desktop)

For each route: screenshot + console error capture.

| Area | Route | Screenshot | Console |
|---|---|---|---|
| Home | `/bg` | `screenshots/01-home-bg.png` | `console-home-bg.txt` |
| Search | `/bg/search?q=iphone` | `screenshots/02-search-bg-iphone.png` | `console-search-bg-iphone.txt` |
| Search (AI modal) | `/bg/search?q=iphone` | `screenshots/03-search-bg-iphone-ai-modal.png` | `console-search-bg-iphone.txt` |
| Categories | `/bg/categories` | `screenshots/04-categories-bg.png` | `console-categories-bg.txt` |
| Category page | `/bg/categories/electronics` | `screenshots/05-category-electronics-bg.png` | `console-category-electronics-bg.txt` |
| Quick view | `/bg/categories/electronics` | `screenshots/06-category-electronics-product-drawer.png` | `console-category-electronics-bg.txt` |
| PDP | `/bg/tech_haven/macbook-pro-16-m3-max` | `screenshots/07-pdp-macbook-bg.png` | `console-pdp-macbook-bg.txt` |
| Store/profile | `/bg/tech_haven` | `screenshots/08-store-tech_haven-bg.png` | `console-store-tech_haven-bg.txt` |
| Cart | `/bg/cart` | `screenshots/09-cart-bg.png` | `console-cart-bg.txt` |
| Checkout | `/bg/checkout` | `screenshots/10-checkout-bg.png` | `console-checkout-bg.txt` |
| Auth | `/bg/auth/login` | `screenshots/11-auth-login-bg.png` | `console-auth-login-bg.txt` |
| Auth | `/bg/auth/sign-up` | `screenshots/12-auth-sign-up-bg.png` | `console-auth-sign-up-bg.txt` |
| Auth | `/bg/auth/forgot-password` | `screenshots/13-auth-forgot-password-bg.png` | `console-auth-forgot-password-bg.txt` |
| Sell (gated) | `/bg/sell` | `screenshots/14-sell-bg-gated.png` | `console-sell-bg.txt` |
| Chat (gated) | `/bg/chat` | `screenshots/15-chat-bg-gated.png` | `console-chat-bg.txt` |
| Account (redirect) | `/bg/account` | `screenshots/16-account-redirect-to-login.png` | `console-account-redirect-login.txt` |
| Orders (redirect) | `/bg/account/orders` | `screenshots/17-orders-redirect-to-login.png` | `console-orders-redirect-login.txt` |
| Legal | `/bg/terms` | `screenshots/18-terms-bg.png` | `console-terms-bg.txt` |
| Legal | `/bg/privacy` | `screenshots/19-privacy-bg.png` | `console-privacy-bg.txt` |
| Help | `/bg/customer-service` | `screenshots/20-customer-service-bg.png` | `console-customer-service-bg.txt` |
| EN spot-check | `/en` | `screenshots/21-home-en.png` | `console-home-en.txt` |
| EN spot-check | `/en/search?q=iphone` | `screenshots/22-search-en-iphone.png` | `console-search-en-iphone.txt` |
| Link check | `/bg/help` → `/bg/customer-service` | `screenshots/23-help-bg.png` | `console-help-bg.txt` |

## Issue counts

See: `issues-frontend.md`, `issues-backend.md`

| Severity | Count |
|---|---:|
| P0 (Blocker) | 1 |
| P1 (High) | 1 |
| P2 (Medium) | 2 |
| P3 (Low) | 1 |

## Top ship blockers / conversion killers

1) **FE-001 (P0)** Cookie consent banner uses `role="dialog"` and can cover bottom-of-viewport CTAs/content on desktop.  
2) **FE-002 (P1)** Auth “next” handling is locale-agnostic in some gated flows (`/sell`, `/chat`, `/plans`, `/checkout`) → risk of locale drop after login.  
3) **FE-003 (P2)** Product card primary click opens quick-view (no URL change) → potential confusion vs navigation + back-button expectations.  
4) **FE-004 (P2)** AI Mode opens modal; “availability / failure mode” not exercised beyond open/close (potential integration risk).  
5) **FE-005 (P3)** Console warning on PDP about an image source (non-blocking but can hide perf issues).

## Fix plan (3 small batches, per `docs/WORKFLOW.md`)

Batch 1 — Cookie consent UX/a11y
- Target: `components/layout/cookie-consent.tsx` (and any layout padding hook where mounted)
- Goal: banner is non-modal (no `role="dialog"`), doesn’t cover critical controls, and dismiss persists reliably
- Verify: `pnpm -s typecheck`, `pnpm -s lint`, `pnpm -s styles:gate`, `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

Batch 2 — Locale-preserving auth return paths
- Target: `components/shared/auth/auth-gate-card.tsx`, `app/[locale]/(sell)/_components/sign-in-prompt.tsx`, `app/[locale]/(chat)/chat/page.tsx`, plus any other `next=/...` usages found by `rg -n 'auth/login?next='`
- Goal: “next” always returns users to the same locale they started in (BG vs EN) without extra redirects
- Verify: `pnpm -s typecheck`, `pnpm -s lint`, `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

Batch 3 — Quick-view vs navigation expectations
- Target: `components/shared/product/product-card.tsx`, quick-view dialog/drawer components
- Goal: clarify primary click behavior; ensure back/escape/close feels native and doesn’t surprise users
- Verify: `pnpm -s typecheck`, `pnpm -s lint`, `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
