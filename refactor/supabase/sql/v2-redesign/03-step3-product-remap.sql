-- CATEGORY REDESIGN v2
-- Step 3: Product remap from legacy used leaves -> new v2 leaves.
-- Draft only. Do not run in production without approval.

begin;

create temporary table tmp_category_mapping (
  old_leaf_slug text primary key,
  new_leaf_slug text,
  map_state text not null check (map_state in ('mapped', '__DEFERRED__', '__MERGED_TAG_DECISION__', '__UNMAPPED__'))
) on commit drop;

insert into tmp_category_mapping (old_leaf_slug, new_leaf_slug, map_state) values
  ('gaming-desktops-asus-rog', 'v2-electronics-computers', 'mapped'),
  ('dress-shirts', 'v2-fashion-men-clothing', 'mapped'),
  ('gaming-pc-compact', 'v2-electronics-computers', 'mapped'),
  ('standard-strollers', 'v2-kids-strollers', 'mapped'),
  ('foundations', 'v2-beauty-makeup', 'mapped'),
  ('sectional-lshape', 'v2-home-furniture', 'mapped'),
  ('ev-tesla-y', 'v2-automotive-vehicles', 'mapped'),
  ('fiction-mystery-thriller', 'v2-books-fiction', 'mapped'),
  ('tread-folding', 'v2-sports-fitness-equipment', 'mapped'),
  ('milk-whole', null, '__DEFERRED__'),
  ('manufacturing-equipment', 'v2-tools-industrial-scientific', 'mapped'),
  ('art-paint-oil', 'v2-collectibles-art', 'mapped'),
  ('software-os', null, '__DEFERRED__'),
  ('vinyl-indie', 'v2-books-media-music', 'mapped'),
  ('engine-fuel-filters', 'v2-automotive-parts', 'mapped'),
  ('sedans', 'v2-automotive-vehicles', 'mapped'),
  ('knit-yarn', 'v2-hobbies-crafts', 'mapped'),
  ('engagement-solitaire', 'v2-jewelry-rings', 'mapped'),
  ('dogs-food', 'v2-pets-food-supplies', 'mapped'),
  ('huawei-p50-series', 'v2-electronics-smartphones', 'mapped'),
  ('womens-prenatal', 'v2-beauty-health-supplements', 'mapped'),
  ('indoor-plants', 'v2-home-garden-outdoor', 'mapped'),
  ('cat-dry-food', 'v2-pets-food-supplies', 'mapped'),
  ('house-cleaning-service', null, '__DEFERRED__'),
  ('audio-processors', 'v2-automotive-electronics', 'mapped'),
  ('car-stereos', 'v2-automotive-electronics', 'mapped'),
  ('van-sale-cargo', 'v2-automotive-vehicles', 'mapped'),
  ('fragrance-womens-perfume', 'v2-beauty-fragrance', 'mapped'),
  ('skincare-cleanser', 'v2-beauty-skincare', 'mapped'),
  ('bg-misket', null, '__MERGED_TAG_DECISION__'),
  ('coins-gold-eagles', 'v2-collectibles-coins', 'mapped'),
  ('baseball-cards', 'v2-collectibles-sports-memorabilia', 'mapped'),
  ('rare-stamps', 'v2-collectibles-stamps', 'mapped'),
  ('storage', 'v2-electronics-computer-components', 'mapped'),
  ('computer-accessories', 'v2-electronics-computer-accessories', 'mapped'),
  ('gaming-laptops-razer', 'v2-electronics-laptops', 'mapped'),
  ('144hz-gaming-monitors', 'v2-electronics-monitors', 'mapped'),
  ('health-monitors', 'v2-electronics-wearables', 'mapped'),
  ('huawei-phones', 'v2-electronics-smartphones', 'mapped'),
  ('oled-tvs', 'v2-electronics-tvs', 'mapped'),
  ('mens-dress-boots', 'v2-fashion-men-shoes', 'mapped'),
  ('mens-sneakers-running', 'v2-fashion-men-shoes', 'mapped'),
  ('women-necklaces', 'v2-jewelry-necklaces', 'mapped'),
  ('strategy-scythe', 'v2-gaming-board-games', 'mapped'),
  ('pokemon-boosterbox', 'v2-gaming-trading-cards', 'mapped'),
  ('bandages', 'v2-beauty-health-medical', 'mapped'),
  ('foot-care-products', 'v2-beauty-health-medical', 'mapped'),
  ('fitness-nutrition', 'v2-beauty-health-supplements', 'mapped'),
  ('multivitamins', 'v2-beauty-health-supplements', 'mapped'),
  ('fabric-textiles', 'v2-hobbies-crafts', 'mapped'),
  ('handmade-jewelry', 'v2-hobbies-crafts', 'mapped'),
  ('home-decor-crafts', 'v2-hobbies-crafts', 'mapped'),
  ('dj-controllers', 'v2-hobbies-musical-instruments', 'mapped'),
  ('drums-acoustic', 'v2-hobbies-musical-instruments', 'mapped'),
  ('digital-pianos', 'v2-hobbies-musical-instruments', 'mapped'),
  ('recording-mics', 'v2-hobbies-musical-instruments', 'mapped'),
  ('guitars-basses', 'v2-hobbies-musical-instruments', 'mapped'),
  ('wind-saxophones', 'v2-hobbies-musical-instruments', 'mapped'),
  ('garden-hand-tools', 'v2-home-garden-outdoor', 'mapped'),
  ('garden-statues', 'v2-home-garden-outdoor', 'mapped'),
  ('above-ground-pools', 'v2-home-garden-outdoor', 'mapped'),
  ('canvas-art', 'v2-home-decor', 'mapped'),
  ('small-kitchen-appliances', 'v2-home-kitchen-appliances', 'mapped'),
  ('calendars-wall', 'v2-home-office-school', 'mapped'),
  ('office-desks', 'v2-home-office-school', 'mapped'),
  ('pens', 'v2-home-office-school', 'mapped'),
  ('backpacks-school', 'v2-home-office-school', 'mapped'),
  ('diamonds-solitaire', 'v2-jewelry-rings', 'mapped'),
  ('doctor-jobs', null, '__DEFERRED__'),
  ('bottle-glass', 'v2-kids-feeding', 'mapped'),
  ('cloth-nb-sets', 'v2-kids-clothing-shoes', 'mapped'),
  ('crib-std', 'v2-kids-nursery-furniture', 'mapped'),
  ('toys-action', 'v2-kids-toys-games', 'mapped'),
  ('stem-toys', 'v2-kids-toys-games', 'mapped'),
  ('bird-seed', 'v2-pets-food-supplies', 'mapped'),
  ('cat-ear', 'v2-pets-grooming', 'mapped'),
  ('fish-flake-food', 'v2-pets-food-supplies', 'mapped'),
  ('rabbit-food', 'v2-pets-food-supplies', 'mapped'),
  ('family-law', null, '__DEFERRED__'),
  ('adobe-creative-suite', null, '__DEFERRED__'),
  ('av-home', null, '__DEFERRED__'),
  ('bike-road', 'v2-sports-cycling', 'mapped'),
  ('handtools-hammers', 'v2-tools-hand-tools', 'mapped'),
  ('microscopes', 'v2-tools-industrial-scientific', 'mapped'),
  ('test-measurement', 'v2-tools-industrial-scientific', 'mapped'),
  ('powertools-drills', 'v2-tools-power-tools', 'mapped'),
  ('hard-hats', 'v2-tools-safety', 'mapped');

do $$
declare
  v_missing_new int;
  v_missing_old int;
begin
  select count(*)
    into v_missing_new
  from tmp_category_mapping m
  left join public.categories c on c.slug = m.new_leaf_slug
  where m.map_state = 'mapped'
    and c.id is null;

  if v_missing_new > 0 then
    raise exception 'Step 3 aborted: % mapped target slugs are missing in categories (run Step 2 first).', v_missing_new;
  end if;

  select count(*)
    into v_missing_old
  from tmp_category_mapping m
  left join public.categories c on c.slug = m.old_leaf_slug
  where c.id is null;

  if v_missing_old > 0 then
    raise exception 'Step 3 aborted: % old source slugs were not found.', v_missing_old;
  end if;
end $$;

-- Remap all products in mapped categories.
update public.products p
set category_id = new_cat.id
from tmp_category_mapping m
join public.categories old_cat on old_cat.slug = m.old_leaf_slug
join public.categories new_cat on new_cat.slug = m.new_leaf_slug
where m.map_state = 'mapped'
  and p.category_id = old_cat.id;

-- Hide old mapped leaves from browse after remap (keep deferred/decision leaves visible for manual handling).
update public.categories c
set is_browseable = false
where c.slug in (
  select old_leaf_slug from tmp_category_mapping where map_state = 'mapped'
)
  and c.slug not like 'v2-%';

-- Snapshot unresolved products (deferred roots, merge decision, uncategorized).
create temporary table tmp_unresolved_products as
with product_mapping as (
  select
    p.id as product_id,
    p.slug as product_slug,
    p.title as product_title,
    c.slug as old_leaf_slug,
    coalesce(m.map_state, '__UNCATEGORIZED__') as map_state
  from public.products p
  left join public.categories c on c.id = p.category_id
  left join tmp_category_mapping m on m.old_leaf_slug = c.slug
)
select *
from product_mapping
where map_state in ('__DEFERRED__', '__MERGED_TAG_DECISION__', '__UNCATEGORIZED__', '__UNMAPPED__');

-- Optional verification:
-- select map_state, count(*) from tmp_unresolved_products group by map_state order by count(*) desc;
-- select count(*) as mapped_products_now_in_v2
-- from public.products p join public.categories c on c.id = p.category_id
-- where c.slug like 'v2-%';

commit;

-- Rollback (manual):
-- 1) restore from backup/snapshot taken immediately before Step 3
--    OR run inverse remap using a saved old_category_id snapshot table.
-- 2) re-enable browse on old leaves:
--    update public.categories set is_browseable = true
--    where slug in (select old_leaf_slug from tmp_category_mapping where map_state = 'mapped');
