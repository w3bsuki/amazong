# Codebase Audit — 2026-01-17

Scope: 30-minute audit with 5 phases using subagents (architecture scan, boundary review, duplication/overengineering, hardcoding/bad practices, synthesis). Focus on architecture and folder structure for the current Next.js 16 + React 19 stack.

## Executive Summary (Biggest Offenders)

1) **Layering violations (components → app actions)**
   - Reusable components import server actions from app layer, coupling UI to routing/actions and breaking boundaries.
   - Evidence:
     - [components/seller/follow-seller-button.tsx](components/seller/follow-seller-button.tsx#L6)
     - [components/seller/seller-rate-buyer-actions.tsx](components/seller/seller-rate-buyer-actions.tsx#L6-L7)
     - [components/pricing/plans-modal.tsx](components/pricing/plans-modal.tsx#L25)
     - [components/orders/order-status-actions.tsx](components/orders/order-status-actions.tsx#L23)
     - [components/buyer/buyer-order-actions.tsx](components/buyer/buyer-order-actions.tsx#L23-L24)
     - [components/auth/post-signup-onboarding-modal.tsx](components/auth/post-signup-onboarding-modal.tsx#L34)

2) **lib contains React/UI rendering**
   - `lib` should be pure utilities, but it imports React and returns React nodes.
   - Evidence: [lib/category-icons.tsx](lib/category-icons.tsx#L8), [lib/category-icons.tsx](lib/category-icons.tsx#L227)

3) **Demo artifacts in production routing tree**
   - Demo routes and mock data are embedded in app routing, increasing maintenance and drift.
   - Evidence:
     - [app/[locale]/(main)/demo/desktop/page.tsx](app/%5Blocale%5D/(main)/demo/desktop/page.tsx#L23)
     - [app/[locale]/(demo)/demo/mobile/_components/mobile-demo-landing.tsx](app/%5Blocale%5D/(demo)/demo/mobile/_components/mobile-demo-landing.tsx#L42)

4) **i18n policy violations (hardcoded user-facing strings)**
   - User text is embedded directly instead of using `next-intl` message catalogs.
   - Evidence:
     - [components/support/support-chat-widget.tsx](components/support/support-chat-widget.tsx#L336)
     - [components/shared/product/seller-products-grid.tsx](components/shared/product/seller-products-grid.tsx#L66)
     - [components/shared/product/seller-banner.tsx](components/shared/product/seller-banner.tsx#L27)
     - [components/orders/order-status-actions.tsx](components/orders/order-status-actions.tsx#L165)

5) **Legacy/backup assets in app/**
   - Old/backup CSS files live inside the routing tree.
   - Evidence: [app/globals.css.backup](app/globals.css.backup), [app/globals.css.old](app/globals.css.old)

---

## Phase 1 — Architecture hotspots

- **Component layer coupled to app actions**: common/shared components directly import from `@/app/actions/*`, creating tight coupling and limiting reuse outside app routing context.
  - Evidence: [components/seller/follow-seller-button.tsx](components/seller/follow-seller-button.tsx#L6)
- **Demo artifacts in production routes**: demo routes are in the same routing tree as production.
  - Evidence: [app/[locale]/(main)/demo/desktop/page.tsx](app/%5Blocale%5D/(main)/demo/desktop/page.tsx#L23)

## Phase 2 — Folder boundary issues

- **`lib` violates “no React” boundary**: UI rendering in `lib` breaks separation of concerns.
  - Evidence: [lib/category-icons.tsx](lib/category-icons.tsx#L8)
- **Route-private boundaries**: no cross-group imports detected in a spot check (route-private `_components` appear to stay within their group).

## Phase 3 — Duplication & over‑engineering

- **Demo mobile mock stack**: the demo landing defines mock data and its own UI stack, overlapping with production intent and adding maintenance overhead.
  - Evidence: [app/[locale]/(demo)/demo/mobile/_components/mobile-demo-landing.tsx](app/%5Blocale%5D/(demo)/demo/mobile/_components/mobile-demo-landing.tsx#L42)
- **Large icon mapping duplication**: the file defines both `categoryIconComponents` and an `iconMap` inside `getCategoryIcon`, duplicating mapping logic.
  - Evidence: [lib/category-icons.tsx](lib/category-icons.tsx#L92), [lib/category-icons.tsx](lib/category-icons.tsx#L227)

## Phase 4 — Hardcoding & bad practices

- **Hardcoded UI copy (i18n violations)**:
  - [components/support/support-chat-widget.tsx](components/support/support-chat-widget.tsx#L336)
  - [components/shared/product/seller-products-grid.tsx](components/shared/product/seller-products-grid.tsx#L66)
  - [components/orders/order-status-actions.tsx](components/orders/order-status-actions.tsx#L165)
- **Hardcoded currencies** (defaults to EUR scattered):
  - [components/shared/wishlist/wishlist-drawer.tsx](components/shared/wishlist/wishlist-drawer.tsx#L53)
  - [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx#L109)

## Phase 5 — Tech debt summary

- **Boundary drift**: `components/` importing `app/` actions is a systemic layering problem.
- **Demo/production intermixing**: demo routes and mock data live in production app tree.
- **i18n inconsistency**: user-facing strings not centralized in `messages/`.
- **Legacy artifacts**: unused backup CSS files in `app/` add noise and risk.

---

## Recommended Focus Areas (next 2–3 sprints)

1) **Uncouple UI from app actions**: move server actions behind a stable interface in `lib/` or dedicated service modules, and pass handlers from route layer.
2) **Split demo assets**: isolate demo routes to a separate app group or feature flag, or move to `codex/` demo harnesses.
3) **Normalize i18n**: migrate hardcoded strings to `messages/en.json` + `messages/bg.json` and use `next-intl` across components.
4) **Clean legacy files**: delete backup CSS files under `app/`.
5) **Refactor `lib/category-icons`**: move React rendering to components; keep only mapping/lookup in `lib`.
