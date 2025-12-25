# Launch-Eve Test Plan (3–5 terminals)

## Objective

Get high-confidence signal on:
- Desktop + mobile usability
- A11y baseline
- Critical flows: signup/login/buy/sell/profile

## Recommended schedule (time-boxed)

### Phase 1 (30–60 min): Parallel dev-mode validation

- Start one server (Terminal 1)
- Run desktop, mobile, a11y in parallel (Terminals 2–5)
- Fix only launch-blockers (don’t refactor)

### Phase 2 (30–60 min): Manual UI/UX pass

Use [QA_UI_UX_CHECKLIST.md](QA_UI_UX_CHECKLIST.md) while tests run.

### Phase 3 (final confidence): Production-mode run

Single pass:

- `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- `pnpm -s build`
- `TEST_PROD=true pnpm test:e2e`

(Optionally `pnpm test:a11y` after.)

## Splitting strategy

Use [TERMINAL_SPLIT.md](TERMINAL_SPLIT.md).

Rule:

- Many terminals is fine.
- Many Next servers is not.

Always reuse the same server locally via `REUSE_EXISTING_SERVER=true`.
