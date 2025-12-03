# 🚗 Automotive | Автомобили

**Category Slug:** `automotive`  
**Icon:** 🚗  
**Status:** ✅ Production Ready  
**Last Updated:** December 2, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Vehicles → Cars |
| **Attributes** | Filtering, Search, Campaigns | Make, Model, Year, Fuel |
| **Tags** | Dynamic Collections & SEO | "luxury", "family", "eco" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🚗 Automotive (L0)
│
├── 🚘 Vehicles (L1)
│   ├── Cars (L2)
│   ├── SUVs & Crossovers (L2)
│   ├── Motorcycles (L2)
│   ├── Trucks & Pickups (L2)
│   ├── Vans & Buses (L2)
│   ├── Campers & Caravans (L2)
│   ├── Boats & Watercraft (L2)
│   ├── ATVs & Quads (L2)
│   ├── Agricultural & Construction (L2)
│   └── Trailers (L2)
│
├── 🔧 Parts & Components (L1)
│   ├── Engine & Drivetrain (L2)
│   ├── Brakes & Suspension (L2)
│   ├── Body & Exterior (L2)
│   ├── Interior (L2)
│   ├── Electrical & Lighting (L2)
│   ├── Wheels & Tires (L2)
│   ├── Exhaust & Emissions (L2)
│   ├── Cooling & Heating (L2)
│   ├── Transmission & Clutch (L2)
│   └── Filters & Maintenance (L2)
│
├── 🎨 Accessories (L1)
│   ├── Electronics & Audio (L2)
│   ├── Interior Accessories (L2)
│   ├── Exterior Accessories (L2)
│   ├── Performance & Tuning (L2)
│   ├── Car Care & Detailing (L2)
│   ├── Cargo & Storage (L2)
│   ├── Safety & Security (L2)
│   └── Tools & Equipment (L2)
│
└── 🛠️ Services (L1)
    ├── Repair & Maintenance (L2)
    ├── Detailing & Appearance (L2)
    ├── Tuning & Performance (L2)
    └── Transport & Logistics (L2)
```

**Total Categories: 1 (L0) + 4 (L1) + 32 (L2) = 37 categories**

---

## 📊 Complete Category Reference

### L1: 🚘 VEHICLES

#### L2: Cars | Коли
**Slug:** `vehicles/cars`  
**Description:** Passenger cars of all body types.

**Body Types (Attribute, not subcategory):**

| EN | BG | Description |
|----|----|----|
| Sedan | Седан | 4-door, separate trunk |
| Hatchback | Хечбек | 3/5-door, integrated trunk |
| Wagon/Estate | Комби | Extended cargo area |
| Coupe | Купе | 2-door, sporty |
| Convertible | Кабрио | Open top |
| Liftback | Лифтбек | Sedan/hatch hybrid |

---

#### L2: SUVs & Crossovers | Джипове и Кросоувъри
**Slug:** `vehicles/suvs-crossovers`

**Body Types (Attribute):**

| EN | BG | Description |
|----|----|----|
| Compact SUV | Компактен SUV | Small crossover (Qashqai, Tucson) |
| Mid-Size SUV | Среден SUV | Family size (X3, GLC) |
| Full-Size SUV | Голям SUV | Large (X5, GLE, Land Cruiser) |
| Off-Road SUV | Офроуд | True 4x4 (Wrangler, Defender) |

---

#### L2: Motorcycles | Мотоциклети
**Slug:** `vehicles/motorcycles`

**Body Types (Attribute):**

| EN | BG | Description |
|----|----|----|
| Sport | Спортен | Racing-style (CBR, R1, Panigale) |
| Naked/Streetfighter | Нейкид | Upright, no fairing |
| Cruiser | Круизър | Relaxed position (Harley) |
| Touring | Туринг | Long-distance comfort |
| Adventure/Enduro | Ендуро | On/off-road capable |
| Chopper/Custom | Чопър | Custom built |
| Scooter | Скутер | Step-through, automatic |
| Moped | Мопед | Under 50cc |
| Dirt/Motocross | Кросов | Off-road only |

---

#### L2: Trucks & Pickups | Камиони и Пикапи
**Slug:** `vehicles/trucks-pickups`

**Body Types (Attribute):**

| EN | BG | Description |
|----|----|----|
| Pickup | Пикап | Open bed (Hilux, Ranger) |
| Light Truck | Лек камион | Up to 3.5t |
| Heavy Truck | Тежък камион | Over 3.5t |
| Flatbed | Платформа | Flat cargo area |
| Box Truck | Фургон | Enclosed cargo |

---

#### L2: Vans & Buses | Бусове и Автобуси
**Slug:** `vehicles/vans-buses`

**Body Types (Attribute):**

| EN | BG | Description |
|----|----|----|
| Minivan | Миниван | Family MPV (Touran, Scenic) |
| Cargo Van | Товарен бус | Delivery (Sprinter, Transit) |
| Passenger Van | Пътнически бус | People mover |
| Minibus | Минибус | 9-20 seats |
| Bus | Автобус | 20+ seats |

---

#### L2: Campers & Caravans | Кемпери и Каравани
**Slug:** `vehicles/campers-caravans`

| EN | BG | Description |
|----|----|----|
| Motorhome | Кемпер | Self-propelled |
| Caravan | Каравана | Towed, large |
| Camper Van | Кемпер бус | Van conversion |

---

#### L2: Boats & Watercraft | Лодки и Джетове
**Slug:** `vehicles/boats-watercraft`

| EN | BG | Description |
|----|----|----|
| Motorboat | Моторна лодка | Engine-powered |
| Sailboat | Платноходка | Wind-powered |
| Yacht | Яхта | Luxury vessel |
| Jet Ski | Джет | Personal watercraft |
| Inflatable | Надуваема лодка | RIB, dinghy |
| Fishing Boat | Риболовна лодка | For fishing |
| Kayak/Canoe | Каяк/Кану | Paddle-powered |

---

#### L2: ATVs & Quads | АТВ и Бъгита
**Slug:** `vehicles/atvs-quads`

| EN | BG | Description |
|----|----|----|
| ATV/Quad | АТВ/Квад | Four-wheeler |
| UTV/Side-by-Side | UTV/Бъги | Multi-seat |
| Go-Kart | Картинг | Racing kart |
| Snowmobile | Снегоход | Snow vehicle |

---

#### L2: Agricultural & Construction | Земеделска и Строителна техника
**Slug:** `vehicles/agricultural-construction`

| EN | BG | Description |
|----|----|----|
| Tractor | Трактор | Farm tractor |
| Excavator | Багер | Digging machine |
| Forklift | Мотокар | Warehouse lift |
| Loader | Товарач | Front loader |
| Combine | Комбайн | Harvester |

---

#### L2: Trailers | Ремаркета
**Slug:** `vehicles/trailers`

| EN | BG | Description |
|----|----|----|
| Car Trailer | Автовоз | Vehicle transport |
| Cargo Trailer | Товарно | General cargo |
| Motorcycle Trailer | За мотор | Bike transport |
| Boat Trailer | За лодка | Watercraft |
| Box Trailer | Фургон | Enclosed |

---

### L1: 🔧 PARTS & COMPONENTS

#### L2: Engine & Drivetrain | Двигател и Задвижване
**Slug:** `parts/engine-drivetrain`

**Part Types:**
- Complete Engines | Цели двигатели
- Cylinder Heads | Глави
- Pistons & Rings | Бутала и сегменти
- Crankshafts | Колянови валове
- Camshafts | Разпределителни валове
- Timing Components | Ангренаж
- Engine Mounts | Тампони
- Oil Pumps | Маслени помпи
- Turbochargers | Турбини
- Superchargers | Компресори
- Intake Manifolds | Всмукателен колектор
- Fuel Injectors | Дюзи
- Fuel Pumps | Горивни помпи
- Carburetors | Карбуратори
- Throttle Bodies | Дросели

---

#### L2: Brakes & Suspension | Спирачки и Окачване
**Slug:** `parts/brakes-suspension`

**Part Types:**
- Brake Pads | Накладки
- Brake Discs/Rotors | Дискове
- Brake Calipers | Апарати
- Brake Lines | Маркучи
- Master Cylinders | Спирачни помпи
- ABS Components | ABS компоненти
- Shock Absorbers | Амортисьори
- Springs | Пружини
- Coilovers | Койловери
- Control Arms | Носачи
- Ball Joints | Шарнири
- Tie Rods | Кормилни накрайници
- Sway Bars | Стабилизатори
- Bushings | Селенблокове
- Wheel Bearings | Лагери

---

#### L2: Body & Exterior | Каросерия и Екстериор
**Slug:** `parts/body-exterior`

**Part Types:**
- Bumpers | Брони
- Fenders | Калници
- Hoods | Капаци
- Doors | Врати
- Mirrors | Огледала
- Grilles | Решетки
- Spoilers | Спойлери
- Side Skirts | Прагове
- Windshields | Предни стъкла
- Windows | Стъкла
- Body Kits | Боди китове
- Emblems & Badges | Емблеми
- Weatherstripping | Уплътнения

---

#### L2: Interior | Интериор
**Slug:** `parts/interior`

**Part Types:**
- Seats | Седалки
- Steering Wheels | Волани
- Dashboards | Табла
- Door Panels | Тапицерия врати
- Center Consoles | Конзоли
- Headliners | Тавани
- Floor Mats | Стелки
- Shift Knobs | Топки за скорости
- Pedals | Педали
- Gauges & Clusters | Табла с уреди

---

#### L2: Electrical & Lighting | Електрика и Осветление
**Slug:** `parts/electrical-lighting`

**Part Types:**
- Batteries | Акумулатори
- Alternators | Алтернатори
- Starters | Стартери
- Ignition Coils | Бобини
- Spark Plugs | Свещи
- Wiring Harnesses | Инсталации
- Sensors | Датчици
- ECU/Computers | Компютри
- Relays & Fuses | Релета и предпазители
- Headlights | Фарове
- Tail Lights | Стопове
- Fog Lights | Халогени
- Turn Signals | Мигачи
- LED Bulbs | LED крушки
- HID/Xenon | Ксенон

---

#### L2: Wheels & Tires | Джанти и Гуми
**Slug:** `parts/wheels-tires`

**Part Types:**
- Alloy Wheels | Алуминиеви джанти
- Steel Wheels | Метални джанти
- Summer Tires | Летни гуми
- Winter Tires | Зимни гуми
- All-Season Tires | Всесезонни гуми
- Performance Tires | Спортни гуми
- Off-Road Tires | Офроуд гуми
- Wheel Spacers | Фланци
- Lug Nuts | Болтове
- Center Caps | Капачки
- TPMS Sensors | Датчици за налягане

---

#### L2: Exhaust & Emissions | Ауспуси и Емисии
**Slug:** `parts/exhaust-emissions`

**Part Types:**
- Complete Exhaust Systems | Цели системи
- Mufflers | Заглушители
- Catalytic Converters | Катализатори
- DPF Filters | DPF филтри
- Headers/Manifolds | Гърнета
- Downpipes | Даунпайпове
- Exhaust Tips | Накрайници
- O2 Sensors | Ламбда сонди
- EGR Valves | EGR клапи

---

#### L2: Cooling & Heating | Охлаждане и Отопление
**Slug:** `parts/cooling-heating`

**Part Types:**
- Radiators | Радиатори
- Water Pumps | Водни помпи
- Thermostats | Термостати
- Fans | Вентилатори
- Coolant Hoses | Маркучи
- Heater Cores | Отоплители
- AC Compressors | Климатични компресори
- Condensers | Кондензатори
- Evaporators | Изпарители
- Blower Motors | Вентилатори на печка
- Intercoolers | Интеркулери

---

#### L2: Transmission & Clutch | Скоростна кутия и Съединител
**Slug:** `parts/transmission-clutch`

**Part Types:**
- Complete Transmissions | Скоростни кутии
- Clutch Kits | Съединители
- Flywheels | Маховици
- Gearbox Parts | Части за кутия
- Differentials | Диференциали
- CV Joints/Axles | Полуоски
- Transfer Cases | Раздатки
- Shift Cables | Жила
- Torque Converters | Хидротрансформатори

---

#### L2: Filters & Maintenance | Филтри и Поддръжка
**Slug:** `parts/filters-maintenance`

**Part Types:**
- Oil Filters | Маслени филтри
- Air Filters | Въздушни филтри
- Fuel Filters | Горивни филтри
- Cabin Filters | Поленови филтри
- Oil | Масла
- Antifreeze | Антифриз
- Brake Fluid | Спирачна течност
- Transmission Fluid | Масло за скоростна кутия
- Wiper Blades | Чистачки

---

### L1: 🎨 ACCESSORIES

#### L2: Electronics & Audio | Електроника и Аудио
**Slug:** `accessories/electronics-audio`

- Head Units | Мултимедии
- Speakers | Говорители
- Subwoofers | Субуфери
- Amplifiers | Усилватели
- GPS Navigation | GPS навигация
- Dash Cameras | Видеорегистратори
- Parking Sensors | Парктроници
- Backup Cameras | Камери за заден ход
- Radar Detectors | Антирадари
- Phone Mounts | Стойки за телефон
- USB Chargers | USB зарядни
- Bluetooth Adapters | Bluetooth адаптери
- OBD2 Scanners | Диагностика OBD2

---

#### L2: Interior Accessories | Интериорни аксесоари
**Slug:** `accessories/interior`

- Floor Mats | Стелки
- Seat Covers | Калъфи за седалки
- Steering Wheel Covers | Калъфи за волан
- Sunshades | Сенници
- Organizers | Органайзери
- Phone Holders | Държачи за телефон
- Air Fresheners | Ароматизатори
- Cushions | Възглавници

---

#### L2: Exterior Accessories | Екстериорни аксесоари
**Slug:** `accessories/exterior`

- Roof Racks | Багажници
- Roof Boxes | Кутии за багажник
- Bike Racks | Стойки за велосипеди
- Tow Bars | Теглички
- Mud Flaps | Калобрани
- Wind Deflectors | Ветробрани
- Car Covers | Покривала
- License Plate Frames | Рамки за номера
- Decals & Stickers | Стикери

---

#### L2: Performance & Tuning | Тунинг и Перформанс
**Slug:** `accessories/performance-tuning`

- Cold Air Intakes | Спортни филтри
- Performance Exhausts | Спортни ауспуси
- ECU Tuning | Чип тунинг
- Turbo Kits | Турбо китове
- Supercharger Kits | Компресорни китове
- Lowering Springs | Пружини за сваляне
- Coilovers | Койловери
- Big Brake Kits | Големи спирачки
- Short Shifters | Къси скорости
- Strut Bars | Разпънки
- Racing Seats | Спортни седалки
- Roll Cages | Ролбарове
- Gauges | Уреди

---

#### L2: Car Care & Detailing | Грижа за автомобила
**Slug:** `accessories/car-care`

- Car Shampoo | Автошампоан
- Wax & Polish | Вакса и полир
- Ceramic Coating | Керамично покритие
- Interior Cleaners | Почистващи за интериор
- Leather Care | Грижа за кожа
- Glass Cleaners | Почистващи за стъкла
- Tire Shine | Гланц за гуми
- Wheel Cleaners | Почистващи за джанти
- Microfiber Cloths | Микрофибърни кърпи
- Polishing Machines | Полиращи машини
- Pressure Washers | Водоструйки

---

#### L2: Cargo & Storage | Багаж и Съхранение
**Slug:** `accessories/cargo-storage`

- Roof Boxes | Кутии за покрив
- Cargo Nets | Мрежи за багаж
- Trunk Organizers | Органайзери за багажник
- Cargo Liners | Подложки за багажник
- Tie-Down Straps | Колани за багаж
- Hitch Carriers | Багажници за теглич

---

#### L2: Safety & Security | Безопасност и Сигурност
**Slug:** `accessories/safety-security`

- Car Alarms | Автоаларми
- GPS Trackers | GPS тракери
- Steering Wheel Locks | Блокатори за волан
- Dash Cameras | Камери
- First Aid Kits | Аптечки
- Fire Extinguishers | Пожарогасители
- Warning Triangles | Триъгълници
- Safety Vests | Светлоотразителни жилетки
- Jump Starters | Стартери
- Child Car Seats | Детски столчета

---

#### L2: Tools & Equipment | Инструменти и Оборудване
**Slug:** `accessories/tools-equipment`

- Jack & Stands | Крикове и стойки
- Tool Sets | Комплекти инструменти
- Torque Wrenches | Динамометрични ключове
- Impact Wrenches | Гайковерти
- Diagnostic Tools | Диагностика
- Battery Chargers | Зарядни за акумулатор
- Air Compressors | Компресори
- Work Lights | Работни лампи

---

### L1: 🛠️ SERVICES

#### L2: Repair & Maintenance | Ремонт и Поддръжка
**Slug:** `services/repair-maintenance`

- Diagnostics | Диагностика
- Oil Change | Смяна на масло
- Brake Service | Спирачки
- Tire Service | Гуми
- Suspension Repair | Окачване
- Engine Repair | Ремонт на двигател
- Transmission Service | Скоростна кутия
- Electrical Repair | Електрика
- AC Service | Климатик
- Exhaust Repair | Ауспух
- Inspection | Технически преглед

---

#### L2: Detailing & Appearance | Детайлинг и Визия
**Slug:** `services/detailing-appearance`

- Full Detail | Цялостно почистване
- Exterior Wash | Външно измиване
- Interior Cleaning | Вътрешно почистване
- Paint Correction | Полиране
- Ceramic Coating | Керамично покритие
- PPF Installation | Защитно фолио
- Window Tinting | Затъмняване на стъкла
- Vinyl Wrapping | Облепяне
- Headlight Restoration | Полиране на фарове
- Dent Removal | Изправяне на вдлъбнатини

---

#### L2: Tuning & Performance | Тунинг и Перформанс
**Slug:** `services/tuning-performance`

- ECU Tuning | Чип тунинг
- Dyno Testing | Мощностен тест
- Turbo Installation | Монтаж на турбо
- Exhaust Installation | Монтаж на ауспух
- Suspension Setup | Настройка на окачване
- Brake Upgrades | Подобрение на спирачки
- Engine Building | Изграждане на двигател
- Audio Installation | Аудио инсталация

---

#### L2: Transport & Logistics | Транспорт и Логистика
**Slug:** `services/transport-logistics`

- Vehicle Transport | Транспорт на автомобили
- Towing | Пътна помощ
- Import/Export | Внос/Износ
- Storage | Съхранение
- Vehicle Inspection | Оглед на автомобил
- Registration Services | Регистрация

---

## 🏷️ Attribute System (The Power Layer)

### Vehicle Attributes Schema

```typescript
interface VehicleProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "vehicles/cars"
  
  // === BASIC INFO ===
  title: string;                 // "BMW 320d M Sport"
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === VEHICLE IDENTIFICATION ===
  make: string;                  // "BMW"
  model: string;                 // "3 Series"
  variant: string;               // "320d M Sport"
  year: number;                  // 2020
  vin?: string;                  // Vehicle ID Number
  
  // === SPECIFICATIONS ===
  body_type: BodyType;
  fuel_type: FuelType;
  transmission: TransmissionType;
  drivetrain: DrivetrainType;
  engine_size: string;           // "2.0L", "3000cc"
  horsepower: number;            // 190
  torque?: number;               // 400 Nm
  
  // === CONDITION & HISTORY ===
  condition: VehicleCondition;
  mileage: number;
  mileage_unit: 'km' | 'mi';
  first_registration: string;    // "2020-03"
  service_history: boolean;
  accident_free: boolean;
  owners_count?: number;
  country_of_origin?: string;
  
  // === APPEARANCE ===
  exterior_color: string;
  interior_color?: string;
  interior_material?: string;    // "Leather", "Fabric"
  
  // === DIMENSIONS ===
  doors: number;
  seats: number;
  
  // === FEATURES (Arrays) ===
  comfort_features: string[];    // ["Climate Control", "Heated Seats"]
  safety_features: string[];     // ["ABS", "ESP", "Airbags"]
  multimedia_features: string[]; // ["Navigation", "Bluetooth"]
  exterior_features: string[];   // ["LED Lights", "Sunroof"]
  
  // === DOCUMENTS ===
  registration_status: 'registered' | 'deregistered' | 'export';
  inspection_valid_until?: string;
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer';
  location_city: string;
  location_region: string;
  
  // === LISTING META ===
  images: string[];
  video_url?: string;
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS (Auto-generated for campaigns) ===
  tags: string[];                // ["luxury", "diesel", "german"]
}

// === ENUMS ===

type BodyType = 
  | 'sedan' | 'hatchback' | 'wagon' | 'coupe' | 'convertible' | 'liftback'
  | 'suv' | 'crossover' | 'offroad'
  | 'pickup' | 'van' | 'minivan' | 'bus'
  | 'sport' | 'naked' | 'cruiser' | 'touring' | 'enduro' | 'scooter' | 'chopper';

type FuelType = 
  | 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'plug_in_hybrid'
  | 'lpg' | 'cng' | 'hydrogen';

type TransmissionType = 
  | 'manual' | 'automatic' | 'semi_automatic' | 'cvt' | 'dct' | 'single_speed';

type DrivetrainType = 
  | 'fwd' | 'rwd' | 'awd' | '4x4';

type VehicleCondition = 
  | 'new' | 'used' | 'certified_preowned' | 'salvage' | 'for_parts';
```

### Parts Attributes Schema

```typescript
interface PartProduct {
  id: string;
  category_id: string;
  
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  
  // === PART IDENTIFICATION ===
  brand: string;                 // "Brembo"
  part_number: string;           // "P06073"
  oem_number?: string;           // "34116860016"
  
  // === COMPATIBILITY ===
  compatible_makes: string[];    // ["BMW", "Mini"]
  compatible_models: string[];   // ["3 Series", "4 Series"]
  compatible_years: {
    from: number;
    to: number;
  };
  position?: 'front' | 'rear' | 'left' | 'right' | 'all';
  
  // === CONDITION ===
  condition: PartCondition;
  warranty?: string;
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer' | 'wholesaler';
  location_city: string;
  
  images: string[];
  quantity_available: number;
  shipping_available: boolean;
}

type PartCondition = 
  | 'new' | 'new_oem' | 'new_aftermarket' | 'used' | 'refurbished' | 'for_parts';
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "German Engineering" Campaign
-- Using slug-based lookups (UUID compatible)
SELECT * FROM products 
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('cars', 'suvs-crossovers', 'motorcycles'))
AND attributes->>'make' IN ('BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Volkswagen');

-- 🏷️ "Eco-Friendly Vehicles" Campaign  
SELECT * FROM products 
WHERE category_id IN (SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = 'vehicles'))
AND attributes->>'fuel_type' IN ('electric', 'hybrid', 'plug_in_hybrid');

-- 🏷️ "Family Cars Under 30,000 лв" Campaign
SELECT * FROM products 
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('cars', 'suvs-crossovers'))
AND (attributes->>'seats')::int >= 5 
AND price <= 30000;

-- 🏷️ "Luxury SUVs" Campaign
SELECT * FROM products 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'suvs-crossovers')
AND attributes->>'make' IN ('BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Land Rover')
AND price >= 50000;

-- 🏷️ "Low Mileage Used Cars" 
SELECT * FROM products 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'cars')
AND attributes->>'condition' = 'used'
AND (attributes->>'mileage')::int < 50000;
```

### PostgREST/Supabase Filter Examples

```typescript
// Using supabase-js client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Find BMW cars using JSONB containment
const { data: bmwCars } = await supabase
  .from('products')
  .select('*, categories(name, slug)')
  .contains('attributes', { make: 'BMW' })
  .eq('categories.slug', 'cars');

// Combined filter: Electric SUVs under 50k
const { data: electricSuvs } = await supabase
  .from('products')
  .select('*')
  .contains('attributes', { fuel_type: 'electric' })
  .lte('price', 50000)
  .eq('category_id', SUV_CATEGORY_UUID);

// Filter with shipping
const { data: euroShipping } = await supabase
  .from('products')
  .select('*')
  .contains('attributes', { make: 'Audi' })
  .or('ships_to_europe.eq.true,ships_to_worldwide.eq.true');
```

### Search Filter Configuration

```typescript
const vehicleFilters = {
  // Price & Location (Always visible)
  price: { type: 'range', min: 0, max: 500000, step: 1000 },
  location: { type: 'location', regions: bulgarianRegions },
  
  // Main Filters
  make: { type: 'searchable-select', options: vehicleMakes },
  model: { type: 'searchable-select', dependsOn: 'make' },
  year: { type: 'range', min: 1990, max: 2026 },
  
  // Specifications
  body_type: { type: 'multi-select' },
  fuel_type: { type: 'multi-select' },
  transmission: { type: 'multi-select' },
  drivetrain: { type: 'multi-select' },
  
  // Condition
  mileage: { type: 'range', max: 500000, step: 10000 },
  condition: { type: 'multi-select' },
  
  // Appearance
  exterior_color: { type: 'color-picker' },
  
  // Other
  seller_type: { type: 'radio', options: ['all', 'private', 'dealer'] },
};

const partFilters = {
  price: { type: 'range' },
  brand: { type: 'searchable-select' },
  condition: { type: 'multi-select' },
  
  // Compatibility Finder
  vehicle_make: { type: 'select' },
  vehicle_model: { type: 'select', dependsOn: 'vehicle_make' },
  vehicle_year: { type: 'select' },
  
  shipping: { type: 'checkbox', label: 'Ships to me' },
};
```

---

## 🗃️ Database Schema (Supabase)

### Categories Table

> **Note:** The actual schema uses UUID for `id`. The fields below show the logical structure.

```sql
-- Existing table structure (UUID primary key)
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bg TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.categories(id),
  icon TEXT,
  image_url TEXT,
  description TEXT,
  description_bg TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_display_order ON public.categories(display_order);
```

### Vehicle Makes & Models (Optional Enhancement)

```sql
-- Optional: Dedicated makes/models table for autocomplete
CREATE TABLE public.vehicle_makes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  country TEXT,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE public.vehicle_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make_id UUID REFERENCES public.vehicle_makes(id),
  name TEXT NOT NULL,
  body_types TEXT[],
  year_start INTEGER,
  year_end INTEGER,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_models_make ON public.vehicle_models(make_id);
```

### Products with JSONB Attributes

```sql
-- Products table has JSONB attributes column for filtering
-- Added by migration: 20251203000000_product_attributes_and_display_order.sql

-- GIN index for containment queries
CREATE INDEX idx_products_attributes ON public.products USING GIN (attributes);

-- Example queries using PostgREST:

-- Find all BMW SUVs
-- supabase.from('products').contains('attributes', { make: 'BMW' })
SELECT * FROM products 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'suvs-crossovers')
AND attributes->>'make' = 'BMW';

-- Find diesel cars from 2018-2022
SELECT * FROM products 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'cars')
AND attributes->>'fuel_type' = 'diesel'
AND (attributes->>'year')::int BETWEEN 2018 AND 2022;

-- Find parts compatible with BMW 3 Series
SELECT * FROM products 
WHERE category_id IN (SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = 'parts'))
AND attributes->'compatible_makes' ? 'BMW'
AND attributes->'compatible_models' ? '3 Series';
```

---

## 📥 Category Seed Data

> **⚠️ Important:** Categories use UUID primary keys (auto-generated).
> Use slug-based subqueries for parent_id references.

```sql
-- ============================================
-- AUTOMOTIVE CATEGORIES SEED DATA
-- Uses UUID (auto-generated) + slug-based parent lookups
-- Compatible with existing Supabase schema
-- ============================================

-- L0: Root (if not already exists)
INSERT INTO public.categories (name, name_bg, slug, icon, display_order)
VALUES ('Automotive', 'Автомобили', 'automotive', '🚗', 1)
ON CONFLICT (slug) DO NOTHING;

-- L1: Main Sections
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Vehicles', 'Превозни средства', 'vehicles', 
       (SELECT id FROM public.categories WHERE slug = 'automotive'), '🚘', 1
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'vehicles');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Parts & Components', 'Части и компоненти', 'parts', 
       (SELECT id FROM public.categories WHERE slug = 'automotive'), '🔧', 2
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'parts');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Accessories', 'Аксесоари', 'auto-accessories-main', 
       (SELECT id FROM public.categories WHERE slug = 'automotive'), '🎨', 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'auto-accessories-main');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Services', 'Услуги', 'auto-services', 
       (SELECT id FROM public.categories WHERE slug = 'automotive'), '🛠️', 4
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'auto-services');

-- L2: Vehicles Subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cars', 'Коли', 'cars', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🚗', 1
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'cars');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'SUVs & Crossovers', 'Джипове и кросоувъри', 'suvs-crossovers', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🚙', 2
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'suvs-crossovers');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Motorcycles', 'Мотоциклети', 'motorcycles', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🏍️', 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'motorcycles');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Trucks & Pickups', 'Камиони и пикапи', 'trucks-pickups', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🛻', 4
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'trucks-pickups');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Vans & Buses', 'Бусове и автобуси', 'vans-buses', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🚐', 5
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'vans-buses');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Campers & Caravans', 'Кемпери и каравани', 'campers-caravans', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🏕️', 6
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'campers-caravans');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Boats & Watercraft', 'Лодки и джетове', 'boats-watercraft', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🚤', 7
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'boats-watercraft');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'ATVs & Quads', 'АТВ и бъгита', 'atvs-quads', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🏎️', 8
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'atvs-quads');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Agricultural & Construction', 'Земеделска и строителна техника', 'agricultural-construction', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🚜', 9
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'agricultural-construction');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Trailers', 'Ремаркета', 'trailers', 
       (SELECT id FROM public.categories WHERE slug = 'vehicles'), '🛒', 10
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'trailers');

-- L2: Parts Subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Engine & Drivetrain', 'Двигател и задвижване', 'engine-drivetrain', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '🔩', 1
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'engine-drivetrain');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Brakes & Suspension', 'Спирачки и окачване', 'brakes-suspension', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '🛞', 2
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'brakes-suspension');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Body & Exterior', 'Каросерия и екстериор', 'body-exterior', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '🚪', 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'body-exterior');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Interior', 'Интериор', 'parts-interior', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '🪑', 4
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'parts-interior');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Electrical & Lighting', 'Електрика и осветление', 'electrical-lighting', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '💡', 5
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'electrical-lighting');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Wheels & Tires', 'Джанти и гуми', 'wheels-tires', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '🛞', 6
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'wheels-tires');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Exhaust & Emissions', 'Ауспуси и емисии', 'exhaust-emissions', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '💨', 7
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'exhaust-emissions');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cooling & Heating', 'Охлаждане и отопление', 'cooling-heating', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '❄️', 8
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'cooling-heating');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Transmission & Clutch', 'Скоростна кутия и съединител', 'transmission-clutch', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '⚙️', 9
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'transmission-clutch');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Filters & Maintenance', 'Филтри и поддръжка', 'filters-maintenance', 
       (SELECT id FROM public.categories WHERE slug = 'parts'), '🔧', 10
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'filters-maintenance');

-- L2: Accessories Subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Electronics & Audio', 'Електроника и аудио', 'auto-electronics-audio', 
       (SELECT id FROM public.categories WHERE slug = 'auto-accessories-main'), '📱', 1
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'auto-electronics-audio');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Interior Accessories', 'Интериорни аксесоари', 'auto-interior-accessories', 
       (SELECT id FROM public.categories WHERE slug = 'auto-accessories-main'), '🛋️', 2
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'auto-interior-accessories');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Exterior Accessories', 'Екстериорни аксесоари', 'auto-exterior-accessories', 
       (SELECT id FROM public.categories WHERE slug = 'auto-accessories-main'), '🎨', 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'auto-exterior-accessories');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Performance & Tuning', 'Тунинг и перформанс', 'performance-tuning', 
       (SELECT id FROM public.categories WHERE slug = 'auto-accessories-main'), '🏎️', 4
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'performance-tuning');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Car Care & Detailing', 'Грижа за автомобила', 'car-care', 
       (SELECT id FROM public.categories WHERE slug = 'auto-accessories-main'), '🧴', 5
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'car-care');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cargo & Storage', 'Багаж и съхранение', 'cargo-storage', 
       (SELECT id FROM public.categories WHERE slug = 'auto-accessories-main'), '📦', 6
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'cargo-storage');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Safety & Security', 'Безопасност и сигурност', 'auto-safety-security', 
       (SELECT id FROM public.categories WHERE slug = 'auto-accessories-main'), '🛡️', 7
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'auto-safety-security');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Tools & Equipment', 'Инструменти и оборудване', 'auto-tools-equipment', 
       (SELECT id FROM public.categories WHERE slug = 'auto-accessories-main'), '🔧', 8
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'auto-tools-equipment');

-- L2: Services Subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Repair & Maintenance', 'Ремонт и поддръжка', 'repair-maintenance', 
       (SELECT id FROM public.categories WHERE slug = 'auto-services'), '🔧', 1
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'repair-maintenance');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Detailing & Appearance', 'Детайлинг и визия', 'detailing-appearance', 
       (SELECT id FROM public.categories WHERE slug = 'auto-services'), '✨', 2
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'detailing-appearance');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Tuning & Performance', 'Тунинг и перформанс', 'svc-tuning-performance', 
       (SELECT id FROM public.categories WHERE slug = 'auto-services'), '🏁', 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'svc-tuning-performance');

INSERT INTO public.categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Transport & Logistics', 'Транспорт и логистика', 'transport-logistics', 
       (SELECT id FROM public.categories WHERE slug = 'auto-services'), '🚚', 4
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'transport-logistics');
```

---

## 📥 Vehicle Makes Seed Data (Bulgaria Popular)

> **Note:** If using a dedicated `vehicle_makes` table, use UUID primary keys.

```sql
-- Vehicle makes for autocomplete (optional enhancement)
-- Uses UUID auto-generated IDs

INSERT INTO public.vehicle_makes (name, country, is_popular, display_order) VALUES
-- German (Most Popular in Bulgaria)
('BMW', 'Germany', true, 1),
('Mercedes-Benz', 'Germany', true, 2),
('Audi', 'Germany', true, 3),
('Volkswagen', 'Germany', true, 4),
('Opel', 'Germany', true, 5),
('Porsche', 'Germany', false, 6),

-- Japanese (Very Popular)
('Toyota', 'Japan', true, 10),
('Honda', 'Japan', true, 11),
('Nissan', 'Japan', true, 12),
('Mazda', 'Japan', true, 13),
('Mitsubishi', 'Japan', true, 14),
('Suzuki', 'Japan', false, 15),
('Subaru', 'Japan', false, 16),
('Lexus', 'Japan', false, 17),

-- Korean (Growing)
('Hyundai', 'South Korea', true, 20),
('Kia', 'South Korea', true, 21),

-- French
('Renault', 'France', true, 30),
('Peugeot', 'France', true, 31),
('Citroën', 'France', true, 32),

-- Italian
('Fiat', 'Italy', true, 40),
('Alfa Romeo', 'Italy', false, 41),

-- Czech & Romanian (Regional)
('Škoda', 'Czech Republic', true, 50),
('Dacia', 'Romania', true, 51),

-- American
('Ford', 'USA', true, 60),
('Chevrolet', 'USA', false, 61),
('Jeep', 'USA', false, 62),
('Tesla', 'USA', false, 64),

-- British
('Land Rover', 'UK', false, 70),
('Jaguar', 'UK', false, 71),
('Mini', 'UK', false, 72),

-- Swedish
('Volvo', 'Sweden', false, 80),

-- Other
('SEAT', 'Spain', false, 100),
('Other', NULL, false, 999)
ON CONFLICT DO NOTHING;

-- Motorcycle Makes
INSERT INTO public.vehicle_makes (name, country, is_popular, display_order) VALUES
('Honda Motorcycles', 'Japan', true, 200),
('Yamaha', 'Japan', true, 201),
('Kawasaki', 'Japan', true, 202),
('Suzuki Motorcycles', 'Japan', true, 203),
('BMW Motorrad', 'Germany', true, 204),
('Ducati', 'Italy', false, 205),
('Harley-Davidson', 'USA', false, 206),
('KTM', 'Austria', false, 207),
('Triumph', 'UK', false, 208),
('Aprilia', 'Italy', false, 209)
ON CONFLICT DO NOTHING;
```

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table with Bulgarian translations
- [ ] Create vehicle_makes table
- [ ] Create vehicle_models table  
- [ ] Add JSONB attributes to products
- [ ] Create indexes for performance
- [ ] Seed all category data
- [ ] Seed all makes data

### API
- [ ] GET /categories (tree structure)
- [ ] GET /categories/:slug/products
- [ ] GET /makes (with popular flag)
- [ ] GET /makes/:id/models
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Vehicle listing form (multi-step)
- [ ] Parts listing form  
- [ ] Search filters component
- [ ] Results grid/list view
- [ ] Product detail page

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 37  
**Created:** December 2, 2025
