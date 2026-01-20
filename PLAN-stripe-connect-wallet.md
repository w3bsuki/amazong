# Stripe Connect & Wallet Implementation Plan

**Created:** 2026-01-19  
**Status:** Ready to implement  
**Estimated effort:** ~3 hours total

---

## Overview

Enable full Stripe Connect flow for marketplace payments:
- Sellers must set up payout (Stripe Express) before listing
- Buyers pay via Stripe Checkout
- Platform takes 3% commission (deducted at transfer)
- Sellers access balance/payouts via Stripe Express Dashboard

---

## Current State ✅

| Component | Status | Location |
|-----------|--------|----------|
| Stripe Connect lib | ✅ Done | `lib/stripe-connect.ts` |
| Express account creation | ✅ Done | `/api/connect/onboarding` |
| Webhook handler | ✅ Done | `/api/connect/webhook` |
| Dashboard link | ✅ Done | `/api/connect/dashboard` |
| Payout settings page | ✅ Done | `/seller/settings/payouts` |
| Checkout with Connect | ✅ Done | `app/[locale]/(checkout)/_actions/checkout.ts` |
| DB table | ✅ Done | `seller_payout_status` |

---

## Phase 1: Platform Fee Fix (5 min) ⚡

### Task 1.1: Reduce platform fee from 10% to 3%

**File:** `lib/stripe-connect.ts`

```diff
- export const PLATFORM_FEE_PERCENT = 10
+ export const PLATFORM_FEE_PERCENT = 3
```

**Why 3%?**
- Stripe takes ~2.9% + €0.25 from the gross (paid by platform from commission)
- 3% platform fee means we keep ~0.1% net after Stripe fees on small orders
- Competitive with OLX/Bazar (they charge for visibility, not commission)
- Can increase later once we prove value

---

## Phase 2: Gate /sell Form (1 hour) 🚧

Sellers cannot list products without completing Stripe Connect setup.

### Task 2.1: Add payout status check to /sell page

**File:** `app/[locale]/(sell)/sell/page.tsx`

Add after fetching seller data:
```typescript
// Fetch payout status
const { data: payoutStatus } = await supabase
  .from("seller_payout_status")
  .select("charges_enabled, payouts_enabled, details_submitted")
  .eq("seller_id", user.id)
  .maybeSingle()

const isPayoutReady = payoutStatus?.charges_enabled && payoutStatus?.payouts_enabled
```

Pass to client:
```typescript
<SellPageClient 
  ...
  payoutStatus={{
    isReady: isPayoutReady ?? false,
    needsSetup: !payoutStatus,
    incomplete: payoutStatus && !isPayoutReady,
  }}
/>
```

### Task 2.2: Show setup prompt in SellPageClient

**File:** `app/[locale]/(sell)/sell/client.tsx`

Before the form, show a blocking prompt if payout not ready:

```tsx
{!payoutStatus.isReady && (
  <Card className="border-warning bg-warning/5">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertCircle className="size-5 text-warning" />
        {t("payoutSetupRequired")}
      </CardTitle>
      <CardDescription>
        {t("payoutSetupDescription")}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild>
        <Link href="/seller/settings/payouts">
          {t("setupPayouts")}
        </Link>
      </Button>
    </CardContent>
  </Card>
)}
```

### Task 2.3: Add i18n strings

**Files:** `messages/en.json`, `messages/bg.json`

```json
{
  "Sell": {
    "payoutSetupRequired": "Set Up Payouts First",
    "payoutSetupDescription": "Before you can list items for sale, you need to connect your bank account to receive payments.",
    "setupPayouts": "Set Up Payouts"
  }
}
```

Bulgarian:
```json
{
  "Sell": {
    "payoutSetupRequired": "Настройте плащанията първо",
    "payoutSetupDescription": "Преди да можете да публикувате обяви за продажба, трябва да свържете банковата си сметка за получаване на плащания.",
    "setupPayouts": "Настройка на плащания"
  }
}
```

---

## Phase 3: Wallet in Account Drawer (1 hour) 💰

Add wallet status section to mobile account drawer.

### Task 3.1: Fetch payout status in Account Drawer

**File:** `components/mobile/drawers/account-drawer.tsx`

Add to the parallel fetch:
```typescript
const [profileResult, sellerStatsResult, ordersResult, productsResult, payoutResult] = await Promise.all([
  // ... existing queries
  supabase
    .from("seller_payout_status")
    .select("charges_enabled, payouts_enabled, details_submitted")
    .eq("seller_id", user.id)
    .maybeSingle(),
])
```

Add state:
```typescript
const [payoutStatus, setPayoutStatus] = useState<{
  chargesEnabled: boolean
  payoutsEnabled: boolean
  detailsSubmitted: boolean
} | null>(null)
```

### Task 3.2: Add Wallet section UI

After the quick links, before recent listings:

```tsx
{/* Wallet Section */}
<div className="px-inset py-4 border-b border-border">
  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
    {tAccount("wallet")}
  </h3>
  
  {payoutStatus?.chargesEnabled && payoutStatus?.payoutsEnabled ? (
    // Wallet is set up - show dashboard link
    <button
      onClick={handleOpenStripeDashboard}
      className="flex items-center justify-between w-full p-3 rounded-lg bg-success/10 border border-success/20"
    >
      <div className="flex items-center gap-3">
        <Wallet size={20} className="text-success" />
        <div className="text-left">
          <p className="text-sm font-medium">{tAccount("walletActive")}</p>
          <p className="text-xs text-muted-foreground">{tAccount("viewBalance")}</p>
        </div>
      </div>
      <CaretRight size={16} className="text-muted-foreground" />
    </button>
  ) : (
    // Wallet needs setup
    <Link
      href="/seller/settings/payouts"
      onClick={handleClose}
      className="flex items-center justify-between w-full p-3 rounded-lg bg-warning/10 border border-warning/20"
    >
      <div className="flex items-center gap-3">
        <Wallet size={20} className="text-warning" />
        <div className="text-left">
          <p className="text-sm font-medium">{tAccount("setupWallet")}</p>
          <p className="text-xs text-muted-foreground">{tAccount("receivePayments")}</p>
        </div>
      </div>
      <CaretRight size={16} className="text-muted-foreground" />
    </Link>
  )}
</div>
```

### Task 3.3: Add dashboard link handler

```typescript
const handleOpenStripeDashboard = async () => {
  try {
    const response = await fetch("/api/connect/dashboard", { method: "POST" })
    const data = await response.json()
    if (data.url) {
      window.open(data.url, "_blank")
    }
  } catch (error) {
    console.error("Failed to open Stripe dashboard:", error)
  }
}
```

### Task 3.4: Add i18n strings for wallet

**Files:** `messages/en.json`, `messages/bg.json`

```json
{
  "AccountDrawer": {
    "wallet": "Wallet",
    "walletActive": "Wallet Active",
    "viewBalance": "View balance & payouts",
    "setupWallet": "Set Up Wallet",
    "receivePayments": "Connect to receive payments"
  }
}
```

Bulgarian:
```json
{
  "AccountDrawer": {
    "wallet": "Портфейл",
    "walletActive": "Портфейлът е активен",
    "viewBalance": "Виж баланс и плащания",
    "setupWallet": "Настрой портфейл",
    "receivePayments": "Свържи се за получаване на плащания"
  }
}
```

---

## Phase 4: Testing & Verification (1 hour) ✅

### Test Scenarios

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | New seller visits /sell without payout setup | See "Set Up Payouts First" card, form disabled |
| 2 | Seller clicks setup → completes Stripe onboarding | Redirected back, can now list |
| 3 | Account drawer for seller without payout | Shows "Set Up Wallet" CTA |
| 4 | Account drawer for seller with payout | Shows "Wallet Active" with dashboard link |
| 5 | Buyer purchases item | Checkout succeeds, seller sees in Stripe dashboard |
| 6 | Check platform fee in Stripe | 3% application_fee_amount |

### Manual Test Flow

```bash
# 1. Start dev server
pnpm dev

# 2. Create test seller account
# 3. Try to access /sell → should show setup prompt
# 4. Complete Stripe Connect onboarding (use test data)
# 5. Return to /sell → form should be enabled
# 6. Create a listing
# 7. As buyer, purchase the item
# 8. Check Stripe dashboard for correct fee split
```

---

## Implementation Order

```
Phase 1 (5 min)   → Platform fee fix
Phase 2 (1 hour)  → Gate /sell form  
Phase 3 (1 hour)  → Wallet in drawer
Phase 4 (1 hour)  → Testing
```

**Total: ~3 hours**

---

## Environment Variables Required

Ensure these are set in `.env.local` and production:

```env
STRIPE_SECRET_KEY=sk_live_xxx          # or sk_test_xxx for testing
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_xxx # Connect-specific webhook
NEXT_PUBLIC_SITE_URL=https://treido.eu  # For return URLs
```

---

## Post-Launch Considerations

1. **Balance display** — Currently using Stripe Express Dashboard. Could add inline balance later via `stripe.balance.retrieve()` with connected account.

2. **Payout schedule** — Default is automatic (daily/weekly). Sellers can configure in their Stripe dashboard.

3. **Platform fee adjustment** — Easy to change in `lib/stripe-connect.ts`. Consider tiered fees (lower for high-volume sellers).

4. **Refunds** — Currently manual. Consider adding refund button in seller dashboard.

---

## Files to Modify

| File | Phase | Changes |
|------|-------|---------|
| `lib/stripe-connect.ts` | 1 | Change fee to 3% |
| `app/[locale]/(sell)/sell/page.tsx` | 2 | Add payout status fetch |
| `app/[locale]/(sell)/sell/client.tsx` | 2 | Add setup prompt UI |
| `components/mobile/drawers/account-drawer.tsx` | 3 | Add wallet section |
| `messages/en.json` | 2, 3 | Add i18n strings |
| `messages/bg.json` | 2, 3 | Add i18n strings |

---

## Gates (run after each phase)

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
