# Phase 2 — Agent 1: Client Boundary Audit (components/)

> **Scope:** Remove unnecessary `"use client"` from `components/`
> **Read `refactor/shared-rules.md` first.**

---

## The Rule

A component NEEDS `"use client"` ONLY if it **directly** uses:
- `useState`, `useReducer`, `useEffect`, `useLayoutEffect`, `useCallback`, `useMemo`
- `useRef` with DOM mutation (not just forwarding)
- `useContext`, `createContext`
- Event handlers bound in JSX: `onClick`, `onChange`, `onSubmit`, `onKeyDown`, `onScroll`, `onFocus`, `onBlur`, `onMouseEnter`, etc.
- Browser APIs: `window`, `document`, `navigator`, `localStorage`, `sessionStorage`, `IntersectionObserver`, `ResizeObserver`
- `useTranslations()` from next-intl (client-only)
- Third-party client hooks (`useForm`, `useCart`, etc.)

A component does **NOT** need `"use client"` if it:
- Only renders JSX with props (even if it imports a client component — server parents can render client children)
- Only uses `cn()`, utility functions from `lib/`
- Only maps over data and renders children
- Uses `getTranslations()` instead of `useTranslations()` (server-side i18n)

## How to Work

**For each file in `components/` that has `"use client"`:**

1. Read the entire file.
2. Search for the signals above. Does it DIRECTLY use any of them?
3. **If NO** → remove `"use client"`. Run `pnpm -s typecheck` immediately.
4. **If YES but splittable** → can the file be split into a server wrapper + client island? The server part handles layout/data/translations, the client part handles only the interactive bits. This is the **Island Pattern**:
   ```tsx
   // server wrapper (no "use client")
   import { ClientIsland } from "./component-client"
   export function Component({ data }: Props) {
     return <div className="..."><ClientIsland items={data.items} /></div>
   }

   // client island ("use client")
   "use client"
   export function ClientIsland({ items }: { items: Item[] }) {
     const [selected, setSelected] = useState(0)
     return <button onClick={() => setSelected(s => s + 1)}>...</button>
   }
   ```
5. **If YES and can't split** → keep `"use client"`. Move on.

## Priority Order

Most-rendered components first (biggest bundle impact):

1. `components/shared/product/` — product cards, quick views
2. `components/shared/filters/` — filter controls and sections
3. `components/layout/` — header, sidebar
4. `components/mobile/` — drawers, nav, chrome
5. `components/desktop/` — desktop-specific
6. `components/ui/` — shadcn primitives (many legitimately client, but check each)
7. `components/shared/` (remaining), `components/auth/`, `components/providers/`, `components/grid/`, `components/dropdowns/`

## Special Notes

- `components/ui/` components from shadcn mostly use Radix hooks/refs — they likely need `"use client"`. Don't force-remove, but verify each one.
- `components/providers/` are React contexts — they need `"use client"`. Verify but don't expect many removals here.
- When splitting into island pattern, the new client file should be colocated: `component.tsx` (server) + `component-client.tsx` (client).
- If `useTranslations()` is the ONLY reason for `"use client"`, consider refactoring to accept translated strings as props instead, allowing the parent to use server-side `getTranslations()`.

## Verification

After each file change: `pnpm -s typecheck`
After each folder: `pnpm -s typecheck && pnpm -s lint`
After full scope: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

## Output

- `"use client"` directives removed (count + file list)
- Files split into server/client islands (list)
- Files where `"use client"` was kept (brief reason per file)
- Any issues flagged
