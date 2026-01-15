# Audit: Desktop Touch Targets

**Created:** 2026-01-15  
**Status:** Complete  
**Result:** FIXED ✓ — Header icons standardized to 44px

---

## Button Component Sizes (button.tsx)

The Button component already has well-considered Treido sizing:

| Size | Height | Comment |
|------|--------|---------|
| `xs` | 32px (h-8) | Minimum for density |
| `sm` | 36px (h-9) | Compact |
| `default` | **44px (h-11)** | Treido standard ✓ |
| `lg` | 48px (h-12) | Touch-safe large ✓ |
| `xl` | 56px (h-14) | Hero CTA |
| `icon` | **44px (size-11)** | Treido touch ✓ |
| `icon-sm` | 36px (size-9) | Compact icon |
| `icon-lg` | 48px (size-12) | Large icon ✓ |

**Desktop buttons are FINE** — they use generous 44px defaults.

---

## Desktop Header Icons (dropdowns/)

| Component | Current | Status |
|-----------|---------|--------|
| Wishlist | `size-11` (44px) | ✓ Treido standard |
| Notifications | `size-11` (44px) | ✓ Treido standard |
| Messages | `size-11` (44px) | ✓ Treido standard |
| Account (icon variant) | `size-11` (44px) | ✓ Treido standard |
| Account (full variant) | `h-10` (40px) | ✓ Good (text label)

---

## Desktop Navigation (category-subheader.tsx)

| Element | Current | Status |
|---------|---------|--------|
| All Categories button | `h-10` (40px) | ✓ Good |
| Category nav items | `min-h-10` (40px) | ✓ Good |

---

## Desktop Search (desktop-search.tsx)

| Element | Current | Status |
|---------|---------|--------|
| Search form | `h-11` (44px) | ✓ Good |
| Submit button | `size="icon-sm"` = 36px | Acceptable (inside input) |

---

## Desktop Filter Modal

| Element | Current | Notes |
|---------|---------|-------|
| Trigger pill | `h-9` (36px) | ⚠️ Slightly small but acceptable |
| Search input | `h-9` (36px) | Acceptable for modal |
| Inputs | `h-8` (32px) | Acceptable for dense filter UI |

---

## Conclusion

Desktop touch targets are already excellent:
- All header icons: 40px ✓
- Default buttons: 44px ✓  
- Navigation items: 40px ✓
- Search bar: 44px ✓

The only slightly tight elements are inside modals/popovers where density is acceptable.

**Desktop uses mouse precision, not finger taps** — current sizes are appropriate.
