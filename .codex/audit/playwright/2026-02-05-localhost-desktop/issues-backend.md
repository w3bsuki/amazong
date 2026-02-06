# Backend / Integration Issues — Desktop localhost audit (2026-02-05)

## Summary

- Health endpoint (`/api/health/env`) returned `ok=true` with no missing fields (safe fields only; see `gates.md`).
- Standard gates passed, including smoke E2E (`20 passed`, `1 skipped`).
- No hard backend/integration failures were surfaced in this run.

## Coverage gaps / risks

- Smoke suite includes **1 skipped** seller-flow test (listing creation path). This can hide seller onboarding / payouts / listing backend issues.
- AI assistant flows were not exercised beyond opening the UI modal (to avoid triggering external calls/cost in a generic audit run).
