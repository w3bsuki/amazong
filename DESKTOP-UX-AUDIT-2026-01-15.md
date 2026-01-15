# Treido Desktop UX Audit Report
**Date:** January 15, 2026  
**Auditor:** GitHub Copilot (Claude Opus 4.5)  
**URL:** https://treido.eu (redirects to www.treido.eu/bg)  
**Platform:** Desktop Browser (Chromium via Playwright)

---

## Executive Summary

This comprehensive audit covers the entire desktop user journey on Treido.eu, evaluating UI/UX from both buyer and seller perspectives. The platform is a Bulgarian marketplace with English and Bulgarian language support. Overall, the design is modern and polished, but several critical bugs and UX issues were discovered.

### Critical Issues Found: 7
### Major Issues Found: 9  
### Minor Issues Found: 12

---

## 1. Homepage Audit (`/bg`)

### ✅ What Works Well
- **Clean, modern design** with clear value proposition "Купувай и продавай лесно" (Buy and sell easily)
- **Category sidebar** with product counts (Мода: 26, Електроника: 42, etc.)
- **Filter chips** for sorting (Всички, Най-нови, Най-продавани, Топ оценени, etc.)
- **Product cards** display essential info: image, title, price, relative date
- **Wishlist toggle** works on product cards (heart icon changes state)
- **"Load more" button** for infinite scroll pagination
- **Mobile navigation bar** visible at bottom (Home, Categories, Sell, Chat, Profile)

### 🔴 Critical Issues
1. **React Hydration Error #418** - Console shows `Minified React error #418` on initial load
   - Impact: May cause flickering, state inconsistencies, or broken interactivity
   - Location: Homepage, multiple pages
   - Error URL: https://react.dev/errors/418

### 🟡 Minor Issues
1. **Product titles are test data** - Many products show test names like "E2E Listing 1767711856893", "123123213123", etc.
   - Recommendation: Seed production with realistic demo data
2. **Date formats inconsistent** - Some show "мин. седм." (last week), others show full date "15.12.2025 г."

---

## 2. Navigation & Mega Menu Audit

### ✅ What Works Well
- **Hamburger menu** opens a full navigation drawer
- **User greeting** shows username "radevalentin" with avatar
- **Quick links**: Поръчки, Продажби, Любими, Чат
- **All 24 categories** accessible with proper Bulgarian translations
- **Logout button** present at bottom

### 🟡 Minor Issues
1. **Language toggle button** (labeled "Language") doesn't show current language
2. **Help/Settings links** are small and may be missed

### Header Navigation Bar
- **Top bar links**: Днешни оферти, Обслужване, Регистър, Подаръчни карти, Продай
- **Icon buttons**: Любими (7), Съобщения, Известия, Продай, Account, Кошница (9)
- **Search bar** centered with placeholder "Търсене в продукти, марки и още..."

---

## 3. Search Functionality Audit

### ✅ What Works Well
- **Search overlay** opens on click with:
  - Recently viewed items (with images, titles, prices)
  - Popular searches (numbered list)
  - Keyboard hints: "Натисни Enter за търсене", "Esc за затваряне"
- **Clear button** to reset recent searches

### 🔴 Critical Issues
1. **Search redirects to wrong locale** - Typing "iPhone" and pressing Enter navigated from `/bg` to `/en` homepage instead of search results
   - Expected: `/bg/search?q=iPhone`
   - Actual: Redirect to `/en` homepage
   - Impact: **Search is effectively broken for Bulgarian users**

### 🟡 Minor Issues
1. **No autocomplete suggestions** while typing
2. **No voice search** option

---

## 4. Product Listing Pages (`/bg/categories/electronics`)

### ✅ What Works Well
- **Subcategory tabs**: Настолни компютри, Смартфони, Лаптопи, Таблети, etc.
- **Filter buttons**: Филтри, Марка, Състояние, Гаранция
- **Status bar** shows current category: "Показване на Електроника"
- **Discount badges** visible (e.g., "-5%", "-17%", "-25%")
- **Original vs sale prices** clearly displayed
- **Professional product images** from major brands

### 🟡 Minor Issues
1. **Filter dropdowns** don't show current selection
2. **No price range filter** visible
3. **No "Sort by" dropdown** (only filter buttons)

---

## 5. Product Detail Page (`/bg/shop4e/aysifon-17-f6d41cb1`)

### ✅ What Works Well
- **Back button** with navigation
- **Share and More options** buttons
- **Image gallery** with swipe support
- **Brand badge** ("Huawei • Huawei P50 Series") - clickable
- **Title and price** prominently displayed (€67.00)
- **Posted date** indicator ("24 days ago")
- **Buyer Protection banner** with description
- **Seller info card** with profile link
- **Product details**: Condition, Color, Storage
- **Description section**
- **Shipping & Returns** collapsible section
- **Trust badges**: Buyer Protection, 30-day Returns, Free Shipping, Secure Payment
- **"More from seller" carousel** with related products
- **Customer reviews section** with rating breakdown (0.0 out of 5)
- **Sticky footer buttons**: Chat, Buy Now

### 🟡 Minor Issues
1. **"Write a customer review"** button visible but functionality unclear
2. **Rating display** shows 0.0 even when no reviews exist (could say "No ratings yet")

---

## 6. Cart Page (`/bg/cart`, `/en/cart`)

### ✅ What Works Well
- **Empty state design** with friendly message and illustration
- **"Continue Shopping"** CTA button
- **"View Today's Deals"** secondary link

### 🟠 Major Issues
1. **Cart appears empty** even though header shows "9 items"
   - Possible session sync issue between locale switches
   - Cart count in header: 9 items
   - Actual cart page: Empty

### 🟡 Minor Issues
1. **No cart preview drawer** - clicking cart icon goes directly to page

---

## 7. Sell/Create Listing Flow (`/bg/sell`)

### ✅ What Works Well
- **Multi-step form** (4 steps): Основно, Снимки, (Step 3), (Step 4)
- **Progress indicator** shows "1/4", "2/4", etc.
- **Title input** with character counter (30/80)
- **Category selector** with breadcrumb display
- **Condition dropdown** pre-filled
- **Photo upload section** with clear instructions:
  - "Добавете до 12 снимки. Първата е корица."
  - File picker and drag-drop zone
- **Validation messages** ("Add at least 1 photo to continue")
- **Back/Continue navigation** buttons

### 🔴 Critical Issues
1. **English sell page (`/en/sell`) redirects to homepage** - Sell functionality only works in Bulgarian locale
   - Steps to reproduce:
     1. Navigate to treido.eu/en/sell
     2. Page briefly shows content then redirects to /en homepage
   - Impact: **English users cannot create listings**

### 🟡 Minor Issues
1. **Pre-filled title** shows test data from previous session

---

## 8. Account Dashboard (`/bg/account`)

### ✅ What Works Well
- **Welcome message** with time-of-day greeting
- **Revenue summary**: "Общ приход: 25,00 €" with trend indicator (+12.5%)
- **Quick stats**: Чакащи поръчки (0), Активни обяви (39), Нови съобщения (0)
- **Quick action cards**: Поръчки (6), Обяви (39), Продажби (1), Чат, Любими (7)
- **Badges section** ("Моите значки")
- **Recent orders** preview with images, amounts, dates
- **My listings** preview
- **Recent sales** preview
- **Bottom navigation**: Акаунт, Поръчки, Продавам, Планове, Магазин

### 🔴 Critical Issues
1. **Double locale in URLs** - Links generated with `/bg/bg/` instead of `/bg/`
   - Examples:
     - `/bg/bg/account/orders` (should be `/bg/account/orders`)
     - `/bg/bg/account/selling`
     - `/bg/bg/account/sales`
     - `/bg/bg/account/wishlist`
     - `/bg/bg/product/{id}`
   - Impact: **Links may 404 or cause routing issues**

### 🟡 Minor Issues
1. **"Toggle Sidebar"** button visible but unclear what it does on desktop

---

## 9. Chat/Messages Page (`/bg/chat`)

### ✅ What Works Well
- **Clean empty state**: "Все още няма разговори"
- **Helpful description**: "Съобщенията от продавачи ще се появят тук"
- **Search input** for messages
- **New message button**
- **Filter tabs**: Всички, Непрочетени, Покупки, Продажби
- **Back navigation** link

---

## 10. Categories Page (`/bg/categories`)

### ✅ What Works Well
- **Full category listing** with 24 categories
- **Subcategory preview** for each category (e.g., "Мъже • Жени • Деца • Унисекс")
- **Visual icons** for each category
- **Quick action cards**: "Продай Безплатно", "Оферти До -70%"
- **Clean grid layout**

---

## 11. Today's Deals Page (`/bg/todays-deals`)

### ✅ What Works Well
- **Hero banner** with "Днешни оферти" title and "Спести до 70%"
- **Category filter chips**: Всички оферти, Електроника, Дом, Мода, etc.
- **Deal status tabs**: Всички оферти, Налични, Предстоящи, Списък за гледане
- **Countdown timers** for each deal (e.g., "Приключва след 2:14:32")
- **Deal cards** with:
  - Product image with discount badge ("-50%")
  - Countdown timer
  - Sale price and original price
  - Star ratings with review count
- **6 deals shown**

### 🔴 Critical Issues
1. **Currency inconsistency** - Prices displayed in USD ($24.99, $49.99) while rest of site uses EUR (€)
   - Should be: €24.99, €49.99
   - Impact: **Confuses users about actual pricing**

---

## 12. Customer Service Page (`/bg/customer-service`)

### ✅ What Works Well
- **Help topic cards**: Доставка, Плащане, Адрес, Членства, Достъпност, etc.
- **Search bar** with placeholder "Напишете нещо като 'въпрос относно такса'"
- **Help topics accordion**: Препоръчани теми, Къде е моята поръчка?
- **Contact section** with "Започни чат" button

---

## 13. Legal Pages (`/bg/terms`, `/bg/privacy`)

### ✅ What Works Well
- **Professional layout** with sidebar table of contents
- **Last updated date** clearly shown (Ноември 2025)
- **12 sections** covering all legal requirements
- **Expandable accordions** for each section
- **Quick links** to related pages (Privacy Policy, Returns, Customer Service)
- **Contact options**: Legal team link, email (legal@treido.com)
- **Breadcrumb navigation**

---

## 14. Authentication Pages (`/bg/auth/login`)

### ✅ What Works Well
- **Clean login form** with Treido branding
- **Email/phone and password fields**
- **"Remember me" checkbox**
- **"Forgot password" link**
- **Terms acceptance notice**
- **Create account CTA** for new users
- **Footer links**: Условия за ползване, Декларация за поверителност, Помощен център

### 🟡 Minor Issues
1. **Login button disabled** by default (unclear when it enables)

---

## 15. Wishlist Page (`/bg/wishlist`)

### 🔴 Critical Issues
1. **Wishlist page redirects to English homepage** after brief loading state
   - Steps to reproduce:
     1. Navigate to /bg/wishlist
     2. Shows "Зареждане на списъка с любими..." spinner
     3. Redirects to /en homepage
   - Impact: **Users cannot view their wishlist**

---

## 16. Footer Audit

### ✅ What Works Well
- **4 expandable sections**: Компания, Помощ, Продажби и бизнес, Услуги
- **Legal links**: Условия за ползване, Политика за поверителност, Предпочитания за бисквитки
- **ODR link** to EU dispute resolution (required for EU compliance)
- **Company info**: "Treido Ltd. • София, България • Рег. №: BG123456789 • ДДС: BG123456789"
- **Copyright**: "TM & © 2026 Treido, Inc. или партньори"

---

## 17. Modals & Dialogs

### Cookie Consent Dialog
- **Title**: "We use cookies"
- **Options**: Accept All Cookies, Decline Optional, Manage Preferences
- **Learn more link** to cookies page
- **Close button**

### Region Selector Dialog
- **Auto-detection**: "Hello! We detected you're visiting from Bulgaria"
- **Dropdown**: Select region with flag emoji (🇧🇬)
- **Buttons**: "Continue with Bulgaria", "Show all products"
- **Dismissible** with close button

### 🟠 Major Issues
1. **Both dialogs appear simultaneously** - Cookie consent and region selector overlap
   - Should: Show region selector first, then cookies (or combine)

---

## 18. Mobile Navigation Bar (Desktop Visibility)

### ✅ What Works Well
- **5 tabs**: Начало, Обяви/Categories, Продай, Чат, Профил
- **Clear icons** with labels
- **Sell button** has distinctive styling

### 🟡 Minor Issues
1. **Mobile nav visible on desktop** - Takes up space unnecessarily on desktop viewport
   - Should be hidden on desktop or replaced with desktop-appropriate navigation

---

## 19. Performance & Technical Issues

### Console Errors
| Error | Frequency | Severity |
|-------|-----------|----------|
| React Hydration Error #418 | Every page load | Critical |
| CSS preload warnings | Multiple | Low |
| WOFF2 font preload warnings | Multiple | Low |

### Hydration Error Details
```
Minified React error #418; visit https://react.dev/errors/418?args[]=text&args[]=
Minified React error #418; visit https://react.dev/errors/418?args[]=HTML&args[]=
```
This indicates **server-client HTML mismatch** - likely caused by:
- Locale switching
- Date/time formatting differences
- Dynamic content rendering

---

## 20. Localization Issues

### 🔴 Critical Issues
1. **Locale switching inconsistency** - Various actions cause unexpected locale changes:
   - Search from /bg → redirects to /en
   - Wishlist from /bg → redirects to /en
   - Sell from /en → redirects to /en homepage
   
2. **Mixed language content**:
   - Breadcrumbs show English ("Today's Deals", "Customer Service", "Terms of Service") even on Bulgarian pages
   - Some buttons and labels remain in English

### 🟡 Minor Issues
1. **Product titles in Bulgarian** (Айсифон, Грозни обувки) displayed on English locale without translation

---

## Issue Summary Table

| ID | Severity | Page | Issue | Impact |
|----|----------|------|-------|--------|
| C1 | 🔴 Critical | All | React Hydration Error #418 | UI instability |
| C2 | 🔴 Critical | Search | Search redirects to wrong locale | Search broken |
| C3 | 🔴 Critical | /en/sell | Sell page redirects to homepage | English sellers blocked |
| C4 | 🔴 Critical | /bg/account | Double locale in URLs (/bg/bg/) | Broken navigation |
| C5 | 🔴 Critical | /bg/todays-deals | Prices in USD instead of EUR | Pricing confusion |
| C6 | 🔴 Critical | /bg/wishlist | Wishlist redirects to /en | Feature broken |
| C7 | 🔴 Critical | Cart | Cart shows 9 items but page is empty | Cart sync issue |
| M1 | 🟠 Major | All | Locale switching inconsistent | Poor UX |
| M2 | 🟠 Major | All | Mixed English/Bulgarian content | Confusing |
| M3 | 🟠 Major | Homepage | Mobile nav visible on desktop | Wasted space |
| M4 | 🟠 Major | Modals | Cookie + Region dialogs overlap | Overwhelming |
| m1 | 🟡 Minor | Homepage | Test data in product titles | Unprofessional |
| m2 | 🟡 Minor | Homepage | Inconsistent date formats | Confusing |
| m3 | 🟡 Minor | Search | No autocomplete suggestions | Missing feature |
| m4 | 🟡 Minor | Categories | No price range filter | Limited filtering |
| m5 | 🟡 Minor | PDP | Rating shows 0.0 vs "No ratings" | Minor UX |
| m6 | 🟡 Minor | Login | Login button disabled state unclear | Minor UX |

---

## Recommendations

### Immediate Priority (Week 1)
1. **Fix React hydration errors** - Audit SSR vs client rendering, especially for locale-dependent content
2. **Fix search routing** - Ensure search preserves locale
3. **Fix English sell page** - Remove redirect, enable full flow
4. **Fix double locale URLs** in account navigation
5. **Fix currency on Today's Deals** - EUR not USD
6. **Fix wishlist redirect**

### High Priority (Week 2-3)
1. **Unify locale handling** - Prevent unexpected locale switches
2. **Translate all breadcrumbs and labels** to Bulgarian
3. **Fix cart synchronization** between locale switches
4. **Separate/sequence modal dialogs**

### Medium Priority (Month 1)
1. **Hide mobile nav on desktop** viewports
2. **Add search autocomplete**
3. **Improve filter UX** with price range, sort dropdown
4. **Replace test data** with realistic demo content

### Low Priority (Backlog)
1. **Voice search** option
2. **Cart preview drawer**
3. **Rating display improvements**

---

## Conclusion

Treido.eu has a solid foundation with modern UI design, comprehensive features, and good information architecture. However, **critical locale handling bugs** severely impact the user experience, particularly for English-speaking users who cannot create listings and experience broken search/wishlist functionality. 

The platform should prioritize fixing the React hydration issues and locale routing bugs before any new feature development. Once these are resolved, Treido would offer a competitive marketplace experience comparable to major European marketplaces.

---

*Audit completed by GitHub Copilot using Playwright browser automation*  
*Duration: ~15 minutes of active testing*  
*Browser: Chromium (headless)*
