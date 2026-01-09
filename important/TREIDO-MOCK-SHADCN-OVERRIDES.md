# Treido Mock — Shadcn Component Overrides

> Overriding Shadcn defaults to achieve a "Technical/Industrial" aesthetic with reduced rounding and tighter hit-boxes.

---

## Design Philosophy

**Goal:** Rectangular, precise, tactile components that feel native and utilitarian.

| Aspect | Default Shadcn | Treido Override |
|--------|----------------|-----------------|
| **Radius** | `rounded-lg` | `rounded-md` (6px) or `rounded-sm` (4px) |
| **Shadows** | `shadow-sm` to `shadow-lg` | `shadow-none` + borders |
| **Height** | `h-9` / `h-10` | `h-10` to `h-12` (44px touch target) |
| **Focus Ring** | Complex ring system | Simplified or removed |
| **Active State** | Default | `active:opacity-90` (no scale) |

---

## 1. Button (`components/ui/button.tsx`)

**Design Goal:** Rectangular, precise, tactile.

### Changes:
- Remove `ring-offset`, remove complex focus rings
- Add `active:opacity-90` or `active:translate-y-[1px]` (mechanical click feel)
- Ensure default size is tall enough (`h-10` or `h-12`)
- Never use `rounded-full` (except icons)

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base: Remove ring-offset, add active state
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:opacity-90",
  {
    variants: {
      variant: {
        // Solid Black (Primary)
        default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 shadow-none border border-zinc-900",
        // Outline (Secondary)
        outline: "border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-900 shadow-none",
        // Ghost
        ghost: "hover:bg-zinc-100 hover:text-zinc-900",
        // Link
        link: "text-zinc-900 underline-offset-4 hover:underline",
        // Destructive
        destructive: "bg-red-500 text-white hover:bg-red-500/90 shadow-none",
      },
      size: {
        default: "h-11 px-4 py-2",  // Taller than standard shadcn
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10 rounded-md", // Not rounded-full
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Usage Examples:

```tsx
// Primary Button (Dark)
<button className="h-[44px] px-4 rounded-md bg-zinc-900 text-white font-bold text-[14px] active:opacity-90 transition-opacity shadow-none">
  Buy Now
</button>

// Secondary Button (Outline)
<button className="h-[44px] px-4 rounded-md border border-zinc-200 bg-white text-zinc-900 font-bold text-[14px] active:bg-zinc-50 transition-colors shadow-none">
  Cancel
</button>

// Ghost Button
<button className="p-2 text-zinc-900 active:bg-zinc-100 rounded-md transition-colors">
  <Settings className="w-5 h-5 stroke-[1.5]" />
</button>
```

---

## 2. Input (`components/ui/input.tsx`)

**Design Goal:** Structured data entry with subtle gray background.

### Changes:
- Background: `bg-zinc-50` (light gray, not white) to distinguish from page
- Font: `text-[16px]` to prevent iOS auto-zoom
- Focus: Simple border color change, no rings
- Radius: `rounded-md` (6px)

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-[16px] placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Usage Examples:

```tsx
// Standard Input
<input 
  type="text" 
  placeholder="Search..." 
  className="w-full h-12 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[16px] focus:border-zinc-900 focus:outline-none transition-colors placeholder:text-zinc-400"
/>

// Price Input (Large)
<div className="relative">
  <input 
    type="number" 
    placeholder="0.00" 
    className="w-full h-[52px] pl-4 pr-12 bg-white border border-zinc-200 rounded-md text-[22px] font-bold text-zinc-900 focus:border-zinc-900 focus:ring-0 transition-colors placeholder:text-zinc-300 outline-none"
  />
  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[16px] font-bold text-zinc-400">лв.</span>
</div>
```

---

## 3. Card (`components/ui/card.tsx`)

**Design Goal:** Flat data containment units.

### Changes:
- Shadow: **NONE** — `shadow-none`
- Border: `border border-border`
- Radius: `rounded-md` (6px) or `rounded-lg` (max)
- Spacing: Reduce default padding. Use `p-3` or `p-4` instead of `p-6`

```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-md border border-border bg-card text-card-foreground shadow-none",
        className
      )}
      {...props}
    />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("p-4", className)} // Reduced from p-6
      {...props} 
    />
  )
);
```

### Usage Examples:

```tsx
// Product Card
<div className="border border-border rounded-md bg-white overflow-hidden shadow-none">
  <div className="aspect-square bg-secondary relative">
    <img src="..." className="w-full h-full object-cover" />
  </div>
  <div className="p-2.5">
    <h3 className="text-sm font-medium leading-tight truncate">Title</h3>
    <p className="text-xs text-muted-foreground mt-1">Meta</p>
    <div className="mt-2 text-sm font-bold">120 лв.</div>
  </div>
</div>

// Info Card
<div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-none">
  {/* Content */}
</div>
```

---

## 4. Badge / Tag

**Design Goal:** Very square, technical labels.

### Changes:
- Radius: `rounded-sm` (2px - very square)
- Text: `uppercase text-[10px] tracking-wider font-bold`
- Padding: `px-1.5 py-0.5`

```tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-white",
        secondary: "bg-zinc-100 text-zinc-900",
        outline: "border border-zinc-300 text-zinc-700",
        destructive: "bg-red-500 text-white",
        success: "bg-green-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

### Usage Examples:

```tsx
// Product Tag
<span className="px-1.5 py-0.5 bg-zinc-900 text-white text-[10px] font-bold uppercase rounded-sm">
  TOP
</span>

// Status Badge
<span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-sm">
  NEW
</span>
```

---

## 5. Separator

**Design Goal:** Clear delineation between sections.

### Changes:
- Color: `bg-border` (zinc-200)
- Usage: Frequent in high-density layouts

```tsx
// Horizontal
<div className="h-[1px] bg-border w-full" />

// Or using border
<div className="border-b border-border" />

// Vertical (in flex containers)
<div className="h-4 w-[1px] bg-border mx-1 flex-shrink-0" />
```

---

## 6. Sheet / Drawer (`components/ui/sheet.tsx`)

**Design Goal:** Native-feeling bottom sheets.

### Changes:
- Use bottom sheet pattern for mobile
- Rounded top corners: `rounded-t-xl`
- Backdrop: Darker than default (`bg-black/40`)
- No scale animations

```tsx
// Sheet Container (Bottom Sheet)
<div className="fixed inset-0 z-[100] flex justify-center items-end" role="dialog">
  {/* Backdrop */}
  <div 
    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
    onClick={onClose}
  />
  
  {/* Sheet Content */}
  <div className="relative w-full max-w-[430px] bg-white h-[92vh] rounded-t-xl flex flex-col shadow-none animate-in slide-in-from-bottom duration-300">
    {/* Header */}
    <div className="flex items-center justify-between px-4 h-[56px] border-b border-zinc-100 flex-shrink-0">
      <button onClick={onClose} className="text-zinc-500 active:opacity-50">
        <X className="w-6 h-6" />
      </button>
      <h2 className="text-[16px] font-bold text-zinc-900">Title</h2>
      <button className="text-[14px] font-bold text-zinc-400">
        Reset
      </button>
    </div>
    
    {/* Scrollable Content */}
    <div className="flex-1 overflow-y-auto">
      {/* Content */}
    </div>
    
    {/* Sticky Footer */}
    <div className="border-t border-zinc-100 p-4 pb-safe bg-white flex-shrink-0">
      <button className="w-full h-[48px] bg-zinc-900 text-white font-bold text-[15px] rounded-lg active:opacity-90">
        Apply
      </button>
    </div>
  </div>
</div>
```

---

## 7. Radio / Checkbox Selection

**Design Goal:** Clean, circular selections with filled state.

```tsx
// Radio Option
<label className="flex items-center justify-between py-2.5 cursor-pointer active:opacity-60">
  <span className={`text-[15px] ${selected ? 'text-zinc-900 font-semibold' : 'text-zinc-600'}`}>
    Option Label
  </span>
  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
    selected 
      ? 'border-zinc-900 bg-zinc-900' 
      : 'border-zinc-300 bg-white'
  }`}>
    {selected && <Check className="w-3 h-3 text-white stroke-[3]" />}
  </div>
</label>
```

---

## 8. Toggle / Switch

```tsx
<label className="flex items-center justify-between cursor-pointer">
  <span className="text-[15px] text-zinc-900">Enable Notifications</span>
  <div className={`w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-zinc-900' : 'bg-zinc-300'}`}>
    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
  </div>
</label>
```

---

## Override Checklist

When installing a new shadcn component, apply these changes:

- [ ] Replace `shadow-sm` / `shadow-md` with `shadow-none`
- [ ] Add `border border-border` if removing shadow
- [ ] Change `rounded-lg` to `rounded-md` (or `rounded-sm` for badges)
- [ ] Replace `ring-offset` focus styles with simple border change
- [ ] Add `active:opacity-90` for touch feedback
- [ ] Ensure minimum height of `h-10` or `h-11` for buttons
- [ ] Use `text-[16px]` for inputs to prevent iOS zoom
- [ ] Reduce padding from `p-6` to `p-4` or `p-3`

---

## Class Mappings

| Original Shadcn | Treido Override |
|-----------------|-----------------|
| `shadow-sm` | `shadow-none border border-border` |
| `shadow-md` | `shadow-none border border-border` |
| `rounded-lg` | `rounded-md` |
| `rounded-xl` | `rounded-lg` |
| `h-9` (button) | `h-10` or `h-11` |
| `p-6` (card) | `p-4` |
| `focus:ring-2` | `focus:border-zinc-900` |
| `active:scale-95` | `active:opacity-90` |
