# Category System Implementation Guide

**Created:** December 3, 2025  
**Updated:** December 3, 2025 (FINALIZED - Ready to Execute)  
**Status:** 🟢 PRODUCTION READY - Execute as Single Migration  
**Estimated Time:** 2-3 hours  

---

## Philosophy

> **KISS: Keep It Simple, Stupid**

This guide follows **Next.js 16** and **Supabase** best practices:
1. **Use next-intl for translations** - NOT database JSONB
2. **Use PostgREST filtering** - NOT custom RPC functions  
3. **Use JSONB only for flexible attributes** - NOT for everything
4. **Use TypeScript helpers** - NOT PL/pgSQL functions
5. **Use static data for reference tables** - NOT full ORM entities

---

## Current Database State (Verified December 3, 2025)

### ✅ Already Exists:
| Table | Rows | Notes |
|-------|------|-------|
| `categories` | 374 | UUID PKs, `name_bg`, `parent_id`, `icon` |
| `products` | 214 | Shipping booleans already exist |
| `category_attributes` | 28 | EAV definitions for dynamic forms |
| `product_attributes` | 0 | EAV values (empty, ready to use) |
| `brands` | 24 | Brand reference table |

### ✅ Shipping Already Implemented (DO NOT CHANGE):
- `ships_to_bulgaria` BOOLEAN DEFAULT true
- `ships_to_europe` BOOLEAN DEFAULT false
- `ships_to_usa` BOOLEAN DEFAULT false
- `ships_to_worldwide` BOOLEAN DEFAULT false
- `pickup_only` BOOLEAN DEFAULT false

---

## What We're Building

Add **2 columns** via **ONE migration**:

1. `products.attributes JSONB` - Flexible product attributes (make, model, year, etc.)
2. `categories.display_order INTEGER` - For mega-menu sorting

**Why JSONB alongside EAV?**
- **EAV tables** (`category_attributes` + `product_attributes`): For dynamic form generation
- **JSONB column** (`products.attributes`): For fast PostgREST filtering (denormalized copy)

Both are valid - JSONB for reads, EAV for form generation. Sync in Server Actions.

---

## Phase 1: Database Migration (15 min)

### Single Migration File

Create `supabase/migrations/20251203_product_attributes_and_display_order.sql`:

```sql
-- ============================================
-- MIGRATION: Product Attributes + Display Order
-- Author: Auto-generated from IMPLEMENTATION.md
-- Date: December 3, 2025
-- 
-- WHAT THIS DOES:
-- 1. Adds JSONB `attributes` column to products for fast filtering
-- 2. Adds `display_order` to categories for mega-menu sorting
-- 3. Creates optimized indexes for PostgREST queries
--
-- PREREQUISITE: Shipping columns already exist (ships_to_bulgaria, etc.)
-- ============================================

-- 1. Add flexible attributes JSONB to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';

-- 2. GIN index for JSONB containment queries (@>)
-- This enables: .contains('attributes', { make: 'BMW' })
CREATE INDEX IF NOT EXISTS idx_products_attributes 
  ON public.products USING GIN (attributes);

-- 3. Expression indexes for common attribute filters
-- These enable fast scalar lookups like: attributes->>'make' = 'BMW'
CREATE INDEX IF NOT EXISTS idx_products_attr_make 
  ON public.products ((attributes->>'make')) 
  WHERE attributes->>'make' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_year 
  ON public.products (((attributes->>'year')::int)) 
  WHERE attributes->>'year' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_brand 
  ON public.products ((attributes->>'brand')) 
  WHERE attributes->>'brand' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_condition 
  ON public.products ((attributes->>'condition')) 
  WHERE attributes->>'condition' IS NOT NULL;

-- 4. Add display_order to categories for mega-menu sorting
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_categories_display_order 
  ON public.categories (display_order);

-- 5. Ensure attributes is always an object (not array/null)
ALTER TABLE public.products
  ADD CONSTRAINT IF NOT EXISTS products_attributes_is_object
  CHECK (jsonb_typeof(attributes) = 'object' OR attributes = '{}');

-- 6. Add helpful comments
COMMENT ON COLUMN public.products.attributes IS 
  'Denormalized JSONB attributes for fast filtering. Example: {"make": "BMW", "model": "3 Series", "year": 2020}. Source of truth: product_attributes table (EAV).';

COMMENT ON COLUMN public.categories.display_order IS 
  'Sort order for mega-menu display. Lower numbers appear first.';
```

### Run the Migration:

```bash
# Option 1: Push directly to remote Supabase
supabase db push

# Option 2: Apply to local database first
supabase migration up

# Option 3: Reset local and test from scratch
supabase db reset
```

**Done. That's all the SQL you need.**

---

## Phase 2: TypeScript Types (10 min)

### `lib/types/product-attributes.ts`

```typescript
// Shipping - matches existing database booleans
export interface ProductShipping {
  ships_to_bulgaria: boolean;
  ships_to_europe: boolean;
  ships_to_usa: boolean;
  ships_to_worldwide: boolean;
  pickup_only: boolean;
}

// Helper to check if product ships to user's region
export function productShipsToRegion(
  shipping: ProductShipping, 
  userCountryCode: string
): boolean {
  if (shipping.ships_to_worldwide) return true;
  if (shipping.pickup_only) return false;
  
  // Bulgaria
  if (userCountryCode === 'BG') return shipping.ships_to_bulgaria;
  
  // USA
  if (userCountryCode === 'US') return shipping.ships_to_usa;
  
  // European countries
  const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'RO', 'AT', 'BE', 'GR', 'PT', 'CZ', 'HU', 'SE', 'DK', 'FI', 'SK', 'IE', 'HR', 'SI', 'LT', 'LV', 'EE', 'CY', 'LU', 'MT'];
  if (euCountries.includes(userCountryCode)) return shipping.ships_to_europe;
  
  return false;
}

// Base attributes (all products)
export interface BaseAttributes {
  brand?: string;
  condition?: 'new' | 'used' | 'refurbished';
}

// Vehicle attributes
export interface VehicleAttributes extends BaseAttributes {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission?: 'manual' | 'automatic';
  body_type?: string;
  color?: string;
}

// Product with new attributes column
export interface ProductWithAttributes {
  id: string;
  title: string;
  price: number;
  // ... existing fields
  attributes: VehicleAttributes | BaseAttributes;
  // Shipping booleans (already in DB)
  ships_to_bulgaria: boolean;
  ships_to_europe: boolean;
  ships_to_usa: boolean;
  ships_to_worldwide: boolean;
  pickup_only: boolean;
}
```

---

## Phase 3: Data Fetching with Supabase (Next.js 16 Best Practices)

### Server Component Data Fetching

Use **direct Supabase queries in Server Components**. No API routes needed for reads.

```typescript
// app/[locale]/products/page.tsx
import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

// Wrap with React cache for request deduplication
const getProducts = cache(async (filters: {
  category?: string;
  shipsToEurope?: boolean;
  shipsToWorldwide?: boolean;
  make?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const supabase = await createClient();
  
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false })
    .limit(50);

  // Category filter
  if (filters.category) {
    query = query.eq('categories.slug', filters.category);
  }

  // Shipping region filter - use existing boolean columns
  if (filters.shipsToEurope) {
    query = query.or('ships_to_europe.eq.true,ships_to_worldwide.eq.true');
  }
  if (filters.shipsToWorldwide) {
    query = query.eq('ships_to_worldwide', true);
  }

  // Attribute filters - use PostgREST JSONB containment
  if (filters.make) {
    query = query.contains('attributes', { make: filters.make });
  }

  // Price filters
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  
  const products = await getProducts({
    category: params.category,
    shipsToEurope: params.ships_to_europe === 'true',
    shipsToWorldwide: params.ships_to_worldwide === 'true',
    make: params.make,
    minPrice: params.min_price ? Number(params.min_price) : undefined,
    maxPrice: params.max_price ? Number(params.max_price) : undefined,
  });

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Key Points:
1. **No API route** - Server Components can query Supabase directly
2. **React `cache()`** - Deduplicates identical requests in the same render
3. **PostgREST operators** - Use `.contains()`, `.or()`, `.cs.` instead of RPC
4. **Static rendering by default** - Next.js 16 caches this at build time

---

## Phase 4: Streaming with Suspense

For slow queries, use Suspense to stream in results:

```typescript
// app/[locale]/products/page.tsx
import { Suspense } from 'react';
import ProductList from '@/components/product-list';
import ProductListSkeleton from '@/components/product-list-skeleton';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList filters={params} />
      </Suspense>
    </div>
  );
}
```

```typescript
// components/product-list.tsx
import { getProducts } from '@/lib/data/products';

export default async function ProductList({ 
  filters 
}: { 
  filters: Record<string, string | undefined> 
}) {
  const products = await getProducts(filters);
  
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

---

## Phase 5: Revalidation Strategies

### Time-Based Revalidation

For product listings that change occasionally:

```typescript
// lib/data/products.ts
export const getProducts = cache(async (filters: Filters) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .limit(50);
  
  return data;
});

// In your page.tsx - revalidate every 60 seconds
export const revalidate = 60;
```

### On-Demand Revalidation

When a product is updated, revalidate the cache:

```typescript
// app/actions/products.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateProduct(id: string, data: ProductUpdate) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id);
  
  if (error) throw error;
  
  // Revalidate the product page and listings
  revalidatePath(`/products/${id}`);
  revalidatePath('/products');
}
```

---

## Phase 6: Translations (Use next-intl, NOT Database)

### ❌ DON'T: Store translations in database JSONB

```sql
-- BAD: This duplicates next-intl and doesn't scale
name_translations JSONB DEFAULT '{"en": "", "bg": ""}'
```

### ✅ DO: Use next-intl messages files

```json
// messages/en.json
{
  "categories": {
    "automotive": "Automotive",
    "vehicles": "Vehicles", 
    "cars": "Cars"
  },
  "shipping": {
    "BG": "Bulgaria",
    "EU": "Europe",
    "US": "United States",
    "UK": "United Kingdom",
    "WORLDWIDE": "Worldwide"
  }
}
```

```json
// messages/bg.json
{
  "categories": {
    "automotive": "Автомобили",
    "vehicles": "Превозни средства",
    "cars": "Коли"
  },
  "shipping": {
    "BG": "България",
    "EU": "Европа",
    "US": "САЩ",
    "UK": "Великобритания",
    "WORLDWIDE": "По целия свят"
  }
}
```

```typescript
// components/category-name.tsx
import { useTranslations } from 'next-intl';

export function CategoryName({ slug }: { slug: string }) {
  const t = useTranslations('categories');
  return <span>{t(slug)}</span>;
}
```

---

## Phase 7: Static Data (Vehicle Makes/Models)

For reference data that rarely changes, use **static TypeScript files**, not database tables:

```typescript
// lib/data/vehicle-makes.ts
export const VEHICLE_MAKES = [
  { id: 'bmw', name: 'BMW', country: 'Germany', popular: true },
  { id: 'mercedes', name: 'Mercedes-Benz', country: 'Germany', popular: true },
  { id: 'audi', name: 'Audi', country: 'Germany', popular: true },
  { id: 'volkswagen', name: 'Volkswagen', country: 'Germany', popular: true },
  { id: 'toyota', name: 'Toyota', country: 'Japan', popular: true },
  { id: 'honda', name: 'Honda', country: 'Japan', popular: true },
  { id: 'ford', name: 'Ford', country: 'USA', popular: true },
  { id: 'renault', name: 'Renault', country: 'France', popular: true },
  { id: 'peugeot', name: 'Peugeot', country: 'France', popular: false },
  { id: 'skoda', name: 'Škoda', country: 'Czech Republic', popular: true },
  { id: 'hyundai', name: 'Hyundai', country: 'South Korea', popular: true },
  { id: 'kia', name: 'Kia', country: 'South Korea', popular: true },
  // ... add more as needed
] as const;

export const VEHICLE_MODELS: Record<string, string[]> = {
  bmw: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7'],
  mercedes: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS'],
  audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8'],
  volkswagen: ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'T-Roc', 'ID.3', 'ID.4'],
  toyota: ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'C-HR', 'Hilux'],
  honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz'],
  ford: ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma', 'Mustang'],
  renault: ['Clio', 'Megane', 'Captur', 'Kadjar', 'Scenic'],
  peugeot: ['208', '308', '3008', '5008', '508'],
  skoda: ['Fabia', 'Octavia', 'Superb', 'Kodiaq', 'Kamiq'],
  hyundai: ['i10', 'i20', 'i30', 'Tucson', 'Santa Fe', 'Kona'],
  kia: ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Niro'],
};

export function getPopularMakes() {
  return VEHICLE_MAKES.filter(m => m.popular);
}

export function getModelsForMake(makeId: string) {
  return VEHICLE_MODELS[makeId] ?? [];
}
```

**Why not database tables?**
- Vehicle makes/models rarely change
- No user can edit them
- Static imports = 0 database queries
- TypeScript autocomplete for free
- Easier to maintain in git

---

## Phase 8: User Region Detection

Detect user's country to filter products that ship to their region:

```typescript
// lib/hooks/useUserCountry.ts
'use client';

import { useState, useEffect } from 'react';

export type UserRegion = 'bulgaria' | 'europe' | 'usa' | 'worldwide';

export function useUserCountry(): { country: string; region: UserRegion } {
  const [country, setCountry] = useState<string>('BG');

  useEffect(() => {
    // Read from cookie set by proxy.ts middleware
    const cookies = document.cookie.split(';');
    const countryCookie = cookies.find(c => c.trim().startsWith('user-country='));
    const countryCode = countryCookie?.split('=')[1]?.trim() || 'BG';
    setCountry(countryCode);
  }, []);

  // Map country code to shipping region
  const getRegion = (code: string): UserRegion => {
    if (code === 'BG') return 'bulgaria';
    if (code === 'US') return 'usa';
    const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'RO', 'AT', 'BE', 'GR', 'PT', 'CZ', 'HU', 'SE', 'DK', 'FI'];
    if (euCountries.includes(code)) return 'europe';
    return 'worldwide';
  };

  return { country, region: getRegion(country) };
}

// Usage in components
export function useShippingFilter() {
  const { region } = useUserCountry();
  
  // Build filter params based on user region
  const getShippingFilters = () => {
    switch (region) {
      case 'bulgaria':
        return { ships_to_bulgaria: true };
      case 'europe':
        return { ships_to_europe: true }; // Will also match ships_to_worldwide
      case 'usa':
        return { ships_to_usa: true };
      default:
        return { ships_to_worldwide: true };
    }
  };

  return getShippingFilters();
}
```

---

## Phase 9: Production Security (Essential)

### Server Action Authentication

**Always verify auth in Server Actions** - RLS protects data, but auth checks prevent unnecessary DB roundtrips and give better error messages:

```typescript
// app/actions/products.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema validates BEFORE hitting the database
const ProductUpdateSchema = z.object({
  title: z.string().min(3).max(200),
  price: z.number().positive().max(1_000_000),
  attributes: z.object({
    brand: z.string().max(100).optional(),
    make: z.string().max(100).optional(),
    model: z.string().max(100).optional(),
    year: z.number().int().min(1900).max(2030).optional(),
    condition: z.enum(['new', 'used', 'refurbished']).optional(),
  }).passthrough(), // Allow additional category-specific attributes
  // Shipping booleans (already exist in DB)
  ships_to_bulgaria: z.boolean().default(true),
  ships_to_europe: z.boolean().default(false),
  ships_to_usa: z.boolean().default(false),
  ships_to_worldwide: z.boolean().default(false),
  pickup_only: z.boolean().default(false),
});

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();
  
  // 1. Auth check FIRST (prevents unnecessary DB calls)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  // 2. Parse and validate input
  const rawData = {
    title: formData.get('title'),
    price: Number(formData.get('price')),
    attributes: JSON.parse(formData.get('attributes') as string || '{}'),
    ships_to_bulgaria: formData.get('ships_to_bulgaria') === 'true',
    ships_to_europe: formData.get('ships_to_europe') === 'true',
    ships_to_usa: formData.get('ships_to_usa') === 'true',
    ships_to_worldwide: formData.get('ships_to_worldwide') === 'true',
    pickup_only: formData.get('pickup_only') === 'true',
  };

  const validated = ProductUpdateSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  // 3. Update (RLS ensures user owns the product)
  const { error: dbError } = await supabase
    .from('products')
    .update(validated.data)
    .eq('id', productId);

  if (dbError) {
    console.error('Product update failed:', { productId, userId: user.id, error: dbError.message });
    return { error: 'Failed to update product' };
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath('/products');
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Product delete failed:', { productId, userId: user.id });
    return { error: 'Failed to delete product' };
  }

  revalidatePath('/products');
  return { success: true };
}
```

### Why This Pattern?

| Step | Purpose |
|------|---------|
| Auth check first | Fails fast, no DB call if unauthorized |
| Zod validation | Type-safe, good error messages, prevents malformed JSONB |
| RLS as backup | Defense in depth - even if auth check is bypassed |
| Error logging | Basic observability without external dependencies |

---

## Phase 10: Error Boundaries (Required)

Every production app needs error boundaries. Without them, one error crashes the entire page:

```typescript
// app/[locale]/products/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error service (Sentry, LogRocket, etc.)
    // For now, just console.error is fine
    console.error('Products page error:', error.digest, error.message);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">
        We couldn't load the products. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

```typescript
// app/[locale]/products/[id]/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Product page error:', error.digest);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <p className="text-muted-foreground">
        This product may have been removed or doesn't exist.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="outline">Try again</Button>
        <Button asChild>
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    </div>
  );
}
```

```typescript
// app/[locale]/products/[id]/not-found.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <p className="text-muted-foreground">
        The product you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/products">Browse products</Link>
      </Button>
    </div>
  );
}
```

---

## Phase 11: Database Constraints (Defense in Depth)

Add simple constraints to catch invalid data at the database level:

```sql
-- Add to migration: supabase/migrations/20250101_product_attributes.sql

-- Ensure attributes is an object (not array/null)
ALTER TABLE public.products
  ADD CONSTRAINT products_attributes_is_object
  CHECK (jsonb_typeof(attributes) = 'object');

-- Note: Shipping columns are already booleans with proper defaults
-- No additional constraints needed for shipping
```

**Note:** Keep constraints simple. Complex validation (like checking every value in a JSONB) belongs in application code (Zod), not SQL.

---

## Phase 12: Supabase Production Checklist

Before going live, verify these in your [Supabase Dashboard](https://supabase.com/dashboard):

### Security
- [ ] **RLS enabled** on all tables (`schema.sql` already does this ✓)
- [ ] **SSL Enforcement** enabled (Database → Settings)
- [ ] **Email confirmations** enabled (Auth → Settings)
- [ ] **MFA enabled** on your Supabase account
- [ ] Run **Security Advisor** (Database → Security Advisor)

### Performance  
- [ ] **Indexes** exist for common queries (migration adds GIN indexes ✓)
- [ ] Run **Performance Advisor** (Database → Performance Advisor)
- [ ] Enable **PITR** if database > 4GB (Settings → Add-ons)

### Auth
- [ ] **OTP expiry** set to 3600s or less (Auth → Settings)
- [ ] **Custom SMTP** configured for auth emails (Auth → SMTP Settings)

### Environment
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in production
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in production
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (server-side only, never exposed)

---

## Summary: What Changed

### Removed (Over-Engineering):
| Item | Why Removed |
|------|-------------|
| 6 PL/pgSQL functions | PostgREST handles filtering |
| JSONB translations in DB | Use next-intl instead |
| `vehicle_makes` table | Static TypeScript data |
| `vehicle_models` table | Static TypeScript data |
| `shipping_regions` table | Use existing boolean columns |
| `compute_category_path()` trigger | Not needed |
| `compute_category_level()` trigger | Not needed |
| `search_products_with_shipping` RPC | PostgREST `.or()` + `.contains()` |
| 4 separate API routes | Server Components query directly |

### Added (Best Practices):
| Item | Why Added |
|------|-----------|
| 1 column on products (`attributes JSONB`) | Minimal schema change |
| 1 column on categories (`display_order`) | Mega-menu sorting |
| PostgREST filters | Built-in, optimized |
| React `cache()` | Request deduplication |
| Suspense streaming | Better UX |
| Static vehicle data | Zero queries |
| next-intl translations | Existing i18n system |
| Server Action auth checks | Fast-fail pattern |
| Zod validation | Type-safe input validation |
| Error boundaries | Graceful error handling |
| DB constraints | Defense in depth |
| Production checklist | Deployment reference |

### Kept (Already Working):
| Item | Why Kept |
|------|----------|
| `ships_to_bulgaria` boolean | Already exists, simple filtering |
| `ships_to_europe` boolean | Already exists, simple filtering |
| `ships_to_usa` boolean | Already exists, simple filtering |
| `ships_to_worldwide` boolean | Already exists, simple filtering |
| `pickup_only` boolean | Already exists, simple filtering |
| `category_attributes` table | Dynamic form field definitions |
| `product_attributes` table | EAV for full attribute management |

---

## Time Comparison

| Original Plan | Simplified Plan |
|--------------|-----------------|
| 10-19 hours | 2-4 hours |
| 800+ lines of SQL | ~15 lines of SQL |
| 6 PL/pgSQL functions | 0 functions |
| 4 new tables | 0 new tables |
| 4 API routes | 0 API routes (Server Components) |
| New shipping schema | Use existing boolean columns |

---

## Checklist

### Phase 1-8: Core Implementation
- [ ] Run migration: `supabase db push`
- [ ] Create `lib/types/product-attributes.ts`
- [ ] Create `lib/data/vehicle-makes.ts`
- [ ] Add category translations to `messages/en.json` and `messages/bg.json`
- [ ] Update product form to save `attributes` JSONB
- [ ] Update product queries to use PostgREST `.contains()` filter
- [ ] Add `useUserCountry` hook for shipping detection
- [ ] Test filtering by make, year, shipping booleans, price

### Phase 9-12: Production Readiness
- [ ] Add Zod schemas for Server Actions
- [ ] Add auth checks to all Server Actions
- [ ] Create error boundary files (`error.tsx`, `not-found.tsx`)
- [ ] Add database constraints
- [ ] Complete Supabase production checklist

---

**Document Status:** ✅ Production Ready  
**Last Updated:** December 2025
