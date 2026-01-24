# Audit Spec: P0 E2E Checkout Order Flow

> Created: 2026-01-23
> Status: Queue
> Priority: P0 — RELEASE BLOCKER

---

## Audit Scope

**What we're auditing:**
- Full E2E flow: cart → checkout → order created
- Playwright test coverage for critical purchase path

**Why:**
- **Launch blocker** — Core revenue path must work
- Currently only cart → checkout covered, order creation pending
- Referenced in TODO.md P0 section

**Success criteria:**
- E2E test passes: add to cart → checkout → payment → order created
- Order appears in buyer's order history
- Seller receives notification

---

## Tasks

### Phase 1: Write Test
- [ ] **1.1** Extend `e2e/smoke.spec.ts` or create `e2e/checkout-order.spec.ts`
- [ ] **1.2** Test: product page → add to cart → cart page
- [ ] **1.3** Test: cart → checkout → Stripe test payment
- [ ] **1.4** Test: verify order created in DB (via API or UI)

### Phase 2: Fix Any Failures
- [ ] **2.1** Fix issues found by test

### Phase 3: Verify
- [ ] **3.1** Test passes consistently (3 runs)
- [ ] **3.2** Gates pass

---

## Test Outline

```typescript
test('full purchase flow', async ({ page }) => {
  // 1. Find product, add to cart
  await page.goto('/en/product/[id]');
  await page.click('[data-testid="add-to-cart"]');
  
  // 2. Go to cart, proceed to checkout
  await page.goto('/en/cart');
  await page.click('[data-testid="checkout"]');
  
  // 3. Complete Stripe checkout (test mode)
  // Use Stripe test card
  
  // 4. Verify order created
  await expect(page).toHaveURL(/\/orders/);
  await expect(page.locator('[data-testid="order-item"]')).toBeVisible();
});
```

---

## Verification

### Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] New E2E test passes
- [ ] `e2e:smoke` still passes (no regressions)
