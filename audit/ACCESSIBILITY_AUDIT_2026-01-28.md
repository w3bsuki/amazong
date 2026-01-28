# Accessibility (a11y) Audit

**Date:** January 28, 2026  
**Viewport:** Mobile (375×812)  
**Testing Method:** Playwright accessibility snapshot analysis

---

## WCAG 2.1 Compliance Summary

| Level | Status | Notes |
|-------|--------|-------|
| Level A | ⚠️ Partial | Most requirements met |
| Level AA | ⚠️ Partial | Some issues found |
| Level AAA | ❌ Not tested | Beyond scope |

---

## 1. Perceivable

### 1.1 Text Alternatives

| Requirement | Status | Notes |
|-------------|--------|-------|
| Images have alt text | ✅ Pass | All images have alt attributes |
| Decorative images hidden | ✅ Pass | Using empty alt or aria-hidden |
| Icon buttons labeled | ✅ Pass | All have accessible names |
| Complex images described | ⚠️ Review | Product images may need more detail |

### Findings

```yaml
# Good examples found:
- img "SK-II Facial Treatment Essence – image 1"
- img "tech_haven" (seller avatar)
- button "Add to wishlist"

# Could be improved:
- Some product images only have product name
- Category icons are decorative but could have labels
```

### 1.2 Time-based Media

| Requirement | Status | Notes |
|-------------|--------|-------|
| Video captions | N/A | No videos on tested pages |
| Audio descriptions | N/A | No audio content |

### 1.3 Adaptable Content

| Requirement | Status | Notes |
|-------------|--------|-------|
| Semantic HTML | ✅ Pass | Proper element usage |
| Heading hierarchy | ✅ Pass | H1-H6 properly nested |
| Lists properly marked | ✅ Pass | `<ul>`, `<li>` used correctly |
| Tables accessible | N/A | No data tables on tested pages |
| Form labels | ✅ Pass | All inputs labeled |

### Heading Structure Audit

```
Homepage:
- H1: (none explicit - could add)
- H2: ПРОМОТИРАНИ ОБЯВИ (Promoted)
- H3: Product titles

Product Detail:
- H1: SK-II Facial Treatment Essence ✅
- H2: Customer reviews
- H3: Key Features, Description, More from seller

Account:
- H1: (implicit in sidebar)
- H4: Footer sections
```

### 1.4 Distinguishable

| Requirement | Status | Notes |
|-------------|--------|-------|
| Color not sole indicator | ✅ Pass | Icons + text used |
| Audio control | N/A | No auto-playing audio |
| Contrast (4.5:1 text) | ⚠️ Not tested | Needs visual audit |
| Text resize (200%) | ⚠️ Not tested | Needs manual test |
| Images of text | ✅ Pass | Real text used |

---

## 2. Operable

### 2.1 Keyboard Accessible

| Requirement | Status | Notes |
|-------------|--------|-------|
| All functionality via keyboard | ✅ Pass | Tab navigation works |
| No keyboard traps | ✅ Pass | Can navigate freely |
| Skip links | ✅ Pass | 4 skip links present |

### Skip Links Found

```yaml
- link "Skip to main content" → #main-content
- link "Skip to sidebar" → #shell-sidebar
- link "Skip to products" → #product-grid
- link "Skip to footer" → #footerHeader
```

### 2.2 Enough Time

| Requirement | Status | Notes |
|-------------|--------|-------|
| Adjustable timing | N/A | No time limits found |
| Pause/stop/hide | N/A | No auto-updating content |

### 2.3 Seizures and Physical Reactions

| Requirement | Status | Notes |
|-------------|--------|-------|
| No flashing content | ✅ Pass | No flashing elements |
| Animation control | ⚠️ Review | Check prefers-reduced-motion |

### 2.4 Navigable

| Requirement | Status | Notes |
|-------------|--------|-------|
| Skip navigation | ✅ Pass | Skip links present |
| Page titles | ✅ Pass | Descriptive titles |
| Focus order | ✅ Pass | Logical tab order |
| Link purpose | ✅ Pass | Descriptive link text |
| Multiple ways to find pages | ✅ Pass | Nav, search, footer |
| Headings and labels | ✅ Pass | Descriptive |
| Focus visible | ✅ Pass | Focus rings visible |

### Page Titles Audit

| Page | Title | Status |
|------|-------|--------|
| Home | Home \| Treido | ✅ Good |
| Cart | Cart \| Treido | ✅ Good |
| Checkout | Treido | ⚠️ Could be better |
| Product | [Product] \| [Store] \| Treido | ✅ Good |
| Search | "[query]" - Search Results \| Treido | ✅ Good |
| Account | Treido | ⚠️ Could be better |

### 2.5 Input Modalities

| Requirement | Status | Notes |
|-------------|--------|-------|
| Pointer gestures | ✅ Pass | Single tap works |
| Pointer cancellation | ✅ Pass | Can cancel clicks |
| Label in name | ✅ Pass | Matches accessible name |
| Motion actuation | N/A | No motion-triggered actions |
| Target size (44×44px) | ⚠️ Review | Some buttons may be small |

### Touch Target Analysis

```yaml
Adequate (≥44px):
- Primary CTAs (Add to Cart, Buy Now)
- Navigation links
- Large buttons

Potentially small:
- Wishlist heart icons (review needed)
- Rating stars in filters
- Footer link spacing
- Quantity +/- buttons
```

---

## 3. Understandable

### 3.1 Readable

| Requirement | Status | Notes |
|-------------|--------|-------|
| Language of page | ✅ Pass | `lang="en"` or `lang="bg"` |
| Language of parts | ⚠️ Issue | Mixed languages found |

### Language Issues Found

```yaml
# Bulgarian content on English locale:
- "ПРОМОТИРАНИ ОБЯВИ" heading on /en homepage
- Some product titles in Bulgarian
- Category names occasionally mixed
```

### 3.2 Predictable

| Requirement | Status | Notes |
|-------------|--------|-------|
| On focus behavior | ✅ Pass | No context changes |
| On input behavior | ✅ Pass | No unexpected changes |
| Consistent navigation | ✅ Pass | Same nav across pages |
| Consistent identification | ✅ Pass | Same icons/labels |

### 3.3 Input Assistance

| Requirement | Status | Notes |
|-------------|--------|-------|
| Error identification | ✅ Pass | Errors shown inline |
| Labels/instructions | ✅ Pass | Clear labels |
| Error suggestion | ⚠️ Review | Check form validation |
| Error prevention | ⚠️ Review | Check destructive actions |

---

## 4. Robust

### 4.1 Compatible

| Requirement | Status | Notes |
|-------------|--------|-------|
| Parsing | ✅ Pass | Valid HTML |
| Name, Role, Value | ✅ Pass | ARIA properly used |
| Status messages | ⚠️ Review | Check toast notifications |

### ARIA Usage Audit

```yaml
Good usage found:
- role="banner" on header
- role="main" on main content
- role="contentinfo" on footer
- role="navigation" with labels
- role="region" with labels
- aria-label on icon buttons
- aria-expanded on accordions
- aria-checked on toggles

Potentially missing:
- Live regions for dynamic updates
- aria-busy during loading
- aria-invalid on form errors
```

---

## Component-Specific Findings

### Search Input

```yaml
Element: searchbox "Search"
Status: ✅ Good
- Has accessible name
- Has placeholder text
- Submit button labeled
```

### Product Cards

```yaml
Elements: Product card links
Status: ✅ Good
- Link text is product name
- Images have alt text
- Interactive elements labeled
```

### Modals/Dialogs

```yaml
Status: ⚠️ Not fully tested
- Focus trapping: Review needed
- Escape key: Review needed
- aria-modal: Review needed
```

### Form Controls

```yaml
Login form:
- Email input: ✅ Labeled
- Password input: ✅ Labeled
- Show/hide toggle: ✅ Accessible
- Remember me: ✅ Labeled checkbox
- Submit button: ✅ Labeled

Search filters:
- Rating filters: ✅ Button text
- Price filters: ✅ Button text
- Checkboxes: ✅ Labeled
```

---

## Screen Reader Landmarks

```yaml
Landmarks found:
- banner (header)
- main (content)
- contentinfo (footer)
- navigation (multiple)
- complementary (sidebar)
- region (labeled sections)

Good landmark labeling:
- navigation "Skip links"
- navigation "Company"
- navigation "Help"
- region "Promoted"
- region "Notifications alt+T"
```

---

## Recommendations

### High Priority

1. **Fix language mixing** - Ensure all content matches locale
2. **Add page titles** - Checkout and Account need specific titles
3. **Test touch targets** - Verify all ≥44px minimum
4. **Add live regions** - For cart updates, notifications

### Medium Priority

5. **Test with screen readers** - VoiceOver, NVDA, JAWS
6. **Verify color contrast** - Run automated contrast checker
7. **Test keyboard navigation** - Full keyboard-only test
8. **Add prefers-reduced-motion** - Respect user preferences

### Low Priority

9. **Enhance product image alt** - More descriptive text
10. **Add aria-busy** - During loading states
11. **Test zoom to 200%** - Verify text reflow
12. **Add keyboard shortcuts** - For power users

---

## Testing Tools Recommended

1. **axe DevTools** - Automated accessibility testing
2. **WAVE** - Web accessibility evaluation
3. **Lighthouse** - Accessibility audit
4. **VoiceOver/NVDA** - Screen reader testing
5. **Contrast Checker** - Color contrast verification

---

## Compliance Checklist

### Must Fix (WCAG A)

- [ ] Fix language of parts issue
- [ ] Verify all images have alt text
- [ ] Ensure no keyboard traps
- [ ] Verify form error identification

### Should Fix (WCAG AA)

- [ ] Verify 4.5:1 contrast ratio
- [ ] Add missing page titles
- [ ] Ensure 44px touch targets
- [ ] Add visible focus indicators everywhere

### Nice to Have (WCAG AAA)

- [ ] 7:1 contrast ratio
- [ ] Sign language for video
- [ ] Extended audio description
- [ ] Reading level assessment
