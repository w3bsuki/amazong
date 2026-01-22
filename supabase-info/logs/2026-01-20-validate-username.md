# P1-SUPA-04: `validate_username` Function Drift

**Current state:** Single canonical definition exists.

```sql
CREATE OR REPLACE FUNCTION public.validate_username(username text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check length
  IF length(username) < 3 OR length(username) > 30 THEN
    RETURN false;
  END IF;
  
  -- Check format: lowercase letters, numbers, underscores only
  IF username !~ '^[a-z0-9_]+$' THEN
    RETURN false;
  END IF;
  
  -- Must start with letter or number
  IF username !~ '^[a-z0-9]' THEN
    RETURN false;
  END IF;
  
  -- Cannot end with underscore
  IF username ~ '_$' THEN
    RETURN false;
  END IF;
  
  -- No consecutive underscores
  IF username ~ '__' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$
```

**Drift risk:** RESOLVED
- Function has `SET search_path TO 'public'` (secure)
- Function is `IMMUTABLE` (deterministic)
- Single definition in production (no duplicates)

**Note:** The audit from 2026-01-17 flagged 3 migrations defining this function with different rules. After all migrations applied, only the latest (most secure) version persists in the database.
