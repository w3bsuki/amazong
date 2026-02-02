# Mobile Selling Audit — Treido V1

> Seller flows tested on mobile viewports (390x844 iPhone 14, 360x740 Android)

| Status | 🔄 Partial |
|--------|----------------|
| Viewport | Mobile |

---

## Test Matrix

| Test | iPhone 14 | Android | Status |
|------|-----------|---------|--------|
| Sell entry | ✅ | ⬜ | Tested |
| Connect onboarding | ⬜ | ⬜ | Not Started |
| Create listing | ✅ | ⬜ | Tested (partial) |
| Image upload | ✅ | ⬜ | Tested |
| Publish listing | ⚠️ | ⬜ | Reached, not executed |
| Edit listing | ⬜ | ⬜ | Not Started |
| Seller orders | ⬜ | ⬜ | Not Started |
| Mark shipped | ⬜ | ⬜ | Not Started |

---

## Test Results

### 1. Sell Entry

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Expected | `/sell` loads on mobile; step UI usable; validation clear |
| Actual | `/sell` loads and renders Step 1 (title + photo upload). Validation errors render as inline alerts when attempting to continue without required fields. |

---

### 2. Connect Onboarding

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Stripe Connect flow works on mobile browser |
| Actual | — |

---

### 3. Create Listing Wizard

| Field | Result |
|-------|--------|
| Status | ⚠️ Partial |
| Expected | Required steps enforced; user always gets feedback when blocked |
| Actual | Wizard progresses through Step 1 → category picker → details → pricing. However, category step “Continue” can appear enabled while no category is selected and provides no feedback on click (ISSUE-006). The wizard can also progress through steps without enforcing required specifics for some categories and reaches “Publish Listing” too early (ISSUE-007). |

---

### 4. Image Upload

| Field | Result |
|-------|--------|
| Status | ✅ Pass (desktop-style file picker) |
| Expected | Photo picker opens; image attaches; preview renders; can remove |
| Actual | Selecting an image attaches it, shows a preview, and marks it as cover. Remove button is present. |

---

### 5. Publish Listing

| Field | Result |
|-------|--------|
| Status | ⚠️ Not Executed |
| Expected | Publish requires complete listing + review/confirmation |
| Actual | A “Publish Listing” CTA is reachable after entering price. Not clicked to avoid creating production data. The fact that it is reachable without enforced required details is tracked as ISSUE-007. |

---

### 6. Edit Listing

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Edit form usable on mobile |
| Actual | — |

---

### 7. Seller Orders

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Order list scrollable, details accessible |
| Actual | — |

---

### 8. Mark Shipped

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Ship action accessible, tracking entry mobile-friendly |
| Actual | — |

---

## Mobile-Specific Checks

- [ ] Camera input integration
- [ ] Form fields don't overflow
- [ ] Step navigation touch-friendly
- [ ] No keyboard issues on forms

---

## Issues Found

| ID | Route | Severity | Description |
|----|-------|----------|-------------|
| ISSUE-006 | `/sell` | High | Category step Continue provides no validation/feedback when category not selected |
| ISSUE-007 | `/sell` | High | Wizard reaches Publish too early; required details not consistently enforced |

---

*Last updated: 2026-02-02*
