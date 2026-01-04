# Phase 8: Security Audit ⚠️ DASHBOARD ACTION NEEDED

> **Priority:** 🔴 Critical  
> **Status:** All code changes complete, one Supabase Dashboard action remaining  
> **Estimated Time:** 1 hour  
> **Goal:** Secure data, protect users, prevent attacks  
> **Tech Stack:** Next.js 16 + Supabase + @supabase/ssr  
> **Last Verified:** January 4, 2026

---

## ✅ Current Security Status

### Already Implemented:
- ✅ **@supabase/ssr v0.8.0** - Latest SSR package (NOT deprecated auth-helpers)
- ✅ **Middleware auth** - `supabase.auth.getUser()` validates JWT (not just `getSession`)
- ✅ **PKCE flow** - Enabled by default via @supabase/ssr
- ✅ **Protected routes** - `/account/*`, `/sell/orders/*`, `/chat/*` require auth
- ✅ **Server Actions** - Use `createClient()` with auth checks + Zod validation
- ✅ **Cookie handling** - Proper `getAll()` / `setAll()` pattern

---

## 📋 Pre-Audit Checklist

- [ ] Run Supabase security advisors: Dashboard → Database → Advisors → Security
- [ ] Run performance advisors: Dashboard → Database → Advisors → Performance
- [ ] (AI-agent option) `mcp_supabase_get_advisors({ type: 'security' })` and `mcp_supabase_get_advisors({ type: 'performance' })`
- [ ] Review `.env.local` variables
- [ ] Verify RLS on all tables

---

## 🔐 1. Environment Variables

**Goal:** Zero secrets exposed to client

### Server-Only Variables (NO `NEXT_PUBLIC_` prefix):
```env
SUPABASE_SERVICE_ROLE_KEY=...     # Admin bypass - NEVER expose
STRIPE_SECRET_KEY=...              # Payment secrets
DATABASE_URL=...                   # Direct DB connection (if used)
```

### Safe Public Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=...       # ✅ Safe - just project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # ✅ Safe - respects RLS
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=... # ✅ Safe - public key
```

### Checklist:
- [ ] `.env.local` in `.gitignore`
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` in client bundles
- [ ] Production env vars set in Vercel Dashboard
- [ ] No secrets in `console.log()` statements

---

## 🛡️ 2. Row Level Security (RLS)

**Goal:** Users only access their own data. RLS is your PRIMARY security layer.

### Critical Best Practices (from Supabase docs):

#### 2.1 Enable RLS on ALL Tables
```sql
ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;
```

#### 2.2 Wrap `auth.uid()` in SELECT for Performance
```sql
-- ❌ BAD: auth.uid() called per-row
CREATE POLICY "bad_policy" ON todos
  USING (auth.uid() = user_id);

-- ✅ GOOD: (select auth.uid()) cached per-statement (99%+ faster)
CREATE POLICY "good_policy" ON todos
  TO authenticated
  USING ((select auth.uid()) = user_id);
```

#### 2.3 Always Specify Role with `TO` Clause
```sql
-- ❌ BAD: Policy runs for all roles
CREATE POLICY "..." ON table USING (...);

-- ✅ GOOD: Specify role explicitly
CREATE POLICY "..." ON table
  TO authenticated  -- or 'anon' for public data
  USING (...);
```

#### 2.4 Use Security Definer Functions for Complex Checks
```sql
-- Create in PRIVATE schema (not public)
CREATE FUNCTION private.has_seller_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER  -- Bypasses RLS for this function
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE (SELECT auth.uid()) = id AND role = 'seller'
  );
END;
$$;

-- Use in policy
CREATE POLICY "seller_access" ON products
  TO authenticated
  USING ((SELECT private.has_seller_role()));
```

### Tables to Verify:
| Table | Expected Policy | RLS Enabled |
|-------|-----------------|-------------|
| `profiles` | Users see own profile | [ ] |
| `orders` | Users see own orders | [ ] |
| `products` | Public read, seller write | [ ] |
| `messages` | Users see own conversations | [ ] |
| `wishlists` | Users see own wishlist | [ ] |
| `reviews` | Public read, auth write | [ ] |
| `cart_items` | Users see own cart | [ ] |
| `notification_preferences` | Users see own prefs | [ ] |

### Test RLS (via Supabase SQL Editor):
```sql
-- Should return ONLY current user's data
SELECT * FROM profiles;
SELECT * FROM orders;
SELECT * FROM wishlists;

-- This should fail/return empty for other users' data
SELECT * FROM profiles WHERE id != (SELECT auth.uid());
```

---

## 🔑 3. Authentication Security

**Goal:** Secure auth flows with Supabase Auth

### 3.1 Middleware Must Use `getUser()` (NOT `getSession()`)
```typescript
// ✅ CORRECT: lib/supabase/middleware.ts
const { data: { user } } = await supabase.auth.getUser()

// ❌ WRONG: getSession() can be spoofed
const { data: { session } } = await supabase.auth.getSession()
```

**Why:** `getUser()` validates the JWT with Supabase servers. `getSession()` only reads the local cookie (can be forged).

### 3.2 Auth Configuration Checklist:
- [ ] **Email verification required** - Dashboard → Auth → Email Settings
- [ ] **Leaked password protection** - Dashboard → Auth → Settings → Enable
- [ ] **Rate limiting** - Built into Supabase Auth (no config needed)
- [ ] **Secure password requirements** - Min 8 chars (Supabase default)

### 3.3 Protected Routes Pattern:
```typescript
// lib/supabase/middleware.ts - Already implemented ✅
function isAccountPath(pathname: string): boolean {
  const locale = getLocaleFromPath(pathname)
  if (locale) return pathname.startsWith(`/${locale}/account`)
  return pathname.startsWith('/account')
}

// Redirect unauthenticated users
if (!user && isAccountPath(pathname)) {
  return NextResponse.redirect(new URL(loginPath, request.url))
}
```

### 3.4 Session Security:
- [ ] Sessions expire in reasonable time (default: 1 week)
- [ ] Logout clears all auth cookies
- [ ] No session data in localStorage (use httpOnly cookies)

---

## ⚡ 4. Server Actions Security

**Goal:** All mutations validate auth + input

### Required Pattern for ALL Server Actions:
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(100),
})

export async function addToCart(input: unknown) {
  // 1. ALWAYS verify authentication first
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  // 2. ALWAYS validate input with Zod
  const validated = schema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: 'Invalid input' }
  }

  // 3. Perform action - RLS provides additional protection
  const { error: dbError } = await supabase
    .from('cart_items')
    .insert({ 
      user_id: user.id,  // Use authenticated user ID
      product_id: validated.data.productId,
      quantity: validated.data.quantity,
    })

  if (dbError) {
    return { success: false, error: 'Failed to add to cart' }
  }

  // 4. Revalidate relevant paths
  revalidatePath('/cart')
  return { success: true }
}
```

### Server Actions Checklist:
- [ ] `app/actions/products.ts` - Auth + Zod ✅
- [ ] `app/actions/orders.ts` - Auth + Zod
- [ ] `app/actions/reviews.ts` - Auth + Zod
- [ ] `app/actions/profile.ts` - Auth + Zod
- [ ] `app/actions/subscriptions.ts` - Auth + Zod

### Next.js Server Actions Config:
```typescript
// next.config.ts - Configure allowed origins for CSRF protection
const config: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',  // Limit request size
      allowedOrigins: ['yourdomain.com'],  // CSRF protection
    },
  },
}
```

---

## 🌐 5. Security Headers

**Goal:** Prevent XSS, clickjacking, and other attacks

### Recommended Headers in `next.config.ts`:
```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'  // Prevent clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
]

// Apply in next.config.ts
async headers() {
  return [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ]
}
```

### Content Security Policy (CSP):
```typescript
// For Supabase + Stripe, a practical CSP:
{
  key: 'Content-Security-Policy',
  value: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://*.stripe.com;
    font-src 'self';
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com;
    frame-src https://js.stripe.com https://hooks.stripe.com;
  `.replace(/\s+/g, ' ').trim()
}
```

---

## ✅ 6. Input Validation

**Goal:** Never trust user input

### Validation Layers:
1. **Client-side** - UX feedback (not security)
2. **Server Actions** - Zod validation (security)
3. **Database** - RLS + constraints (final defense)

### Common Patterns:
```typescript
// UUID validation
z.string().uuid()

// Safe string (prevent injection)
z.string().min(1).max(255).regex(/^[\w\s-]+$/)

// Price (server-side calculation)
z.coerce.number().positive().max(999999)

// Email
z.string().email()

// Enum with allowed values
z.enum(['active', 'draft', 'archived'])
```

### XSS Prevention:
- ✅ React escapes output by default
- ❌ Never use `dangerouslySetInnerHTML` with user content
- ✅ Sanitize any HTML if absolutely needed (use `dompurify`)

---

## 💳 7. Payment Security (Stripe)

**Goal:** Secure payment handling

### Checklist:
- [ ] **Webhook signature verification** - Always verify `stripe-signature` header
- [ ] **Server-side price calculation** - NEVER trust client-sent prices
- [ ] **Use Checkout Sessions** - Let Stripe handle payment form (PCI compliant)

### Webhook Pattern:
```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  // Handle event...
  return new Response('OK', { status: 200 })
}
```

---

## 📦 8. Storage Security (Supabase Storage)

**Goal:** Secure file access

### Storage RLS Policies:
```sql
-- Public bucket (product images)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Private bucket (user documents)
CREATE POLICY "Users access own files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'user-documents' AND (storage.foldername(name))[1] = (SELECT auth.uid()::text));
```

### Checklist:
- [ ] Private buckets for sensitive files
- [ ] Storage RLS policies enabled
- [ ] File type validation (server-side)
- [ ] File size limits configured

---

## 🚨 9. Known Issues to Fix

### From Supabase Security Advisors:

| Issue | Severity | Fix |
|-------|----------|-----|
| `function_search_path_mutable` | WARN | `ALTER FUNCTION ... SET search_path = public` |
| `auth_leaked_password_protection` | WARN | Enable in Dashboard → Auth → Settings |

### Migration to Fix Function Search Path:
```sql
-- supabase/migrations/fix_function_search_path.sql
ALTER FUNCTION public.set_notification_preferences_updated_at()
SET search_path = public;
```

### Fix RLS Performance (from 02-supabase.md):
```sql
-- Wrap auth.uid() in SELECT for caching
DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;

CREATE POLICY "Users can view own notification preferences"
ON notification_preferences FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);
```

---

## 🔒 Security Checklist Summary

### Data Protection:
- [ ] All tables have RLS enabled
- [ ] RLS policies use `(SELECT auth.uid())` pattern
- [ ] RLS policies specify `TO authenticated` role
- [ ] Service role key is server-only

### Authentication:
- [ ] Middleware uses `getUser()` not `getSession()`
- [ ] Email verification required
- [ ] Leaked password protection enabled
- [ ] Protected routes redirect to login

### Server Actions:
- [ ] All actions check `auth.getUser()` first
- [ ] All input validated with Zod
- [ ] No sensitive data in responses
- [ ] `allowedOrigins` configured for CSRF

### Headers & Transport:
- [ ] HTTPS enforced (HSTS header)
- [ ] Security headers configured
- [ ] CSP policy set (if needed)

### Storage & Files:
- [ ] Private buckets have RLS
- [ ] File uploads validated
- [ ] No public access to sensitive files

---

## 📊 Security Metrics

| Check | Status | Notes |
|-------|--------|-------|
| Supabase security advisors | 2 warnings | Fix pending |
| Tables with RLS | ? | Run audit |
| Middleware uses getUser() | ✅ | Verified |
| Server Actions secured | ✅ | Zod + auth |
| Env vars properly scoped | ? | Verify |

---

## ✅ Phase 8 Completion Checklist

- [ ] All Supabase security warnings resolved
- [ ] All tables have RLS enabled
- [ ] RLS policies optimized with `(SELECT auth.uid())`
- [ ] Leaked password protection enabled
- [ ] Security headers added to next.config.ts
- [ ] Server Actions verified (auth + validation)
- [ ] Storage policies verified
- [ ] Stripe webhook signature verification

---

## 🏁 Next Step

→ Proceed to [Phase 9: Go-Live](./09-go-live.md)
