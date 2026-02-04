# Components Reference

> React integration patterns for next-intl in Server and Client Components.

## Quick Reference

| Context | Translation Hook | Locale Hook | Formatter |
|---------|-----------------|-------------|-----------|
| Server Component | `getTranslations()` | `getLocale()` | `getFormatter()` |
| Client Component | `useTranslations()` | `useLocale()` | `useFormatter()` |
| Server Action | `getTranslations({ locale })` | — | — |
| Metadata | `getTranslations({ locale, namespace })` | — | — |

---

## Server Components

### ✅ DO: Use setRequestLocale + getTranslations

```typescript
import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // CRITICAL: Enable static rendering - MUST be called first
  setRequestLocale(locale)
  
  const t = await getTranslations('Product')
  
  return <h1>{t('title')}</h1>
}
```

### ✅ DO: Validate locale with hasLocale

```typescript
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Validate against allowed locales
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  
  setRequestLocale(locale)
  
  return <>{children}</>
}
```

### ❌ DON'T: Forget setRequestLocale

```typescript
// Wrong - breaks static rendering
export default async function Page({ params }) {
  const { locale } = await params
  // Missing setRequestLocale(locale)!
  const t = await getTranslations('Product')
  return <h1>{t('title')}</h1>
}
```

### ❌ DON'T: Use useTranslations in Server Components

```typescript
// Wrong - hooks don't work in Server Components
export default async function Page() {
  const t = useTranslations('Product')  // Error!
  return <h1>{t('title')}</h1>
}
```

---

## Client Components

### ✅ DO: Use useTranslations + useLocale

```typescript
'use client'
import { useTranslations, useLocale } from 'next-intl'

export function ProductCard({ product }: Props) {
  const t = useTranslations('Product')
  const locale = useLocale()  // 'en' | 'bg'
  
  return (
    <Card>
      <h3>{product.name}</h3>
      <Button>{t('addToCart')}</Button>
    </Card>
  )
}
```

### ❌ DON'T: Use getTranslations in Client Components

```typescript
'use client'

// Wrong - async functions don't work in client components
export function ProductCard() {
  const t = await getTranslations('Product')  // Error!
  return <Button>{t('addToCart')}</Button>
}
```

---

## Formatters

### Date/Time Formatting

```typescript
import { useFormatter } from 'next-intl'

function OrderDate({ date }: { date: Date }) {
  const format = useFormatter()
  
  // Use predefined formats from request.ts
  return (
    <>
      <span>{format.dateTime(date, 'short')}</span>     {/* Dec 27, 2025 */}
      <span>{format.dateTime(date, 'delivery')}</span>  {/* Dec 27 */}
      <span>{format.dateTime(date, 'order')}</span>     {/* Dec 27, 2025, 10:30 AM */}
    </>
  )
}
```

### Number/Currency Formatting

```typescript
import { useFormatter } from 'next-intl'

function Price({ amount }: { amount: number }) {
  const format = useFormatter()
  
  // Use predefined currency format (EUR)
  return <span>{format.number(amount, 'currency')}</span>  // €29.99
}
```

### ✅ DO: Use global format names

```typescript
// Correct - use predefined format
format.dateTime(date, 'short')
format.number(price, 'currency')
```

### ❌ DON'T: Inline format options

```typescript
// Wrong - should use 'currency' format
format.number(price, {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})
```

---

## Server Actions

### ✅ DO: Pass locale explicitly

```typescript
'use server'
import { getTranslations } from 'next-intl/server'

export async function submitForm(formData: FormData) {
  const t = await getTranslations('Validation')
  
  if (!formData.get('email')) {
    return { error: t('emailRequired') }
  }
  
  return { success: true }
}
```

---

## Metadata

### ✅ DO: Use getTranslations with locale param

```typescript
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  
  return {
    title: t('title'),
    description: t('description'),
  }
}
```

---

## Rich Text

### ✅ DO: Use t.rich() for JSX interpolation

```typescript
const t = useTranslations('Terms')

// Message: "By signing up, you agree to our <link>Terms</link>."
const content = t.rich('agreement', {
  link: (chunks) => <a href="/terms">{chunks}</a>
})
```

### Self-closing tags

```typescript
// Message: "Contact us at <email/> for support."
const content = t.rich('contact', {
  email: () => <a href="mailto:support@treido.com">support@treido.com</a>
})
```

---

## Optional Keys

### ✅ DO: Use t.has() before rendering

```typescript
const t = useTranslations('Promo')

// Only render if key exists
if (t.has('banner')) {
  return <Banner>{t('banner')}</Banner>
}
return null
```

---

## Related Files

- [docs/10-I18N.md](../../../docs/10-I18N.md) — Full i18n specification
- [translations.md](./translations.md) — Message syntax
- [locale-routing.md](./locale-routing.md) — Navigation APIs
