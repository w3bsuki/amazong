# P3-MON-01: Buyer Protection Columns

**Columns in `subscription_plans`:**

| Column | Type | Default |
|--------|------|---------|
| `buyer_protection_percent` | numeric | 4.0 |
| `buyer_protection_fixed` | numeric | 0.50 |
| `buyer_protection_cap` | numeric | 15.00 |
| `seller_fee_percent` | numeric | 0 |

**Current plan values:**

| Plan | Buyer Protection % | Fixed | Cap | Seller Fee % |
|------|-------------------|-------|-----|--------------|
| Free | 4.00 | 0.50 | 15.00 | 0.00 |
| Plus | 3.50 | 0.40 | 14.00 | 0.00 |
| Pro | 3.00 | 0.30 | 12.00 | 0.00 |
| Business Free | 3.00 | 0.35 | 12.00 | 1.50 |
| Business Pro | 2.50 | 0.25 | 10.00 | 1.00 |
| Business Enterprise | 2.00 | 0.20 | 8.00 | 0.50 |

**Verdict:** P3-MON-01 already complete (migration `20260119230508_buyer_protection_fees`).
