# Triage Guide (Verify)

Goal: identify the smallest next fix that will unblock gates.

## If `typecheck` fails

- locate the first TS error
- identify if it’s a real bug or a typing regression
- prefer fixing the root type, not `as any`

Common causes:

- server/client boundary importing the wrong module
- nullable data passed into a non-null type

## If `lint` fails

- fix the specific rule; don’t disable lint rules
- avoid “drive-by” formatting changes beyond touched files

## If `styles:gate` fails

- fix violations file-by-file until the gate is green
- do not add exceptions unless `.codex/project/DESIGN.md` explicitly allows it

Common causes:

- palette utilities (`text-slate-900`)
- arbitrary values (`px-[13px]`)
- gradients (`bg-gradient-to-*`)

## If e2e smoke fails

- confirm it’s deterministic (re-run once)
- identify the first failing assertion/screenshot
- map failure to the last batch’s files
- if auth/checkout flows break, treat as high priority

