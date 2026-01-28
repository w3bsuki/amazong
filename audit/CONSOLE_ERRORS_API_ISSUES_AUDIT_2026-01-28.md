# Console Errors & API Issues Audit

**Date:** January 28, 2026  
**Environment:** Development (localhost:3000)

---

## Critical Errors

### 1. Category Tree Query Warning (Non-blocking)

**Route:** `/en/sell`  
**Severity:** ⚠️ Low  
**Impact:** Console warning only - page still functions

```json
{
  "ts": "2026-01-28T08:59:01.480Z",
  "level": "error",
  "event": "[getCategoryTreeDepth3] Root query error",
  "error": {
    "name": "object",
    "message": "[object Object]"
  }
}
```

**Status:** Non-blocking warning. The sell page works correctly and shows the Stripe Connect payout setup prompt as expected. Once Stripe is configured, the full sell form is available.

**Note:** This console warning should be investigated but is not preventing functionality.

---

### 2. Supabase 503 Service Unavailable

**Route:** `/en/chat`  
**Severity:** ❌ Critical  
**Impact:** Chat functionality completely broken

```
Failed to load resource: the server responded with a status of 503 ()
URL: https://dhtzybnkvpimmomzwrce.supabase.co/rest/v1/conversations?select=...
```

**Error Details:**
```javascript
{
  message: "upstream connect error or disconnect/reset before headers and the latest reset reason: connection timeout"
}
```

**Root Cause:** Supabase connection timeout, possibly due to:
- Supabase service degradation
- Connection pool exhausted
- Network issues
- Cold start on Supabase edge functions

**Fix Required:**
1. Check Supabase status page
2. Implement connection retry logic
3. Add fallback UI for connection failures
4. Consider connection pooling optimization

---

### 3. Cart Sync RPC Unavailable

**Route:** Multiple pages  
**Severity:** ⚠️ High  
**Impact:** Cart state may not persist to server

```
Cart sync skipped (RPC unavailable): upstream connect error or disconnect/reset before headers
```

```javascript
Error fetching server cart: {
  message: "TypeError: Failed to fetch"
}
```

**Root Cause:** The `cart_add_item` RPC function is timing out

**Fix Required:**
1. Implement offline-first cart with sync queue
2. Add retry logic for cart operations
3. Show user feedback when sync fails
4. Queue failed operations for retry

---

## Warnings

### 4. Chart Dimension Warnings

**Route:** `/en/account`  
**Severity:** ⚠️ Low  
**Impact:** Charts may not render correctly

```
The width(-1) and height(-1) of chart should be greater than 0
```

**Root Cause:** Chart container has invalid dimensions (likely before mounting)

**Fix Required:**
1. Add dimension checks before chart initialization
2. Use ResizeObserver to handle dynamic sizing
3. Provide minimum dimensions as fallback

---

### 5. Image Preload Warning

**Route:** Product detail pages  
**Severity:** ⚠️ Low  
**Impact:** Minor LCP performance impact

```
Image with src "https://images.unsplash.com/..." was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.
```

**Fix Required:**
1. Add `priority` prop to hero images
2. Add preload hints in `<head>`
3. Use Next.js Image component with priority

---

## Network Request Analysis

### Failing Endpoints

| Endpoint | Status | Error |
|----------|--------|-------|
| `/rest/v1/conversations` | 503 | Connection timeout |
| `/rest/v1/rpc/cart_add_item` | 503 | Connection timeout |
| Category tree query | Error | Query failure |

### Successful Endpoints

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/rest/v1/products` | 200 | Working |
| `/rest/v1/users` | 200 | Working |
| Authentication | 200 | Working |
| Image CDN | 200 | Working |

---

## Error Handling Recommendations

### 1. Global Error Boundary

```typescript
// Recommended: Add error boundaries around key features
<ErrorBoundary fallback={<FeatureUnavailable />}>
  <ChatFeature />
</ErrorBoundary>
```

### 2. Retry Logic Pattern

```typescript
// Recommended: Implement exponential backoff
async function fetchWithRetry(fn: () => Promise<T>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

### 3. Offline-First Cart

```typescript
// Recommended: Queue operations when offline
const cartQueue = new OperationQueue({
  onOnline: () => syncPendingOperations(),
  storage: localStorage
});
```

### 4. User Feedback

- Show toast notifications for failed operations
- Provide retry buttons for recoverable errors
- Display offline indicators when disconnected

---

## Monitoring Recommendations

1. **Set up Sentry or similar** for error tracking
2. **Add Supabase monitoring** for API health
3. **Implement health checks** for critical paths
4. **Create alerting** for error rate spikes

---

## Summary Table

| Error | Severity | Route | Fix Priority |
|-------|----------|-------|--------------|
| Category tree warning | Low | /sell | P3 (non-blocking) |
| Supabase 503 | Critical | /chat | P0 |
| Cart sync RPC | High | Multiple | P1 |
| Chart dimensions | Low | /account | P2 |
| Image preload | Low | PDP | P3 |

---

**Next Steps:**
1. Investigate Supabase connection issues
2. Add error boundaries to critical features
3. Implement retry logic for API calls
4. Add user-facing error messages
5. Set up error monitoring
