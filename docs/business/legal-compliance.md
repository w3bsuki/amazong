# Legal & Compliance — Treido

> EU regulatory requirements, GDPR, marketplace obligations.
> This doc tracks what we need to be compliant, not the legal text itself.
> **Disclaimer:** This is a planning doc, not legal advice. Consult a lawyer for final ToS/Privacy Policy.

---

## GDPR Compliance

### What We Collect

| Data Type | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| Email, name | Account management | Contract | Until account deletion |
| Address | Shipping/checkout | Contract | Until order lifecycle complete |
| Payment info | Processing payments | Contract | Handled by Stripe (PCI compliant) |
| Product photos | Listing display | Contract | Until listing deleted |
| Chat messages | Buyer-seller communication | Legitimate interest | **[DECISION NEEDED]** |
| Usage analytics | Product improvement | Legitimate interest | Aggregated, no PII retained |
| Cookies | Session, preferences | Consent | Session / 1 year |

### GDPR Requirements

- [ ] **Privacy Policy** — Published at treido.eu/privacy
- [ ] **Cookie consent banner** — Before non-essential cookies
- [ ] **Data export** — User can request their data (GDPR Art. 15)
- [ ] **Right to deletion** — User can request account + data deletion (Art. 17)
- [ ] **Data processing agreements** — With Supabase, Stripe, Vercel
- [ ] **Breach notification** — Process for notifying within 72 hours (Art. 33)
- [ ] **DPO** — **[DECISION NEEDED]** Data Protection Officer needed? (<250 employees likely exempt)

---

## EU Marketplace Regulations

### Digital Services Act (DSA, 2024+)

Applies to online marketplaces. Key obligations:

- [ ] **Transparency of sellers** — Business sellers must display business info
- [ ] **Notice and action** — Mechanism for reporting illegal content/listings
- [ ] **Trusted flaggers** — Process for handling reports
- [ ] **Terms of Service** — Clear, accessible, applied consistently

*Note: Most DSA obligations for smaller platforms are lighter. Full compliance requirements scale with platform size (>45M EU users = "very large platform" — we're far from that).*

### Consumer Rights Directive

- [ ] 14-day withdrawal right for cross-border B2C sales
- [ ] Clear pre-contractual information (price, seller identity, delivery)
- [ ] Confirmation of purchase via email

### Payment Services

- Stripe handles PSD2/SCA compliance (Strong Customer Authentication)
- We don't handle card data directly → no PCI DSS scope for us
- Stripe Connect handles seller KYC/AML

---

## Terms of Service

### Key Sections Needed

- [ ] Platform role (marketplace, not seller — we facilitate, not sell directly)
- [ ] User obligations (accurate listings, no prohibited items)
- [ ] Prohibited items list (weapons, drugs, counterfeit, etc.)
- [ ] Fee structure (reference plans-pricing.md)
- [ ] Dispute resolution process
- [ ] Liability limitations
- [ ] Account termination conditions
- [ ] Governing law (Bulgarian law + EU regulations)

### Prohibited Items Policy

**[DECISION NEEDED]** — What can't be sold? Standard list:
- Weapons, ammunition
- Drugs, tobacco, alcohol
- Counterfeit goods
- Stolen property
- Adult content
- Live animals
- Hazardous materials
- Personal data / accounts
- Digital-only goods? **[DECISION NEEDED]**

---

## Business Registration

| Item | Status |
|------|--------|
| Company registration (Bulgaria) | **[DECISION NEEDED]** — EAD/EOOD? |
| Tax registration (VAT) | **[DECISION NEEDED]** — Required above BGN 100K revenue |
| Stripe account (business) | Active (test mode) |
| Domain ownership | treido.eu — registered |

---

## Insurance

**[DECISION NEEDED]** — Professional liability insurance for marketplace operators?

---

## Compliance Checklist (Pre-Launch)

- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Cookie consent implemented
- [ ] Prohibited items policy defined
- [ ] Seller identity requirements for business accounts
- [ ] Report/takedown mechanism exists
- [ ] Stripe production environment verified
- [ ] Legal entity established

---

*Last updated: 2026-02-23*
*Status: Skeleton — needs legal review*
