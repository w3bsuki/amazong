# Caching Reference for Treido Backend

## Cache Directives

### cacheLife Options
```tsx
'use cache';
import { cacheLife } from 'next/cache';

// Predefined profiles
cacheLife('seconds');  // Very short cache
cacheLife('minutes');  // Short cache
cacheLife('hours');    // Medium cache
cacheLife('days');     // Long cache
cacheLife('weeks');    // Very long cache
cacheLife('max');      // Maximum cache duration
```

### cacheTag for Invalidation
```tsx
'use cache';
import { cacheTag } from 'next/cache';

export async function getProducts(category: string) {
  cacheTag('products');           // Global tag
  cacheTag(`products:${category}`); // Specific tag
  // ...
}
```

## Invalidation Patterns

### Tag-based Invalidation
```tsx
import { revalidateTag } from 'next/cache';

// In a Server Action
export async function updateProduct(id: string, data: any) {
  await db.products.update({ where: { id }, data });
  
  // Invalidate all product caches
  revalidateTag('products');
  
  // Or more specific
  revalidateTag(`product:${id}`);
}
```

### Path-based Invalidation
```tsx
import { revalidatePath } from 'next/cache';

export async function updateProduct(id: string, data: any) {
  await db.products.update({ where: { id }, data });
  
  // Invalidate specific paths
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
}
```

## Common Caching Patterns

### Product Listing (Cache by Category)
```tsx
'use cache';

export async function getProductsByCategory(category: string) {
  cacheLife('hours');
  cacheTag('products', `category:${category}`);
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('id, title, price, images')
    .eq('category', category)
    .eq('status', 'active');
  
  return data;
}
```

### User-Specific Data (No Cache or Short Cache)
```tsx
// User carts should not be cached long
'use cache';

export async function getUserCart(userId: string) {
  cacheLife('seconds'); // Very short or don't cache
  cacheTag(`cart:${userId}`);
  
  // ...
}
```

### Static Content (Long Cache)
```tsx
'use cache';

export async function getCategories() {
  cacheLife('days'); // Categories rarely change
  cacheTag('categories');
  
  // ...
}
```

## Anti-Patterns

### DON'T: Access Request Context in Cached Functions
```tsx
'use cache';

// ❌ WRONG - cookies/headers break caching
import { cookies, headers } from 'next/headers';

export async function getData() {
  const sessionCookie = await cookies(); // BREAKS CACHING
  // ...
}

// ✅ CORRECT - pass user ID as parameter
export async function getData(userId: string) {
  cacheTag(`user:${userId}`);
  // ...
}
```

### DON'T: Forget to Tag Cached Data
```tsx
'use cache';

// ❌ WRONG - no tags means no invalidation control
export async function getProducts() {
  cacheLife('hours');
  // Missing cacheTag!
}

// ✅ CORRECT - always tag for invalidation
export async function getProducts() {
  cacheLife('hours');
  cacheTag('products');
}
```

### DON'T: Over-cache Dynamic Data
```tsx
'use cache';

// ❌ WRONG - inventory changes frequently
export async function getInventory() {
  cacheLife('days'); // Too long!
}

// ✅ CORRECT - short cache for dynamic data
export async function getInventory() {
  cacheLife('minutes');
  cacheTag('inventory');
}
```
