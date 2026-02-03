# Security — Operating Manual

## Mission

Prevent accidental security regressions during aggressive refactors.

## Responsibilities

- Enforce “no secrets/PII” in logs and client code.
- Review auth/session and Stripe/payment surface changes (pause conditions).
- Flag risky patterns (service role exposure, unsafe redirects, open redirects, etc.).

