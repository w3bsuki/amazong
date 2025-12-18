# Business Dashboard PRD & Implementation Plan

## Executive Summary

This document outlines the comprehensive plan to implement a **Shopify-like Business Dashboard** for business seller accounts on our platform. The goal is to differentiate between Personal and Business accounts, providing Business sellers with a professional-grade dashboard for inventory management, sales analytics, accounting, and business operations.

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Vision & Goals](#2-vision--goals)
3. [Technical Architecture](#3-technical-architecture)
4. [Implementation Phases](#4-implementation-phases)
5. [UI/UX Specifications](#5-uiux-specifications)
6. [Database Schema Changes](#6-database-schema-changes)
7. [Component Architecture](#7-component-architecture)
8. [Route Structure](#8-route-structure)
9. [Risk Assessment](#9-risk-assessment)
10. [Success Metrics](#10-success-metrics)

---

## 1. Current State Analysis

### 1.1 Existing Account Type Infrastructure

✅ **Already Implemented:**
- `sellers.account_type` field exists (`'personal'` | `'business'`)
- `sellers.is_verified_business` boolean field
- `sellers.business_name`, `vat_number`, social URLs fields
- `subscription_plans` filtered by `account_type`
- Create Store Wizard with Personal/Business selection at `/sell`

### 1.2 Current Route Structure

| Route | Purpose | Protection |
|-------|---------|-----------|
| `/dashboard/**` | Admin panel | `requireAdmin()` - admin role only |
| `/account/**` | User account | Auth check - any logged-in user |
| `/seller/dashboard` | Basic seller dashboard | Auth + seller check (legacy) |
| `/sell` | Product listing form | Auth + seller creation wizard |

### 1.3 Existing Components (Reusable)

```
✓ AdminSidebar → Business Sidebar (template)
✓ AdminStatsCards → Business Stats Cards (template)
✓ AdminRecentActivity → Business Activity (template)
✓ DataTable → Product/Order/Inventory Tables
✓ ChartAreaInteractive → Sales Analytics Charts
✓ AccountSidebar → Personal Account Sidebar
✓ All shadcn/ui components (table, card, chart, etc.)
```

---

## 2. Vision & Goals

### 2.1 Primary Vision

Transform the Business seller experience from a basic account page to a **professional-grade Shopify-like dashboard** that enables:

1. **Efficient Inventory Management** - Bulk product operations, SKU management, variant handling
2. **Sales Analytics** - Real-time metrics, revenue tracking, commission visibility
3. **Business Operations** - Invoicing, accounting exports, tax compliance
4. **Scalability** - Handle 500+ products with table-based UI

### 2.2 User Experience Goals

| Account Type | Dashboard Experience |
|--------------|---------------------|
| **Personal** | Simplified `/account` page with listings, orders, sales, ratings |
| **Business** | Full `/dashboard` with Shopify-like product management, analytics, accounting |

### 2.3 Key Differentiators

**Personal Account (`/account`):**
- Simple product listing grid
- Basic sales overview
- Standard order management
- Mobile-first card UI

**Business Account (`/dashboard`):**
- Professional data table with bulk operations
- Advanced analytics & metrics
- Inventory management with SKUs/variants
- Accounting features (invoices, exports, deductions)
- Desktop-first table UI with mobile responsiveness

---

## 3. Technical Architecture

### 3.1 Authentication & Authorization Flow

```
User Login
    │
    ├── Check profiles.role
    │   ├── 'admin' → Allow /admin access
    │   ├── 'seller' → Check sellers.account_type
    │   │   ├── 'business' → Allow /dashboard access
    │   │   └── 'personal' → Redirect to /account
    │   └── 'buyer' → Redirect to /account
    │
    └── Route Protection Middleware
```

### 3.2 Route Protection Functions

```typescript
// lib/supabase/auth-business.ts (NEW)
export async function requireBusinessSeller() {
  // Check auth, seller status, and account_type === 'business'
}

export async function isBusinessAccount(userId: string): Promise<boolean> {
  // Quick check for business account type
}

export async function getBusinessDashboardData() {
  // Fetch seller metrics with business-specific data
}
```

### 3.3 New Route Structure

```
app/[locale]/
├── (admin)/admin/          # Admin panel (moved from /dashboard)
│   ├── layout.tsx          # requireAdmin()
│   ├── page.tsx
│   ├── users/
│   ├── products/
│   ├── orders/
│   └── sellers/
│
├── (dashboard)/dashboard/   # NEW: Business Dashboard
│   ├── layout.tsx          # requireBusinessSeller()
│   ├── page.tsx            # Overview/Home
│   ├── products/           # Product Management
│   │   ├── page.tsx        # Product table list
│   │   ├── new/            # Add product
│   │   └── [id]/edit/      # Edit product
│   ├── orders/             # Order Management
│   ├── inventory/          # Stock/SKU Management
│   ├── analytics/          # Sales Analytics
│   ├── accounting/         # Financial Reports
│   │   ├── page.tsx        # Overview
│   │   ├── invoices/       # Invoice list
│   │   └── exports/        # Data exports
│   └── settings/           # Business Settings
│
├── (account)/account/      # Personal/Buyer Account (simplified)
│   ├── layout.tsx
│   ├── page.tsx            # Overview
│   ├── orders/
│   ├── wishlist/
│   ├── selling/            # Personal seller listings
│   ├── sales/              # Personal seller sales
│   └── ...
```

---

## 4. Implementation Phases

### Phase 1: Backend Infrastructure (Days 1-2)
**Focus: Ensure Supabase correctly handles Personal/Business accounts**

#### 1.1 Validate Database Schema
- [ ] Verify `sellers.account_type` constraint works
- [ ] Verify `sellers.is_verified_business` field
- [ ] Test Create Store API endpoint saves `account_type` correctly
- [ ] Add any missing business fields (if needed)

#### 1.2 Create Authorization Functions
- [ ] Create `lib/supabase/auth-business.ts`
  - `requireBusinessSeller()` - Server-side protection
  - `isBusinessAccount()` - Quick account type check
  - `getBusinessDashboardStats()` - Business metrics fetching
- [ ] Create helper hooks for client-side
  - `useBusinessAccount()` - React hook for business state

#### 1.3 API Endpoints
- [ ] `GET /api/business/stats` - Dashboard statistics
- [ ] `GET /api/business/products` - Products with pagination/filters
- [ ] `POST /api/business/products/bulk` - Bulk product operations
- [ ] `GET /api/business/analytics` - Sales analytics data
- [ ] `GET /api/business/invoices` - Invoice generation

#### Tasks:
```
□ Audit sellers table schema
□ Create auth-business.ts with protection functions
□ Create useBusinessAccount hook
□ Add business-specific API routes
□ Write database queries for business metrics
□ Add RLS policies for business data access
```

---

### Phase 2: Route Restructuring (Days 2-3)
**Focus: Move Admin to /admin, Create /dashboard for Business**

#### 2.1 Move Admin Panel
- [ ] Create `app/[locale]/(admin)/admin/` route group
- [ ] Copy existing dashboard content to admin
- [ ] Update all admin navigation links
- [ ] Update `AdminSidebar` routes from `/dashboard` to `/admin`
- [ ] Test admin panel at new location

#### 2.2 Create Business Dashboard Shell
- [ ] Create `app/[locale]/(dashboard)/dashboard/` route group
- [ ] Create `layout.tsx` with `requireBusinessSeller()`
- [ ] Create `BusinessSidebar` component (based on AdminSidebar)
- [ ] Create `BusinessHeader` component
- [ ] Create placeholder pages for all routes

#### 2.3 Update Account Page
- [ ] Add business account detection
- [ ] Redirect business accounts from `/account/selling` to `/dashboard/products`
- [ ] Simplify personal seller UI in `/account/selling`
- [ ] Update sidebar to show/hide dashboard link based on account type

#### Tasks:
```
□ Create admin route group with moved content
□ Update AdminSidebar navigation links
□ Create dashboard route group structure
□ Create BusinessSidebar component
□ Create BusinessHeader component
□ Create dashboard layout with auth protection
□ Add redirect logic for business accounts
□ Update account sidebar conditionally
```

---

### Phase 3: Business Dashboard Core UI (Days 3-6)
**Focus: Build Shopify-like Product Management Interface**

#### 3.1 Dashboard Overview Page
- [ ] `BusinessStatsCards` - Revenue, Orders, Products, Views
- [ ] `BusinessQuickActions` - Add Product, View Orders, Export
- [ ] `BusinessRecentActivity` - Recent orders, low stock alerts
- [ ] `BusinessRevenueChart` - Sales over time

#### 3.2 Products Page (Table-based)
- [ ] Implement `ProductsDataTable` with columns:
  - Drag handle (reordering)
  - Checkbox (bulk selection)
  - Image thumbnail
  - Title (with link)
  - SKU
  - Category
  - Price
  - Stock quantity
  - Status (Active/Draft/Out of Stock)
  - Actions (Edit, Duplicate, Delete)
- [ ] Bulk actions toolbar:
  - Delete selected
  - Update prices
  - Update stock
  - Change category
  - Export selected
- [ ] Filters:
  - Status filter
  - Category filter
  - Stock level filter
  - Search
- [ ] Pagination (50/100/200 per page)

#### 3.3 Add/Edit Product Page
- [ ] Multi-step form or single-page:
  - Basic Info (Title, Description)
  - Pricing (Price, Compare-at, Cost)
  - Inventory (SKU, Barcode, Stock)
  - Variants (Size, Color, Material)
  - Images (Drag & drop upload)
  - SEO (Meta title, description)
  - Category & Tags
- [ ] Auto-save drafts
- [ ] Preview functionality

#### 3.4 Orders Page
- [ ] Orders data table
- [ ] Order status management
- [ ] Shipping label generation (future)
- [ ] Order details drawer

#### Tasks:
```
□ Create BusinessStatsCards component
□ Create BusinessQuickActions component
□ Create BusinessRecentActivity component
□ Create BusinessRevenueChart component
□ Create ProductsDataTable component
□ Create ProductsBulkActions component
□ Create ProductsFilters component
□ Create AddProductForm component
□ Create EditProductForm component
□ Create ProductVariantsEditor component
□ Create OrdersDataTable component
□ Create OrderStatusManager component
```

---

### Phase 4: Inventory & SKU Management (Days 6-8)
**Focus: Advanced Inventory Features**

#### 4.1 Inventory Page
- [ ] Stock overview cards (Total, Low, Out of Stock)
- [ ] Inventory table with inline editing
- [ ] Bulk stock updates
- [ ] Stock history tracking
- [ ] Low stock alerts configuration

#### 4.2 SKU/Variant System
- [ ] SKU generation helpers
- [ ] Variant management UI
- [ ] Variant stock tracking
- [ ] Variant pricing
- [ ] Variant images

#### 4.3 Import/Export
- [ ] CSV import for products
- [ ] CSV export for inventory
- [ ] Bulk image upload

#### Tasks:
```
□ Create InventoryOverview component
□ Create InventoryTable with inline editing
□ Create StockUpdateDrawer component
□ Create VariantEditor component
□ Create SKUGenerator utility
□ Create CSVImport component
□ Create CSVExport utility
□ Add import/export API endpoints
```

---

### Phase 5: Analytics & Accounting (Days 8-10)
**Focus: Business Intelligence & Financial Features**

#### 5.1 Analytics Dashboard
- [ ] Revenue analytics (daily, weekly, monthly, yearly)
- [ ] Product performance (top sellers, worst performers)
- [ ] Customer analytics (repeat customers, new vs returning)
- [ ] Traffic analytics (views per product)
- [ ] Conversion rate tracking

#### 5.2 Accounting Features
- [ ] Commission breakdown view
- [ ] Fee transparency (insertion, final value, per-order)
- [ ] Payout history
- [ ] Invoice generation (PDF)
- [ ] Tax report exports (VAT/EIK support for Bulgaria)
- [ ] Monthly/yearly statements

#### 5.3 Reports
- [ ] Sales reports
- [ ] Inventory reports
- [ ] Tax reports
- [ ] Custom date range exports

#### Tasks:
```
□ Create AnalyticsDashboard component
□ Create RevenueChart (multiple timeframes)
□ Create ProductPerformanceTable component
□ Create CustomerAnalytics component
□ Create CommissionBreakdown component
□ Create PayoutHistory component
□ Create InvoiceGenerator utility
□ Create TaxReportExport utility
□ Create PDF generation for invoices
```

---

### Phase 6: Polish & Mobile Optimization (Days 10-12)
**Focus: Responsive Design & UX Refinement**

#### 6.1 Mobile Responsiveness
- [ ] Responsive data tables (horizontal scroll)
- [ ] Mobile navigation (bottom tabs or hamburger)
- [ ] Touch-friendly controls
- [ ] Mobile-optimized forms

#### 6.2 UX Enhancements
- [ ] Loading states & skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Keyboard shortcuts
- [ ] Onboarding tour for new business users

#### 6.3 Performance
- [ ] Table virtualization for large datasets
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Server-side pagination

#### Tasks:
```
□ Implement responsive table patterns
□ Create mobile navigation
□ Add loading skeletons to all pages
□ Add error boundaries
□ Implement keyboard shortcuts
□ Create onboarding tour
□ Add table virtualization
□ Optimize image loading
□ Performance audit & optimization
```

---

## 5. UI/UX Specifications

### 5.1 Design Principles

1. **Table-First for Desktop** - Data tables with sortable columns, filters, bulk actions
2. **Card-Based for Mobile** - Stack cards vertically with key info visible
3. **Action-Oriented** - Quick actions always accessible
4. **Information Density** - Show more data, use progressive disclosure
5. **Consistent with Platform** - Use existing Tailwind v4 CSS variables

### 5.2 Color Palette (Using Existing Variables)

```css
/* Business Dashboard Colors */
--dashboard-bg: var(--background)
--dashboard-card: var(--card)
--dashboard-accent: var(--primary)
--dashboard-success: var(--success) /* Green for positive metrics */
--dashboard-warning: var(--warning) /* Yellow for alerts */
--dashboard-danger: var(--destructive) /* Red for critical */

/* Existing account colors (reuse) */
--account-stat-bg
--account-stat-border
--account-stat-icon
--account-stat-icon-bg
```

### 5.3 Typography

```css
/* Dashboard Headers */
h1: text-2xl font-semibold (Page titles)
h2: text-xl font-semibold (Section titles)
h3: text-lg font-medium (Card titles)

/* Data */
.stat-value: text-3xl font-bold tabular-nums
.stat-label: text-sm text-muted-foreground
.table-cell: text-sm
```

### 5.4 Component Specifications

#### Dashboard Sidebar
```
Width: 240px (desktop), full-width sheet (mobile)
Sections:
├── Header (Logo + "Business Dashboard")
├── Main Nav
│   ├── Overview (IconDashboard)
│   ├── Products (IconBox)
│   ├── Orders (IconShoppingCart)
│   ├── Inventory (IconPackage)
│   ├── Analytics (IconChartBar)
│   └── Accounting (IconReceipt)
├── Secondary Nav
│   ├── Back to Store (IconHome)
│   └── Settings (IconSettings)
└── Footer (User avatar + dropdown)
```

#### Products Table Columns
```
| Drag | ☐ | Image | Title | SKU | Category | Price | Stock | Status | Actions |
|------|---|-------|-------|-----|----------|-------|-------|--------|---------|
| ≡    | ☐ | 📷    | ...   | ... | ...      | $XX   | XX    | Badge  | ⋮       |
```

#### Stats Cards Grid
```
Desktop: 5 columns (Revenue, Orders, Products, Views, Rating)
Tablet: 3 columns + 2 columns
Mobile: 2 columns + 2 columns + 1 column
```

---

## 6. Database Schema Changes

### 6.1 Existing Tables (No Changes Needed)

```sql
-- sellers table already has:
account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'business'))
is_verified_business BOOLEAN DEFAULT false
business_name TEXT
vat_number TEXT
-- etc.
```

### 6.2 New Tables (Optional Enhancements)

```sql
-- Product variants (if not exists)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  title TEXT NOT NULL, -- e.g., "Red / Large"
  price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  attributes JSONB, -- {"color": "red", "size": "L"}
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Product views tracking (for analytics)
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  source TEXT -- 'search', 'category', 'direct', 'featured'
);

-- Invoice records
CREATE TABLE IF NOT EXISTS seller_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sales DECIMAL(10,2),
  total_commission DECIMAL(10,2),
  total_fees DECIMAL(10,2),
  net_payout DECIMAL(10,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid')),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.3 RLS Policies

```sql
-- Business sellers can only see their own data
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view own variants" ON product_variants
  FOR SELECT USING (
    product_id IN (SELECT id FROM products WHERE seller_id = auth.uid())
  );

CREATE POLICY "Sellers can manage own variants" ON product_variants
  FOR ALL USING (
    product_id IN (SELECT id FROM products WHERE seller_id = auth.uid())
  );
```

---

## 7. Component Architecture

### 7.1 New Components to Create

```
components/
├── business/
│   ├── business-sidebar.tsx        # Dashboard navigation
│   ├── business-header.tsx         # Top header with breadcrumbs
│   ├── business-stats-cards.tsx    # Overview statistics
│   ├── business-quick-actions.tsx  # Action buttons
│   ├── business-recent-activity.tsx # Activity feed
│   ├── business-revenue-chart.tsx  # Revenue over time
│   │
│   ├── products/
│   │   ├── products-data-table.tsx   # Main products table
│   │   ├── products-bulk-actions.tsx # Bulk action toolbar
│   │   ├── products-filters.tsx      # Filter controls
│   │   ├── product-form.tsx          # Add/Edit form
│   │   ├── product-variants.tsx      # Variant management
│   │   └── product-images.tsx        # Image upload
│   │
│   ├── orders/
│   │   ├── orders-data-table.tsx     # Orders table
│   │   ├── order-details-drawer.tsx  # Order detail view
│   │   └── order-status-badge.tsx    # Status indicator
│   │
│   ├── inventory/
│   │   ├── inventory-overview.tsx    # Stock summary
│   │   ├── inventory-table.tsx       # Stock table
│   │   ├── stock-update-drawer.tsx   # Bulk stock update
│   │   └── low-stock-alerts.tsx      # Alert configuration
│   │
│   ├── analytics/
│   │   ├── analytics-dashboard.tsx   # Main analytics view
│   │   ├── revenue-analytics.tsx     # Revenue charts
│   │   ├── product-performance.tsx   # Top/worst products
│   │   └── customer-analytics.tsx    # Customer insights
│   │
│   └── accounting/
│       ├── commission-breakdown.tsx  # Fee breakdown
│       ├── payout-history.tsx        # Payout table
│       ├── invoice-list.tsx          # Invoice table
│       └── export-reports.tsx        # Report exports
```

### 7.2 Shared Components (Existing, Reusable)

```
components/ui/
├── table.tsx           ✓ For data tables
├── card.tsx            ✓ For stat cards
├── chart.tsx           ✓ For analytics
├── badge.tsx           ✓ For status indicators
├── button.tsx          ✓ For actions
├── dropdown-menu.tsx   ✓ For row actions
├── dialog.tsx          ✓ For modals
├── drawer.tsx          ✓ For side panels
├── tabs.tsx            ✓ For tab navigation
├── select.tsx          ✓ For filters
├── input.tsx           ✓ For search/forms
├── skeleton.tsx        ✓ For loading states
└── sidebar.tsx         ✓ For navigation
```

---

## 8. Route Structure

### 8.1 Final Route Map

```
/admin (Admin Panel - Role: admin)
├── /admin              → Admin overview
├── /admin/users        → User management
├── /admin/products     → All products moderation
├── /admin/orders       → All orders management
├── /admin/sellers      → Seller management
├── /admin/categories   → Category management
├── /admin/analytics    → Platform analytics
└── /admin/settings     → Platform settings

/dashboard (Business Dashboard - Account Type: business)
├── /dashboard          → Business overview
├── /dashboard/products → Product management table
├── /dashboard/products/new → Add new product
├── /dashboard/products/[id]/edit → Edit product
├── /dashboard/orders   → Order management
├── /dashboard/orders/[id] → Order details
├── /dashboard/inventory → Stock management
├── /dashboard/analytics → Sales analytics
├── /dashboard/accounting → Financial reports
├── /dashboard/accounting/invoices → Invoice list
├── /dashboard/accounting/exports → Data exports
└── /dashboard/settings → Business settings

/account (Personal Account - Account Type: personal OR buyer)
├── /account            → Account overview
├── /account/orders     → My orders (as buyer)
├── /account/wishlist   → Saved items
├── /account/selling    → My listings (personal seller)
├── /account/sales      → My sales (personal seller)
├── /account/addresses  → Shipping addresses
├── /account/payments   → Payment methods
├── /account/billing    → Subscription billing
├── /account/plans      → Subscription plans
└── /account/security   → Account security
```

### 8.2 Navigation Logic

```typescript
// In main-nav.tsx or header component
const getSellerDashboardLink = (seller: Seller | null) => {
  if (!seller) return '/sell' // Create store
  if (seller.account_type === 'business') return '/dashboard'
  return '/account/selling' // Personal sellers
}

// In account sidebar
const showDashboardLink = seller?.account_type === 'business'
const showSellingLink = seller?.account_type === 'personal'
```

---

## 9. Risk Assessment

### 9.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data migration issues | High | Backup before any schema changes, test in staging |
| Performance with large datasets | Medium | Implement pagination, virtualization early |
| Route conflicts | Low | Use route groups `(admin)`, `(dashboard)`, `(account)` |
| Auth bypass | High | Test all protection functions thoroughly |

### 9.2 UX Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Confusion for existing users | Medium | Clear onboarding, email announcement |
| Feature parity gaps | Low | Phase rollout with feedback loops |
| Mobile experience degradation | Medium | Mobile-first testing for all features |

### 9.3 Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Business users not adopting | High | Highlight value props, offer trial period |
| Personal users wanting business features | Low | Clear upgrade path with benefits |

---

## 10. Success Metrics

### 10.1 Technical Metrics

- [ ] Page load time < 2s for dashboard
- [ ] Table renders 1000+ rows without lag
- [ ] Zero unauthorized access incidents
- [ ] 100% test coverage for auth functions

### 10.2 Business Metrics

- [ ] 20% increase in business account signups (30 days post-launch)
- [ ] 15% increase in products listed by business accounts
- [ ] 90% positive feedback score on dashboard usability
- [ ] 30% reduction in support tickets related to product management

### 10.3 User Metrics

- [ ] Average session duration increase by 25%
- [ ] Daily active business users > 50%
- [ ] Feature adoption rate > 70% within 60 days

---

## Implementation Checklist Summary

### Phase 1: Backend Infrastructure ⬜
- [ ] Verify database schema
- [ ] Create `auth-business.ts`
- [ ] Create `useBusinessAccount` hook
- [ ] Add business API routes
- [ ] Add RLS policies

### Phase 2: Route Restructuring ⬜
- [ ] Move admin to `/admin`
- [ ] Create `/dashboard` route group
- [ ] Create `BusinessSidebar`
- [ ] Create `BusinessHeader`
- [ ] Add account type redirects

### Phase 3: Dashboard Core UI ⬜
- [ ] Dashboard overview page
- [ ] Products data table
- [ ] Add/Edit product forms
- [ ] Orders management

### Phase 4: Inventory Management ⬜
- [ ] Inventory overview
- [ ] SKU/Variant system
- [ ] Import/Export features

### Phase 5: Analytics & Accounting ⬜
- [ ] Analytics dashboard
- [ ] Commission breakdown
- [ ] Invoice generation
- [ ] Report exports

### Phase 6: Polish & Mobile ⬜
- [ ] Responsive design
- [ ] Loading states
- [ ] Performance optimization
- [ ] Onboarding tour

---

## Quick Start Commands

```bash
# After approval, start implementation:

# 1. Create branch
git checkout -b feature/business-dashboard

# 2. Run dev server
pnpm dev

# 3. Test Supabase connection
pnpm supabase db reset --local  # If using local Supabase

# 4. Build check
pnpm build
```

---

## Appendix A: File Creation Order

```
1. lib/supabase/auth-business.ts
2. hooks/use-business-account.ts
3. app/[locale]/(admin)/admin/layout.tsx (move)
4. app/[locale]/(dashboard)/dashboard/layout.tsx (new)
5. components/business/business-sidebar.tsx
6. components/business/business-header.tsx
7. components/business/business-stats-cards.tsx
8. app/[locale]/(dashboard)/dashboard/page.tsx
9. components/business/products/products-data-table.tsx
10. app/[locale]/(dashboard)/dashboard/products/page.tsx
... (continue in order)
```

---

## Appendix B: Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1 | 2 days | None |
| Phase 2 | 2 days | Phase 1 |
| Phase 3 | 4 days | Phase 2 |
| Phase 4 | 2 days | Phase 3 |
| Phase 5 | 2 days | Phase 3 |
| Phase 6 | 2 days | All phases |
| **Total** | **14 days** | |

---

## Appendix C: Reference Screenshots

### Shopify Dashboard Reference
- Product list with columns: Image, Title, Status, Inventory, Type, Vendor
- Bulk action bar on selection
- Filters on left side (status, product type, vendor, tagged with)
- Pagination with "50 per page" selector

### Key UI Patterns to Implement
1. **Collapsible sidebar** - Icon-only mode for more workspace
2. **Sticky table headers** - Always visible column names
3. **Inline editing** - Click to edit stock/price
4. **Drag & drop** - Reorder products
5. **Contextual actions** - Row hover reveals actions
6. **Keyboard navigation** - Arrow keys, Enter, Escape

---

**Document Version:** 1.0  
**Created:** December 13, 2025  
**Author:** GitHub Copilot  
**Status:** Ready for Implementation

---

## Appendix D: Immediate Implementation Guide

### Step 1: Create `lib/auth/business.ts`

Based on the existing `lib/auth/admin.ts` pattern, create a parallel file for business seller authentication.

```typescript
// lib/auth/business.ts
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"

export interface BusinessSeller {
  id: string
  email: string
  store_name: string
  account_type: 'personal' | 'business'
  is_verified_business: boolean
  business_name: string | null
  tier: string
}

/**
 * Verifies the current user is a business seller.
 * @param redirectTo - Where to redirect non-business users
 */
export async function requireBusinessSeller(redirectTo: string = "/account"): Promise<BusinessSeller> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/auth/login")
  }
  
  const { data: seller, error: sellerError } = await supabase
    .from('sellers')
    .select('id, store_name, account_type, is_verified_business, business_name, tier')
    .eq('id', user.id)
    .single()
  
  if (sellerError || !seller) {
    redirect("/sell") // No seller account - create one
  }
  
  if (seller.account_type !== 'business') {
    redirect(redirectTo) // Personal account - go to regular account
  }
  
  return {
    id: seller.id,
    email: user.email || '',
    store_name: seller.store_name,
    account_type: seller.account_type,
    is_verified_business: seller.is_verified_business,
    business_name: seller.business_name,
    tier: seller.tier,
  }
}

/**
 * Check if current user has a business account (no redirect)
 */
export async function isBusinessAccount(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false
    
    const { data: seller } = await supabase
      .from('sellers')
      .select('account_type')
      .eq('id', user.id)
      .single()
    
    return seller?.account_type === 'business'
  } catch {
    return false
  }
}

/**
 * Get business dashboard statistics
 */
export async function getBusinessDashboardStats(sellerId: string) {
  await connection()
  const supabase = await createClient()
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  
  const [
    productsResult,
    ordersResult,
    revenueResult,
    viewsResult,
  ] = await Promise.all([
    // Total products
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('seller_id', sellerId),
    // Total orders (as seller)
    supabase.from('order_items').select('id', { count: 'exact', head: true }).eq('seller_id', sellerId),
    // Revenue (last 30 days)
    supabase.from('order_items')
      .select('quantity, price_at_time')
      .eq('seller_id', sellerId)
      .gte('created_at', thirtyDaysAgo),
    // Product views (if tracking exists)
    supabase.from('products')
      .select('views')
      .eq('seller_id', sellerId),
  ])
  
  const revenue = revenueResult.data?.reduce((sum, item) => 
    sum + (Number(item.price_at_time) * item.quantity), 0) || 0
    
  const totalViews = viewsResult.data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
  
  return {
    products: productsResult.count || 0,
    orders: ordersResult.count || 0,
    revenue,
    views: totalViews,
  }
}
```

### Step 2: Create Route Groups

```
# Create new admin route (copy dashboard content)
mkdir -p app/[locale]/(admin)/admin

# Create new business dashboard route
mkdir -p app/[locale]/(dashboard)/dashboard
mkdir -p app/[locale]/(dashboard)/dashboard/products
mkdir -p app/[locale]/(dashboard)/dashboard/orders
mkdir -p app/[locale]/(dashboard)/dashboard/inventory
mkdir -p app/[locale]/(dashboard)/dashboard/analytics
mkdir -p app/[locale]/(dashboard)/dashboard/accounting
```

### Step 3: Business Sidebar Navigation Items

```typescript
// For BusinessSidebar component
const businessNavItems = [
  { title: "Overview", url: "/dashboard", icon: IconDashboard },
  { title: "Products", url: "/dashboard/products", icon: IconBox },
  { title: "Orders", url: "/dashboard/orders", icon: IconShoppingCart },
  { title: "Inventory", url: "/dashboard/inventory", icon: IconPackage },
  { title: "Analytics", url: "/dashboard/analytics", icon: IconChartBar },
  { title: "Accounting", url: "/dashboard/accounting", icon: IconReceipt },
]

const businessSecondaryNav = [
  { title: "Back to Store", url: "/", icon: IconHome },
  { title: "Settings", url: "/dashboard/settings", icon: IconSettings },
]
```

### Step 4: Database Verification Query

```sql
-- Run this in Supabase SQL Editor to verify schema
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'sellers' 
AND column_name IN ('account_type', 'is_verified_business', 'business_name', 'vat_number');

-- Check existing account types
SELECT account_type, COUNT(*) 
FROM sellers 
GROUP BY account_type;
```

### Step 5: Test Account Type Flow

1. Create a new account at `/auth/sign-up`
2. Go to `/sell`
3. Select "Business" account type
4. Complete store creation
5. Verify in Supabase: `SELECT * FROM sellers WHERE account_type = 'business'`
6. Test `/dashboard` access (should work)
7. Test with personal account (should redirect to `/account`)

---

## Appendix E: Existing Components to Clone/Adapt

| Admin Component | Business Component (New) | Changes Needed |
|-----------------|--------------------------|----------------|
| `admin-sidebar.tsx` | `business-sidebar.tsx` | Update nav items, branding |
| `admin-stats-cards.tsx` | `business-stats-cards.tsx` | Change metrics to seller-specific |
| `admin-recent-activity.tsx` | `business-recent-activity.tsx` | Show seller's recent orders/products |
| `data-table.tsx` | Reuse directly | Configure columns for products |
| `chart-area-interactive.tsx` | Reuse directly | Pass seller revenue data |

---

## Appendix F: API Endpoints to Create

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/business/stats` | GET | Dashboard statistics |
| `/api/business/products` | GET | Paginated product list |
| `/api/business/products` | POST | Create product |
| `/api/business/products/[id]` | PUT | Update product |
| `/api/business/products/[id]` | DELETE | Delete product |
| `/api/business/products/bulk` | POST | Bulk operations |
| `/api/business/orders` | GET | Paginated order list |
| `/api/business/analytics` | GET | Analytics data |
| `/api/business/invoices` | GET | Invoice list |
| `/api/business/invoices/[id]/pdf` | GET | Generate invoice PDF |
| `/api/business/export` | POST | Export data (CSV/Excel) |
