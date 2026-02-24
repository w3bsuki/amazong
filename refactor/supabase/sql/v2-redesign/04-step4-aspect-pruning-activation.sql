-- CATEGORY REDESIGN v2
-- Step 4: Aspect pruning + activation + search rebuild.
-- Draft only. Do not run in production without approval.

begin;

-- 4a) Prune old aspect rows (keep data for rollback by deactivating, not deleting).
update public.category_attributes ca
set is_active = false
from public.categories c
where ca.category_id = c.id
  and c.slug not like 'v2-%';

-- 4b) Seed launch aspects for top 5 verticals
-- (Electronics, Home & Kitchen, Fashion, Automotive, Kids).
create temporary table tmp_template_keys (
  template_name text not null,
  attribute_key text not null
) on commit drop;

insert into tmp_template_keys (template_name, attribute_key) values
  -- Electronics
  ('electronics_phone','brand'),('electronics_phone','model'),('electronics_phone','storage'),('electronics_phone','ram'),('electronics_phone','color'),('electronics_phone','condition'),('electronics_phone','network'),('electronics_phone','carrier_lock'),('electronics_phone','battery_life'),('electronics_phone','warranty'),
  ('electronics_laptop','brand'),('electronics_laptop','model'),('electronics_laptop','processor'),('electronics_laptop','ram'),('electronics_laptop','storage'),('electronics_laptop','gpu'),('electronics_laptop','screen_size'),('electronics_laptop','condition'),('electronics_laptop','battery_life'),('electronics_laptop','warranty'),
  ('electronics_desktop','brand'),('electronics_desktop','model'),('electronics_desktop','processor'),('electronics_desktop','ram'),('electronics_desktop','storage'),('electronics_desktop','gpu'),('electronics_desktop','form_factor'),('electronics_desktop','condition'),('electronics_desktop','warranty'),
  ('electronics_tablet','brand'),('electronics_tablet','model'),('electronics_tablet','screen_size'),('electronics_tablet','storage'),('electronics_tablet','connectivity'),('electronics_tablet','color'),('electronics_tablet','condition'),('electronics_tablet','warranty'),
  ('electronics_tv','brand'),('electronics_tv','model'),('electronics_tv','screen_size'),('electronics_tv','resolution'),('electronics_tv','display_type'),('electronics_tv','smart_platform'),('electronics_tv','refresh_rate'),('electronics_tv','condition'),('electronics_tv','warranty'),
  ('electronics_monitor','brand'),('electronics_monitor','model'),('electronics_monitor','screen_size'),('electronics_monitor','resolution'),('electronics_monitor','refresh_rate'),('electronics_monitor','panel_type'),('electronics_monitor','response_time'),('electronics_monitor','condition'),
  ('electronics_audio','brand'),('electronics_audio','model'),('electronics_audio','audio_type'),('electronics_audio','connectivity'),('electronics_audio','power_source'),('electronics_audio','condition'),('electronics_audio','warranty'),
  ('electronics_camera','brand'),('electronics_camera','model'),('electronics_camera','camera_type'),('electronics_camera','sensor_type'),('electronics_camera','lens_mount'),('electronics_camera','resolution'),('electronics_camera','condition'),('electronics_camera','warranty'),
  ('electronics_wearable','brand'),('electronics_wearable','model'),('electronics_wearable','device_type'),('electronics_wearable','connectivity'),('electronics_wearable','battery_life'),('electronics_wearable','water_resistance'),('electronics_wearable','condition'),
  ('electronics_smart_home','brand'),('electronics_smart_home','model'),('electronics_smart_home','device_type'),('electronics_smart_home','connectivity'),('electronics_smart_home','platform'),('electronics_smart_home','power_source'),('electronics_smart_home','condition'),
  ('electronics_components','component_type'),('electronics_components','brand'),('electronics_components','model'),('electronics_components','compatibility'),('electronics_components','storage_type'),('electronics_components','speed'),('electronics_components','capacity'),('electronics_components','condition'),('electronics_components','warranty'),

  -- Home & Kitchen
  ('home_furniture','brand'),('home_furniture','furniture_type'),('home_furniture','material'),('home_furniture','color'),('home_furniture','style'),('home_furniture','dimensions'),('home_furniture','assembly_required'),('home_furniture','condition'),
  ('home_decor','brand'),('home_decor','decor_type'),('home_decor','material'),('home_decor','color'),('home_decor','style'),('home_decor','dimensions'),('home_decor','condition'),
  ('home_kitchen_appliances','brand'),('home_kitchen_appliances','appliance_type'),('home_kitchen_appliances','power_watts'),('home_kitchen_appliances','capacity'),('home_kitchen_appliances','energy_rating'),('home_kitchen_appliances','color'),('home_kitchen_appliances','condition'),('home_kitchen_appliances','warranty'),
  ('home_cookware_dining','brand'),('home_cookware_dining','material'),('home_cookware_dining','set_size'),('home_cookware_dining','dishwasher_safe'),('home_cookware_dining','induction_compatible'),('home_cookware_dining','color'),('home_cookware_dining','condition'),
  ('home_bedding_bath','brand'),('home_bedding_bath','material'),('home_bedding_bath','size'),('home_bedding_bath','thread_count'),('home_bedding_bath','color'),('home_bedding_bath','pattern'),('home_bedding_bath','condition'),
  ('home_garden_outdoor','brand'),('home_garden_outdoor','product_type'),('home_garden_outdoor','material'),('home_garden_outdoor','weather_resistant'),('home_garden_outdoor','outdoor_use'),('home_garden_outdoor','power_source'),('home_garden_outdoor','condition'),
  ('home_office_school','brand'),('home_office_school','product_type'),('home_office_school','material'),('home_office_school','color'),('home_office_school','paper_size'),('home_office_school','ergonomic'),('home_office_school','condition'),
  ('home_storage_organization','brand'),('home_storage_organization','storage_type'),('home_storage_organization','material'),('home_storage_organization','capacity'),('home_storage_organization','dimensions'),('home_storage_organization','color'),('home_storage_organization','condition'),
  ('home_cleaning_laundry','brand'),('home_cleaning_laundry','product_type'),('home_cleaning_laundry','surface_type'),('home_cleaning_laundry','quantity'),('home_cleaning_laundry','scent'),('home_cleaning_laundry','refillable'),('home_cleaning_laundry','condition'),
  ('home_tools_improvement','brand'),('home_tools_improvement','tool_type'),('home_tools_improvement','power_source'),('home_tools_improvement','material'),('home_tools_improvement','indooroutdoor'),('home_tools_improvement','warranty'),('home_tools_improvement','condition'),

  -- Fashion
  ('fashion_women_clothing','brand'),('fashion_women_clothing','size'),('fashion_women_clothing','color'),('fashion_women_clothing','material'),('fashion_women_clothing','style'),('fashion_women_clothing','season'),('fashion_women_clothing','pattern'),('fashion_women_clothing','condition'),
  ('fashion_men_clothing','brand'),('fashion_men_clothing','size'),('fashion_men_clothing','color'),('fashion_men_clothing','material'),('fashion_men_clothing','style'),('fashion_men_clothing','season'),('fashion_men_clothing','pattern'),('fashion_men_clothing','condition'),
  ('fashion_women_shoes','brand'),('fashion_women_shoes','shoe_size_eu'),('fashion_women_shoes','color'),('fashion_women_shoes','material'),('fashion_women_shoes','style'),('fashion_women_shoes','heel_height'),('fashion_women_shoes','condition'),
  ('fashion_men_shoes','brand'),('fashion_men_shoes','shoe_size_eu'),('fashion_men_shoes','color'),('fashion_men_shoes','material'),('fashion_men_shoes','style'),('fashion_men_shoes','sport_type'),('fashion_men_shoes','condition'),
  ('fashion_bags_accessories','brand'),('fashion_bags_accessories','accessory_type'),('fashion_bags_accessories','material'),('fashion_bags_accessories','color'),('fashion_bags_accessories','size'),('fashion_bags_accessories','closure'),('fashion_bags_accessories','style'),('fashion_bags_accessories','condition'),
  ('fashion_jewelry','brand'),('fashion_jewelry','jewelry_type'),('fashion_jewelry','material'),('fashion_jewelry','stone_type'),('fashion_jewelry','color'),('fashion_jewelry','authenticity'),('fashion_jewelry','condition'),
  ('fashion_watches','brand'),('fashion_watches','model'),('fashion_watches','watch_type'),('fashion_watches','band_material'),('fashion_watches','case_size'),('fashion_watches','water_resistance'),('fashion_watches','movement'),('fashion_watches','condition'),
  ('fashion_sportswear','brand'),('fashion_sportswear','size'),('fashion_sportswear','gender'),('fashion_sportswear','material'),('fashion_sportswear','sport_type'),('fashion_sportswear','color'),('fashion_sportswear','condition'),
  ('fashion_kids_fashion','brand'),('fashion_kids_fashion','size'),('fashion_kids_fashion','age_group'),('fashion_kids_fashion','gender'),('fashion_kids_fashion','material'),('fashion_kids_fashion','color'),('fashion_kids_fashion','season'),('fashion_kids_fashion','condition'),
  ('fashion_luxury_preowned','brand'),('fashion_luxury_preowned','model'),('fashion_luxury_preowned','material'),('fashion_luxury_preowned','condition'),('fashion_luxury_preowned','authenticity'),('fashion_luxury_preowned','year'),

  -- Automotive
  ('auto_vehicles','make'),('auto_vehicles','model'),('auto_vehicles','year'),('auto_vehicles','body_type'),('auto_vehicles','fuel_type'),('auto_vehicles','transmission'),('auto_vehicles','mileage'),('auto_vehicles','condition'),
  ('auto_ev','make'),('auto_ev','model'),('auto_ev','year'),('auto_ev','ev_type'),('auto_ev','range'),('auto_ev','battery_capacity'),('auto_ev','charging_speed'),('auto_ev','condition'),
  ('auto_parts','part_type'),('auto_parts','part_number'),('auto_parts','compatible_makes'),('auto_parts','compatible_models'),('auto_parts','compatible_years'),('auto_parts','condition'),('auto_parts','warranty'),
  ('auto_accessories','accessory_type'),('auto_accessories','vehicle_type'),('auto_accessories','material'),('auto_accessories','color'),('auto_accessories','compatibility'),('auto_accessories','condition'),
  ('auto_electronics','brand'),('auto_electronics','model'),('auto_electronics','electronics_type'),('auto_electronics','connectivity'),('auto_electronics','compatibility'),('auto_electronics','power_source'),('auto_electronics','condition'),('auto_electronics','warranty'),
  ('auto_tools_equipment','tool_type'),('auto_tools_equipment','power_source'),('auto_tools_equipment','material'),('auto_tools_equipment','vehicle_type'),('auto_tools_equipment','warranty'),('auto_tools_equipment','condition'),
  ('auto_tires_wheels','brand'),('auto_tires_wheels','tire_type'),('auto_tires_wheels','width'),('auto_tires_wheels','aspect_ratio'),('auto_tires_wheels','rim_diameter'),('auto_tires_wheels','season'),('auto_tires_wheels','load_index'),('auto_tires_wheels','condition'),
  ('auto_oils_fluids','fluid_type'),('auto_oils_fluids','viscosity'),('auto_oils_fluids','specification'),('auto_oils_fluids','volume'),('auto_oils_fluids','brand'),('auto_oils_fluids','compatibility'),('auto_oils_fluids','condition'),

  -- Kids
  ('kids_strollers','brand'),('kids_strollers','stroller_type'),('kids_strollers','age_range'),('kids_strollers','weight_capacity'),('kids_strollers','foldable'),('kids_strollers','color'),('kids_strollers','material'),('kids_strollers','condition'),
  ('kids_car_seats','brand'),('kids_car_seats','car_seat_group'),('kids_car_seats','car_seat_type'),('kids_car_seats','isofix'),('kids_car_seats','weight_range'),('kids_car_seats','age_range'),('kids_car_seats','color'),('kids_car_seats','condition'),
  ('kids_nursery_furniture','brand'),('kids_nursery_furniture','crib_type'),('kids_nursery_furniture','material'),('kids_nursery_furniture','color'),('kids_nursery_furniture','mattress_size'),('kids_nursery_furniture','convertible'),('kids_nursery_furniture','condition'),
  ('kids_feeding','brand'),('kids_feeding','product_type'),('kids_feeding','material'),('kids_feeding','bpa_free'),('kids_feeding','age_range'),('kids_feeding','dishwasher_safe'),('kids_feeding','condition'),
  ('kids_clothing_shoes','brand'),('kids_clothing_shoes','size'),('kids_clothing_shoes','age_group'),('kids_clothing_shoes','gender'),('kids_clothing_shoes','material'),('kids_clothing_shoes','color'),('kids_clothing_shoes','season'),('kids_clothing_shoes','condition'),
  ('kids_toys_games','brand'),('kids_toys_games','toy_type'),('kids_toys_games','age_group'),('kids_toys_games','subject_focus'),('kids_toys_games','material'),('kids_toys_games','color'),('kids_toys_games','educational'),('kids_toys_games','condition'),
  ('kids_learning_books','brand'),('kids_learning_books','age_group'),('kids_learning_books','language'),('kids_learning_books','subject_focus'),('kids_learning_books','format'),('kids_learning_books','condition'),
  ('kids_baby_care','brand'),('kids_baby_care','product_type'),('kids_baby_care','age_group'),('kids_baby_care','skin_type'),('kids_baby_care','fragrance_free'),('kids_baby_care','quantity'),('kids_baby_care','condition');

create temporary table tmp_leaf_templates (
  leaf_slug text not null,
  template_name text not null
) on commit drop;

insert into tmp_leaf_templates (leaf_slug, template_name) values
  ('v2-electronics-smartphones','electronics_phone'),
  ('v2-electronics-laptops','electronics_laptop'),
  ('v2-electronics-computers','electronics_desktop'),
  ('v2-electronics-tablets','electronics_tablet'),
  ('v2-electronics-tvs','electronics_tv'),
  ('v2-electronics-monitors','electronics_monitor'),
  ('v2-electronics-audio','electronics_audio'),
  ('v2-electronics-cameras','electronics_camera'),
  ('v2-electronics-wearables','electronics_wearable'),
  ('v2-electronics-smart-home','electronics_smart_home'),
  ('v2-electronics-computer-components','electronics_components'),
  ('v2-home-furniture','home_furniture'),
  ('v2-home-decor','home_decor'),
  ('v2-home-kitchen-appliances','home_kitchen_appliances'),
  ('v2-home-cookware-dining','home_cookware_dining'),
  ('v2-home-bedding-bath','home_bedding_bath'),
  ('v2-home-garden-outdoor','home_garden_outdoor'),
  ('v2-home-office-school','home_office_school'),
  ('v2-home-storage-organization','home_storage_organization'),
  ('v2-home-cleaning-laundry','home_cleaning_laundry'),
  ('v2-home-tools-improvement','home_tools_improvement'),
  ('v2-fashion-women-clothing','fashion_women_clothing'),
  ('v2-fashion-men-clothing','fashion_men_clothing'),
  ('v2-fashion-women-shoes','fashion_women_shoes'),
  ('v2-fashion-men-shoes','fashion_men_shoes'),
  ('v2-fashion-bags-accessories','fashion_bags_accessories'),
  ('v2-fashion-jewelry','fashion_jewelry'),
  ('v2-fashion-watches','fashion_watches'),
  ('v2-fashion-sportswear','fashion_sportswear'),
  ('v2-fashion-kids-fashion','fashion_kids_fashion'),
  ('v2-fashion-luxury-preowned','fashion_luxury_preowned'),
  ('v2-automotive-vehicles','auto_vehicles'),
  ('v2-automotive-ev','auto_ev'),
  ('v2-automotive-parts','auto_parts'),
  ('v2-automotive-accessories','auto_accessories'),
  ('v2-automotive-electronics','auto_electronics'),
  ('v2-automotive-tools-equipment','auto_tools_equipment'),
  ('v2-automotive-tires-wheels','auto_tires_wheels'),
  ('v2-automotive-oils-fluids','auto_oils_fluids'),
  ('v2-kids-strollers','kids_strollers'),
  ('v2-kids-car-seats','kids_car_seats'),
  ('v2-kids-nursery-furniture','kids_nursery_furniture'),
  ('v2-kids-feeding','kids_feeding'),
  ('v2-kids-clothing-shoes','kids_clothing_shoes'),
  ('v2-kids-toys-games','kids_toys_games'),
  ('v2-kids-learning-books','kids_learning_books'),
  ('v2-kids-baby-care','kids_baby_care');

with seeded as (
  select
    c.id as category_id,
    tk.attribute_key,
    row_number() over (partition by c.id order by tk.attribute_key) as sort_order
  from tmp_leaf_templates lt
  join public.categories c on c.slug = lt.leaf_slug
  join tmp_template_keys tk on tk.template_name = lt.template_name
)
insert into public.category_attributes (
  category_id,
  name,
  name_bg,
  attribute_type,
  is_required,
  is_filterable,
  options,
  options_bg,
  sort_order,
  attribute_key,
  inherit_scope,
  is_active,
  is_variation,
  is_searchable,
  aspect_group,
  depends_on_attribute_id,
  depends_on_values
)
select
  s.category_id,
  initcap(replace(s.attribute_key, '_', ' ')) as name,
  null::text as name_bg,
  case
    when s.attribute_key in (
      'assembly_required','foldable','dishwasher_safe','induction_compatible','weather_resistant',
      'outdoor_use','refillable','educational','isofix','bpa_free','convertible','fragrance_free'
    ) then 'boolean'
    when s.attribute_key in ('dimensions','specification','model') then 'text'
    else 'select'
  end as attribute_type,
  (s.attribute_key in ('brand','condition','make','model','year','product_type','part_type','toy_type')) as is_required,
  (s.attribute_key not in ('dimensions')) as is_filterable,
  '[]'::jsonb as options,
  '[]'::jsonb as options_bg,
  s.sort_order,
  s.attribute_key,
  'self_only'::public.category_attribute_inherit_scope as inherit_scope,
  true as is_active,
  (s.attribute_key in ('size','shoe_size_eu','age_group')) as is_variation,
  true as is_searchable,
  case
    when s.attribute_key in ('brand','model','make','year','condition') then 'core'
    when s.attribute_key in ('color','material','style','pattern') then 'appearance'
    when s.attribute_key in ('storage','ram','processor','gpu','resolution','screen_size') then 'specs'
    when s.attribute_key in ('compatibility','compatible_makes','compatible_models','compatible_years') then 'compatibility'
    else 'details'
  end as aspect_group,
  null::uuid as depends_on_attribute_id,
  array[]::text[] as depends_on_values
from seeded s
on conflict (category_id, name)
do update set
  attribute_type = excluded.attribute_type,
  is_required = excluded.is_required,
  is_filterable = excluded.is_filterable,
  sort_order = excluded.sort_order,
  attribute_key = excluded.attribute_key,
  inherit_scope = excluded.inherit_scope,
  is_active = true,
  is_variation = excluded.is_variation,
  is_searchable = excluded.is_searchable,
  aspect_group = excluded.aspect_group,
  depends_on_attribute_id = excluded.depends_on_attribute_id,
  depends_on_values = excluded.depends_on_values;

-- 4c) Corrected search rebuild functions/triggers (v2 docs had invalid trigger syntax).
create or replace function public.rebuild_product_search_vector_for_id(p_product_id uuid)
returns void
language sql
as $$
  update public.products p
  set search_vector =
    setweight(to_tsvector('simple', coalesce(p.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce((
      select string_agg(pa.value, ' ')
      from public.product_attributes pa
      join public.category_attributes ca on ca.id = pa.attribute_id
      where pa.product_id = p.id
        and coalesce(ca.is_searchable, true)
        and coalesce(ca.is_active, true)
    ), '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(p.description, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(p.tags, ' '), '')), 'D')
  where p.id = p_product_id;
$$;

create or replace function public.trg_rebuild_product_search_vector()
returns trigger
language plpgsql
as $$
begin
  perform public.rebuild_product_search_vector_for_id(coalesce(new.id, old.id, new.product_id, old.product_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_products_search_vector on public.products;
create trigger trg_products_search_vector
  after insert or update of title, description, tags on public.products
  for each row execute function public.trg_rebuild_product_search_vector();

drop trigger if exists trg_product_attributes_search_sync on public.product_attributes;
create trigger trg_product_attributes_search_sync
  after insert or update or delete on public.product_attributes
  for each row execute function public.trg_rebuild_product_search_vector();

create or replace function public.get_category_facets(
  p_category_id uuid,
  p_base_filters jsonb default '{}'::jsonb
) returns table(aspect_key text, aspect_value text, product_count bigint)
language sql
stable
as $$
  with filtered_products as (
    select p.id
    from public.products p
    where p.category_id = p_category_id
      and p.status = 'active'
  )
  select
    ca.attribute_key,
    pa.value as aspect_value,
    count(distinct pa.product_id)::bigint as product_count
  from public.product_attributes pa
  join filtered_products fp on fp.id = pa.product_id
  join public.category_attributes ca on ca.id = pa.attribute_id
  where coalesce(ca.is_filterable, true)
    and coalesce(ca.is_active, true)
  group by ca.attribute_key, pa.value, ca.sort_order
  having count(distinct pa.product_id) > 0
  order by ca.sort_order nulls last, count(distinct pa.product_id) desc;
$$;

-- 4d) Rebuild vectors for all products.
do $$
declare
  r record;
begin
  for r in select id from public.products loop
    perform public.rebuild_product_search_vector_for_id(r.id);
  end loop;
end $$;

commit;

-- Rollback (manual):
-- 1) restore category_attributes is_active flags from pre-migration backup.
-- 2) drop triggers/functions introduced here:
--    drop trigger if exists trg_product_attributes_search_sync on public.product_attributes;
--    drop trigger if exists trg_products_search_vector on public.products;
--    drop function if exists public.trg_rebuild_product_search_vector();
--    drop function if exists public.rebuild_product_search_vector_for_id(uuid);
--    drop function if exists public.get_category_facets(uuid, jsonb);
