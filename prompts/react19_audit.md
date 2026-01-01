# REACT 19 BEST PRACTICES AUDIT

## MANDATORY FIRST STEPS - READ DOCS BEFORE ANYTHING

```
1. mcp_context7_resolve-library-id → libraryName: "react"
2. mcp_context7_get-library-docs → topics: "React 19", "Server Components", "use", "Actions"
3. mcp_context7_get-library-docs → topics: "useOptimistic", "useFormStatus", "useActionState"
```

---

## REACT 19 KEY FEATURES

### New Hooks
```typescript
// useActionState - replaces useFormState
const [state, action, isPending] = useActionState(serverAction, initialState)

// useFormStatus - form submission status
const { pending, data, method, action } = useFormStatus()

// useOptimistic - optimistic updates
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn)

// use() - read promises/context in render
const data = use(promise)
const theme = use(ThemeContext)
```

### Actions
```typescript
// Form actions
<form action={serverAction}>

// Button formAction
<button formAction={deleteAction}>Delete</button>

// Async transitions
startTransition(async () => {
  await serverAction()
})
```

---

## AUDIT SCOPE

### 1. HOOK USAGE PATTERNS
**Check for deprecated patterns:**
```typescript
// ❌ OLD: useFormState (React 18)
import { useFormState } from 'react-dom'

// ✅ NEW: useActionState (React 19)
import { useActionState } from 'react'
```

**Search:**
```typescript
grep_search: "useFormState|useActionState|useOptimistic|useFormStatus"
```

### 2. SERVER COMPONENTS
**Questions:**
- [ ] Are components server-first by default?
- [ ] Is `"use client"` only on interactive components?
- [ ] Are async components using `await` directly?
- [ ] Is `use()` hook used for data in client components?

**Good pattern:**
```typescript
// Server Component (default)
async function ProductList() {
  const products = await fetchProducts() // Direct await!
  return <ul>{products.map(...)}</ul>
}

// Client Component (explicit)
"use client"
function AddToCart({ productId }) {
  const [isPending, startTransition] = useTransition()
  // Interactive logic
}
```

### 3. FORM HANDLING
**React 19 way:**
```typescript
"use client"
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>
}

function MyForm() {
  const [state, action, isPending] = useActionState(createItem, null)
  
  return (
    <form action={action}>
      <input name="title" />
      <SubmitButton />
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

**Check for:**
- [ ] Are forms using `action` prop (not `onSubmit` with `e.preventDefault`)?
- [ ] Is `useFormStatus` used for loading states?
- [ ] Is `useActionState` used for form state?

### 4. OPTIMISTIC UPDATES
**Pattern:**
```typescript
"use client"
import { useOptimistic } from 'react'

function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  )
  
  async function handleAdd(formData) {
    const newTodo = { title: formData.get('title') }
    addOptimistic(newTodo)
    await addTodo(newTodo)
  }
  
  return (
    <form action={handleAdd}>
      {optimisticTodos.map(todo => (
        <li style={{ opacity: todo.pending ? 0.5 : 1 }}>{todo.title}</li>
      ))}
    </form>
  )
}
```

### 5. DOCUMENT METADATA
**React 19 way (no next/head needed):**
```typescript
function BlogPost({ post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <article>{post.content}</article>
    </>
  )
}
```

### 6. CONTEXT USAGE
**New `use()` for context:**
```typescript
// Can now be used conditionally!
function Component({ showTheme }) {
  if (showTheme) {
    const theme = use(ThemeContext)
    return <div style={{ color: theme.primary }}>...</div>
  }
  return <div>No theme</div>
}
```

### 7. REF HANDLING
**React 19 - ref as prop:**
```typescript
// ✅ NEW: ref is a regular prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

// No more forwardRef needed!
```

**Search for forwardRef:**
```typescript
grep_search: "forwardRef"
```

---

## ANTI-PATTERNS TO FIND

```typescript
// ❌ Manual form state
const [isLoading, setIsLoading] = useState(false)
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  // ...
}

// ❌ useEffect for data fetching in RSC-compatible code
useEffect(() => {
  fetch('/api/data').then(...)
}, [])

// ❌ forwardRef when not needed (React 19)
const Button = forwardRef((props, ref) => ...)

// ❌ useFormState (deprecated name)
const [state, action] = useFormState(...)
```

---

## SPECIFIC SEARCHES

```typescript
// Find old form patterns
grep_search: "e\.preventDefault|onSubmit.*handleSubmit"

// Find forwardRef (might not be needed)
grep_search: "forwardRef"

// Find data fetching in useEffect
grep_search: "useEffect.*fetch\(|useEffect.*supabase"

// Find form hooks
grep_search: "useFormState|useActionState|useFormStatus"
```

---

## DELIVERABLES

1. **DEPRECATED**: Patterns that have React 19 replacements
2. **WRONG**: Anti-patterns in current code
3. **MISSING**: New React 19 features not being used
4. **REFACTOR**: Components that should use new patterns
5. **FIXES**: Specific code changes needed

---

## QUICK MIGRATION CHECKLIST

- [ ] Replace `useFormState` → `useActionState`
- [ ] Add `useFormStatus` for submit buttons
- [ ] Consider `useOptimistic` for mutations
- [ ] Remove unnecessary `forwardRef`
- [ ] Convert manual form handling to `action` prop
- [ ] Use `use()` for context in conditionals
- [ ] Move data fetching to Server Components

---

## COMPATIBILITY NOTES

React 19 with Next.js 16:
- Server Components are the default
- Client Components need `"use client"`
- Server Actions work with form `action` prop
- `useActionState` replaces `useFormState` from `react-dom`
