# treido-alignment References

Data alignment audit resources.

## Schema Sources

- Supabase MCP (`mcp__supabase__*`) — Live schema truth
- `lib/types/*` — TypeScript type definitions
- `supabase/migrations/*` — Migration history

## Code Locations

### Backend
- `app/actions/*` — Server actions (Supabase queries)
- `app/api/*` — Route handlers
- `lib/supabase/*` — Supabase client utilities

### Frontend
- `components/*` — UI components (data consumers)
- `hooks/*` — Data fetching hooks

## Output Templates

See SKILL.md for:
- Coverage matrix format
- Gap report format
- Task assignment format

Decision tree:
- `decision-tree.md` — full alignment audit decision tree (schema → backend → frontend → gaps → owners)
