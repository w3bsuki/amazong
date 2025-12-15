# ⚡ PHASE 3: PERFORMANCE & CACHING

> **Priority:** 🟡 Medium - User experience and scalability  
> **Estimated Time:** 1-2 hours  
> **Philosophy:** Measure first, optimize second

---

## 📊 CURRENT PERFORMANCE STATUS

### Next.js 16 Cache Features (Verified ✅)
| Feature | Status | Config |
|---------|--------|--------|
| Cache Components | ✅ Enabled | `cacheComponents: true` |
| Cache Life Profiles | ✅ Configured | categories, products, deals, user |
| Image Optimization | ✅ Enabled | AVIF, WebP, 30-day TTL |
| Package Import Optimization | ✅ Enabled | phosphor-icons, date-fns, recharts |

### Build Output (From Last Build)
- Total Pages: 2257
- Static Pages: ~2200 (prerendered)
- Dynamic Pages: ~57 (SSR at runtime)
- Build Time: ~3-5 minutes

---

## 🔍 CACHING VERIFICATION

### Cache Life Profiles (next.config.ts)
```typescript
cacheLife: {
  // Categories: Rarely change, cache aggressively
  categories: {
    stale: 300,       // 5 minutes - serve stale while revalidating
    revalidate: 3600, // 1 hour - background revalidation
    expire: 86400,    // 1 day - hard expiry
  },
  // Products: Change more frequently
  products: {
    stale: 60,        // 1 minute
    revalidate: 300,  // 5 minutes
    expire: 3600,     // 1 hour
  },
  // Deals: Time-sensitive, short cache
  deals: {
    stale: 30,        // 30 seconds
    revalidate: 120,  // 2 minutes
    expire: 600,      // 10 minutes
  },
  // User: Personal data, minimal cache
  user: {
    stale: 30,        // 30 seconds
    revalidate: 60,   // 1 minute
    expire: 300,      // 5 minutes
  },
}
```

### Verify Cache Implementation
```typescript
// lib/data/products.ts - Should have 'use cache' directive
'use cache';
import { cacheLife, cacheTag } from 'next/cache';

export async function getProducts() {
  cacheLife('products');
  cacheTag('products');
  // ...
}
```

- [ ] Verify `'use cache'` in lib/data/products.ts
- [ ] Verify `'use cache'` in lib/data/categories.ts
- [ ] Verify `'use cache'` in lib/data/store.ts
- [ ] Check cacheTag() usage for invalidation

---

## 🐌 KNOWN PERFORMANCE ISSUES

### Issue 1: Chat N+1 Query (High Priority)
**Location:** `lib/message-context.tsx` - `loadConversations()`

**Problem:**
```typescript
// Current: 4 queries per conversation
for (const conversation of conversations) {
  await getProfile(conversation.buyer_id);     // Query 1
  await getProfile(conversation.seller_id);    // Query 2
  await getLastMessage(conversation.id);       // Query 3
  await getUnreadCount(conversation.id);       // Query 4
}
// 10 conversations = 40 queries!
```

**Solution:** Create Supabase RPC function
```sql
-- Create this function in Supabase
CREATE OR REPLACE FUNCTION get_conversations_with_details(p_user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  buyer_profile JSONB,
  seller_profile JSONB,
  last_message JSONB,
  unread_count INT
) AS $$
BEGIN
  -- Single query with JOINs
  RETURN QUERY
  SELECT 
    c.id,
    jsonb_build_object('id', bp.id, 'username', bp.username, 'avatar_url', bp.avatar_url),
    jsonb_build_object('id', sp.id, 'username', sp.username, 'avatar_url', sp.avatar_url),
    (SELECT jsonb_build_object('content', m.content, 'created_at', m.created_at)
     FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1),
    (SELECT COUNT(*) FROM messages m 
     WHERE m.conversation_id = c.id AND m.read_at IS NULL AND m.sender_id != p_user_id)::INT
  FROM conversations c
  JOIN profiles bp ON c.buyer_id = bp.id
  JOIN profiles sp ON c.seller_id = sp.id
  WHERE c.buyer_id = p_user_id OR c.seller_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

**Priority:** 🟡 Post-launch improvement (not blocking)

- [ ] POST-LAUNCH: Create RPC function for conversations
- [ ] POST-LAUNCH: Update message-context.tsx to use RPC

### Issue 2: Homepage Multiple Queries
**Location:** Homepage server component

**Current:** Multiple parallel queries are OK with `'use cache'`
**Status:** ✅ Not an issue - cache handles this

---

## 📦 BUNDLE SIZE ANALYSIS

### Run Bundle Analyzer
```powershell
# Generate bundle analysis report
$env:ANALYZE="true"; pnpm build

# Opens 3 browser tabs with bundle visualization
```

### Expected Large Chunks
| Package | Size | Notes |
|---------|------|-------|
| `react-dom` | ~130KB | Required |
| `@phosphor-icons/react` | ~50KB | Tree-shaken |
| `framer-motion` | ~40KB | Required for animations |
| `recharts` | ~80KB | Dashboard only |
| `zod` | ~15KB | Form validation |

### Optimization Checklist
- [ ] Run bundle analyzer (`ANALYZE=true pnpm build`)
- [ ] Identify any unexpectedly large chunks
- [ ] Verify tree-shaking is working (phosphor-icons should be small)

### Already Optimized
```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['@phosphor-icons/react', 'date-fns', 'recharts'],
}
```

---

## 🖼️ IMAGE OPTIMIZATION

### Current Config (Verified ✅)
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  remotePatterns: [
    // Unsplash, Supabase, SimpleIcons, FlagCDN, Dicebear
  ],
}
```

### Image Usage Checklist
- [ ] All images use `next/image` component
- [ ] Priority set on above-the-fold images
- [ ] Proper width/height or fill props
- [ ] Lazy loading for below-the-fold images

---

## 🔄 SUSPENSE BOUNDARIES

### Verify Suspense Usage
```tsx
// Homepage should have Suspense boundaries
<Suspense fallback={<ProductGridSkeleton />}>
  <FeaturedProducts />
</Suspense>

<Suspense fallback={<CategorySkeleton />}>
  <CategoryCircles />
</Suspense>
```

### Critical Pages to Check
| Page | Has Suspense? | Status |
|------|---------------|--------|
| Homepage | ✅ Yes | Good |
| Product Page | ✅ Yes | Good |
| Category Page | ✅ Yes | Good |
| Search Results | ✅ Yes | Good |
| Account Pages | ⚠️ Check | Verify |

- [ ] Verify Suspense boundaries on all data-fetching pages
- [ ] Ensure skeletons match final layout

---

## 📈 RUNTIME PERFORMANCE

### Lighthouse Targets
| Metric | Target | Current |
|--------|--------|---------|
| Performance | >90 | TBD |
| Accessibility | >90 | TBD |
| Best Practices | >90 | TBD |
| SEO | >95 | TBD |

### Performance Checklist
- [ ] Run Lighthouse on homepage
- [ ] Run Lighthouse on product page
- [ ] Check Core Web Vitals (LCP, FID, CLS)
- [ ] Fix any critical issues

---

## 🧪 CACHE TESTING

### Test Cache Behavior
```typescript
// Enable cache debugging in .env.local
NEXT_PRIVATE_DEBUG_CACHE=1
```

### Manual Cache Test
```bash
# 1. Start production server
pnpm build && pnpm start

# 2. Visit homepage, check for cache headers
curl -I http://localhost:3000

# 3. Look for:
# - x-cache: HIT or MISS
# - Cache-Control headers
```

- [ ] Enable cache debugging locally
- [ ] Verify cache hits on repeat visits
- [ ] Test cache invalidation with revalidateTag

---

## 🗄️ DATABASE QUERY OPTIMIZATION

### Supabase Query Patterns
```typescript
// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from('products')
  .select('id, title, price, images')
  .limit(20);

// ❌ BAD: Select everything
const { data } = await supabase
  .from('products')
  .select('*');
```

### Audit Database Queries
- [ ] Check for `select('*')` usage
- [ ] Verify indexes on frequently queried columns
- [ ] Check for missing pagination

---

## ✅ PERFORMANCE CHECKLIST SUMMARY

### Must Verify (Blockers)
- [ ] Cache components working (`'use cache'` directive)
- [ ] Images optimized with next/image
- [ ] No blocking render in critical path

### Should Check (High Priority)
- [ ] Bundle analyzer shows reasonable sizes
- [ ] Suspense boundaries on all async components
- [ ] Lighthouse score >90

### Post-Launch (Improvements)
- [ ] Fix Chat N+1 query with RPC
- [ ] Add performance monitoring (Vercel Analytics)
- [ ] Optimize below-the-fold images

---

## 🏁 PHASE 3 COMPLETION CRITERIA

```powershell
# Run these checks before proceeding to Phase 4

# 1. Build succeeds with cache components
pnpm build # Look for "Cache Components" in output

# 2. Bundle analysis (optional but recommended)
$env:ANALYZE="true"; pnpm build
# Check for unexpected large chunks

# 3. Lighthouse audit (after deployment)
# Use Chrome DevTools or PageSpeed Insights
# Target: Performance >90
```

---

## 💡 PERFORMANCE MONITORING POST-LAUNCH

### Recommended Tools
1. **Vercel Analytics** - Built-in performance monitoring
2. **Sentry** - Error tracking with performance
3. **Google Search Console** - Core Web Vitals

### Metrics to Track
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Cache hit rate

---

*Verified with: Next.js 16 MCP (Cache Components documentation)*
