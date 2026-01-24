# Audit Spec: {{AUDIT_NAME}}

> Created: {{DATE}}
> Status: Queue | Active | Completed | Blocked
> Owner: Claude (impl) | Codex (verify)
> Audit Type: {{architecture|ux|security|performance|i18n|a11y}}

---

## Audit Scope

**What we're auditing:**
- {{System/feature/flow being audited}}

**Why:**
- {{Business reason — launch blocker? Technical debt? User complaints?}}

**Success criteria:**
- {{Measurable outcome — e.g., "0 TypeScript errors in checkout flow"}}

---

## Audit Checklist

### Category 1: {{Category Name}}

| Item | Current State | Target | Status |
|------|---------------|--------|--------|
| {{Item 1}} | {{Current}} | {{Target}} | ⏳ |
| {{Item 2}} | {{Current}} | {{Target}} | ⏳ |

**Findings:**
- {{Finding 1}}
- {{Finding 2}}

**Fixes Required:**
- [ ] {{Fix 1}}
- [ ] {{Fix 2}}

---

### Category 2: {{Category Name}}

| Item | Current State | Target | Status |
|------|---------------|--------|--------|
| {{Item}} | {{Current}} | {{Target}} | ⏳ |

**Findings:**
- {{Finding}}

**Fixes Required:**
- [ ] {{Fix}}

---

## Routes / Files in Scope

### Routes
- `/{{route1}}` — {{what it does}}
- `/{{route2}}` — {{what it does}}

### Files
- `{{path/to/file1.tsx}}` — {{why included}}
- `{{path/to/file2.ts}}` — {{why included}}

---

## Audit Methodology

### Tools Used
- [ ] Manual review
- [ ] `pnpm -s exec tsc --noEmit` (TypeScript)
- [ ] `pnpm test:unit` (Unit tests)
- [ ] `pnpm test:e2e:smoke` (E2E)
- [ ] Playwright a11y project (Accessibility)
- [ ] Lighthouse (Performance)
- [ ] Custom script: `{{script name}}`

### Pass Criteria
- {{What constitutes "pass" for this audit}}

---

## Tasks (Fixes)

### Priority 1: Critical (Launch Blockers)
- [ ] **Fix 1**: {{Description}}
  - Files: `{{path}}`
  - Risk: {{High/Medium/Low}}

### Priority 2: Important (Should Fix)
- [ ] **Fix 2**: {{Description}}

### Priority 3: Nice to Have (Post-Launch)
- [ ] **Fix 3**: {{Description}}

---

## Verification

### Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

### Audit-Specific
- [ ] Re-run audit checklist — all items ✅
- [ ] {{Specific verification for this audit type}}

---

## Summary Template (for completion)

```markdown
## Audit: {{name}} — COMPLETED

### Scope
{{What was audited}}

### Key Findings
- {{Finding 1}}: Fixed by {{change}}
- {{Finding 2}}: Deferred to {{reason}}

### Metrics
| Metric | Before | After |
|--------|--------|-------|
| {{metric}} | {{before}} | {{after}} |

### Remaining Debt
- {{Any items intentionally deferred}}

### Date
{{Date completed}}
```

---

## Agent Prompts

### Initial Audit Run
```
{{SKILL_PREFIX}}: Audit {{area}} following .specs/active/{{spec-name}}/requirements.md
Output: Findings in audit checklist format
```

### Fix Implementation
```
FRONTEND: Fix {{specific issue}} found in audit
Files: {{paths}}
Constraint: {{any constraint}}
```
