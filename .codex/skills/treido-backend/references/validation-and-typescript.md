# Validation + TypeScript (Backend Lane)

Backend correctness comes from validating at the boundary and keeping types honest.

## Boundary validation

Every untrusted input must be validated:

- request bodies (`req.json()`)
- query params
- route params
- webhook metadata

Preferred pattern:

- define a Zod schema
- parse with safe coercions
- return explicit errors (400/422) for invalid inputs

## Avoid “type lies”

Do not:

- use `as any` to silence the compiler
- use `@ts-ignore` for production code
- assume nullable data exists (`foo!`) without a guard

Prefer:

- narrow with `if (!foo) return …`
- use result types and exhaustiveness checks

## Safe DTO mapping

When passing data to the client:

- map DB rows to minimal DTOs
- avoid leaking columns unintentionally
- keep JSON payload sizes small

