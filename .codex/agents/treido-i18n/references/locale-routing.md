# Locale Routing Reference

> Navigation APIs, locale-aware links, language switching, and static rendering with next-intl.

## Navigation APIs

All navigation APIs are exported from `@/i18n/routing`:

```typescript
import { Link, redirect, usePathname, useRouter } from '@/i18n/routing'
```

| API | Context | Purpose |
|-----|---------|---------|
| `Link` | Client/Server | Locale-aware anchor element |
| `redirect` | Server | Server-side redirect with locale |
| `usePathname` | Client | Current pathname without locale prefix |
| `useRouter` | Client | Programmatic navigation |

---

## Link Component

### ✅ DO: Use Link from @/i18n/routing

```typescript
import { Link } from '@/i18n/routing'

// Auto-includes current locale
<Link href="/products">Products</Link>
// Renders: /en/products (if current locale is en)

// Switch locale explicitly
<Link href="/products" locale="bg">Продукти</Link>
// Renders: /bg/products
```

### ❌ DON'T: Use next/link directly

```typescript
// Wrong - loses locale context
import Link from 'next/link'
<Link href="/products">Products</Link>  // Renders: /products (no locale!)
```

### ❌ DON'T: Hardcode locale in href

```typescript
// Wrong - hardcoded locale
<Link href="/en/products">Products</Link>

// Correct - let routing handle it
<Link href="/products">Products</Link>
```

---

## Programmatic Navigation

### ✅ DO: Use useRouter from @/i18n/routing

```typescript
'use client'
import { useRouter } from '@/i18n/routing'

function NavigationButton() {
  const router = useRouter()
  
  function handleClick() {
    router.push('/products')           // Navigate in current locale
    router.push('/products', { locale: 'bg' })  // Switch to Bulgarian
    router.replace('/products')        // Replace history entry
    router.back()                      // Go back
  }
  
  return <button onClick={handleClick}>Navigate</button>
}
```

### ❌ DON'T: Use next/navigation directly

```typescript
'use client'
// Wrong - loses locale context
import { useRouter } from 'next/navigation'

function NavigationButton() {
  const router = useRouter()
  router.push('/products')  // No locale prefix!
}
```

---

## Language Switcher

### ✅ DO: Use useLocale + Link

```typescript
'use client'
import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  
  return (
    <div>
      <Link 
        href={pathname} 
        locale="en"
        className={locale === 'en' ? 'active' : ''}
      >
        EN
      </Link>
      <Link 
        href={pathname} 
        locale="bg"
        className={locale === 'bg' ? 'active' : ''}
      >
        БГ
      </Link>
    </div>
  )
}
```

### Alternative: useRouter for programmatic switching

```typescript
'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  
  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale })
  }
  
  return (
    <select value={locale} onChange={(e) => switchLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="bg">Български</option>
    </select>
  )
}
```

---

## Server-Side Redirect

### ✅ DO: Use redirect from @/i18n/routing

```typescript
import { redirect } from '@/i18n/routing'

export default async function Page() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')  // Preserves current locale
  }
  
  // Or redirect to specific locale
  redirect({ href: '/account', locale: 'bg' })
}
```

### ❌ DON'T: Use next/navigation redirect

```typescript
// Wrong - loses locale
import { redirect } from 'next/navigation'
redirect('/auth/login')  // No locale prefix!
```

---

## Static Rendering

### ✅ DO: Call setRequestLocale + generateStaticParams

```typescript
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

// Enable static rendering for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }) {
  const { locale } = await params
  
  // MUST be called before any i18n hooks
  setRequestLocale(locale)
  
  // ... rest of component
}
```

### ❌ DON'T: Forget setRequestLocale

```typescript
// Wrong - opts into dynamic rendering
export default async function Page({ params }) {
  const { locale } = await params
  // Missing setRequestLocale(locale)!
  const t = await getTranslations('Product')
}
```

---

## Locale Validation

### ✅ DO: Use hasLocale for type-safe validation

```typescript
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

// In layout.tsx
if (!hasLocale(routing.locales, locale)) {
  notFound()
}
```

### ✅ DO: Use isValidLocale helper

```typescript
import { isValidLocale, validateLocale } from '@/i18n/routing'

// Type guard
if (isValidLocale(locale)) {
  // locale is now typed as 'en' | 'bg'
}

// With fallback
const safeLocale = validateLocale(unknownLocale)  // Falls back to 'en'
```

---

## Route Structure

```
app/
└── [locale]/                    # Dynamic locale segment
    ├── layout.tsx              # Validates locale, sets html lang
    ├── page.tsx                # Home page
    ├── (main)/                 # E-commerce pages
    ├── (account)/              # Account pages w/ sidebar
    ├── (auth)/                 # Auth flows
    ├── (checkout)/             # Checkout process
    ├── (sell)/                 # Seller management
    └── [username]/             # Public profiles
```

---

## Cookie Behavior

The `NEXT_LOCALE` cookie:

- **Set by**: proxy.ts on first visit (from Accept-Language header)
- **Updated by**: User language preference (via switcher)
- **Duration**: 1 year
- **Used for**: Locale detection on subsequent visits

---

## Related Files

- [docs/10-I18N.md](../../../docs/10-I18N.md) — Full i18n specification
- [setup.md](./setup.md) — Configuration files
- [components.md](./components.md) — React integration patterns
