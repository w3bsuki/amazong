# 02. Shadcn Component Overrides (Technical/Tight)

**Role:** Frontend Architect
**Context:** Overriding Shadcn defaults to achieve a "Technical/Industrial" aesthetic with reduced rounding and tighter hit-boxes.

## 1. Button (`components/ui/button.tsx`)

**Design Goal:** Rectangular, precise, tactile.

*   **Radius:** `rounded-md` (6px) or `rounded-sm` (4px). Never `rounded-full` (except icons).
*   **Height:** Keep `h-10` or `h-11` for density.
*   **Styling:** 
    *   `font-medium`
    *   `tracking-tight`
    *   `active:translate-y-[1px]` (Mechanical click feel)

```tsx
// Variant: Outline (Technical)
"border border-input bg-background hover:bg-accent hover:text-accent-foreground"
```

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:opacity-90",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 shadow-sm", // Solid Black
        outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-gray-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2", // Taller than standard shadcn
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## 2. Input (`components/ui/input.tsx`)

**Design Goal:** Structured data entry.

*   **Background:** `bg-secondary/50` (Very subtle grey).
*   **Border:** `border-input`.
*   **Radius:** `rounded-md` (6px).
*   **Text:** `text-sm` or `text-base` (depending on device).
*   **Font:** `text-[16px]` to prevent iOS auto-zoom.

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[16px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-gray-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

## 3. Card (`components/ui/card.tsx`)

**Design Goal:** Data containment units.

*   **Shadow:** **NONE.** `shadow-none`.
*   **Border:** `border border-border`.
*   **Radius:** `rounded-lg` (6px).
*   **Spacing:** Reduce default padding. Use `p-4` instead of `p-6`.

## 4. Badge / Tag

*   **Radius:** `rounded-sm` (2px - very square).
*   **Text:** `uppercase text-[10px] tracking-wider`.
*   **Padding:** `px-1.5 py-0.5`.

## 5. Separator

*   **Color:** `bg-border`.
*   **Usage:** Use frequently to delineate sections in high-density layouts.

## 6. Sheet / Drawer (`components/ui/sheet.tsx`)

*   Use `Vaul` (Drawer) for mobile instead of the standard side-sheet if possible, OR style the Sheet to slide from bottom.
*   **Style:** Rounded top corners (`rounded-t-xl`).
*   **Backdrop:** Darker than default (`bg-black/40`).
