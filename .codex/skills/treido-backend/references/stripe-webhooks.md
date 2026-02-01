# Stripe Webhooks (Treido)

The webhook endpoint must be:

- signature verified
- idempotent
- safe in logging

## Signature verification (required)

- use the raw request body when verifying
- reject when signature is missing/invalid

## Idempotency (required)

Stripe can retry events.

Patterns:

- store processed `event.id` and short-circuit duplicates
- make DB writes idempotent (upserts keyed on Stripe IDs)

## Validation

Never trust metadata/payload contents:

- validate required fields exist
- validate JSON metadata is parseable
- treat “items_json”/similar as untrusted input

## Logging policy

Do not log:

- full payloads
- headers
- signatures

Log:

- event id
- event type
- minimal derived facts (counts, ids that are already public-safe)

