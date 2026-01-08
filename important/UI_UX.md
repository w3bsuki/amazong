# Treido UI/UX Execution Plan (v1)

Based on the Jan 8 audit. This is a delivery plan, not a narrative report.

## Objectives
- Remove launch blockers (data quality + form UX).
- Preserve current visual language and behavior.
- Ship in small, verifiable steps.

## Non-Negotiables
- No redesigns, no new architecture layers, no gradients.
- Cards remain flat: border + rounded-md max, no heavy shadows.
- Avoid arbitrary Tailwind values unless required.
- All user-facing strings go through next-intl (messages/en.json + messages/bg.json).
- 1-3 files per change (max 5 only if one behavior).
- Do not log secrets or full request bodies.

## Scope (Routes and Components)
- Homepage: `components/layout/header/site-header.tsx`
- Auth: `app/[locale]/(auth)/_components/login-form.tsx`
  `app/[locale]/(auth)/_components/sign-up-form.tsx`
  `app/[locale]/(auth)/_components/forgot-password-form.tsx`
- Cart: `app/[locale]/(main)/cart/page.tsx`
  `components/layout/header/cart/cart-dropdown.tsx`
- Checkout: `app/[locale]/(checkout)/checkout/page.tsx`
- Sell: `app/[locale]/(sell)/sell/page.tsx`
  `app/[locale]/(sell)/sell/client.tsx`
- Categories/Search: `app/[locale]/(main)/categories/page.tsx`
  `app/[locale]/(main)/search/page.tsx`

## Success Criteria
- No broken product images on homepage and categories (spot-check 20 products).
- No obvious test data in public listings (spot-check 20 products).
- Auth and checkout show inline validation text for required fields.
- Mobile touch targets meet 44x44px minimum on auth pages.
- Typecheck and E2E smoke pass.

## Workstreams and Tasks

### P0 - Launch Blockers (do first)

1) Data quality cleanup (images + test listings)
   - Owner: Data/Content
   - Where: Supabase data (no code change)
   - Actions:
     - Identify products with missing or placeholder images.
     - Replace test listings (titles like "test", "e2e", numeric junk).
   - Acceptance:
     - 20/20 sampled products have real images and clean titles.
   - Verification:
     - Manual check on homepage and categories.

2) Auth inline validation + touch targets
   - Files:
     - `app/[locale]/(auth)/_components/login-form.tsx`
     - `app/[locale]/(auth)/_components/sign-up-form.tsx`
     - `app/[locale]/(auth)/_components/forgot-password-form.tsx`
   - Actions:
     - Add inline error text under inputs (i18n strings).
     - Increase checkbox/link touch targets to 44x44px.
   - Acceptance:
     - Error text appears on blur and on submit for empty fields.
     - All new strings localized.
   - Verification:
     - Typecheck + E2E smoke.

3) Checkout inline validation (on blur)
   - Files:
     - `app/[locale]/(checkout)/checkout/page.tsx`
   - Actions:
     - Validate required fields on blur with inline message.
   - Acceptance:
     - Empty required fields show clear, localized error text.
   - Verification:
     - Typecheck + E2E smoke.

### P1 - Pre-Launch (safe UX polish)

4) Header logo padding on mobile
   - Files:
     - `components/layout/header/site-header.tsx`
   - Actions:
     - Add consistent left padding for the logo on small screens.
   - Acceptance:
     - Logo is not cramped on 375px width.

5) Sell page checklist anchor links + mobile space
   - Files:
     - `app/[locale]/(sell)/sell/page.tsx`
     - `app/[locale]/(sell)/sell/client.tsx`
   - Actions:
     - Checklist items scroll to their sections.
     - Collapse tips/checklist into an expandable block on mobile.
   - Acceptance:
     - Tap checklist item jumps to correct section.
     - Mobile scroll length reduced without hiding required fields.

6) Cart popover CTA clarity
   - Files:
     - `components/layout/header/cart/cart-dropdown.tsx`
   - Actions:
     - Ensure "View Cart" and "Checkout" are equally visible.
   - Acceptance:
     - Both CTAs are visible without scrolling on 375px width.

### P2 - Post-Launch (optional, larger features)

- Dark mode toggle (if design system already supports it).
- Sticky header behavior.
- Social login options.
- Guest checkout.
- Address autocomplete.

Each P2 item should be a separate proposal with scope, risk, and tests.

## Verification Gates (every change)
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Rollback Plan
- Each task should be a small commit.
- If needed: revert the specific commit and re-run gates.
