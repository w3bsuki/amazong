# UI/UX Decisions Log

**Status:** Finalized  
**Date:** February 1, 2026

All decisions made during planning phase. These are **locked** unless explicitly revisited.

---

## 🎯 Core Decisions

### 1. Business Model

| Decision | Choice | Notes |
|----------|--------|-------|
| Business account | **Free identity** | Users choose Personal/Business during onboarding |
| Business dashboard | **Freemium** | Basic stats free, CSV/analytics/advanced = premium |
| Account type switching | **One-way easy** | Personal → Business free, reverse needs support |
| Dashboard access | **Premium feature** | `/dashboard` requires Business Premium subscription |

### 2. Onboarding

| Decision | Choice | Notes |
|----------|--------|-------|
| Trigger | **Always on first login** | Every new user sees onboarding screens |
| Account type in signup | **Remove** | Move to onboarding Step 1 |
| Username changes | **1 free change, premium unlimited** | Clear limit shown during selection |
| Business → Personal | **Requires support** | One-way easy (upgrade free, downgrade needs help) |
| Views tracking | **Daily aggregates** | Real tracking, no PII (viewer_id) |

### 3. Landing Page

| Decision | Choice | Notes |
|----------|--------|-------|
| Default view | **Grid (product-first)** | Traditional e-commerce, seller feed optional |
| Category navigation | **Circle → Drawer** | Tap circle opens drawer with subcats + AI |
| Quick pills | **Remove from landing** | Move subcategories into drawer |

### 4. Navigation

| Decision | Choice | Notes |
|----------|--------|-------|
| Bottom nav items | **5 tabs** | Home, Search, Sell, Chat, Profile |
| Sell button | **Prominent center** | Elevated, brand color, always visible |
| Chat access | **Both** | Bottom nav tab + contextual buttons |
| Drawer behavior | **URL-driven** | Deep links work, back button closes |

### 5. AI Search

| Decision | Choice | Notes |
|----------|--------|-------|
| Placement | **In main search** | Single search bar with AI toggle/mode |
| AI indicator | Sparkle/robot icon | Subtle but visible |

### 6. Premium Features (Business)

**Included in Business Premium:**
- Dashboard analytics (charts, trends)
- CSV export/import
- Unlimited username changes
- Priority support
- Advanced product management

**NOT included (free for all business):**
- Basic stats (views, messages)
- Product listing
- Chat access
- Store page

---

## 📝 Decision Rationale

### Why Grid Default (not Feed)?
- New/anonymous users are **shopping**, not following sellers
- Marketplace supply might be sparse initially
- Feed requires relationship (follows) to feel valuable
- Can switch to feed once user has interactions

### Why Circle → Drawer (not Pills)?
- Instagram-familiar pattern
- No layout shift on tap
- More room in drawer for AI search, subcategories, trending
- Cleaner landing page

### Why URL-driven Drawers?
- Users can share `/search?category=fashion`
- Back button works naturally
- Better for SEO (searchable states)
- Power users can bookmark

### Why Freemium Dashboard?
- Lower barrier to try business features
- Upgrades happen when users see value
- Prevents "empty dashboard" complaint
- Matches competitor patterns (Shopify, Etsy)

---

## 🔒 Locked Decisions (Do Not Change Without Review)

1. ✅ Business is free identity choice
2. ✅ Onboarding always triggers on first login
3. ✅ Grid view is default
4. ✅ 5-tab bottom navigation
5. ✅ AI search integrated in main search
6. ✅ Circle → Drawer for categories
7. ✅ URL-driven drawers for shareability

---

## 📅 Review Schedule

- **Week 2:** Validate onboarding decisions after implementation
- **Week 4:** Review feed vs grid after user testing
- **Week 6:** Review premium feature boundaries after launch
