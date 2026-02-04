# i18n Setup Reference

> Configuration files, routing setup, and TypeScript augmentation for Treido's next-intl 4.x implementation.

## Core Configuration Files

| File | Purpose |
|------|---------|
| `i18n/routing.ts` | Locale routing config, navigation APIs |
| `i18n/request.ts` | Server-side config: messages, formats, timezone |
| `proxy.ts` | Middleware: locale detection, routing, geo-detection |
| `next.config.ts` | Plugin setup via `createNextIntlPlugin()` |

---

## i18n/routing.ts

Defines locale types, validation helpers, and navigation APIs.

### ✅ DO: Use routing exports

```typescript
import { Link, redirect, usePathname, useRouter } from '@/i18n/routing'
import { Locale, locales, isValidLocale, validateLocale } from '@/i18n/routing'
```

### ❌ DON'T: Import from deprecated paths

```typescript
// Wrong - deprecated path
import { Link } from '@/navigation'

// Wrong - loses locale context
import Link from 'next/link'
```

### Type Definitions

```typescript
export type Locale = 'en' | 'bg'
export const locales: readonly Locale[] = ['en', 'bg'] as const

// Type guard
export function isValidLocale(locale: string): locale is Locale

// Validator with fallback
export function validateLocale(locale: string): Locale  // Falls back to 'en'
```

### Routing Configuration

```typescript
export const routing = defineRouting({
  locales: ['en', 'bg'],
  defaultLocale: 'en',
  localePrefix: 'always',        // URLs always include /en/ or /bg/
  localeDetection: true,         // Auto-detect from headers + cookie
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,  // 1 year
    sameSite: 'lax',
    path: '/',
  },
})
```

---

## i18n/request.ts

Server-side request configuration with message loading, formats, and error handling.

### Message Loading

```typescript
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Sofia',
    formats: { /* ... */ },
    onError(error) { /* ... */ },
    getMessageFallback({ namespace, key, error }) { /* ... */ },
  }
})
```

### Global Formats

#### Date/Time Formats

| Format | Pattern | Example |
|--------|---------|---------|
| `short` | day, month short, year | Dec 27, 2025 |
| `long` | weekday, day, month, year | Friday, December 27, 2025 |
| `delivery` | day, month short | Dec 27 |
| `order` | day, month, year, time | Dec 27, 2025, 10:30 AM |

#### Number Formats

| Format | Style | Example |
|--------|-------|---------|
| `currency` | EUR, 2 decimals | €29.99 / 29,99 € |
| `precise` | 1 decimal max | 4.5 |
| `percent` | percentage | 25% |
| `integer` | no decimals | 100 |

#### List Formats

| Format | Type | Example |
|--------|------|---------|
| `enumeration` | conjunction | "A, B, and C" |
| `options` | disjunction | "A, B, or C" |

### ✅ DO: Use global formats

```typescript
const format = useFormatter()

// Use predefined format
format.dateTime(date, 'short')        // Dec 27, 2025
format.number(price, 'currency')      // €29.99
format.list(items, 'enumeration')     // "X, Y, and Z"
```

### ❌ DON'T: Inline format options

```typescript
// Wrong - use global 'short' format instead
format.dateTime(date, {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})
```

---

## proxy.ts

Next.js 16 proxy (renamed from middleware.ts) handles locale routing.

### Responsibilities

1. **Locale routing** via `createMiddleware(routing)`
2. **Geo-detection** sets `user-country` and `user-zone` cookies
3. **Session management** via `updateSession(request, response)`

### ✅ DO: Keep locale logic in proxy.ts

```typescript
// proxy.ts handles:
// - Accept-Language header parsing
// - NEXT_LOCALE cookie reading/writing
// - Locale prefix in URLs (/en/*, /bg/*)
// - Geo-detection (user-country, user-zone)
```

### ❌ DON'T: Create separate middleware.ts

```typescript
// Wrong - proxy.ts is the single entrypoint
// Do not create middleware.ts unless explicitly requested
```

---

## TypeScript Augmentation

For strict typing of locales, messages, and formats.

### global.d.ts

```typescript
import { routing } from '@/i18n/routing'
import { formats } from '@/i18n/request'
import messages from './messages/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
    Formats: typeof formats
  }
}
```

---

## Related Files

- [docs/10-I18N.md](../../../docs/10-I18N.md) — Full i18n specification
- [components.md](./components.md) — React usage patterns
- [locale-routing.md](./locale-routing.md) — Navigation APIs
