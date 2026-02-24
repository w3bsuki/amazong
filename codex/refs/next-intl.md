# next-intl — i18n Reference

## DO

### `getTranslations()` in Server Components
Async function — works in Server Components and server actions.

```tsx
import { getTranslations } from "next-intl/server"

export default async function ProductsPage() {
  const t = await getTranslations("Products")
  return <h1>{t("title")}</h1>
}
```

### `useTranslations()` in Client Components
Synchronous hook — requires `"use client"`.

```tsx
"use client"
import { useTranslations } from "next-intl"

export function SearchBar() {
  const t = useTranslations("Search")
  return <input placeholder={t("placeholder")} />
}
```

### Dynamic values in translations

```tsx
const t = await getTranslations("Profile")
// messages: { "greeting": "Hello, {name}!" }
t("greeting", { name: user.name })
```

### `getTranslations()` in server actions

```tsx
"use server"
import { getTranslations } from "next-intl/server"

export async function loginAction(formData: FormData) {
  const t = await getTranslations("LoginForm")
  const valid = await validateCredentials(formData)
  if (!valid) return { error: t("invalidCredentials") }
}
```

### `setRequestLocale()` in layouts and pages

```tsx
import { setRequestLocale } from "next-intl/server"

export default async function Layout({ params, children }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <div>{children}</div>
}
```

### Navigation from `@/i18n/routing`
Always use locale-aware navigation helpers.

```tsx
import { Link, redirect, usePathname, useRouter } from "@/i18n/routing"

// In a Server Component
redirect("/products")

// In a Client Component
<Link href="/products">{t("browseProducts")}</Link>
```

### `NextIntlClientProvider` in root layout

```tsx
import { NextIntlClientProvider } from "next-intl"

export default async function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

---

## DON'T

### Don't hardcode user-facing strings
Every string shown to users must go through `t()`.

```tsx
// ❌ BAD
<button>Add to Cart</button>

// ✅ GOOD
<button>{t("addToCart")}</button>
```

### Don't import from `next/link`
Use `Link` from `@/i18n/routing` — it handles locale prefixing.

### Don't import from `next/navigation` for redirect/router
Use `redirect`, `useRouter`, `usePathname` from `@/i18n/routing`.

### Don't forget both locales
Every key in `messages/en.json` must exist in `messages/bg.json` and vice versa.

### Don't pass all messages to client
Use selective message passing or let the provider handle it automatically.

---

## OUR SETUP

- **next-intl 4.7.0** with App Router integration
- **Locales:** `en` (default), `bg` — all URLs locale-prefixed
- **Messages:** `messages/en.json`, `messages/bg.json`
- **Routing:** `i18n/routing.ts` — exports `Link`, `redirect`, `usePathname`, `useRouter`
- **Request config:** `i18n/request.ts` via `getRequestConfig()`
- **Plugin:** `next-intl/plugin` in `next.config.ts`
- **Middleware:** i18n routing handled in `proxy.ts`
