# Refactor Audit — Track A (Frontend/UI) — 2026-01-18

## Scope
- app/, components/, hooks/, messages/, styling

## Findings

1) [High] Components import app actions (boundary violation)
- Evidence:
  - [components/seller/seller-rate-buyer-actions.tsx](components/seller/seller-rate-buyer-actions.tsx#L6-L7)
  - [components/seller/follow-seller-button.tsx](components/seller/follow-seller-button.tsx#L6)
  - [components/pricing/plans-modal.tsx](components/pricing/plans-modal.tsx#L25)
  - [components/orders/order-status-actions.tsx](components/orders/order-status-actions.tsx#L23)
  - [components/buyer/buyer-order-actions.tsx](components/buyer/buyer-order-actions.tsx#L23-L24)
  - [components/auth/post-signup-onboarding-modal.tsx](components/auth/post-signup-onboarding-modal.tsx#L34)
- Fix direction: move server actions behind `lib/` services or route-layer handlers; pass callbacks into `components/` so shared UI doesn’t import `app/`.

2) [Medium] `lib` includes React render helpers (boundary violation)
- Evidence: [lib/category-icons.tsx](lib/category-icons.tsx#L8)
- Fix direction: move React rendering into components; keep `lib/` as data-only mapping/lookup.

3) [Medium] i18n bypass via locale ternaries (hardcoded copy)
- Evidence:
  - [components/mobile/mobile-home.tsx](components/mobile/mobile-home.tsx#L135)
  - [components/mobile/mobile-home.tsx](components/mobile/mobile-home.tsx#L142)
- Fix direction: move to `next-intl` (`messages/en.json`, `messages/bg.json`) and read via `useTranslations`.

4) [Medium] i18n bypass in admin docs UI (hardcoded strings)
- Evidence:
  - [app/[locale]/(admin)/admin/docs/_components/docs-content.tsx](app/%5Blocale%5D/(admin)/admin/docs/_components/docs-content.tsx#L165)
  - [app/[locale]/(admin)/admin/docs/_components/docs-content.tsx](app/%5Blocale%5D/(admin)/admin/docs/_components/docs-content.tsx#L449-L452)
  - [app/[locale]/(admin)/admin/docs/_components/docs-content.tsx](app/%5Blocale%5D/(admin)/admin/docs/_components/docs-content.tsx#L483-L486)
- Fix direction: move strings to `messages/*` and use `useTranslations`.

5) [Medium] Hardcoded Tailwind colors in UI
- Evidence:
  - [components/mobile/mobile-home.tsx](components/mobile/mobile-home.tsx#L133)
  - [components/mobile/mobile-home.tsx](components/mobile/mobile-home.tsx#L169)
  - [components/mobile/mobile-home.tsx](components/mobile/mobile-home.tsx#L197)
  - [app/[locale]/(admin)/admin/docs/_components/docs-content.tsx](app/%5Blocale%5D/(admin)/admin/docs/_components/docs-content.tsx#L66-L67)
- Fix direction: replace with semantic tokens/variants (e.g., badge/status variants) per styling rules.

6) [Low] Duplicate “Free shipping” badge markup (duplication)
- Evidence:
  - [components/mobile/mobile-home.tsx](components/mobile/mobile-home.tsx#L195-L199)
  - [components/mobile/mobile-home.tsx](components/mobile/mobile-home.tsx#L337-L339)
- Fix direction: extract a shared badge component/renderer used in both sections.

7) [Low] Hardcoded admin task labels and colors
- Evidence:
  - [app/[locale]/(admin)/admin/tasks/_components/tasks-content.tsx](app/%5Blocale%5D/(admin)/admin/tasks/_components/tasks-content.tsx#L50-L53)
  - [app/[locale]/(admin)/admin/tasks/_components/tasks-content.tsx](app/%5Blocale%5D/(admin)/admin/tasks/_components/tasks-content.tsx#L91)
- Fix direction: move labels/toasts to `messages/*` and replace color literals with semantic variants.
