```markdown
# GDPR Compliance Checklist — Treido.eu

**Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** Pre-launch audit

---

## Overview

This checklist ensures Treido.eu complies with:
- **GDPR** (Regulation (EU) 2016/679)
- **Bulgarian Law on Personal Data Protection**
- **ePrivacy Directive** (cookies)
- **Bulgarian Law on Electronic Commerce**

---

## 1. Legal Basis Documentation

### 1.1 Processing Activities Register

| ✅ | Task | Status | Notes |
|----|------|--------|-------|
| ☐ | Create Record of Processing Activities (RoPA) | Not started | Required by Art. 30 |
| ☐ | Document all personal data processing | Not started | |
| ☐ | Identify legal basis for each processing | Not started | |
| ☐ | Document data retention periods | Not started | |
| ☐ | List third-party processors | Not started | |

### 1.2 Legal Basis per Processing Activity

| Activity | Legal Basis | Documentation |
|----------|------------|---------------|
| Account creation | Contract (Art. 6(1)(b)) | ToS acceptance |
| Listing publication | Contract | ToS acceptance |
| Payment processing | Contract | ToS, payment consent |
| Marketing emails | Consent (Art. 6(1)(a)) | Opt-in checkbox |
| Analytics | Legitimate interest / Consent | Privacy Policy + LIA |
| Fraud prevention | Legitimate interest | LIA document |
| Legal compliance | Legal obligation (Art. 6(1)(c)) | Applicable laws |

### 1.3 Legitimate Interest Assessments (LIA)

| ✅ | Processing Activity | LIA Status |
|----|---------------------|------------|
| ☐ | Platform security | Needed |
| ☐ | Fraud prevention | Needed |
| ☐ | Service improvement | Needed |
| ☐ | Direct marketing (own services) | Needed |

---

## 2. Data Subject Rights

### 2.1 Rights Implementation

| ✅ | Right | Implementation | Status |
|----|-------|----------------|--------|
| ☐ | **Access (Art. 15)** | "Download my data" feature | Needed |
| ☐ | **Rectification (Art. 16)** | Profile editing | ✅ Done |
| ☐ | **Erasure (Art. 17)** | Account deletion flow | Needed |
| ☐ | **Restriction (Art. 18)** | Manual process (support) | Needed |
| ☐ | **Portability (Art. 20)** | Export JSON/CSV | Needed |
| ☐ | **Object (Art. 21)** | Marketing opt-out | Needed |
| ☐ | **Automated decisions (Art. 22)** | Not applicable (no ADM) | N/A |

### 2.2 Request Handling Process

| ✅ | Requirement | Status |
|----|-------------|--------|
| ☐ | Identity verification procedure | Needed |
| ☐ | Response within 30 days | Procedure needed |
| ☐ | Free of charge (first request) | Policy defined |
| ☐ | Refusal logging and justification | Procedure needed |
| ☐ | Appeal process for denials | Needed |

### 2.3 Response Templates

| ✅ | Template | Status |
|----|----------|--------|
| ☐ | Access request acknowledgment | Needed |
| ☐ | Access request response | Needed |
| ☐ | Erasure confirmation | Needed |
| ☐ | Portability data package | Needed |
| ☐ | Objection acknowledgment | Needed |
| ☐ | Request denial (with reasons) | Needed |

---

## 3. Privacy Notices

### 3.1 Required Documents

| ✅ | Document | Location | Status |
|----|----------|----------|--------|
| ✅ | Privacy Policy (BG) | /privacy-bg | Created |
| ✅ | Privacy Policy (EN) | /privacy-en | Created |
| ☐ | Cookie Policy | /cookies | Needed |
| ☐ | Registration privacy notice | Sign-up page | Needed |
| ☐ | Contact form privacy notice | Contact page | Needed |

### 3.2 Privacy Notice Content (Art. 13/14)

| ✅ | Required Element | Included |
|----|------------------|----------|
| ✅ | Controller identity and contact | Yes |
| ✅ | DPO contact (if applicable) | Yes |
| ✅ | Purposes of processing | Yes |
| ✅ | Legal bases | Yes |
| ✅ | Recipients/categories | Yes |
| ✅ | Third country transfers | Yes |
| ✅ | Retention periods | Yes |
| ✅ | Data subject rights | Yes |
| ✅ | Right to complain to DPA | Yes |
| ✅ | Source of data (if not from subject) | Yes |
| ✅ | Automated decision-making info | Yes |

---

## 4. Consent Management

### 4.1 Cookie Consent

| ✅ | Requirement | Status |
|----|-------------|--------|
| ☐ | Cookie banner implemented | Needed |
| ☐ | Granular consent options | Needed |
| ☐ | Consent before non-essential cookies | Needed |
| ☐ | Easy withdraw mechanism | Needed |
| ☐ | Consent logging | Needed |
| ☐ | Banner recurrence (renewal) | Needed |

### 4.2 Marketing Consent

| ✅ | Requirement | Status |
|----|-------------|--------|
| ☐ | Explicit opt-in checkbox (unchecked default) | Needed |
| ☐ | Consent recorded with timestamp | Needed |
| ☐ | Easy unsubscribe in every email | Needed |
| ☐ | Consent audit trail | Needed |
| ☐ | Double opt-in (recommended) | Recommended |

### 4.3 Third-Party Consent

| ✅ | Requirement | Status |
|----|-------------|--------|
| ☐ | Separate consent for third-party marketing | Needed |
| ☐ | Clear disclosure of third parties | Needed |
| ☐ | Ability to withdraw separately | Needed |

---

## 5. Data Protection by Design & Default

### 5.1 Privacy by Design

| ✅ | Principle | Implementation |
|----|-----------|----------------|
| ☐ | Data minimization | Only collect necessary data |
| ☐ | Purpose limitation | Clear purpose for each data point |
| ☐ | Storage limitation | Retention periods enforced |
| ☐ | Accuracy | User can edit own data |
| ☐ | Integrity & confidentiality | Encryption, access controls |

### 5.2 Privacy by Default

| ✅ | Requirement | Status |
|----|-------------|--------|
| ☐ | Profiles private by default | Check settings |
| ☐ | Marketing opt-out by default | Implement |
| ☐ | Minimal data in listings (no phone required) | Verify |
| ☐ | Location approximate by default | Verify |

### 5.3 Technical Measures

| ✅ | Measure | Status |
|----|---------|--------|
| ✅ | TLS/HTTPS everywhere | Done (Vercel) |
| ✅ | Password hashing (bcrypt/Argon2) | Done (Supabase) |
| ☐ | Database encryption at rest | Verify (Supabase) |
| ☐ | Encrypted backups | Verify |
| ☐ | Access logging | Needed |
| ☐ | Audit trail for sensitive actions | Needed |

---

## 6. Third-Party Processors

### 6.1 Processor Agreements (DPAs)

| ✅ | Processor | Purpose | DPA Status |
|----|-----------|---------|------------|
| ☐ | Supabase | Database, Auth | Need to verify |
| ☐ | Stripe | Payments | Standard DPA exists |
| ☐ | Vercel | Hosting | Standard DPA exists |
| ☐ | Resend/SendGrid | Email | Need DPA |
| ☐ | Google Analytics | Analytics | Need DPA |

### 6.2 DPA Requirements (Art. 28)

Each DPA must include:
- [ ] Subject-matter and duration
- [ ] Nature and purpose of processing
- [ ] Type of personal data
- [ ] Categories of data subjects
- [ ] Controller's obligations and rights
- [ ] Processor's obligations (security, audits, sub-processors)

### 6.3 Sub-Processor Management

| ✅ | Requirement | Status |
|----|-------------|--------|
| ☐ | List of sub-processors | Need from each processor |
| ☐ | Notification of changes | In DPA |
| ☐ | Right to object | In DPA |

---

## 7. International Data Transfers

### 7.1 Transfer Mechanisms

| ✅ | Destination | Mechanism | Status |
|----|-------------|-----------|--------|
| ☐ | US (Stripe) | SCCs + supplementary measures | Verify |
| ☐ | US (other) | SCCs | Verify |
| ☐ | EU adequate countries | Adequacy decision | Auto-OK |

### 7.2 Transfer Impact Assessments (TIAs)

| ✅ | Transfer | TIA Status |
|----|----------|------------|
| ☐ | Stripe (US) | Needed |
| ☐ | Google Analytics (US) | Needed |
| ☐ | Email provider (if US) | Needed |

### 7.3 Supplementary Measures

For US transfers, document:
- [ ] Encryption in transit and at rest
- [ ] Access controls (EU personnel where possible)
- [ ] Technical measures to prevent government access
- [ ] Data minimization for transferred data

---

## 8. Data Breach Procedures

### 8.1 Breach Response Plan

| ✅ | Step | Procedure | Owner |
|----|------|-----------|-------|
| ☐ | Detection | Monitoring, alerts, reports | IT |
| ☐ | Containment | Incident response procedure | IT |
| ☐ | Assessment | Breach severity matrix | DPO/Legal |
| ☐ | DPA notification (72h) | Template + contact | DPO |
| ☐ | User notification (if high risk) | Template + channels | DPO + Support |
| ☐ | Documentation | Breach register | DPO |
| ☐ | Post-incident review | Lessons learned | All |

### 8.2 КЗЛД (Bulgarian DPA) Notification

| ✅ | Requirement | Prepared |
|----|-------------|----------|
| ☐ | Contact details for КЗЛД | Yes |
| ☐ | Notification form/template | Needed |
| ☐ | 72-hour timeline procedure | Needed |
| ☐ | Escalation chain defined | Needed |

**КЗЛД Contact:**
- Address: бул. „Проф. Цветан Лазаров" № 2, 1592 София
- Email: kzld@cpdp.bg
- Phone: +359 2 915 3518
- Web: cpdp.bg

### 8.3 User Notification Template

| ✅ | Element | Included |
|----|---------|----------|
| ☐ | Nature of breach | Yes |
| ☐ | Data affected | Yes |
| ☐ | Likely consequences | Yes |
| ☐ | Measures taken | Yes |
| ☐ | DPO contact | Yes |
| ☐ | Recommendations for users | Yes |

---

## 9. Data Protection Officer (DPO)

### 9.1 DPO Requirement Assessment

| Criterion | Applies? | Notes |
|-----------|----------|-------|
| Public authority | No | |
| Large-scale systematic monitoring | Maybe | Depends on scale |
| Large-scale special categories | No | |

**Decision:** DPO may not be legally required at launch, but recommended as we scale.

### 9.2 DPO Alternatives

| ✅ | Option | Status |
|----|--------|--------|
| ☐ | Designate internal DPO | Consider post-launch |
| ☐ | External DPO service | Option for launch |
| ☐ | Data protection contact | Minimum (privacy@treido.eu) |

---

## 10. Training and Awareness

### 10.1 Staff Training

| ✅ | Training | Audience | Status |
|----|----------|----------|--------|
| ☐ | GDPR basics | All staff | Needed |
| ☐ | Data handling procedures | Ops, Support | Needed |
| ☐ | Breach recognition | All staff | Needed |
| ☐ | Data subject rights | Support | Needed |

### 10.2 Documentation

| ✅ | Document | Status |
|----|----------|--------|
| ☐ | Internal data protection policy | Needed |
| ☐ | Data handling procedures | Needed |
| ☐ | Acceptable use policy | Needed |

---

## 11. Retention and Deletion

### 11.1 Retention Schedule

| Data Type | Retention Period | Basis |
|-----------|-----------------|-------|
| Account data | Until deletion + 30 days | Contract |
| Listings (active) | Until expiration/deletion | Contract |
| Listings (archived) | 90 days | Legitimate interest |
| Messages | 2 years | Legitimate interest |
| Payment records | 10 years | Tax law |
| Security logs | 6 months | Security |
| Marketing consent | Until withdrawal | Consent |

### 11.2 Automated Deletion

| ✅ | Process | Status |
|----|---------|--------|
| ☐ | Expired listing cleanup | Needed |
| ☐ | Deleted account data purge | Needed |
| ☐ | Old message archival/deletion | Needed |
| ☐ | Log rotation | Verify |

### 11.3 Manual Deletion Procedures

| ✅ | Request Type | Procedure |
|----|--------------|-----------|
| ☐ | Account deletion | Documented process |
| ☐ | Listing deletion | Self-service + support |
| ☐ | Message deletion | Support request |

---

## 12. Children's Data

### 12.1 Age Verification

| ✅ | Measure | Status |
|----|---------|--------|
| ☐ | Age checkbox at registration (18+) | Needed |
| ☐ | ToS acceptance confirms age | In ToS |
| ☐ | Parental consent mechanism (if under 16) | N/A (we don't allow) |

### 12.2 Child Data Handling

| ✅ | Policy | Status |
|----|--------|--------|
| ☐ | No targeting of children | Policy |
| ☐ | Immediate deletion if discovered | Procedure needed |
| ☐ | Contact point for parents | privacy@treido.eu |

---

## 13. Special Categories of Data

### 13.1 Assessment

| Special Category | Collected? | Notes |
|------------------|------------|-------|
| Racial/ethnic origin | No | |
| Political opinions | No | |
| Religious beliefs | No | |
| Trade union membership | No | |
| Genetic data | No | |
| Biometric data | No | (No facial recognition) |
| Health data | No | |
| Sex life/orientation | No | |

**Conclusion:** No special category data collected. No Art. 9 obligations.

---

## 14. DPIA (Data Protection Impact Assessment)

### 14.1 DPIA Requirement Assessment

| Processing Activity | High Risk? | DPIA Needed? |
|---------------------|------------|--------------|
| User registration | No | No |
| Listing publication | No | No |
| Messaging | Maybe | Consider |
| Payment processing | No (Stripe handles) | No |
| Fraud prevention | Maybe | Consider at scale |
| Profiling for recommendations | Maybe | When implemented |

### 14.2 DPIA Status

| ✅ | Activity | DPIA Status |
|----|----------|-------------|
| ☐ | General platform operation | Not required at launch |
| ☐ | Future: AI moderation | Will need DPIA |
| ☐ | Future: Personalization | Will need DPIA |

---

## 15. Documentation Index

### 15.1 Required Documents

| Document | Status | Location |
|----------|--------|----------|
| Privacy Policy (BG) | ✅ Created | docs/policies/ |
| Privacy Policy (EN) | ✅ Created | docs/policies/ |
| Terms of Service (BG) | ✅ Created | docs/policies/ |
| Terms of Service (EN) | ✅ Created | docs/policies/ |
| Cookie Policy | ☐ Needed | docs/policies/ |
| RoPA | ☐ Needed | Internal |
| Breach Response Plan | ☐ Needed | Internal |
| DPA with processors | ☐ Verify | Legal files |
| LIA documents | ☐ Needed | Internal |
| Internal Data Policy | ☐ Needed | Internal |

---

## 16. Pre-Launch Checklist Summary

### 16.1 Critical (Must Have for Launch)

| ✅ | Item | Owner |
|----|------|-------|
| ✅ | Privacy Policy published | Legal/Dev |
| ✅ | Terms of Service published | Legal/Dev |
| ☐ | Cookie banner implemented | Dev |
| ☐ | Consent checkboxes (registration) | Dev |
| ☐ | Marketing opt-out works | Dev |
| ☐ | Account deletion available | Dev |
| ☐ | HTTPS everywhere | Dev |
| ☐ | DPA with Supabase verified | Legal |
| ☐ | DPA with Stripe verified | Legal |
| ☐ | Breach notification procedure | DPO/Legal |

### 16.2 Important (Should Have)

| ✅ | Item | Owner |
|----|------|-------|
| ☐ | Data export feature | Dev |
| ☐ | RoPA completed | DPO |
| ☐ | Staff GDPR training | HR/DPO |
| ☐ | LIAs documented | DPO |
| ☐ | Internal data policy | DPO |

### 16.3 Recommended (Nice to Have)

| ✅ | Item | Owner |
|----|------|-------|
| ☐ | External DPO engagement | Management |
| ☐ | Privacy certification | Future |
| ☐ | Regular compliance audits | DPO |

---

## 17. Contact

**Data Protection Contact:** privacy@treido.eu  
**Legal:** legal@treido.eu  
**Technical:** dev@treido.eu

**Bulgarian DPA (КЗЛД):**
- Website: cpdp.bg
- Email: kzld@cpdp.bg
- Phone: +359 2 915 3518

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-17 | Initial checklist |

---

*Internal document — Compliance tracking*

```
