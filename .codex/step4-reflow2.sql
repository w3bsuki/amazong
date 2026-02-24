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
  ('electronics_phone','brand'),
  ('electronics_phone','model'),
  ('electronics_phone','storage'),
  ('electronics_phone','ram'),
  ('electronics_phone','color'),
  ('electronics_phone','condition'),
  ('electronics_phone','network'),
  ('electronics_phone','carrier_lock'),
  ('electronics_phone','battery_life'),
  ('electronics_phone','warranty'),
  ('electronics_laptop','brand'),
  ('electronics_laptop','model'),
  ('electronics_laptop','processor'),
  ('electronics_laptop','ram'),
  ('electronics_laptop','storage'),
  ('electronics_laptop','gpu'),
  ('electronics_laptop','screen_size'),
  ('electronics_laptop','condition'),
  ('electronics_laptop','battery_life'),
  ('electronics_laptop','warranty'),
  ('electronics_desktop','brand'),
  ('electronics_desktop','model'),
  ('electronics_desktop','processor'),
  ('electronics_desktop','ram'),
  ('electronics_desktop','storage'),
  ('electronics_desktop','gpu'),
  ('electronics_desktop','form_factor'),
  ('electronics_desktop','condition'),
  ('electronics_desktop','warranty'),
  ('electronics_tablet','brand'),
  ('electronics_tablet','model'),
  ('electronics_tablet','screen_size'),
  ('electronics_tablet','storage'),
  ('electronics_tablet','connectivity'),
  ('electronics_tablet','color'),
  ('electronics_tablet','condition'),
  ('electronics_tablet','warranty'),
  ('electronics_tv','brand'),
  ('electronics_tv','model'),
  ('electronics_tv','screen_size'),
  ('electronics_tv','resolution'),
  ('electronics_tv','display_type'),
  ('electronics_tv','smart_platform'),
  ('electronics_tv','refresh_rate'),
  ('electronics_tv','condition'),
  ('electronics_tv','warranty'),
  ('electronics_monitor','brand'),
  ('electronics_monitor','model'),
  ('electronics_monitor','screen_size'),
  ('electronics_monitor','resolution'),
  ('electronics_monitor','refresh_rate'),
  ('electronics_monitor','panel_type'),
  ('electronics_monitor','response_time'),
  ('electronics_monitor','condition'),
  ('electronics_audio','brand'),
  ('electronics_audio','model'),
  ('electronics_audio','audio_type'),
  ('electronics_audio','connectivity'),
  ('electronics_audio','power_source'),
  ('electronics_audio','condition'),
  ('electronics_audio','warranty'),
  ('electronics_camera','brand'),
  ('electronics_camera','model'),
  ('electronics_camera','camera_type'),
  ('electronics_camera','sensor_type'),
  ('electronics_camera','lens_mount'),
  ('electronics_camera','resolution'),
  ('electronics_camera','condition'),
  ('electronics_camera','warranty'),
  ('electronics_wearable','brand'),
  ('electronics_wearable','model'),
  ('electronics_wearable','device_type'),
  ('electronics_wearable','connectivity'),
  ('electronics_wearable','battery_life'),
  ('electronics_wearable','water_resistance'),
  ('electronics_wearable','condition'),
  ('electronics_smart_home','brand'),
  ('electronics_smart_home','model'),
  ('electronics_smart_home','device_type'),
  ('electronics_smart_home','connectivity'),
  ('electronics_smart_home','platform'),
  ('electronics_smart_home','power_source'),
  ('electronics_smart_home','condition'),
  ('electronics_components','component_type'),
  ('electronics_components','brand'),
  ('electronics_components','model'),
  ('electronics_components','compatibility'),
  ('electronics_components','storage_type'),
  ('electronics_components','speed'),
  ('electronics_components','capacity'),
  ('electronics_components','condition'),
  ('electronics_components','warranty'),

  -- Home & Kitchen
  ('home_furniture','brand'),
  ('home_furniture','furniture_type'),
  ('home_furniture','material'),
  ('home_furniture','color'),
  ('home_furniture','style'),
  ('home_furniture','dimensions'),
  ('home_furniture','assembly_required'),
  ('home_furniture','condition'),
  ('home_decor','brand'),
  ('home_decor','decor_type'),
  ('home_decor','material'),
  ('home_decor','color'),
  ('home_decor','style'),
  ('home_decor','dimensions'),
  ('home_decor','condition'),
  ('home_kitchen_appliances','brand'),
  ('home_kitchen_appliances','appliance_type'),
  ('home_kitchen_appliances','power_watts'),
  ('home_kitchen_appliances','capacity'),
  ('home_kitchen_appliances','energy_rating'),
  ('home_kitchen_appliances','color'),
  ('home_kitchen_appliances','condition'),
  ('home_kitchen_appliances','warranty'),
  ('home_cookware_dining','brand'),
  ('home_cookware_dining','material'),
  ('home_cookware_dining','set_size'),
  ('home_cookware_dining','dishwasher_safe'),
  ('home_cookware_dining','induction_compatible'),
  ('home_cookware_dining','color'),
  ('home_cookware_dining','condition'),
  ('home_bedding_bath','brand'),
  ('home_bedding_bath','material'),
  ('home_bedding_bath','size'),
  ('home_bedding_bath','thread_count'),
  ('home_bedding_bath','color'),
  ('home_bedding_bath','pattern'),
  ('home_bedding_bath','condition'),
  ('home_garden_outdoor','brand'),
  ('home_garden_outdoor','product_type'),
  ('home_garden_outdoor','material'),
  ('home_garden_outdoor','weather_resistant'),
  ('home_garden_outdoor','outdoor_use'),
  ('home_garden_outdoor','power_source'),
  ('home_garden_outdoor','condition'),
  ('home_office_school','brand'),
  ('home_office_school','product_type'),
  ('home_office_school','material'),
  ('home_office_school','color'),
  ('home_office_school','paper_size'),
  ('home_office_school','ergonomic'),
  ('home_office_school','condition'),
  ('home_storage_organization','brand'),
  ('home_storage_organization','storage_type'),
  ('home_storage_organization','material'),
  ('home_storage_organization','capacity'),
  ('home_storage_organization','dimensions'),
  ('home_storage_organization','color'),
  ('home_storage_organization','condition'),
  ('home_cleaning_laundry','brand'),
  ('home_cleaning_laundry','product_type'),
  ('home_cleaning_laundry','surface_type'),
  ('home_cleaning_laundry','quantity'),
  ('home_cleaning_laundry','scent'),
  ('home_cleaning_laundry','refillable'),
  ('home_cleaning_laundry','condition'),
  ('home_tools_improvement','brand'),
  ('home_tools_improvement','tool_type'),
  ('home_tools_improvement','power_source'),
  ('home_tools_improvement','material'),
  ('home_tools_improvement','indooroutdoor'),
  ('home_tools_improvement','warranty'),
  ('home_tools_improvement','condition'),

  -- Fashion
  ('fashion_women_clothing','brand'),
  ('fashion_women_clothing','size'),
  ('fashion_women_clothing','color'),
  ('fashion_women_clothing','material'),
  ('fashion_women_clothing','style'),
  ('fashion_women_clothing','season'),
  ('fashion_women_clothing','pattern'),
  ('fashion_women_clothing','condition'),
  ('fashion_men_clothing','brand'),
  ('fashion_men_clothing','size'),
  ('fashion_men_clothing','color'),
  ('fashion_men_clothing','material'),
  ('fashion_men_clothing','style'),
  ('fashion_men_clothing','season'),
  ('fashion_men_clothing','pattern'),
  ('fashion_men_clothing','condition'),
  ('fashion_women_shoes','brand'),
  ('fashion_women_shoes','shoe_size_eu'),
  ('fashion_women_shoes','color'),
  ('fashion_women_shoes','material'),
  ('fashion_women_shoes','style'),
  ('fashion_women_shoes','heel_height'),
  ('fashion_women_shoes','condition'),
  ('fashion_men_shoes','brand'),
  ('fashion_men_shoes','shoe_size_eu'),
  ('fashion_men_shoes','color'),
  ('fashion_men_shoes','material'),
  ('fashion_men_shoes','style'),
  ('fashion_men_shoes','sport_type'),
  ('fashion_men_shoes','condition'),
  ('fashion_bags_accessories','brand'),
  ('fashion_bags_accessories','accessory_type'),
  ('fashion_bags_accessories','material'),
  ('fashion_bags_accessories','color'),
  ('fashion_bags_accessories','size'),
  ('fashion_bags_accessories','closure'),
  ('fashion_bags_accessories','style'),
  ('fashion_bags_accessories','condition'),
  ('fashion_jewelry','brand'),
  ('fashion_jewelry','jewelry_type'),
  ('fashion_jewelry','material'),
  ('fashion_jewelry','stone_type'),
  ('fashion_jewelry','color'),
  ('fashion_jewelry','authenticity'),
  ('fashion_jewelry','condition'),
  ('fashion_watches','brand'),
  ('fashion_watches','model'),
  ('fashion_watches','watch_type'),
  ('fashion_watches','band_material'),
  ('fashion_watches','case_size'),
  ('fashion_watches','water_resistance'),
  ('fashion_watches','movement'),
  ('fashion_watches','condition'),
  ('fashion_sportswear','brand'),
  ('fashion_sportswear','size'),
  ('fashion_sportswear','gender'),
  ('fashion_sportswear','material'),
  ('fashion_sportswear','sport_type'),
  ('fashion_sportswear','color'),
  ('fashion_sportswear','condition'),
  ('fashion_kids_fashion','brand'),
  ('fashion_kids_fashion','size'),
  ('fashion_kids_fashion','age_group'),
  ('fashion_kids_fashion','gender'),
  ('fashion_kids_fashion','material'),
  ('fashion_kids_fashion','color'),
  ('fashion_kids_fashion','season'),
  ('fashion_kids_fashion','condition'),
  ('fashion_luxury_preowned','brand'),
  ('fashion_luxury_preowned','model'),
  ('fashion_luxury_preowned','material'),
  ('fashion_luxury_preowned','condition'),
  ('fashion_luxury_preowned','authenticity'),
  ('fashion_luxury_preowned','year'),

  -- Automotive
  ('auto_vehicles','make'),
  ('auto_vehicles','model'),
  ('auto_vehicles','year'),
  ('auto_vehicles','body_type'),
  ('auto_vehicles','fuel_type'),
  ('auto_vehicles','transmission'),
  ('auto_vehicles','mileage'),
  ('auto_vehicles','condition'),
  ('auto_ev','make'),
  ('auto_ev','model'),
  ('auto_ev','year'),
  ('auto_ev','ev_type'),
  ('auto_ev','range'),
  ('auto_ev','battery_capacity'),
  ('auto_ev','charging_speed'),
  ('auto_ev','condition'),
  ('auto_parts','part_type'),
  ('auto_parts','part_number'),
  ('auto_parts','compatible_makes'),
  ('auto_parts','compatible_models'),
  ('auto_parts','compatible_years'),
  ('auto_parts','condition'),
  ('auto_parts','warranty'),
  ('auto_accessories','accessory_type'),
  ('auto_accessories','vehicle_type'),
  ('auto_accessories','material'),
  ('auto_accessories','color'),
  ('auto_accessories','compatibility'),
  ('auto_accessories','condition'),
  ('auto_electronics','brand'),
  ('auto_electronics','model'),
  ('auto_electronics','electronics_type'),
  ('auto_electronics','connectivity'),
  ('auto_electronics','compatibility'),
  ('auto_electronics','power_source'),
  ('auto_electronics','condition'),
  ('auto_electronics','warranty'),
  ('auto_tools_equipment','tool_type'),
  ('auto_tools_equipment','power_source'),
  ('auto_tools_equipment','material'),
  ('auto_tools_equipment','vehicle_type'),
  ('auto_tools_equipment','warranty'),
  ('auto_tools_equipment','condition'),
  ('auto_tires_wheels','brand'),
  ('auto_tires_wheels','tire_type'),
  ('auto_tires_wheels','width'),
  ('auto_tires_wheels','aspect_ratio'),
  ('auto_tires_wheels','rim_diameter'),
  ('auto_tires_wheels','season'),
  ('auto_tires_wheels','load_index'),
  ('auto_tires_wheels','condition'),
  ('auto_oils_fluids','fluid_type'),
  ('auto_oils_fluids','viscosity'),
  ('auto_oils_fluids','specification'),
  ('auto_oils_fluids','volume'),
  ('auto_oils_fluids','brand'),
  ('auto_oils_fluids','compatibility'),
  ('auto_oils_fluids','condition'),

  -- Kids
  ('kids_strollers','brand'),
  ('kids_strollers','stroller_type'),
  ('kids_strollers','age_range'),
  ('kids_strollers','weight_capacity'),
  ('kids_strollers','foldable'),
  ('kids_strollers','color'),
  ('kids_strollers','material'),
  ('kids_strollers','condition'),
  ('kids_car_seats','brand'),
  ('kids_car_seats','car_seat_group'),
  ('kids_car_seats','car_seat_type'),
  ('kids_car_seats','isofix'),
  ('kids_car_seats','weight_range'),
  ('kids_car_seats','age_range'),
  ('kids_car_seats','color'),
  ('kids_car_seats','condition'),
  ('kids_nursery_furniture','brand'),
  ('kids_nursery_furniture','crib_type'),
  ('kids_nursery_furniture','material'),
  ('kids_nursery_furniture','color'),
  ('kids_nursery_furniture','mattress_size'),
  ('kids_nursery_furniture','convertible'),
  ('kids_nursery_furniture','condition'),
  ('kids_feeding','brand'),
  ('kids_feeding','product_type'),
  ('kids_feeding','material'),
  ('kids_feeding','bpa_free'),
  ('kids_feeding','age_range'),
  ('kids_feeding','dishwasher_safe'),
  ('kids_feeding','condition'),
  ('kids_clothing_shoes','brand'),
  ('kids_clothing_shoes','size'),
  ('kids_clothing_shoes','age_group'),
  ('kids_clothing_shoes','gender'),
  ('kids_clothing_shoes','material'),
  ('kids_clothing_shoes','color'),
  ('kids_clothing_shoes','season'),
  ('kids_clothing_shoes','condition'),
  ('kids_toys_games','brand'),
  ('kids_toys_games','toy_type'),
  ('kids_toys_games','age_group'),
  ('kids_toys_games','subject_focus'),
  ('kids_toys_games','material'),
  ('kids_toys_games','color'),
  ('kids_toys_games','educational'),
  ('kids_toys_games','condition'),
  ('kids_learning_books','brand'),
  ('kids_learning_books','age_group'),
  ('kids_learning_books','language'),
  ('kids_learning_books','subject_focus'),
  ('kids_learning_books','format'),
  ('kids_learning_books','condition'),
  ('kids_baby_care','brand'),
  ('kids_baby_care','product_type'),
  ('kids_baby_care','age_group'),
  ('kids_baby_care','skin_type'),
  ('kids_baby_care','fragrance_free'),
  ('kids_baby_care','quantity'),
  ('kids_baby_care','condition');

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

create temporary table tmp_attribute_name_bg (
  attribute_key text primary key,
  name_bg text not null
) on commit drop;

insert into tmp_attribute_name_bg (attribute_key, name_bg) values
  ('accessory_type','Тип аксесоар'),
  ('age_group','Възрастова група'),
  ('age_range','Възрастов диапазон'),
  ('appliance_type','Тип уред'),
  ('aspect_ratio','Профил'),
  ('assembly_required','Изисква сглобяване'),
  ('audio_type','Тип аудио'),
  ('authenticity','Автентичност'),
  ('band_material','Материал на каишката'),
  ('battery_capacity','Капацитет на батерията'),
  ('battery_life','Живот на батерията'),
  ('body_type','Тип каросерия'),
  ('bpa_free','Без BPA'),
  ('brand','Марка'),
  ('camera_type','Тип камера'),
  ('capacity','Капацитет'),
  ('car_seat_group','Група столче'),
  ('car_seat_type','Тип столче'),
  ('carrier_lock','Заключване към оператор'),
  ('case_size','Размер на касата'),
  ('charging_speed','Скорост на зареждане'),
  ('closure','Закопчаване'),
  ('color','Цвят'),
  ('compatibility','Съвместимост'),
  ('compatible_makes','Съвместими марки'),
  ('compatible_models','Съвместими модели'),
  ('compatible_years','Съвместими години'),
  ('component_type','Тип компонент'),
  ('condition','Състояние'),
  ('connectivity','Свързаност'),
  ('convertible','Трансформиращо се'),
  ('crib_type','Тип кошара'),
  ('decor_type','Тип декор'),
  ('device_type','Тип устройство'),
  ('dimensions','Размери'),
  ('dishwasher_safe','Подходящо за съдомиялна'),
  ('display_type','Тип дисплей'),
  ('educational','Образователно'),
  ('electronics_type','Тип електроника'),
  ('energy_rating','Енергиен клас'),
  ('ergonomic','Ергономичен'),
  ('ev_type','Тип електромобил'),
  ('fluid_type','Тип течност'),
  ('foldable','Сгъваемо'),
  ('form_factor','Форм-фактор'),
  ('format','Формат'),
  ('fragrance_free','Без аромат'),
  ('fuel_type','Тип гориво'),
  ('furniture_type','Тип мебел'),
  ('gender','Пол'),
  ('gpu','Видео карта'),
  ('heel_height','Височина на тока'),
  ('indooroutdoor','За вътрешна/външна употреба'),
  ('induction_compatible','Съвместимо с индукция'),
  ('isofix','ISOFIX'),
  ('jewelry_type','Тип бижу'),
  ('language','Език'),
  ('lens_mount','Байонет'),
  ('load_index','Товарен индекс'),
  ('make','Производител'),
  ('material','Материал'),
  ('mattress_size','Размер на матрака'),
  ('mileage','Пробег'),
  ('model','Модел'),
  ('movement','Механизъм'),
  ('network','Мрежа'),
  ('outdoor_use','Външна употреба'),
  ('panel_type','Тип панел'),
  ('paper_size','Размер хартия'),
  ('part_number','Номер на част'),
  ('part_type','Тип част'),
  ('pattern','Десен'),
  ('platform','Платформа'),
  ('power_source','Захранване'),
  ('power_watts','Мощност (W)'),
  ('processor','Процесор'),
  ('product_type','Тип продукт'),
  ('quantity','Количество'),
  ('ram','RAM'),
  ('range','Пробег (км)'),
  ('refillable','Презареждаемо'),
  ('refresh_rate','Честота на опресняване'),
  ('resolution','Резолюция'),
  ('response_time','Време за реакция'),
  ('rim_diameter','Диаметър джанта'),
  ('scent','Аромат'),
  ('screen_size','Размер на екрана'),
  ('season','Сезон'),
  ('sensor_type','Тип сензор'),
  ('set_size','Размер на комплекта'),
  ('shoe_size_eu','Размер обувки (EU)'),
  ('size','Размер'),
  ('skin_type','Тип кожа'),
  ('smart_platform','Смарт платформа'),
  ('specification','Спецификация'),
  ('speed','Скорост'),
  ('sport_type','Вид спорт'),
  ('stone_type','Тип камък'),
  ('storage','Памет'),
  ('storage_type','Тип памет'),
  ('stroller_type','Тип количка'),
  ('style','Стил'),
  ('subject_focus','Тематика'),
  ('surface_type','Тип повърхност'),
  ('thread_count','Плътност на нишките'),
  ('tire_type','Тип гума'),
  ('tool_type','Тип инструмент'),
  ('toy_type','Тип играчка'),
  ('transmission','Трансмисия'),
  ('vehicle_type','Тип превозно средство'),
  ('viscosity','Вискозитет'),
  ('volume','Обем'),
  ('warranty','Гаранция'),
  ('watch_type','Тип часовник'),
  ('water_resistance','Водоустойчивост'),
  ('weather_resistant','Устойчиво на атмосферни условия'),
  ('weight_capacity','Товароносимост'),
  ('weight_range','Диапазон на тегло'),
  ('width','Ширина'),
  ('year','Година');

create temporary table tmp_aspect_options (
  vertical text not null,
  attribute_key text not null,
  options jsonb not null,
  options_bg jsonb not null,
  primary key (vertical, attribute_key)
) on commit drop;

-- Curated option sets for select aspects in top launch verticals:
-- electronics, fashion, and home.
insert into tmp_aspect_options (vertical, attribute_key, options, options_bg) values
  ('all','color','["Black",`r`n"White",`r`n"Gray",`r`n"Silver",`r`n"Blue",`r`n"Navy",`r`n"Green",`r`n"Red",`r`n"Pink",`r`n"Purple",`r`n"Yellow",`r`n"Orange",`r`n"Brown",`r`n"Beige",`r`n"Gold",`r`n"Rose Gold",`r`n"Transparent",`r`n"Multicolor"]'::jsonb,'["Черен",`r`n"Бял",`r`n"Сив",`r`n"Сребрист",`r`n"Син",`r`n"Тъмносин",`r`n"Зелен",`r`n"Червен",`r`n"Розов",`r`n"Лилав",`r`n"Жълт",`r`n"Оранжев",`r`n"Кафяв",`r`n"Бежов",`r`n"Златист",`r`n"Розово злато",`r`n"Прозрачен",`r`n"Многоцветен"]'::jsonb),
  ('all','condition','["New",`r`n"Like New",`r`n"Used - Excellent",`r`n"Used - Good",`r`n"Used - Fair",`r`n"For Parts"]'::jsonb,'["Ново",`r`n"Като ново",`r`n"Употребявано - отлично",`r`n"Употребявано - добро",`r`n"Употребявано - задоволително",`r`n"За части"]'::jsonb),
  ('all','warranty','["No Warranty",`r`n"1 Month",`r`n"3 Months",`r`n"6 Months",`r`n"12 Months",`r`n"24 Months",`r`n"Manufacturer Warranty"]'::jsonb,'["Без гаранция",`r`n"1 месец",`r`n"3 месеца",`r`n"6 месеца",`r`n"12 месеца",`r`n"24 месеца",`r`n"Гаранция от производителя"]'::jsonb),

  ('electronics','brand','["Apple",`r`n"Samsung",`r`n"Xiaomi",`r`n"Huawei",`r`n"Google",`r`n"Sony",`r`n"LG",`r`n"Lenovo",`r`n"HP",`r`n"Dell",`r`n"ASUS",`r`n"Acer",`r`n"MSI",`r`n"Bose",`r`n"JBL"]'::jsonb,'["Apple",`r`n"Samsung",`r`n"Xiaomi",`r`n"Huawei",`r`n"Google",`r`n"Sony",`r`n"LG",`r`n"Lenovo",`r`n"HP",`r`n"Dell",`r`n"ASUS",`r`n"Acer",`r`n"MSI",`r`n"Bose",`r`n"JBL"]'::jsonb),
  ('electronics','storage','["32 GB",`r`n"64 GB",`r`n"128 GB",`r`n"256 GB",`r`n"512 GB",`r`n"1 TB",`r`n"2 TB"]'::jsonb,'["32 GB",`r`n"64 GB",`r`n"128 GB",`r`n"256 GB",`r`n"512 GB",`r`n"1 TB",`r`n"2 TB"]'::jsonb),
  ('electronics','ram','["4 GB",`r`n"6 GB",`r`n"8 GB",`r`n"12 GB",`r`n"16 GB",`r`n"24 GB",`r`n"32 GB",`r`n"64 GB"]'::jsonb,'["4 GB",`r`n"6 GB",`r`n"8 GB",`r`n"12 GB",`r`n"16 GB",`r`n"24 GB",`r`n"32 GB",`r`n"64 GB"]'::jsonb),
  ('electronics','network','["2G",`r`n"3G",`r`n"4G",`r`n"5G",`r`n"Wi-Fi Only"]'::jsonb,'["2G",`r`n"3G",`r`n"4G",`r`n"5G",`r`n"Само Wi-Fi"]'::jsonb),
  ('electronics','carrier_lock','["Unlocked",`r`n"Locked to A1",`r`n"Locked to Yettel",`r`n"Locked to Vivacom",`r`n"Factory Unlocked"]'::jsonb,'["Отключен",`r`n"Заключен към A1",`r`n"Заключен към Yettel",`r`n"Заключен към Vivacom",`r`n"Фабрично отключен"]'::jsonb),
  ('electronics','battery_life','["Up to 4 h",`r`n"4-8 h",`r`n"8-12 h",`r`n"12-18 h",`r`n"18+ h"]'::jsonb,'["До 4 ч",`r`n"4-8 ч",`r`n"8-12 ч",`r`n"12-18 ч",`r`n"18+ ч"]'::jsonb),
  ('electronics','processor','["Intel Core i3",`r`n"Intel Core i5",`r`n"Intel Core i7",`r`n"Intel Core i9",`r`n"AMD Ryzen 3",`r`n"AMD Ryzen 5",`r`n"AMD Ryzen 7",`r`n"AMD Ryzen 9",`r`n"Apple M1",`r`n"Apple M2",`r`n"Apple M3",`r`n"Qualcomm Snapdragon",`r`n"MediaTek Dimensity"]'::jsonb,'["Intel Core i3",`r`n"Intel Core i5",`r`n"Intel Core i7",`r`n"Intel Core i9",`r`n"AMD Ryzen 3",`r`n"AMD Ryzen 5",`r`n"AMD Ryzen 7",`r`n"AMD Ryzen 9",`r`n"Apple M1",`r`n"Apple M2",`r`n"Apple M3",`r`n"Qualcomm Snapdragon",`r`n"MediaTek Dimensity"]'::jsonb),
  ('electronics','gpu','["Integrated",`r`n"NVIDIA GTX 1650",`r`n"NVIDIA RTX 3050",`r`n"NVIDIA RTX 3060",`r`n"NVIDIA RTX 4060",`r`n"NVIDIA RTX 4070",`r`n"AMD Radeon RX 6600",`r`n"AMD Radeon RX 7600",`r`n"Apple Integrated GPU"]'::jsonb,'["Вградена",`r`n"NVIDIA GTX 1650",`r`n"NVIDIA RTX 3050",`r`n"NVIDIA RTX 3060",`r`n"NVIDIA RTX 4060",`r`n"NVIDIA RTX 4070",`r`n"AMD Radeon RX 6600",`r`n"AMD Radeon RX 7600",`r`n"Apple Integrated GPU"]'::jsonb),
  ('electronics','screen_size','["Under 6.1 in",`r`n"6.1-6.5 in",`r`n"6.6-7 in",`r`n"8-10 in",`r`n"11-13 in",`r`n"14-15.6 in",`r`n"16-17.3 in",`r`n"34+ in"]'::jsonb,'["Под 6.1 инча",`r`n"6.1-6.5 инча",`r`n"6.6-7 инча",`r`n"8-10 инча",`r`n"11-13 инча",`r`n"14-15.6 инча",`r`n"16-17.3 инча",`r`n"34+ инча"]'::jsonb),
  ('electronics','form_factor','["Tower",`r`n"Mini Tower",`r`n"Small Form Factor",`r`n"All-in-One",`r`n"Mini PC"]'::jsonb,'["Кула",`r`n"Мини кула",`r`n"Компактен корпус",`r`n"Всичко в едно",`r`n"Мини компютър"]'::jsonb),
  ('electronics','connectivity','["Wi-Fi",`r`n"Wi-Fi 6",`r`n"Bluetooth",`r`n"Bluetooth 5.x",`r`n"NFC",`r`n"USB-C",`r`n"USB 3.0",`r`n"HDMI",`r`n"DisplayPort",`r`n"Ethernet",`r`n"Cellular",`r`n"Lightning"]'::jsonb,'["Wi-Fi",`r`n"Wi-Fi 6",`r`n"Bluetooth",`r`n"Bluetooth 5.x",`r`n"NFC",`r`n"USB-C",`r`n"USB 3.0",`r`n"HDMI",`r`n"DisplayPort",`r`n"Ethernet",`r`n"Клетъчна мрежа",`r`n"Lightning"]'::jsonb),
  ('electronics','resolution','["HD (1366x768)",`r`n"Full HD (1920x1080)",`r`n"2K (2560x1440)",`r`n"4K UHD (3840x2160)",`r`n"5K",`r`n"8K"]'::jsonb,'["HD (1366x768)",`r`n"Full HD (1920x1080)",`r`n"2K (2560x1440)",`r`n"4K UHD (3840x2160)",`r`n"5K",`r`n"8K"]'::jsonb),
  ('electronics','display_type','["LCD",`r`n"LED",`r`n"OLED",`r`n"AMOLED",`r`n"QLED",`r`n"Mini LED",`r`n"MicroLED",`r`n"IPS",`r`n"VA",`r`n"TN"]'::jsonb,'["LCD",`r`n"LED",`r`n"OLED",`r`n"AMOLED",`r`n"QLED",`r`n"Mini LED",`r`n"MicroLED",`r`n"IPS",`r`n"VA",`r`n"TN"]'::jsonb),
  ('electronics','smart_platform','["Android TV",`r`n"Google TV",`r`n"webOS",`r`n"Tizen",`r`n"Roku TV",`r`n"Fire TV",`r`n"tvOS"]'::jsonb,'["Android TV",`r`n"Google TV",`r`n"webOS",`r`n"Tizen",`r`n"Roku TV",`r`n"Fire TV",`r`n"tvOS"]'::jsonb),
  ('electronics','refresh_rate','["60 Hz",`r`n"75 Hz",`r`n"90 Hz",`r`n"100 Hz",`r`n"120 Hz",`r`n"144 Hz",`r`n"165 Hz",`r`n"240 Hz"]'::jsonb,'["60 Hz",`r`n"75 Hz",`r`n"90 Hz",`r`n"100 Hz",`r`n"120 Hz",`r`n"144 Hz",`r`n"165 Hz",`r`n"240 Hz"]'::jsonb),
  ('electronics','panel_type','["IPS",`r`n"VA",`r`n"TN",`r`n"OLED",`r`n"Mini LED"]'::jsonb,'["IPS",`r`n"VA",`r`n"TN",`r`n"OLED",`r`n"Mini LED"]'::jsonb),
  ('electronics','response_time','["1 ms",`r`n"2 ms",`r`n"4 ms",`r`n"5 ms",`r`n"8 ms",`r`n"10+ ms"]'::jsonb,'["1 ms",`r`n"2 ms",`r`n"4 ms",`r`n"5 ms",`r`n"8 ms",`r`n"10+ ms"]'::jsonb),
  ('electronics','audio_type','["In-ear",`r`n"On-ear",`r`n"Over-ear",`r`n"Earbuds",`r`n"Soundbar",`r`n"Speaker",`r`n"Home Theater",`r`n"Microphone"]'::jsonb,'["Вътрешни",`r`n"Наложени",`r`n"Пълноразмерни",`r`n"Тапи",`r`n"Саундбар",`r`n"Колона",`r`n"Домашно кино",`r`n"Микрофон"]'::jsonb),
  ('electronics','power_source','["Battery",`r`n"Rechargeable Battery",`r`n"USB Power",`r`n"AC Adapter",`r`n"PoE",`r`n"Solar"]'::jsonb,'["Батерия",`r`n"Презареждаема батерия",`r`n"USB захранване",`r`n"Мрежов адаптер",`r`n"PoE",`r`n"Соларно"]'::jsonb),
  ('electronics','camera_type','["DSLR",`r`n"Mirrorless",`r`n"Compact",`r`n"Action Camera",`r`n"Instant Camera",`r`n"Camcorder",`r`n"Drone Camera"]'::jsonb,'["DSLR",`r`n"Безогледална",`r`n"Компактна",`r`n"Екшън камера",`r`n"Моментна камера",`r`n"Видеокамера",`r`n"Дрон камера"]'::jsonb),
  ('electronics','sensor_type','["CMOS",`r`n"Full-Frame CMOS",`r`n"APS-C CMOS",`r`n"Micro Four Thirds",`r`n"BSI CMOS"]'::jsonb,'["CMOS",`r`n"Пълнокадров CMOS",`r`n"APS-C CMOS",`r`n"Micro Four Thirds",`r`n"BSI CMOS"]'::jsonb),
  ('electronics','lens_mount','["Canon EF",`r`n"Canon RF",`r`n"Nikon F",`r`n"Nikon Z",`r`n"Sony E",`r`n"Fujifilm X",`r`n"Micro Four Thirds",`r`n"Leica M"]'::jsonb,'["Canon EF",`r`n"Canon RF",`r`n"Nikon F",`r`n"Nikon Z",`r`n"Sony E",`r`n"Fujifilm X",`r`n"Micro Four Thirds",`r`n"Leica M"]'::jsonb),
  ('electronics','device_type','["Smartwatch",`r`n"Fitness Band",`r`n"Smart Ring",`r`n"VR Headset",`r`n"Smart Speaker",`r`n"Smart Display",`r`n"Security Camera",`r`n"Smart Thermostat",`r`n"Smart Plug",`r`n"Smart Light"]'::jsonb,'["Смарт часовник",`r`n"Фитнес гривна",`r`n"Смарт пръстен",`r`n"VR очила",`r`n"Смарт колонка",`r`n"Смарт дисплей",`r`n"Охранителна камера",`r`n"Смарт термостат",`r`n"Смарт контакт",`r`n"Смарт осветление"]'::jsonb),
  ('electronics','platform','["Alexa",`r`n"Google Home",`r`n"Apple HomeKit",`r`n"Samsung SmartThings",`r`n"Matter",`r`n"Zigbee",`r`n"Z-Wave"]'::jsonb,'["Alexa",`r`n"Google Home",`r`n"Apple HomeKit",`r`n"Samsung SmartThings",`r`n"Matter",`r`n"Zigbee",`r`n"Z-Wave"]'::jsonb),
  ('electronics','component_type','["CPU",`r`n"GPU",`r`n"RAM",`r`n"SSD",`r`n"HDD",`r`n"Motherboard",`r`n"Power Supply",`r`n"PC Case",`r`n"Cooling",`r`n"Network Card"]'::jsonb,'["Процесор",`r`n"Видео карта",`r`n"RAM",`r`n"SSD",`r`n"HDD",`r`n"Дънна платка",`r`n"Захранване",`r`n"Кутия",`r`n"Охлаждане",`r`n"Мрежова карта"]'::jsonb),
  ('electronics','compatibility','["Universal",`r`n"Windows",`r`n"macOS",`r`n"Linux",`r`n"Android",`r`n"iOS",`r`n"PlayStation",`r`n"Xbox",`r`n"Nintendo"]'::jsonb,'["Универсална",`r`n"Windows",`r`n"macOS",`r`n"Linux",`r`n"Android",`r`n"iOS",`r`n"PlayStation",`r`n"Xbox",`r`n"Nintendo"]'::jsonb),
  ('electronics','storage_type','["SSD NVMe",`r`n"SSD SATA",`r`n"HDD 2.5 inch",`r`n"HDD 3.5 inch",`r`n"eMMC",`r`n"UFS",`r`n"microSD"]'::jsonb,'["SSD NVMe",`r`n"SSD SATA",`r`n"HDD 2.5 инча",`r`n"HDD 3.5 инча",`r`n"eMMC",`r`n"UFS",`r`n"microSD"]'::jsonb),
  ('electronics','speed','["3200 MT/s",`r`n"3600 MT/s",`r`n"4800 MT/s",`r`n"5600 MT/s",`r`n"1 Gbps",`r`n"2.5 Gbps",`r`n"5 Gbps",`r`n"10 Gbps"]'::jsonb,'["3200 MT/s",`r`n"3600 MT/s",`r`n"4800 MT/s",`r`n"5600 MT/s",`r`n"1 Gbps",`r`n"2.5 Gbps",`r`n"5 Gbps",`r`n"10 Gbps"]'::jsonb),
  ('electronics','capacity','["250 GB",`r`n"500 GB",`r`n"1 TB",`r`n"2 TB",`r`n"4 TB",`r`n"8 TB",`r`n"16 TB"]'::jsonb,'["250 GB",`r`n"500 GB",`r`n"1 TB",`r`n"2 TB",`r`n"4 TB",`r`n"8 TB",`r`n"16 TB"]'::jsonb),
  ('electronics','water_resistance','["IPX4",`r`n"IPX5",`r`n"IPX6",`r`n"IPX7",`r`n"IPX8",`r`n"3 ATM",`r`n"5 ATM",`r`n"10 ATM"]'::jsonb,'["IPX4",`r`n"IPX5",`r`n"IPX6",`r`n"IPX7",`r`n"IPX8",`r`n"3 ATM",`r`n"5 ATM",`r`n"10 ATM"]'::jsonb),

  ('home','brand','["IKEA",`r`n"JYSK",`r`n"EMO",`r`n"TED",`r`n"Beko",`r`n"Gorenje",`r`n"Bosch",`r`n"Whirlpool",`r`n"Tefal",`r`n"Philips",`r`n"DeLonghi",`r`n"Faber",`r`n"Karcher",`r`n"Leifheit"]'::jsonb,'["IKEA",`r`n"JYSK",`r`n"EMO",`r`n"TED",`r`n"Beko",`r`n"Gorenje",`r`n"Bosch",`r`n"Whirlpool",`r`n"Tefal",`r`n"Philips",`r`n"DeLonghi",`r`n"Faber",`r`n"Karcher",`r`n"Leifheit"]'::jsonb),
  ('home','furniture_type','["Sofa",`r`n"Armchair",`r`n"Dining Table",`r`n"Coffee Table",`r`n"Bed",`r`n"Wardrobe",`r`n"Dresser",`r`n"Desk",`r`n"Office Chair",`r`n"TV Stand",`r`n"Bookshelf"]'::jsonb,'["Диван",`r`n"Фотьойл",`r`n"Трапезна маса",`r`n"Холна маса",`r`n"Легло",`r`n"Гардероб",`r`n"Скрин",`r`n"Бюро",`r`n"Офис стол",`r`n"ТВ шкаф",`r`n"Етажерка"]'::jsonb),
  ('home','material','["Wood",`r`n"Engineered Wood",`r`n"MDF",`r`n"Metal",`r`n"Glass",`r`n"Plastic",`r`n"Fabric",`r`n"Leather",`r`n"Velvet",`r`n"Rattan",`r`n"Ceramic",`r`n"Porcelain",`r`n"Stainless Steel",`r`n"Cast Iron"]'::jsonb,'["Дърво",`r`n"Инженерно дърво",`r`n"MDF",`r`n"Метал",`r`n"Стъкло",`r`n"Пластмаса",`r`n"Текстил",`r`n"Кожа",`r`n"Кадифе",`r`n"Ратан",`r`n"Керамика",`r`n"Порцелан",`r`n"Неръждаема стомана",`r`n"Чугун"]'::jsonb),
  ('home','style','["Modern",`r`n"Scandinavian",`r`n"Industrial",`r`n"Minimalist",`r`n"Classic",`r`n"Rustic",`r`n"Boho",`r`n"Mid-Century",`r`n"Contemporary"]'::jsonb,'["Модерен",`r`n"Скандинавски",`r`n"Индустриален",`r`n"Минималистичен",`r`n"Класически",`r`n"Рустик",`r`n"Бохо",`r`n"Mid-Century",`r`n"Съвременен"]'::jsonb),
  ('home','decor_type','["Wall Art",`r`n"Mirror",`r`n"Vase",`r`n"Candle Holder",`r`n"Clock",`r`n"Rug",`r`n"Curtain",`r`n"Throw Pillow",`r`n"Planter",`r`n"Lighting"]'::jsonb,'["Стенна декорация",`r`n"Огледало",`r`n"Ваза",`r`n"Свещник",`r`n"Часовник",`r`n"Килим",`r`n"Завеса",`r`n"Декоративна възглавница",`r`n"Поставка за растения",`r`n"Осветление"]'::jsonb),
  ('home','appliance_type','["Refrigerator",`r`n"Oven",`r`n"Cooktop",`r`n"Microwave",`r`n"Dishwasher",`r`n"Washing Machine",`r`n"Dryer",`r`n"Vacuum",`r`n"Coffee Machine",`r`n"Air Fryer",`r`n"Blender",`r`n"Kettle",`r`n"Toaster"]'::jsonb,'["Хладилник",`r`n"Фурна",`r`n"Плот",`r`n"Микровълнова",`r`n"Съдомиялна",`r`n"Пералня",`r`n"Сушилня",`r`n"Прахосмукачка",`r`n"Кафемашина",`r`n"Еър фрайър",`r`n"Блендер",`r`n"Ел. кана",`r`n"Тостер"]'::jsonb),
  ('home','power_watts','["Under 500W",`r`n"500-1000W",`r`n"1000-1500W",`r`n"1500-2000W",`r`n"2000W+"]'::jsonb,'["Под 500W",`r`n"500-1000W",`r`n"1000-1500W",`r`n"1500-2000W",`r`n"Над 2000W"]'::jsonb),
  ('home','capacity','["0.5 L",`r`n"1 L",`r`n"1.5 L",`r`n"2 L",`r`n"5 L",`r`n"10 L",`r`n"20 L",`r`n"30 L",`r`n"50 L",`r`n"100 L+"]'::jsonb,'["0.5 L",`r`n"1 L",`r`n"1.5 L",`r`n"2 L",`r`n"5 L",`r`n"10 L",`r`n"20 L",`r`n"30 L",`r`n"50 L",`r`n"100 L+"]'::jsonb),
  ('home','energy_rating','["A+++",`r`n"A++",`r`n"A+",`r`n"A",`r`n"B",`r`n"C",`r`n"D",`r`n"E",`r`n"F",`r`n"G"]'::jsonb,'["A+++",`r`n"A++",`r`n"A+",`r`n"A",`r`n"B",`r`n"C",`r`n"D",`r`n"E",`r`n"F",`r`n"G"]'::jsonb),
  ('home','set_size','["1 piece",`r`n"2 pieces",`r`n"3 pieces",`r`n"4 pieces",`r`n"6 pieces",`r`n"12 pieces",`r`n"24 pieces"]'::jsonb,'["1 брой",`r`n"2 броя",`r`n"3 броя",`r`n"4 броя",`r`n"6 броя",`r`n"12 броя",`r`n"24 броя"]'::jsonb),
  ('home','size','["Small",`r`n"Medium",`r`n"Large",`r`n"Single",`r`n"Double",`r`n"Queen",`r`n"King",`r`n"XL"]'::jsonb,'["Малък",`r`n"Среден",`r`n"Голям",`r`n"Единичен",`r`n"Двоен",`r`n"Queen",`r`n"King",`r`n"XL"]'::jsonb),
  ('home','thread_count','["144",`r`n"200",`r`n"240",`r`n"300",`r`n"400",`r`n"600",`r`n"800",`r`n"1000+"]'::jsonb,'["144",`r`n"200",`r`n"240",`r`n"300",`r`n"400",`r`n"600",`r`n"800",`r`n"1000+"]'::jsonb),
  ('home','pattern','["Solid",`r`n"Striped",`r`n"Floral",`r`n"Geometric",`r`n"Plaid",`r`n"Abstract",`r`n"Animal Print",`r`n"Polka Dot"]'::jsonb,'["Едноцветен",`r`n"Раиран",`r`n"Флорален",`r`n"Геометричен",`r`n"Каре",`r`n"Абстрактен",`r`n"Животински принт",`r`n"Точки"]'::jsonb),
  ('home','product_type','["Plant Pot",`r`n"Garden Tool",`r`n"Desk Organizer",`r`n"Storage Box",`r`n"Detergent",`r`n"Mop",`r`n"Broom",`r`n"Drill",`r`n"Paint Roller",`r`n"Notebook",`r`n"Lamp"]'::jsonb,'["Саксия",`r`n"Градински инструмент",`r`n"Органайзер за бюро",`r`n"Кутия за съхранение",`r`n"Препарат",`r`n"Моп",`r`n"Метла",`r`n"Бормашина",`r`n"Валяк за боя",`r`n"Тетрадка",`r`n"Лампа"]'::jsonb),
  ('home','power_source','["Manual",`r`n"Electric (Corded)",`r`n"Battery",`r`n"Gas",`r`n"Solar"]'::jsonb,'["Ръчно",`r`n"Електрическо (с кабел)",`r`n"Батерия",`r`n"Газ",`r`n"Соларно"]'::jsonb),
  ('home','paper_size','["A6",`r`n"A5",`r`n"A4",`r`n"A3",`r`n"Letter",`r`n"Legal"]'::jsonb,'["A6",`r`n"A5",`r`n"A4",`r`n"A3",`r`n"Letter",`r`n"Legal"]'::jsonb),
  ('home','ergonomic','["Standard",`r`n"Ergonomic"]'::jsonb,'["Стандартен",`r`n"Ергономичен"]'::jsonb),
  ('home','storage_type','["Drawer",`r`n"Shelf",`r`n"Box",`r`n"Basket",`r`n"Cabinet",`r`n"Vacuum Bag",`r`n"Hanging Organizer",`r`n"Modular Bin"]'::jsonb,'["Чекмедже",`r`n"Рафт",`r`n"Кутия",`r`n"Кошница",`r`n"Шкаф",`r`n"Вакуумен плик",`r`n"Висящ органайзер",`r`n"Модулен контейнер"]'::jsonb),
  ('home','quantity','["1 pc",`r`n"2 pcs",`r`n"3 pcs",`r`n"5 pcs",`r`n"10 pcs",`r`n"20 pcs",`r`n"50 pcs",`r`n"100 pcs"]'::jsonb,'["1 бр",`r`n"2 бр",`r`n"3 бр",`r`n"5 бр",`r`n"10 бр",`r`n"20 бр",`r`n"50 бр",`r`n"100 бр"]'::jsonb),
  ('home','scent','["Unscented",`r`n"Lavender",`r`n"Lemon",`r`n"Ocean",`r`n"Floral",`r`n"Fresh Linen",`r`n"Vanilla",`r`n"Citrus"]'::jsonb,'["Без аромат",`r`n"Лавандула",`r`n"Лимон",`r`n"Океан",`r`n"Флорален",`r`n"Свеж лен",`r`n"Ванилия",`r`n"Цитрус"]'::jsonb),
  ('home','tool_type','["Drill",`r`n"Screwdriver",`r`n"Hammer",`r`n"Saw",`r`n"Wrench",`r`n"Pliers",`r`n"Sander",`r`n"Pressure Washer",`r`n"Paint Sprayer",`r`n"Lawn Mower"]'::jsonb,'["Бормашина",`r`n"Отвертка",`r`n"Чук",`r`n"Трион",`r`n"Гаечен ключ",`r`n"Клещи",`r`n"Шлайф",`r`n"Водоструйка",`r`n"Пистолет за боя",`r`n"Косачка"]'::jsonb),
  ('home','surface_type','["Wood",`r`n"Tile",`r`n"Laminate",`r`n"Carpet",`r`n"Glass",`r`n"Metal",`r`n"Stone",`r`n"Multi-Surface"]'::jsonb,'["Дърво",`r`n"Плочки",`r`n"Ламинат",`r`n"Килим",`r`n"Стъкло",`r`n"Метал",`r`n"Камък",`r`n"Многофункционална"]'::jsonb),
  ('home','indooroutdoor','["Indoor",`r`n"Outdoor",`r`n"Indoor/Outdoor"]'::jsonb,'["За вътрешно",`r`n"За външно",`r`n"За вътрешно/външно"]'::jsonb),

  ('fashion','brand','["Zara",`r`n"H&M",`r`n"Mango",`r`n"Nike",`r`n"Adidas",`r`n"Puma",`r`n"Levis",`r`n"Tommy Hilfiger",`r`n"Calvin Klein",`r`n"Guess",`r`n"Massimo Dutti",`r`n"Reserved",`r`n"Bershka",`r`n"New Yorker"]'::jsonb,'["Zara",`r`n"H&M",`r`n"Mango",`r`n"Nike",`r`n"Adidas",`r`n"Puma",`r`n"Levis",`r`n"Tommy Hilfiger",`r`n"Calvin Klein",`r`n"Guess",`r`n"Massimo Dutti",`r`n"Reserved",`r`n"Bershka",`r`n"New Yorker"]'::jsonb),
  ('fashion','size','["XXS",`r`n"XS",`r`n"S",`r`n"M",`r`n"L",`r`n"XL",`r`n"XXL",`r`n"3XL",`r`n"4XL",`r`n"One Size"]'::jsonb,'["XXS",`r`n"XS",`r`n"S",`r`n"M",`r`n"L",`r`n"XL",`r`n"XXL",`r`n"3XL",`r`n"4XL",`r`n"Универсален"]'::jsonb),
  ('fashion','material','["Cotton",`r`n"Linen",`r`n"Wool",`r`n"Cashmere",`r`n"Denim",`r`n"Leather",`r`n"Suede",`r`n"Polyester",`r`n"Viscose",`r`n"Silk",`r`n"Elastane",`r`n"Nylon"]'::jsonb,'["Памук",`r`n"Лен",`r`n"Вълна",`r`n"Кашмир",`r`n"Деним",`r`n"Кожа",`r`n"Велур",`r`n"Полиестер",`r`n"Вискоза",`r`n"Коприна",`r`n"Еластан",`r`n"Найлон"]'::jsonb),
  ('fashion','style','["Casual",`r`n"Smart Casual",`r`n"Formal",`r`n"Streetwear",`r`n"Sport",`r`n"Vintage",`r`n"Boho",`r`n"Minimalist",`r`n"Business",`r`n"Evening"]'::jsonb,'["Ежедневен",`r`n"Смарт кежуъл",`r`n"Официален",`r`n"Уличен",`r`n"Спортен",`r`n"Винтидж",`r`n"Бохо",`r`n"Минималистичен",`r`n"Бизнес",`r`n"Вечерен"]'::jsonb),
  ('fashion','season','["Spring",`r`n"Summer",`r`n"Autumn",`r`n"Winter",`r`n"All Season"]'::jsonb,'["Пролет",`r`n"Лято",`r`n"Есен",`r`n"Зима",`r`n"Всички сезони"]'::jsonb),
  ('fashion','pattern','["Solid",`r`n"Striped",`r`n"Checked",`r`n"Floral",`r`n"Graphic",`r`n"Animal Print",`r`n"Camouflage",`r`n"Polka Dot"]'::jsonb,'["Едноцветен",`r`n"Раиран",`r`n"Каре",`r`n"Флорален",`r`n"Графичен",`r`n"Животински принт",`r`n"Камуфлаж",`r`n"Точки"]'::jsonb),
  ('fashion','shoe_size_eu','["35",`r`n"36",`r`n"37",`r`n"38",`r`n"39",`r`n"40",`r`n"41",`r`n"42",`r`n"43",`r`n"44",`r`n"45",`r`n"46"]'::jsonb,'["35",`r`n"36",`r`n"37",`r`n"38",`r`n"39",`r`n"40",`r`n"41",`r`n"42",`r`n"43",`r`n"44",`r`n"45",`r`n"46"]'::jsonb),
  ('fashion','heel_height','["Flat (0-2 cm)",`r`n"Low (3-5 cm)",`r`n"Mid (6-8 cm)",`r`n"High (9-11 cm)",`r`n"Very High (12+ cm)"]'::jsonb,'["Ниски (0-2 см)",`r`n"Нисък ток (3-5 см)",`r`n"Среден ток (6-8 см)",`r`n"Висок ток (9-11 см)",`r`n"Много висок ток (12+ см)"]'::jsonb),
  ('fashion','sport_type','["Running",`r`n"Training",`r`n"Football",`r`n"Basketball",`r`n"Tennis",`r`n"Hiking",`r`n"Yoga",`r`n"Cycling",`r`n"Lifestyle"]'::jsonb,'["Бягане",`r`n"Тренировки",`r`n"Футбол",`r`n"Баскетбол",`r`n"Тенис",`r`n"Туризъм",`r`n"Йога",`r`n"Колоездене",`r`n"Lifestyle"]'::jsonb),
  ('fashion','accessory_type','["Handbag",`r`n"Backpack",`r`n"Wallet",`r`n"Belt",`r`n"Hat",`r`n"Scarf",`r`n"Sunglasses",`r`n"Gloves",`r`n"Hair Accessory",`r`n"Travel Bag"]'::jsonb,'["Чанта",`r`n"Раница",`r`n"Портфейл",`r`n"Колан",`r`n"Шапка",`r`n"Шал",`r`n"Слънчеви очила",`r`n"Ръкавици",`r`n"Аксесоар за коса",`r`n"Пътна чанта"]'::jsonb),
  ('fashion','closure','["Zipper",`r`n"Button",`r`n"Magnetic",`r`n"Buckle",`r`n"Snap",`r`n"Drawstring",`r`n"Velcro",`r`n"Open Top"]'::jsonb,'["Цип",`r`n"Копче",`r`n"Магнит",`r`n"Катарама",`r`n"Тик-так",`r`n"Връзки",`r`n"Велкро",`r`n"Отворен тип"]'::jsonb),
  ('fashion','jewelry_type','["Ring",`r`n"Necklace",`r`n"Bracelet",`r`n"Earrings",`r`n"Pendant",`r`n"Anklet",`r`n"Brooch",`r`n"Set"]'::jsonb,'["Пръстен",`r`n"Колиe",`r`n"Гривна",`r`n"Обеци",`r`n"Медальон",`r`n"Гривна за глезен",`r`n"Брошка",`r`n"Комплект"]'::jsonb),
  ('fashion','stone_type','["No Stone",`r`n"Cubic Zirconia",`r`n"Diamond",`r`n"Sapphire",`r`n"Ruby",`r`n"Emerald",`r`n"Pearl",`r`n"Opal",`r`n"Topaz",`r`n"Amethyst"]'::jsonb,'["Без камък",`r`n"Цирконий",`r`n"Диамант",`r`n"Сапфир",`r`n"Рубин",`r`n"Изумруд",`r`n"Перла",`r`n"Опал",`r`n"Топаз",`r`n"Аметист"]'::jsonb),
  ('fashion','authenticity','["Verified Authentic",`r`n"Certificate Included",`r`n"Receipt Included",`r`n"Not Verified"]'::jsonb,'["Потвърдена автентичност",`r`n"Сертификат включен",`r`n"Касова бележка включена",`r`n"Непотвърдена"]'::jsonb),
  ('fashion','watch_type','["Analog",`r`n"Digital",`r`n"Smartwatch",`r`n"Automatic",`r`n"Quartz",`r`n"Chronograph",`r`n"Diver"]'::jsonb,'["Аналогов",`r`n"Дигитален",`r`n"Смарт часовник",`r`n"Автоматичен",`r`n"Кварцов",`r`n"Хронограф",`r`n"Дайвър"]'::jsonb),
  ('fashion','band_material','["Stainless Steel",`r`n"Leather",`r`n"Silicone",`r`n"Nylon",`r`n"Titanium",`r`n"Ceramic",`r`n"Rubber",`r`n"Mesh"]'::jsonb,'["Неръждаема стомана",`r`n"Кожа",`r`n"Силикон",`r`n"Найлон",`r`n"Титан",`r`n"Керамика",`r`n"Каучук",`r`n"Мрежеста"]'::jsonb),
  ('fashion','case_size','["28 mm",`r`n"32 mm",`r`n"36 mm",`r`n"40 mm",`r`n"42 mm",`r`n"44 mm",`r`n"46 mm",`r`n"48 mm"]'::jsonb,'["28 мм",`r`n"32 мм",`r`n"36 мм",`r`n"40 мм",`r`n"42 мм",`r`n"44 мм",`r`n"46 мм",`r`n"48 мм"]'::jsonb),
  ('fashion','water_resistance','["No",`r`n"30 m",`r`n"50 m",`r`n"100 m",`r`n"200 m",`r`n"300 m+"]'::jsonb,'["Не",`r`n"30 м",`r`n"50 м",`r`n"100 м",`r`n"200 м",`r`n"300 м+"]'::jsonb),
  ('fashion','movement','["Quartz",`r`n"Automatic",`r`n"Manual",`r`n"Solar",`r`n"Kinetic"]'::jsonb,'["Кварцов",`r`n"Автоматичен",`r`n"Ръчен",`r`n"Соларен",`r`n"Кинетичен"]'::jsonb),
  ('fashion','gender','["Women",`r`n"Men",`r`n"Unisex",`r`n"Girls",`r`n"Boys"]'::jsonb,'["Жени",`r`n"Мъже",`r`n"Унисекс",`r`n"Момичета",`r`n"Момчета"]'::jsonb),
  ('fashion','age_group','["Baby (0-2)",`r`n"Toddler (2-4)",`r`n"Kids (4-8)",`r`n"Junior (8-12)",`r`n"Teen (13-17)",`r`n"Adult"]'::jsonb,'["Бебе (0-2)",`r`n"Малко дете (2-4)",`r`n"Деца (4-8)",`r`n"Юноши (8-12)",`r`n"Тийнейджър (13-17)",`r`n"Възрастен"]'::jsonb),
  ('fashion','year','["2020",`r`n"2021",`r`n"2022",`r`n"2023",`r`n"2024",`r`n"2025",`r`n"2026"]'::jsonb,'["2020",`r`n"2021",`r`n"2022",`r`n"2023",`r`n"2024",`r`n"2025",`r`n"2026"]'::jsonb);

with seeded as (
  select
    c.id as category_id,
    lt.template_name,
    case
      when lt.template_name like 'electronics_%' then 'electronics'
      when lt.template_name like 'home_%' then 'home'
      when lt.template_name like 'fashion_%' then 'fashion'
      else null
    end as option_vertical,
    tk.attribute_key,
    row_number() over (partition by c.id order by tk.attribute_key) as sort_order
  from tmp_leaf_templates lt
  join public.categories c on c.slug = lt.leaf_slug
  join tmp_template_keys tk on tk.template_name = lt.template_name
), typed as (
  select
    s.*,
    case
      when s.attribute_key in (
        'assembly_required','foldable','dishwasher_safe','induction_compatible','weather_resistant',
        'outdoor_use','refillable','educational','isofix','bpa_free','convertible','fragrance_free'
      ) then 'boolean'
      when s.attribute_key in ('dimensions','specification','model') then 'text'
      else 'select'
    end as attribute_type
  from seeded s
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
  t.category_id,
  initcap(replace(t.attribute_key, '_', ' ')) as name,
  coalesce(nbg.name_bg, initcap(replace(t.attribute_key, '_', ' '))) as name_bg,
  t.attribute_type,
  (t.attribute_key in ('brand','condition','make','model','year','product_type','part_type','toy_type')) as is_required,
  (t.attribute_key not in ('dimensions')) as is_filterable,
  case
    when t.attribute_type = 'select' then coalesce(opt.options, '[]'::jsonb)
    else '[]'::jsonb
  end as options,
  case
    when t.attribute_type = 'select' then coalesce(opt.options_bg, '[]'::jsonb)
    else '[]'::jsonb
  end as options_bg,
  t.sort_order,
  t.attribute_key,
  'self_only'::public.category_attribute_inherit_scope as inherit_scope,
  true as is_active,
  (t.attribute_key in ('size','shoe_size_eu','age_group')) as is_variation,
  true as is_searchable,
  case
    when t.attribute_key in ('brand','model','make','year','condition') then 'core'
    when t.attribute_key in ('color','material','style','pattern') then 'appearance'
    when t.attribute_key in ('storage','ram','processor','gpu','resolution','screen_size') then 'specs'
    when t.attribute_key in ('compatibility','compatible_makes','compatible_models','compatible_years') then 'compatibility'
    else 'details'
  end as aspect_group,
  null::uuid as depends_on_attribute_id,
  array[]::text[] as depends_on_values
from typed t
left join tmp_attribute_name_bg nbg on nbg.attribute_key = t.attribute_key
left join lateral (
  select o.options, o.options_bg
  from tmp_aspect_options o
  where o.attribute_key = t.attribute_key
    and (o.vertical = t.option_vertical or o.vertical = 'all')
  order by case when o.vertical = t.option_vertical then 0 else 1 end
  limit 1
) opt on true
on conflict (category_id, name)
do update set
  name = excluded.name,
  name_bg = excluded.name_bg,
  attribute_type = excluded.attribute_type,
  is_required = excluded.is_required,
  is_filterable = excluded.is_filterable,
  options = excluded.options,
  options_bg = excluded.options_bg,
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

