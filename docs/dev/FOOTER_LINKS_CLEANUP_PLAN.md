# Footer Links Cleanup Plan - Phase 1

> **Created:** December 29, 2025  
> **Status:** 🚧 In Progress  
> **Related:** [mobile_audit.md](../mobile_audit.md)

---

## 🎯 Goal

Clean up broken footer URLs, remove irrelevant links, and create a production-ready footer structure that reflects Treido's actual features while preparing placeholders for future business growth.

---

## 📊 Link Categorization

### ✅ KEEP (Routes Exist)
| Link | Route | Status |
|------|-------|--------|
| About Treido | `/about` | ✅ Working |
| Terms | `/terms` | ✅ Working |
| Privacy Policy | `/privacy` | ✅ Working |
| Cookie Preferences | `/cookies` | ✅ Working |
| Returns | `/returns` | ✅ Working |
| Contact Us | `/contact` | ✅ Working |
| Help Center | `/customer-service` | ✅ Working |
| Gift Cards | `/gift-cards` | ✅ Working |
| Registry | `/registry` | ✅ Working |
| Sell with Us | `/sell` | ✅ Working |
| Track Orders | `/account/orders` | ✅ Working |
| Membership | `/plans` | ✅ Route exists in `(plans)/` |

### 🔧 KEEP + CREATE CONTENT PAGE
| Link | Route | Content Needed |
|------|-------|----------------|
| Security | `/security` | **Priority** - Explain Stripe payment security, data protection, fraud prevention |
| Accessibility | `/accessibility` | A11y statement (good for legal compliance, EU requirements) |

### 📋 KEEP AS PLACEHOLDER (Future Features)
| Link | Route | Future Purpose |
|------|-------|----------------|
| Store Locator | `/store-locator` | **Business Feature** - Let business accounts list their physical stores, show on map |
| Careers | `/careers` | Job listings when hiring |
| Blog | `/blog` | News, updates, seller tips |
| Investors | `/investors` | Funding info, financials |
| Affiliates | `/affiliates` | Affiliate/referral program |
| Advertise | `/advertise` | Ad platform for brands |
| Suppliers | `/suppliers` | B2B supplier partnerships |
| Free Shipping | `/free-shipping` | Shipping policies/thresholds |

### ❌ REMOVE (Irrelevant)
| Link | Reason |
|------|--------|
| `/pharmacy` | Physical retail - not applicable to marketplace |
| `/optical` | Physical retail - not applicable to marketplace |
| `/clinic` | Physical retail - not applicable to marketplace |
| `/same-day-delivery` | Don't have this service (maybe future) |
| `/order-pickup` | Don't have physical pickup points (maybe future with store-locator) |
| `/recalls` | Product recalls - overkill for marketplace, can be in help/ToS |
| `/sustainability` | Nice-to-have but not critical now |
| `/press` | Press releases - not needed yet |
| `/feedback` | Can use Contact page instead |

### ❌ REMOVE (US-Specific, Not Applicable for EU/BG)
| Link | Reason |
|------|--------|
| CA Privacy Rights | California-specific law (CCPA) |
| Interest Based Ads | US FTC requirement |
| "Your Privacy Choices" with icon | US CCPA toggle requirement |

---

## 🏗️ New Footer Structure

### Section 1: Company
- About Treido ✅
- Careers 📋
- Blog 📋
- Investors 📋

### Section 2: Help
- Help Center ✅
- Returns ✅
- Track Orders ✅
- Contact Us ✅
- Security 🔧

### Section 3: Sell & Business
- Sell with Us ✅
- Store Locator 📋 (for business accounts)
- Affiliates 📋
- Advertise 📋
- Suppliers 📋

### Section 4: Services
- Membership ✅
- Gift Cards ✅
- Registry ✅
- Free Shipping 📋
- Accessibility 🔧

### Legal Row (Bottom)
- Terms ✅
- Privacy Policy ✅
- Cookie Preferences ✅

### Social Media
- Keep all 6 icons (Pinterest, Facebook, Instagram, X, YouTube, TikTok)
- Will receive real URLs from user

---

## 📝 Implementation Tasks

### Phase 1A: Footer Component Cleanup ✅ DONE
- [x] Remove irrelevant links from `footerSections` array
- [x] Reorganize into new 4-section structure
- [x] Remove US-specific legal links
- [x] Keep social media links (placeholder `#` for now)

### Phase 1B: Translation Cleanup ✅ DONE
- [x] Remove unused keys from `en.json` Footer section
- [x] Remove unused keys from `bg.json` Footer section
- [x] Add new keys if needed (Security, Accessibility)

### Phase 1C: Create Content Pages ✅ DONE
Priority order:
1. [x] `/security` - Payment security with Stripe, data protection
2. [x] `/accessibility` - A11y compliance statement (as coming-soon)

### Phase 1D: Create Placeholder Pages ✅ DONE
Template: Simple "Coming Soon" page with email signup
- [x] `/careers`
- [x] `/blog`
- [x] `/investors`
- [x] `/affiliates`
- [x] `/advertise`
- [x] `/suppliers`
- [x] `/store-locator`
- [x] `/free-shipping`

### Phase 1E: Verify & Test
- [ ] Run dev server and click all footer links
- [ ] Verify no 404s
- [ ] Check both EN and BG locales

---

## 🔒 Security Page Content Outline

```
# Security at Treido

## Payment Security
- All payments processed by Stripe (PCI DSS Level 1 certified)
- We never store your card details
- 3D Secure authentication supported
- Encrypted transactions (TLS 1.3)

## Account Security
- Secure password hashing
- Email verification required
- Session management
- Optional 2FA (future)

## Data Protection
- GDPR compliant
- Data encrypted at rest
- Regular security audits
- Bug bounty program (future)

## Fraud Prevention
- Transaction monitoring
- Seller verification
- Buyer protection program
- Report suspicious activity

## Contact Security Team
- security@treido.eu
```

---

## 📋 Placeholder Page Template

```tsx
// Generic "Coming Soon" placeholder structure
- Hero: Feature name + "Coming Soon"
- Brief description of what this feature will be
- Email signup: "Be the first to know"
- Back to home button
```

---

## 📅 Timeline Estimate

| Task | Est. Time |
|------|-----------|
| Footer component cleanup | 15 min |
| Translation cleanup | 10 min |
| Security page (content) | 20 min |
| Accessibility page | 15 min |
| Placeholder page template | 10 min |
| Apply template to 8 pages | 30 min |
| Testing | 10 min |
| **Total** | **~2 hours** |

---

## ✅ Completion Checklist

- [ ] No broken footer links (404s)
- [ ] All links lead to real or placeholder pages
- [ ] US-specific legal removed
- [ ] Translations synced EN/BG
- [ ] Security page live with Stripe info
- [ ] Footer visually balanced on mobile/desktop
