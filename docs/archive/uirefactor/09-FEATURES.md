# Current Features Inventory

**Status:** Reference Document  
**Last Updated:** February 2026

A complete list of existing features and their current state.

---

## 🛒 Core Marketplace

### Product Listings
| Feature | Status | Location |
|---------|--------|----------|
| Create listing | ✅ Done | `/[locale]/sell` |
| Edit listing (account) | ✅ Done | `/[locale]/(account)/account/selling/[id]/edit` |
| Edit listing (dashboard) | ✅ Done | `/[locale]/(business)/dashboard/products/[productId]/edit` |
| Product page | ✅ Done | `/[locale]/[username]/[productSlug]` |
| Product images | ✅ Done | Multiple upload, gallery |
| Product categories | ✅ Done | Hierarchical |
| Product conditions | ✅ Done | New, Like New, Good, Fair |
| Pricing | ✅ Done | Multi-currency support |

### Search & Discovery
| Feature | Status | Location |
|---------|--------|----------|
| Text search | ✅ Done | Header search bar |
| Category browse | ✅ Done | Category pages |
| Filters | ✅ Done | Price, condition, location |
| AI search | ✅ Done | `components/shared/search/search-ai-chat.tsx` |
| Mobile search overlay | ✅ Done | `components/shared/search/mobile-search-overlay.tsx` |

### User Profiles
| Feature | Status | Location |
|---------|--------|----------|
| Personal profiles | ✅ Done | `/[locale]/[username]` |
| Business profiles | ✅ Done | Same route, different display |
| Avatar upload | ✅ Done | Profile settings |
| Location | ✅ Done | City-level |
| Ratings/reviews | ✅ Done | Seller page |
| Seller badges | 🏗️ Partial | `use-badges.ts` hook exists |

---

## 💬 Communication

### Chat
| Feature | Status | Location |
|---------|--------|----------|
| 1:1 messaging | ✅ Done | `/[locale]/chat` |
| Product context | ✅ Done | Chat shows product being discussed |
| Real-time updates | ✅ Done | Supabase realtime |
| Unread indicators | ✅ Done | Badge in nav |

### Notifications
| Feature | Status | Notes |
|---------|--------|-------|
| In-app notifications | 🏗️ Partial | Basic implementation |
| Email notifications | ✅ Done | Transactional emails |
| Push notifications | ❌ Not started | Post-launch |

---

## 💳 Payments & Checkout

### Stripe Integration
| Feature | Status | Notes |
|---------|--------|-------|
| Stripe Checkout | ✅ Done | Buyer payments |
| Stripe Connect | ✅ Done | Seller payouts |
| Buyer Protection fee | ✅ Done | Calculated at checkout |
| Multi-currency | ✅ Done | EUR, BGN, etc. |

### Orders
| Feature | Status | Location |
|---------|--------|----------|
| Order creation | ✅ Done | Post-checkout |
| Order status | ✅ Done | Pending, Shipped, Delivered, etc. |
| Order history | ✅ Done | `/[locale]/orders` |
| Shipping tracking | 🏗️ Partial | Manual entry |

---

## 🔐 Authentication

### Auth Methods
| Feature | Status | Notes |
|---------|--------|-------|
| Email/password | ✅ Done | Supabase Auth |
| Google OAuth | ✅ Done | Social login |
| Apple OAuth | ✅ Done | Social login |
| Facebook OAuth | ✅ Done | Social login |

### Session Management
| Feature | Status | Notes |
|---------|--------|-------|
| Proxy routing | ✅ Done | `proxy.ts` (Next.js 16) |
| Session refresh | ✅ Done | `lib/supabase/middleware.ts` |
| Geo-detection | ✅ Done | Via proxy cookies |

---

## 📱 Mobile Experience

### Components
| Feature | Status | Location |
|---------|--------|----------|
| Bottom navigation | ✅ Done | `components/mobile/` |
| Category circles | ✅ Done | `components/mobile/category-nav/` |
| Category drawer | ✅ Done | Vaul-based |
| Product card | ✅ Done | `components/shared/` |
| Swipeable gallery | ✅ Done | Product page |

### Current Mobile Nav
```
Home | Обяви | [Sell] | Chat | Profile
```
**Planned change:** Обяви → Search

---

## 🏪 Seller Features

### Basic (All Sellers)
| Feature | Status | Notes |
|---------|--------|-------|
| Create listings | ✅ Done | Unlimited |
| Manage listings | ✅ Done | Edit, delete, pause |
| View messages | ✅ Done | Full chat access |
| Basic stats | 🏗️ Partial | Views on listings |
| Store page | ✅ Done | Public profile |

### Business Features
| Feature | Status | Notes |
|---------|--------|-------|
| Business profile fields | ✅ Done | VAT, website in `private_profiles` |
| Business badge | ✅ Done | Shown on profile |
| Dashboard | ✅ Exists | `app/[locale]/(business)/dashboard/` (needs enhancement) |
| CSV export | ❌ Not built | **Premium feature planned** |
| Analytics | ❌ Not built | **Premium feature planned** |
| Bulk actions | ❌ Not built | **Premium feature planned** |

---

## 🚀 Boosts & Promotions

| Feature | Status | Notes |
|---------|--------|-------|
| Listing boosts | ✅ Done | Paid promotion |
| Promo sections | ✅ Done | Landing page featured |
| Boost checkout | ✅ Done | Stripe payment |

---

## 🌐 Internationalization

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-language | ✅ Done | BG, EN (via next-intl) |
| Multi-currency | ✅ Done | EUR, BGN, USD |
| Locale routing | ✅ Done | `/bg/`, `/en/` |
| RTL support | ❌ Not needed | No RTL languages planned |

---

## 🛡️ Trust & Safety

| Feature | Status | Notes |
|---------|--------|-------|
| Report listing | ✅ Done | User reports |
| Block user | ✅ Done | Block from chat/purchase |
| Prohibited items | ✅ Done | Category restrictions |
| Buyer Protection | ✅ Done | Dispute flow |

---

## ❌ Features NOT in V1

- Cash on Delivery (COD)
- Off-platform payments
- Community forums
- Live streaming
- Auctions (fixed price only)
- Multi-vendor cart (single seller per order)

---

## 🔄 Features Needing Refactor

| Feature | Issue | Priority |
|---------|-------|----------|
| Onboarding | Account type in wrong place | P0 |
| Category nav | Pills instead of drawers | P1 |
| Bottom nav labels | "Обяви" unclear | P1 |
| AI search | Not prominent enough | P1 |
| Seller feed | Doesn't exist (grid only) | P2 |
| Business dashboard | Exists but needs enhancement (CSV, analytics) | P1 |
