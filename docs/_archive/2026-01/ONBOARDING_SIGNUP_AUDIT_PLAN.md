# 🔍 Onboarding & Signup Account Type Audit

> **Status**: � READY TO IMPLEMENT (Supabase ✅ Frontend needs cleanup)
> **Date**: January 3, 2026
> **Priority**: P0 - Launch Blocker

---

## 📋 Executive Summary

### ✅ GOOD NEWS: Supabase Backend is ALREADY CORRECT!

The database trigger `handle_new_user()` **already copies** `account_type_intent` from auth metadata to `profiles.account_type`. The backend is ready.

**The ONLY problem is frontend over-engineering** - multiple places asking for account type again.

### Current Supabase State (Verified)

```sql
-- handle_new_user() ALREADY does this:
account_type_val := COALESCE(
  NEW.raw_user_meta_data->>'account_type_intent',
  'personal'
);

INSERT INTO profiles (..., account_type)
VALUES (..., account_type_val);
```

### Key Problems (Frontend Only)

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | **PostSignupOnboardingModal asks for account type AGAIN** | 🔴 Critical | Open |
| 2 | **SellerOnboardingWizard asks for account type AGAIN** | 🔴 Critical | Open |
| 3 | **Three separate onboarding flows** competing | 🟡 High | Open |
| 4 | **Account upgrade UX exists but hidden** | 🟡 Medium | Partial |

### Database State (24 users)

| account_type | is_seller | onboarding_completed | count |
|--------------|-----------|---------------------|-------|
| personal | false | false | 12 |
| personal | true | false | 9 |
| personal | true | true | 2 |
| business | true | false | 1 |

---

## � THE SIMPLE FINAL PLAN

### One Logic Path - No Over-Engineering

```
┌────────────────────────────────────────────────────────────────────┐
│  SIGNUP (sign-up-form.tsx)                                         │
│  ├── Name, Username, Email, Password                               │
│  ├── Account Type: [Personal] / [Business]  ← ONLY HERE!          │
│  └── Submit → Supabase creates profile with account_type           │
├────────────────────────────────────────────────────────────────────┤
│  EMAIL VERIFICATION → User clicks link                             │
├────────────────────────────────────────────────────────────────────┤
│  ONBOARDING MODAL (PostSignupOnboardingModal)                      │
│  ├── READ account_type from profile (DON'T ASK AGAIN!)            │
│  ├── Step 1: "What brings you here?" (sell/shop/browse)           │
│  ├── Step 2: Profile setup (avatar, display name, bio)            │
│  │   └── If business → also ask business_name                     │
│  ├── Step 3: Social links (personal) OR Business details (bus.)   │
│  └── Complete → SET onboarding_completed = true                    │
├────────────────────────────────────────────────────────────────────┤
│  IF USER WANTS TO SELL (clicks "I want to sell")                   │
│  ├── Set is_seller = true, role = 'seller'                        │
│  ├── NO ADDITIONAL ACCOUNT TYPE QUESTION!                          │
│  └── Go to /sell to create first listing                          │
├────────────────────────────────────────────────────────────────────┤
│  LATER: UPGRADE/DOWNGRADE (from /account/settings)                 │
│  └── Use existing upgradeToBusinessAccount/downgradeToPersonal     │
└────────────────────────────────────────────────────────────────────┘
```

### Files to Change (Frontend Only)

| File | Change | Time |
|------|--------|------|
| `onboarding-provider.tsx` | Fetch `account_type` from profile, pass to modal | 5 min |
| `post-signup-onboarding-modal.tsx` | Remove "account-type" step, use passed value | 10 min |
| `seller-onboarding-wizard.tsx` | Remove step 1 (account type), start at step 2 | 5 min |
| `welcome-client.tsx` | Consider removing entirely (duplicate of modal) | 5 min |

**Total: ~25 minutes of frontend changes. Zero database changes needed.**

---

## 🗄️ Supabase Backend Status: ✅ COMPLETE

### Profile Trigger (Already Correct)

```sql
-- The trigger already does this:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $function$
DECLARE
  account_type_val TEXT;
  final_username TEXT;
BEGIN
  account_type_val := COALESCE(
    NEW.raw_user_meta_data->>'account_type_intent',  -- ← FROM SIGNUP FORM
    'personal'
  );
  -- ... 
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, username, account_type)
  VALUES (NEW.id, NEW.email, full_name_val, avatar_url_val, 'buyer', final_username, account_type_val);
  -- ✅ account_type IS ALREADY SET FROM SIGNUP!
END;
$function$;
```

### Profile Table Schema

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `account_type` | text | `'personal'` | `'personal'` or `'business'` - **SET AT SIGNUP** |
| `is_seller` | boolean | `false` | Set when user creates first listing |
| `onboarding_completed` | boolean | `false` | Tracks if onboarding wizard finished |
| `business_name` | text | null | Only for business accounts |

**NO DATABASE CHANGES NEEDED!**

---

## � Implementation: Exact Code Changes

### Step 1: Update OnboardingProvider (5 min)

**File**: `components/providers/onboarding-provider.tsx`

```diff
// Line ~69 - Add account_type to the query
const { data: rawProfile } = await supabase
  .from("profiles")
- .select("username, display_name, onboarding_completed")
+ .select("username, display_name, onboarding_completed, account_type")
  .eq("id", user.id)
  .single()

// Line ~120 - Pass account_type to modal
<PostSignupOnboardingModal
  isOpen={isOnboardingOpen}
  onOpenChange={(open) => !open && setIsOnboardingOpen(false)}
  userId={user.id}
  username={profile.username ?? ""}
  displayName={profile.display_name ?? ""}
+ accountType={profile.account_type ?? "personal"}
/>
```

---

### Step 2: Simplify PostSignupOnboardingModal (10 min)

**File**: `components/auth/post-signup-onboarding-modal.tsx`

```diff
// Add prop to interface
interface PostSignupOnboardingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  username: string
  displayName?: string
+ accountType: "personal" | "business"  // FROM SIGNUP - DON'T ASK AGAIN!
}

// Remove the "account-type" step entirely
- const [step, setStep] = useState<Step>("intent")
+ const [step, setStep] = useState<Step>("intent")  // Remove "account-type" from Step type

- type Step = "intent" | "account-type" | "profile" | "extras" | "complete"
+ type Step = "intent" | "profile" | "extras" | "complete"

// Use the passed accountType prop directly
- const [accountType, setAccountType] = useState<"personal" | "business" | null>(null)
+ // Remove this state - use the prop instead!

// In handleIntentSelect - skip the account-type step
const handleIntentSelect = (selectedIntent: UserIntent) => {
  setIntent(selectedIntent)
  if (selectedIntent === "sell") {
-   setStep("account-type")  // DELETE THIS
+   setStep("profile")       // Go directly to profile setup
  } else {
    handleComplete(selectedIntent, null)
  }
}

// Delete the entire renderAccountTypeStep function (lines ~170-230)
- const renderAccountTypeStep = () => { ... }

// In the switch statement, remove the account-type case
- case "account-type":
-   return renderAccountTypeStep()
```

---

### Step 3: Simplify SellerOnboardingWizard (5 min)

**File**: `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx`

```diff
// The initialAccountType prop already exists - make it required and use it
interface SellerOnboardingWizardProps {
  userId: string
  username: string
  displayName: string
  initialBusinessName?: string
- initialAccountType?: "personal" | "business"
+ initialAccountType: "personal" | "business"  // Now required - from profile
}

// Start at step 2 since account type is already known
- const [step, setStep] = useState(1)
+ const [step, setStep] = useState(2)  // Skip step 1 (account type)

// OR better: remove step 1 entirely and renumber steps
```

---

### Step 4: Consider Removing welcome-client.tsx (Optional)

The `/auth/welcome` page duplicates the onboarding modal. Options:
1. **Keep both**: Welcome page for email link, modal for direct navigation
2. **Remove welcome**: Redirect to home, let modal handle onboarding
3. **Merge**: Single onboarding component used by both

**Recommendation**: Keep the modal as primary, deprecate welcome page.

---

## 🔒 Account Upgrade/Downgrade Path

### Already Exists!

**Location**: `app/actions/username.ts`

```typescript
export async function upgradeToBusinessAccount(formData: FormData) {
  // Updates profiles.account_type = 'business'
  // Sets business_name
}

export async function downgradeToPersonalAccount() {
  // Updates profiles.account_type = 'personal'
  // Clears business_name, vat_number, etc.
}
```

**Current UX Problem**: These functions are hidden in the profile editor - not discoverable!

**Recommended**: Add prominent "Upgrade to Business" button in `/account/settings` for personal accounts.

---

## ✅ Summary: What To Do

| Priority | Task | Time | Status |
|----------|------|------|--------|
| 1 | Update `onboarding-provider.tsx` to fetch & pass `account_type` | 5 min | Not started |
| 2 | Remove "account-type" step from `post-signup-onboarding-modal.tsx` | 10 min | Not started |
| 3 | Skip step 1 in `seller-onboarding-wizard.tsx` | 5 min | Not started |
| 4 | Add upgrade button to account settings | 15 min | Future |
| 5 | Consider deprecating `welcome-client.tsx` | 5 min | Future |

**Database**: ✅ NO CHANGES NEEDED - trigger already copies `account_type_intent`

---

## 🧪 Testing Checklist

After implementation:

- [ ] Sign up as Personal → onboarding modal shows personal-specific steps (no account type question)
- [ ] Sign up as Business → onboarding modal shows business-specific steps (no account type question)
- [ ] Click "I want to sell" → goes to `/sell` without asking account type again
- [ ] Profile shows correct account type
- [ ] Upgrade from personal to business works from settings
- [ ] Downgrade from business to personal works

---

*End of audit document*