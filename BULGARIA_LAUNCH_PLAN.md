# 🇧🇬 BULGARIA LAUNCH - Production Finalization Plan

**Project:** Amazong - Multi-Vendor E-Commerce Platform  
**Target Market:** Bulgaria  
**Launch Date:** TBD  
**Status:** Pre-Production (Database Fixes Applied)

---

## ✅ COMPLETED FIXES (November 24, 2025)

### 1. Database Schema Fixes
- ✅ **Added `tags` column** to `products` table (text[] with GIN index)
- ✅ **Added Bulgarian language support** columns to categories:
  - `name_bg` - Bulgarian category names
  - `description` - English descriptions
  - `description_bg` - Bulgarian descriptions
  - `icon` - Category icon identifier
- ✅ **Updated full-text search** to support Cyrillic characters using 'simple' config
- ✅ **Added performance indexes** on all foreign keys (orders, reviews, order_items)
- ✅ **Created 56 categories total:** 11 main + 45 subcategories with Bulgarian translations

### 2. Category System
Created comprehensive hierarchical categories:
- **Automotive (Автомобили):** Car Parts, Accessories, Motorcycle, Tires & Wheels, Electronics
- **Electronics (Електроника):** Phones, Audio, Cameras, TV, Wearables
- **Computers (Компютри):** Laptops, Desktops, Components, Monitors, Accessories
- **Home & Kitchen (Дом и кухня):** Furniture, Appliances, Bedding, Decor, Storage
- **Fashion (Мода):** Women, Men, Kids, Shoes, Bags
- **Sports (Спорт):** Fitness, Outdoor, Equipment, Cycling
- **Toys (Играчки):** Action Figures, Board Games, Educational, Dolls
- **Gaming (Геймърство):** Consoles, Video Games, Accessories, PC Gaming
- **Beauty (Красота):** Skincare, Makeup, Hair Care, Fragrances
- **Books (Книги):** Fiction, Non-Fiction, Educational, Children

### 3. Search Functionality
- ✅ **Bulgarian search works!** Tested with "Волан за БМВ" - returns correct results
- ✅ **Tags are searchable** with weighted ranking (title > description > tags)
- ✅ **GIN indexes** on search_vector and tags for fast queries

---

## 🔴 CRITICAL ISSUES TO FIX BEFORE LAUNCH

### Security Issues

#### 1. **Leaked Password Protection (WARN)**
**Issue:** Password breach protection is disabled  
**Impact:** Users can set compromised passwords from data breaches  
**Fix:** Enable in Supabase Dashboard
```
Dashboard > Authentication > Settings > Password Protection
Enable "Prevent sign ups with leaked passwords"
```
**Reference:** https://supabase.com/docs/guides/auth/password-security

#### 2. **Extension in Public Schema (WARN)**
**Issue:** `pg_trgm` extension installed in public schema (security risk)  
**Impact:** Could be exploited; best practice is separate schema  
**Fix:** Run migration:
```sql
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;
```

#### 3. **Missing RLS Policies Review**
**Status:** RLS enabled on all tables ✅  
**Action:** Verify policies work correctly with multi-vendor scenarios

---

## ⚠️ IMPORTANT IMPROVEMENTS NEEDED

### 1. Frontend-Backend Category Sync
**Issue:** Product creation form shows ALL categories in flat dropdown  
**Current State:** 56 categories, no hierarchy shown  
**Needed:**
- Update sell page to show hierarchical category selector
- Parent category → Subcategory dropdown flow
- Example: "Automotive" → "Car Parts" for "Волан за БМВ"

**Files to Update:**
- `app/[locale]/sell/page.tsx` - Add cascading category selectors
- `app/api/products/route.ts` - Already supports tags ✅

### 2. Search API Integration
**Issue:** Search likely not using Cyrillic-capable full-text search  
**Files to Check:**
- `app/api/products/route.ts` - Needs GET endpoint with FTS
- Frontend search components - Verify using proper search API

**Recommended Search Query:**
```typescript
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('search_vector', searchTerm, {
    type: 'plain',
    config: 'simple' // Supports Cyrillic
  })
  .order('created_at', { ascending: false })
```

### 3. Category Localization
**Issue:** Frontend likely not using `name_bg` column  
**Fix:** Update category fetching to use Bulgarian names:
```typescript
// In Bulgarian locale
const categoryName = locale === 'bg' ? category.name_bg : category.name
```

### 4. Missing Product Form Fields
**Current:** Tags, subcategory inputs exist but subcategory not saved to DB  
**Issue:** `subcategory` field sent to API but not in schema  
**Options:**
1. **Remove subcategory field** (recommended) - use hierarchical category selection instead
2. **Add subcategory column** to products table (but we have parent_id in categories)

**Recommended:** Use `category_id` to point to the most specific subcategory (e.g., "auto-parts" not "automotive")

---

## 🚀 PRE-LAUNCH CHECKLIST

### Database & Backend
- [ ] **Move pg_trgm to extensions schema**
- [ ] **Enable leaked password protection** in Supabase Auth settings
- [ ] **Test all RLS policies** with different user roles (buyer, seller, admin)
- [ ] **Add database backups** schedule (Supabase Pro feature)
- [ ] **Set up monitoring** for database performance
- [ ] **Review and optimize indexes** (some flagged as unused - normal for new DB)
- [ ] **Add stock validation** - prevent negative stock in products
- [ ] **Add price validation** - ensure prices are reasonable (0.01 to 1,000,000 BGN)

### Frontend Updates
- [ ] **Update category selector** in sell page to hierarchical (parent → child)
- [ ] **Remove subcategory text field** from product form
- [ ] **Use Bulgarian category names** (`name_bg`) when locale is 'bg'
- [ ] **Update header navigation** to show all main categories (currently limited)
- [ ] **Add subcategory browsing** - clicking category shows subcategories
- [ ] **Test Bulgarian language** on all pages
- [ ] **Add category icons** to improve UX (use `icon` column)

### Search & Discovery
- [ ] **Implement proper search API** using full-text search with 'simple' config
- [ ] **Add filters** - by category, price range, rating, tags
- [ ] **Test Bulgarian search** thoroughly with various queries
- [ ] **Add search suggestions/autocomplete**
- [ ] **Test tag-based filtering** (e.g., show all "БМВ" products)

### User Experience
- [ ] **Seller onboarding** - guide users through category selection
- [ ] **Add "Other" category** for items that don't fit (or allow sellers to suggest categories)
- [ ] **Category browsing UI** - main categories on homepage, subcategories on hover/click
- [ ] **Bulgarian product examples** - seed database with Bulgarian products
- [ ] **Shipping to Bulgaria** - configure shipping zones, costs
- [ ] **Payment in Bulgarian Lev (BGN)** - update currency display

### Authentication & Authorization
- [ ] **Test user registration** flow
- [ ] **Test seller registration** flow (store creation)
- [ ] **Verify email confirmation** works
- [ ] **Test password reset** flow
- [ ] **Review session management** and timeout settings
- [ ] **Add 2FA option** for sellers (optional but recommended)

### Content & Localization
- [ ] **Review Bulgarian translations** in `messages/bg.json` - add missing keys
- [ ] **Add category descriptions** in Bulgarian for SEO
- [ ] **Create terms of service** in Bulgarian
- [ ] **Create privacy policy** in Bulgarian (GDPR compliance)
- [ ] **Add cookie consent** banner (GDPR requirement)
- [ ] **Create seller guidelines** in Bulgarian
- [ ] **Add FAQ section** in Bulgarian

### Legal & Compliance (Bulgaria)
- [ ] **Register business** with Bulgarian authorities
- [ ] **VAT registration** (required for e-commerce in Bulgaria)
- [ ] **GDPR compliance** - data processing agreement
- [ ] **Consumer protection** - 14-day return policy (EU law)
- [ ] **Terms & Conditions** - compliant with Bulgarian e-commerce law
- [ ] **Payment provider** - setup Stripe/PayPal for Bulgaria
- [ ] **Dispute resolution** mechanism

### Performance & Infrastructure
- [ ] **Setup CDN** for images (Cloudflare, Vercel)
- [ ] **Optimize images** - lazy loading, WebP format
- [ ] **Add caching** for category lists, popular products
- [ ] **Setup error tracking** (Sentry, LogRocket)
- [ ] **Setup analytics** (Vercel Analytics already added ✅)
- [ ] **Load testing** - simulate 100+ concurrent users
- [ ] **Mobile optimization** - test on Bulgarian mobile devices

### Security Hardening
- [ ] **Rate limiting** on API routes (prevent abuse)
- [ ] **Input validation** - sanitize all user inputs
- [ ] **SQL injection prevention** - verify all queries use parameterization
- [ ] **XSS prevention** - sanitize product descriptions, reviews
- [ ] **CSRF protection** - verify Next.js defaults are sufficient
- [ ] **Security headers** - CSP, HSTS, X-Frame-Options
- [ ] **Penetration testing** - hire security firm or use automated tools

### Testing
- [ ] **End-to-end testing** - Playwright tests for critical flows
- [ ] **Bulgarian language testing** - native speaker review
- [ ] **Cross-browser testing** - Chrome, Firefox, Safari, Edge
- [ ] **Mobile testing** - iOS and Android
- [ ] **Payment testing** - test transactions with test cards
- [ ] **Email testing** - verify all emails sent correctly in Bulgarian

### Go-Live Preparation
- [ ] **Setup production domain** (e.g., amazong.bg)
- [ ] **SSL certificate** (Vercel handles this ✅)
- [ ] **Setup production Supabase project** (separate from development)
- [ ] **Database migration** - run all migrations on production
- [ ] **Seed production data** - categories, initial products
- [ ] **Setup monitoring alerts** - uptime, errors, database issues
- [ ] **Prepare rollback plan** - how to revert if issues arise
- [ ] **Create incident response plan**

---

## 🎯 RECOMMENDATION: Phased Launch

### Phase 1: Private Beta (2-3 weeks)
- Invite 10-20 Bulgarian sellers
- Limited product categories (Electronics, Home, Automotive)
- Collect feedback on Bulgarian UX
- Test payment flows with real transactions
- Fix critical bugs

### Phase 2: Public Beta (4-6 weeks)
- Open registration to all Bulgarian sellers
- All categories available
- Marketing campaign in Bulgaria
- Monitor performance and scale infrastructure
- Gather user feedback

### Phase 3: Full Launch
- Official press release
- Full marketing campaign
- Partnerships with Bulgarian businesses
- Continuous improvement based on metrics

---

## 📊 KEY METRICS TO TRACK

### Business Metrics
- Seller registrations per day
- Products listed per day
- Successful transactions
- Average order value (BGN)
- Customer acquisition cost
- Seller retention rate

### Technical Metrics
- Page load time (target: <2s)
- Search response time (target: <500ms)
- API error rate (target: <0.1%)
- Database query time (target: <100ms)
- Uptime (target: 99.9%)

### User Experience
- Search success rate (users finding products)
- Cart abandonment rate
- Category navigation depth
- Mobile vs desktop usage
- Bulgarian vs English locale usage

---

## 🐛 KNOWN ISSUES

1. **Subcategory field confusion** - Field in form but not saved to DB properly
2. **Category dropdown UX** - All 56 categories in one flat list (overwhelming)
3. **Header categories** - Only shows 4 categories, not all 11 main ones
4. **Search API** - Needs verification that it uses FTS with Cyrillic support
5. **No "Other" category** - What if seller product doesn't fit any category?

---

## 💡 FUTURE ENHANCEMENTS (Post-Launch)

1. **Seller dashboard** - Analytics, sales reports, inventory management
2. **Product recommendations** - ML-based "customers also bought"
3. **Reviews & ratings** - Currently schema exists but no UI
4. **Wishlist/favorites** - Save products for later
5. **Compare products** - Side-by-side comparison
6. **Seller verification badges** - Build trust
7. **Product variations** - Size, color options
8. **Bulk product upload** - CSV import for sellers
9. **Multi-language support** - Add English for international sellers
10. **Mobile app** - iOS and Android native apps

---

## 🔧 TECHNICAL DEBT

1. **API routes missing error handling** - Add try-catch and proper error responses
2. **No API rate limiting** - Risk of abuse
3. **Hardcoded service role key** usage - Should use row-level security more
4. **No caching layer** - Add Redis for frequent queries
5. **Image upload** - Currently URL-based, need proper file upload
6. **No test coverage** - Add unit and integration tests

---

## 📞 NEXT STEPS

1. **Review this plan** with stakeholders
2. **Prioritize checklist items** (critical vs nice-to-have)
3. **Assign tasks** to team members
4. **Set timeline** for each phase
5. **Schedule security audit** before Phase 1
6. **Plan marketing strategy** for Bulgarian market
7. **Setup customer support** (email, phone, chat in Bulgarian)

---

## 🎓 LESSONS FROM AUDIT

### What Went Well ✅
- Solid database schema with RLS policies
- Good category structure planning
- Multi-language support in database
- Full-text search capability

### What Needs Improvement ⚠️
- Frontend-backend category integration
- User flow for category selection
- Security hardening (password protection, extension schema)
- Localization completeness
- Testing coverage

### Critical for Bulgaria Launch 🇧🇬
1. **Bulgarian language first** - All UX must feel native
2. **Familiar payment methods** - ePay, Borica, not just Stripe
3. **Local trust signals** - Bulgarian business registration, support
4. **Category relevance** - Ensure categories match Bulgarian shopping habits
5. **Competitive pricing** - Research Bulgarian marketplaces (OLX, Pazaruvaj)

---

**Document Version:** 1.0  
**Last Updated:** November 24, 2025  
**Next Review:** Before Phase 1 Beta Launch  
**Owner:** Development Team
