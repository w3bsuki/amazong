# shadcn/ui Patterns for Treido

## Component Locations

| Type | Location | Import Pattern |
|------|----------|----------------|
| Primitives | `components/ui/` | `@/components/ui/button` |
| Shared composites | `components/shared/` | `@/components/shared/product-card` |
| Route-private | `app/[locale]/(group)/**/_components/` | Relative import |

## Primitive Rules (components/ui/)

**Never add app logic to primitives.** Keep them generic:

```tsx
// ❌ WRONG - app logic in primitive
// components/ui/button.tsx
import { useCart } from '@/hooks/use-cart';
export function Button() {
  const { addToCart } = useCart(); // NO!
}

// ✅ CORRECT - pure primitive
// components/ui/button.tsx
export function Button({ children, onClick, ...props }) {
  return <button onClick={onClick} {...props}>{children}</button>
}
```

## Common shadcn Compositions

### Button with Icon
```tsx
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

<Button>
  <ShoppingCart className="mr-2 h-4 w-4" />
  Add to Cart
</Button>
```

### Card Pattern
```tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
  <CardFooter>
    <Button>Buy Now</Button>
  </CardFooter>
</Card>
```

### Form with Validation
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

### Dialog/Modal
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

### Sheet (Slide-over)
```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

### Dropdown Menu
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Creating Shared Composites

When a pattern is reused across routes, extract to `components/shared/`:

```tsx
// components/shared/product-card.tsx
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <img src={product.image} alt={product.title} />
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-muted-foreground">${product.price}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
```

## Accessibility Checklist

- [ ] All interactive elements have visible focus states
- [ ] Buttons have accessible names (text or aria-label)
- [ ] Form inputs have associated labels
- [ ] Dialogs trap focus and close on Escape
- [ ] Touch targets are at least 44x44px on mobile
