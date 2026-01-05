# 🛒 Checkout Page UI/UX Improvement Plan

> **Status:** 📋 PLANNING  
> **Last Updated:** January 5, 2026  
> **Focus:** Mobile-first perfection → Desktop refinement  
> **Design System:** shadcn/ui + Tailwind CSS v4 + Treido patterns

---

## 🎯 Audit Summary

**Current State:**
- Mobile layout exists but feels cramped (dense spacing)
- Checkout manually overrides design system (using `h-9` instead of default `h-10`)
- Desktop layout functional but visual hierarchy needs improvement
- Form validation missing (no error states, no real-time feedback)
- Some accessibility gaps (focus states, ARIA labels)
- Styling inconsistencies (mixed spacing scales, color usage)

**Goal State:**
- Mobile-first design using design system defaults (40px mobile / 36px desktop)
- Clear visual hierarchy using typography scale + spacing
- Inline validation with helpful error messages
- Full keyboard navigation + screen reader support
- Consistent with Treido design system (flat cards, no gradients, semantic colors)

---

## 📱 Phase 1: Mobile UI/UX Perfection

### 1.1 Visual Hierarchy & Spacing

**Problem:**
- Sections feel visually flat (no clear separation)
- Checkout page overrides design system with manual `h-9` (should use default `h-10` mobile)
- Inconsistent spacing (`gap-1.5`, `gap-2`, `gap-2.5` all mixed)

**Solution:**
```tsx
// ✅ Use consistent spacing scale
const spacing = {
  section: 'gap-4',      // 16px between sections
  card: 'gap-3',         // 12px inside cards
  field: 'gap-2',        // 8px between label + input
  inline: 'gap-1.5',     // 6px for inline elements (icon + text)
}

// ✅ Use design system standard (already optimal)
<Input /> // h-10 (40px mobile) / h-9 (36px desktop) - WCAG 2.2 AA compliant

// ✅ Section dividers with proper visual weight
<div className="h-2 bg-muted" /> // Thicker than current 6px
```

**Changes:**
- [ ] Remove manual `h-9` overrides (let design system default apply)
- [ ] Ensure buttons follow design system (`h-10` mobile default)
- [ ] Use `h-2` (8px) dividers instead of `h-1.5` (6px)
- [ ] Standardize section padding to `p-4` (16px)
- [ ] Use `gap-3` for form fields, `gap-4` for sections

---

### 1.2 Typography Scale

**Problem:**
- Overuse of `text-2xs` makes text hard to read
- Headers too small (`text-sm` for section titles)
- No clear hierarchy between heading levels

**Solution:**
```tsx
// ✅ Mobile typography scale
const typography = {
  sectionHeader: 'text-base font-semibold',    // 16px
  cardHeader: 'text-sm font-medium',           // 14px
  body: 'text-base',                           // 16px (default readable)
  small: 'text-sm text-muted-foreground',      // 14px for secondary
  micro: 'text-xs text-muted-foreground',      // 12px for captions only
}

// ❌ Remove text-2xs (10px) entirely — too small for touch devices
```

**Changes:**
- [ ] Section headers: `text-2xs uppercase` → `text-base font-semibold`
- [ ] Input labels: Add explicit `<Label>` components with `text-sm`
- [ ] Body text in forms: Upgrade to `text-base` (16px)
- [ ] Only use `text-xs` for true metadata (e.g., "Delivery in 3-5 days")

---

### 1.3 Form Fields & Validation

**Problem:**
- No labels (only placeholders)
- No error states or validation feedback
- No disabled states for submit button
- No loading states for async operations

**Solution:**
```tsx
// ✅ Proper labeled inputs with validation
<div className="space-y-2">
  <Label htmlFor="firstName" className="text-sm font-medium">
    {t("firstName")} <span className="text-destructive">*</span>
  </Label>
  <Input
    id="firstName"
    value={newAddress.firstName}
    onChange={updateNewAddress("firstName")}
    onBlur={validateField("firstName")}
    className={cn(
      errors.firstName && "border-destructive focus-visible:ring-destructive"
    )}
    aria-invalid={!!errors.firstName}
    aria-describedby={errors.firstName ? "firstName-error" : undefined}
    required
  />
  {errors.firstName && (
    <p id="firstName-error" className="text-sm text-destructive flex items-center gap-1">
      <WarningCircle className="size-4" weight="fill" />
      {errors.firstName}
    </p>
  )}
</div>

// ✅ Submit button validation
<Button
  onClick={handleCheckout}
  disabled={isProcessing || !isFormValid}
  className="w-full h-12 font-semibold text-base disabled:opacity-50"
>
  {isProcessing ? (
    <>
      <SpinnerGap className="size-5 animate-spin mr-2" />
      {t("processing")}
    </>
  ) : (
    <>{t("payNow")} · {formatPrice(total)}</>
  )}
</Button>
```

**Changes:**
- [ ] Add `<Label>` to all form fields
- [ ] Implement validation state with `errors` object
- [ ] Add `onBlur` validation for real-time feedback
- [ ] Show field-level error messages with icons
- [ ] Disable submit button when form invalid
- [ ] Add proper `aria-*` attributes

---

### 1.4 Address Selection UX

**Problem:**
- "Change address" uses `<details>` which is non-standard
- Selected address preview is minimal
- Hard to see what address you're shipping to

**Solution:**
```tsx
// ✅ Full-width address card (clearly visible)
<div className="rounded-lg border-2 border-brand bg-brand/5 p-4">
  <div className="flex items-start gap-3">
    <div className="size-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
      <MapPin className="size-5 text-brand" weight="fill" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold">{selected.label}</span>
        {selected.is_default && (
          <Badge variant="secondary" className="text-xs">
            {t("default")}
          </Badge>
        )}
      </div>
      <p className="text-sm">{selected.full_name}</p>
      <p className="text-sm text-muted-foreground">
        {selected.address_line1}
        {selected.address_line2 && `, ${selected.address_line2}`}
      </p>
      <p className="text-sm text-muted-foreground">
        {selected.city}, {selected.state} {selected.postal_code}
      </p>
    </div>
    <Check className="size-5 text-brand shrink-0" weight="bold" />
  </div>
  <Button
    variant="outline"
    size="sm"
    onClick={() => setShowAddressSelector(true)}
    className="w-full mt-3"
  >
    {t("changeAddress")}
  </Button>
</div>

// ✅ Modal/drawer for address selection (mobile-friendly)
<Sheet open={showAddressSelector} onOpenChange={setShowAddressSelector}>
  <SheetContent side="bottom" className="h-[80vh]">
    <SheetHeader>
      <SheetTitle>{t("selectShippingAddress")}</SheetTitle>
    </SheetHeader>
    <RadioGroup value={selectedAddressId || ""} onValueChange={handleSelectAddress}>
      {savedAddresses.map((addr) => (
        <label key={addr.id} className="...address card...">
          ...
        </label>
      ))}
    </RadioGroup>
    <Button onClick={() => setUseNewAddress(true)}>
      + {t("addNewAddress")}
    </Button>
  </SheetContent>
</Sheet>
```

**Changes:**
- [ ] Replace `<details>` with proper modal/drawer (use shadcn `Sheet`)
- [ ] Make selected address card full-width with visual emphasis
- [ ] Add icon circle for visual anchor
- [ ] Show full address (not truncated)
- [ ] Use `Button` for "Change" action (better tap target)

---

### 1.5 Shipping Method Selection

**Problem:**
- Horizontal pills are too cramped (especially on small phones)
- Icon + price + days = too much info in tiny space
- Hard to see which is selected

**Solution:**
```tsx
// ✅ Full-width cards (easier to scan + tap)
<RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
  {options.map((opt) => {
    const Icon = opt.icon
    const isSelected = shippingMethod === opt.id
    return (
      <label
        key={opt.id}
        htmlFor={opt.id}
        className={cn(
          "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
          isSelected
            ? "border-brand bg-brand/5 shadow-sm"
            : "border-border hover:border-brand/30"
        )}
      >
        <RadioGroupItem value={opt.id} id={opt.id} className="shrink-0" />
        <Icon className={cn("size-6", isSelected ? "text-brand" : "text-muted-foreground")} weight="fill" />
        <div className="flex-1">
          <p className="font-medium">{opt.label}</p>
          <p className="text-sm text-muted-foreground">{opt.days}</p>
        </div>
        <span className={cn("font-semibold text-lg", opt.price === 0 ? "text-success" : "")}>
          {opt.price === 0 ? t("free") : formatPrice(opt.price)}
        </span>
      </label>
    )
  })}
</RadioGroup>
```

**Changes:**
- [ ] Convert horizontal pills to full-width vertical cards
- [ ] Increase icon size to `size-6` (24px)
- [ ] Use `border-2` for selected state (more visible)
- [ ] Add `shadow-sm` to selected card
- [ ] Make price text larger (`text-lg`)

---

### 1.6 Order Items Summary

**Problem:**
- Stacked thumbnails are cute but hide product details
- Can't see what you're buying at a glance
- "Edit" link unclear

**Solution:**
```tsx
// ✅ Expandable accordion (collapsed by default to save space)
<Accordion type="single" collapsible defaultValue="">
  <AccordionItem value="items" className="border-none">
    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
      <div className="flex items-center gap-3 w-full">
        <Package className="size-5 text-brand" weight="fill" />
        <span className="font-medium">{t("orderItems")}</span>
        <Badge variant="secondary" className="ml-auto">
          {totalItems}
        </Badge>
        <span className="font-semibold">{formatPrice(subtotal)}</span>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-4 pb-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="size-16 rounded-md border bg-muted p-1">
              <Image ... />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-2">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {t("qty")}: {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <Separator className="my-3" />
      <Button variant="outline" size="sm" asChild className="w-full">
        <Link href="/cart">
          <Pencil className="size-4 mr-2" />
          {t("editCart")}
        </Link>
      </Button>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Changes:**
- [ ] Use shadcn `Accordion` for items list
- [ ] Default to collapsed (saves screen space)
- [ ] Show summary in header (count + total)
- [ ] Full item details when expanded (image, title, qty, price)
- [ ] "Edit Cart" button at bottom (clear action)

---

### 1.7 Sticky Footer

**Problem:**
- Footer always visible (takes space)
- Price redundant (already in summary above)
- No trust signals

**Solution:**
```tsx
// ✅ Smarter sticky footer (only show when scrolled past summary)
<div className={cn(
  "fixed bottom-0 inset-x-0 bg-card border-t z-40 transition-transform duration-300",
  isAtBottom ? "translate-y-full" : "translate-y-0"
)}>
  <div className="px-4 py-3 safe-area-inset-bottom">
    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground justify-center">
      <Lock className="size-3.5" weight="fill" />
      <span>{t("secureCheckout")}</span>
      <span>•</span>
      <ShieldCheck className="size-3.5" weight="fill" />
      <span>{t("buyerProtection")}</span>
    </div>
    <Button
      onClick={handleCheckout}
      disabled={isProcessing || !isFormValid}
      className="w-full h-12 font-semibold text-base"
    >
      {isProcessing ? (
        <>
          <SpinnerGap className="size-5 animate-spin mr-2" />
          {t("processing")}
        </>
      ) : (
        <>
          <Lock className="size-4 mr-2" weight="fill" />
          {t("completeOrder")} · {formatPrice(total)}
        </>
      )}
    </Button>
  </div>
</div>
```

**Changes:**
- [ ] Add scroll detection (hide when at summary)
- [ ] Move trust signals above button
- [ ] Add lock icon to button
- [ ] Use `safe-area-inset-bottom` for iOS notch
- [ ] Disable button when form invalid

---

## 🖥️ Phase 2: Desktop UI Refinement

### 2.1 Layout & Grid

**Problem:**
- 3-column + 2-column grid feels unbalanced
- Right sidebar too narrow for content
- Sticky sidebar starts too late

**Solution:**
```tsx
// ✅ Better proportions (60/40 split)
<div className="grid grid-cols-12 gap-8">
  <div className="col-span-7"> {/* Main content */}
    ...
  </div>
  <div className="col-span-5"> {/* Sidebar */}
    <div className="sticky top-20"> {/* Account for header height */}
      ...
    </div>
  </div>
</div>
```

**Changes:**
- [ ] Update to 7/5 column split (was 3/2)
- [ ] Increase gap to `gap-8` (32px)
- [ ] Adjust sticky top offset for actual header height
- [ ] Add max-width container (`container-narrow` or `max-w-7xl`)

---

### 2.2 Cards & Borders

**Problem:**
- Cards use `border border-border` which is too subtle
- No shadow = cards blend into background
- Section headers feel stuck to card top

**Solution:**
```tsx
// ✅ Better card styling (follows Treido patterns)
<div className="rounded-lg border border-border/60 bg-card overflow-hidden">
  <div className="px-5 py-4 border-b border-border/50">
    <div className="flex items-center gap-2.5">
      <MapPin className="size-5 text-brand" weight="fill" />
      <h2 className="text-base font-semibold">{t("shippingAddress")}</h2>
    </div>
  </div>
  <div className="p-5">
    ... content ...
  </div>
</div>
```

**Changes:**
- [ ] Use `rounded-lg` instead of `rounded-md`
- [ ] Increase padding to `px-5 py-4` (headers) and `p-5` (body)
- [ ] Use `border-border/60` for softer borders
- [ ] Upgrade section headers to `text-base font-semibold`
- [ ] Increase icon size to `size-5`

---

### 2.3 Order Summary Sidebar

**Problem:**
- Summary feels cramped
- Total not visually emphasized
- Button doesn't stand out enough

**Solution:**
```tsx
<div className="rounded-lg border border-border/60 bg-card overflow-hidden">
  <div className="px-5 py-4 border-b">
    <h2 className="text-base font-semibold">{t("orderSummary")}</h2>
  </div>
  <div className="p-5 space-y-4">
    {/* Line items */}
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">{t("subtotal")}</span>
        <span className="font-medium">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{t("shipping")}</span>
        <span className={cn("font-medium", shippingCost === 0 && "text-success")}>
          {shippingCost === 0 ? t("free") : formatPrice(shippingCost)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{t("tax")}</span>
        <span className="font-medium">{formatPrice(tax)}</span>
      </div>
    </div>

    <Separator />

    {/* Total */}
    <div className="rounded-lg bg-muted/30 p-4">
      <div className="flex justify-between items-baseline">
        <span className="text-base font-semibold">{t("total")}</span>
        <span className="text-2xl font-bold text-brand">{formatPrice(total)}</span>
      </div>
    </div>

    {/* CTA */}
    <Button
      onClick={handleCheckout}
      disabled={isProcessing || !isFormValid}
      size="lg"
      className="w-full h-12 font-semibold text-base"
    >
      {isProcessing ? (
        <>
          <SpinnerGap className="size-5 animate-spin mr-2" />
          {t("processing")}
        </>
      ) : (
        <>
          <Lock className="size-4 mr-2" weight="fill" />
          {t("proceedToPayment")}
        </>
      )}
    </Button>

    {/* Trust signals */}
    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
      <div className="flex items-center gap-1.5">
        <Lock className="size-3.5 text-success" weight="fill" />
        <span>{t("secureCheckout")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="size-3.5 text-success" weight="fill" />
        <span>{t("buyerProtection")}</span>
      </div>
    </div>
  </div>
</div>
```

**Changes:**
- [ ] Wrap total in highlighted box (`bg-muted/30 p-4 rounded-lg`)
- [ ] Make total price larger (`text-2xl`) and branded (`text-brand`)
- [ ] Add `font-medium` to all price values
- [ ] Increase spacing to `space-y-4`
- [ ] Make trust icons green (`text-success`)

---

## 🎨 Phase 3: Visual Design Consistency

### 3.1 Color Usage

**Current Issues:**
- `text-primary` used for brand elements (should be `text-brand`)
- Success states not using semantic `text-success`
- Inconsistent destructive color for errors

**Standards:**
```tsx
// ✅ Semantic color usage
const colors = {
  brand: 'text-brand',           // Primary brand color
  success: 'text-success',        // Free shipping, checkmarks
  destructive: 'text-destructive', // Errors, warnings
  muted: 'text-muted-foreground',  // Secondary text
  foreground: 'text-foreground',   // Body text
}

// Examples:
<Check className="text-success" weight="fill" />
<WarningCircle className="text-destructive" weight="fill" />
<MapPin className="text-brand" weight="fill" />
```

**Changes:**
- [ ] Replace all `text-primary` with `text-brand`
- [ ] Use `text-success` for free shipping, checkmarks
- [ ] Use `text-destructive` for error states
- [ ] Ensure icons match text color

---

### 3.2 Border & Focus States

**Problem:**
- Selected states not obvious enough
- Focus rings not visible on all interactive elements
- Borders too subtle

**Solution:**
```tsx
// ✅ Clear visual states
const states = {
  default: 'border-border hover:border-brand/30',
  selected: 'border-2 border-brand bg-brand/5 ring-1 ring-brand/20',
  error: 'border-destructive focus-visible:ring-destructive',
  focus: 'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
}

// Example: Radio card
<label className={cn(
  'border rounded-lg cursor-pointer transition-all',
  isSelected
    ? 'border-2 border-brand bg-brand/5 shadow-sm'
    : 'border border-border hover:border-brand/30'
)}>
  ...
</label>
```

**Changes:**
- [ ] Use `border-2` for selected states (thicker = more obvious)
- [ ] Add `bg-brand/5` tint to selected cards
- [ ] Add `shadow-sm` to selected elements
- [ ] Ensure all interactive elements have focus-visible ring

---

### 3.3 Icon Consistency

**Problem:**
- Mixed icon weights (`fill` vs `regular`)
- Inconsistent icon sizes
- Some icons missing from states

**Solution:**
```tsx
// ✅ Icon standards
const iconSizes = {
  mobile: {
    section: 'size-4',    // Section headers
    card: 'size-5',       // Featured icons
    inline: 'size-3.5',   // Inline with text
  },
  desktop: {
    section: 'size-5',
    card: 'size-6',
    inline: 'size-4',
  }
}

// ✅ Icon weight standards
const iconWeights = {
  active: 'fill',     // Selected states, primary actions
  inactive: 'regular', // Unselected, secondary
  success: 'fill',    // Checkmarks, confirmation
}
```

**Changes:**
- [ ] Standardize section header icons to `size-4` (mobile), `size-5` (desktop)
- [ ] Use `weight="fill"` for selected/active states
- [ ] Use `weight="regular"` for unselected/inactive
- [ ] Add icons to all section headers for visual consistency

---

## ✅ Phase 4: Form Validation Implementation

### 4.1 Validation Rules

```tsx
// ✅ Validation schema
const validationRules = {
  firstName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Zа-яА-Я\s'-]+$/,
    message: t("validation.firstNameRequired"),
  },
  lastName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Zа-яА-Я\s'-]+$/,
    message: t("validation.lastNameRequired"),
  },
  address: {
    required: true,
    minLength: 5,
    message: t("validation.addressRequired"),
  },
  city: {
    required: true,
    minLength: 2,
    message: t("validation.cityRequired"),
  },
  state: {
    required: true,
    message: t("validation.stateRequired"),
  },
  zip: {
    required: true,
    pattern: /^\d{4,5}$/,
    message: t("validation.zipRequired"),
  },
}

// ✅ Real-time validation hook
function useFormValidation(address: NewAddressForm) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (field: keyof NewAddressForm) => {
    const value = address[field]
    const rule = validationRules[field]
    
    if (rule.required && !value) {
      return rule.message
    }
    if (rule.minLength && value.length < rule.minLength) {
      return t("validation.tooShort", { min: rule.minLength })
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return t("validation.invalidFormat")
    }
    return null
  }

  const handleBlur = (field: keyof NewAddressForm) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field)
    setErrors(prev => ({ ...prev, [field]: error || '' }))
  }

  const isFormValid = Object.keys(validationRules).every(
    field => !validateField(field as keyof NewAddressForm)
  )

  return { errors, touched, handleBlur, isFormValid }
}
```

**Changes:**
- [ ] Create validation rules for all fields
- [ ] Implement `useFormValidation` hook
- [ ] Add `onBlur` handlers to all inputs
- [ ] Show errors only after field is touched
- [ ] Validate on submit attempt
- [ ] Disable submit when form invalid

---

### 4.2 Error Message UI

```tsx
// ✅ Error message component
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  
  return (
    <p className="text-sm text-destructive flex items-center gap-1.5 mt-1">
      <WarningCircle className="size-4 shrink-0" weight="fill" />
      <span>{message}</span>
    </p>
  )
}

// Usage:
<div className="space-y-2">
  <Label htmlFor="firstName" className="text-sm font-medium">
    {t("firstName")} <span className="text-destructive">*</span>
  </Label>
  <Input
    id="firstName"
    value={newAddress.firstName}
    onChange={updateNewAddress("firstName")}
    onBlur={() => handleBlur("firstName")}
    className={cn(
      "h-11 text-base",
      touched.firstName && errors.firstName && "border-destructive"
    )}
    aria-invalid={!!(touched.firstName && errors.firstName)}
    aria-describedby={errors.firstName ? "firstName-error" : undefined}
  />
  {touched.firstName && <FieldError message={errors.firstName} />}
</div>
```

**Changes:**
- [ ] Create `FieldError` component
- [ ] Add to all form fields
- [ ] Style error state borders (`border-destructive`)
- [ ] Add proper ARIA attributes
- [ ] Only show errors after blur (not while typing)

---

## ♿ Phase 5: Accessibility

### 5.1 Keyboard Navigation

**Changes:**
- [ ] Ensure all interactive elements are keyboard accessible
- [ ] Add visible focus rings (`focus-visible:ring-2`)
- [ ] Test tab order (should be logical top-to-bottom)
- [ ] Add skip links if needed
- [ ] Ensure modals trap focus

---

### 5.2 Screen Reader Support

**Changes:**
- [ ] Add ARIA labels to all form fields
- [ ] Add `aria-invalid` to error states
- [ ] Add `aria-describedby` for error messages
- [ ] Add `role="status"` to loading states
- [ ] Add `aria-live="polite"` to dynamic content
- [ ] Test with screen reader (NVDA/VoiceOver)

---

### 5.3 Color Contrast

**Changes:**
- [ ] Ensure all text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Test with browser DevTools contrast checker
- [ ] Don't rely on color alone (use icons + text)
- [ ] Ensure error states are visible in high contrast mode

---

## 🧪 Phase 6: Testing Checklist

### 6.1 Visual Testing

- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Android
- [ ] Safari desktop
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Edge desktop

### 6.2 Functional Testing

- [ ] Empty cart → redirect
- [ ] Logged out → new address form
- [ ] Logged in → saved addresses
- [ ] Change address works
- [ ] Add new address works
- [ ] Shipping method selection works
- [ ] Form validation works
- [ ] Submit disabled when invalid
- [ ] Loading states work
- [ ] Error states work

### 6.3 Accessibility Testing

- [ ] Tab navigation works
- [ ] Screen reader announces errors
- [ ] Focus visible on all elements
- [ ] Color contrast meets WCAG AA
- [ ] Works with 200% zoom
- [ ] Works with keyboard only

---

## 📦 Implementation Priority

### Sprint 1 (Mobile Core)
1. Update spacing & typography
2. Fix form field heights
3. Add labels to inputs
4. Implement validation

### Sprint 2 (Mobile Polish)
5. Redesign address selection
6. Improve shipping method cards
7. Fix sticky footer
8. Add error states

### Sprint 3 (Desktop)
9. Update grid layout
10. Polish card styling
11. Improve summary sidebar
12. Add animations

### Sprint 4 (Accessibility)
13. Add ARIA labels
14. Test keyboard navigation
15. Test screen readers
16. Fix contrast issues

---

## 📝 Translation Keys Needed

Add to `messages/bg.json` and `messages/en.json`:

```json
{
  "CheckoutPage": {
    "validation": {
      "firstNameRequired": "Моля, въведете име",
      "lastNameRequired": "Моля, въведете фамилия",
      "addressRequired": "Моля, въведете адрес",
      "cityRequired": "Моля, въведете град",
      "stateRequired": "Моля, въведете област",
      "zipRequired": "Моля, въведете пощенски код",
      "tooShort": "Твърде кратко (минимум {min} знака)",
      "invalidFormat": "Невалиден формат"
    },
    "selectShippingAddress": "Избери адрес за доставка",
    "addNewAddress": "Добави нов адрес",
    "editCart": "Редактирай количката",
    "completeOrder": "Завърши поръчката",
    "items": "артикула",
    "orderSummary": "Обобщение на поръчката"
  }
}
```

---

## 🎯 Success Metrics

- **Mobile UX:** 44px+ touch targets, readable 16px text, clear hierarchy
- **Validation:** Real-time feedback, helpful error messages, disabled submit when invalid
- **Accessibility:** WCAG AA compliant, keyboard navigable, screen reader friendly
- **Performance:** No layout shift, fast interactions, smooth animations
- **Consistency:** Follows Treido design system, matches other pages

---

*Ready for implementation. Start with Sprint 1 (Mobile Core) for immediate impact.*
