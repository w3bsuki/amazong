# Translations Reference

> Message files, namespaces, ICU message syntax, and parity requirements for Treido's i18n system.

## Message Files

| File | Language | Role |
|------|----------|------|
| `messages/en.json` | English | Source of truth |
| `messages/bg.json` | Bulgarian | Must match en.json keys |

---

## Namespace Inventory (97 namespaces)

### Authentication & Account
`Account`, `AccountDrawer`, `AccountPlansUpgrade`, `Auth`, `NavUser`

### Commerce & Shopping
`Cart`, `CartDropdown`, `CartPage`, `Categories`, `CategoryNotFound`, `CheckoutFooter`, `CheckoutHeader`, `CheckoutPage`, `CheckoutSuccess`, `CheckoutSuccessPage`, `Product`, `ProductFeed`, `ProductForm`, `ProductModal`, `ProductNotFound`, `ProductSocialProof`

### Search & Filtering
`FilterHub`, `FilterSidebar`, `QuickFilters`, `SaveSearch`, `SearchCategories`, `SearchFilters`, `SearchOverlay`

### Seller & Business
`Sell`, `Seller`, `SellerVerification`, `SellersDirectory`, `SellingDropdown`, `SellingProducts`, `seller`

### Navigation & Layout
`Breadcrumbs`, `Categories`, `Drawers`, `Footer`, `Header`, `HeroSearch`, `Home`, `LocaleSwitcher`, `LocationDropdown`, `MobileMenu`, `Navigation`, `Sidebar`, `SidebarMenuV2`

### User Features
`Messages`, `MessagesDropdown`, `NotificationsDropdown`, `Plans`, `ProfileError`, `ProfileNotFound`, `ProfilePage`, `Reviews`, `SharedWishlist`, `Wishlist`, `WishlistDropdown`

### Legal & Support
`About`, `AccessibilityPage`, `CareersPage`, `ComingSoon`, `Contact`, `Cookies`, `CustomerService`, `FAQPage`, `Feedback`, `Privacy`, `Returns`, `ReturnsDropdown`, `Security`, `Terms`

### Common & Utilities
`Common`, `Errors`, `Freshness`, `GlobalError`, `GlobalNotFound`, `NotFound`, `ViewMode`

### Admin (Internal)
`AdminDashboard`, `AdminDocs`, `AdminHeader`, `AdminNav`, `AdminNotes`, `AdminOrders`, `AdminProducts`, `AdminSellers`, `AdminTasks`, `AdminUsers`

---

## ICU Message Syntax

### Static Messages

```json
{ "title": "Welcome to Treido" }
```

```typescript
t('title')  // "Welcome to Treido"
```

### Interpolation

```json
{ "greeting": "Hello, {name}!" }
```

```typescript
t('greeting', { name: 'Ivan' })  // "Hello, Ivan!"
```

### Pluralization

```json
{
  "items": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
}
```

```typescript
t('items', { count: 0 })  // "No items"
t('items', { count: 1 })  // "1 item"
t('items', { count: 5 })  // "5 items"
```

### Select (Enum)

```json
{
  "status": "{status, select, pending {Pending} shipped {Shipped} delivered {Delivered} other {Unknown}}"
}
```

```typescript
t('status', { status: 'shipped' })  // "Shipped"
```

### Rich Text

```json
{
  "terms": "By signing up, you agree to our <link>Terms</link>."
}
```

```typescript
t.rich('terms', {
  link: (chunks) => <a href="/terms">{chunks}</a>
})
```

---

## ✅ DO: Follow namespace conventions

```typescript
// Use domain-specific namespace
const t = useTranslations('Product')
t('addToCart')  // Product.addToCart

// Multiple namespaces when needed
const tProduct = useTranslations('Product')
const tCommon = useTranslations('Common')
```

## ✅ DO: Use t.has() for optional keys

```typescript
// Check before rendering optional content
if (t.has('promoMessage')) {
  return <Banner>{t('promoMessage')}</Banner>
}
```

## ✅ DO: Keep en/bg in sync

```bash
# Run parity test before committing
pnpm test __tests__/i18n-messages-parity.test.ts
```

---

## ❌ DON'T: Hardcode user-facing strings

```typescript
// Wrong - hardcoded
<Button>Add to Cart</Button>

// Correct - translated
<Button>{t('addToCart')}</Button>
```

## ❌ DON'T: Build strings with template literals

```typescript
// Wrong - not translatable
const message = `Hello ${name}`

// Correct - use interpolation
t('greeting', { name })
```

## ❌ DON'T: Use conditional string building

```typescript
// Wrong - breaks translation context
const text = isLoading ? 'Loading' : 'Done'

// Correct - translate both states
const text = isLoading ? t('loading') : t('done')
```

## ❌ DON'T: Delete keys without updating call sites

```typescript
// Wrong - breaks existing components
// messages/en.json: removed "Product.oldKey"

// Correct - remove key AND update all usages in same commit
```

---

## Adding New Translations

1. **Add to en.json first** (source of truth)
2. **Add same key to bg.json** (must match)
3. **Use existing namespace** or create new one (grouped by domain)
4. **Run parity test**: `pnpm test __tests__/i18n-messages-parity.test.ts`
5. **Use ICU syntax** for dynamic content

---

## Message File Guidelines

From `messages/AGENTS.md`:

- Keep `en` and `bg` keys in sync (no missing translations)
- Do not delete/rename keys unless all call sites are updated in the same batch
- Values are user-facing copy: no placeholders, no debug strings

---

## Related Files

- [docs/10-I18N.md](../../../docs/10-I18N.md) — Full i18n specification
- [components.md](./components.md) — React usage patterns
- [setup.md](./setup.md) — Configuration files
