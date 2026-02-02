# Sell Form UX Refactor: Gate at Publish

**Date:** 2026-02-03  
**Scope:** `/sell` form gating logic, mobile styling, Stripe payout flow  
**Status:** 🔄 In Progress

---

## Executive Summary

**Previous approach (abandoned):** Force Stripe setup during onboarding or at form entry.

**New approach:** Let users fill out the sell form completely, gate only at "Publish" action. This follows progressive disclosure best practices — users see value before friction.

**Key decisions:**
- ✅ Keep `/sell` as a route (not drawer) — handles Stripe redirects naturally
- ✅ Gate at Publish button only — form is always accessible
- ✅ Style mobile as drawer — slide-in animation, rounded top corners
- ✅ Keep hosted Stripe — no need for embedded Connect JS complexity

---

## Current State Analysis

### Problem

The `/sell` page **blocks the entire form** until Stripe payout is configured:

```tsx
// client.tsx L195-210 - CURRENT (BAD UX)
if (!isPayoutReady(payoutStatus)) {
  return <SellerPayoutSetup payoutStatus={payoutStatus} variant="compact" />
}
```

This is bad because:
- Users can't explore what selling looks like
- Friction at entry, not at value delivery
- Full-page Stripe redirect feels jarring

### Proposed Flow

```
[User taps FAB or navigates to /sell]
     ↓
[Fill listing form — photos, price, description]
     ↓
[Tap "Publish"]
     ↓
┌─ Stripe onboarded? ──────────────────────────┐
│  YES → Publish listing, show success         │
│  NO  → Show inline "Setup Payments" modal    │
│        → User clicks → Stripe hosted flow    │
│        → Returns to /sell?payout=complete    │
│        → Draft restored → "Ready to Publish" │
└──────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Remove Entry Gating

**File:** `app/[locale]/(sell)/sell/client.tsx`

Remove lines 195-210 (payout gating block). Keep only:
- Sign-in prompt for guests
- Basic profile check

### Phase 2: Add Publish-Time Gating

**Files:**
- `app/[locale]/(sell)/_components/sell-form-unified.tsx`
- `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`
- `app/[locale]/(sell)/_components/layouts/desktop-layout.tsx`

Add check when user clicks "Publish":
1. Check `isPayoutReady(payoutStatus)` 
2. If not ready, show modal with CTA
3. CTA links to `/api/connect/onboarding` with return URL `/sell?payout=complete`

### Phase 3: Handle Stripe Return

**File:** `app/[locale]/(sell)/sell/client.tsx`

When URL has `?payout=complete`:
1. Re-fetch payout status
2. Show success toast
3. Auto-restore draft from localStorage
4. Enable "Publish" button

### Phase 4: Style Mobile as Drawer

**File:** `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`

Add styling:
- `rounded-t-3xl` on container
- Slide-in animation from bottom
- Drag handle at top (visual only)
- Full viewport height (`h-dvh`)

### Phase 5: UX Enhancements (From Audit)

1. **Photo tips** in photos-field.tsx
2. **Category icons** in category-modal
3. **Product preview card** in review step

---

## File Changes Summary

### Modified Files
| File | Change |
|------|--------|
| `app/[locale]/(sell)/sell/client.tsx` | Remove payout gating, add return URL handling |
| `app/[locale]/(sell)/_components/sell-form-unified.tsx` | Add publish-time payout check |
| `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx` | Drawer-like styling |
| `app/[locale]/(sell)/_components/fields/photos-field.tsx` | Add photo tips |
| `app/[locale]/(sell)/_components/ui/category-modal/index.tsx` | Add icons |
| `app/[locale]/(sell)/_components/fields/review-field.tsx` | Add preview card |

### New Files
| File | Purpose |
|------|---------|
| `app/[locale]/(sell)/_components/ui/payout-required-modal.tsx` | Modal shown at publish time |

---

## Verification

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

### Manual Testing
- [ ] Non-verified user can fill form completely
- [ ] Publish shows "Setup Payments" modal
- [ ] Stripe redirect works, returns to /sell
- [ ] Draft restored after return
- [ ] Verified user can publish directly
- [ ] Mobile looks like drawer (rounded, slide-in)

---

## Decisions

| Decision | Rationale |
|----------|-----------|
| Gate at Publish, not entry | Progressive disclosure — show value first |
| Keep hosted Stripe | Works now, embedded needs new package |
| Route styled as drawer | Handles redirects naturally, feels native |
| No onboarding changes | Buyers shouldn't see payment setup |
