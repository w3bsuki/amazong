# GPT + OPUS Collaboration Hub

> **Purpose**: Cross-AI collaboration for Treido marketplace production push  
> **Model**: Opus (executor with MCP) ↔ Codex (architect/reviewer)

## 🗂️ Structure

```
GPT+OPUS/
├── README.md                    # This file
├── conversations/               # Async discussions
├── decisions/                   # Finalized decisions (DEC-XXX)
├── specs/                       # PRDs and technical specs
├── audits/                      # Technical audits
└── checklists/                  # Launch and operational checklists
```

## 📋 Conversations Index

| ID | Topic | Status | Date |
|----|-------|--------|------|
| [001](./conversations/CONVERSATION-001.md) | Project Introduction & Strategy | ✅ Reviewed by Codex | 2026-01-13 |
| [002](./conversations/CONVERSATION-002.md) | Codex Review + Questions | ✅ Answered in 003 | 2026-01-13 |
| [003](./conversations/CONVERSATION-003.md) | Opus Answers to Codex Questions | ✅ Reviewed by Codex | 2026-01-13 |
| [004](./conversations/CONVERSATION-004.md) | Codex Draft Decisions + 3 Questions | ✅ Answered in 005 | 2026-01-13 |
| [005](./conversations/CONVERSATION-005.md) | Codex Alignment + Final DEC Text | ✅ Human Confirmed | 2026-01-13 |
| [006](./conversations/CONVERSATION-006.md) | Codex UX Correction: Hierarchy + Popularity | ✅ Addressed in 007 | 2026-01-13 |
| [007](./conversations/CONVERSATION-007.md) | Opus Implementation Plan | ✅ Greenlit by Codex | 2026-01-13 |
| [008](./conversations/CONVERSATION-008.md) | Codex Greenlight + Tight Slice | ✅ Executed | 2026-01-13 |
| [009](./conversations/CONVERSATION-009.md) | Opus Execution Complete | ✅ VERIFIED | 2026-01-13 |
| [010](./conversations/CONVERSATION-010.md) | Codex Review - 6 Follow-ups | ✅ All Fixed | 2026-01-13 |
| [011](./conversations/CONVERSATION-011.md) | Opus Fix Report | ✅ VERIFIED | 2026-01-13 |

## 📜 Decisions Index

| ID | Topic | Status | Date |
|----|-------|--------|------|
| [DEC-002](./decisions/DEC-002-category-navigation.md) | Category Navigation Rules | ✅ IMPLEMENTED | 2026-01-13 |
| [DEC-003](./decisions/DEC-003-monetization-v1.md) | Monetization Mode A | 🟢 AGREED | 2026-01-13 |

## 📄 Specs Index

| Doc | Topic | Status |
|-----|-------|--------|
| [PRD-monetization-model](./specs/PRD-monetization-model.md) | Revenue streams & pricing | 🟡 OPUS PROPOSING |

## 🔍 Audits Index

| Doc | Topic | Status |
|-----|-------|--------|
| [AUDIT-production-readiness](./audits/AUDIT-production-readiness.md) | Launch blockers & gaps | 🟡 OPUS DRAFT |

## 🚀 Quick Links

- [Current TODO](../TODO.md) - Active tasks
- [Engineering Guide](../docs/ENGINEERING.md) - Code standards
- [Production Checklist](../docs/PRODUCTION.md) - Launch requirements
- [Design System](../docs/DESIGN.md) - UI tokens and patterns

## 📖 Collaboration Protocol

### Workflow
```
1. Human Request
2. Opus drafts plan/analysis
3. Codex reviews, challenges, improves
4. Agree on approach (or escalate to human)
5. Opus executes with MCP tools
6. Codex reviews output
7. Document learnings
```

### Status Markers
- `🟡 OPUS PROPOSING` - Awaiting Codex review
- `🟣 CODEX PROPOSING` - Awaiting Opus review  
- `🟢 AGREED` - Ready to execute
- `🔴 CONTESTED` - Needs human decision
- `✅ EXECUTED` - Completed and verified
- `⏸️ PARKED` - Deprioritized for now

### File Naming
- `CONVERSATION-XXX.md` - Discussions
- `DEC-XXX-topic.md` - Decisions
- `PRD-topic.md` - Product requirements
- `SPEC-topic.md` - Technical specifications
- `AUDIT-topic.md` - Technical audits
- `CHECKLIST-topic.md` - Actionable checklists

## 🎯 Current Focus

**Goal**: Production launch of Treido Bulgarian C2C marketplace

**Completed This Session**:
- ✅ DEC-002: Category navigation rules (curated-first ordering, L0-L3 browse)
- ✅ DEC-003: Monetization Mode A (classifieds-first, defer checkout)
- ✅ category_stats materialized view for product counts
- ✅ Data layer: `getSubcategoriesForBrowse()`, `getSubcategoriesWithCounts()`
- ✅ UI: SubcategoryCircles + SubcategoryTabs with counts display
- ✅ Category page integration with browse-optimized subcategories

**Next Steps**: 
- Visual review of category pages
- Mobile integration (MobileHomeTabs)
- Pick next item from [TODO.md](../TODO.md)
