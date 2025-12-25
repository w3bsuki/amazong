# UI/UX Checklist (Desktop + Mobile)

This is a **manual** checklist to run alongside Playwright so you catch the stuff automation misses (spacing, contrast, “feels broken”, etc.).

## Global (all pages)

- No horizontal scroll at common widths (375, 768, 1024, 1280)
- Typography scale consistent (headings not randomly shrinking)
- Buttons have consistent sizes + states (hover/active/disabled/loading)
- Links look like links (or clearly button-like)
- Skeleton/loading states do not jump wildly
- Error states are human-readable (no raw JSON)

## Accessibility (baseline)

- Keyboard nav works:
  - Tab order is sensible
  - Focus ring is visible on interactive elements
  - Dialogs trap focus; Esc closes
- Color contrast:
  - Text on buttons meets contrast
  - Muted text still readable
- Form fields:
  - labels exist (or aria-label)
  - errors shown near the field

## Desktop UX

- Header:
  - search opens/closes correctly
  - cart/wishlist/profile menus don’t overflow
- Category pages:
  - filters are usable (no cramped hit targets)
  - grid spacing stable
- Product page:
  - gallery works with mouse
  - sticky buy box / key actions visible

## Mobile UX

- Navigation:
  - hamburger/menu is reachable and scrollable
- Search:
  - mobile search overlay doesn’t block scrolling incorrectly
- Product page:
  - gallery swipe is smooth
  - sticky bar doesn’t cover critical content
- Forms (sell/checkout):
  - keyboard doesn’t hide inputs
  - CTA stays reachable

## Critical flow UX notes (launch blockers)

- Signup/login:
  - errors are actionable
  - success state is obvious
- Buy:
  - totals are correct + clearly displayed
  - checkout doesn’t dead-end
- Sell:
  - progress is obvious
  - validation tells user what to fix
- Profile:
  - save feedback is clear

## “Stop the line” criteria

If any of these happen, treat as a release blocker:

- Cannot sign up or sign in
- Cannot add to cart or reach checkout
- Cannot complete sell listing
- Mobile layout broken (overlaps, clipped CTAs)
- A11y tests fail in core pages (especially forms)
