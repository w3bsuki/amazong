# 👤 Account Management

> **Status**: 🟡 85% Complete
> **Priority**: P1

---

## ✅ Working Features

### Personal Account (`/account`)
- [x] Dashboard with stats overview
- [x] Profile management (avatar, name, bio)
- [x] Order history
- [x] Sales history (if seller)
- [x] Wishlist
- [x] Following sellers
- [x] Address management
- [x] Payment methods (Stripe)
- [x] Security settings (password change)
- [x] Subscription plans
- [x] Settings (notifications, preferences)

### Business Dashboard (`/dashboard`)
- [x] Dashboard access gated by subscription tier
- [x] Products management
- [x] Orders management
- [x] Analytics (placeholder)
- [x] Customers list
- [x] Discount codes
- [x] Inventory management
- [x] Marketing tools

---

## 🔴 Issues to Fix

### P0 - Launch Blockers
_None - core functionality works_

### P1 - High Priority
- [ ] **Dashboard analytics** - Currently placeholder, needs real data
- [ ] **Shipping settings** - Not implemented for business accounts
- [ ] **Payout settings** - No way for sellers to set payout method
- [ ] **Account deletion** - Should be implemented for GDPR

### P2 - Nice to Have
- [ ] Export account data (GDPR)
- [ ] Two-factor authentication
- [ ] Login activity log
- [ ] API access keys for businesses

---

## 🧪 Test Cases

### Manual QA - Personal Account
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 1 | View account dashboard | Stats, recent activity shown | ⬜ |
| 2 | Update profile info | Changes saved, reflected everywhere | ⬜ |
| 3 | Change password | Old password required, new password works | ⬜ |
| 4 | Add shipping address | Address saved, available at checkout | ⬜ |
| 5 | View order history | All past orders listed | ⬜ |
| 6 | Manage wishlist | Can view, remove items | ⬜ |
| 7 | Change notification settings | Preferences saved | ⬜ |

### Manual QA - Business Dashboard
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 8 | Access dashboard (business user) | Full dashboard access | ⬜ |
| 9 | Access dashboard (personal user) | Upgrade prompt or limited access | ⬜ |
| 10 | View products list | All products with actions | ⬜ |
| 11 | View sales analytics | Charts/data displayed | ⬜ |
| 12 | Manage discount codes | Can create, edit, delete | ⬜ |
| 13 | View customer list | Customers who purchased shown | ⬜ |

---

## 📁 Key Files

```
# Personal Account
app/[locale]/(account)/account/
├── page.tsx                       # Dashboard
├── profile/page.tsx               # Edit profile
├── orders/                        # Order history
├── sales/                         # Sales history
├── wishlist/page.tsx              # Wishlist
├── following/page.tsx             # Following sellers
├── addresses/page.tsx             # Shipping addresses
├── payments/page.tsx              # Payment methods
├── security/page.tsx              # Password, security
├── billing/page.tsx               # Subscription billing
├── plans/page.tsx                 # Upgrade plans
├── selling/page.tsx               # Seller settings
└── settings/page.tsx              # Preferences

# Business Dashboard
app/[locale]/(business)/dashboard/
├── page.tsx                       # Business overview
├── products/                      # Product management
├── orders/                        # Order management
├── analytics/page.tsx             # Analytics (TODO)
├── customers/page.tsx             # Customer list
├── discounts/page.tsx             # Discount codes
├── inventory/page.tsx             # Stock management
├── marketing/page.tsx             # Marketing tools
├── accounting/page.tsx            # Financial reports
└── settings/page.tsx              # Business settings

# Access Control
components/business/
└── require-business-subscription.tsx  # Gate component (1068 lines)
```

---

## 📝 Personal vs Business Routes

| Route | Personal User | Business User |
|-------|---------------|---------------|
| `/account` | ✅ Full access | ✅ Full access |
| `/account/orders` | ✅ | ✅ |
| `/account/sales` | ✅ (if seller) | ✅ |
| `/dashboard` | 🚫 Upgrade prompt | ✅ Full access |
| `/dashboard/analytics` | 🚫 | ✅ |
| `/dashboard/customers` | 🚫 | ✅ |

---

## 📝 Missing Business Features

From `require-business-subscription.tsx`:

```typescript
// TODO: Add when reviews table is set up
// - Reviews management
// - Rating responses

// TODO: Add shipping settings
// - Shipping methods
// - Shipping zones
// - Carrier integration

// TODO: Add payout settings
// - Bank account
// - Payout schedule
// - Payout history
```

These are documented in the component but not yet implemented.

---

## 📝 Account Deletion (GDPR)

Need to implement:

1. **Soft delete first** - Mark account as `deleted`, anonymize data
2. **Grace period** - 30 days to recover
3. **Hard delete** - Remove all personal data after grace period
4. **Data export** - Allow user to download their data before deletion

---

## 🎯 Acceptance Criteria for Launch

### Personal Account
- [ ] All sections accessible and functional
- [ ] Profile updates save correctly
- [ ] Password change works
- [ ] Addresses can be added/edited/deleted
- [ ] Order/sales history accurate

### Business Dashboard
- [ ] Access properly gated by subscription
- [ ] Products management works
- [ ] Orders management works
- [ ] Basic analytics displayed (even if limited)
- [ ] Settings save correctly

### Both
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Navigation intuitive
