# Onboarding Production Readiness Plan

**Date:** 2026-01-26  
**Status:** 🔴 Critical - Current Flow Broken  
**Priority:** P0 - User Experience Blocker

---

## Executive Summary

The current onboarding flow is fragmented, confusing, and **skips critical profile setup steps**. Users who complete signup see a meaningless "intent" question and are immediately marked as onboarding complete without any opportunity to set up their profile. This results in empty profiles, poor user engagement, and a confusing experience.

---

## 1. Current State Audit

### 1.1 Existing Components

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| `SignUpForm` | `app/[locale]/(auth)/_components/sign-up-form.tsx` | Initial registration | ✅ Good |
| `PostSignupOnboardingModal` | `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx` | Post-verification onboarding | ❌ Broken |
| `SellerOnboardingWizard` | `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx` | Seller setup on /sell | ⚠️ Duplicates effort |
| `OnboardingProvider` | `app/[locale]/(main)/_providers/onboarding-provider.tsx` | Modal trigger logic | ✅ Works |
| `onboarding.ts` action | `app/actions/onboarding.ts` | Server action for completion | ⚠️ Over-engineered |

### 1.2 Current Flow (Broken)

```mermaid
graph TD
    A[User visits /auth/sign-up] --> B[Fills registration form]
    B --> C{Account Type}
    C -->|Personal| D[Submit with personal type]
    C -->|Business| E[Submit with business type]
    D --> F[Server creates user + profile]
    E --> F
    F --> G[Email verification sent]
    G --> H[User clicks verification link]
    H --> I[/auth/confirm redirects to /?onboarding=true]
    I --> J[OnboardingProvider triggers modal]
    J --> K[Intent Step: What brings you here?]
    K --> L{User selects intent}
    L -->|Sell| M[handleComplete called IMMEDIATELY]
    L -->|Shop| M
    L -->|Browse| M
    M --> N[Profile marked onboarding_completed=true]
    N --> O[Success screen]
    
    style K fill:#ff6b6b,color:#fff
    style M fill:#ff6b6b,color:#fff
    
    note1[Profile setup steps SKIPPED!]
    K -.-> note1
```

### 1.3 Critical Issues

#### Issue 1: Useless Intent Question ❌
```typescript
// post-signup-onboarding-modal.tsx line 252-262
const handleIntentSelect = (selectedIntent: UserIntent) => {
  setIntent(selectedIntent)
  if (selectedIntent === "sell") {
    // For sellers: just mark onboarding complete and redirect to /sell
    handleComplete(selectedIntent, null)  // ← SKIPS ALL PROFILE STEPS!
  } else {
    // For shop or browse, complete immediately
    handleComplete(selectedIntent, null)  // ← SKIPS ALL PROFILE STEPS!
  }
}
```

**Problem:** The intent step asks "What brings you here?" but regardless of the answer, ALL profile setup steps are skipped. The user never sees:
- Profile customization (display name, bio)
- Avatar selection (custom upload or generated)
- Social links (for personal accounts)
- Business info (for business accounts)

#### Issue 2: Duplicate Profile Setup ❌
- `PostSignupOnboardingModal` has profile setup UI (steps 2-4) that is NEVER shown
- `SellerOnboardingWizard` has DUPLICATE profile setup UI
- Neither flow is connected properly

#### Issue 3: Intent Serves No Purpose ❌
The stored intent (`sell`, `shop`, `browse`) is not used anywhere meaningful:
- It doesn't gate features
- It doesn't customize the experience
- It doesn't affect navigation after onboarding
- It's just stored and forgotten

#### Issue 4: No Profile Creation for Shoppers ❌
Users who want to shop/browse get ZERO profile setup:
- No avatar → Generic placeholder in UI
- No display name → Username shown everywhere
- No bio → Empty profile pages
- Poor engagement and personalization

---

## 2. Database Schema (Current - Relevant Fields)

```sql
-- profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  display_name TEXT,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  location TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  account_type TEXT DEFAULT 'personal', -- 'personal' or 'business'
  is_seller BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'buyer',
  business_name TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  -- ... other fields
);
```

**Note:** All relevant columns exist. The issue is in the frontend flow, not the schema.

---

## 3. Proposed Solution

### 3.1 New Onboarding Flow

```mermaid
graph TD
    A[Sign-up Form] --> B[Email + Password + Name + Username]
    B --> C[Account Type: Personal/Business]
    C --> D[Email Verification]
    D --> E[/auth/confirm → Home with ?onboarding=true]
    
    E --> F[Onboarding Modal Opens]
    
    subgraph "New Streamlined Flow"
        F --> G[Step 1: Profile Setup]
        G --> H{Account Type}
        H -->|Personal| I[Step 2A: Social Links]
        H -->|Business| J[Step 2B: Business Info]
        I --> K[Step 3: Ready!]
        J --> K
    end
    
    K --> L{User Choice}
    L -->|Start Shopping| M[→ Home Page]
    L -->|Start Selling| N[→ /sell Page]
    
    N --> O[Seller Payment Setup]
    O --> P[Stripe Connect Onboarding]
    
    style G fill:#4ade80,color:#000
    style I fill:#4ade80,color:#000
    style J fill:#4ade80,color:#000
    style K fill:#4ade80,color:#000
```

### 3.2 Step-by-Step Breakdown

#### Step 1: Profile Setup (Required)
**Title:** "Set up your profile"  
**Subtitle:** "Help others get to know you"

Fields:
- **Display Name** (prefilled with full_name from signup)
- **Avatar** (options: upload custom OR select generated avatar style)
- **Bio** (optional, max 160 chars) - "Tell us about yourself"

UI Features:
- Boring Avatars integration (4 style variants to choose from)
- Custom upload with preview
- Character counter for bio
- Skip button (but display name should have default)

#### Step 2A: Social Links (Personal Accounts)
**Title:** "Connect your socials"  
**Subtitle:** "Let buyers find you elsewhere (optional)"

Fields (all optional):
- Instagram handle
- TikTok handle  
- YouTube channel
- Twitter/X handle
- Other website URL

UI Features:
- Social media icons
- @ prefix for handles
- "Skip" button prominently displayed

#### Step 2B: Business Information (Business Accounts)
**Title:** "Business details"  
**Subtitle:** "Tell us about your business"

Fields:
- **Business Name** (legal name, required for business)
- **Business Website** (optional)
- **Business Location** (optional)
- **Cover Image** (optional banner for profile)

UI Features:
- Cover image upload with recommended dimensions
- Location autocomplete (or simple text)
- "Skip" for optional fields

#### Step 3: Ready!
**Title:** "You're all set! 🎉"  
**Subtitle:** "Your profile is ready"

Content:
- Success animation (check mark)
- Profile preview card (shows avatar, display name, username)
- Profile URL: `treido.eu/u/{username}`

Actions (TWO BUTTONS):
- **Primary:** "Start Shopping" → Navigate to home
- **Secondary:** "Become a Seller" → Navigate to /sell

**Important:** No intent question. User self-selects by their action.

### 3.3 Seller Payment Setup (Separate Flow)

When user navigates to `/sell`:
1. Check if user has Stripe Connect account
2. If not → Show Stripe Connect onboarding wizard
3. If yes but incomplete → Show "Complete Payout Setup" prompt
4. If complete → Show sell form

This is already implemented in `SellerOnboardingWizard` but needs cleanup.

---

## 4. Implementation Tasks

### Phase 1: Fix Post-Signup Modal (P0 - Day 1)

| Task | Priority | Effort | File |
|------|----------|--------|------|
| Remove "Intent" step entirely | P0 | 30min | `post-signup-onboarding-modal.tsx` |
| Make Step 1 (Profile) the first & default step | P0 | 1hr | `post-signup-onboarding-modal.tsx` |
| Fix flow: Profile → Social/Business → Ready | P0 | 2hr | `post-signup-onboarding-modal.tsx` |
| Add "Start Shopping" / "Start Selling" to final step | P0 | 30min | `post-signup-onboarding-modal.tsx` |
| Update server action to remove intent handling | P1 | 30min | `onboarding.ts` |

### Phase 2: Polish UX (P1 - Day 2)

| Task | Priority | Effort | File |
|------|----------|--------|------|
| Add progress indicators (Step 1/3, 2/3, 3/3) | P1 | 30min | Modal |
| Improve avatar selection UI | P1 | 1hr | Modal |
| Add skeleton loading states | P2 | 30min | Modal |
| Ensure mobile responsiveness | P1 | 1hr | Modal |
| Add i18n translations for new copy | P1 | 1hr | `messages/*.json` |

### Phase 3: Cleanup (P2 - Day 3)

| Task | Priority | Effort | File |
|------|----------|--------|------|
| Remove duplicate profile setup from SellerOnboardingWizard | P2 | 1hr | `seller-onboarding-wizard.tsx` |
| Simplify SellerOnboardingWizard to payment-only | P2 | 2hr | `seller-onboarding-wizard.tsx` |
| Remove unused `intent` field from schema if not needed | P3 | 30min | migrations |
| Add E2E tests for new flow | P1 | 2hr | `e2e/onboarding.spec.ts` |

### Phase 4: Analytics & Monitoring (P2 - Week 2)

| Task | Priority | Effort |
|------|----------|--------|
| Add onboarding completion funnel tracking | P2 | 2hr |
| Track drop-off at each step | P2 | 1hr |
| Monitor time-to-complete metrics | P3 | 1hr |

---

## 5. Acceptance Criteria

### Must Have (MVP)
- [ ] After email verification, user sees profile setup modal
- [ ] User can set display name (with default from full_name)
- [ ] User can select or upload avatar
- [ ] User can optionally add bio
- [ ] Personal users can add social links (optional step)
- [ ] Business users can add business info (optional step)
- [ ] Final step shows "Start Shopping" and "Become a Seller" buttons
- [ ] Modal cannot be dismissed without completing (or explicit skip all)
- [ ] Profile is saved to database correctly
- [ ] `onboarding_completed` set to true after final step

### Should Have
- [ ] Progress indicator (Step 1/3, etc.)
- [ ] Avatar preview before save
- [ ] Bio character counter
- [ ] Animated transitions between steps
- [ ] Mobile-optimized layout

### Nice to Have
- [ ] Profile preview card in final step
- [ ] Social media validation (format checks)
- [ ] Cover image cropping for business accounts
- [ ] Onboarding completion analytics

---

## 6. Technical Specifications

### 6.1 Updated Modal State Flow

```typescript
type OnboardingStep = "profile" | "social" | "business" | "complete"

// Flow determination
function getNextStep(currentStep: OnboardingStep, accountType: "personal" | "business"): OnboardingStep {
  switch (currentStep) {
    case "profile":
      return accountType === "personal" ? "social" : "business"
    case "social":
    case "business":
      return "complete"
    case "complete":
      return "complete"
  }
}
```

### 6.2 Server Action Updates

```typescript
// Simplified data - no more intent field
interface OnboardingData {
  userId: string
  displayName: string | null
  bio: string | null
  avatarType: "custom" | "generated"
  avatarVariant?: string
  avatarPalette?: number
  // Personal accounts
  socialLinks?: Record<string, string>
  // Business accounts
  businessName?: string
  website?: string
  location?: string
  // Files
  avatarFile?: File
  coverFile?: File
}
```

### 6.3 Database Updates Required

None! The schema already supports all fields. Just need to populate them properly.

---

## 7. Design References

### 7.1 Inspiration Sources
- **Facebook Profile Setup** - Progressive disclosure, optional fields clearly marked
- **Etsy Seller Onboarding** - Shop name, bio, avatar in sequence
- **LinkedIn Profile Completion** - Progress bar, "complete your profile" nudges
- **Depop** - Avatar-first, personality-driven profile setup

### 7.2 UI Components Available
- `Dialog` / `DialogContent` from shadcn/ui
- `Input`, `Textarea`, `Button` from shadcn/ui
- `Avatar` from `boring-avatars` package
- Phosphor Icons for step icons
- Framer Motion for animations (already implemented)

---

## 8. Testing Plan

### 8.1 Manual Testing Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| New personal account signs up | Profile → Social Links → Ready |
| New business account signs up | Profile → Business Info → Ready |
| User skips social links | Still proceeds to Ready step |
| User uploads custom avatar | Avatar saved to storage, URL in profile |
| User selects generated avatar | Avatar variant/palette saved in profile |
| User clicks "Start Selling" | Redirects to /sell page |
| User clicks "Start Shopping" | Redirects to home page |
| User refreshes during onboarding | Modal reopens at correct step |
| Mobile user completes flow | All steps responsive, no overflow |

### 8.2 E2E Test Cases

```typescript
// e2e/onboarding.spec.ts
describe('Onboarding Flow', () => {
  test('personal account completes full onboarding', async () => {
    // Sign up → Verify email → Complete profile → Add socials → Start shopping
  })
  
  test('business account completes full onboarding', async () => {
    // Sign up → Verify email → Complete profile → Add business info → Start selling
  })
  
  test('user can skip optional steps', async () => {
    // Sign up → Verify email → Complete profile → Skip socials → Start shopping
  })
  
  test('onboarding cannot be bypassed', async () => {
    // New user navigates to protected route → Redirected back to onboarding
  })
})
```

---

## 9. Migration Notes

### For Existing Users

Users with `onboarding_completed = false` will see the new flow when they next log in:
- If they have no display_name → Show full profile setup
- If they have display_name but no avatar → Start at avatar step
- If they have everything → Just mark as complete

### Backward Compatibility

- No breaking changes to API
- No database migrations required
- Existing profiles remain intact
- New users get improved flow immediately

---

## 10. Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Onboarding completion rate | Unknown | 85%+ | Week 1 |
| Profile completion (with avatar) | ~5% | 50%+ | Week 2 |
| Time to complete onboarding | N/A | < 2 min | Week 1 |
| User drop-off at each step | Unknown | < 15% | Week 2 |
| Seller conversion (onboarding → /sell) | Unknown | Track baseline | Week 1 |

---

## 11. Timeline

| Phase | Tasks | Duration | Owner |
|-------|-------|----------|-------|
| Phase 1 | Fix core flow | 1 day | Dev |
| Phase 2 | UX polish | 1 day | Dev |
| Phase 3 | Cleanup & tests | 1 day | Dev |
| Phase 4 | Analytics | 1 day | Dev |
| **Total** | | **4 days** | |

---

## 12. Appendix

### A. Files to Modify

Primary:
- `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx`
- `app/actions/onboarding.ts`
- `messages/en.json` (add/update translations)
- `messages/bg.json` (add/update translations)

Secondary:
- `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx`
- `app/[locale]/(main)/_providers/onboarding-provider.tsx`

### B. Current Code Issues (Line References)

**post-signup-onboarding-modal.tsx:**
- Line 252-262: `handleIntentSelect()` skips all profile steps
- Line 300-350: Intent step UI that should be removed
- Line 352-450: Profile step UI that is never shown
- Line 452-520: Social links step UI that is never shown
- Line 522-620: Business info step UI that is never shown

### C. Related Documentation
- [TREIDO_AUDIT_2026-01-24.md](docs-final/archive/root/TREIDO_AUDIT_2026-01-24.md) - Previous audit
- [FEATURES.md](FEATURES.md) - Feature checklist
- [REQUIREMENTS.md](REQUIREMENTS.md) - Original requirements

---

**Document Owner:** AI Assistant  
**Last Updated:** 2026-01-26  
**Review Status:** Ready for Implementation
