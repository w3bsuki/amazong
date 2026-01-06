# 👋 Onboarding

> **Status**: 🟡 70% Complete
> **Priority**: P1

---

## ✅ Working Features

- [x] Welcome wizard for new users (avatar, display name, bio)
- [x] Account type selection at signup (personal/business)
- [x] Seller onboarding wizard for first-time sellers
- [x] Redirect to appropriate dashboard based on account type

---

## 🔴 Issues to Fix

### P0 - Launch Blockers
_None - basic flows work_

### P1 - High Priority
- [ ] **`is_business_seller` not set correctly** - Onboarding sets `seller_type` but NOT `is_business_seller` flag
- [ ] **Business vs Personal paths not distinct** - Both go through same wizard
- [ ] **Account type upgrade/downgrade** - Not implemented
- [ ] **Skip onboarding option** - Users should be able to skip and complete later

### P2 - Nice to Have
- [ ] Guided tour for dashboard features
- [ ] Progress indicator showing setup completion
- [ ] Welcome email with getting started guide

---

## 🧪 Test Cases

### Manual QA
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 1 | New personal user signup | Welcome wizard → set profile → account | ⬜ |
| 2 | New business user signup | Welcome wizard → business setup → dashboard | ⬜ |
| 3 | Personal user starts selling | Seller wizard → can list products | ⬜ |
| 4 | Business user starts selling | Seller wizard → can list products | ⬜ |
| 5 | Skip onboarding | Can access platform, prompted to complete later | ⬜ |
| 6 | Incomplete onboarding return | Resume where left off | ⬜ |

---

## 📁 Key Files

```
app/[locale]/(auth)/_components/
├── welcome-client.tsx           # Identity onboarding (avatar, name, bio)
└── signup-form.tsx              # Account type selection

app/[locale]/(sell)/_components/
└── seller-onboarding-wizard.tsx # Seller activation flow

cleanup/
└── onboarding-refactor-plan.md  # Detailed refactor plan (READ THIS!)
```

---

## 📝 Known Issues from Refactor Plan

From [cleanup/onboarding-refactor-plan.md](../../cleanup/onboarding-refactor-plan.md):

1. ~~**Flag Inconsistency**: `seller_type` is set but not business flag~~ ✅ FIXED - Code correctly sets `account_type` and business gating uses `account_type === 'business'`
2. **No Separate Paths**: Personal sellers and business sellers see identical onboarding
3. **Missing Business Dashboard Onboarding**: Business accounts should get dashboard-specific setup
4. **Upgrade Path**: No way to upgrade personal → business account

### ✅ Actual Implementation (Verified 2025-12-30)
```typescript
// In completeSellerOnboarding() - app/[locale]/(sell)/_actions/sell.ts
await supabase.from('profiles').update({
  account_type: accountType,  // 'personal' or 'business'
  is_seller: true,
  role: 'seller',
  display_name: displayName,
  bio: bio,
  business_name: accountType === 'business' ? businessName : null,
})
```

---

## 🎯 Acceptance Criteria for Launch

- [ ] Personal signup → Personal onboarding → `/account`
- [ ] Business signup → Business onboarding → `/dashboard`
- [x] `account_type` correctly set for business accounts ✅
- [ ] Seller onboarding completes without errors
- [ ] Mobile-friendly wizard UI
- [ ] Can skip and return to onboarding later
