# Agent Technical Guide: Next.js + Tailwind v4 + Shadcn

## 1. Tailwind CSS v4 Configuration
In Tailwind v4, configuration moves to the CSS file.

**File:** `app/globals.css`
```css
@import "tailwindcss";

@theme {
  /* Define the "Invisible Utility" radius */
  --radius-lg: 0.5rem; /* 8px - standard */
  --radius-md: 0.375rem; /* 6px - tighter */
  --radius-sm: 0.25rem; /* 4px */
  
  /* Mobile Safe Areas */
  --spacing-safe-top: env(safe-area-inset-top);
  --spacing-safe-bottom: env(safe-area-inset-bottom);
}

/* Custom Utilities for Native Feel */
@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Tap Highlight Removal for Mobile */
  .tap-transparent {
    -webkit-tap-highlight-color: transparent;
  }
}
```

## 2. Shadcn Component Overrides
When installing shadcn components, modify the `cva` definitions to match the "No Scale" design.

### A. Button (`components/ui/button.tsx`)
*   **Change:** Remove `ring-offset`, remove complex focus rings.
*   **Interaction:** Add `active:opacity-90` or `active:scale-[0.99]` (micro-movement only).
*   **Height:** Ensure default size is tall enough (`h-10` or `h-12`).

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

### B. Input (`components/ui/input.tsx`)
*   **Change:** Background should be `bg-gray-50` (light gray), not white, to distinct from the page background.
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

### C. Sheet / Drawer (`components/ui/sheet.tsx`)
*   Use `Vaul` (Drawer) for mobile instead of the standard side-sheet if possible, OR style the Sheet to slide from bottom.
*   **Style:** Rounded top corners (`rounded-t-xl`).
*   **Backdrop:** Darker than default (`bg-black/40`).

## 3. Layout Structure (Next.js)

**File:** `app/layout.tsx`
Ensure the app is constrained to mobile width on desktop.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex justify-center min-h-screen">
        <div className="w-full max-w-[430px] bg-white min-h-screen relative shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
```
