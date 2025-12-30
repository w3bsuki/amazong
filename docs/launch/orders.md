# 📋 Orders & Sales Management

> **Status**: 🟢 90% Complete
> **Priority**: P0

---

## ✅ Working Features

- [x] Buyer can view order history
- [x] Seller can view and manage sales
- [x] Order status workflow: `pending` → `received` → `shipped` → `delivered`
- [x] Tracking number & carrier support
- [x] Timestamps for each status change
- [x] Order detail view with all items
- [x] Seller can mark items as shipped
- [x] Buyer can mark items as received/delivered

---

## 🔴 Issues to Fix

### P0 - Launch Blockers
_None - core flow works_

### P1 - High Priority
- [ ] **Order cancellation** - Not fully implemented
- [ ] **Email notifications** - None sent for order status changes
- [ ] **Dispute flow** - No mechanism for buyer/seller disputes

### P2 - Nice to Have
- [ ] Returns/refunds flow
- [ ] Automatic status updates from carriers
- [ ] PDF invoice generation
- [ ] Bulk order management for sellers

---

## 🧪 Test Cases

### Manual QA
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 1 | Complete purchase | Order appears in buyer's orders | ⬜ |
| 2 | View order details | All items, prices, status visible | ⬜ |
| 3 | Seller marks as shipped | Status updates, tracking shown | ⬜ |
| 4 | Buyer marks as received | Status updates to delivered | ⬜ |
| 5 | View sales as seller | All sales visible with actions | ⬜ |
| 6 | Add tracking number | Saved and displayed to buyer | ⬜ |
| 7 | Cancel order (if allowed) | Order cancelled, stock restored | ⬜ |
| 8 | Order management on mobile | Full functionality | ⬜ |

### Automated (E2E)
- [e2e/orders.spec.ts](../../e2e/orders.spec.ts)

---

## 📁 Key Files

```
app/actions/
└── orders.ts                      # Order operations (899 lines)

lib/
└── order-status.ts                # Status definitions & helpers

app/[locale]/(account)/account/
├── orders/                        # Buyer order views
│   ├── page.tsx                   # Order list
│   └── [id]/page.tsx              # Order detail
└── sales/                         # Seller sales views
    ├── page.tsx                   # Sales list
    └── [id]/page.tsx              # Sale detail

components/orders/
└── order-status-manager.tsx       # Status update UI
```

---

## 📝 Order Status Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────────┐
│ PENDING  │───▶│ RECEIVED │───▶│ SHIPPED  │───▶│ DELIVERED │
└──────────┘    └──────────┘    └──────────┘    └───────────┘
     │               │               │
     │               │               │
     ▼               ▼               ▼
┌──────────┐   (automatic on   (seller adds
│CANCELLED │    payment)       tracking)
└──────────┘
```

### Status Responsibilities
| Status | Who Sets | Trigger |
|--------|----------|---------|
| pending | System | Order created |
| received | System | Payment confirmed |
| shipped | Seller | Manual + tracking |
| delivered | Buyer | Manual confirmation |
| cancelled | Buyer/Seller | Manual (with conditions) |

---

## 📝 Email Notifications Needed

Currently no emails sent. Should implement:

| Event | Recipient | Template |
|-------|-----------|----------|
| Order placed | Buyer | Order confirmation |
| Order placed | Seller | New sale notification |
| Order shipped | Buyer | Shipping notification with tracking |
| Order delivered | Seller | Delivery confirmation |
| Order cancelled | Both | Cancellation notice |

Use Supabase Edge Functions or external service (Resend, SendGrid).

---

## 🎯 Acceptance Criteria for Launch

- [ ] Buyer can view all orders
- [ ] Seller can view all sales
- [ ] Status updates work correctly
- [ ] Tracking numbers saved and displayed
- [ ] Order details accurate
- [ ] E2E test passes: `pnpm test:e2e -- orders.spec.ts`
- [ ] Mobile order management works
