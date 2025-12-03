````markdown
# 🏠 Smart Home & Security | Смарт дом и сигурност

**Category Slug:** `smart-home`  
**Icon:** 🏠  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Smart Home → Lighting → Smart Bulbs |
| **Attributes** | Filtering, Search, Campaigns | Brand, Protocol, Compatibility, Features |
| **Tags** | Dynamic Collections & SEO | "alexa-compatible", "energy-saving", "zigbee" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🏠 Smart Home & Security (L0)
│
├── 💡 Smart Lighting (L1)
│   ├── Smart Bulbs (L2)
│   ├── Smart Light Strips (L2)
│   ├── Smart Switches (L2)
│   ├── Smart Dimmers (L2)
│   ├── Outdoor Lighting (L2)
│   └── Lighting Accessories (L2)
│
├── 🔌 Smart Plugs & Power (L1)
│   ├── Smart Plugs (L2)
│   ├── Smart Power Strips (L2)
│   ├── Smart Outlets (L2)
│   └── Energy Monitors (L2)
│
├── 🌡️ Climate Control (L1)
│   ├── Smart Thermostats (L2)
│   ├── Smart AC Controllers (L2)
│   ├── Smart Fans (L2)
│   ├── Smart Heaters (L2)
│   ├── Air Quality Monitors (L2)
│   └── Smart Humidifiers (L2)
│
├── 🔒 Security & Access (L1)
│   ├── Security Cameras (L2)
│   ├── Video Doorbells (L2)
│   ├── Smart Locks (L2)
│   ├── Alarm Systems (L2)
│   ├── Motion Sensors (L2)
│   ├── Door/Window Sensors (L2)
│   ├── Smart Safes (L2)
│   └── Security Accessories (L2)
│
├── 🎙️ Voice Assistants & Hubs (L1)
│   ├── Smart Speakers (L2)
│   ├── Smart Displays (L2)
│   ├── Smart Hubs (L2)
│   └── Voice Controllers (L2)
│
├── 📺 Smart Entertainment (L1)
│   ├── Smart TVs (L2)
│   ├── Streaming Devices (L2)
│   ├── Smart Remotes (L2)
│   └── Multi-Room Audio (L2)
│
├── 🧹 Smart Appliances (L1)
│   ├── Robot Vacuums (L2)
│   ├── Smart Refrigerators (L2)
│   ├── Smart Washers & Dryers (L2)
│   ├── Smart Ovens (L2)
│   ├── Smart Coffee Makers (L2)
│   └── Smart Kitchen Gadgets (L2)
│
├── 🚿 Smart Bathroom (L1)
│   ├── Smart Mirrors (L2)
│   ├── Smart Scales (L2)
│   ├── Smart Showers (L2)
│   └── Smart Toilets (L2)
│
├── 🌿 Smart Garden (L1)
│   ├── Smart Irrigation (L2)
│   ├── Smart Plant Sensors (L2)
│   ├── Smart Mowers (L2)
│   └── Outdoor Smart Devices (L2)
│
└── 🔧 Smart Home Accessories (L1)
    ├── Sensors & Detectors (L2)
    ├── Smart Buttons (L2)
    ├── Cables & Connectors (L2)
    └── Mounting Hardware (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 48 (L2) = 59 categories**

---

## 📊 Complete Category Reference

### L1: 💡 SMART LIGHTING

#### L2: Smart Bulbs | Смарт крушки
**Slug:** `lighting/bulbs`  
**Description:** WiFi, Zigbee, or Bluetooth connected light bulbs.

**Bulb Types (Attribute, not subcategory):**

| EN | BG | Description |
|----|----|----|
| Standard (A19/E27) | Стандартна | Most common type |
| Candle (E14) | Свещ | Decorative/chandeliers |
| Spot (GU10) | Спот | Directional lighting |
| Flood (BR30) | Прожектор | Wide beam |
| Globe | Глобус | Round decorative |
| Filament | Филамент | Vintage style |

**Features (Attribute):**
- Color (RGB) | Цветна (RGB)
- Color Temperature (CCT) | Цветна температура
- Dimmable | Димируема
- Music Sync | Синхрон с музика
- Sunrise/Sunset | Изгрев/Залез

---

#### L2: Smart Light Strips | Смарт LED ленти
**Slug:** `lighting/light-strips`

| EN | BG | Description |
|----|----|----|
| Indoor Strip | Вътрешна лента | Standard LED strips |
| Outdoor Strip | Външна лента | Waterproof (IP65+) |
| TV Backlight | Подсветка за ТВ | Bias lighting |
| Under Cabinet | Под шкаф | Kitchen/furniture |
| Corner/Neon | Ъглова/Неон | Flexible neon style |

---

#### L2: Smart Switches | Смарт ключове
**Slug:** `lighting/switches`

- Single Switch | Единичен ключ
- Double Switch | Двоен ключ
- Triple Switch | Троен ключ
- Touch Switch | Сензорен ключ
- Retrofit Switch | За ретрофит
- No-Neutral Switch | Без нулев проводник

---

#### L2: Smart Dimmers | Смарт димери
**Slug:** `lighting/dimmers`

- Wall Dimmer | Стенен димер
- Plug-in Dimmer | Димер за контакт
- In-Line Dimmer | Вграден димер
- Rotary Dimmer | Ротационен димер

---

### L1: 🔌 SMART PLUGS & POWER

#### L2: Smart Plugs | Смарт контакти
**Slug:** `power/plugs`

| EN | BG | Description |
|----|----|----|
| Standard Plug | Стандартен контакт | Basic on/off |
| Energy Monitoring | С мониторинг | Tracks power usage |
| Outdoor Plug | Външен контакт | Weather resistant |
| Mini Plug | Мини контакт | Compact design |
| Dual Outlet | Двоен контакт | Two outlets |

---

#### L2: Smart Power Strips | Смарт разклонители
**Slug:** `power/power-strips`

- 3-Outlet | 3 гнезда
- 4-Outlet | 4 гнезда
- 6-Outlet | 6 гнезда
- With USB Ports | С USB портове
- Surge Protection | Със защита от пренапрежение

---

### L1: 🌡️ CLIMATE CONTROL

#### L2: Smart Thermostats | Смарт термостати
**Slug:** `climate/thermostats`

| EN | BG | Description |
|----|----|----|
| Learning Thermostat | Учещ термостат | AI-powered (Nest) |
| Programmable | Програмируем | Schedule-based |
| Zone Control | Зонов контрол | Multi-zone |
| Boiler Control | За бойлер | Hot water control |
| Underfloor Heating | Подово отопление | Floor heating |

---

#### L2: Smart AC Controllers | Смарт контролери за климатик
**Slug:** `climate/ac-controllers`

- Universal IR Controller | Универсален IR контролер
- WiFi AC Module | WiFi модул за климатик
- Split AC Controller | За сплит климатик
- Window AC Controller | За прозоречен климатик

---

#### L2: Air Quality Monitors | Монитори за качество на въздуха
**Slug:** `climate/air-quality`

- CO2 Monitor | CO2 монитор
- PM2.5 Monitor | PM2.5 монитор
- VOC Monitor | VOC монитор
- Multi-Sensor | Мулти-сензор
- Radon Detector | Радон детектор

---

### L1: 🔒 SECURITY & ACCESS

#### L2: Security Cameras | Камери за сигурност
**Slug:** `security/cameras`

| EN | BG | Description |
|----|----|----|
| Indoor Camera | Вътрешна камера | Home monitoring |
| Outdoor Camera | Външна камера | Weatherproof |
| PTZ Camera | PTZ камера | Pan-Tilt-Zoom |
| Floodlight Camera | Камера с прожектор | Built-in light |
| Battery Camera | Безжична камера | Wire-free |
| Doorbell Camera | Звънец с камера | Video doorbell |
| Baby Monitor | Бебефон | Baby monitoring |

**Resolution (Attribute):**
- 1080p Full HD
- 2K QHD
- 4K Ultra HD

**Features (Attribute):**
- Night Vision | Нощно виждане
- Two-Way Audio | Двупосочен звук
- Person Detection | Разпознаване на хора
- Pet Detection | Разпознаване на животни
- Vehicle Detection | Разпознаване на коли
- Package Detection | Разпознаване на пратки
- Local Storage | Локално съхранение
- Cloud Storage | Облачно съхранение

---

#### L2: Video Doorbells | Видео звънци
**Slug:** `security/doorbells`

- Wired Doorbell | Жичен звънец
- Battery Doorbell | Безжичен звънец
- With Chime | С камбанка
- Intercom System | Интерком система

---

#### L2: Smart Locks | Смарт ключалки
**Slug:** `security/locks`

| EN | BG | Description |
|----|----|----|
| Deadbolt Lock | Резе | Standard door lock |
| Lever Lock | Дръжка с ключалка | Handle style |
| Padlock | Катинар | Portable lock |
| Cabinet Lock | За шкаф | Furniture lock |
| Retrofit Lock | Ретрофит | Over existing lock |
| Euro Cylinder | Евроцилиндър | European standard |

**Unlock Methods (Attribute):**
- Keypad | Клавиатура
- Fingerprint | Пръстов отпечатък
- Smartphone | Смартфон
- Key Card | Карта
- Key Fob | Ключодържател
- Physical Key | Физически ключ

---

#### L2: Alarm Systems | Алармени системи
**Slug:** `security/alarms`

- Complete Systems | Цялостни системи
- Base Stations | Базови станции
- Keypads | Клавиатури
- Sirens | Сирени
- Panic Buttons | Паник бутони

---

#### L2: Motion Sensors | Сензори за движение
**Slug:** `security/motion-sensors`

- PIR Sensors | PIR сензори
- Microwave Sensors | Микровълнови сензори
- Dual Technology | Двойна технология
- Pet-Immune | Игнориращи домашни любимци
- Outdoor Motion | За външно ползване

---

#### L2: Door/Window Sensors | Сензори за врати/прозорци
**Slug:** `security/contact-sensors`

- Magnetic Sensors | Магнитни сензори
- Vibration Sensors | Вибрационни сензори
- Glass Break Sensors | Сензори за счупено стъкло
- Garage Sensors | За гаражна врата

---

### L1: 🎙️ VOICE ASSISTANTS & HUBS

#### L2: Smart Speakers | Смарт тонколони
**Slug:** `assistants/speakers`

**Ecosystem (Attribute):**
| EN | BG | Description |
|----|----|----|
| Amazon Alexa | Amazon Alexa | Echo devices |
| Google Assistant | Google Assistant | Nest/Home devices |
| Apple Siri | Apple Siri | HomePod |
| Samsung Bixby | Samsung Bixby | Galaxy Home |

---

#### L2: Smart Displays | Смарт дисплеи
**Slug:** `assistants/displays`

- Echo Show | Echo Show
- Google Nest Hub | Google Nest Hub
- Facebook Portal | Facebook Portal
- Lenovo Smart Display | Lenovo Smart Display

---

#### L2: Smart Hubs | Смарт хъбове
**Slug:** `assistants/hubs`

**Protocol (Attribute):**
- Zigbee Hub | Zigbee хъб
- Z-Wave Hub | Z-Wave хъб
- Thread/Matter Hub | Thread/Matter хъб
- Multi-Protocol Hub | Мулти-протокол хъб
- WiFi Bridge | WiFi мост

---

### L1: 🧹 SMART APPLIANCES

#### L2: Robot Vacuums | Прахосмукачки роботи
**Slug:** `appliances/robot-vacuums`

| EN | BG | Description |
|----|----|----|
| Vacuum Only | Само прахосмукане | Basic cleaning |
| Vacuum & Mop | С моп | Wet & dry |
| Self-Emptying | Самоизпразващ | Auto-empty dock |
| Obstacle Avoidance | С камера | AI navigation |
| LiDAR Navigation | LiDAR навигация | Laser mapping |

**Popular Brands (Attribute):**
- iRobot Roomba
- Roborock
- Ecovacs Deebot
- Xiaomi
- Dreame
- Narwal

---

#### L2: Smart Coffee Makers | Смарт кафемашини
**Slug:** `appliances/coffee-makers`

- Drip Coffee Maker | Шварц кафемашина
- Espresso Machine | Еспресо машина
- Pod/Capsule | Капсулна машина
- Bean-to-Cup | С кафемелачка
- Cold Brew | За студено кафе

---

### L1: 🌿 SMART GARDEN

#### L2: Smart Irrigation | Смарт напояване
**Slug:** `garden/irrigation`

- Sprinkler Controllers | Контролери за пръскачки
- Drip Irrigation | Капково напояване
- Hose Timers | Таймери за маркуч
- Zone Controllers | Зонови контролери
- Rain Sensors | Сензори за дъжд

---

#### L2: Smart Plant Sensors | Сензори за растения
**Slug:** `garden/plant-sensors`

- Soil Moisture | Влажност на почвата
- Light Level | Ниво на светлина
- Temperature | Температура
- Nutrient Level | Хранителни вещества
- All-in-One | Всичко в едно

---

#### L2: Smart Mowers | Смарт косачки
**Slug:** `garden/mowers`

- Robot Mowers | Роботи косачки
- Boundary Wire | С ограждащ кабел
- GPS Navigation | С GPS навигация
- Vision-Based | С камера

---

---

## 🏷️ Attribute System (The Power Layer)

### Smart Home Product Attributes Schema

```typescript
interface SmartHomeProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "lighting/bulbs"
  
  // === BASIC INFO ===
  title: string;                 // "Philips Hue White A19"
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === PRODUCT IDENTIFICATION ===
  brand: string;                 // "Philips Hue"
  model: string;                 // "White A19"
  sku?: string;
  
  // === CONNECTIVITY ===
  protocol: Protocol[];          // ["zigbee", "bluetooth"]
  wifi_required: boolean;
  hub_required: boolean;
  hub_compatibility: string[];   // ["Hue Bridge", "SmartThings"]
  
  // === ECOSYSTEM COMPATIBILITY ===
  alexa_compatible: boolean;
  google_compatible: boolean;
  homekit_compatible: boolean;
  smartthings_compatible: boolean;
  matter_compatible: boolean;
  
  // === POWER ===
  power_source: PowerSource;
  voltage?: string;              // "220-240V"
  wattage?: number;              // 9
  battery_type?: string;         // "2x AA", "Built-in rechargeable"
  battery_life?: string;         // "1 year", "6 months"
  
  // === PHYSICAL ===
  dimensions?: string;           // "60x60x110mm"
  weight?: number;               // grams
  color: string;
  ip_rating?: string;            // "IP65"
  
  // === FEATURES (Dynamic) ===
  features: string[];            // ["dimmable", "color", "schedules"]
  
  // === WARRANTY & CONDITION ===
  condition: ProductCondition;
  warranty?: string;
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer';
  location_city: string;
  location_region: string;
  
  // === LISTING META ===
  images: string[];
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS ===
  tags: string[];                // ["energy-saving", "voice-control"]
}

// === ENUMS ===

type Protocol = 
  | 'wifi' | 'zigbee' | 'zwave' | 'bluetooth' | 'thread' 
  | 'matter' | 'rf433' | 'infrared' | 'proprietary';

type PowerSource = 
  | 'mains' | 'battery' | 'usb' | 'solar' | 'poe';

type ProductCondition = 
  | 'new' | 'like_new' | 'used' | 'refurbished' | 'for_parts';
```

### Security Camera Attributes Schema

```typescript
interface SecurityCameraProduct {
  id: string;
  category_id: string;
  
  title: string;
  description: string;
  price: number;
  
  // === CAMERA IDENTIFICATION ===
  brand: string;
  model: string;
  
  // === VIDEO SPECS ===
  resolution: Resolution;
  field_of_view: number;         // 130 (degrees)
  zoom_type?: ZoomType;
  zoom_range?: string;           // "4x optical"
  frame_rate: number;            // 30 (fps)
  hdr: boolean;
  
  // === NIGHT VISION ===
  night_vision: boolean;
  night_vision_type?: NightVisionType;
  night_vision_range?: number;   // meters
  color_night_vision: boolean;
  
  // === AUDIO ===
  microphone: boolean;
  speaker: boolean;
  two_way_audio: boolean;
  noise_cancellation: boolean;
  
  // === AI FEATURES ===
  motion_detection: boolean;
  person_detection: boolean;
  pet_detection: boolean;
  vehicle_detection: boolean;
  package_detection: boolean;
  face_recognition: boolean;
  activity_zones: boolean;
  
  // === CONNECTIVITY ===
  wifi_standard: string;         // "WiFi 6"
  ethernet: boolean;
  protocol: Protocol[];
  
  // === POWER ===
  power_source: PowerSource;
  battery_life?: string;
  solar_panel_compatible: boolean;
  
  // === STORAGE ===
  local_storage: boolean;
  sd_card_slot: boolean;
  max_sd_card: number;           // GB
  cloud_storage: boolean;
  cloud_subscription_required: boolean;
  nas_support: boolean;
  
  // === PHYSICAL ===
  indoor_outdoor: 'indoor' | 'outdoor' | 'both';
  ip_rating?: string;
  operating_temp?: string;       // "-20°C to 50°C"
  ptz: boolean;
  pan_range?: number;            // degrees
  tilt_range?: number;           // degrees
  
  // === ECOSYSTEM ===
  alexa_compatible: boolean;
  google_compatible: boolean;
  homekit_compatible: boolean;
  
  condition: ProductCondition;
  warranty?: string;
  
  seller_type: 'private' | 'dealer';
  location_city: string;
  
  images: string[];
}

type Resolution = '720p' | '1080p' | '2K' | '4K' | '5MP' | '8MP';
type ZoomType = 'digital' | 'optical' | 'hybrid';
type NightVisionType = 'infrared' | 'starlight' | 'spotlight';
```

### Robot Vacuum Attributes Schema

```typescript
interface RobotVacuumProduct {
  id: string;
  category_id: string;
  
  title: string;
  description: string;
  price: number;
  
  brand: string;
  model: string;
  
  // === CLEANING CAPABILITIES ===
  vacuum: boolean;
  mop: boolean;
  suction_power: number;         // Pa
  dustbin_capacity: number;      // ml
  water_tank_capacity?: number;  // ml
  
  // === NAVIGATION ===
  navigation_type: NavigationType;
  mapping: boolean;
  multi_floor_mapping: boolean;
  no_go_zones: boolean;
  room_recognition: boolean;
  obstacle_avoidance: boolean;
  
  // === BASE STATION ===
  self_emptying: boolean;
  self_cleaning_mop: boolean;
  auto_refill_water: boolean;
  hot_air_drying: boolean;
  base_dustbin_capacity?: number; // L
  
  // === BATTERY ===
  battery_capacity: number;      // mAh
  runtime: number;               // minutes
  auto_recharge: boolean;
  resume_cleaning: boolean;
  
  // === COMPATIBILITY ===
  app_control: boolean;
  voice_control: boolean;
  alexa_compatible: boolean;
  google_compatible: boolean;
  
  // === PHYSICAL ===
  height: number;                // mm
  diameter: number;              // mm
  weight: number;                // kg
  noise_level: number;           // dB
  
  // === SURFACES ===
  carpet_boost: boolean;
  hard_floor: boolean;
  carpet: boolean;
  pet_hair: boolean;
  
  condition: ProductCondition;
  warranty?: string;
  
  seller_type: 'private' | 'dealer';
  location_city: string;
  
  images: string[];
}

type NavigationType = 'random' | 'gyroscope' | 'lidar' | 'camera' | 'lidar_camera';
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "Matter-Ready Smart Home" Campaign
SELECT * FROM products 
WHERE category LIKE 'smart-home/%'
AND attributes->>'matter_compatible' = 'true';

-- 🏷️ "Alexa Compatible Devices" Campaign
SELECT * FROM products 
WHERE category LIKE 'smart-home/%'
AND attributes->>'alexa_compatible' = 'true';

-- 🏷️ "Battery-Powered Security" Campaign
SELECT * FROM products 
WHERE category LIKE 'smart-home/security/%'
AND attributes->>'power_source' = 'battery';

-- 🏷️ "Premium Robot Vacuums with Self-Empty"
SELECT * FROM products 
WHERE category = 'smart-home/appliances/robot-vacuums'
AND attributes->>'self_emptying' = 'true'
AND price >= 1000;

-- 🏷️ "Zigbee Smart Lights"
SELECT * FROM products 
WHERE category LIKE 'smart-home/lighting/%'
AND attributes->'protocol' ? 'zigbee';

-- 🏷️ "4K Security Cameras Under 300 лв"
SELECT * FROM products 
WHERE category = 'smart-home/security/cameras'
AND attributes->>'resolution' = '4K'
AND price <= 300;
```

### Search Filter Configuration

```typescript
const smartHomeFilters = {
  // Price & Location
  price: { type: 'range', min: 0, max: 5000, step: 10 },
  location: { type: 'location', regions: bulgarianRegions },
  
  // Brand
  brand: { type: 'searchable-select', options: smartHomeBrands },
  
  // Connectivity
  protocol: { type: 'multi-select', options: protocols },
  hub_required: { type: 'checkbox' },
  
  // Ecosystem
  alexa_compatible: { type: 'checkbox' },
  google_compatible: { type: 'checkbox' },
  homekit_compatible: { type: 'checkbox' },
  matter_compatible: { type: 'checkbox' },
  
  // Power
  power_source: { type: 'multi-select', options: powerSources },
  
  // Condition
  condition: { type: 'multi-select' },
  
  // Seller
  seller_type: { type: 'radio', options: ['all', 'private', 'dealer'] },
};

const securityCameraFilters = {
  price: { type: 'range', min: 0, max: 2000 },
  brand: { type: 'searchable-select' },
  
  resolution: { type: 'multi-select', options: ['1080p', '2K', '4K'] },
  indoor_outdoor: { type: 'radio', options: ['indoor', 'outdoor', 'both'] },
  
  power_source: { type: 'multi-select', options: ['mains', 'battery', 'solar'] },
  
  // AI Features
  person_detection: { type: 'checkbox' },
  pet_detection: { type: 'checkbox' },
  vehicle_detection: { type: 'checkbox' },
  
  // Storage
  local_storage: { type: 'checkbox' },
  cloud_storage: { type: 'checkbox' },
  
  ptz: { type: 'checkbox' },
  night_vision: { type: 'checkbox' },
  two_way_audio: { type: 'checkbox' },
};
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('smart-home', 'Smart Home & Security', 'Смарт дом и сигурност', 'smart-home', 'smart-home', NULL, 0, '🏠', 36, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('sh-lighting', 'Smart Lighting', 'Смарт осветление', 'lighting', 'smart-home/lighting', 'smart-home', 1, '💡', 1, true),
('sh-power', 'Smart Plugs & Power', 'Смарт контакти', 'power', 'smart-home/power', 'smart-home', 1, '🔌', 2, true),
('sh-climate', 'Climate Control', 'Климат контрол', 'climate', 'smart-home/climate', 'smart-home', 1, '🌡️', 3, true),
('sh-security', 'Security & Access', 'Сигурност и достъп', 'security', 'smart-home/security', 'smart-home', 1, '🔒', 4, true),
('sh-assistants', 'Voice Assistants & Hubs', 'Гласови асистенти', 'assistants', 'smart-home/assistants', 'smart-home', 1, '🎙️', 5, true),
('sh-entertainment', 'Smart Entertainment', 'Смарт развлечения', 'entertainment', 'smart-home/entertainment', 'smart-home', 1, '📺', 6, true),
('sh-appliances', 'Smart Appliances', 'Смарт уреди', 'appliances', 'smart-home/appliances', 'smart-home', 1, '🧹', 7, true),
('sh-bathroom', 'Smart Bathroom', 'Смарт баня', 'bathroom', 'smart-home/bathroom', 'smart-home', 1, '🚿', 8, true),
('sh-garden', 'Smart Garden', 'Смарт градина', 'garden', 'smart-home/garden', 'smart-home', 1, '🌿', 9, true),
('sh-accessories', 'Smart Home Accessories', 'Аксесоари', 'accessories', 'smart-home/accessories', 'smart-home', 1, '🔧', 10, true);

-- L2: Lighting
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('light-bulbs', 'Smart Bulbs', 'Смарт крушки', 'bulbs', 'lighting/bulbs', 'sh-lighting', 2, '💡', 1, true),
('light-strips', 'Smart Light Strips', 'LED ленти', 'light-strips', 'lighting/light-strips', 'sh-lighting', 2, '🌈', 2, true),
('light-switches', 'Smart Switches', 'Смарт ключове', 'switches', 'lighting/switches', 'sh-lighting', 2, '🔘', 3, true),
('light-dimmers', 'Smart Dimmers', 'Смарт димери', 'dimmers', 'lighting/dimmers', 'sh-lighting', 2, '🔆', 4, true),
('light-outdoor', 'Outdoor Lighting', 'Външно осветление', 'outdoor', 'lighting/outdoor', 'sh-lighting', 2, '🏮', 5, true),
('light-accessories', 'Lighting Accessories', 'Аксесоари', 'lighting-accessories', 'lighting/accessories', 'sh-lighting', 2, '🔧', 6, true);

-- L2: Power
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('power-plugs', 'Smart Plugs', 'Смарт контакти', 'plugs', 'power/plugs', 'sh-power', 2, '🔌', 1, true),
('power-strips', 'Smart Power Strips', 'Смарт разклонители', 'power-strips', 'power/power-strips', 'sh-power', 2, '🔋', 2, true),
('power-outlets', 'Smart Outlets', 'Смарт изводи', 'outlets', 'power/outlets', 'sh-power', 2, '⚡', 3, true),
('power-monitors', 'Energy Monitors', 'Енергийни монитори', 'energy-monitors', 'power/energy-monitors', 'sh-power', 2, '📊', 4, true);

-- L2: Climate
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('climate-thermostats', 'Smart Thermostats', 'Смарт термостати', 'thermostats', 'climate/thermostats', 'sh-climate', 2, '🌡️', 1, true),
('climate-ac', 'Smart AC Controllers', 'Контролери за климатик', 'ac-controllers', 'climate/ac-controllers', 'sh-climate', 2, '❄️', 2, true),
('climate-fans', 'Smart Fans', 'Смарт вентилатори', 'fans', 'climate/fans', 'sh-climate', 2, '💨', 3, true),
('climate-heaters', 'Smart Heaters', 'Смарт отоплители', 'heaters', 'climate/heaters', 'sh-climate', 2, '🔥', 4, true),
('climate-air-quality', 'Air Quality Monitors', 'Монитори за въздух', 'air-quality', 'climate/air-quality', 'sh-climate', 2, '🌬️', 5, true),
('climate-humidifiers', 'Smart Humidifiers', 'Смарт овлажнители', 'humidifiers', 'climate/humidifiers', 'sh-climate', 2, '💧', 6, true);

-- L2: Security
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('sec-cameras', 'Security Cameras', 'Камери за сигурност', 'cameras', 'security/cameras', 'sh-security', 2, '📹', 1, true),
('sec-doorbells', 'Video Doorbells', 'Видео звънци', 'doorbells', 'security/doorbells', 'sh-security', 2, '🔔', 2, true),
('sec-locks', 'Smart Locks', 'Смарт ключалки', 'locks', 'security/locks', 'sh-security', 2, '🔐', 3, true),
('sec-alarms', 'Alarm Systems', 'Алармени системи', 'alarms', 'security/alarms', 'sh-security', 2, '🚨', 4, true),
('sec-motion', 'Motion Sensors', 'Сензори за движение', 'motion-sensors', 'security/motion-sensors', 'sh-security', 2, '👁️', 5, true),
('sec-contact', 'Door/Window Sensors', 'Сензори за врати', 'contact-sensors', 'security/contact-sensors', 'sh-security', 2, '🚪', 6, true),
('sec-safes', 'Smart Safes', 'Смарт сейфове', 'safes', 'security/safes', 'sh-security', 2, '🗄️', 7, true),
('sec-accessories', 'Security Accessories', 'Аксесоари', 'security-accessories', 'security/accessories', 'sh-security', 2, '🔧', 8, true);

-- L2: Voice Assistants
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('assist-speakers', 'Smart Speakers', 'Смарт тонколони', 'speakers', 'assistants/speakers', 'sh-assistants', 2, '🔊', 1, true),
('assist-displays', 'Smart Displays', 'Смарт дисплеи', 'displays', 'assistants/displays', 'sh-assistants', 2, '📱', 2, true),
('assist-hubs', 'Smart Hubs', 'Смарт хъбове', 'hubs', 'assistants/hubs', 'sh-assistants', 2, '🎛️', 3, true),
('assist-controllers', 'Voice Controllers', 'Гласови контролери', 'voice-controllers', 'assistants/voice-controllers', 'sh-assistants', 2, '🎤', 4, true);

-- L2: Appliances
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('appl-vacuums', 'Robot Vacuums', 'Прахосмукачки роботи', 'robot-vacuums', 'appliances/robot-vacuums', 'sh-appliances', 2, '🤖', 1, true),
('appl-fridges', 'Smart Refrigerators', 'Смарт хладилници', 'refrigerators', 'appliances/refrigerators', 'sh-appliances', 2, '🧊', 2, true),
('appl-washers', 'Smart Washers & Dryers', 'Смарт перални', 'washers-dryers', 'appliances/washers-dryers', 'sh-appliances', 2, '🧺', 3, true),
('appl-ovens', 'Smart Ovens', 'Смарт фурни', 'ovens', 'appliances/ovens', 'sh-appliances', 2, '♨️', 4, true),
('appl-coffee', 'Smart Coffee Makers', 'Смарт кафемашини', 'coffee-makers', 'appliances/coffee-makers', 'sh-appliances', 2, '☕', 5, true),
('appl-kitchen', 'Smart Kitchen Gadgets', 'Кухненски джаджи', 'kitchen-gadgets', 'appliances/kitchen-gadgets', 'sh-appliances', 2, '🍳', 6, true);

-- L2: Garden
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('garden-irrigation', 'Smart Irrigation', 'Смарт напояване', 'irrigation', 'garden/irrigation', 'sh-garden', 2, '💦', 1, true),
('garden-plants', 'Smart Plant Sensors', 'Сензори за растения', 'plant-sensors', 'garden/plant-sensors', 'sh-garden', 2, '🌱', 2, true),
('garden-mowers', 'Smart Mowers', 'Смарт косачки', 'mowers', 'garden/mowers', 'sh-garden', 2, '🌿', 3, true),
('garden-outdoor', 'Outdoor Smart Devices', 'Външни устройства', 'outdoor-devices', 'garden/outdoor-devices', 'sh-garden', 2, '🏡', 4, true);
```

### Smart Home Brands Reference Data

```sql
-- Popular smart home brands
INSERT INTO public.smart_home_brands (id, name, category, is_popular, display_order) VALUES
-- Lighting
('philips-hue', 'Philips Hue', 'lighting', true, 1),
('lifx', 'LIFX', 'lighting', true, 2),
('nanoleaf', 'Nanoleaf', 'lighting', true, 3),
('govee', 'Govee', 'lighting', true, 4),
('yeelight', 'Yeelight', 'lighting', true, 5),

-- Security
('ring', 'Ring', 'security', true, 1),
('arlo', 'Arlo', 'security', true, 2),
('eufy', 'Eufy', 'security', true, 3),
('nest', 'Google Nest', 'security', true, 4),
('reolink', 'Reolink', 'security', true, 5),
('hikvision', 'Hikvision', 'security', false, 6),

-- Robot Vacuums
('irobot', 'iRobot Roomba', 'vacuums', true, 1),
('roborock', 'Roborock', 'vacuums', true, 2),
('ecovacs', 'Ecovacs', 'vacuums', true, 3),
('xiaomi', 'Xiaomi', 'vacuums', true, 4),
('dreame', 'Dreame', 'vacuums', true, 5),

-- Voice Assistants
('amazon', 'Amazon Echo', 'assistants', true, 1),
('google', 'Google Nest', 'assistants', true, 2),
('apple', 'Apple HomePod', 'assistants', true, 3);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Smart Home & Security | Смарт дом и сигурност |
| Smart Lighting | Смарт осветление |
| Smart Bulbs | Смарт крушки |
| Smart Switches | Смарт ключове |
| Smart Plugs | Смарт контакти |
| Climate Control | Климат контрол |
| Smart Thermostats | Смарт термостати |
| Security & Access | Сигурност и достъп |
| Security Cameras | Камери за сигурност |
| Video Doorbells | Видео звънци |
| Smart Locks | Смарт ключалки |
| Voice Assistants | Гласови асистенти |
| Smart Speakers | Смарт тонколони |
| Smart Hubs | Смарт хъбове |
| Robot Vacuums | Прахосмукачки роботи |
| Smart Garden | Смарт градина |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Protocol | Протокол |
| Compatibility | Съвместимост |
| Power Source | Захранване |
| Battery Life | Живот на батерията |
| Resolution | Резолюция |
| Night Vision | Нощно виждане |
| Motion Detection | Детекция на движение |
| Two-Way Audio | Двупосочен звук |
| Local Storage | Локално съхранение |
| Cloud Storage | Облачно съхранение |

### Attribute Values

| EN | BG |
|----|----|
| WiFi | WiFi |
| Zigbee | Zigbee |
| Z-Wave | Z-Wave |
| Bluetooth | Bluetooth |
| Matter | Matter |
| Mains Powered | На ток |
| Battery Powered | На батерия |
| Solar Powered | Соларен |
| Indoor | Вътрешен |
| Outdoor | Външен |
| New | Ново |
| Used | Употребявано |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add smart home brands reference data
- [ ] Add protocol reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/smart-home (tree structure)
- [ ] GET /categories/smart-home/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Protocol filter
- [ ] Ecosystem compatibility filter
- [ ] Brand search
- [ ] Feature checkboxes
- [ ] Results grid/list view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 59  
**Created:** December 3, 2025

````

