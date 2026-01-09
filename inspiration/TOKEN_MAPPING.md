# Treido → Amazong Token Mapping

This maps treido-mock's hardcoded Tailwind classes to our semantic token system.

## Color Mapping

| Treido-Mock Class | Amazong Semantic Token | Notes |
|-------------------|------------------------|-------|
| `bg-white` | `bg-background` | Page/card backgrounds |
| `bg-gray-50` | `bg-muted` or `bg-input` | Input fields, subtle surfaces |
| `bg-gray-100` | `bg-muted/50` | Hover states |
| `bg-gray-900` | `bg-foreground` | Primary buttons (inverted) |
| `text-gray-900` | `text-foreground` | Primary text, headings |
| `text-gray-500` | `text-muted-foreground` | Secondary/meta text |
| `text-gray-400` | `text-muted-foreground/70` | Placeholder, disabled |
| `text-white` | `text-background` | On dark buttons |
| `border-gray-100` | `border-border/50` | Subtle dividers |
| `border-gray-200` | `border-border` | Standard borders |
| `border-gray-300` | `border-border` | Input borders |

## Touch Target Mapping

| Treido-Mock | Amazong Token | Pixels |
|-------------|---------------|--------|
| `h-10` (40px) | `h-touch` | 32px (our dense version) |
| `h-11` (44px) | `h-touch-lg` | 36px (primary CTA) |
| `h-12` (48px) | `min-h-11` | 44px (use sparingly) |
| `h-[42px]` | `h-touch-lg` | 36px (our compact) |
| `h-[48px]` | `min-h-11` | 44px |
| `h-[56px]` | `min-h-14` | 56px (sheet headers) |

## Typography Mapping

| Treido-Mock | Amazong Token | Notes |
|-------------|---------------|-------|
| `text-[11px]` | `text-xs` or `text-2xs` | 12px/10px (micro labels) |
| `text-[13px]` | `text-sm` | 14px (body) |
| `text-[14px]` | `text-sm` | 14px |
| `text-[15px]` | `text-sm` | 14px |
| `text-[16px]` | `text-base` | 16px (prices, emphasis) |
| `text-[17px]` | `text-base` | 16px |
| `text-[22px]` | `text-xl` | 20px (prices) |
| `font-bold` | `font-semibold` | We prefer 600 over 700 |
| `font-extrabold` | `font-bold` | 700 only for prices |

## Spacing Mapping

| Treido-Mock | Amazong | Notes |
|-------------|---------|-------|
| `gap-3` | `gap-2` | Mobile default |
| `gap-4` | `gap-3` | Desktop default |
| `gap-6` | `gap-4` | Section spacing (rare) |
| `px-4` | `px-2` or `px-3` | Edge padding (denser) |
| `py-4` | `py-3` | Section padding |
| `py-6` | `py-4` | Large section |

## Border Radius Mapping

| Treido-Mock | Amazong Token | Pixels |
|-------------|---------------|--------|
| `rounded-md` | `rounded-md` | 4px |
| `rounded-lg` | `rounded-md` | 4px (we're tighter) |
| `rounded-xl` | `rounded-lg` | 6px |
| `rounded-full` | `rounded-full` | Pills, avatars |
| `rounded-t-xl` | `rounded-t-lg` | Sheet corners |

## Interactive States Mapping

| Treido-Mock | Amazong |
|-------------|---------|
| `active:opacity-90` | `active:opacity-90` ✓ |
| `active:scale-[0.99]` | **Don't use** — we disable scale |
| `active:bg-gray-100` | `active:bg-muted/50` |
| `hover:bg-gray-100` | `hover:bg-muted/40` |
| `focus:border-gray-900` | `focus:border-ring` |
| `focus:ring-0` | `focus-visible:outline-none` |

## Component Pattern Translations

### Button (Treido → Amazong)
```tsx
// Treido
"bg-gray-900 text-white font-bold text-[15px] rounded-lg h-[48px]"

// Amazong
"bg-foreground text-background font-semibold text-sm rounded-md h-11"
```

### Input (Treido → Amazong)
```tsx
// Treido
"bg-gray-50 border-gray-200 text-[16px] h-12 rounded-lg"

// Amazong
"bg-input border-border text-base h-10 rounded-md"
```

### Chip/Pill Active (Treido → Amazong)
```tsx
// Treido
"bg-gray-900 text-white border-gray-900"

// Amazong
"bg-foreground text-background border-foreground"
```

### Chip/Pill Inactive (Treido → Amazong)
```tsx
// Treido
"bg-white text-gray-700 border-gray-200"

// Amazong
"bg-background text-muted-foreground border-border/60"
```

### Sticky Header (Treido → Amazong)
```tsx
// Treido
"bg-white/95 backdrop-blur-xl border-b border-gray-100"

// Amazong
"bg-background/90 backdrop-blur-md border-b border-border/50"
```

### Bottom Sheet (Treido → Amazong)
```tsx
// Treido
"bg-black/40 backdrop-blur-sm" (overlay)
"bg-white rounded-t-xl" (sheet)

// Amazong
"bg-black/40 backdrop-blur-sm" (overlay) ✓
"bg-card rounded-t-lg" (sheet)
```

## Safe Area Utilities

| Treido-Mock | Amazong |
|-------------|---------|
| `pb-safe` | `pb-safe` ✓ (we have this) |
| `pt-safe-top` | `pt-safe` (add if missing) |
| `pb-safe-bottom` | `pb-safe` ✓ |

---

## Summary

The treido-mock patterns translate directly to our system, but with **tighter/denser values**:

1. **Colors** → Use semantic tokens instead of hardcoded grays
2. **Touch targets** → Our 32-36px vs their 40-48px
3. **Typography** → Our 14px body vs their 16px
4. **Spacing** → Our gap-2/gap-3 vs their gap-3/gap-4
5. **Radius** → Our 4px vs their 6-8px

This maintains our "dense marketplace" aesthetic while following treido's structural patterns.
