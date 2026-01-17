```markdown
# Content Moderation Guidelines — Treido.eu

**Version:** 1.0  
**Internal Document — Operations Team**  
**Last Updated:** January 17, 2026

---

## 1. Overview

### 1.1 Purpose

This document provides guidelines for moderating user-generated content on Treido.eu, including:
- Listings
- Profile content
- Messages (when reported)
- Reviews and comments

### 1.2 Principles

Our moderation approach is guided by:
1. **Safety First** — Protect users from harm
2. **Fairness** — Apply rules consistently
3. **Transparency** — Clear reasons for actions
4. **Proportionality** — Punishment fits the violation
5. **Appeal Rights** — Allow users to contest decisions

### 1.3 Scope

This covers both:
- **Proactive moderation** — Automated checks, queue review
- **Reactive moderation** — User reports, escalations

---

## 2. Moderation Queue

### 2.1 Queue Priority

| Priority | Description | Target Response Time |
|----------|-------------|---------------------|
| 🔴 **P1 — Critical** | Illegal content, imminent harm | < 1 hour |
| 🟠 **P2 — High** | Fraud, prohibited items, harassment | < 4 hours |
| 🟡 **P3 — Medium** | Policy violations, duplicate listings | < 24 hours |
| 🟢 **P4 — Low** | Minor issues, quality concerns | < 72 hours |

### 2.2 P1 Triggers (Escalate Immediately)

- Child exploitation content (contact authorities)
- Weapons for sale (unlicensed)
- Drugs or controlled substances
- Imminent threats of violence
- Human trafficking indicators

### 2.3 Automated Flagging

The system automatically flags:
- Keywords: prohibited item names, slurs, spam patterns
- Images: Nudity detection, known illegal content hashes
- Behavior: Rapid listing creation, copy-paste descriptions
- Links: Known phishing domains, malware URLs

---

## 3. Listing Moderation

### 3.1 Review Checklist

For each flagged listing, verify:

**Content:**
- [ ] Title is descriptive and not misleading
- [ ] Description matches photos
- [ ] No prohibited items (see prohibited-items.md)
- [ ] No contact information in description/photos
- [ ] Correct category selected

**Photos:**
- [ ] Show actual item (not stock photos)
- [ ] No offensive/inappropriate content
- [ ] No watermarks from other platforms
- [ ] No embedded contact info

**Price:**
- [ ] Realistic (not €0.01 or €999,999)
- [ ] In EUR currency
- [ ] Consistent with item

**Seller:**
- [ ] Account in good standing
- [ ] No pattern of violations
- [ ] Verified if required

### 3.2 Actions

| Action | When to Use | User Notification |
|--------|------------|-------------------|
| **Approve** | Listing is compliant | None (auto-published) |
| **Edit** | Minor fixable issues | "Listing edited for quality" |
| **Reject** | Policy violation | Reason code + explanation |
| **Escalate** | Unclear/complex case | Internal only |
| **Ban** | Serious violation | Account action notice |

### 3.3 Rejection Reasons (Canned Responses)

```
PROHIBITED_ITEM: "Your listing was removed because it contains a prohibited item. See our Prohibited Items policy."

MISLEADING: "Your listing was removed for misleading content. Please ensure descriptions and photos accurately represent the item."

DUPLICATE: "Your listing was removed as a duplicate. Please do not post the same item multiple times."

WRONG_CATEGORY: "Your listing was moved to [CATEGORY] as it was incorrectly categorized."

CONTACT_INFO: "Your listing was edited to remove contact information. Use our messaging system to communicate with buyers."

STOCK_PHOTO: "Your listing requires photos of the actual item. Stock photos are not allowed."

PRICE_ISSUE: "Your listing was removed due to unrealistic pricing. Please list at a fair market price."
```

---

## 4. Profile Moderation

### 4.1 Profile Content Review

Check for:
- **Username:** No offensive language, impersonation, contact info
- **Profile photo:** Appropriate, no nudity, no brand logos (unless business)
- **Bio:** No spam, no external links (unless business)
- **Location:** Realistic for Bulgaria/EU

### 4.2 Business Profile Requirements

Business accounts must display:
- Legal business name
- Registration number (EIK)
- Address (can be city-level)
- Contact information

### 4.3 Profile Actions

| Issue | Action |
|-------|--------|
| Offensive username | Request change + temporary restriction |
| Impersonation | Immediate suspension + verification request |
| Spam in bio | Edit content + warning |
| Fake location | Warning + correction |

---

## 5. Message Moderation

### 5.1 When to Review Messages

Messages are reviewed only when:
- User reports received
- Automated system flags suspicious content
- Part of dispute investigation
- Requested by law enforcement (with valid order)

### 5.2 Message Violations

| Violation | Action |
|-----------|--------|
| Spam/bulk messages | 24h messaging restriction + warning |
| Harassment | Warning → temporary ban → permanent ban |
| Threats | Immediate suspension + escalate |
| Phishing/scam | Immediate ban + report |
| Sexual solicitation | Immediate ban |

### 5.3 Privacy Considerations

- Moderators access only flagged conversations
- Read minimum necessary content
- Document reason for access
- Maintain confidentiality

---

## 6. Review/Comment Moderation

### 6.1 Review Guidelines

Reviews should be:
- Based on actual interaction
- Factual, not defamatory
- Free of prohibited content
- Not incentivized/fake

### 6.2 When to Remove Reviews

Remove if:
- No evidence of actual transaction
- Contains hate speech or threats
- Clearly fraudulent (paid review, fake account)
- From banned account
- Contains personal information of others

Do NOT remove for:
- Being negative (if factual)
- Disagreement on quality
- Low rating alone
- Seller complaint (unless justified)

---

## 7. User Reports

### 7.1 Report Categories

Users can report for:
1. Prohibited item
2. Fraudulent listing
3. Harassment
4. Spam
5. Inappropriate content
6. Other violation

### 7.2 Report Handling

1. **Acknowledge:** Auto-acknowledgment on submission
2. **Triage:** Assign priority based on category
3. **Investigate:** Review content + context
4. **Decide:** Take action or dismiss
5. **Notify:** Inform reporter of outcome (general terms)

### 7.3 False Reports

Repeated false reports may result in:
- Warning to reporter
- Restriction on reporting ability
- Account review

---

## 8. Escalation Procedures

### 8.1 When to Escalate

Escalate to supervisor/legal when:
- Potential illegal activity
- Complex policy interpretation
- High-profile user involved
- Media/PR implications
- Potential lawsuit risk
- Imminent physical threat

### 8.2 Escalation Path

```
Moderator → Senior Moderator → Operations Lead → Legal/Management
```

### 8.3 Law Enforcement Requests

For law enforcement requests:
1. Verify authenticity of request
2. Escalate to legal immediately
3. Do not disclose request to user
4. Document all actions
5. Preserve relevant data

---

## 9. Appeals Process

### 9.1 User Appeal Rights

Users can appeal:
- Listing removals
- Account suspensions
- Review removals
- Any moderation action

### 9.2 Appeal Handling

1. User submits appeal via email/form
2. Different moderator reviews (not original)
3. Review original decision + new information
4. Decide: Uphold / Modify / Reverse
5. Notify user within 7 business days

### 9.3 Appeal Outcomes

| Outcome | Action |
|---------|--------|
| **Uphold** | Original decision stands |
| **Modify** | Partial reversal (e.g., reduce ban duration) |
| **Reverse** | Restore content/access + apology if appropriate |

---

## 10. Enforcement Actions

### 10.1 Progressive Discipline

For most violations:

| Stage | Action | Duration |
|-------|--------|----------|
| 1st violation | Warning | N/A |
| 2nd violation | Feature restriction | 7 days |
| 3rd violation | Temporary suspension | 14 days |
| 4th violation | Extended suspension | 30 days |
| 5th+ violation | Permanent ban | Forever |

### 10.2 Immediate Bans

Skip progressive discipline for:
- Illegal items/activity
- Fraud/scams
- Threats of violence
- CSAM (any instance)
- Multiple account abuse
- Severe harassment

### 10.3 Documentation

For every action, document:
- User ID
- Listing/content ID
- Violation type
- Evidence (screenshot)
- Action taken
- Moderator ID
- Date/time

---

## 11. Special Categories

### 11.1 High-Value Items (€500+)

Additional scrutiny:
- Verify seller has other activity
- Check for common scam patterns
- Consider requiring verification

### 11.2 Vehicle Listings

Check for:
- Realistic photos (not stock)
- VIN not visible in photos (privacy)
- No "too good to be true" prices
- Seller has verifiable profile

### 11.3 Real Estate

Check for:
- Seller authorization (owner/agent)
- Realistic pricing for area
- No rental scam indicators
- Legitimate contact information

---

## 12. Automated Systems

### 12.1 Current Automation

| System | Function |
|--------|----------|
| Keyword filter | Flag prohibited terms |
| Image hash | Detect known bad images |
| Duplicate detection | Flag copy-paste listings |
| Rate limiting | Prevent spam attacks |
| Link scanner | Check for malware/phishing |

### 12.2 Human Override

All automated actions can be reviewed:
- User appeals trigger human review
- High-confidence actions may auto-execute
- Low-confidence flags go to queue

---

## 13. Metrics and Reporting

### 13.1 Key Metrics

Track weekly/monthly:
- Total items reviewed
- Actions by type (approve/reject/edit/ban)
- Average response time by priority
- Appeal rate and overturn rate
- Reports by category
- Moderator productivity

### 13.2 Quality Assurance

- 5% random sample audited weekly
- Consistency checks across moderators
- Calibration sessions for edge cases
- Feedback loop from appeals

---

## 14. Moderator Guidelines

### 14.1 Conduct

Moderators must:
- Be impartial and consistent
- Document all decisions
- Escalate when unsure
- Maintain confidentiality
- Not interact with users personally
- Report any conflicts of interest

### 14.2 Self-Care

Given exposure to harmful content:
- Take regular breaks
- Use content-limiting features
- Report burnout concerns
- Access support resources

### 14.3 Training

Required training:
- Initial onboarding (policies, tools)
- Quarterly refreshers
- Updates on new policies
- Legal/compliance basics

---

## 15. Contact

**Operations Lead:** [NAME]  
**Email:** moderation@treido.eu  
**Escalation:** escalations@treido.eu  
**Legal:** legal@treido.eu

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-17 | Initial version |

---

*Internal document — Not for public distribution*

```
