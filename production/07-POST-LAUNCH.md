# 📈 PHASE 6: POST-LAUNCH

> **Priority:** 🟢 Ongoing - Monitoring, improvements, and iteration  
> **Timeline:** First 30 days after launch  
> **Philosophy:** Ship, measure, improve

---

## 🎯 POST-LAUNCH PRIORITIES

### Week 1: Stabilization
1. Monitor for errors and crashes
2. Watch user feedback
3. Fix critical bugs immediately
4. Ensure payments are working

### Week 2-3: Improvements
1. Add error monitoring (Sentry)
2. Implement cart sync to Supabase
3. Add basic analytics
4. Fix N+1 chat queries

### Week 4+: Features
1. Add E2E tests
2. Performance optimization
3. New features based on feedback
4. Mobile app consideration

---

## 🔴 ERROR MONITORING

### Setup Sentry (Recommended)

```powershell
# Install Sentry
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% of transactions
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
});
```

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### What to Monitor
- [ ] JavaScript errors (client-side)
- [ ] API errors (server-side)
- [ ] Failed Stripe webhooks
- [ ] Database connection issues
- [ ] Authentication failures

### Alert Thresholds
| Error Type | Alert When |
|------------|------------|
| 5xx errors | > 5 per minute |
| Payment failures | Any occurrence |
| Auth errors | > 10 per minute |
| Database errors | Any occurrence |

---

## 📊 ANALYTICS SETUP

### Option 1: Vercel Analytics (Simple)
Already included with Vercel deployment:
1. Go to Vercel Dashboard → Analytics
2. View Core Web Vitals
3. View page views and visitors

### Option 2: Google Analytics 4 (Comprehensive)
```typescript
// components/analytics.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    // gtag('event', 'page_view', { page_path: url });
  }, [pathname, searchParams]);

  return (
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
    />
  );
}
```

### Metrics to Track
- [ ] Daily active users
- [ ] Page views per session
- [ ] Conversion rate (view → purchase)
- [ ] Cart abandonment rate
- [ ] Average order value
- [ ] User retention (7-day, 30-day)

---

## 🛒 CART SYNC TO SUPABASE

### Why It Matters
Currently cart uses localStorage only. Users lose cart when:
- Switching devices
- Clearing browser data
- Using incognito mode

### Implementation Plan

#### Step 1: Create Database Table
```sql
-- supabase/migrations/[timestamp]_add_carts.sql
CREATE TABLE public.carts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  items JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Users can only access their own cart
CREATE POLICY "Users can manage own cart"
  ON public.carts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX carts_user_id_idx ON public.carts(user_id);
```

#### Step 2: Update Cart Context
```typescript
// lib/cart-context.tsx
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // Sync cart to Supabase when user logs in
  useEffect(() => {
    if (user) {
      syncCartToServer();
    }
  }, [user]);
  
  // Merge local and server cart on login
  async function syncCartToServer() {
    const localCart = getLocalCart();
    const serverCart = await fetchServerCart();
    const mergedCart = mergeCartItems(localCart, serverCart);
    await saveCartToServer(mergedCart);
    setLocalCart(mergedCart);
  }
}
```

#### Step 3: Cart Merge Strategy
```typescript
function mergeCartItems(local: CartItem[], server: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();
  
  // Server items take priority for existing products
  server.forEach(item => merged.set(item.productId, item));
  
  // Add local items that don't exist on server
  local.forEach(item => {
    if (!merged.has(item.productId)) {
      merged.set(item.productId, item);
    }
  });
  
  return Array.from(merged.values());
}
```

- [ ] Create carts table
- [ ] Update cart context
- [ ] Test sync on login/logout
- [ ] Handle merge conflicts

---

## ⚡ PERFORMANCE OPTIMIZATION (N+1 Fix)

### Chat Query Optimization

#### Current Problem
```typescript
// 40 queries for 10 conversations
for (const conv of conversations) {
  await getProfile(conv.buyer_id);     // Query
  await getProfile(conv.seller_id);    // Query
  await getLastMessage(conv.id);       // Query
  await getUnreadCount(conv.id);       // Query
}
```

#### Solution: Supabase RPC
```sql
-- Create optimized function
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  buyer JSONB,
  seller JSONB,
  product JSONB,
  last_message JSONB,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    jsonb_build_object(
      'id', bp.id,
      'username', bp.username,
      'avatar_url', bp.avatar_url
    ) as buyer,
    jsonb_build_object(
      'id', sp.id,
      'username', sp.username,
      'avatar_url', sp.avatar_url
    ) as seller,
    jsonb_build_object(
      'id', p.id,
      'title', p.title,
      'images', p.images
    ) as product,
    (
      SELECT jsonb_build_object(
        'id', m.id,
        'content', m.content,
        'created_at', m.created_at,
        'sender_id', m.sender_id
      )
      FROM messages m 
      WHERE m.conversation_id = c.id 
      ORDER BY m.created_at DESC 
      LIMIT 1
    ) as last_message,
    (
      SELECT COUNT(*)::BIGINT
      FROM messages m 
      WHERE m.conversation_id = c.id 
        AND m.read_at IS NULL 
        AND m.sender_id != p_user_id
    ) as unread_count
  FROM conversations c
  JOIN profiles bp ON c.buyer_id = bp.id
  JOIN profiles sp ON c.seller_id = sp.id
  JOIN products p ON c.product_id = p.id
  WHERE c.buyer_id = p_user_id OR c.seller_id = p_user_id
  ORDER BY c.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Update Message Context
```typescript
async function loadConversations() {
  const { data, error } = await supabase
    .rpc('get_user_conversations', { p_user_id: user.id });
  
  if (error) throw error;
  return data;
}
```

- [ ] Create RPC function in Supabase
- [ ] Update message-context.tsx
- [ ] Test performance improvement
- [ ] Monitor query times

---

## 🧪 E2E TEST SUITE

### Setup Playwright
```powershell
pnpm add -D @playwright/test
npx playwright install
```

### Project Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Priority Test Suites

#### Authentication Tests
```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign up', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/verify/);
  });

  test('user can sign in', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'existing@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });
});
```

#### Checkout Tests
```typescript
// tests/checkout.spec.ts
test.describe('Checkout', () => {
  test('complete purchase flow', async ({ page }) => {
    await page.goto('/products/test-product');
    await page.click('button:has-text("Add to Cart")');
    await page.click('a[href="/cart"]');
    await page.click('button:has-text("Checkout")');
    // ... continue with Stripe test mode
  });
});
```

- [ ] Setup Playwright
- [ ] Write auth tests
- [ ] Write checkout tests
- [ ] Add to CI pipeline

---

## 📋 30-DAY POST-LAUNCH CHECKLIST

### Day 1-3: Critical Period
- [ ] Monitor error rates every hour
- [ ] Check Stripe webhook delivery
- [ ] Respond to user reports immediately
- [ ] Ensure all payments are processing

### Week 1
- [ ] Setup Sentry error monitoring
- [ ] Review first user feedback
- [ ] Fix any critical bugs
- [ ] Monitor server costs

### Week 2
- [ ] Implement cart sync to Supabase
- [ ] Add basic analytics
- [ ] Create first changelog
- [ ] Gather feature requests

### Week 3
- [ ] Fix N+1 chat queries
- [ ] Optimize slow pages
- [ ] Add first E2E tests
- [ ] Review SEO rankings

### Week 4
- [ ] Complete E2E test suite
- [ ] Plan v1.1 features
- [ ] Review metrics and KPIs
- [ ] Document learnings

---

## 🎯 KEY METRICS TO TRACK

### Business Metrics
| Metric | Target | Notes |
|--------|--------|-------|
| Signups | Track growth | Daily, weekly |
| Active users | Track retention | DAU, WAU, MAU |
| Products listed | Track supply | New listings/day |
| Orders completed | Track demand | Orders/day |
| GMV | Track revenue | Total sales value |

### Technical Metrics
| Metric | Target | Notes |
|--------|--------|-------|
| Error rate | < 0.1% | Sentry |
| Response time | < 200ms | Vercel Analytics |
| Cache hit rate | > 80% | Next.js cache |
| Uptime | > 99.9% | Vercel status |

---

## 🔮 FUTURE ROADMAP

### v1.1 (Month 2)
- [ ] Cart sync across devices
- [ ] Improved search with filters
- [ ] Seller analytics dashboard
- [ ] Push notifications

### v1.2 (Month 3)
- [ ] Mobile-optimized checkout
- [ ] Bulk listing tools
- [ ] Advanced seller tools
- [ ] API for integrations

### v2.0 (Month 6+)
- [ ] Mobile app (React Native)
- [ ] Auction functionality
- [ ] Multi-currency support
- [ ] International shipping

---

## ✅ POST-LAUNCH SUCCESS CRITERIA

```markdown
✅ Launch Considered Successful When:

Week 1:
- [ ] < 5 critical bugs reported
- [ ] 100+ user signups
- [ ] > 50 products listed
- [ ] First real transaction completed

Month 1:
- [ ] Error rate < 1%
- [ ] 1000+ users
- [ ] 500+ products
- [ ] 50+ completed orders
- [ ] Positive user feedback

Month 3:
- [ ] Sustainable growth
- [ ] Revenue covers hosting costs
- [ ] Active community
- [ ] Clear product roadmap
```

---

*Post-launch guide: Focus on stability, then growth, then features*
