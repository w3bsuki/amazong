# i18n Audit Checklist

Start with: `docs/launch/PLAN-I18N.md`.

- [ ] No hardcoded user-facing strings in JSX.
- [ ] Server actions don’t return raw English sentences that appear in UI.
- [ ] `messages/en.json` and `messages/bg.json` maintain key parity.
- [ ] System messages/notifications are either localized at render-time or stored as structured types (post-launch refactor if needed).

