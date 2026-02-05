# 06 — Component Specs (marketplace UI that converts)

This section tells the agent exactly what to build and how it should behave.

---

## Component: ProductCard

### Purpose
A product tile for feed/grid + carousel.

### Variants
- `default` — grid tile
- `promoted` — carousel tile (bigger image, promo badge)
- `compact` — list item for search results

### Must show
- Image (aspect ratio consistent)
- Title (line-clamp 2)
- Price (primary emphasis)
- Discount (optional): old price + % off badge
- Rating (optional): stars + count
- Wishlist/like (optional): icon button overlay

### Interaction
- whole card clickable
- press feedback on mobile (scale)
- focus ring visible for keyboard
- wishlist button does NOT trigger navigation

### Visual hierarchy
- Price: `text-base font-semibold`
- Title: `text-sm font-medium text-foreground/90`
- Meta: `text-xs text-muted-foreground`

---

## Component: PromotedBadge / DealBadge

Use `Badge` but with semantic tokens:

- `bg-warning text-warning-foreground`
- or `bg-primary text-primary-foreground` for “Sponsored”

Keep badge compact:
- `rounded-full`
- `px-2 py-0.5`
- `text-[11px] font-semibold`

---

## Component: CategoriesSheet (matches screenshot)

### UX goals
- Opens from menu button.
- Looks like a native iOS sheet.
- Header with title + close button.
- Scrollable content.
- Grid of category icons with labels.
- “See all” action at top.

### Use shadcn primitives
Option A (recommended): `Sheet`  
Option B: `Drawer` (more native on mobile)

Sheet is easier and works great.

### Structure

- `SheetContent side="bottom"` for iOS-like bottom sheet (or `right` for side drawer)
- header: icon + title on left, close on right
- body: categories grid (4 columns on mobile)
- use `ScrollArea` if content is long

### Grid rules
- circular icon button (≥ 44px)
- label below, center aligned
- active/hover state visible

---

## Component: CategoryChipsRow

- horizontal scroll
- pills with subtle border and background
- active pill uses `bg-primary/10 text-primary border-primary/30` (example)

---

## Component: BottomNav (matches screenshot pattern)

### Nav items (5 max)
- Home
- Browse / Listings
- Sell (+)
- Chat
- Profile

### Active indicator
Use ONE:
- a subtle pill behind the active item
- or icon + label color change + small dot

### Central action (Sell)
Make it special:
- circular button
- `bg-primary text-primary-foreground shadow-float`
- raised above nav slightly (optional)

---

## Component: Search

### Search input
- big, rounded-full
- icon inside (left)
- clear button (right) when there’s value
- auto-focus on Search page

### Suggestions
Use `Command` component for results UI (optional).

---

## Component: Filters + Sort (for listings/search pages)

### Filters
Use `Drawer` on mobile, `Sheet` or sidebar on desktop.

Inside filters:
- `Select` for categories
- `Slider` for price range
- `Checkbox` for conditions (new/used)
- `Switch` for “Only local”, etc
- “Apply” sticky button row

### Sort
Use `Select` or `DropdownMenu`:
- Newest
- Price: low to high
- Price: high to low
- Best rated

---

## Component: Feedback & states

### Toasts
Use `Sonner` (shadcn recommends it vs the old toast component).

### Loading
Use `Skeleton` for cards and lists.

### Empty
Use `Empty` component with primary CTA.

---

## Key detail: keep primitives consistent

Every time you are tempted to write a “custom button” with raw `<button>`,
stop and use shadcn `Button` with a variant.

Same for:
- inputs
- sheets/drawers
- badges
- cards

The UI will look consistent immediately.
