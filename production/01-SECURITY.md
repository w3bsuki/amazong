# 🔒 PHASE 0: SECURITY AUDIT

> **Priority:** 🔴 BLOCKER - Must complete before ANY deployment  
> **Estimated Time:** 30 minutes  
> **Risk if Skipped:** Data breach, unauthorized access, legal liability

---

## 🚨 CRITICAL ISSUES

### Issue 1: Debug Auth Endpoint (CRITICAL)
**Status:** ⏳ PENDING  
**File:** `app/api/debug-auth/route.ts`  
**Risk:** Exposes authentication internals, potential privilege escalation

```powershell
# FIX: Delete immediately
Remove-Item -Recurse -Force "j:\amazong\app\api\debug-auth"

# VERIFY: Endpoint returns 404
# After deployment: curl https://yourdomain.com/api/debug-auth should 404
```

- [ ] Delete `/api/debug-auth` folder
- [ ] Verify 404 response
- [ ] Check no other debug endpoints exist

---

## 🔍 API ROUTE AUDIT

### Routes Using Service Role Key
These routes bypass RLS - verify they're protected:

| Route | Purpose | Auth Required? | Status |
|-------|---------|----------------|--------|
| `/api/stores` | Store creation | ✅ User session | 🟢 OK |
| `/api/products` | Product management | ✅ User session | 🟢 OK |
| `/api/products/create` | Product creation | ✅ User session | 🟢 OK |
| `/api/categories/[slug]/attributes` | Category attrs | ❌ Public data | 🟢 OK |

### Webhook Routes
Verify signature verification is implemented:

| Route | Webhook Secret | Status |
|-------|----------------|--------|
| `/api/checkout/webhook` | `STRIPE_WEBHOOK_SECRET` | ✅ Verified |
| `/api/subscriptions/webhook` | `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET` | ✅ Verified |
| `/api/payments/webhook` | `STRIPE_WEBHOOK_SECRET` | ✅ Verified |
| `/api/revalidate` | `REVALIDATION_SECRET` | ✅ Verified |

- [ ] All webhooks verify signatures
- [ ] Webhook secrets are different from API keys
- [ ] Failed verification returns 401/403

---

## 🔑 ENVIRONMENT VARIABLES AUDIT

### Required for Production
```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=         # Public, OK to expose
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Public, OK to expose
SUPABASE_SERVICE_ROLE_KEY=        # 🔴 SECRET - Server only

# Stripe (REQUIRED)
STRIPE_SECRET_KEY=                # 🔴 SECRET - Server only
STRIPE_WEBHOOK_SECRET=            # 🔴 SECRET - Server only
STRIPE_SUBSCRIPTION_WEBHOOK_SECRET= # 🔴 SECRET - Server only

# App URLs (REQUIRED)
NEXT_PUBLIC_APP_URL=              # Your production domain

# Cache Revalidation (RECOMMENDED)
REVALIDATION_SECRET=              # 🔴 SECRET - For manual cache busting
```

### Security Checklist
- [ ] No secrets in `NEXT_PUBLIC_*` variables
- [ ] All secrets set in Vercel dashboard
- [ ] Different secrets for dev/staging/production
- [ ] Webhook URLs updated to production domain

---

## 🛡️ ROW LEVEL SECURITY (RLS) VERIFICATION

### Critical Tables
| Table | RLS Enabled | Policies Tested |
|-------|-------------|-----------------|
| `profiles` | ✅ Yes | Users can only read/update own |
| `products` | ✅ Yes | Anyone can read, owner can update |
| `orders` | ✅ Yes | Buyer/seller can view own orders |
| `conversations` | ✅ Yes | Participants only |
| `messages` | ✅ Yes | Conversation participants only |
| `seller_subscriptions` | ✅ Yes | Owner only |

### RLS Test Commands
```sql
-- Run as anon user (should fail)
SELECT * FROM profiles LIMIT 1;

-- Run as authenticated user (should show only own data)
SELECT * FROM orders LIMIT 10;
```

- [ ] All tables have RLS enabled
- [ ] Policies are restrictive by default
- [ ] Admin bypass uses service role client only

---

## 🔐 AUTH FLOW VERIFICATION

### Sign Up Flow
- [ ] Email verification required
- [ ] Username validation (no SQL injection)
- [ ] Password requirements enforced
- [ ] Rate limiting on auth endpoints

### Sign In Flow
- [ ] PKCE flow implemented correctly
- [ ] Session tokens are httpOnly cookies
- [ ] Refresh token rotation works
- [ ] Logout clears all sessions

### Password Reset
- [ ] Reset link expires (default: 1 hour)
- [ ] Old password not required
- [ ] Email notification sent on change

---

## ⚠️ POTENTIAL VULNERABILITIES

### 1. Console.log in Production
```typescript
// BAD: Exposes data in browser console
console.log('User data:', user)

// GOOD: Remove or use proper logging
```
**Action:** Remove all console.log from production code

### 2. Non-null Assertions on Env Vars
```typescript
// Current (risky - crashes if undefined)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

// Better (fails early with clear error)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required')
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {})
```
**Action:** Consider adding env var validation at startup

### 3. XSS Prevention
- [ ] All user input is sanitized
- [ ] dangerouslySetInnerHTML used only with sanitized content
- [ ] Content-Security-Policy headers configured

---

## ✅ SECURITY CHECKLIST SUMMARY

### Must Have (Blockers)
- [ ] `/api/debug-auth` deleted
- [ ] All secrets in env vars (not code)
- [ ] Webhook signatures verified
- [ ] RLS enabled on all tables

### Should Have (High Priority)
- [ ] Console.log removed from production
- [ ] Rate limiting on auth endpoints
- [ ] CSP headers configured
- [ ] Error messages don't leak internal info

### Nice to Have (Post-Launch)
- [ ] Security monitoring (Sentry)
- [ ] Penetration testing
- [ ] Bug bounty program
- [ ] Regular dependency audits

---

## 🏁 PHASE 0 COMPLETION CRITERIA

```powershell
# All these should pass before proceeding to Phase 1

# 1. Debug endpoint deleted
Test-Path "app/api/debug-auth" # Should be False

# 2. Build passes
pnpm build # Should succeed

# 3. No exposed secrets
Select-String -Path "lib/**/*.ts","app/**/*.ts" -Pattern "(sk_live_|secret)" -Recurse
# Should return nothing (or only env var references)
```

---

*Verified with: Next.js 16 MCP, Supabase Best Practices*
