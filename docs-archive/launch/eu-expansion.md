# 🇪🇺 EU-Wide Expansion

> **Status**: 🟡 Ready for EU with minor fixes
> **Priority**: P1 (Post Bulgaria launch or concurrent)

---

## ✅ Already Compliant

You're in great shape! These are done:

- [x] **GDPR Cookie Consent** - Banner with accept/decline
- [x] **Privacy Policy** - Comprehensive, mentions data deletion rights
- [x] **Terms of Service** - Covers distance selling, disputes
- [x] **Cookie Policy** - Detailed explanations of all cookie types
- [x] **14-Day Right of Withdrawal** - You offer 30 days (exceeds requirement!)
- [x] **EUR Currency** - Code ready, just needs Stripe fix
- [x] **i18n Infrastructure** - EN/BG with easy expansion
- [x] **Geo Detection** - `proxy.ts` detects country from headers
- [x] **`ships_to_europe` Flag** - Already in products schema

---

## 🔴 Must Fix for EU Launch

### 1. Stripe Currency (P0)
Change `currency: 'usd'` → `'eur'` in checkout.

**File**: `app/[locale]/(checkout)/_actions/checkout.ts`

### 2. ODR Link in Footer (P1)
EU law requires link to Online Dispute Resolution platform for B2C sales.

**Link**: https://ec.europa.eu/consumers/odr

Add to footer alongside Terms/Privacy links.

### 3. Company Information Display (P1)
EU e-commerce requires visible:
- Legal company name: Treido Bulgaria EOOD
- Registered address
- VAT number (if registered)
- Company registration number

Add to footer or dedicated "About Us" / "Imprint" page.

### 4. "Incl. VAT" Price Display (P1)
EU B2C prices must show VAT is included. Add text near prices:
```
€29.99 (incl. VAT)
```

---

## 🟡 Recommended for EU Markets

### 5. EU Country Support in Addresses
Expand country dropdown to include all 27 EU member states:

```typescript
const EU_COUNTRIES = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
]
```

### 6. Shipping Zones & Rates
Configure shipping costs by zone:
- Zone 1: Bulgaria (local) - 2-3 days
- Zone 2: Neighboring (RO, GR, RS, MK, TR) - 3-5 days  
- Zone 3: Rest of EU - 5-7 days

### 7. Additional Languages (Optional)
High-impact languages for EU reach:
- German (DE) - Largest EU economy
- French (FR) - Second largest
- Spanish (ES) - Third largest
- Italian (IT) - Fourth largest
- Polish (PL) - Large e-commerce market

Can add progressively post-launch.

---

## 📋 VAT Considerations

### For Physical Goods (Your Case)
- **Selling from Bulgaria**: Charge Bulgarian VAT (20%)
- **Under €10,000/year cross-border**: Keep charging BG VAT
- **Over €10,000/year**: Register for OSS (One-Stop Shop) and charge destination VAT

### OSS Registration (When Needed)
If you exceed €10k in cross-border B2C sales:
1. Register for OSS via Bulgarian tax authority (NRA)
2. Charge VAT rate of buyer's country
3. File quarterly OSS return covering all EU sales
4. Pay all VAT through single Bulgarian filing

### For Now
Start with Bulgarian VAT on all prices. Monitor cross-border sales volume.
OSS registration can happen when you approach €10k threshold.

---

## 🛡️ Legal Documents Checklist

| Document | Status | Location |
|----------|--------|----------|
| Privacy Policy | ✅ | `/privacy` |
| Terms of Service | ✅ | `/terms` |
| Cookie Policy | ✅ | `/cookies` |
| Returns Policy | ✅ | Mentioned in Terms |
| Imprint/About | ⚠️ | Need to add company details |
| ODR Link | ⚠️ | Need in footer |

---

## 🚀 EU Launch Phases

### Phase 1: Bulgaria Launch (Current)
- Fix Stripe to EUR
- Verify all legal pages work
- Launch for Bulgarian market

### Phase 2: EU Soft Launch (+2 weeks)
- Enable EU-wide shipping
- Add EU country list
- Add ODR link and company info
- Monitor orders from other EU countries

### Phase 3: EU Expansion (+1-2 months)
- Add German/French translations
- Set up shipping partnerships for EU
- Consider OSS VAT registration
- Localized marketing

---

## 📝 No Special Licenses Required

For a C2C/B2C marketplace operating from Bulgaria to EU:

✅ **Not Required**:
- E-commerce license (no such thing in EU)
- Payment services license (Stripe handles this)
- Cross-border selling permit

✅ **Required** (You Have):
- Company registration (Treido Bulgaria EOOD)
- Terms of Service
- Privacy Policy
- GDPR compliance

⚠️ **May Need Later**:
- VAT OSS registration (if >€10k cross-border)
- Local tax registrations (if warehousing in other countries)

---

## 🎯 Acceptance Criteria

- [ ] Stripe checkout uses EUR
- [ ] ODR link in footer
- [ ] Company info visible (footer or imprint page)
- [ ] "Incl. VAT" shown on prices
- [ ] All 27 EU countries in address dropdown
- [ ] Shipping estimates for EU zones
- [ ] Privacy/Terms/Cookies pages load without errors
