# 🧪 PHASE 4: TESTING & QA

> **Priority:** 🟡 High - Prevent launch-day disasters  
> **Estimated Time:** 3-4 hours (manual QA)  
> **Philosophy:** Test critical paths now, automate later

---

## ⚠️ TESTING REALITY CHECK

### Current State: NO AUTOMATED TESTS
- No unit tests
- No integration tests
- No E2E tests
- No CI/CD test pipeline

### Why This Is OK (For Now)
1. **Time constraint** - Ship first, test second
2. **Changing codebase** - Tests would need constant updates
3. **Manual QA suffices** - For initial launch
4. **Post-launch priority** - Add tests once stable

### What We MUST Do
- ✅ Thorough manual QA of critical paths
- ✅ Cross-browser testing
- ✅ Mobile responsiveness check
- ✅ Error handling verification

---

## 🔴 CRITICAL PATH TESTING

### Test 1: Authentication Flow

#### Sign Up (EN + BG)
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Go to `/signup` | See registration form | |
| 2 | Leave all fields empty, submit | See validation errors | |
| 3 | Enter invalid email | See email error | |
| 4 | Enter weak password | See password requirements | |
| 5 | Enter valid data, submit | See success message | |
| 6 | Check email | Receive verification email | |
| 7 | Click verification link | Redirect to login | |
| 8 | Repeat in Bulgarian locale | Same flow works | |

#### Sign In
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Go to `/login` | See login form | |
| 2 | Enter wrong password | See error message | |
| 3 | Enter correct credentials | Redirect to homepage | |
| 4 | Check navbar | See username/avatar | |
| 5 | Refresh page | Stay logged in | |

#### Sign Out
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Click profile menu | See dropdown | |
| 2 | Click "Sign Out" | Redirect to homepage | |
| 3 | Check navbar | See "Sign In" button | |
| 4 | Try `/account` | Redirect to login | |

---

### Test 2: Product Browsing

#### Homepage
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Go to homepage | See hero, categories, products | |
| 2 | Scroll down | See featured sections | |
| 3 | Click category | Navigate to category page | |
| 4 | Click product | Navigate to product page | |
| 5 | Test on mobile | Responsive layout | |

#### Category Page
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Go to `/category/[slug]` | See products grid | |
| 2 | Apply filters | Products filter correctly | |
| 3 | Change sort order | Products re-order | |
| 4 | Click pagination | Load more products | |
| 5 | Click product | Navigate to product page | |

#### Product Page
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Go to product page | See full product details | |
| 2 | View images | Gallery works, zoom works | |
| 3 | See price | Correct format (BGN/EUR) | |
| 4 | See seller info | Name, rating, badges | |
| 5 | Click "Add to Cart" | Item added, toast shown | |
| 6 | Click seller name | Go to seller profile | |

---

### Test 3: Search

| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Click search icon | Search modal opens | |
| 2 | Type product name | See suggestions | |
| 3 | Press Enter | See search results | |
| 4 | Apply category filter | Results filtered | |
| 5 | Search non-existent | See "No results" message | |
| 6 | Clear search | Reset to default | |

---

### Test 4: Cart Flow

| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Add product to cart | Cart icon shows count | |
| 2 | Add same product again | Quantity increases | |
| 3 | Click cart icon | See cart drawer/page | |
| 4 | Update quantity | Price updates | |
| 5 | Remove item | Item removed | |
| 6 | Close browser, reopen | Cart persists (localStorage) | |

---

### Test 5: Checkout Flow (STRIPE TEST MODE)

⚠️ **Use Stripe test cards:** https://stripe.com/docs/testing

| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Add items to cart | Cart has items | |
| 2 | Click "Checkout" | See checkout page | |
| 3 | Guest checkout | Works without login | |
| 4 | Logged in checkout | Prefills user info | |
| 5 | Enter shipping address | Form validates | |
| 6 | Continue to payment | Redirect to Stripe | |
| 7 | Use test card `4242...` | Payment succeeds | |
| 8 | See success page | Order confirmation shown | |
| 9 | Check order in account | Order appears in history | |

**Test Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

### Test 6: Sell Flow (Seller Account)

#### Create Store
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Log in as user | User authenticated | |
| 2 | Go to `/sell` | See seller onboarding | |
| 3 | Create store name | Name validated | |
| 4 | Complete onboarding | Store created | |
| 5 | See seller dashboard | Dashboard loads | |

#### List Product
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Click "Sell Item" | See listing form | |
| 2 | Select category | Attributes load | |
| 3 | Upload photos | Photos uploaded to Supabase | |
| 4 | Fill all details | Form validates | |
| 5 | Set price | Currency correct | |
| 6 | Submit listing | Product created | |
| 7 | View listing | Product page shows | |

---

### Test 7: Messaging/Chat

| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Go to product page | See "Contact Seller" | |
| 2 | Click contact | Chat opens | |
| 3 | Send message | Message sent | |
| 4 | See conversation | In chat inbox | |
| 5 | Reply to message | Message delivered | |

---

### Test 8: Account Management

| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Go to `/account` | See account dashboard | |
| 2 | Edit profile | Changes save | |
| 3 | View orders | Order history shows | |
| 4 | View wishlist | Wishlist items show | |
| 5 | Change password | Password updates | |

---

## 🌐 CROSS-BROWSER TESTING

### Browsers to Test
| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✓ Test | ✓ Test |
| Firefox | ✓ Test | ✓ Test |
| Safari | ✓ Test | ✓ Test (iOS) |
| Edge | ✓ Test | - |

### Focus Areas
- [ ] CSS rendering (Tailwind v4)
- [ ] JavaScript functionality
- [ ] Form submissions
- [ ] Stripe payment flow
- [ ] Image loading

---

## 📱 MOBILE RESPONSIVENESS

### Breakpoints to Test
| Breakpoint | Width | Device |
|------------|-------|--------|
| xs | 320px | iPhone SE |
| sm | 375px | iPhone 12 |
| md | 768px | iPad |
| lg | 1024px | iPad Pro |
| xl | 1280px+ | Desktop |

### Mobile-Specific Tests
- [ ] Navigation menu (hamburger)
- [ ] Search modal
- [ ] Product gallery touch/swipe
- [ ] Cart drawer
- [ ] Checkout on mobile
- [ ] Footer links

---

## ⚠️ ERROR HANDLING VERIFICATION

### Test Error Boundaries
| Scenario | Expected Behavior | ✓ |
|----------|-------------------|---|
| Navigate to `/nonexistent` | See 404 page | |
| API returns error | Graceful error message | |
| Network disconnected | Show offline state | |
| Form submission fails | Show error toast | |
| Payment fails | Show payment error | |

### Force Error Tests
```typescript
// Temporarily add to test error boundaries
throw new Error('Test error boundary');
```

- [ ] Global error boundary works
- [ ] Per-route error boundaries work
- [ ] API error responses are user-friendly

---

## 🌍 INTERNATIONALIZATION (i18n)

### Language Switching
| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Go to homepage (EN) | English content | |
| 2 | Switch to Bulgarian | All text translates | |
| 3 | Navigate pages | Language persists | |
| 4 | Reload page | Language persists | |
| 5 | Check forms | Labels translated | |
| 6 | Check errors | Error messages translated | |

### Pages to Check in Both Languages
- [ ] Homepage
- [ ] Product page
- [ ] Checkout
- [ ] Account pages
- [ ] Auth pages (login, signup)
- [ ] 404 page

---

## 📋 QA SESSION TEMPLATE

```markdown
## QA Session: [Date]
**Tester:** [Name]
**Browser:** [Browser/Version]
**Device:** [Desktop/Mobile]
**Locale:** [EN/BG]

### Critical Paths
- [ ] Sign up: PASS/FAIL
- [ ] Sign in: PASS/FAIL
- [ ] Browse products: PASS/FAIL
- [ ] Search: PASS/FAIL
- [ ] Add to cart: PASS/FAIL
- [ ] Checkout (test mode): PASS/FAIL
- [ ] Create listing: PASS/FAIL
- [ ] Messaging: PASS/FAIL

### Issues Found
1. [Issue description] - [Severity: Low/Medium/High]
2. ...

### Screenshots
[Attach any relevant screenshots]
```

---

## ✅ TESTING CHECKLIST SUMMARY

### Must Test (Blockers)
- [ ] Complete auth flow (signup, signin, signout)
- [ ] Complete checkout flow (Stripe test mode)
- [ ] Complete sell flow (list product)
- [ ] Error pages (404, 500)

### Should Test (High Priority)
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness
- [ ] Both languages (EN, BG)
- [ ] Search functionality

### Nice to Test (If Time)
- [ ] Edge cases (empty cart, no results)
- [ ] Slow network simulation
- [ ] Accessibility (keyboard navigation)

---

## 🏁 PHASE 4 COMPLETION CRITERIA

```markdown
✅ Phase 4 Complete When:

1. [ ] All critical paths tested and working
2. [ ] No blocking bugs found
3. [ ] Cross-browser testing passed
4. [ ] Mobile testing passed
5. [ ] Both languages tested
6. [ ] Error handling verified

Blocking Issues Found: [List any]
Non-Blocking Issues Found: [List any]
```

---

## 🔮 POST-LAUNCH TEST AUTOMATION

### Recommended Stack
- **E2E:** Playwright
- **Unit:** Vitest
- **Integration:** Testing Library

### Priority Test Suites
1. Authentication flow
2. Checkout flow
3. Product listing flow
4. Payment webhooks

### Example Playwright Test
```typescript
// tests/checkout.spec.ts
test('complete checkout flow', async ({ page }) => {
  await page.goto('/products/test-product');
  await page.click('button:has-text("Add to Cart")');
  await page.click('button:has-text("Checkout")');
  // ... continue flow
  await expect(page).toHaveURL(/success/);
});
```

---

*QA Strategy: Manual now, automated post-launch*
