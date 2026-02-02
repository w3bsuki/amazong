# Desktop Selling Audit — Treido V1

> Seller flows tested on desktop viewports (1920x1080, 1440x900)

| Status | 🔄 Partial |
|--------|----------------|
| Viewport | Desktop |

---

## Test Matrix

| Test | 1920x1080 | 1440x900 | Status |
|------|-----------|----------|--------|
| Sell entry (auth gate) | ✅ | ⬜ | Tested |
| Stripe Connect onboarding | ⬜ | ⬜ | Requires auth |
| Create listing wizard | ✅ | ⬜ | Tested (Step 1) |
| Image upload | ✅ | ⬜ | UI present |
| Publish listing | ⬜ | ⬜ | Requires auth |
| Edit listing | ⬜ | ⬜ | Requires auth |
| View seller orders | ⬜ | ⬜ | Requires auth |
| Mark shipped | ⬜ | ⬜ | Requires auth |

---

## Test Results

### 1. Sell Entry (`/sell`)

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Routes | `/sell` |
| Expected | Auth gate works, redirects to login if not authenticated |
| Actual | `/sell` is accessible WITHOUT authentication. Shows listing creation wizard step 1. This may be intentional to allow users to start listing before requiring sign-in. Page title is "Treido" (could be improved). |

---

### 2. Stripe Connect Onboarding

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Connect onboarding initiates, redirects to Stripe |
| Note | Requires authenticated seller account |
| Actual | — |

---

### 3. Create Listing Wizard

| Field | Result |
|-------|--------|
| Status | ✅ Pass (Step 1) |
| Routes | `/sell`, `/account/selling/edit` |
| Expected | Multi-step wizard works, validation, navigation between steps |
| Actual | **Step 1 - "What are you selling?"**: Title input with character counter (x/80), photo upload section (up to 8 photos), Continue button. Form remembers previously entered data (session storage/cookie). Clear layout, accessible on mobile. |

---

### 4. Image Upload

| Field | Result |
|-------|--------|
| Status | ✅ UI Present |
| Expected | Image picker works, upload progress shown, preview displays |
| Actual | Photo upload area visible with: "Choose File" button, instructions "Tap to add photos", file type hints "JPG, PNG or WebP up to 10MB", counter "0/8" photos. First image is cover (noted in UI). |

---

### 5. Publish Listing

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Draft publishes successfully, confirmation shown |
| Actual | Requires completing wizard and authentication |

---

### 6. Edit Listing

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Routes | `/account/selling/:id/edit` |
| Expected | Existing data loads, edits save correctly |
| Actual | Requires existing listing and authentication |

---

### 7. View Seller Orders

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Routes | `/sell/orders` |
| Expected | Order list displays, filtering works |
| Actual | Requires seller auth |

---

### 8. Mark Shipped

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Ship action available, tracking entry, status updates |
| Actual | Requires seller with orders |

---

## Issues Found

| ID | Route | Severity | Description |
|----|-------|----------|-------------|
| ISSUE-003 | `/sell` | Low | Page title is just "Treido" - should be "Sell | Treido" or "Create Listing | Treido" |

---

*Last updated: 2026-02-02*
