# Legal & Compliance — Treido

> EU regulatory requirements, GDPR, marketplace obligations.
> Planning doc, not legal advice. Consult a lawyer for final ToS/Privacy Policy.

---

## GDPR Compliance

### Data We Collect

| Data Type | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| Email, name | Account management | Contract | Until account deletion |
| Address | Shipping/checkout | Contract | Until order lifecycle complete |
| Payment info | Processing payments | Contract | Handled by Stripe (PCI compliant) |
| Product photos | Listing display | Contract | Until listing deleted |
| Chat messages | Buyer-seller communication | Legitimate interest | Dispute window + 90 days |
| Usage analytics | Product improvement | Legitimate interest | Aggregated, no PII retained |
| Cookies | Session, preferences | Consent | Session / 1 year |

### GDPR Checklist

- [ ] Privacy Policy published at treido.eu/privacy
- [ ] Cookie consent banner (before non-essential cookies)
- [ ] Data export (user can request their data — Art. 15)
- [ ] Right to deletion (user can request account + data deletion — Art. 17)
- [ ] Data processing agreements (with Supabase, Stripe, Vercel)
- [ ] Breach notification process (within 72 hours — Art. 33)

**DPO:** Not required (<250 employees, no large-scale special category processing).

---

## EU Marketplace Regulations

### Digital Services Act (DSA)

Key obligations for smaller platforms:
- [ ] Transparency: Business sellers must display business info
- [ ] Notice and action: Mechanism for reporting illegal content/listings
- [ ] Terms of Service: Clear, accessible, applied consistently

*Full DSA obligations scale with platform size. We're far from "very large platform" (45M+ EU users).*

### Consumer Rights Directive

- [ ] 14-day withdrawal right for cross-border B2C sales
- [ ] Clear pre-contractual information (price, seller identity, delivery)
- [ ] Purchase confirmation via email

### Payment Services

- Stripe handles PSD2/SCA (Strong Customer Authentication)
- No card data handled directly → no PCI DSS scope for us
- Stripe Connect handles seller KYC/AML

---

## KYC / KYB / AML

### What Stripe Covers
- Connect onboarding collects identity/banking info for payouts
- Businesses provide KYB details via Stripe

### What Platform Covers
- Phone verification (anti-spam, account recovery)
- Seller limits for new accounts (listing caps, price caps)
- Manual reviews for first sales / flagged disputes
- Minimize stored sensitive data (prefer Stripe-hosted onboarding)

---

## Terms of Service — Key Sections

- [ ] Platform role (marketplace facilitator, not seller)
- [ ] User obligations (accurate listings, no prohibited items)
- [ ] Prohibited items list
- [ ] Fee structure (reference plans-pricing.md)
- [ ] Dispute resolution process
- [ ] Liability limitations
- [ ] Account termination conditions
- [ ] Governing law (Bulgarian law + EU regulations)

### Prohibited Items

Always prohibited:
- Weapons, ammunition
- Drugs, tobacco, alcohol
- Counterfeit goods / replicas
- Stolen property
- Hacked accounts, credentials, codes
- Hazardous materials
- Live animals

**Digital-only goods:** TBD (likely V2).

---

## Business Registration

| Item | Status |
|------|--------|
| Company registration (Bulgaria) | **Decision needed** — EAD/EOOD |
| Tax registration (VAT) | Required above BGN 100K revenue |
| Stripe account (business) | Active (test mode) |
| Domain ownership | treido.eu — registered |
| Professional liability insurance | **Decision needed** |

---

## Pre-Launch Compliance Checklist

- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Cookie consent implemented
- [ ] Prohibited items policy defined
- [ ] Seller identity requirements for business accounts
- [ ] Report/takedown mechanism exists
- [ ] Stripe production environment verified
- [ ] Legal entity established
- [ ] Support playbooks written

---

*Last updated: 2026-02-23*
*Status: Requirements mapped. Legal entity and ToS/Privacy still needed.*
