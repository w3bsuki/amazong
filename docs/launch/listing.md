# 📦 Listing & Selling

> **Status**: 🟢 90% Complete
> **Priority**: P0

---

## ✅ Working Features

- [x] Full product CRUD (create, read, update, delete)
- [x] Multi-step listing form with validation
- [x] Image upload with compression
- [x] Category assignment with attributes
- [x] SKU, barcode, weight, condition tracking
- [x] **Listing limits enforced at DB level**:
  - Free personal: 10 listings/month
  - Free business: 15 listings/month
  - Paid tiers: configurable limits
- [x] Product visibility controls (active/draft/sold)
- [x] Price and quantity management

---

## 🔴 Issues to Fix

### P0 - Launch Blockers
- [ ] **Verify free tier limits work** - Test hitting the limit and showing proper error

### P1 - High Priority
- [ ] **Image upload error handling** - Ensure clear feedback on failure
- [ ] **Draft saving** - Auto-save progress during listing creation
- [ ] **Edit listing UX** - Verify all fields editable after publish

### P2 - Nice to Have
- [ ] Bulk listing import (CSV/Excel)
- [ ] Listing templates for repeat sellers
- [ ] Duplicate listing feature
- [ ] Scheduled publishing

---

## 🧪 Test Cases

### Manual QA
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 1 | Create listing (free user) | Product created, appears in account | ⬜ |
| 2 | Hit free tier limit | Clear error message, upgrade prompt | ⬜ |
| 3 | Upload multiple images | All images saved, can reorder | ⬜ |
| 4 | Set category with attributes | Attribute fields appear, save correctly | ⬜ |
| 5 | Edit existing listing | All fields load, changes save | ⬜ |
| 6 | Delete listing | Soft delete, removed from search | ⬜ |
| 7 | Mark as sold manually | Status updates, removed from listings | ⬜ |
| 8 | Create listing on mobile | Full flow works on small screen | ⬜ |

### Automated (E2E)
- [e2e/seller-create-listing.spec.ts](../../e2e/seller-create-listing.spec.ts)

---

## 📁 Key Files

```
app/actions/
└── products.ts                    # CRUD operations

app/[locale]/(sell)/_components/
└── sell-form-unified.tsx          # Main listing form

lib/
├── listing-limits.ts              # Tier limits logic
├── image-compression.ts           # Image processing
└── category-attribute-config.ts   # Category-specific fields

types/
└── product.ts                     # Product type definitions
```

---

## 📝 Listing Limits Configuration

From `lib/listing-limits.ts`:

| Tier | Monthly Limit | Features |
|------|---------------|----------|
| Free Personal | 10 | Basic listing |
| Free Business | 15 | Basic listing |
| Starter | 50 | + Analytics |
| Pro | 200 | + Priority support |
| Enterprise | Unlimited | + Custom features |

### Limit Enforcement
- Checked at creation time via `canCreateListing()` function
- DB trigger as backup for race conditions
- Clear error message when limit reached with upgrade CTA

---

## 🎯 Acceptance Criteria for Launch

- [ ] Create listing end-to-end works
- [ ] Free tier limits enforced with clear messaging
- [ ] Images upload and display correctly
- [ ] Edit/delete works
- [ ] Category attributes save properly
- [ ] E2E test passes: `pnpm test:e2e -- seller-create-listing.spec.ts`
- [ ] Mobile listing creation works
