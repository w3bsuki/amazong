# TYPESCRIPT BEST PRACTICES AUDIT

## MANDATORY FIRST STEPS - READ DOCS BEFORE ANYTHING

```
1. mcp_context7_resolve-library-id → libraryName: "typescript"
2. mcp_context7_get-library-docs → topics: "strict mode", "best practices", "React"
3. Check tsconfig.json configuration
```

---

## AUDIT SCOPE

### 1. TSCONFIG STRICTNESS
**Check `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "strict": true,                    // MUST be true
    "noUncheckedIndexedAccess": true,  // Recommended
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true // Consider enabling
  }
}
```

**Questions:**
- [ ] Is `strict: true` enabled?
- [ ] Is `noUncheckedIndexedAccess` enabled?
- [ ] Are path aliases configured correctly?
- [ ] Is `moduleResolution` set to `bundler` for Next.js?

### 2. TYPE SAFETY PATTERNS

**Good patterns:**
```typescript
// ✅ Explicit return types for exported functions
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Discriminated unions
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// ✅ Const assertions
const STATUSES = ['pending', 'active', 'done'] as const
type Status = typeof STATUSES[number]

// ✅ Satisfies for type checking without widening
const config = {
  apiUrl: 'https://...',
  timeout: 5000,
} satisfies Config
```

**Anti-patterns:**
```typescript
// ❌ any
function process(data: any) { ... }

// ❌ Type assertions to bypass checking
const user = data as User  // Dangerous if data isn't actually User

// ❌ Non-null assertions without cause
const name = user!.name

// ❌ Implicit any in callbacks
items.map(item => item.value)  // item is any
```

### 3. REACT + TYPESCRIPT

**Component typing:**
```typescript
// ✅ FC with children (when needed)
type Props = {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: Props) { ... }

// ✅ Event handlers
function handleClick(e: React.MouseEvent<HTMLButtonElement>) { ... }
function handleChange(e: React.ChangeEvent<HTMLInputElement>) { ... }

// ✅ Ref typing
const inputRef = useRef<HTMLInputElement>(null)
```

**Questions:**
- [ ] Are component props explicitly typed (not inferred)?
- [ ] Are event handlers properly typed?
- [ ] Are refs typed correctly?
- [ ] Are generic components using proper constraints?

### 4. SUPABASE TYPE GENERATION
**Check for generated types:**
```
types/
├── supabase.ts          # Generated from supabase
└── database.types.ts    # Or this
```

**Usage:**
```typescript
import { Database } from '@/types/supabase'

type Product = Database['public']['Tables']['products']['Row']
type InsertProduct = Database['public']['Tables']['products']['Insert']
```

**Questions:**
- [ ] Are Supabase types generated and up-to-date?
- [ ] Are queries using generated types?
- [ ] Is `supabase.from<'products'>()` typed correctly?

### 5. ZOD SCHEMAS
**Pattern:**
```typescript
import { z } from 'zod'

const ProductSchema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().positive(),
  category_id: z.string().uuid(),
})

type Product = z.infer<typeof ProductSchema>

// Server Action
async function createProduct(data: unknown) {
  const validated = ProductSchema.parse(data)
  // validated is typed!
}
```

**Questions:**
- [ ] Are form inputs validated with Zod?
- [ ] Are API inputs validated?
- [ ] Are schema types inferred (not duplicated)?

### 6. UTILITY TYPES
**Check usage of:**
```typescript
Partial<T>           // All properties optional
Required<T>          // All properties required
Pick<T, K>           // Select properties
Omit<T, K>           // Remove properties
Record<K, V>         // Key-value mapping
ReturnType<F>        // Function return type
Parameters<F>        // Function parameters
Awaited<T>           // Unwrap Promise
```

---

## SPECIFIC SEARCHES

```typescript
// Find any usage
grep_search: ": any|as any|<any>"

// Find non-null assertions
grep_search: "\w+!"

// Find type assertions
grep_search: " as [A-Z]"

// Find missing return types
grep_search: "export function.*\) \{"  // No return type

// Find implicit any callbacks
grep_search: "\.map\(\w+ =>|\.filter\(\w+ =>|\.reduce\(\w+ =>"
```

---

## RUN TYPE CHECKING

```bash
# Full typecheck
pnpm typecheck

# Or directly
pnpm -s exec tsc -p tsconfig.json --noEmit
```

---

## DELIVERABLES

1. **UNSAFE**: `any` usage that should be typed
2. **ASSERTIONS**: Dangerous `as` or `!` usage
3. **MISSING**: Missing return types, untyped callbacks
4. **CONFIG**: tsconfig improvements
5. **SUPABASE**: Type generation issues
6. **FIXES**: Specific type improvements

---

## TYPE SAFETY SCORE

| Category | Score | Notes |
|----------|-------|-------|
| No `any` | ✅/❌ |       |
| Strict mode | ✅/❌ |    |
| Generated DB types | ✅/❌ | |
| Zod validation | ✅/❌ |   |
| Event handlers | ✅/❌ |   |
| Return types | ✅/❌ |     |

---

## QUICK FIXES

```typescript
// Replace any with unknown
function process(data: unknown) {
  if (isProduct(data)) {
    // data is now Product
  }
}

// Type guard
function isProduct(data: unknown): data is Product {
  return typeof data === 'object' && data !== null && 'title' in data
}

// Safe array access
const first = items[0]  // With noUncheckedIndexedAccess: T | undefined
if (first) {
  // first is now T
}
```
