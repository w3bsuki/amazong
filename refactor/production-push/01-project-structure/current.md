# 01 — Project Structure: Current State

---

## Top-Level Layout

```
j:\amazong\
├── .codex_*.txt          ← audit artifacts (should be gitignored)
├── eslint-summary.txt    ← stale output
├── eslint.log            ← stale output
├── route_inventory.py    ← Python script (should be in scripts/)
├── supa.py               ← Python script (should be in scripts/)
├── supabase_scan.py      ← Python script (should be in scripts/)
├── proxy.ts              ← Next.js 16 middleware convention
├── tsconfig.tsbuildinfo  ← build artifact (should be gitignored)
│
├── app/                  ← 851 files, main application
├── components/           ← 173 files, reusable UI
├── lib/                  ← 98 files, domain logic
├── hooks/                ← 18 files, client hooks
├── i18n/                 ← 2 files, routing + request config
├── messages/             ← 2 files, en.json + bg.json
├── public/               ← static assets
├── scripts/              ← build/scan scripts
├── supabase/             ← migrations + types
├── __tests__/            ← unit tests
├── test/                 ← test utils/shims
├── e2e/                  ← Playwright specs
├── docs/                 ← project documentation
├── refactor/             ← refactor planning docs
├── codex/                ← Codex planning docs
├── designs/              ← design reference
└── refactor-with-opus/   ← legacy refactor docs
```

---

## app/ Directory (851 files)

### Route Groups

| Group | Path | Purpose | Layout |
|-------|------|---------|--------|
| `(main)` | `/` | Public marketplace | Standard header + bottom nav |
| `(account)` | `/account/*` | User dashboard | Account shell |
| `(auth)` | `/auth/*` | Login/signup flows | Auth layout |
| `(sell)` | `/sell/*` | Listing creation | Sell flow layout |
| `(checkout)` | `/checkout/*` | Payment flow | Checkout layout |
| `(chat)` | `/chat/*` | Messaging | Chat layout |
| `(business)` | `/dashboard/*` | Seller dashboard | Business layout |
| `(admin)` | `/admin/*` | Admin panel | Admin layout |
| `(onboarding)` | `/onboarding/*` | User onboarding | Onboarding layout |
| `(plans)` | `/plans` | Subscription plans | Plans layout |
| `[username]` | `/:username/*` | Public profiles + PDP | Dynamic layout |

### Route-Private Convention
Each route group uses `_components/`, `_lib/`, `_actions/`, `_providers/` for private code.
ESLint enforces no cross-group imports.

### Server Actions: `app/actions/` (40 files)
Mixed return patterns — 11 use Envelope, 29 use ad-hoc shapes.

### API Routes: `app/api/` (21 domains)
admin, assistant, auth, badges, billing, boost, categories, checkout, connect, health, orders, payments, plans, products, revalidate, sales, seller, subscriptions, upload-image, upload-chat-image, wishlist.

---

## components/ Directory (173 files)

| Folder | Count | Purpose |
|--------|-------|---------|
| `ui/` | 34 | shadcn/ui primitives |
| `shared/` | 25+ | Cross-route composites |
| `shared/product/` | 5+ | Product system |
| `shared/product/card/` | 19 | Card variants |
| `shared/search/` | 5+ | AI search |
| `shared/filters/` | 3+ | Filter controls |
| `shared/order-detail/` | 4 | Order UI |
| `layout/header/` | 8+ | Header system |
| `layout/sidebar/` | 8 | Sidebar system |
| `mobile/chrome/` | 5+ | Bottom nav, rails |
| `mobile/drawers/` | 6 | Drawer overlays |
| `mobile/category-nav/` | 2 | Category navigation |
| `desktop/` | 4 | Desktop-specific UI |
| `auth/` | 10 | Auth forms |
| `dropdowns/` | 3 | User dropdowns |
| `providers/` | 18 | Context providers |

---

## lib/ Directory (98 files, 0% client)

| Area | Key Files |
|------|-----------|
| `supabase/` | server.ts (4 clients), client.ts, middleware.ts, types, selects/ |
| `auth/` | require-auth.ts, admin.ts, business.ts, server-actions.ts |
| `data/` | categories.ts, products.ts, search-products.ts, plans.ts, etc. |
| `types/` | badges, categories, messages, products, etc. |
| `validation/` | auth.ts, orders.ts, password-strength.ts, username.ts |
| `ai/` | env.ts, models.ts, schemas/, tools/ |
| `filters/` | active-filter-count.ts, search-query.ts, etc. |
| `api/` | envelope.ts, response-helpers.ts, route-json.ts |

---

## Pain Points

1. **Root clutter:** ~16 stale files (audit outputs, Python scripts, build artifacts) in project root
2. **Blurry boundaries:** Cross-route UI lives in both `components/` AND `app/[locale]/_components/`
3. **API naming inconsistency:** `app/api/categories/[slug]/children/route.ts` uses `[slug]` for UUID parent ID
4. **generateStaticParams boilerplate:** 14 files, 6 return identical `routing.locales.map()`, 5 return `[]`
5. **Missing docs:** References to `docs/DOMAINS.md` and `ARCHITECTURE.md` that don't exist
6. **Legacy refactor artifacts:** `refactor-with-opus/` folder with potentially stale content
