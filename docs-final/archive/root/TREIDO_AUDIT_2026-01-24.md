# Treido.eu Comprehensive Audit Report
**Date:** 2026-01-24  
**URL:** https://www.treido.eu  
**Method:** Playwright MCP + Supabase MCP

---

## Executive Summary

This audit covers route testing, authentication flow analysis, onboarding flow verification, and database schema review for the Treido marketplace platform.

### Key Findings

| Category | Status | Issues Found |
|----------|--------|--------------|
| Homepage | ✅ Working | None |
| Search | ✅ Working | None |
| Product Pages | ✅ Working | None |
| Auth Routes | ⚠️ Partial Issues | 2 bugs found |
| Onboarding | ✅ Code Review OK | Flow is correct |
| Database | ✅ Schema OK | 29 users, RLS enabled |

---

## 1. Route Testing Results

### 1.1 Homepage (`/en`)
- **Status:** ✅ Working
- **Page Title:** "Home | Treido"
- **Content Verified:**
  - Hero section with promotional banner
  - Category navigation (Electronics, Fashion, Home, Beauty, Sports)
  - Trending products section
  - Featured sellers section
  - Recently viewed section
  - Newsletter signup form
  - Language switcher (EN/BG)

### 1.2 Search Page (`/en/search?q=phone`)
- **Status:** ✅ Working
- **Page Title:** "Results for "phone" | Search | Treido"
- **Results:** 9 products found
- **Features Verified:**
  - Filter sidebar (categories, price range, brands)
  - Sort dropdown
  - Product grid with cards
  - Pagination

### 1.3 Product Detail Page (`/en/tech_haven/google-pixel-8-pro`)
- **Status:** ✅ Working
- **Page Title:** "Google Pixel 8 Pro | Treido"
- **Content Verified:**
  - Product image gallery
  - Price display (Calculated €1,999.99)
  - Add to cart button
  - Seller info (tech_haven)
  - Product specifications
  - Related products section

### 1.4 Auth Routes

| Route | Status | Notes |
|-------|--------|-------|
| `/en/auth/login` | ✅ Working | Email/password form, social login buttons |
| `/en/auth/sign-up` | ✅ Working | Full registration form |
| `/en/auth/forgot-password` | ✅ Working | Password reset form |
| `/en/auth/sign-up-success` | ✅ Working | Confirmation page |
| `/en/auth/welcome` | ✅ Working | 4-step onboarding wizard |
| `/en/sign-in` | ❌ 404 Error | Wrong route - should be `/en/auth/login` |

### 1.5 Other Routes Verified

| Route | Status | Notes |
|-------|--------|-------|
| `/en/cart` | ✅ Working | Empty cart state |
| `/en/categories` | ✅ Working | Category grid |
| `/en/account` | ⚠️ Redirect | Redirects to login when unauthenticated |
| `/en/sell` | ⚠️ Redirect | Redirects to login when unauthenticated |

---

## 2. Bugs Found

### 2.1 BUG: Double Locale in Welcome Page Redirect

**Location:** `app/[locale]/(auth)/_components/welcome-client.tsx`  
**Line:** ~85  
**Severity:** 🔴 High

**Current Code (Broken):**
```typescript
router.push(`/${locale}/auth/login`)
```

**Problem:** When the locale is already in the URL path (e.g., `/en/auth/welcome`), this creates a double-locale URL like `/en/en/auth/login`.

**Fix:**
```typescript
router.push(`/auth/login`)
// OR use Link from next-intl:
import { Link } from '@/i18n/routing'
```

### 2.2 BUG: Incorrect Sign-In Route in Some Places

**Location:** Various places may link to `/sign-in` instead of `/auth/login`  
**Severity:** 🟡 Medium

**Observed:** Navigating to `/en/sign-in` shows "Profile Not Found" 404 error.

**Expected:** Should redirect to `/en/auth/login` or the route should exist.

---

## 3. Authentication Flow Analysis

### 3.1 Sign-Up Flow

```mermaid
graph TD
    A[User visits /auth/sign-up] --> B[Fills registration form]
    B --> C{Account Type}
    C -->|Personal| D[Submit with personal fields]
    C -->|Business| E[Submit with business fields]
    D --> F[Server action: signUp()]
    E --> F
    F --> G[Supabase Auth creates user]
    G --> H[Email verification sent]
    H --> I[Redirect to /auth/sign-up-success]
    I --> J[User clicks email link]
    J --> K[/auth/confirm handler]
    K --> L{onboarding_completed?}
    L -->|false| M[Redirect to /?onboarding=true]
    L -->|true| N[Redirect to /account]
    M --> O[OnboardingProvider triggers modal]
```

### 3.2 Sign-Up Form Fields

| Field | Required | Validation |
|-------|----------|------------|
| Account Type | Yes | "personal" or "business" |
| Name | Yes | Min 2 chars |
| Username | Yes | Min 3 chars, unique, alphanumeric |
| Email | Yes | Valid email format |
| Password | Yes | Min 8 chars, uppercase, lowercase, number |
| Confirm Password | Yes | Must match password |

### 3.3 Email Verification

- **Method:** Supabase PKCE flow with token_hash
- **Redirect URL:** `/auth/confirm?token_hash=...&type=email`
- **Post-verification:** Checks `onboarding_completed` flag

---

## 4. Onboarding Flow Analysis

### 4.1 Onboarding Trigger Points

1. **After email verification:** `/auth/confirm` checks `onboarding_completed` flag
2. **URL parameter:** `?onboarding=true` query param
3. **Profile check:** `OnboardingProvider` checks if `onboarding_completed === false`

### 4.2 Post-Signup Onboarding Modal

**Location:** `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx`

**Steps:**
1. **Welcome** - Personalized welcome message
2. **Avatar** - Upload profile picture
3. **Profile** - Complete profile details
4. **Complete** - Confirmation and success state

### 4.3 Welcome Wizard (Standalone Page)

**Location:** `app/[locale]/(auth)/_components/welcome-client.tsx`

**Steps:**
1. **Welcome** - Account type selection
2. **Avatar** - Profile picture upload
3. **Profile** - Name and username setup
4. **Complete** - Success confirmation

### 4.4 Onboarding Completion

**Server Action:** `completePostSignupOnboarding()` in `app/actions/onboarding.ts`

**Database Update:**
```sql
UPDATE profiles 
SET onboarding_completed = true 
WHERE id = $user_id
```

---

## 5. Database Schema Review

### 5.1 Key Tables

| Table | Row Count | RLS | Notes |
|-------|-----------|-----|-------|
| `auth.users` | 29 | N/A | Supabase Auth managed |
| `public.profiles` | 29 | ✅ | User profiles |
| `public.products` | 16 | ✅ | Marketplace listings |
| `public.orders` | 12 | ✅ | Purchase orders |
| `public.stores` | 3 | ✅ | Seller stores |
| `public.categories` | 15 | ✅ | Product categories |

### 5.2 Profile Schema

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  account_type TEXT DEFAULT 'personal', -- 'personal' | 'business'
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 5.3 Users Without Completed Onboarding

Found 5+ users with `onboarding_completed = false`:
- auditbuyer02 (unverified email)
- e2eTestUser (verified)
- tech_haven (seller, verified)
- test_seller_store (verified)
- test_store_2025 (verified)

---

## 6. Performance Observations

### 6.1 Console Warnings

| Warning | Severity | Notes |
|---------|----------|-------|
| React Error #419 | ⚠️ Low | Suspense boundary SSR fallback - works via client rendering |
| CSS preload warning | ⚠️ Low | Preloaded CSS not used within timeout |

### 6.2 Page Load Times

| Page | Approximate Load Time |
|------|----------------------|
| Homepage | ~1.5s |
| Search | ~1.2s |
| Product | ~1.0s |
| Auth pages | ~0.8s |

---

## 7. Recommendations

### 7.1 Critical Fixes

1. **Fix double-locale bug in welcome-client.tsx**
   - Change `router.push(\`/${locale}/auth/login\`)` to `router.push('/auth/login')`
   - Use next-intl Link component for consistent i18n routing

2. **Add redirect for `/sign-in` route**
   - Either create a redirect rule or add proper route
   - Update any links pointing to wrong route

### 7.2 Improvements

1. **Form Validation UX**
   - Add real-time validation feedback
   - Show password strength indicator
   - Debounce username availability check

2. **Onboarding Flow**
   - Add progress persistence (save partial completion)
   - Allow skipping non-essential steps
   - Add "Continue later" option

3. **Error Handling**
   - Add user-friendly error messages for auth failures
   - Add retry logic for network errors
   - Improve 404 page messaging

### 7.3 Testing Recommendations

1. **E2E Tests to Add:**
   - Full sign-up → email verification → onboarding flow
   - Sign-in with email/password
   - Sign-in with OAuth providers
   - Password reset flow
   - Account type switching during onboarding

2. **Unit Tests to Add:**
   - Username validation rules
   - Password strength validation
   - Email format validation

---

## 8. Onboarding Flow Summary

### Current State: ✅ Working as Designed

The onboarding flow works correctly:

1. **After Sign-Up:** User is redirected to `/auth/sign-up-success` page
2. **After Email Verification:** `/auth/confirm` handler:
   - Verifies email with Supabase
   - Checks `onboarding_completed` flag in profiles table
   - If `false`: Redirects to `/?onboarding=true`
   - If `true`: Redirects to `/account`
3. **OnboardingProvider:** Mounted in main layout, detects:
   - `?onboarding=true` query param
   - User is authenticated
   - Profile has `onboarding_completed = false`
   - Opens `PostSignupOnboardingModal` automatically
4. **After Completion:** Server action updates `onboarding_completed = true`

### Flow Diagram

```
Sign Up → Email Sent → Click Link → Email Verified → Check Onboarding Status
                                                            ↓
                                    ┌───────────────────────┴───────────────────────┐
                                    ↓                                               ↓
                         onboarding_completed=false                    onboarding_completed=true
                                    ↓                                               ↓
                         Redirect: /?onboarding=true                    Redirect: /account
                                    ↓
                         OnboardingProvider shows modal
                                    ↓
                         User completes 4 steps
                                    ↓
                         Mark onboarding complete
                                    ↓
                         Close modal, user can browse
```

---

## Appendix A: Tested Routes Matrix

| Route | Method | Auth Required | Status |
|-------|--------|---------------|--------|
| `/` | GET | No | ✅ |
| `/en` | GET | No | ✅ |
| `/bg` | GET | No | ✅ |
| `/en/search` | GET | No | ✅ |
| `/en/categories` | GET | No | ✅ |
| `/en/cart` | GET | No | ✅ |
| `/en/auth/login` | GET | No | ✅ |
| `/en/auth/sign-up` | GET | No | ✅ |
| `/en/auth/forgot-password` | GET | No | ✅ |
| `/en/auth/sign-up-success` | GET | No | ✅ |
| `/en/auth/welcome` | GET | Yes | ✅ |
| `/en/account` | GET | Yes | ✅ (redirects) |
| `/en/sell` | GET | Yes | ✅ (redirects) |
| `/en/sign-in` | GET | No | ❌ 404 |
| `/en/[seller]/[product]` | GET | No | ✅ |
| `/auth/confirm` | GET | No | ✅ (handler) |

---

## Appendix B: Database Tables (Full List)

```
public.accounts
public.boosts
public.brands
public.categories
public.chat_messages
public.conversations
public.escrow_accounts
public.escrow_transactions
public.notifications
public.order_items
public.orders
public.payments
public.product_boosts
public.product_categories
public.product_images
public.products
public.profiles
public.reviews
public.saved_products
public.seller_applications
public.settings
public.shipping_options
public.stores
public.subscriptions
public.support_tickets
public.users
```

---

**Audit Completed:** 2026-01-24 01:05 UTC  
**Auditor:** GitHub Copilot via Playwright MCP + Supabase MCP
