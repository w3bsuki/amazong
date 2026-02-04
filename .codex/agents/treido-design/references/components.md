# components.md — shadcn/ui Patterns

> Component composition patterns for Treido.

## Component Location

All UI primitives: `components/ui/*`

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
```

App-specific composites: `components/shared/*`

## Button Variants

```tsx
// Primary CTA (sparingly)
<Button variant="default">Add to Cart</Button>

// Secondary action
<Button variant="secondary">Save for Later</Button>

// Outline/ghost
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Learn More</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

## Card Composition

```tsx
<Card className="bg-card border border-border rounded-lg overflow-hidden">
  <CardHeader className="p-4 pb-0">
    <CardTitle className="text-foreground font-semibold">Title</CardTitle>
    <CardDescription className="text-muted-foreground text-sm">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent className="p-4">
    {/* Main content */}
  </CardContent>
  <CardFooter className="p-4 pt-0 flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>
```

## Form Patterns

### Input with Label

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    className="h-(--spacing-input)"
  />
</div>
```

### Input with Error

```tsx
<div className="space-y-2">
  <Label htmlFor="email" className={error ? "text-destructive" : ""}>
    Email
  </Label>
  <Input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
    className={cn(
      "h-(--spacing-input)",
      error && "border-destructive focus-visible:ring-destructive"
    )}
  />
  {error && (
    <p id="email-error" className="text-sm text-destructive">
      {error}
    </p>
  )}
</div>
```

## Dialog vs Sheet vs Drawer

| Component | Use For | Mobile Behavior |
|-----------|---------|-----------------|
| `Dialog` | Confirmations, forms | Centered modal |
| `Sheet` | Side panels, filters | Slides from edge |
| `Drawer` | Mobile bottom sheets | Slides from bottom |

### Responsive Pattern

```tsx
// Desktop: Dialog, Mobile: Drawer
const isMobile = useIsMobile();

return isMobile ? (
  <Drawer open={open} onOpenChange={setOpen}>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Title</DrawerTitle>
      </DrawerHeader>
      {content}
    </DrawerContent>
  </Drawer>
) : (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Title</DialogTitle>
      </DialogHeader>
      {content}
    </DialogContent>
  </Dialog>
);
```

## Badge Usage

```tsx
// Status badges
<Badge variant="default">New</Badge>
<Badge variant="secondary">Used</Badge>
<Badge variant="destructive">Sold Out</Badge>
<Badge variant="outline">Draft</Badge>

// Custom with tokens
<Badge className="bg-success text-success-foreground">In Stock</Badge>
<Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
```

## Skeleton Loading

```tsx
// Text skeleton
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-3/4" />

// Image skeleton
<Skeleton className="h-48 w-full rounded-lg" />

// Card skeleton
<Card className="p-4 space-y-3">
  <Skeleton className="h-40 w-full rounded-md" />
  <Skeleton className="h-4 w-2/3" />
  <Skeleton className="h-4 w-1/2" />
</Card>
```

## Dropdown Menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Share</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Tabs

```tsx
<Tabs defaultValue="details" className="w-full">
  <TabsList className="w-full grid grid-cols-3">
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="reviews">Reviews</TabsTrigger>
    <TabsTrigger value="shipping">Shipping</TabsTrigger>
  </TabsList>
  <TabsContent value="details" className="mt-4">
    {/* Details content */}
  </TabsContent>
  <TabsContent value="reviews" className="mt-4">
    {/* Reviews content */}
  </TabsContent>
  <TabsContent value="shipping" className="mt-4">
    {/* Shipping content */}
  </TabsContent>
</Tabs>
```

## cn() Utility

Always use `cn()` for conditional classes:

```tsx
import { cn } from "@/lib/utils";

<Button 
  className={cn(
    "base-classes",
    isActive && "active-classes",
    isDisabled && "disabled-classes"
  )}
>
```

## Component State Checklist

When creating/modifying any component:

- [ ] Default appearance
- [ ] Hover state (`hover:`)
- [ ] Focus state (`focus-visible:ring-2`)
- [ ] Active/Pressed state (`active:`)
- [ ] Disabled state (`disabled:opacity-50`)
- [ ] Loading state (spinner or skeleton)
- [ ] Empty state (helpful guidance)
- [ ] Error state (clear indicator)
