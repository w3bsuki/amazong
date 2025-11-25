# 📱 Mobile UX Audit & Fix Plan

**Date:** November 25, 2025  
**Audited URL:** `http://localhost:3001`  
**Viewport:** 375x812 (iPhone X/11/12/13)

---

## 🔴 Critical Issues Found

### 1. **Header Issues**

#### 1.1 Hamburger Button - UGLY
**Problem:** Generic menu icon with no visual polish, too small touch target
**Location:** `components/site-header.tsx`

**Fix:**
```tsx
// Replace the plain hamburger with a better styled version
<Button 
  variant="ghost" 
  className="h-10 w-10 p-0 flex items-center justify-center rounded-lg hover:bg-white/10"
>
  <Menu className="h-6 w-6" strokeWidth={2.5} />
</Button>
```

**Better Solution:** Use shadcn `Sheet` trigger with custom hamburger animation

---

#### 1.2 Cart Icon - TOO SMALL
**Problem:** Cart button barely visible, badge overlapping awkwardly
**Location:** `components/site-header.tsx` lines ~170-180

**Current:**
- Icon: `h-6 w-6` (24px)
- Badge: `w-4 h-4` text `[10px]`

**Fix:**
```tsx
// Increase cart icon size on mobile
<ShoppingCart className="h-7 w-7 md:h-7 md:w-7" />
<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
  {totalItems}
</span>
```

---

#### 1.3 Search Button - SPACING ISSUES
**Problem:** Search button has weird padding, takes too much space with placeholder text showing
**Location:** `components/mobile-search.tsx`

**Current:** Button shows "Търсене в продукти, марки и още..." which is way too long

**Fix:**
```tsx
// Make mobile search trigger more compact
<Button 
  variant="ghost" 
  className="flex-1 h-10 justify-start bg-white/10 rounded-lg px-3 gap-2 max-w-[200px]"
>
  <Search className="h-4 w-4 text-white/70" />
  <span className="text-sm text-white/70 truncate">Търсене...</span>
</Button>
```

---

#### 1.4 Search Dialog - BREAKS LAYOUT
**Problem:** Opens as Sheet from top, creates jarring experience, content scrolls behind
**Location:** `components/mobile-search.tsx`

**Fix - Use shadcn Command component for better UX:**

```bash
pnpm dlx shadcn@latest add command
```

Create a new `MobileSearchCommand.tsx`:
```tsx
"use client"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

// Full-screen command palette style search
// See implementation below
```

---

### 2. **Hero Carousel/Banner - WAY TOO BIG**

#### 2.1 Banner dominates entire viewport
**Problem:** Takes `h-[200px]` on mobile - that's 25% of the screen!
**Location:** `components/hero-carousel.tsx` line ~70

**Current:** `h-[200px] sm:h-[280px] md:h-[360px]`

**Fix:**
```tsx
// Reduce mobile height significantly
<div className="relative h-[140px] sm:h-[200px] md:h-[320px] lg:h-[400px] w-full overflow-hidden">
```

Also reduce text sizes:
```tsx
// Title: from text-2xl to text-xl
<h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">

// CTA Button: smaller on mobile
<Link className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-5 sm:py-2.5 text-[11px] sm:text-sm">
```

---

### 3. **"Пазарувай по категория" Section - TEXT TOO SMALL**

#### 3.1 Category circles text barely readable
**Problem:** Category names at `text-[10px]` are unreadable
**Location:** `components/category-circles.tsx`

**Fix:**
```tsx
// Increase text size
<span className="text-xs sm:text-xs md:text-sm font-medium">

// Also increase circle size for better touch targets
<div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full">
```

---

### 4. **Product Cards - REMOVE BORDERS**

#### 4.1 Cards look chunky with borders
**Problem:** `border border-slate-200` creates visual noise on mobile
**Location:** `components/product-card.tsx`

**Fix - Seamless cards on mobile:**
```tsx
<Card className="bg-white border-0 sm:border sm:border-slate-200 rounded-none sm:rounded overflow-hidden hover:sm:border-blue-400 flex flex-col group relative transition-colors shadow-none sm:shadow-sm">
```

Also consider horizontal scroll layout for mobile instead of grid.

---

### 5. **Secondary Navigation Bar - HORRIBLE OVERFLOW**

#### 5.1 Links overflow and text cuts off
**Problem:** "Днешни офер..." visible in screenshot, text truncated
**Location:** `components/site-header.tsx` nav section

**Fix:**
```tsx
// Hide secondary nav on mobile completely, use bottom tab bar instead
<nav className="hidden sm:block bg-zinc-800 text-sm py-2 px-4">
```

OR make it a proper horizontal scroll with full text:
```tsx
<nav className="bg-zinc-800 text-xs py-2 px-2">
  <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
    {/* Full text, no truncation */}
  </div>
</nav>
```

---

### 6. **Daily Deals Banner - OVERSIZED**

#### 6.1 Red/orange deals banner too prominent
**Problem:** Takes up too much vertical space relative to content
**Location:** Likely in homepage component

**Fix:**
```tsx
// Reduce padding and font sizes on mobile
<div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 sm:p-4 rounded-lg">
  <h2 className="text-base sm:text-lg font-bold">
  // Countdown smaller
  <div className="text-sm sm:text-lg">
```

---

## 🟡 Recommended shadcn Components to Use

### For Search
```bash
pnpm dlx shadcn@latest add command
```
Use `<CommandDialog>` for full-screen mobile search with:
- Keyboard navigation
- Search suggestions
- Categories
- Recent searches

### For Mobile Menu  
Already using `Sheet` ✅ but could improve with `Drawer`:
```bash
pnpm dlx shadcn@latest add drawer
```
`Drawer` from Vaul has better mobile swipe gestures.

### For Product Cards (Optional)
```bash
pnpm dlx shadcn@latest add aspect-ratio
```
Better image handling for seamless cards.

---

## 📋 Implementation Priority

| Priority | Issue | Component | Effort |
|----------|-------|-----------|--------|
| 🔴 P0 | Hero banner too big | `hero-carousel.tsx` | 15 min |
| 🔴 P0 | Search breaks layout | `mobile-search.tsx` | 1 hour |
| 🔴 P0 | Nav bar overflow | `site-header.tsx` | 30 min |
| 🟡 P1 | Category text too small | `category-circles.tsx` | 15 min |
| 🟡 P1 | Cart icon too small | `site-header.tsx` | 10 min |
| 🟡 P1 | Hamburger ugly | `site-header.tsx` | 30 min |
| 🟢 P2 | Product card borders | `product-card.tsx` | 20 min |
| 🟢 P2 | Deals banner size | homepage | 15 min |

---

## 🛠️ Specific Code Changes

### Fix 1: Reduce Hero Carousel Height

```tsx
// components/hero-carousel.tsx
// Change line ~70 from:
<div className="relative h-[200px] sm:h-[280px] md:h-[360px] lg:h-[420px]">
// To:
<div className="relative h-[120px] sm:h-[180px] md:h-[300px] lg:h-[380px]">

// Also update text sizes around line ~85:
<h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold">
```

### Fix 2: Improve Mobile Header

```tsx
// components/site-header.tsx
// Around line 130, update the mobile header layout:

{/* Mobile Header - More compact */}
<div className="flex items-center h-12 md:h-16 px-2 md:px-4 gap-1.5 md:gap-4">
  {/* Hamburger - Bigger touch target */}
  <div className="md:hidden">
    <SidebarMenu className="h-10 w-10" />
  </div>

  {/* Logo - Slightly smaller on mobile */}
  <Link href="/" className="shrink-0">
    <span className="text-lg md:text-2xl font-bold">AMZN</span>
    <div className="w-1 h-1 md:w-2 md:h-2 bg-blue-500 rounded-full"></div>
  </Link>

  {/* Search - Compact trigger */}
  <MobileSearch className="flex-1" />

  {/* Cart - Bigger */}
  <Link href="/cart">
    <Button variant="ghost" className="relative p-2">
      <ShoppingCart className="h-6 w-6" />
      <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {totalItems}
      </span>
    </Button>
  </Link>
</div>
```

### Fix 3: Better Mobile Search with Command

```tsx
// NEW: components/mobile-search-v2.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, Clock, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from "@/i18n/routing"

export function MobileSearchV2() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (value: string) => {
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(value)}`)
  }

  return (
    <>
      {/* Compact trigger button */}
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="flex-1 h-9 justify-start bg-white/10 rounded-lg px-3 gap-2 mx-2 md:hidden"
      >
        <Search className="h-4 w-4 text-white/60" />
        <span className="text-sm text-white/60">Търсене...</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Търсене в продукти..." />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>Няма резултати.</CommandEmpty>
          
          <CommandGroup heading="Популярни">
            <CommandItem onSelect={() => handleSelect("iPhone 15")}>
              <TrendingUp className="mr-2 h-4 w-4" />
              iPhone 15
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("PlayStation 5")}>
              <TrendingUp className="mr-2 h-4 w-4" />
              PlayStation 5
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Категории">
            <CommandItem onSelect={() => router.push("/search?category=electronics")}>
              📱 Електроника
            </CommandItem>
            <CommandItem onSelect={() => router.push("/search?category=computers")}>
              💻 Компютри
            </CommandItem>
            <CommandItem onSelect={() => router.push("/search?category=fashion")}>
              👗 Мода
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
```

### Fix 4: Seamless Product Cards on Mobile

```tsx
// components/product-card.tsx
// Update the Card component classes:

<Card className={cn(
  "bg-white overflow-hidden flex flex-col group relative transition-all",
  // Mobile: No border, no shadow, seamless
  "border-0 rounded-none shadow-none",
  // Desktop: Traditional card styling
  "sm:border sm:border-slate-200 sm:rounded-lg sm:shadow-sm",
  "sm:hover:border-blue-400 sm:hover:shadow-md"
)}>
```

### Fix 5: Hide Secondary Nav on Mobile

```tsx
// components/site-header.tsx
// Around line 180, hide the entire nav on mobile:

<nav className="hidden sm:block bg-zinc-800 text-sm py-2 px-4 border-t border-zinc-700">
  {/* Desktop navigation */}
</nav>
```

---

## 🎯 Quick Wins (Do First)

1. **Reduce banner height** - 5 min change, huge impact
2. **Hide secondary nav on mobile** - Already have tab bar
3. **Increase cart icon size** - Simple CSS change
4. **Increase category text size** - Simple CSS change

---

## 📸 Screenshots Captured

- `mobile-home-1.png` - Initial mobile view showing oversized banner
- `mobile-search-dialog.png` - Search dialog breaking layout
- `mobile-sidebar-menu.png` - Sidebar menu (looks okay)

Location: `.playwright-mcp/` folder

---

## ✅ Checklist

- [ ] Reduce hero carousel height on mobile
- [ ] Fix search to use Command dialog
- [ ] Increase cart icon size
- [ ] Increase category circle text size  
- [ ] Remove product card borders on mobile
- [ ] Hide secondary nav on mobile
- [ ] Reduce daily deals banner size
- [ ] Improve hamburger button styling
- [ ] Add proper touch targets (min 44x44px)
- [ ] Test on real device

---

## 🔧 Commands to Run

```bash
# Add Command component for better search
pnpm dlx shadcn@latest add command

# Optional: Add Drawer for better mobile menu
pnpm dlx shadcn@latest add drawer

# Run audit checklist after changes
# Use shadcn MCP: mcp_shadcn_get_audit_checklist
```
