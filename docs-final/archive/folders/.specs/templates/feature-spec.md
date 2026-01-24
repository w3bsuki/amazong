# Spec: {{FEATURE_NAME}}

> Created: {{DATE}}
> Status: Queue | Active | Completed | Blocked
> Owner: Claude (impl) | Codex (verify)

---

## Goal

**WHEN** a user {{trigger condition}}
**THE SYSTEM SHALL** {{expected behavior}}

## Non-Goals

- {{What this spec explicitly does NOT cover}}

## Users / Roles

- **Buyer**: {{how this affects buyers}}
- **Seller**: {{how this affects sellers}}
- **Guest**: {{how this affects unauthenticated users}}

---

## Requirements (EARS Notation)

### R1: {{Requirement Name}}
**WHEN** {{condition/event}}
**THE SYSTEM SHALL** {{expected behavior}}

**Acceptance Criteria:**
- [ ] {{Testable criterion 1}}
- [ ] {{Testable criterion 2}}

### R2: {{Requirement Name}}
**WHEN** {{condition/event}}
**THE SYSTEM SHALL** {{expected behavior}}

**Acceptance Criteria:**
- [ ] {{Testable criterion}}

---

## UX States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Initial fetch | Skeleton / spinner |
| Empty | No data | Empty state message |
| Error | Fetch failed | Error message + retry |
| Success | Data loaded | Full UI |
| Unauthorized | No auth | Redirect / prompt |

---

## Data + Auth

### Tables Involved
- `{{table_name}}`: {{what data}}

### RLS Expectations
- {{Who can read/write what}}

### Supabase Client
- [ ] Browser client (`createClient`)
- [ ] Server client (`createServerClient`)
- [ ] Service role (admin only)

---

## Caching (if applicable)

### Cache Profile
- Profile: `{{products|categories|deals|user}}`
- TTL: {{duration}}

### Cache Tag
- Tag: `{{tag-name}}`

### Invalidation Points
- {{When to call `revalidateTag()`}}

---

## i18n

### New Keys Required
```json
{
  "{{Namespace}}.{{key1}}": "{{English text}}",
  "{{Namespace}}.{{key2}}": "{{English text}}"
}
```

### Routing Notes
- {{Any locale-specific behavior}}

---

## Risks / Gotchas

- ⚠️ {{Potential issue 1}}
- ⚠️ {{Potential issue 2}}

---

## Tasks

### Phase 1: {{Phase Name}}
- [ ] **Task 1**: {{Description}}
  - Files: `{{path/to/file}}`
  - Verify: {{How to verify}}
- [ ] **Task 2**: {{Description}}

### Phase 2: {{Phase Name}}
- [ ] **Task 3**: {{Description}}

---

## Verification

### Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [ ] `pnpm -s lint` (0 errors)

### Manual QA
- [ ] {{Specific thing to test manually}}

---

## Agent Prompts (Copy/Paste)

### FRONTEND
```
FRONTEND: {{Specific UI task}}
Files: {{paths}}
Constraints: {{any constraints}}
Verify: {{how to verify}}
```

### BACKEND
```
BACKEND: {{Specific server task}}
Files: {{paths}}
Constraints: {{any constraints}}
Verify: {{how to verify}}
```

### SUPABASE
```
SUPABASE: {{Specific DB task}}
Constraints: {{any constraints}}
```
