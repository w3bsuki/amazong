# ⚽ Sports & Outdoors | Спорт и туризъм

**Category Slug:** `sports`  
**Icon:** ⚽  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Sports → Cycling → Bikes |
| **Attributes** | Filtering, Search, Campaigns | Brand, Size, Material, Sport Type |
| **Tags** | Dynamic Collections & SEO | "professional", "beginner", "outdoor" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
⚽ Sports & Outdoors (L0)
│
├── 🏋️ Exercise & Fitness (L1)
│   ├── Cardio Equipment (L2)
│   ├── Strength Training (L2)
│   ├── Yoga & Pilates (L2)
│   ├── Fitness Accessories (L2)
│   ├── Fitness Trackers (L2)
│   └── Home Gym (L2)
│
├── 🚴 Cycling (L1)
│   ├── Bikes (L2)
│   ├── Bike Parts (L2)
│   ├── Bike Accessories (L2)
│   ├── Bike Clothing (L2)
│   ├── Bike Helmets (L2)
│   └── E-Bikes (L2)
│
├── ⚽ Team Sports (L1)
│   ├── Football/Soccer (L2)
│   ├── Basketball (L2)
│   ├── Volleyball (L2)
│   ├── Tennis (L2)
│   ├── Hockey (L2)
│   └── Baseball/Softball (L2)
│
├── 🏊 Water Sports (L1)
│   ├── Swimming (L2)
│   ├── Surfing (L2)
│   ├── Diving (L2)
│   ├── Kayaking & Canoeing (L2)
│   ├── Fishing (L2)
│   └── Boating (L2)
│
├── ⛷️ Winter Sports (L1)
│   ├── Skiing (L2)
│   ├── Snowboarding (L2)
│   ├── Ice Skating (L2)
│   ├── Winter Clothing (L2)
│   └── Winter Accessories (L2)
│
├── 🥾 Hiking & Camping (L1)
│   ├── Tents (L2)
│   ├── Sleeping Bags (L2)
│   ├── Backpacks (L2)
│   ├── Hiking Gear (L2)
│   ├── Camping Cooking (L2)
│   ├── Camping Furniture (L2)
│   └── Navigation & Tools (L2)
│
├── 🏃 Running (L1)
│   ├── Running Shoes (L2)
│   ├── Running Clothing (L2)
│   ├── Running Accessories (L2)
│   └── GPS Watches (L2)
│
├── 🥊 Combat Sports (L1)
│   ├── Boxing (L2)
│   ├── MMA (L2)
│   ├── Wrestling (L2)
│   └── Martial Arts (L2)
│
├── 🎿 Extreme Sports (L1)
│   ├── Skateboarding (L2)
│   ├── Rollerblading (L2)
│   ├── BMX (L2)
│   ├── Scooters (L2)
│   └── Climbing (L2)
│
├── 🏌️ Golf (L1)
│   ├── Golf Clubs (L2)
│   ├── Golf Balls (L2)
│   ├── Golf Bags (L2)
│   ├── Golf Clothing (L2)
│   └── Golf Accessories (L2)
│
└── 🎾 Racquet Sports (L1)
    ├── Tennis (L2)
    ├── Badminton (L2)
    ├── Squash (L2)
    └── Table Tennis (L2)
```

**Total Categories: 1 (L0) + 11 (L1) + 52 (L2) = 64 categories**

---

## 📊 Complete Category Reference

### L1: 🏋️ EXERCISE & FITNESS

#### L2: Cardio Equipment | Кардио уреди
**Slug:** `sports/fitness/cardio`

| EN | BG | Description |
|----|----|----|
| Treadmills | Бягащи пътеки | Running machines |
| Exercise Bikes | Велоергометри | Stationary bikes |
| Ellipticals | Елиптични | Cross trainers |
| Rowing Machines | Гребни тренажори | Rowers |
| Stair Climbers | Стълбени машини | Step machines |
| Jump Ropes | Въжета за скачане | Skipping ropes |

---

#### L2: Strength Training | Силови тренировки
**Slug:** `sports/fitness/strength`

| EN | BG | Description |
|----|----|----|
| Dumbbells | Дъмбели | Free weights |
| Barbells | Щанги | Bar weights |
| Kettlebells | Гири | Bell weights |
| Weight Plates | Дискове | Weight discs |
| Resistance Bands | Ластици | Elastic bands |
| Pull-Up Bars | Лостове | Chin-up bars |
| Weight Benches | Пейки | Gym benches |
| Power Racks | Клетки | Squat racks |

---

#### L2: Yoga & Pilates | Йога и пилатес
**Slug:** `sports/fitness/yoga-pilates`

- Yoga Mats | Постелки за йога
- Yoga Blocks | Блокове за йога
- Yoga Straps | Колани за йога
- Pilates Balls | Топки за пилатес
- Foam Rollers | Ролери
- Meditation Cushions | Възглавници за медитация

---

#### L2: Fitness Accessories | Фитнес аксесоари
**Slug:** `sports/fitness/accessories`

- Gym Bags | Спортни чанти
- Water Bottles | Бутилки за вода
- Towels | Кърпи
- Gym Gloves | Ръкавици
- Wrist Wraps | Бинтове
- Belts | Колани

---

### L1: 🚴 CYCLING

#### L2: Bikes | Велосипеди
**Slug:** `sports/cycling/bikes`

| EN | BG | Description |
|----|----|----|
| Road Bikes | Шосейни | Racing bikes |
| Mountain Bikes | Планински | MTB |
| City Bikes | Градски | Urban bikes |
| BMX Bikes | BMX | Trick bikes |
| Gravel Bikes | Гравел | Adventure bikes |
| Folding Bikes | Сгъваеми | Compact bikes |
| Kids Bikes | Детски | Children's bikes |

---

#### L2: Bike Parts | Части за велосипеди
**Slug:** `sports/cycling/parts`

- Frames | Рамки
- Wheels | Колела
- Tires | Гуми
- Brakes | Спирачки
- Gears | Скорости
- Handlebars | Кормила
- Saddles | Седалки
- Pedals | Педали

---

#### L2: Bike Accessories | Аксесоари
**Slug:** `sports/cycling/accessories`

- Lights | Светлини
- Locks | Катинари
- Pumps | Помпи
- Bike Computers | Велокомпютри
- Carriers | Багажници
- Bottles & Cages | Бутилки и поставки

---

### L1: ⚽ TEAM SPORTS

#### L2: Football/Soccer | Футбол
**Slug:** `sports/team-sports/football`

| EN | BG | Description |
|----|----|----|
| Footballs | Футболни топки | Balls |
| Football Boots | Бутонки | Cleats |
| Shin Guards | Кори за пищял | Protection |
| Goalkeeper Gloves | Вратарски ръкавици | Goalie gloves |
| Football Goals | Врати | Goals |
| Training Equipment | Тренировъчни уреди | Cones, ladders |
| Jerseys | Екипи | Kits |

---

#### L2: Basketball | Баскетбол
**Slug:** `sports/team-sports/basketball`

- Basketballs | Баскетболни топки
- Basketball Shoes | Баскетболни обувки
- Basketball Hoops | Кошове
- Jerseys | Екипи
- Arm Sleeves | Ръкави

---

#### L2: Tennis | Тенис
**Slug:** `sports/team-sports/tennis`

- Tennis Rackets | Тенис ракети
- Tennis Balls | Тенис топки
- Tennis Shoes | Тенис обувки
- Tennis Bags | Чанти за тенис
- Tennis Strings | Кордажи
- Grips | Грипове

---

### L1: 🥾 HIKING & CAMPING

#### L2: Tents | Палатки
**Slug:** `sports/camping/tents`

| EN | BG | Description |
|----|----|----|
| Backpacking Tents | Туристически палатки | Lightweight |
| Family Tents | Семейни палатки | Large |
| Camping Tents | Къмпинг палатки | General use |
| Pop-up Tents | Саморазгъващи се | Instant setup |
| Hammock Tents | Хамак палатки | Suspended |
| Tent Accessories | Аксесоари за палатки | Stakes, poles |

---

#### L2: Sleeping Bags | Спални чували
**Slug:** `sports/camping/sleeping-bags`

- Summer Sleeping Bags | Летни спални чували
- 3-Season Sleeping Bags | 3-сезонни
- Winter Sleeping Bags | Зимни спални чували
- Sleeping Pads | Постелки
- Camping Pillows | Възглавници

---

#### L2: Backpacks | Раници
**Slug:** `sports/camping/backpacks`

- Daypacks | Раници за ден
- Hiking Backpacks | Туристически раници
- Expedition Packs | Експедиционни раници
- Hydration Packs | Хидратационни раници
- Backpack Accessories | Аксесоари

---

### L1: ⛷️ WINTER SPORTS

#### L2: Skiing | Ски
**Slug:** `sports/winter/skiing`

| EN | BG | Description |
|----|----|----|
| Skis | Ски | Alpine skis |
| Ski Boots | Ски обувки | Boots |
| Ski Bindings | Автомати | Bindings |
| Ski Poles | Щеки | Poles |
| Ski Helmets | Ски каски | Helmets |
| Ski Goggles | Ски маски | Goggles |

---

#### L2: Snowboarding | Сноуборд
**Slug:** `sports/winter/snowboarding`

- Snowboards | Сноубордове
- Snowboard Boots | Сноуборд обувки
- Snowboard Bindings | Автомати
- Snowboard Helmets | Каски
- Snowboard Goggles | Маски

---

---

## 🏷️ Attribute System (The Power Layer)

### Sports Product Attributes Schema

```typescript
interface SportsProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === PRODUCT INFO ===
  brand: string;
  model?: string;
  year?: number;
  
  // === SPORT SPECIFICS ===
  sport_type: string[];
  skill_level: SkillLevel;
  gender?: Gender;
  
  // === SIZE & FIT ===
  size?: string;
  size_type?: 'EU' | 'US' | 'UK' | 'universal';
  weight_kg?: number;
  
  // === BIKE SPECIFICS ===
  frame_size?: string;
  wheel_size?: string;
  frame_material?: FrameMaterial;
  
  // === CAMPING SPECIFICS ===
  capacity?: number;
  season_rating?: SeasonRating;
  temperature_rating?: number;
  
  // === CONDITION ===
  condition: ProductCondition;
  
  seller_type: 'private' | 'dealer' | 'store';
  location_city: string;
  
  images: string[];
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';
type Gender = 'mens' | 'womens' | 'unisex' | 'kids';
type FrameMaterial = 'aluminum' | 'carbon' | 'steel' | 'titanium';
type SeasonRating = '1_season' | '2_season' | '3_season' | '4_season';
type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('sports', 'Sports & Outdoors', 'Спорт и туризъм', 'sports', 'sports', NULL, 0, '⚽', 11, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('sports-fitness', 'Exercise & Fitness', 'Фитнес', 'fitness', 'sports/fitness', 'sports', 1, '🏋️', 1, true),
('sports-cycling', 'Cycling', 'Колоездене', 'cycling', 'sports/cycling', 'sports', 1, '🚴', 2, true),
('sports-team', 'Team Sports', 'Отборни спортове', 'team-sports', 'sports/team-sports', 'sports', 1, '⚽', 3, true),
('sports-water', 'Water Sports', 'Водни спортове', 'water-sports', 'sports/water-sports', 'sports', 1, '🏊', 4, true),
('sports-winter', 'Winter Sports', 'Зимни спортове', 'winter-sports', 'sports/winter-sports', 'sports', 1, '⛷️', 5, true),
('sports-camping', 'Hiking & Camping', 'Туризъм и къмпинг', 'hiking-camping', 'sports/hiking-camping', 'sports', 1, '🥾', 6, true),
('sports-running', 'Running', 'Бягане', 'running', 'sports/running', 'sports', 1, '🏃', 7, true),
('sports-combat', 'Combat Sports', 'Бойни спортове', 'combat-sports', 'sports/combat-sports', 'sports', 1, '🥊', 8, true),
('sports-extreme', 'Extreme Sports', 'Екстремни спортове', 'extreme-sports', 'sports/extreme-sports', 'sports', 1, '🎿', 9, true),
('sports-golf', 'Golf', 'Голф', 'golf', 'sports/golf', 'sports', 1, '🏌️', 10, true),
('sports-racquet', 'Racquet Sports', 'Ракетни спортове', 'racquet-sports', 'sports/racquet-sports', 'sports', 1, '🎾', 11, true);

-- L2: Fitness
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('fitness-cardio', 'Cardio Equipment', 'Кардио уреди', 'cardio', 'sports/fitness/cardio', 'sports-fitness', 2, '❤️', 1, true),
('fitness-strength', 'Strength Training', 'Силови тренировки', 'strength', 'sports/fitness/strength', 'sports-fitness', 2, '💪', 2, true),
('fitness-yoga', 'Yoga & Pilates', 'Йога и пилатес', 'yoga-pilates', 'sports/fitness/yoga-pilates', 'sports-fitness', 2, '🧘', 3, true),
('fitness-accessories', 'Fitness Accessories', 'Фитнес аксесоари', 'accessories', 'sports/fitness/accessories', 'sports-fitness', 2, '🎽', 4, true),
('fitness-trackers', 'Fitness Trackers', 'Фитнес тракери', 'trackers', 'sports/fitness/trackers', 'sports-fitness', 2, '⌚', 5, true),
('fitness-home-gym', 'Home Gym', 'Домашен фитнес', 'home-gym', 'sports/fitness/home-gym', 'sports-fitness', 2, '🏠', 6, true);

-- L2: Cycling
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cycling-bikes', 'Bikes', 'Велосипеди', 'bikes', 'sports/cycling/bikes', 'sports-cycling', 2, '🚲', 1, true),
('cycling-parts', 'Bike Parts', 'Части', 'parts', 'sports/cycling/parts', 'sports-cycling', 2, '⚙️', 2, true),
('cycling-accessories', 'Bike Accessories', 'Аксесоари', 'accessories', 'sports/cycling/accessories', 'sports-cycling', 2, '🔦', 3, true),
('cycling-clothing', 'Bike Clothing', 'Облекло', 'clothing', 'sports/cycling/clothing', 'sports-cycling', 2, '👕', 4, true),
('cycling-helmets', 'Bike Helmets', 'Каски', 'helmets', 'sports/cycling/helmets', 'sports-cycling', 2, '⛑️', 5, true),
('cycling-ebikes', 'E-Bikes', 'Електрически велосипеди', 'e-bikes', 'sports/cycling/e-bikes', 'sports-cycling', 2, '⚡', 6, true);

-- L2: Team Sports
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('team-football', 'Football/Soccer', 'Футбол', 'football', 'sports/team-sports/football', 'sports-team', 2, '⚽', 1, true),
('team-basketball', 'Basketball', 'Баскетбол', 'basketball', 'sports/team-sports/basketball', 'sports-team', 2, '🏀', 2, true),
('team-volleyball', 'Volleyball', 'Волейбол', 'volleyball', 'sports/team-sports/volleyball', 'sports-team', 2, '🏐', 3, true),
('team-tennis', 'Tennis', 'Тенис', 'tennis', 'sports/team-sports/tennis', 'sports-team', 2, '🎾', 4, true),
('team-hockey', 'Hockey', 'Хокей', 'hockey', 'sports/team-sports/hockey', 'sports-team', 2, '🏒', 5, true);

-- L2: Winter Sports
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('winter-skiing', 'Skiing', 'Ски', 'skiing', 'sports/winter-sports/skiing', 'sports-winter', 2, '⛷️', 1, true),
('winter-snowboarding', 'Snowboarding', 'Сноуборд', 'snowboarding', 'sports/winter-sports/snowboarding', 'sports-winter', 2, '🏂', 2, true),
('winter-skating', 'Ice Skating', 'Кънки', 'ice-skating', 'sports/winter-sports/ice-skating', 'sports-winter', 2, '⛸️', 3, true),
('winter-clothing', 'Winter Clothing', 'Зимно облекло', 'clothing', 'sports/winter-sports/clothing', 'sports-winter', 2, '🧥', 4, true);

-- L2: Camping
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('camping-tents', 'Tents', 'Палатки', 'tents', 'sports/hiking-camping/tents', 'sports-camping', 2, '⛺', 1, true),
('camping-sleeping', 'Sleeping Bags', 'Спални чували', 'sleeping-bags', 'sports/hiking-camping/sleeping-bags', 'sports-camping', 2, '🛏️', 2, true),
('camping-backpacks', 'Backpacks', 'Раници', 'backpacks', 'sports/hiking-camping/backpacks', 'sports-camping', 2, '🎒', 3, true),
('camping-hiking', 'Hiking Gear', 'Туристическо оборудване', 'hiking-gear', 'sports/hiking-camping/hiking-gear', 'sports-camping', 2, '🥾', 4, true),
('camping-cooking', 'Camping Cooking', 'Готвене на къмпинг', 'cooking', 'sports/hiking-camping/cooking', 'sports-camping', 2, '🍳', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Sports & Outdoors | Спорт и туризъм |
| Exercise & Fitness | Фитнес |
| Cycling | Колоездене |
| Team Sports | Отборни спортове |
| Winter Sports | Зимни спортове |
| Hiking & Camping | Туризъм и къмпинг |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Size | Размер |
| Skill Level | Ниво |
| Sport Type | Вид спорт |
| Condition | Състояние |
| Gender | Пол |

### Skill Levels

| EN | BG |
|----|----|
| Beginner | Начинаещ |
| Intermediate | Средно напреднал |
| Advanced | Напреднал |
| Professional | Професионален |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add sports brands reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/sports (tree structure)
- [ ] GET /categories/sports/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Size selectors
- [ ] Skill level filter
- [ ] Brand filter
- [ ] Results grid/list view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 64  
**Created:** December 3, 2025
