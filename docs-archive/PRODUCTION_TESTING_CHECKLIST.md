http://localhost:3000/bg/cart why when i add to cart and try to checkout i get 404 error? 
# Production Testing Checklist

**Date:** _____________  
**Testers:** _____________  
**Devices:** Phone 1: _____________ | Phone 2: _____________

---

## 🔐 Authentication

### Sign Up
- [-] Navigate to sign up page
- [-] Enter valid email
- [-] Enter valid password (meets requirements)
- [-] Submit form successfully
- [-] Receive confirmation email (if enabled)
- [-] Verify email link works -> needs domain update to www.treido.eu
- [-] Error shown for duplicate email
- [-] Error shown for weak password
- [-] Error shown for invalid email format

### Sign In
- [ ] Navigate to sign in page
- [ ] Sign in with valid credentials
- [ ] Redirected to correct page after login
- [ ] Error shown for wrong password
- [ ] Error shown for non-existent email
- [ ] "Forgot password" link works
- [ ] Password reset email received
- [ ] Password reset flow completes

### Session
- [ ] Session persists after page refresh
- [ ] Session persists after closing/reopening app
- [ ] Sign out works correctly
- [ ] Redirected to home after sign out

---

## 🎯 Onboarding

- [ ] Onboarding appears for new users
- [ ] Can navigate through all steps
- [ ] Can skip onboarding (if option exists)
- [ ] Preferences/selections are saved
- [ ] Onboarding doesn't reappear after completion
- [ ] Language selection works (if applicable)
- [ ] Location/region selection works (if applicable)

---

## 🏠 Home & Navigation

- [ ] Home page loads correctly
- [ ] Hero section displays properly
- [ ] Featured products/categories load
- [ ] Navigation menu works
- [ ] Category navigation works
- [ ] Search bar is accessible
- [ ] Footer links work
- [ ] Language switcher works (EN/BG)

---

## 🔍 Search & Browse

- [ ] Search returns relevant results
- [ ] Search with no results shows appropriate message
- [ ] Category filtering works
- [ ] Price filtering works
- [ ] Sort options work (price, date, etc.)
- [ ] Pagination/infinite scroll works
- [ ] Product cards display correctly
- [ ] Product images load

---

## 📦 Product Details

- [ ] Product page loads correctly
- [-] All product images display
- [ ] Image gallery/carousel works
- [ ] Price displays correctly
- [ ] Description renders properly
- [ ] Seller info displays
- [ ] "Add to cart" button works
- [ ] Quantity selector works (if applicable)
- [ ] Related products display

---

## 🛒 Cart & Checkout

### Cart
- [ ] Add item to cart
- [ ] Cart badge updates
- [ ] View cart page
- [ ] Update quantity in cart
- [ ] Remove item from cart
- [ ] Cart persists after page refresh
- [ ] Cart total calculates correctly

### Checkout (Stripe)
- [ ] Proceed to checkout
- [ ] Shipping address form works
- [ ] Stripe payment form loads
- [ ] Test card accepted: `4242 4242 4242 4242`
- [ ] Expiry: Any future date (e.g., `12/34`)
- [ ] CVC: Any 3 digits (e.g., `123`)
- [ ] Payment processes successfully
- [ ] Order confirmation page displays
- [ ] Confirmation email received (if enabled)
- [ ] Error handling for declined card: `4000 0000 0000 0002`

---

## 💰 Seller - Create Listing (/sell)

### Access
- [ ] Navigate to /sell page
- [ ] Redirected to login if not authenticated
- [ ] Page loads for authenticated users

### Listing Form
- [ ] Category selection works
- [ ] Subcategory selection works
- [ ] Title field accepts input
- [ ] Description field works
- [ ] Price input works
- [ ] Currency selection works (if applicable)
- [ ] Image upload works
- [ ] Multiple images can be uploaded
- [ ] Image preview displays
- [ ] Image can be removed
- [ ] Condition selector works
- [ ] Location/shipping options work
- [ ] All required fields validated
- [ ] Error messages display for invalid input
- [ ] Form submits successfully
- [ ] Redirected to listing page after creation
- [ ] Listing appears in search/browse

### Edit Listing
- [ ] Can access edit page for own listing
- [ ] Existing data pre-populated
- [ ] Can update all fields
- [ ] Changes save correctly

### Delete Listing
- [ ] Can delete own listing
- [ ] Confirmation prompt appears
- [ ] Listing removed after deletion

---

## 👤 User Profile & Account

- [ ] Profile page loads
- [ ] Can view own listings
- [ ] Can view order history
- [ ] Can update profile info
- [ ] Can change password
- [ ] Avatar upload works (if applicable)
- [ ] Settings page works

---

## 📱 Mobile Responsiveness

- [ ] All pages render correctly on mobile
- [ ] Touch targets are appropriately sized
- [ ] Navigation menu (hamburger) works
- [ ] Forms are usable on mobile
- [ ] Images scale correctly
- [ ] No horizontal scroll issues
- [ ] Modals/dialogs work on mobile

---

## 🌐 Internationalization (i18n)

- [ ] Can switch to Bulgarian (BG)
- [ ] All UI text translates
- [ ] Prices show correct currency format
- [ ] Can switch back to English (EN)
- [ ] Language preference persists

---

## ⚠️ Error Handling

- [ ] 404 page displays for invalid routes
- [ ] Network error messages display appropriately
- [ ] Form validation errors are clear
- [ ] No console errors on main flows

---

## 🚀 Performance

- [ ] Pages load within acceptable time
- [ ] Images load/lazy-load properly
- [ ] No visible layout shifts
- [ ] Smooth scrolling
- [ ] No freezing during interactions

---

## Stripe Test Cards Reference

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 3220` | 3D Secure required |

**For all test cards:**
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## Notes & Issues Found

```
1. 

2. 

3. 

4. 

5. 

```

---

## Summary

| Area | Status | Notes |
|------|--------|-------|
| Auth - Sign Up | ⬜ | |
| Auth - Sign In | ⬜ | |
| Onboarding | ⬜ | |
| Home/Navigation | ⬜ | |
| Search/Browse | ⬜ | |
| Product Details | ⬜ | |
| Cart | ⬜ | |
| Checkout/Stripe | ⬜ | |
| Seller - Create | ⬜ | |
| Profile/Account | ⬜ | |
| Mobile | ⬜ | |
| i18n | ⬜ | |

**Legend:** ⬜ Not Tested | ✅ Pass | ❌ Fail | ⚠️ Issues

---

*Last updated: January 2026*
