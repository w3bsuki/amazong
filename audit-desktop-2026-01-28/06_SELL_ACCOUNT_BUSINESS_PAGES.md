# Sell, Account & Business Pages Audit

**Date:** January 28, 2026  
**Viewport:** 1920x1080

---

## Sell Page (/en/sell)

**Title:** Treido  
**Screenshot:** sell_form.png

### Page Structure

#### Header
- Logo link to /en ✅
- Minimal header (focused sell flow) ✅

#### Form - Step 1: "What are you selling?"
- H2: "What are you selling?" ✅
- Subtitle: "Give your item a name and add a photo" ✅

#### Form Fields
| Field | Type | Placeholder | Validation |
|-------|------|-------------|------------|
| Title * | textbox | e.g., iPhone 15 Pro Max 256GB | 0/80 char counter |

#### Photo Upload
- Description: "Add up to 8 photos. First image is the cover." ✅
- Counter: "0/8" ✅
- Upload button: "Choose File" ✅
- Accept: JPG, PNG or WebP up to 10MB ✅
- Remaining: "Up to 8 more" ✅

#### Actions
- Continue button ✅

### UX Analysis
✅ Clean, focused wizard-style form
✅ Clear character limit indicator
✅ File type and size limits shown
✅ Step-by-step flow (multi-step form)
⚠️ No breadcrumb or step indicator visible
⚠️ Title field required indicator (*) but not visually emphasized

---

## Account Overview (/en/account)

**Title:** Treido  
**Screenshot:** account_overview.png

### Page Structure

#### Top Bar
- Toggle sidebar button ✅
- "Account Overview" title ✅
- "Back to Store" link → /en ✅

#### Navigation Sidebar (Bottom on mobile)
| Tab | Destination | Icon |
|-----|-------------|------|
| Account | /en/account | ✅ |
| Orders | /en/account/orders | ✅ |
| Selling | /en/account/selling | ✅ |
| Plans | /en/account/plans | ✅ |
| Store | /en | ✅ |

### UX Analysis
✅ Clear navigation structure
✅ Quick access to key account areas
✅ Back to store link prominent
⚠️ Main content area sparse in snapshot
⚠️ "Account Overview" not showing detailed content

---

## Business Dashboard (/en/dashboard)

**Title:** Treido  
**Screenshot:** business_dashboard.png

### Page Structure

#### Top Bar
- Toggle sidebar button ✅
- H1: "Home" ✅
- "Verified" badge ✅
- "Upgrade to unlock" link → /en/dashboard/upgrade ✅

#### Quick Actions
| Action | Destination |
|--------|-------------|
| Add product | /en/dashboard/products?add=true |
| View store | / |
| Notifications (2) | button |

### UX Analysis
✅ Clean dashboard header
✅ Quick add product CTA
✅ Verification status visible
✅ Upgrade upsell visible
⚠️ Dashboard content area not fully visible in snapshot

### Console Errors
⚠️ "Error fetching server cart" - RPC unavailable

---

## Plans Page (/en/plans)

**Title:** Treido  
**Screenshot:** plans_page.png

### Page Structure

#### Header
- Logo with "treido." link to /en ✅

#### Page Header
- H1: "Plans & Pricing" ✅
- Subtitle: "Choose the plan that fits your selling goals." ✅

#### Plan Type Toggle
| Option | State |
|--------|-------|
| Personal | Button |
| Business | Button |

#### Billing Toggle
- Monthly / Yearly switch ✅

### Pricing Cards

| Plan | Price | Seller Fee | Buyer Protection | Listings | Boosts |
|------|-------|------------|------------------|----------|--------|
| Free | Free | 0% | 4% + €0.50 | 30/mo | 0 |
| Plus (Popular) | €4.99/mo | 0% | 3.5% + €0.40 | 150/mo | 2/mo |
| Pro | €9.99/mo | 0% | 3% + €0.30 | 500/mo | 5/mo |

### Plan Card Features

#### Free Plan
- 30 listings/mo
- 0% when sold
- 4% + €0.50 buyer protection
- "Get Started" CTA

#### Plus Plan (Popular badge)
- 150 listings/mo
- 0% when sold
- 3.5% + €0.40 buyer protection
- 2 boosts/mo
- Analytics
- "Get Started" CTA

#### Pro Plan
- 500 listings/mo
- 0% when sold
- 3% + €0.30 buyer protection
- 5 boosts/mo
- Analytics
- "Get Started" CTA

### Feature Section
- H2: "Everything you need to sell" ✅
- Feature cards:
  - Lower fees
  - More visibility
  - Better tools

### Comparison Table
- Full table with all plan features ✅
- Columns: Plan, Price, Seller fee, Buyer protection, Listings, Boosts, Support

### Trust Badge
- "Buyer Protection included" ✅
- Description: "Every purchase is covered with buyer protection for peace of mind."

### FAQ Section (Accordion)
| Question | Status |
|----------|--------|
| Can I cancel anytime? | Collapsed |
| Do plans apply to all listings? | Collapsed |
| What happens if I downgrade? | Collapsed |

### Footer
- © 2025 Treido (Note: year discrepancy - should be 2026?)
- Terms of Service → /en/terms
- Privacy Policy → /en/privacy
- Contact Us → /en/contact

### UX Analysis

#### Strengths
✅ Clear pricing tiers
✅ "Popular" badge on Plus plan (recommendation)
✅ 0% seller fee highlighted
✅ Comparison table for easy comparison
✅ Trust badge (Buyer Protection)
✅ FAQ section for objection handling
✅ Monthly/Yearly toggle

#### Areas for Improvement
⚠️ Year in footer is 2025 (should be 2026)
⚠️ Business toggle visible but plan variations not shown
⚠️ No price breakdown for yearly savings
⚠️ Support column in table shows "—" for some plans (unclear)

---

## Customer Service Page (/en/customer-service)

**Title:** Customer Service | Treido  
**Screenshot:** customer_service.png

### Page Structure

#### Header
- Full navigation header ✅
- Menu, Logo, Notifications, Wishlist, Cart ✅
- Search button ✅

#### Breadcrumb
- Treido → Customer Service ✅

#### Main Content
- H1: "Welcome to Treido Customer Service" ✅

#### Help Categories (H2: "What would you like help with today?")
| Category | Icon |
|----------|------|
| A delivery, order or return | ✅ |
| Payment, charges or gift cards | ✅ |
| Address, security & privacy | ✅ |
| Memberships, subscriptions or communications | ✅ |
| Accessibility | ✅ |
| Something else | ✅ |
| Login & password | ✅ |

#### Search Section
- H2: "Search our help library" ✅
- Search input with placeholder: "Type something like, 'question about a charge'" ✅

#### Help Topics (Accordion)
- H2: "All help topics" ✅
- Recommended Topics (expandable)
- Where's my stuff? (expandable)

#### Contact Section
- H3: "Contact Us" ✅
- "Need more help? We're here for you." ✅
- "Start Chatting" button ✅

### Footer
- Full footer with all sections ✅

### UX Analysis

#### Strengths
✅ Organized category navigation
✅ Search functionality
✅ Expandable help topics
✅ Direct chat access
✅ Breadcrumb navigation

#### Areas for Improvement
⚠️ Help categories could show article counts
⚠️ No phone support option visible

---

## Search Results Page (/en/search?q=nike)

**Title:** "nike" - Search Results | Treido  
**Screenshot:** search_results.png

### Page Structure (Partial Snapshot)

#### Header
- Menu button ✅
- Logo (treido.) ✅
- Notifications badge (2) ✅
- Wishlist badge (2) ✅
- Cart badge (9) ✅
- Search button ✅

#### Mobile Bottom Navigation
- Home, Categories, Sell, Chat, Account ✅

### Observations
- Main content area appears empty in snapshot
- Search results may be loading client-side
- Title correctly shows search query

---

## Summary

### Pages Audited Successfully
1. Sell Form - Clean wizard UI ✅
2. Account Overview - Basic navigation ✅
3. Business Dashboard - Seller tools ✅
4. Plans Page - Comprehensive pricing ✅
5. Customer Service - Help center ✅
6. Search Results - Needs more testing ⚠️

### Common Patterns
- Consistent header across pages
- Mobile navigation present
- Footer standardized
- Skip links for accessibility

### Technical Issues Observed
- Cart sync errors (RPC unavailable)
- Some pages load client-side (sparse initial snapshots)
- Footer year discrepancy (2025 vs 2026)
