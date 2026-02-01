# Next.js App Router Decision Tree

Quick decision framework for auditing Next.js patterns in Treido.

## Server vs Client Decision Tree

```
Does this component need...?
├── useState, useEffect, useReducer, useRef with mutations?
│   └── → 'use client' required
├── onClick, onChange, onSubmit, event handlers?
│   └── → 'use client' required
├── Browser APIs (localStorage, window, navigator)?
│   └── → 'use client' required
├── Third-party hooks (useQuery, useForm, etc.)?
│   └── → 'use client' required
├── Only static rendering + data fetching?
│   └── → Server Component ✅ (default, no directive needed)
└── Passing a Promise into a Client Component (and resolving with `use()`)?
    └── → 'use client' required (client-only pattern; in Server Components prefer `await`)
```

## Caching Decision Tree

```
Is this a cached function ('use cache')?
├── Does it call cookies() or headers()?
│   └── ❌ FAIL — Never call request APIs inside cached functions
├── Does it read user-specific data (auth, session)?
│   └── ❌ FAIL — Don't cache user-specific data
├── Does it have cacheLife() profile?
│   └── Missing? → ⚠️ WARN — Add explicit cache profile
├── Does it have cacheTag() for invalidation?
│   └── Missing? → ⚠️ WARN — Add tags for targeted invalidation
└── All good?
    └── ✅ PASS
```

## Cache Invalidation Decision Tree

```
Need to invalidate cached data?
├── Need to invalidate cached data by tag?
│   └── → Use revalidateTag(tag, profile) (Treido convention)
├── Need to invalidate entire path?
│   └── → Use revalidatePath('/path')
└── Need to invalidate all data?
    └── → Avoid if possible; prefer targeted tags
```

## Server Action vs Route Handler

```
What's the use case?
├── Form mutations (create, update, delete)?
│   └── → Server Action ('use server')
├── Webhook endpoint (external service calling us)?
│   └── → Route Handler (route.ts)
├── Public API endpoint?
│   └── → Route Handler (route.ts)
├── File upload/download?
│   └── → Route Handler (route.ts)
└── Real-time / streaming response?
    └── → Route Handler (route.ts)
```

## Import Safety Decision Tree

```
Is this a client component ('use client')?
├── Does it import from 'next/headers'?
│   └── ❌ FAIL — Server-only module in client
├── Does it import from 'next/server'?
│   └── ❌ FAIL — Server-only module in client
├── Does it import 'server-only' marked modules?
│   └── ❌ FAIL — Server-only module in client
├── Does it import Supabase server client?
│   └── ❌ FAIL — Use browser client in client components
└── All imports are client-safe?
    └── ✅ PASS
```

## Treido-Specific Rules

### Request Mutation
```
Where does request mutation happen?
├── In proxy.ts?
│   └── ✅ CORRECT (Treido convention)
├── In a root middleware.ts?
│   └── ⚠️ WARN — Repo convention is proxy.ts; avoid introducing middleware.ts unless explicitly approved
└── Somewhere else?
    └── ❌ FAIL — Consolidate to proxy.ts
```

### Layout Rules
```
Is this a layout.tsx?
├── Does it contain heavy data fetching?
│   └── ⚠️ WARN — Keep layouts minimal; fetch in page.tsx
├── Does it contain client-only providers that could be server?
│   └── ⚠️ WARN — Review if provider needs client
└── Is it doing auth checks?
    └── ⚠️ WARN — Auth belongs in proxy.ts or server actions
```

## Severity Classification

| Pattern | Severity | Reason |
|---------|----------|--------|
| cookies()/headers() in cached function | Critical | Data leakage, incorrect caching |
| Server import in client component | Critical | Build will fail |
| Missing 'use client' with hooks | High | Runtime error |
| User data in cached function | High | Security/privacy risk |
| Missing cache profile/tags | Medium | Hard to invalidate |
| root middleware.ts introduced | Medium | Convention drift |
| Heavy fetching in layout | Low | Performance |

## Quick Regex Checks

```bash
# Client boundary locations
rg -n "\"use client\"" app components

# Cache directives
rg -n "'use cache'|\"use cache\"" app lib

# Cache utilities
rg -n "\\b(cacheLife|cacheTag|revalidateTag|revalidatePath)\\b" app lib

# Request APIs (shouldn't be in cached functions)
rg -n "\\b(cookies|headers)\\(" app lib

# Server-only imports
rg -n "from ['\"]next/headers['\"]|from ['\"]next/server['\"]" app components

# React hooks (need 'use client')
rg -n "\\b(useState|useEffect|useLayoutEffect|useReducer|useRef|useContext)\\b" app --glob "*.tsx"
```
