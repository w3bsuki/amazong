# accessibility.md — WCAG Checklist

> Accessibility requirements for Treido marketplace.

## WCAG 2.2 Level AA Requirements

### CRITICAL: Focus States

Every interactive element MUST have visible focus:

```tsx
// ✅ GOOD - visible focus ring
<button className="
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:outline-none
">

// ❌ BAD - invisible focus
<button className="outline-none focus:outline-none">
```

### CRITICAL: Color Contrast

| Element | Minimum Ratio | Target |
|---------|---------------|--------|
| Normal text | 4.5:1 | WCAG AA |
| Large text (18px+ or 14px bold) | 3:1 | WCAG AA |
| UI components | 3:1 | WCAG AA |
| Non-text (icons) | 3:1 | WCAG AA |

**Tokens that guarantee contrast:**
- `text-foreground` on `bg-background` ✅
- `text-muted-foreground` on `bg-background` ✅
- `text-primary-foreground` on `bg-primary` ✅

### CRITICAL: Touch Targets

Minimum 24×24px, target 44×44px:

```tsx
// ✅ Apple minimum (44px)
<button className="min-h-(--spacing-touch-md) min-w-(--spacing-touch-md)">
```

## HIGH: Semantic HTML

### Use Correct Elements

```tsx
// ✅ GOOD - semantic
<button onClick={handleClick}>Submit</button>
<a href="/products">View Products</a>
<nav aria-label="Main navigation">...</nav>

// ❌ BAD - non-semantic
<div onClick={handleClick}>Submit</div>
<span className="link">View Products</span>
<div className="nav">...</div>
```

### Heading Hierarchy

```tsx
// ✅ GOOD - logical hierarchy
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

// ❌ BAD - skipped levels
<h1>Page Title</h1>
  <h4>Subsection</h4>  // Skipped h2, h3
```

## HIGH: Form Accessibility

### Labels

```tsx
// ✅ GOOD - explicit label
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// ✅ GOOD - aria-label for icon-only
<button aria-label="Search">
  <SearchIcon />
</button>

// ❌ BAD - no label
<Input placeholder="Email" />
```

### Error Messages

```tsx
// ✅ GOOD - linked error
<Input 
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && (
  <p id="email-error" className="text-destructive">
    {error}
  </p>
)}
```

### Required Fields

```tsx
<Label htmlFor="name">
  Name <span className="text-destructive">*</span>
</Label>
<Input 
  id="name"
  required
  aria-required="true"
/>
```

## MEDIUM: Images

### Alt Text

```tsx
// ✅ GOOD - descriptive alt
<Image 
  src={product.image}
  alt={`${product.name} - ${product.condition}`}
/>

// ✅ GOOD - decorative (empty alt)
<Image 
  src="/decorative-pattern.svg"
  alt=""
  role="presentation"
/>

// ❌ BAD - generic alt
<Image src={product.image} alt="product" />
<Image src={product.image} alt="image" />
```

## MEDIUM: Keyboard Navigation

### Tab Order

```tsx
// ✅ GOOD - natural tab order
<form>
  <Input />      {/* Tab 1 */}
  <Input />      {/* Tab 2 */}
  <Button />     {/* Tab 3 */}
</form>

// Use tabIndex sparingly
tabIndex={0}   // Focusable (natural order)
tabIndex={-1}  // Remove from tab order
// tabIndex={1+} - AVOID positive tabIndex
```

### Keyboard Handlers

```tsx
// ✅ GOOD - supports keyboard
<div 
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>

// Better: just use <button>
<button onClick={handleClick}>
```

## MEDIUM: ARIA Patterns

### Common ARIA Attributes

```tsx
// Live regions for updates
<div aria-live="polite" aria-atomic="true">
  {itemCount} items in cart
</div>

// Expanded state
<button 
  aria-expanded={isOpen}
  aria-controls="menu-content"
>
  Menu
</button>
<div id="menu-content" hidden={!isOpen}>...</div>

// Current page
<nav aria-label="Breadcrumb">
  <a href="/">Home</a>
  <a href="/products">Products</a>
  <a href="/products/123" aria-current="page">Product Name</a>
</nav>
```

### Dialog Accessibility

```tsx
<Dialog>
  <DialogContent
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <DialogTitle id="dialog-title">Confirm Delete</DialogTitle>
    <p id="dialog-description">
      Are you sure you want to delete this item?
    </p>
  </DialogContent>
</Dialog>
```

## MEDIUM: Motion

### Reduced Motion

```tsx
// ✅ GOOD - respects user preference
<div className="
  transition-transform duration-normal
  motion-reduce:transition-none
  motion-reduce:transform-none
">

// In CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Checklist

Before any UI PR:

- [ ] Focus states visible on all interactive elements
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Touch targets ≥ 44×44px
- [ ] All form inputs have labels
- [ ] Images have alt text (or empty for decorative)
- [ ] Semantic HTML used (buttons, links, headings)
- [ ] Keyboard navigation works
- [ ] Screen reader tested (optional but recommended)
- [ ] Reduced motion respected

## Testing Tools

- **axe DevTools** - Browser extension for WCAG audit
- **WAVE** - Web accessibility evaluator
- **Lighthouse** - Chrome DevTools accessibility audit
- **VoiceOver** (Mac) / **NVDA** (Windows) - Screen reader testing
