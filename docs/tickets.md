````markdown
# 🎟️ Tickets & Experiences | Билети и преживявания

**Category Slug:** `tickets`  
**Icon:** 🎟️  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Tickets → Concerts → Rock & Metal |
| **Attributes** | Filtering, Search, Campaigns | Date, Venue, Seat Section, Quantity |
| **Tags** | Dynamic Collections & SEO | "vip", "front-row", "sold-out" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🎟️ Tickets & Experiences (L0)
│
├── 🎵 Concerts & Music (L1)
│   ├── Rock & Metal (L2)
│   ├── Pop & Electronic (L2)
│   ├── Hip-Hop & R&B (L2)
│   ├── Jazz & Blues (L2)
│   ├── Classical & Opera (L2)
│   ├── Folk & Chalga (L2)
│   ├── Festivals (L2)
│   └── DJ Sets & Club Events (L2)
│
├── ⚽ Sports (L1)
│   ├── Football (L2)
│   ├── Basketball (L2)
│   ├── Tennis (L2)
│   ├── Volleyball (L2)
│   ├── Motor Sports (L2)
│   ├── Combat Sports (L2)
│   ├── Winter Sports (L2)
│   └── Other Sports (L2)
│
├── 🎭 Theatre & Arts (L1)
│   ├── Drama & Theatre (L2)
│   ├── Musicals (L2)
│   ├── Ballet & Dance (L2)
│   ├── Comedy Shows (L2)
│   ├── Stand-Up Comedy (L2)
│   └── Circus & Cabaret (L2)
│
├── 🎬 Cinema & Screenings (L1)
│   ├── Movie Premieres (L2)
│   ├── Film Festivals (L2)
│   ├── Special Screenings (L2)
│   └── IMAX & 4DX (L2)
│
├── 🎮 Gaming & Esports (L1)
│   ├── Esports Tournaments (L2)
│   ├── Gaming Conventions (L2)
│   ├── LAN Parties (L2)
│   └── Gaming Meetups (L2)
│
├── 📚 Conferences & Seminars (L1)
│   ├── Tech Conferences (L2)
│   ├── Business Seminars (L2)
│   ├── Educational Workshops (L2)
│   ├── Art & Design Events (L2)
│   └── Health & Wellness (L2)
│
├── 🎡 Theme Parks & Attractions (L1)
│   ├── Theme Parks (L2)
│   ├── Water Parks (L2)
│   ├── Zoos & Aquariums (L2)
│   ├── Museums (L2)
│   └── Historical Sites (L2)
│
├── ✈️ Travel & Tours (L1)
│   ├── City Tours (L2)
│   ├── Adventure Tours (L2)
│   ├── Wine & Food Tours (L2)
│   ├── Cultural Experiences (L2)
│   ├── Nature & Wildlife (L2)
│   └── Cruises (L2)
│
├── 🍽️ Food & Drink Experiences (L1)
│   ├── Restaurant Vouchers (L2)
│   ├── Cooking Classes (L2)
│   ├── Wine Tastings (L2)
│   ├── Beer & Brewery Tours (L2)
│   ├── Food Festivals (L2)
│   └── Private Chef Experiences (L2)
│
├── 💆 Wellness & Spa (L1)
│   ├── Spa Packages (L2)
│   ├── Massage Sessions (L2)
│   ├── Yoga & Meditation (L2)
│   ├── Hot Springs & Mineral Baths (L2)
│   └── Beauty Treatments (L2)
│
├── 🎁 Gift Experiences (L1)
│   ├── Romantic Experiences (L2)
│   ├── Family Experiences (L2)
│   ├── Adventure Gifts (L2)
│   ├── Learning Experiences (L2)
│   └── VIP Experiences (L2)
│
└── 🎪 Special Events (L1)
    ├── New Year Parties (L2)
    ├── Festival Passes (L2)
    ├── Private Events (L2)
    ├── Corporate Events (L2)
    └── Charity Galas (L2)
```

**Total Categories: 1 (L0) + 12 (L1) + 62 (L2) = 75 categories**

---

## 📊 Complete Category Reference

### L1: 🎵 CONCERTS & MUSIC

#### L2: Rock & Metal | Рок и метъл
**Slug:** `concerts/rock-metal`  
**Description:** Rock, metal, punk, and alternative music concerts.

**Genres (Attribute, not subcategory):**
- Hard Rock | Хард рок
- Heavy Metal | Хеви метъл
- Alternative | Алтернативен
- Punk | Пънк
- Progressive | Прогресив
- Indie Rock | Инди рок

---

#### L2: Pop & Electronic | Поп и електронна
**Slug:** `concerts/pop-electronic`

- Pop Music | Поп музика
- EDM | EDM
- House | Хаус
- Techno | Техно
- Trance | Транс
- Dubstep | Дъбстеп

---

#### L2: Folk & Chalga | Фолк и чалга
**Slug:** `concerts/folk-chalga`  
**Description:** Bulgarian folk and chalga music events.

- Chalga | Чалга
- Bulgarian Folk | Български фолклор
- Balkan Music | Балканска музика
- Pop-Folk | Поп-фолк

---

#### L2: Festivals | Фестивали
**Slug:** `concerts/festivals`

- Hills of Rock | Hills of Rock
- Sofia Rocks | Sofia Rocks
- Spirit of Burgas | Spirit of Burgas
- Meadows in the Mountains | Meadows in the Mountains
- A to JazZ | A to JazZ
- International Festivals | Международни фестивали

---

### L1: ⚽ SPORTS

#### L2: Football | Футбол
**Slug:** `sports/football`

**Competition (Attribute):**
- Bulgarian First League | Първа лига
- Bulgarian Cup | Купа на България
- UEFA Champions League | Шампионска лига
- UEFA Europa League | Лига Европа
- World Cup | Световно първенство
- National Team | Национален отбор

**Teams (Attribute for Bulgarian market):**
- CSKA Sofia | ЦСКА София
- Levski Sofia | Левски София
- Ludogorets | Лудогорец
- Lokomotiv Plovdiv | Локомотив Пловдив

---

#### L2: Basketball | Баскетбол
**Slug:** `sports/basketball`

- Bulgarian League | Българска лига
- Eurobasket | Евробаскет
- NBA | NBA
- Euroleague | Евролига

---

#### L2: Combat Sports | Бойни спортове
**Slug:** `sports/combat-sports`

- Boxing | Бокс
- MMA / UFC | ММА / UFC
- Kickboxing | Кикбокс
- Wrestling | Борба

---

### L1: 🎭 THEATRE & ARTS

#### L2: Drama & Theatre | Драма и театър
**Slug:** `theatre/drama`

**Venue (Attribute):**
- National Theatre | Народен театър
- Ivan Vazov Theatre | Театър Иван Вазов
- Satirical Theatre | Сатиричен театър
- Regional Theatres | Регионални театри

---

#### L2: Stand-Up Comedy | Стендъп комедия
**Slug:** `theatre/standup`

- Bulgarian Comedians | Български комици
- International Acts | Международни артисти
- Open Mic | Отворен микрофон

---

### L1: 🎮 GAMING & ESPORTS

#### L2: Esports Tournaments | Esports турнири
**Slug:** `gaming/esports`

**Game (Attribute):**
- Counter-Strike 2 | Counter-Strike 2
- League of Legends | League of Legends
- Dota 2 | Dota 2
- Valorant | Valorant
- FIFA | FIFA
- Fortnite | Fortnite

**Tournament Type:**
- LAN Finals | LAN финали
- Online Qualifiers | Онлайн квалификации
- Major Events | Големи събития

---

#### L2: Gaming Conventions | Гейминг конвенции
**Slug:** `gaming/conventions`

- GamesCom | GamesCom
- Sofia Game Night | Sofia Game Night
- PAX | PAX
- E3 | E3

---

### L1: 📚 CONFERENCES & SEMINARS

#### L2: Tech Conferences | Технологични конференции
**Slug:** `conferences/tech`

- Developer Conferences | Разработчици
- Startup Events | Стартъп събития
- AI & Machine Learning | AI и ML
- Cybersecurity | Киберсигурност
- DevOps | DevOps

---

### L1: 🎡 THEME PARKS & ATTRACTIONS

#### L2: Museums | Музеи
**Slug:** `attractions/museums`

**Type (Attribute):**
- Art Museums | Художествени музеи
- History Museums | Исторически музеи
- Science Museums | Научни музеи
- Archaeological Museums | Археологически музеи
- Military Museums | Военни музеи

---

### L1: ✈️ TRAVEL & TOURS

#### L2: City Tours | Обиколки в града
**Slug:** `travel/city-tours`

**City (Attribute):**
- Sofia | София
- Plovdiv | Пловдив
- Varna | Варна
- Burgas | Бургас
- Veliko Tarnovo | Велико Търново
- Ruse | Русе

---

#### L2: Adventure Tours | Приключенски турове
**Slug:** `travel/adventure`

- Hiking Tours | Пешеходни турове
- Rafting | Рафтинг
- Paragliding | Парапланеризъм
- Rock Climbing | Скално катерене
- Caving | Спелеология
- Bungee Jumping | Бънджи скокове

---

#### L2: Wine & Food Tours | Вино и кулинарни турове
**Slug:** `travel/wine-food`

**Region (Attribute):**
- Thracian Valley | Тракийска низина
- Struma Valley | Долина на Струма
- Rose Valley | Розова долина
- Black Sea Coast | Черноморие

---

### L1: 🍽️ FOOD & DRINK

#### L2: Restaurant Vouchers | Ресторантски ваучери
**Slug:** `food/restaurant-vouchers`

**Cuisine (Attribute):**
- Bulgarian | Българска
- Italian | Италианска
- Japanese | Японска
- Mediterranean | Средиземноморска
- Fine Dining | Висша кухня

---

### L1: 💆 WELLNESS & SPA

#### L2: Hot Springs & Mineral Baths | Минерални бани
**Slug:** `wellness/hot-springs`

**Location (Attribute):**
- Velingrad | Велинград
- Hisarya | Хисаря
- Sandanski | Сандански
- Devin | Девин
- Bankya | Банкя

---

---

## 🏷️ Attribute System (The Power Layer)

### Event Ticket Attributes Schema

```typescript
interface TicketProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "concerts/rock-metal"
  
  // === BASIC INFO ===
  title: string;                 // "Metallica Live in Sofia - 2 Tickets"
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === EVENT INFO ===
  event_name: string;            // "Metallica WorldWired Tour"
  event_date: string;            // ISO date
  event_time: string;            // "20:00"
  doors_open: string;            // "18:00"
  
  // === VENUE ===
  venue_name: string;            // "Vasil Levski National Stadium"
  venue_city: string;            // "Sofia"
  venue_address?: string;
  venue_country: string;         // "Bulgaria"
  
  // === TICKET DETAILS ===
  ticket_type: TicketType;
  quantity_available: number;    // How many tickets for sale
  quantity_min: number;          // Minimum purchase (1)
  quantity_max: number;          // Maximum per buyer
  
  // === SEATING ===
  seating_type: SeatingType;
  section?: string;              // "VIP Zone", "Standing"
  row?: string;                  // "A", "1"
  seat_numbers?: string[];       // ["15", "16"]
  
  // === PRICING ===
  face_value: number;            // Original ticket price
  price_includes_fees: boolean;
  
  // === TICKET STATUS ===
  ticket_format: TicketFormat;
  instant_transfer: boolean;
  
  // === AUTHENTICITY ===
  is_original: boolean;
  purchase_source: string;       // "eventim.bg", "ticketstation"
  
  // === SELLER INFO ===
  seller_type: 'private' | 'reseller';
  seller_verified: boolean;
  location_city: string;
  
  // === LISTING META ===
  images: string[];
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS ===
  tags: string[];                // ["vip", "front-row", "last-minute"]
}

// === ENUMS ===

type TicketType = 
  | 'standard' | 'vip' | 'premium' | 'gold' | 'silver'
  | 'early_bird' | 'student' | 'group' | 'family';

type SeatingType = 
  | 'reserved' | 'general_admission' | 'standing' 
  | 'floor' | 'balcony' | 'box';

type TicketFormat = 
  | 'e_ticket' | 'pdf' | 'mobile_app' | 'physical' 
  | 'will_call' | 'transfer';
```

### Experience/Voucher Attributes Schema

```typescript
interface ExperienceProduct {
  id: string;
  category_id: string;
  
  title: string;                 // "Romantic Spa Weekend for 2"
  description: string;
  price: number;
  
  // === EXPERIENCE INFO ===
  experience_type: string;       // "Spa Package"
  provider_name: string;         // "Hotel Balneo Spa"
  
  // === VALIDITY ===
  valid_from?: string;           // ISO date
  valid_until: string;           // Expiration date
  validity_period: string;       // "6 months from purchase"
  
  // === PARTICIPANTS ===
  participants_included: number; // 2
  additional_participants: boolean;
  min_age?: number;
  
  // === DURATION ===
  duration: string;              // "3 hours", "Full day"
  
  // === INCLUDES ===
  includes: string[];            // ["Massage", "Sauna", "Pool"]
  
  // === LOCATION ===
  location_city: string;
  location_region: string;
  
  // === BOOKING ===
  booking_required: boolean;
  advance_booking_days: number;  // Book X days in advance
  
  // === DELIVERY ===
  voucher_format: 'digital' | 'physical' | 'both';
  instant_delivery: boolean;
  
  seller_type: 'private' | 'business' | 'provider';
  
  images: string[];
}
```

### Sports Ticket Attributes Schema

```typescript
interface SportsTicketProduct {
  id: string;
  category_id: string;           // "sports/football"
  
  title: string;                 // "CSKA vs Levski - 2 Tickets"
  description: string;
  price: number;
  
  // === MATCH INFO ===
  home_team: string;
  away_team: string;
  competition: string;           // "Bulgarian First League"
  match_date: string;
  
  // === VENUE ===
  stadium_name: string;
  stadium_city: string;
  
  // === TICKET DETAILS ===
  ticket_type: TicketType;
  quantity_available: number;
  
  // === SEATING ===
  sector: string;                // "A", "B", "VIP"
  row?: string;
  seat_numbers?: string[];
  view_quality: ViewQuality;
  
  // === TICKET INFO ===
  ticket_format: TicketFormat;
  fan_card_required: boolean;
  
  seller_type: 'private' | 'reseller';
  location_city: string;
  
  images: string[];
}

type ViewQuality = 'premium' | 'good' | 'standard' | 'limited';
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "This Weekend Events"
SELECT * FROM products 
WHERE category LIKE 'tickets/%'
AND attributes->>'event_date' BETWEEN NOW() AND NOW() + INTERVAL '3 days';

-- 🏷️ "VIP Tickets"
SELECT * FROM products 
WHERE category LIKE 'tickets/%'
AND attributes->>'ticket_type' = 'vip';

-- 🏷️ "Sofia Concerts"
SELECT * FROM products 
WHERE category LIKE 'tickets/concerts/%'
AND attributes->>'venue_city' = 'Sofia';

-- 🏷️ "Football Derbies"
SELECT * FROM products 
WHERE category = 'tickets/sports/football'
AND (
  (attributes->>'home_team' = 'CSKA Sofia' AND attributes->>'away_team' = 'Levski Sofia')
  OR (attributes->>'home_team' = 'Levski Sofia' AND attributes->>'away_team' = 'CSKA Sofia')
);

-- 🏷️ "Last Minute Deals"
SELECT * FROM products 
WHERE category LIKE 'tickets/%'
AND attributes->>'event_date' BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
AND price < (attributes->>'face_value')::numeric * 0.8;

-- 🏷️ "Spa Vouchers Under 200 лв"
SELECT * FROM products 
WHERE category LIKE 'tickets/wellness/%'
AND price <= 200;

-- 🏷️ "Group Tickets (4+)"
SELECT * FROM products 
WHERE category LIKE 'tickets/%'
AND (attributes->>'quantity_available')::int >= 4;
```

### Search Filter Configuration

```typescript
const ticketFilters = {
  // Price
  price: { type: 'range', min: 0, max: 1000, step: 10 },
  
  // Date
  event_date: { type: 'date-range', label: 'Дата на събитието' },
  
  // Location
  venue_city: { type: 'searchable-select', options: bulgarianCities },
  
  // Ticket Type
  ticket_type: { type: 'multi-select', options: ['standard', 'vip', 'premium'] },
  
  // Seating
  seating_type: { type: 'multi-select', options: seatingTypes },
  
  // Quantity
  quantity_available: { type: 'range', min: 1, max: 10 },
  
  // Format
  ticket_format: { type: 'multi-select', options: ['e_ticket', 'physical', 'mobile_app'] },
  instant_transfer: { type: 'checkbox' },
  
  // Seller
  seller_type: { type: 'radio', options: ['all', 'private', 'reseller'] },
};

const experienceFilters = {
  price: { type: 'range', min: 0, max: 2000 },
  
  location_city: { type: 'searchable-select', options: cities },
  
  participants: { type: 'range', min: 1, max: 10 },
  
  valid_until: { type: 'date' },
  
  instant_delivery: { type: 'checkbox' },
  
  booking_required: { type: 'checkbox' },
};
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('tickets', 'Tickets & Experiences', 'Билети и преживявания', 'tickets', 'tickets', NULL, 0, '🎟️', 38, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('tk-concerts', 'Concerts & Music', 'Концерти и музика', 'concerts', 'tickets/concerts', 'tickets', 1, '🎵', 1, true),
('tk-sports', 'Sports', 'Спорт', 'sports', 'tickets/sports', 'tickets', 1, '⚽', 2, true),
('tk-theatre', 'Theatre & Arts', 'Театър и изкуства', 'theatre', 'tickets/theatre', 'tickets', 1, '🎭', 3, true),
('tk-cinema', 'Cinema & Screenings', 'Кино и прожекции', 'cinema', 'tickets/cinema', 'tickets', 1, '🎬', 4, true),
('tk-gaming', 'Gaming & Esports', 'Гейминг и Esports', 'gaming', 'tickets/gaming', 'tickets', 1, '🎮', 5, true),
('tk-conferences', 'Conferences & Seminars', 'Конференции и семинари', 'conferences', 'tickets/conferences', 'tickets', 1, '📚', 6, true),
('tk-attractions', 'Theme Parks & Attractions', 'Атракции', 'attractions', 'tickets/attractions', 'tickets', 1, '🎡', 7, true),
('tk-travel', 'Travel & Tours', 'Пътувания и турове', 'travel', 'tickets/travel', 'tickets', 1, '✈️', 8, true),
('tk-food', 'Food & Drink Experiences', 'Храна и напитки', 'food', 'tickets/food', 'tickets', 1, '🍽️', 9, true),
('tk-wellness', 'Wellness & Spa', 'Уелнес и спа', 'wellness', 'tickets/wellness', 'tickets', 1, '💆', 10, true),
('tk-gifts', 'Gift Experiences', 'Подаръци преживявания', 'gifts', 'tickets/gifts', 'tickets', 1, '🎁', 11, true),
('tk-special', 'Special Events', 'Специални събития', 'special', 'tickets/special', 'tickets', 1, '🎪', 12, true);

-- L2: Concerts
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('con-rock', 'Rock & Metal', 'Рок и метъл', 'rock-metal', 'concerts/rock-metal', 'tk-concerts', 2, '🎸', 1, true),
('con-pop', 'Pop & Electronic', 'Поп и електронна', 'pop-electronic', 'concerts/pop-electronic', 'tk-concerts', 2, '🎤', 2, true),
('con-hiphop', 'Hip-Hop & R&B', 'Хип-хоп и R&B', 'hiphop-rnb', 'concerts/hiphop-rnb', 'tk-concerts', 2, '🎧', 3, true),
('con-jazz', 'Jazz & Blues', 'Джаз и блус', 'jazz-blues', 'concerts/jazz-blues', 'tk-concerts', 2, '🎷', 4, true),
('con-classical', 'Classical & Opera', 'Класика и опера', 'classical-opera', 'concerts/classical-opera', 'tk-concerts', 2, '🎻', 5, true),
('con-folk', 'Folk & Chalga', 'Фолк и чалга', 'folk-chalga', 'concerts/folk-chalga', 'tk-concerts', 2, '🪗', 6, true),
('con-festivals', 'Festivals', 'Фестивали', 'festivals', 'concerts/festivals', 'tk-concerts', 2, '🎪', 7, true),
('con-dj', 'DJ Sets & Club Events', 'DJ и клубни събития', 'dj-club', 'concerts/dj-club', 'tk-concerts', 2, '🎛️', 8, true);

-- L2: Sports
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('sp-football', 'Football', 'Футбол', 'football', 'sports/football', 'tk-sports', 2, '⚽', 1, true),
('sp-basketball', 'Basketball', 'Баскетбол', 'basketball', 'sports/basketball', 'tk-sports', 2, '🏀', 2, true),
('sp-tennis', 'Tennis', 'Тенис', 'tennis', 'sports/tennis', 'tk-sports', 2, '🎾', 3, true),
('sp-volleyball', 'Volleyball', 'Волейбол', 'volleyball', 'sports/volleyball', 'tk-sports', 2, '🏐', 4, true),
('sp-motorsports', 'Motor Sports', 'Моторни спортове', 'motorsports', 'sports/motorsports', 'tk-sports', 2, '🏎️', 5, true),
('sp-combat', 'Combat Sports', 'Бойни спортове', 'combat', 'sports/combat', 'tk-sports', 2, '🥊', 6, true),
('sp-winter', 'Winter Sports', 'Зимни спортове', 'winter', 'sports/winter', 'tk-sports', 2, '⛷️', 7, true),
('sp-other', 'Other Sports', 'Други спортове', 'other', 'sports/other', 'tk-sports', 2, '🏅', 8, true);

-- L2: Theatre
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('th-drama', 'Drama & Theatre', 'Драма и театър', 'drama', 'theatre/drama', 'tk-theatre', 2, '🎭', 1, true),
('th-musicals', 'Musicals', 'Мюзикъли', 'musicals', 'theatre/musicals', 'tk-theatre', 2, '🎼', 2, true),
('th-ballet', 'Ballet & Dance', 'Балет и танц', 'ballet', 'theatre/ballet', 'tk-theatre', 2, '🩰', 3, true),
('th-comedy', 'Comedy Shows', 'Комедийни шоута', 'comedy', 'theatre/comedy', 'tk-theatre', 2, '😄', 4, true),
('th-standup', 'Stand-Up Comedy', 'Стендъп комедия', 'standup', 'theatre/standup', 'tk-theatre', 2, '🎤', 5, true),
('th-circus', 'Circus & Cabaret', 'Цирк и кабаре', 'circus', 'theatre/circus', 'tk-theatre', 2, '🎪', 6, true);

-- L2: Travel & Tours
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('tr-city', 'City Tours', 'Обиколки в града', 'city-tours', 'travel/city-tours', 'tk-travel', 2, '🏙️', 1, true),
('tr-adventure', 'Adventure Tours', 'Приключенски турове', 'adventure', 'travel/adventure', 'tk-travel', 2, '🏔️', 2, true),
('tr-wine', 'Wine & Food Tours', 'Вино и кулинария', 'wine-food', 'travel/wine-food', 'tk-travel', 2, '🍷', 3, true),
('tr-cultural', 'Cultural Experiences', 'Културни преживявания', 'cultural', 'travel/cultural', 'tk-travel', 2, '🏛️', 4, true),
('tr-nature', 'Nature & Wildlife', 'Природа и дивата природа', 'nature', 'travel/nature', 'tk-travel', 2, '🌲', 5, true),
('tr-cruises', 'Cruises', 'Круизи', 'cruises', 'travel/cruises', 'tk-travel', 2, '🚢', 6, true);

-- L2: Wellness
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('well-spa', 'Spa Packages', 'Спа пакети', 'spa', 'wellness/spa', 'tk-wellness', 2, '🧖', 1, true),
('well-massage', 'Massage Sessions', 'Масажи', 'massage', 'wellness/massage', 'tk-wellness', 2, '💆', 2, true),
('well-yoga', 'Yoga & Meditation', 'Йога и медитация', 'yoga', 'wellness/yoga', 'tk-wellness', 2, '🧘', 3, true),
('well-springs', 'Hot Springs & Mineral Baths', 'Минерални бани', 'hot-springs', 'wellness/hot-springs', 'tk-wellness', 2, '♨️', 4, true),
('well-beauty', 'Beauty Treatments', 'Козметични процедури', 'beauty', 'wellness/beauty', 'tk-wellness', 2, '💅', 5, true);
```

### Bulgarian Venues Reference Data

```sql
-- Major Venues
INSERT INTO public.venues (id, name, name_bg, city, capacity, type) VALUES
('arena-sofia', 'Arena Armeec Sofia', 'Арена Армеец София', 'Sofia', 12373, 'arena'),
('ndk', 'National Palace of Culture', 'НДК', 'Sofia', 8000, 'cultural'),
('vasil-levski', 'Vasil Levski National Stadium', 'Стадион Васил Левски', 'Sofia', 43000, 'stadium'),
('bulgarska-armia', 'Bulgarian Army Stadium', 'Стадион Българска армия', 'Sofia', 22015, 'stadium'),
('georgi-asparuhov', 'Georgi Asparuhov Stadium', 'Стадион Георги Аспарухов', 'Sofia', 29200, 'stadium'),
('plovdiv-roman', 'Ancient Theatre of Plovdiv', 'Античен театър Пловдив', 'Plovdiv', 7000, 'amphitheatre'),
('festival-hall', 'Festival Hall', 'Фестивална зала', 'Varna', 3200, 'concert_hall');
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Tickets & Experiences | Билети и преживявания |
| Concerts & Music | Концерти и музика |
| Sports | Спорт |
| Theatre & Arts | Театър и изкуства |
| Gaming & Esports | Гейминг и Esports |
| Travel & Tours | Пътувания и турове |
| Wellness & Spa | Уелнес и спа |
| Gift Experiences | Подаръци преживявания |

### Attribute Labels

| EN | BG |
|----|----|
| Event Date | Дата на събитието |
| Event Time | Час |
| Venue | Място |
| Ticket Type | Тип билет |
| Quantity | Количество |
| Section | Сектор |
| Row | Ред |
| Seat | Място |
| Face Value | Номинална стойност |
| Instant Transfer | Мигновен трансфер |

### Attribute Values

| EN | BG |
|----|----|
| VIP | VIP |
| Premium | Премиум |
| Standard | Стандартен |
| Standing | Права |
| Reserved | Запазени места |
| General Admission | Свободен достъп |
| E-Ticket | Електронен билет |
| Physical | Физически билет |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add venues reference data
- [ ] Add Bulgarian teams reference
- [ ] Test JSONB queries for date ranges
- [ ] Verify indexes for event_date

### API
- [ ] GET /categories/tickets (tree structure)
- [ ] GET /categories/tickets/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)
- [ ] GET /products/upcoming (date-based)

### Frontend
- [ ] Event calendar view
- [ ] Ticket quantity selector
- [ ] Seating chart component (if available)
- [ ] Date filter component
- [ ] City filter
- [ ] Results grid/list view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Structured data for events
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 75  
**Created:** December 3, 2025

````

