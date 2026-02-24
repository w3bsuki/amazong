-- Make Brand multi-select in filter UI
-- Safe: only updates existing select-type Brand attributes
update public.category_attributes
set attribute_type = 'multiselect'
where lower(name) = 'brand'
  and attribute_type = 'select';
;
