# Phase D — Provider & Context Simplification

> **Scope:** Simplify over-engineered React contexts.
> **Read `refactor/shared-rules.md` first.**

---

## Target 1: Drawer Context (358 lines → ~120)

**Read:** `components/providers/drawer-context.tsx`

### Problem
- 6 separate boolean states for 6 drawers
- 18 `useCallback` wrappers (open/close/toggle × 6)
- Analytics tracking for every open/close
- Storybook mock support baked in
- `useMemo` with 18-item dependency array

### Solution

Replace with a single-drawer-at-a-time pattern:

```tsx
type DrawerName = "cart" | "account" | "messages" | "auth" | "categoryBrowse" | "quickView"

const DrawerContext = createContext<{
  active: DrawerName | null
  open: (name: DrawerName) => void
  close: () => void
}>()
```

**Steps:**
1. Read every consumer of DrawerContext — `grep -rn "useDrawer\|DrawerContext\|DrawerProvider" app/ components/ --include="*.tsx" -l`
2. Map which drawers can be open simultaneously (almost certainly none — opening one closes others)
3. If confirmed single-at-a-time → flatten to `active` + `open(name)` + `close()`
4. If some can co-exist → use `Set<DrawerName>` instead of single active
5. Move analytics tracking (if needed) to a single `useEffect` that fires when `active` changes
6. Remove Storybook mock — if Storybook needs mocking, it should use its own decorator
7. Update all consumers

**Expected reduction:** ~200 lines

## Target 2: Header Context (113 lines → ~40 or deleted)

**Read:** `components/providers/header-context.tsx`

### Problem
Manages 4 header variants (homepage, contextual, product, profile) in a global context. This could be prop-driven — each layout already knows which header to render.

### Steps
1. Read every consumer — how is `useHeaderContext` used?
2. If consumers just read a `headerType` value → this is over-engineering. The layout can pass the header variant as a prop or just render the right header directly.
3. If consumers WRITE header state (e.g., changing header type dynamically) → context may be justified. Evaluate if the writes can be eliminated.

**Expected reduction:** ~70 lines (or 113 if deleted entirely)

## Target 3: Currency Context (81 lines → evaluate)

**Read:** `components/providers/currency-context.tsx`

### Question
Bulgaria joined the Eurozone. Is the EUR/BGN toggle still needed?

### Steps
1. Read the context — what does it provide?
2. `grep -rn "useCurrency\|CurrencyContext\|CurrencyProvider" app/ components/ --include="*.tsx" -l` — how many consumers?
3. If <3 consumers and Bulgaria is EUR-only → candidate for removal
4. If actively used → keep, but evaluate if it could be a simple hook instead of a provider

**Decision needed from human if removal is considered.**

## Verification

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

## Output

Log in `refactor/lean-sweep/extractions.md`:
- Contexts simplified (before/after line counts)
- Consumers updated (count + files)
- Contexts removed (if any — with human approval)
