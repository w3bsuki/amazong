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
  ('all','color','["Black","White","Gray","Silver","Blue","Navy","Green","Red","Pink","Purple","Yellow","Orange","Brown","Beige","Gold","Rose Gold","Transparent","Multicolor"]'::jsonb,'["Черен","Бял","Сив","Сребрист","Син","Тъмносин","Зелен","Червен","Розов","Лилав","Жълт","Оранжев","Кафяв","Бежов","Златист","Розово злато","Прозрачен","Многоцветен"]'::jsonb),
  ('all','condition','["New","Like New","Used - Excellent","Used - Good","Used - Fair","For Parts"]'::jsonb,'["Ново","Като ново","Употребявано - отлично","Употребявано - добро","Употребявано - задоволително","За части"]'::jsonb),
  ('all','warranty','["No Warranty","1 Month","3 Months","6 Months","12 Months","24 Months","Manufacturer Warranty"]'::jsonb,'["Без гаранция","1 месец","3 месеца","6 месеца","12 месеца","24 месеца","Гаранция от производителя"]'::jsonb),

  ('electronics','brand','["Apple","Samsung","Xiaomi","Huawei","Google","Sony","LG","Lenovo","HP","Dell","ASUS","Acer","MSI","Bose","JBL"]'::jsonb,'["Apple","Samsung","Xiaomi","Huawei","Google","Sony","LG","Lenovo","HP","Dell","ASUS","Acer","MSI","Bose","JBL"]'::jsonb),
  ('electronics','storage','["32 GB","64 GB","128 GB","256 GB","512 GB","1 TB","2 TB"]'::jsonb,'["32 GB","64 GB","128 GB","256 GB","512 GB","1 TB","2 TB"]'::jsonb),
  ('electronics','ram','["4 GB","6 GB","8 GB","12 GB","16 GB","24 GB","32 GB","64 GB"]'::jsonb,'["4 GB","6 GB","8 GB","12 GB","16 GB","24 GB","32 GB","64 GB"]'::jsonb),
  ('electronics','network','["2G","3G","4G","5G","Wi-Fi Only"]'::jsonb,'["2G","3G","4G","5G","Само Wi-Fi"]'::jsonb),
  ('electronics','carrier_lock','["Unlocked","Locked to A1","Locked to Yettel","Locked to Vivacom","Factory Unlocked"]'::jsonb,'["Отключен","Заключен към A1","Заключен към Yettel","Заключен към Vivacom","Фабрично отключен"]'::jsonb),
  ('electronics','battery_life','["Up to 4 h","4-8 h","8-12 h","12-18 h","18+ h"]'::jsonb,'["До 4 ч","4-8 ч","8-12 ч","12-18 ч","18+ ч"]'::jsonb),
  ('electronics','processor','["Intel Core i3","Intel Core i5","Intel Core i7","Intel Core i9","AMD Ryzen 3","AMD Ryzen 5","AMD Ryzen 7","AMD Ryzen 9","Apple M1","Apple M2","Apple M3","Qualcomm Snapdragon","MediaTek Dimensity"]'::jsonb,'["Intel Core i3","Intel Core i5","Intel Core i7","Intel Core i9","AMD Ryzen 3","AMD Ryzen 5","AMD Ryzen 7","AMD Ryzen 9","Apple M1","Apple M2","Apple M3","Qualcomm Snapdragon","MediaTek Dimensity"]'::jsonb),
  ('electronics','gpu','["Integrated","NVIDIA GTX 1650","NVIDIA RTX 3050","NVIDIA RTX 3060","NVIDIA RTX 4060","NVIDIA RTX 4070","AMD Radeon RX 6600","AMD Radeon RX 7600","Apple Integrated GPU"]'::jsonb,'["Вградена","NVIDIA GTX 1650","NVIDIA RTX 3050","NVIDIA RTX 3060","NVIDIA RTX 4060","NVIDIA RTX 4070","AMD Radeon RX 6600","AMD Radeon RX 7600","Apple Integrated GPU"]'::jsonb),
  ('electronics','screen_size','["Under 6.1 in","6.1-6.5 in","6.6-7 in","8-10 in","11-13 in","14-15.6 in","16-17.3 in","34+ in"]'::jsonb,'["Под 6.1 инча","6.1-6.5 инча","6.6-7 инча","8-10 инча","11-13 инча","14-15.6 инча","16-17.3 инча","34+ инча"]'::jsonb),
  ('electronics','form_factor','["Tower","Mini Tower","Small Form Factor","All-in-One","Mini PC"]'::jsonb,'["Кула","Мини кула","Компактен корпус","Всичко в едно","Мини компютър"]'::jsonb),
  ('electronics','connectivity','["Wi-Fi","Wi-Fi 6","Bluetooth","Bluetooth 5.x","NFC","USB-C","USB 3.0","HDMI","DisplayPort","Ethernet","Cellular","Lightning"]'::jsonb,'["Wi-Fi","Wi-Fi 6","Bluetooth","Bluetooth 5.x","NFC","USB-C","USB 3.0","HDMI","DisplayPort","Ethernet","Клетъчна мрежа","Lightning"]'::jsonb),
  ('electronics','resolution','["HD (1366x768)","Full HD (1920x1080)","2K (2560x1440)","4K UHD (3840x2160)","5K","8K"]'::jsonb,'["HD (1366x768)","Full HD (1920x1080)","2K (2560x1440)","4K UHD (3840x2160)","5K","8K"]'::jsonb),
  ('electronics','display_type','["LCD","LED","OLED","AMOLED","QLED","Mini LED","MicroLED","IPS","VA","TN"]'::jsonb,'["LCD","LED","OLED","AMOLED","QLED","Mini LED","MicroLED","IPS","VA","TN"]'::jsonb),
  ('electronics','smart_platform','["Android TV","Google TV","webOS","Tizen","Roku TV","Fire TV","tvOS"]'::jsonb,'["Android TV","Google TV","webOS","Tizen","Roku TV","Fire TV","tvOS"]'::jsonb),
  ('electronics','refresh_rate','["60 Hz","75 Hz","90 Hz","100 Hz","120 Hz","144 Hz","165 Hz","240 Hz"]'::jsonb,'["60 Hz","75 Hz","90 Hz","100 Hz","120 Hz","144 Hz","165 Hz","240 Hz"]'::jsonb),
  ('electronics','panel_type','["IPS","VA","TN","OLED","Mini LED"]'::jsonb,'["IPS","VA","TN","OLED","Mini LED"]'::jsonb),
  ('electronics','response_time','["1 ms","2 ms","4 ms","5 ms","8 ms","10+ ms"]'::jsonb,'["1 ms","2 ms","4 ms","5 ms","8 ms","10+ ms"]'::jsonb),
  ('electronics','audio_type','["In-ear","On-ear","Over-ear","Earbuds","Soundbar","Speaker","Home Theater","Microphone"]'::jsonb,'["Вътрешни","Наложени","Пълноразмерни","Тапи","Саундбар","Колона","Домашно кино","Микрофон"]'::jsonb),
  ('electronics','power_source','["Battery","Rechargeable Battery","USB Power","AC Adapter","PoE","Solar"]'::jsonb,'["Батерия","Презареждаема батерия","USB захранване","Мрежов адаптер","PoE","Соларно"]'::jsonb),
  ('electronics','camera_type','["DSLR","Mirrorless","Compact","Action Camera","Instant Camera","Camcorder","Drone Camera"]'::jsonb,'["DSLR","Безогледална","Компактна","Екшън камера","Моментна камера","Видеокамера","Дрон камера"]'::jsonb),
  ('electronics','sensor_type','["CMOS","Full-Frame CMOS","APS-C CMOS","Micro Four Thirds","BSI CMOS"]'::jsonb,'["CMOS","Пълнокадров CMOS","APS-C CMOS","Micro Four Thirds","BSI CMOS"]'::jsonb),
  ('electronics','lens_mount','["Canon EF","Canon RF","Nikon F","Nikon Z","Sony E","Fujifilm X","Micro Four Thirds","Leica M"]'::jsonb,'["Canon EF","Canon RF","Nikon F","Nikon Z","Sony E","Fujifilm X","Micro Four Thirds","Leica M"]'::jsonb),
  ('electronics','device_type','["Smartwatch","Fitness Band","Smart Ring","VR Headset","Smart Speaker","Smart Display","Security Camera","Smart Thermostat","Smart Plug","Smart Light"]'::jsonb,'["Смарт часовник","Фитнес гривна","Смарт пръстен","VR очила","Смарт колонка","Смарт дисплей","Охранителна камера","Смарт термостат","Смарт контакт","Смарт осветление"]'::jsonb),
  ('electronics','platform','["Alexa","Google Home","Apple HomeKit","Samsung SmartThings","Matter","Zigbee","Z-Wave"]'::jsonb,'["Alexa","Google Home","Apple HomeKit","Samsung SmartThings","Matter","Zigbee","Z-Wave"]'::jsonb),
  ('electronics','component_type','["CPU","GPU","RAM","SSD","HDD","Motherboard","Power Supply","PC Case","Cooling","Network Card"]'::jsonb,'["Процесор","Видео карта","RAM","SSD","HDD","Дънна платка","Захранване","Кутия","Охлаждане","Мрежова карта"]'::jsonb),
  ('electronics','compatibility','["Universal","Windows","macOS","Linux","Android","iOS","PlayStation","Xbox","Nintendo"]'::jsonb,'["Универсална","Windows","macOS","Linux","Android","iOS","PlayStation","Xbox","Nintendo"]'::jsonb),
  ('electronics','storage_type','["SSD NVMe","SSD SATA","HDD 2.5 inch","HDD 3.5 inch","eMMC","UFS","microSD"]'::jsonb,'["SSD NVMe","SSD SATA","HDD 2.5 инча","HDD 3.5 инча","eMMC","UFS","microSD"]'::jsonb),
  ('electronics','speed','["3200 MT/s","3600 MT/s","4800 MT/s","5600 MT/s","1 Gbps","2.5 Gbps","5 Gbps","10 Gbps"]'::jsonb,'["3200 MT/s","3600 MT/s","4800 MT/s","5600 MT/s","1 Gbps","2.5 Gbps","5 Gbps","10 Gbps"]'::jsonb),
  ('electronics','capacity','["250 GB","500 GB","1 TB","2 TB","4 TB","8 TB","16 TB"]'::jsonb,'["250 GB","500 GB","1 TB","2 TB","4 TB","8 TB","16 TB"]'::jsonb),
  ('electronics','water_resistance','["IPX4","IPX5","IPX6","IPX7","IPX8","3 ATM","5 ATM","10 ATM"]'::jsonb,'["IPX4","IPX5","IPX6","IPX7","IPX8","3 ATM","5 ATM","10 ATM"]'::jsonb),

  ('home','brand','["IKEA","JYSK","EMO","TED","Beko","Gorenje","Bosch","Whirlpool","Tefal","Philips","DeLonghi","Faber","Karcher","Leifheit"]'::jsonb,'["IKEA","JYSK","EMO","TED","Beko","Gorenje","Bosch","Whirlpool","Tefal","Philips","DeLonghi","Faber","Karcher","Leifheit"]'::jsonb),
  ('home','furniture_type','["Sofa","Armchair","Dining Table","Coffee Table","Bed","Wardrobe","Dresser","Desk","Office Chair","TV Stand","Bookshelf"]'::jsonb,'["Диван","Фотьойл","Трапезна маса","Холна маса","Легло","Гардероб","Скрин","Бюро","Офис стол","ТВ шкаф","Етажерка"]'::jsonb),
  ('home','material','["Wood","Engineered Wood","MDF","Metal","Glass","Plastic","Fabric","Leather","Velvet","Rattan","Ceramic","Porcelain","Stainless Steel","Cast Iron"]'::jsonb,'["Дърво","Инженерно дърво","MDF","Метал","Стъкло","Пластмаса","Текстил","Кожа","Кадифе","Ратан","Керамика","Порцелан","Неръждаема стомана","Чугун"]'::jsonb),
  ('home','style','["Modern","Scandinavian","Industrial","Minimalist","Classic","Rustic","Boho","Mid-Century","Contemporary"]'::jsonb,'["Модерен","Скандинавски","Индустриален","Минималистичен","Класически","Рустик","Бохо","Mid-Century","Съвременен"]'::jsonb),
  ('home','decor_type','["Wall Art","Mirror","Vase","Candle Holder","Clock","Rug","Curtain","Throw Pillow","Planter","Lighting"]'::jsonb,'["Стенна декорация","Огледало","Ваза","Свещник","Часовник","Килим","Завеса","Декоративна възглавница","Поставка за растения","Осветление"]'::jsonb),
  ('home','appliance_type','["Refrigerator","Oven","Cooktop","Microwave","Dishwasher","Washing Machine","Dryer","Vacuum","Coffee Machine","Air Fryer","Blender","Kettle","Toaster"]'::jsonb,'["Хладилник","Фурна","Плот","Микровълнова","Съдомиялна","Пералня","Сушилня","Прахосмукачка","Кафемашина","Еър фрайър","Блендер","Ел. кана","Тостер"]'::jsonb),
  ('home','power_watts','["Under 500W","500-1000W","1000-1500W","1500-2000W","2000W+"]'::jsonb,'["Под 500W","500-1000W","1000-1500W","1500-2000W","Над 2000W"]'::jsonb),
  ('home','capacity','["0.5 L","1 L","1.5 L","2 L","5 L","10 L","20 L","30 L","50 L","100 L+"]'::jsonb,'["0.5 L","1 L","1.5 L","2 L","5 L","10 L","20 L","30 L","50 L","100 L+"]'::jsonb),
  ('home','energy_rating','["A+++","A++","A+","A","B","C","D","E","F","G"]'::jsonb,'["A+++","A++","A+","A","B","C","D","E","F","G"]'::jsonb),
  ('home','set_size','["1 piece","2 pieces","3 pieces","4 pieces","6 pieces","12 pieces","24 pieces"]'::jsonb,'["1 брой","2 броя","3 броя","4 броя","6 броя","12 броя","24 броя"]'::jsonb),
  ('home','size','["Small","Medium","Large","Single","Double","Queen","King","XL"]'::jsonb,'["Малък","Среден","Голям","Единичен","Двоен","Queen","King","XL"]'::jsonb),
  ('home','thread_count','["144","200","240","300","400","600","800","1000+"]'::jsonb,'["144","200","240","300","400","600","800","1000+"]'::jsonb),
  ('home','pattern','["Solid","Striped","Floral","Geometric","Plaid","Abstract","Animal Print","Polka Dot"]'::jsonb,'["Едноцветен","Раиран","Флорален","Геометричен","Каре","Абстрактен","Животински принт","Точки"]'::jsonb),
  ('home','product_type','["Plant Pot","Garden Tool","Desk Organizer","Storage Box","Detergent","Mop","Broom","Drill","Paint Roller","Notebook","Lamp"]'::jsonb,'["Саксия","Градински инструмент","Органайзер за бюро","Кутия за съхранение","Препарат","Моп","Метла","Бормашина","Валяк за боя","Тетрадка","Лампа"]'::jsonb),
  ('home','power_source','["Manual","Electric (Corded)","Battery","Gas","Solar"]'::jsonb,'["Ръчно","Електрическо (с кабел)","Батерия","Газ","Соларно"]'::jsonb),
  ('home','paper_size','["A6","A5","A4","A3","Letter","Legal"]'::jsonb,'["A6","A5","A4","A3","Letter","Legal"]'::jsonb),
  ('home','ergonomic','["Standard","Ergonomic"]'::jsonb,'["Стандартен","Ергономичен"]'::jsonb),
  ('home','storage_type','["Drawer","Shelf","Box","Basket","Cabinet","Vacuum Bag","Hanging Organizer","Modular Bin"]'::jsonb,'["Чекмедже","Рафт","Кутия","Кошница","Шкаф","Вакуумен плик","Висящ органайзер","Модулен контейнер"]'::jsonb),
  ('home','quantity','["1 pc","2 pcs","3 pcs","5 pcs","10 pcs","20 pcs","50 pcs","100 pcs"]'::jsonb,'["1 бр","2 бр","3 бр","5 бр","10 бр","20 бр","50 бр","100 бр"]'::jsonb),
  ('home','scent','["Unscented","Lavender","Lemon","Ocean","Floral","Fresh Linen","Vanilla","Citrus"]'::jsonb,'["Без аромат","Лавандула","Лимон","Океан","Флорален","Свеж лен","Ванилия","Цитрус"]'::jsonb),
  ('home','tool_type','["Drill","Screwdriver","Hammer","Saw","Wrench","Pliers","Sander","Pressure Washer","Paint Sprayer","Lawn Mower"]'::jsonb,'["Бормашина","Отвертка","Чук","Трион","Гаечен ключ","Клещи","Шлайф","Водоструйка","Пистолет за боя","Косачка"]'::jsonb),
  ('home','surface_type','["Wood","Tile","Laminate","Carpet","Glass","Metal","Stone","Multi-Surface"]'::jsonb,'["Дърво","Плочки","Ламинат","Килим","Стъкло","Метал","Камък","Многофункционална"]'::jsonb),
  ('home','indooroutdoor','["Indoor","Outdoor","Indoor/Outdoor"]'::jsonb,'["За вътрешно","За външно","За вътрешно/външно"]'::jsonb),

  ('fashion','brand','["Zara","H&M","Mango","Nike","Adidas","Puma","Levis","Tommy Hilfiger","Calvin Klein","Guess","Massimo Dutti","Reserved","Bershka","New Yorker"]'::jsonb,'["Zara","H&M","Mango","Nike","Adidas","Puma","Levis","Tommy Hilfiger","Calvin Klein","Guess","Massimo Dutti","Reserved","Bershka","New Yorker"]'::jsonb),
  ('fashion','size','["XXS","XS","S","M","L","XL","XXL","3XL","4XL","One Size"]'::jsonb,'["XXS","XS","S","M","L","XL","XXL","3XL","4XL","Универсален"]'::jsonb),
  ('fashion','material','["Cotton","Linen","Wool","Cashmere","Denim","Leather","Suede","Polyester","Viscose","Silk","Elastane","Nylon"]'::jsonb,'["Памук","Лен","Вълна","Кашмир","Деним","Кожа","Велур","Полиестер","Вискоза","Коприна","Еластан","Найлон"]'::jsonb),
  ('fashion','style','["Casual","Smart Casual","Formal","Streetwear","Sport","Vintage","Boho","Minimalist","Business","Evening"]'::jsonb,'["Ежедневен","Смарт кежуъл","Официален","Уличен","Спортен","Винтидж","Бохо","Минималистичен","Бизнес","Вечерен"]'::jsonb),
  ('fashion','season','["Spring","Summer","Autumn","Winter","All Season"]'::jsonb,'["Пролет","Лято","Есен","Зима","Всички сезони"]'::jsonb),
  ('fashion','pattern','["Solid","Striped","Checked","Floral","Graphic","Animal Print","Camouflage","Polka Dot"]'::jsonb,'["Едноцветен","Раиран","Каре","Флорален","Графичен","Животински принт","Камуфлаж","Точки"]'::jsonb),
  ('fashion','shoe_size_eu','["35","36","37","38","39","40","41","42","43","44","45","46"]'::jsonb,'["35","36","37","38","39","40","41","42","43","44","45","46"]'::jsonb),
  ('fashion','heel_height','["Flat (0-2 cm)","Low (3-5 cm)","Mid (6-8 cm)","High (9-11 cm)","Very High (12+ cm)"]'::jsonb,'["Ниски (0-2 см)","Нисък ток (3-5 см)","Среден ток (6-8 см)","Висок ток (9-11 см)","Много висок ток (12+ см)"]'::jsonb),
  ('fashion','sport_type','["Running","Training","Football","Basketball","Tennis","Hiking","Yoga","Cycling","Lifestyle"]'::jsonb,'["Бягане","Тренировки","Футбол","Баскетбол","Тенис","Туризъм","Йога","Колоездене","Lifestyle"]'::jsonb),
  ('fashion','accessory_type','["Handbag","Backpack","Wallet","Belt","Hat","Scarf","Sunglasses","Gloves","Hair Accessory","Travel Bag"]'::jsonb,'["Чанта","Раница","Портфейл","Колан","Шапка","Шал","Слънчеви очила","Ръкавици","Аксесоар за коса","Пътна чанта"]'::jsonb),
  ('fashion','closure','["Zipper","Button","Magnetic","Buckle","Snap","Drawstring","Velcro","Open Top"]'::jsonb,'["Цип","Копче","Магнит","Катарама","Тик-так","Връзки","Велкро","Отворен тип"]'::jsonb),
  ('fashion','jewelry_type','["Ring","Necklace","Bracelet","Earrings","Pendant","Anklet","Brooch","Set"]'::jsonb,'["Пръстен","Колиe","Гривна","Обеци","Медальон","Гривна за глезен","Брошка","Комплект"]'::jsonb),
  ('fashion','stone_type','["No Stone","Cubic Zirconia","Diamond","Sapphire","Ruby","Emerald","Pearl","Opal","Topaz","Amethyst"]'::jsonb,'["Без камък","Цирконий","Диамант","Сапфир","Рубин","Изумруд","Перла","Опал","Топаз","Аметист"]'::jsonb),
  ('fashion','authenticity','["Verified Authentic","Certificate Included","Receipt Included","Not Verified"]'::jsonb,'["Потвърдена автентичност","Сертификат включен","Касова бележка включена","Непотвърдена"]'::jsonb),
  ('fashion','watch_type','["Analog","Digital","Smartwatch","Automatic","Quartz","Chronograph","Diver"]'::jsonb,'["Аналогов","Дигитален","Смарт часовник","Автоматичен","Кварцов","Хронограф","Дайвър"]'::jsonb),
  ('fashion','band_material','["Stainless Steel","Leather","Silicone","Nylon","Titanium","Ceramic","Rubber","Mesh"]'::jsonb,'["Неръждаема стомана","Кожа","Силикон","Найлон","Титан","Керамика","Каучук","Мрежеста"]'::jsonb),
  ('fashion','case_size','["28 mm","32 mm","36 mm","40 mm","42 mm","44 mm","46 mm","48 mm"]'::jsonb,'["28 мм","32 мм","36 мм","40 мм","42 мм","44 мм","46 мм","48 мм"]'::jsonb),
  ('fashion','water_resistance','["No","30 m","50 m","100 m","200 m","300 m+"]'::jsonb,'["Не","30 м","50 м","100 м","200 м","300 м+"]'::jsonb),
  ('fashion','movement','["Quartz","Automatic","Manual","Solar","Kinetic"]'::jsonb,'["Кварцов","Автоматичен","Ръчен","Соларен","Кинетичен"]'::jsonb),
  ('fashion','gender','["Women","Men","Unisex","Girls","Boys"]'::jsonb,'["Жени","Мъже","Унисекс","Момичета","Момчета"]'::jsonb),
  ('fashion','age_group','["Baby (0-2)","Toddler (2-4)","Kids (4-8)","Junior (8-12)","Teen (13-17)","Adult"]'::jsonb,'["Бебе (0-2)","Малко дете (2-4)","Деца (4-8)","Юноши (8-12)","Тийнейджър (13-17)","Възрастен"]'::jsonb),
  ('fashion','year','["2020","2021","2022","2023","2024","2025","2026"]'::jsonb,'["2020","2021","2022","2023","2024","2025","2026"]'::jsonb);

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

