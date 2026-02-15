# Gap Audit (Launch Blockers)

## Severity Legend

- `critical`: launch blocker with revenue/security or core flow break risk
- `high`: major gap in buyer/seller trust, operability, or core UX
- `medium`: important for polish/completeness before broad launch

## Top Launch Gaps

| Gap ID | Severity | Area | Description | Evidence |
|---|---|---|---|---|
| LG-001 | critical | Payments | Verify Stripe webhook idempotency under replay (`LAUNCH-001`) | `TASKS.md`, `app/api/checkout/webhook/route.ts` |
| LG-002 | critical | Payments/Support | Validate refund/dispute end-to-end (`LAUNCH-002`) | `TASKS.md`, `app/actions/orders.ts` |
| LG-003 | critical | Environments | Verify Stripe env separation (`LAUNCH-003`) | `TASKS.md` |
| LG-004 | critical | Auth/Security | Enable leaked password protection and re-check advisor (`LAUNCH-004`) | `TASKS.md` |
| LG-005 | high | Auth State UX | Logged-in state can render stale in client surfaces after in-place auth events | `components/providers/auth-state-manager.tsx`, `app/[locale]/_components/app-header.tsx`, `app/[locale]/_components/mobile-tab-bar.tsx` |
| LG-006 | high | Orders (Buyer) | Buyer cancel flow not fully completed (`R4.5`) | `REQUIREMENTS.md` |
| LG-007 | high | Orders (Seller) | Seller self-serve refund path incomplete (`R5.5`) | `REQUIREMENTS.md` |
| LG-008 | high | Notifications | In-app notifications incomplete (`R12.5`) and email notifications not fully shipped (`R12.6`) | `REQUIREMENTS.md`, `app/[locale]/(account)/account/(settings)/notifications/**` |
| LG-009 | high | Trust/Safety | Admin moderation workflow incomplete (`R13.5`) | `REQUIREMENTS.md`, `app/[locale]/(admin)/admin/**` |
| LG-010 | high | Trust/Safety | Prohibited-items enforcement still manual (`R13.6`) | `REQUIREMENTS.md` |
| LG-011 | high | Admin | User management and moderation depth incomplete (`R15.3`, `R15.4`) | `REQUIREMENTS.md`, `app/[locale]/(admin)/admin/**` |
| LG-012 | medium | Styling Consistency | Desktop `muted` shell variant does not match page shell muted canvas | `app/[locale]/(main)/_components/layout/desktop-shell.tsx`, `app/[locale]/_components/page-shell.tsx` |
| LG-013 | medium | Discovery | Saved searches are local-only; no server persistence/alerts (`R7.7`) | `app/[locale]/(main)/_components/search-controls/save-search-button.tsx` |
| LG-014 | medium | Accessibility | Screen reader labeling and WCAG AA completion still open (`R17.4`, `R17.5`) | `REQUIREMENTS.md` |
| LG-015 | medium | Product | Related items module not shipped (`R8.7`) | `REQUIREMENTS.md` |

## Risk-Lane Mapping

- `high-risk` lanes (human stop-and-ask before finalization):
  - auth/session/access control
  - payments/webhooks/billing/payouts
  - DB/RLS/schema
- `low-risk` lanes:
  - styling consistency
  - route-level UI polish
  - component dedupe/refactors with no auth/payment rule changes

## First Fix Candidates (Low-Risk)

1. Align `DesktopShell` muted variant with `PageShell` (`LG-012`).
2. Start route-level style consistency cleanup on search/category pages.
3. Build a shared product card surface wrapper to reduce drift between card variants.
