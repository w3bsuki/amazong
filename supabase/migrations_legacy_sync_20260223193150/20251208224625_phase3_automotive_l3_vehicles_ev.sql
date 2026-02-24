
-- Phase 3.1.6: Automotive Vehicles & EV L3 Categories

-- Electric Cars L3 (parent: ev-cars)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tesla Model S', 'Tesla Model 3', 'Tesla Model Y', 'Tesla Model X', 'BMW i Series', 'Mercedes EQ', 'Audi e-tron', 'Porsche Taycan', 'Volkswagen ID', 'Rivian', 'Lucid Motors', 'Polestar']),
  unnest(ARRAY['ev-tesla-s', 'ev-tesla-3', 'ev-tesla-y', 'ev-tesla-x', 'ev-bmw-i', 'ev-mercedes-eq', 'ev-audi-etron', 'ev-porsche-taycan', 'ev-vw-id', 'ev-rivian', 'ev-lucid', 'ev-polestar']),
  (SELECT id FROM categories WHERE slug = 'ev-cars'),
  unnest(ARRAY['Tesla Model S', 'Tesla Model 3', 'Tesla Model Y', 'Tesla Model X', 'BMW i серия', 'Mercedes EQ', 'Audi e-tron', 'Porsche Taycan', 'Volkswagen ID', 'Rivian', 'Lucid Motors', 'Polestar']),
  '🔌'
ON CONFLICT (slug) DO NOTHING;

-- Electric SUVs L3 (parent: ev-suvs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tesla Model X SUV', 'Tesla Model Y SUV', 'BMW iX', 'Mercedes EQS SUV', 'Audi Q4 e-tron', 'Audi Q8 e-tron', 'Volvo EX90', 'Kia EV9', 'Hyundai Ioniq 7', 'Ford Mustang Mach-E']),
  unnest(ARRAY['ev-suv-tesla-x', 'ev-suv-tesla-y', 'ev-suv-bmw-ix', 'ev-suv-merc-eqs', 'ev-suv-audi-q4', 'ev-suv-audi-q8', 'ev-suv-volvo-ex90', 'ev-suv-kia-ev9', 'ev-suv-ioniq7', 'ev-suv-mach-e']),
  (SELECT id FROM categories WHERE slug = 'ev-suvs'),
  unnest(ARRAY['Tesla Model X SUV', 'Tesla Model Y SUV', 'BMW iX', 'Mercedes EQS SUV', 'Audi Q4 e-tron', 'Audi Q8 e-tron', 'Volvo EX90', 'Kia EV9', 'Hyundai Ioniq 7', 'Ford Mustang Mach-E']),
  '🚙'
ON CONFLICT (slug) DO NOTHING;

-- Electric Trucks L3 (parent: ev-trucks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tesla Cybertruck', 'Rivian R1T', 'Ford F-150 Lightning', 'Chevrolet Silverado EV', 'GMC Hummer EV', 'RAM 1500 REV']),
  unnest(ARRAY['ev-truck-cybertruck', 'ev-truck-rivian-r1t', 'ev-truck-f150', 'ev-truck-silverado', 'ev-truck-hummer', 'ev-truck-ram']),
  (SELECT id FROM categories WHERE slug = 'ev-trucks'),
  unnest(ARRAY['Tesla Cybertruck', 'Rivian R1T', 'Ford F-150 Lightning', 'Chevrolet Silverado EV', 'GMC Hummer EV', 'RAM 1500 REV']),
  '🛻'
ON CONFLICT (slug) DO NOTHING;

-- Electric Vans L3 (parent: ev-vans)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Mercedes eSprinter', 'Ford E-Transit', 'Rivian EDV', 'Volkswagen ID.Buzz', 'Canoo LDV', 'BrightDrop Zevo']),
  unnest(ARRAY['ev-van-esprinter', 'ev-van-etransit', 'ev-van-rivian', 'ev-van-idbuzz', 'ev-van-canoo', 'ev-van-brightdrop']),
  (SELECT id FROM categories WHERE slug = 'ev-vans'),
  unnest(ARRAY['Mercedes eSprinter', 'Ford E-Transit', 'Rivian EDV', 'Volkswagen ID.Buzz', 'Canoo LDV', 'BrightDrop Zevo']),
  '🚐'
ON CONFLICT (slug) DO NOTHING;

-- Hybrid Vehicles L3 (parent: hybrid-vehicles)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Toyota Prius', 'Honda Accord Hybrid', 'Hyundai Sonata Hybrid', 'Toyota Camry Hybrid', 'Toyota RAV4 Prime', 'Lexus Hybrid', 'BMW Plug-in Hybrid', 'Volvo Plug-in Hybrid']),
  unnest(ARRAY['hybrid-prius', 'hybrid-accord', 'hybrid-sonata', 'hybrid-camry', 'hybrid-rav4-prime', 'hybrid-lexus', 'hybrid-bmw-phev', 'hybrid-volvo-phev']),
  (SELECT id FROM categories WHERE slug = 'hybrid-vehicles'),
  unnest(ARRAY['Toyota Prius', 'Honda Accord Hybrid', 'Hyundai Sonata Hybrid', 'Toyota Camry Hybrid', 'Toyota RAV4 Prime', 'Lexus Hybrid', 'BMW Plug-in Hybrid', 'Volvo Plug-in Hybrid']),
  '🔋'
ON CONFLICT (slug) DO NOTHING;

-- Home Chargers L3 (parent: ev-charger-home)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Level 1 Chargers', 'Level 2 Chargers', 'Smart Chargers', 'Hardwired Chargers', 'Plug-In Chargers', 'Tesla Wall Connector', 'ChargePoint Home']),
  unnest(ARRAY['charger-level1', 'charger-level2', 'charger-smart', 'charger-hardwired', 'charger-plug-in', 'charger-tesla-wall', 'charger-chargepoint']),
  (SELECT id FROM categories WHERE slug = 'ev-charger-home'),
  unnest(ARRAY['Level 1 зарядни', 'Level 2 зарядни', 'Смарт зарядни', 'Монтажни зарядни', 'Plug-In зарядни', 'Tesla Wall Connector', 'ChargePoint Home']),
  '🔌'
ON CONFLICT (slug) DO NOTHING;

-- Portable Chargers L3 (parent: ev-charger-portable)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Mobile Chargers', 'Emergency Chargers', 'Travel Chargers', 'Camping Chargers', 'Solar Compatible']),
  unnest(ARRAY['charger-mobile', 'charger-emergency', 'charger-travel', 'charger-camping', 'charger-solar']),
  (SELECT id FROM categories WHERE slug = 'ev-charger-portable'),
  unnest(ARRAY['Мобилни зарядни', 'Аварийни зарядни', 'Пътни зарядни', 'Къмпинг зарядни', 'Съвместими със соларни']),
  '🔌'
ON CONFLICT (slug) DO NOTHING;

-- Commercial Chargers L3 (parent: ev-charger-commercial)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['DC Fast Chargers', 'Level 3 Chargers', 'Fleet Chargers', 'Multi-Port Chargers', 'Payment Enabled']),
  unnest(ARRAY['charger-dc-fast', 'charger-level3', 'charger-fleet', 'charger-multi-port', 'charger-payment']),
  (SELECT id FROM categories WHERE slug = 'ev-charger-commercial'),
  unnest(ARRAY['DC бързи зарядни', 'Level 3 зарядни', 'Флотни зарядни', 'Многопортови', 'С плащане']),
  '⚡'
ON CONFLICT (slug) DO NOTHING;

-- EV Batteries L3 (parent: ev-batteries)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Lithium-Ion Packs', '12V Auxiliary Batteries', 'Battery Management Systems', 'Battery Modules', 'Reconditioned Batteries']),
  unnest(ARRAY['ev-battery-lithium', 'ev-battery-12v', 'ev-battery-bms', 'ev-battery-modules', 'ev-battery-refurb']),
  (SELECT id FROM categories WHERE slug = 'ev-batteries'),
  unnest(ARRAY['Литиево-йонни', '12V спомагателни', 'BMS системи', 'Модули', 'Реновирани']),
  '🔋'
ON CONFLICT (slug) DO NOTHING;

-- EV Accessories Interior L3 (parent: ev-interior-acc)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['EV Screen Protectors', 'EV Center Console Covers', 'EV Floor Mats', 'EV Seat Covers', 'Frunk Organizers', 'Sub-Trunk Organizers']),
  unnest(ARRAY['ev-acc-screen', 'ev-acc-console', 'ev-acc-mats', 'ev-acc-seats', 'ev-acc-frunk', 'ev-acc-subtrunk']),
  (SELECT id FROM categories WHERE slug = 'ev-interior-acc'),
  unnest(ARRAY['Протектори екран', 'Покривала конзола', 'Стелки', 'Калъфи седалки', 'Организатори фрънк', 'Организатори багажник']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- EV Accessories Exterior L3 (parent: ev-exterior-acc)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['EV Wheel Covers', 'EV Spoilers', 'EV Aero Kits', 'EV Charge Port Covers', 'EV Roof Racks']),
  unnest(ARRAY['ev-ext-wheel-covers', 'ev-ext-spoilers', 'ev-ext-aero', 'ev-ext-port-covers', 'ev-ext-roof-racks']),
  (SELECT id FROM categories WHERE slug = 'ev-exterior-acc'),
  unnest(ARRAY['Тасове', 'Спойлери', 'Аеро китове', 'Капаци порт', 'Багажници']),
  '🚗'
ON CONFLICT (slug) DO NOTHING;

-- SUVs & Crossovers L3 (parent: suvs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Compact SUVs', 'Mid-Size SUVs', 'Full-Size SUVs', 'Luxury SUVs', 'Off-Road SUVs', '3-Row SUVs']),
  unnest(ARRAY['suv-compact', 'suv-mid-size', 'suv-full-size', 'suv-luxury', 'suv-offroad', 'suv-3-row']),
  (SELECT id FROM categories WHERE slug = 'suvs'),
  unnest(ARRAY['Компактни SUV', 'Среден клас SUV', 'Пълноразмерни SUV', 'Луксозни SUV', 'Офроуд SUV', '3-редови SUV']),
  '🚙'
ON CONFLICT (slug) DO NOTHING;

-- Trucks L3 (parent: trucks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Compact Trucks', 'Mid-Size Trucks', 'Full-Size Trucks', 'Heavy Duty Trucks', 'Work Trucks', 'Off-Road Trucks']),
  unnest(ARRAY['truck-compact', 'truck-mid-size', 'truck-full-size', 'truck-heavy-duty', 'truck-work', 'truck-offroad']),
  (SELECT id FROM categories WHERE slug = 'trucks'),
  unnest(ARRAY['Компактни пикапи', 'Среден клас пикапи', 'Пълноразмерни пикапи', 'Тежкотоварни', 'Работни пикапи', 'Офроуд пикапи']),
  '🛻'
ON CONFLICT (slug) DO NOTHING;

-- Vans & Buses L3 (parent: vans-buses)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cargo Vans', 'Passenger Vans', 'Minivans', 'Conversion Vans', 'Camper Vans', 'Sprinter Vans']),
  unnest(ARRAY['van-cargo', 'van-passenger', 'van-mini', 'van-conversion', 'van-camper', 'van-sprinter']),
  (SELECT id FROM categories WHERE slug = 'vans-buses'),
  unnest(ARRAY['Товарни вани', 'Пътнически вани', 'Миниване', 'Преустроени вани', 'Кемпер вани', 'Sprinter вани']),
  '🚐'
ON CONFLICT (slug) DO NOTHING;
;
