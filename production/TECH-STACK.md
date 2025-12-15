# 🛠️ TECH STACK AUDIT

> **Purpose:** Document and verify all technologies in use  
> **Status:** Production Ready ✅

---

## 📦 CORE FRAMEWORK

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| **Next.js** | 16.0.7 | Full-stack framework | ✅ Latest |
| **React** | 19.0.0 | UI library | ✅ Latest |
| **TypeScript** | Latest | Type safety | ✅ Strict mode |
| **Node.js** | 18+ | Runtime | ✅ Required |

### Next.js 16 Features In Use
- ✅ App Router
- ✅ Server Components (RSC)
- ✅ Cache Components (`cacheComponents: true`)
- ✅ Cache Life Profiles
- ✅ Server Actions
- ✅ Turbopack (dev mode)
- ✅ Image Optimization

---

## 🎨 STYLING

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| **Tailwind CSS** | 4.1.17 | Utility CSS | ✅ v4 with CSS vars |
| **tailwind-merge** | 2.5.5 | Class merging | ✅ |
| **class-variance-authority** | 0.7.1 | Variant styles | ✅ |
| **clsx** | 2.1.1 | Conditional classes | ✅ |
| **tailwindcss-animate** | 1.0.7 | Animations | ✅ |

### CSS Architecture
```
app/globals.css         # Global styles, CSS variables
components/ui/*.tsx     # Component-level styles
```

---

## 🧩 UI COMPONENTS

| Library | Version | Purpose | Components Used |
|---------|---------|---------|-----------------|
| **shadcn/ui** | Latest | Component library | 65+ components |
| **Radix UI** | Various | Accessible primitives | Dialog, Dropdown, etc. |
| **Framer Motion** | 12.23.26 | Animations | Page transitions, modals |
| **Recharts** | 2.15.4 | Charts | Dashboard analytics |

### shadcn/ui Configuration
```json
// components.json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "baseColor": "neutral",
    "cssVariables": true
  }
}
```

---

## 🔐 AUTHENTICATION & BACKEND

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| **Supabase** | 2.84.0 | Backend as a service | ✅ |
| **@supabase/ssr** | 0.8.0 | SSR auth | ✅ |
| **Supabase Auth** | - | Authentication | ✅ PKCE flow |
| **Supabase Storage** | - | File storage | ✅ |
| **Supabase Realtime** | - | Real-time subscriptions | ✅ Chat |

### Supabase Client Architecture
```typescript
// Server clients
createClient()        // Auth (uses cookies)
createStaticClient()  // Cache-safe (no cookies)
createAdminClient()   // Service role (bypass RLS)

// Client
createClientBrowser() // Browser singleton
```

---

## 💳 PAYMENTS

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| **Stripe** | 20.0.0 | Payment processing | ✅ |

### Stripe Integration
- ✅ Checkout Sessions
- ✅ Customer Portal
- ✅ Subscription Management
- ✅ Webhooks (signature verified)
- ✅ Product Boost payments

---

## 📝 FORMS & VALIDATION

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| **React Hook Form** | 7.60.0 | Form state | ✅ |
| **Zod** | 3.25.76 | Schema validation | ✅ |
| **@hookform/resolvers** | 3.10.0 | Zod integration | ✅ |

### Form Pattern
```typescript
const schema = z.object({...});
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
});
```

---

## 🌍 INTERNATIONALIZATION

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| **next-intl** | 4.1.0 | i18n framework | ✅ |

### Supported Locales
- `en` - English
- `bg` - Bulgarian (primary)

### i18n Files
```
messages/
├── en.json      # English translations
└── bg.json      # Bulgarian translations
```

---

## 🖼️ IMAGES & MEDIA

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| **sharp** | 0.34.5 | Image processing | ✅ |
| **react-dropzone** | 14.3.8 | File uploads | ✅ |

### Image Optimization
```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  remotePatterns: [/* configured */]
}
```

---

## 🎭 ICONS

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| **@phosphor-icons/react** | 2.1.10 | Primary icons | ✅ |
| **lucide-react** | 0.560.0 | Additional icons | ✅ |
| **@tabler/icons-react** | 3.35.0 | Supplementary | ⚠️ Review usage |

### Icon Usage
```typescript
// Optimized imports
import { Icon } from '@phosphor-icons/react';
// next.config.ts: optimizePackageImports: ['@phosphor-icons/react']
```

---

## 📅 DATE & TIME

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| **date-fns** | 4.1.0 | Date formatting | ✅ |

### Usage
```typescript
import { format, formatDistance } from 'date-fns';
// Optimized imports in next.config.ts
```

---

## 🧪 DEVELOPMENT TOOLS

| Tool | Version | Purpose | Status |
|------|---------|---------|--------|
| **ESLint** | 9.39.1 | Linting | ✅ Flat config |
| **TypeScript** | Latest | Type checking | ✅ |
| **PostCSS** | 8.5.6 | CSS processing | ✅ |
| **@next/bundle-analyzer** | 16.0.5 | Bundle analysis | ✅ |

---

## 📦 UNUSED DEPENDENCIES (TO REMOVE)

These were identified by Knip audit and are safe to remove:

```json
{
  "@dnd-kit/core": "NOT USED",
  "@dnd-kit/modifiers": "NOT USED",
  "@dnd-kit/sortable": "NOT USED",
  "@dnd-kit/utilities": "NOT USED",
  "@radix-ui/react-collapsible": "NOT USED",
  "@radix-ui/react-context-menu": "NOT USED",
  "@radix-ui/react-menubar": "NOT USED",
  "@tanstack/react-table": "NOT USED",
  "@vercel/analytics": "NOT USED",
  "embla-carousel": "NOT USED",
  "embla-carousel-autoplay": "NOT USED",
  "embla-carousel-react": "NOT USED",
  "input-otp": "NOT USED",
  "marked": "NOT USED",
  "react-day-picker": "NOT USED",
  "react-markdown": "REVIEW",
  "react-resizable-panels": "NOT USED",
  "remark-breaks": "NOT USED",
  "remark-gfm": "NOT USED",
  "shiki": "NOT USED",
  "use-stick-to-bottom": "NOT USED"
}
```

---

## 🔧 CONFIGURATION FILES

| File | Purpose | Format |
|------|---------|--------|
| `next.config.ts` | Next.js configuration | TypeScript |
| `tsconfig.json` | TypeScript configuration | JSON |
| `eslint.config.mjs` | ESLint flat config | ESM |
| `postcss.config.mjs` | PostCSS for Tailwind | ESM |
| `components.json` | shadcn/ui config | JSON |
| `package.json` | Dependencies & scripts | JSON |

---

## ✅ TECH STACK HEALTH CHECK

```markdown
✅ Framework: Modern, latest versions
✅ Type Safety: TypeScript strict mode
✅ Styling: Tailwind v4 with best practices
✅ Backend: Supabase with RLS enabled
✅ Payments: Stripe with webhook verification
✅ Forms: React Hook Form + Zod
✅ i18n: next-intl properly configured
✅ Build: Passes without errors

⚠️ Cleanup Needed:
- 21 unused dependencies
- 92 unused files
- Console.log statements
```

---

*Tech stack verified with: package.json, Next.js MCP, Context7*
