-- Fix search_path for normalize_attribute_key function
-- Security Advisor warning: function_search_path_mutable

CREATE OR REPLACE FUNCTION public.normalize_attribute_key(name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN LOWER(
    TRIM(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(name, '\s+', '_', 'g'),  -- spaces to underscore
          '[()]', '', 'g'                           -- remove parentheses
        ),
        '[^a-zA-Z0-9_]', '', 'g'                    -- remove other special chars
      )
    )
  );
END;
$function$;;
