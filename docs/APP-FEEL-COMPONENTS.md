# APP-FEEL-COMPONENTS.md — Component Specifications

> **Detailed component specs for app-like UI.** Each component shows TradeSphere reference, Treido target, and implementation notes.

---

## Table of Contents

1. [ListingCard](#1-listingcard)
2. [BottomNav](#2-bottomnav)
3. [StickyHeader](#3-stickyheader)
4. [SellDrawer](#4-selldrawer)
5. [FormInputs](#5-forminputs)
6. [SelectionCards](#6-selectioncards)
7. [FloatingButtons](#7-floatingbuttons)
8. [Badges](#8-badges)

---

## 1. ListingCard

### TradeSphere Reference
```tsx
<article 
  onClick={handleClick}
  className="relative bg-card rounded-xl overflow-hidden shadow-card cursor-pointer tap-highlight"
>
  {/* Image */}
  <div className="relative aspect-square">
    <img 
      src={listing.image} 
      alt={listing.title}
      className="w-full h-full object-cover"
      loading="lazy"
    />
    
    {/* Save button - floating */}
    <button 
      onClick={(e) => { e.stopPropagation(); onSave?.(listing.id); }}
      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center tap-highlight"
    >
      <Heart className={`w-4 h-4 ${listing.isSaved ? "fill-primary text-primary" : "text-foreground"}`} />
    </button>

    {/* Badge overlay */}
    {listing.isPromoted && (
      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
        Promoted
      </Badge>
    )}
  </div>

  {/* Content */}
  <div className="p-3">
    {/* Price - largest, boldest */}
    <p className="font-bold text-lg text-foreground">
      {listing.currency}{listing.price.toLocaleString()}
    </p>
    
    {/* Title - secondary */}
    <h3 className="text-sm text-foreground line-clamp-1 mt-0.5">
      {listing.title}
    </h3>

    {/* Location - tertiary */}
    <div className="flex items-center gap-1 mt-1.5">
      <MapPin className="w-3 h-3 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{listing.location}</span>
    </div>

    {/* Seller - separated */}
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
      <img 
        src={listing.seller.avatar} 
        className="w-5 h-5 rounded-full object-cover"
      />
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        {listing.seller.name}
        {listing.seller.verified && <Verified className="w-3 h-3 text-primary" />}
      </span>
    </div>
  </div>
</article>
```

### Key Patterns

| Element | Pattern | Notes |
|---------|---------|-------|
| Container | `rounded-xl shadow-card tap-highlight` | Light shadow, no border |
| Image | `aspect-square object-cover lazy` | Consistent ratios |
| Save button | `bg-card shadow-sm` | Solid floating |
| Price | `font-bold text-lg` | Hierarchy anchor |
| Title | `text-sm line-clamp-1` | Truncated |
| Location | `text-xs text-muted-foreground` | With icon |
| Seller | `border-t pt-2 mt-2` | Separated section |

### Treido Alignment Checklist

- [ ] Add `tap-highlight` to card container
- [ ] Use `shadow-card` instead of border
- [ ] Floating save button with solid `bg-card`
- [ ] Badge positioned top-left with `text-2xs`
- [ ] Price→Title→Location hierarchy
- [ ] Seller section with separator

---

## 2. BottomNav

### Clean E-commerce Pattern
```tsx
<nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border safe-bottom">
  <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
    {navItems.map((item) => {
      const Icon = item.icon;
      const isSell = item.label === "Sell";
      const isActive = item.path === location.pathname;
      
      return (
        <button
          key={item.label}
          onClick={() => handleClick(item)}
          className={`flex flex-col items-center justify-center gap-0.5 tap-highlight ${
            isSell ? "relative -mt-4" : "py-2 px-4"
          }`}
        >
          {isSell ? (
            // Floating Action Button
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
          ) : (
            <>
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </>
          )}
        </button>
      );
    })}
  </div>
</nav>
```

### Key Patterns

| Element | Pattern | Notes |
|---------|---------|-------|
| Container | `fixed bottom-0 bg-background border-t safe-bottom` | Solid white |
| Height | `h-16` (64px) | Comfortable touch |
| Icon size | `w-5 h-5` | 20px |
| Label | `text-[10px]` (use `text-2xs`) | Compact |
| Active state | `text-primary` | Color only |
| FAB | `w-12 h-12 -mt-4 shadow-lg` | Elevated center |

### Treido Implementation Notes

1. **Existing:** Treido has a bottom nav - use solid `bg-background`
2. **Add:** FAB pattern for "Sell" button
3. **Verify:** Safe area handling (`safe-bottom`)
4. **Check:** Icon/label spacing is consistent

---

## 3. StickyHeader

### Clean E-commerce Pattern
```tsx
<header className="sticky top-0 z-40 bg-background border-b border-border safe-top">
  <div className="flex items-center justify-between px-4 h-14">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">T</span>
      </div>
      <span className="font-semibold text-lg text-foreground">Treido</span>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-1">
      <button className="p-2.5 rounded-full tap-highlight hover:bg-accent">
        <Search className="w-5 h-5 text-foreground" />
      </button>
      <button className="p-2.5 rounded-full tap-highlight hover:bg-accent relative">
        <Bell className="w-5 h-5 text-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
      </button>
      <button className="p-2.5 rounded-full tap-highlight hover:bg-accent">
        <MessageCircle className="w-5 h-5 text-foreground" />
      </button>
      <Avatar className="w-8 h-8 ml-1">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  </div>
</header>
```

### Key Patterns

| Element | Pattern | Notes |
|---------|---------|-------|
| Container | `sticky top-0 bg-background border-b safe-top` | Solid white |
| Height | `h-14` (56px) | Compact |
| Icon buttons | `p-2.5 rounded-full tap-highlight` | 44px touch target |
| Notification dot | `absolute top-1.5 right-1.5 w-2 h-2 bg-primary` | Small indicator |
| Avatar | `w-8 h-8` | 32px |

### Sub-page Header (with back button)
```tsx
<header className="sticky top-0 z-40 bg-background border-b border-border safe-top">
  <div className="flex items-center gap-3 px-4 py-3">
    <button onClick={() => router.back()} className="tap-highlight">
      <ArrowLeft className="w-6 h-6 text-foreground" />
    </button>
    <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
  </div>
</header>
```

---

## 4. SellDrawer

### TradeSphere Reference
```tsx
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="bottom" className="h-[95vh] rounded-t-3xl p-0 flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-border">
      <button
        onClick={currentStep === 0 ? handleClose : handleBack}
        className="p-2 -ml-2 rounded-full hover:bg-accent tap-highlight"
      >
        {currentStep === 0 ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-foreground" />
        )}
      </button>

      <div className="text-center">
        <h2 className="font-semibold text-foreground">{STEPS[currentStep]}</h2>
        <p className="text-xs text-muted-foreground">
          Step {currentStep + 1} of {STEPS.length}
        </p>
      </div>

      <div className="w-9" /> {/* Spacer for alignment */}
    </div>

    {/* Progress bar */}
    <div className="h-1 bg-muted">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
      />
    </div>

    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto">
      {renderStep()}
    </div>

    {/* Sticky footer */}
    <div className="p-4 border-t border-border safe-bottom">
      <button
        onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
        disabled={!canProceed()}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold tap-highlight disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentStep === STEPS.length - 1 ? "Publish Listing" : "Continue"}
      </button>
    </div>
  </SheetContent>
</Sheet>
```

### Key Patterns

| Element | Pattern | Notes |
|---------|---------|-------|
| Container | `h-[95vh] rounded-t-3xl p-0 flex flex-col` | Near full-height sheet |
| Header | 3-column layout: back, title, spacer | Centered title |
| Progress bar | `h-1 bg-muted` + `bg-primary` fill | Thin, animated |
| Content | `flex-1 overflow-y-auto` | Independent scroll |
| Footer | `p-4 border-t safe-bottom` | Sticky CTA |
| CTA button | `w-full py-3.5 rounded-xl` | Full-width, tall |

### Step Content Pattern
```tsx
<div className="p-4 space-y-6">
  {/* Section header */}
  <div className="mb-4">
    <h3 className="font-semibold text-foreground mb-1">Add photos</h3>
    <p className="text-sm text-muted-foreground">
      Add up to 10 photos. The first photo will be the cover.
    </p>
  </div>

  {/* Content grid */}
  <div className="grid grid-cols-3 gap-3">
    {/* items */}
  </div>

  {/* Tips card */}
  <div className="mt-6 p-3 rounded-xl bg-muted">
    <h4 className="font-medium text-sm text-foreground mb-2">Photo tips</h4>
    <ul className="text-xs text-muted-foreground space-y-1">
      <li>• Use good lighting</li>
      <li>• Show multiple angles</li>
      <li>• Include close-ups of details</li>
    </ul>
  </div>
</div>
```

---

## 5. FormInputs

### App-Style Input
```tsx
// Standard input
<input
  type="text"
  className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
  placeholder="Enter text..."
/>

// With icon
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <input className="pl-10 w-full px-4 py-3 rounded-xl bg-muted border-0 ..." />
</div>

// Price input with currency
<div className="flex gap-2">
  <select className="px-4 py-3 rounded-xl bg-muted border-0 text-foreground">
    <option>€</option>
    <option>$</option>
    <option>лв</option>
  </select>
  <input
    type="number"
    className="flex-1 px-4 py-3 rounded-xl bg-muted border-0 text-lg font-semibold"
    placeholder="0"
  />
</div>
```

### Key Differences from Standard Inputs

| Attribute | Standard | App-Style |
|-----------|----------|-----------|
| Border | `border border-input` | `border-0` |
| Background | `bg-background` | `bg-muted` |
| Radius | `rounded-md` | `rounded-xl` |
| Height | `h-10` | `py-3` (~48px) |
| Focus | `ring-ring` | `ring-primary` |

---

## 6. SelectionCards

### Toggle Option (like shipping toggle)
```tsx
<button
  onClick={() => updateValue(!isEnabled)}
  className={`w-full flex items-center justify-between p-4 rounded-xl border tap-highlight ${
    isEnabled
      ? "bg-selected border-selected-border"
      : "bg-card border-border"
  }`}
>
  <div className="flex items-center gap-3">
    <Truck className={`w-5 h-5 ${isEnabled ? "text-primary" : "text-muted-foreground"}`} />
    <div className="text-left">
      <p className={`font-medium ${isEnabled ? "text-primary" : "text-foreground"}`}>
        Shipping available
      </p>
      <p className="text-xs text-muted-foreground">You can ship this item</p>
    </div>
  </div>
  
  {/* iOS-style toggle */}
  <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
    isEnabled ? "bg-primary" : "bg-muted"
  }`}>
    <div className={`w-5 h-5 rounded-full bg-background shadow transition-transform ${
      isEnabled ? "translate-x-5" : "translate-x-0"
    }`} />
  </div>
</button>
```

### Chip Selection (multi-select)
```tsx
<div className="flex flex-wrap gap-2">
  {options.map((option) => (
    <button
      key={option.value}
      onClick={() => toggleOption(option.value)}
      className={`px-3 py-1.5 rounded-full text-sm font-medium tap-highlight ${
        isSelected(option.value)
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground hover:bg-accent"
      }`}
    >
      {option.label}
    </button>
  ))}
</div>
```

### Radio Card Selection
```tsx
<div className="grid grid-cols-2 gap-3">
  {conditions.map((condition) => (
    <button
      key={condition.value}
      onClick={() => setCondition(condition.value)}
      className={`p-3 rounded-xl border tap-highlight text-left ${
        current === condition.value
          ? "bg-selected border-primary"
          : "bg-card border-border"
      }`}
    >
      <span className={`font-medium ${
        current === condition.value ? "text-primary" : "text-foreground"
      }`}>
        {condition.label}
      </span>
      <p className="text-xs text-muted-foreground mt-1">
        {condition.description}
      </p>
    </button>
  ))}
</div>
```

---

## 7. FloatingButtons

### Overlay Save Button
```tsx
<button 
  onClick={(e) => { e.stopPropagation(); handleSave(); }}
  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center tap-highlight"
>
  <Heart className={`w-4 h-4 ${isSaved ? "fill-primary text-primary" : "text-foreground"}`} />
</button>
```

### Floating Back Button (over gallery)
```tsx
<button 
  onClick={() => router.back()}
  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-card shadow-sm flex items-center justify-center tap-highlight z-10"
>
  <ArrowLeft className="w-5 h-5 text-foreground" />
</button>
```

### Cover Badge
```tsx
<span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-2xs font-medium">
  Cover
</span>
```

---

## 8. Badges

### Size Reference

| Type | Size | Class |
|------|------|-------|
| Standard | 12px | `text-xs` |
| Compact | 10px | `text-2xs` or `text-[10px]` |
| Inline | 10px | `text-2xs` |

### TradeSphere Badge Patterns
```tsx
// Promoted badge
<Badge className="bg-primary text-primary-foreground text-2xs px-2 py-0.5">
  Promoted
</Badge>

// Condition badge
<Badge className="bg-foreground text-background text-2xs px-2 py-0.5">
  New
</Badge>

// Status badge
<Badge variant="success" className="text-2xs">
  Verified
</Badge>

// Icon badge
<Badge variant="secondary" className="gap-1 text-2xs">
  <Truck className="w-3 h-3" />
  Free Shipping
</Badge>
```

### Badge Placement

| Context | Position | Classes |
|---------|----------|---------|
| Card image | Top-left | `absolute top-2 left-2` |
| Product detail | Below title | `inline-flex` |
| Nav item | Top-right of icon | `absolute -top-1 -right-1` |
| Photo grid | Bottom-left | `absolute bottom-2 left-2` |

---

## Implementation Quick Wins

### 1. Add to all buttons (global)
```tsx
// Update Button component default classes
className={cn(
  "tap-highlight", // ADD
  // ... existing classes
)}
```

### 2. Update Card shadows
```css
/* In globals.css */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08);
```

### 3. Create mobile-first input variant
```tsx
// In components/ui/input.tsx
const inputVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "border border-input bg-background",
        app: "border-0 bg-muted rounded-xl", // NEW
      }
    }
  }
)
```

---

## Related Documents

- [APP-FEEL-GUIDE.md](./APP-FEEL-GUIDE.md) — Main transformation guide
- [APP-FEEL-CHECKLIST.md](./APP-FEEL-CHECKLIST.md) — Implementation checklist
- [DESIGN.md](./DESIGN.md) — Token SSOT

---

*Last updated: 2026-02-03*

