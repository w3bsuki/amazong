# UI Audit Checklist

## Design system compliance
- [ ] No gradients introduced (target: 0).
- [ ] Arbitrary values are reduced over time (target: < 20).
- [ ] Hardcoded colors (`#hex`, `rgb()`) eliminated.

## Component boundaries
- [ ] `components/ui/*` has no app imports/hooks.
- [ ] Shared composites live in `components/shared/*`.
- [ ] Shells live in `components/layout/*`.

## UX polish (launch-focused)
- [ ] Mobile touch targets meet minimum sizing.
- [ ] No layout shift from conditional headers/nav.
- [ ] Loading/empty states are consistent.
