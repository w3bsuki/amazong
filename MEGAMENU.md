# Mega Menu Improvement Plan

## Executive Summary

This document outlines the comprehensive audit and improvement plan for the desktop mega-menu component ("Всички категории"). The goal is to create a clean, Alibaba-inspired mega menu that follows Tailwind CSS v4 and shadcn/ui best practices.

---

## Current Issues Identified

### 1. Left Sidebar Styling Problems
- **Ugly glows/shadows**: Uses `shadow-sm` on active items which creates unwanted visual noise
- **Excessive styling**: `border-l-3 border-l-brand` creates heavy visual emphasis
- **Fixed max-height with scroll**: `max-h-[460px] overflow-y-auto` forces scrolling even when there's viewport space
- **Heavy background treatments**: `bg-muted/50` on sidebar and `bg-background` on active items creates too much contrast

### 2. Structural Issues
- **Two-panel layout**: Current design uses sidebar + content panel, but the sidebar is too prominent
- **Scroll requirement**: Categories should expand dynamically to fit available viewport space
- **Missing "View More"**: When categories exceed viewport, there's no pagination or "View More" option

### 3. Tailwind CSS v4 Compatibility
- Uses older patterns like `scrollbar-thin` which may not be Tailwind v4 native
- Color tokens should use CSS variables properly

---

## Alibaba.com Reference Analysis

Alibaba uses a **clean grid dropdown** approach:

### Key Design Patterns:
1. **Grid Layout**: Categories displayed in multi-column grid (not sidebar + content)
2. **Simple Hover States**: Just text color change, no heavy backgrounds or borders
3. **Icon + Label**: Each category has a small icon and text label
4. **No Shadows/Glows**: Completely flat design
5. **Full Height Expansion**: Menu expands to show all categories naturally
6. **Clean Typography**: Simple, consistent font sizing

---

## Proposed Solution

### Option A: Clean Sidebar (Recommended)
Keep the sidebar + content panel layout but with significantly cleaner styling.

### Option B: Grid-Only Layout
Replace sidebar with Alibaba-style grid of all categories.

We'll implement **Option A** with clean styling, as the subcategory cards provide good UX.

---

## Implementation Details

### Phase 1: Remove Visual Clutter

#### Remove from Left Sidebar:
```diff
- "bg-muted/50"
- "shadow-sm" on active items
- "border-l-3 border-transparent" / "border-l-brand"
```

#### Replace with clean styling:
```tsx
// Category item styling
className={cn(
  "flex items-center gap-3 px-4 py-2.5 text-sm",
  "transition-colors duration-150",
  activeCategory?.id === category.id
    ? "bg-accent text-foreground font-medium"
    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
)}
```

### Phase 2: Dynamic Height System

#### Current (Fixed Height):
```tsx
<nav className="max-h-[460px] overflow-y-auto">
```

#### New (Dynamic Height with "View More"):
```tsx
// Constants
const MAX_VISIBLE_CATEGORIES = 12;
const CATEGORY_ITEM_HEIGHT = 44; // px

// State
const [showAll, setShowAll] = useState(false);

// Logic
const visibleCategories = showAll 
  ? categories 
  : categories.slice(0, MAX_VISIBLE_CATEGORIES);
const hasMoreCategories = categories.length > MAX_VISIBLE_CATEGORIES;

// Render
<nav className="py-2">
  {visibleCategories.map((category) => (
    // Category items
  ))}
  {hasMoreCategories && !showAll && (
    <button
      onClick={() => setShowAll(true)}
      className="flex items-center gap-2 px-4 py-2.5 w-full text-sm text-brand hover:text-brand-dark transition-colors"
    >
      <ChevronDown className="size-4" />
      <span>View {categories.length - MAX_VISIBLE_CATEGORIES} more</span>
    </button>
  )}
</nav>
```

### Phase 3: Clean Panel Styling

#### Remove from Mega Menu Panel:
```diff
- "bg-background/95 backdrop-blur-sm"
- "shadow-2xl"
```

#### Replace with:
```tsx
className={cn(
  "fixed left-0 right-0 z-50",
  "bg-background border-b border-border",
  "transition-all duration-200 ease-out origin-top",
  isOpen 
    ? "opacity-100 translate-y-0" 
    : "opacity-0 -translate-y-2 pointer-events-none"
)}
```

### Phase 4: Simplified Category Button Styling

#### Current:
```tsx
<Link
  className={cn(
    "flex items-center gap-3 px-5 py-3 text-sm",
    "cursor-pointer group",
    "border-l-3 border-transparent",
    activeCategory?.id === category.id
      ? "bg-background text-foreground font-medium border-l-brand shadow-sm"
      : "hover:bg-background/80 text-muted-foreground hover:text-foreground"
  )}
>
```

#### New (Clean):
```tsx
<Link
  className={cn(
    "flex items-center gap-3 px-4 py-2.5 text-sm",
    "transition-colors duration-100",
    activeCategory?.id === category.id
      ? "bg-accent text-accent-foreground font-medium"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
  )}
>
```

---

## Styling Reference (Tailwind CSS v4 Best Practices)

### Color Tokens
Use CSS variables for colors:
```css
/* From shadcn/ui */
--accent: oklch(0.97 0 0);
--accent-foreground: oklch(0.205 0 0);
--muted-foreground: oklch(0.556 0 0);
```

### Hover States
Simple, clear hover states without heavy effects:
```tsx
// Good
"hover:bg-accent/50 hover:text-foreground"

// Avoid
"hover:shadow-lg hover:ring-2"
```

### Transitions
Keep transitions subtle and fast:
```tsx
"transition-colors duration-100"
// or
"transition-all duration-150"
```

### Focus States (Accessibility)
```tsx
"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
```

---

## Component Structure Changes

### Before:
```
MegaMenu
├── Trigger Button
├── Mega Menu Panel (fixed, full-width)
│   ├── Left Sidebar (w-72, bg-muted/50, with scroll)
│   │   └── Category Links (with heavy borders/shadows)
│   └── Right Content Panel (flex-1)
│       ├── Category Header
│       └── Subcategory Grid
└── Backdrop Overlay
```

### After:
```
MegaMenu
├── Trigger Button
├── Mega Menu Panel (fixed, full-width, clean)
│   └── Container (flex)
│       ├── Left Sidebar (w-64, clean bg, no scroll unless needed)
│       │   ├── Category Links (minimal styling)
│       │   └── "View More" Button (if needed)
│       └── Right Content Panel (flex-1, bg-background)
│           ├── Category Header (simplified)
│           └── Subcategory Grid (unchanged - cards are good)
└── Backdrop Overlay (subtle)
```

---

## CSS Class Cleanup Summary

### Remove These Classes:
| Class | Reason |
|-------|--------|
| `shadow-sm` | Creates unwanted glow on sidebar items |
| `shadow-2xl` | Too heavy for the panel |
| `border-l-3` | Overly decorative indicator |
| `bg-muted/50` | Too much contrast |
| `backdrop-blur-sm` | Unnecessary effect |
| `scrollbar-thin` | Not Tailwind v4 native |
| `max-h-[460px]` | Forces fixed height |

### Keep/Add These Classes:
| Class | Purpose |
|-------|---------|
| `bg-accent` | Clean highlight for active items |
| `bg-accent/50` | Subtle hover state |
| `transition-colors duration-100` | Quick, clean transitions |
| `border-b border-border` | Subtle panel separator |
| `focus-visible:outline-*` | Accessibility focus states |

---

## Responsive Considerations

- Desktop only (mobile has separate navigation)
- Minimum supported width: 1024px
- Panel should not exceed 80vh in height
- If categories exceed viewport, show "View More" button

---

## Testing Checklist

- [ ] All categories visible or accessible via "View More"
- [ ] Hover states are clean and subtle
- [ ] No shadows or glows on category items
- [ ] Smooth transitions on open/close
- [ ] Subcategory cards maintain their good styling
- [ ] Proper keyboard navigation (Tab, Enter, Escape)
- [ ] Accessible focus indicators
- [ ] Works with both light and dark modes
- [ ] Bulgarian and English text displays correctly

---

## Implementation Priority

1. **HIGH**: Remove shadows/glows from sidebar
2. **HIGH**: Simplify category item styling
3. **MEDIUM**: Implement dynamic height with "View More"
4. **MEDIUM**: Clean up panel styling
5. **LOW**: Fine-tune transitions and animations

---

## Files to Modify

1. `components/mega-menu.tsx` - Main component
2. `app/globals.css` - Any custom scrollbar styles (if present)

---

## Estimated Effort

- Implementation: ~30 minutes
- Testing: ~15 minutes
- Total: ~45 minutes
