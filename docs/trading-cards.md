````markdown
# 🃏 Trading Cards & TCG | Колекционерски карти

**Category Slug:** `trading-cards`  
**Icon:** 🃏  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Trading Cards → Pokémon → Booster Packs |
| **Attributes** | Filtering, Search, Campaigns | Condition, Grading, Set, Rarity, PSA Score |
| **Tags** | Dynamic Collections & SEO | "graded", "vintage", "first-edition" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🃏 Trading Cards & TCG (L0)
│
├── ⚡ Pokémon (L1)
│   ├── Booster Packs (L2)
│   ├── Booster Boxes (L2)
│   ├── Elite Trainer Boxes (L2)
│   ├── Single Cards (L2)
│   ├── Graded Cards (L2)
│   ├── Complete Sets (L2)
│   ├── Theme Decks (L2)
│   ├── Promo Cards (L2)
│   ├── Japanese Cards (L2)
│   └── Vintage (Pre-2010) (L2)
│
├── ⚔️ Magic: The Gathering (L1)
│   ├── Booster Packs (L2)
│   ├── Booster Boxes (L2)
│   ├── Bundle Boxes (L2)
│   ├── Single Cards (L2)
│   ├── Graded Cards (L2)
│   ├── Commander Decks (L2)
│   ├── Challenger Decks (L2)
│   ├── Secret Lair (L2)
│   ├── Vintage & Reserved List (L2)
│   └── Foils & Special Editions (L2)
│
├── 👹 Yu-Gi-Oh! (L1)
│   ├── Booster Packs (L2)
│   ├── Booster Boxes (L2)
│   ├── Structure Decks (L2)
│   ├── Single Cards (L2)
│   ├── Graded Cards (L2)
│   ├── Tin Sets (L2)
│   ├── Speed Duel (L2)
│   └── OCG Japanese (L2)
│
├── ⚽ Sports Cards (L1)
│   ├── Football/Soccer (L2)
│   ├── Basketball (L2)
│   ├── American Football (L2)
│   ├── Baseball (L2)
│   ├── Hockey (L2)
│   ├── Tennis (L2)
│   ├── Formula 1 (L2)
│   ├── UFC/MMA (L2)
│   └── Wrestling (L2)
│
├── 🎮 Other TCGs (L1)
│   ├── One Piece (L2)
│   ├── Dragon Ball (L2)
│   ├── Digimon (L2)
│   ├── Flesh and Blood (L2)
│   ├── Lorcana (L2)
│   ├── Weiss Schwarz (L2)
│   ├── Cardfight Vanguard (L2)
│   └── Star Wars Unlimited (L2)
│
├── 🏆 Graded Cards (L1)
│   ├── PSA Graded (L2)
│   ├── BGS/Beckett Graded (L2)
│   ├── CGC Graded (L2)
│   ├── SGC Graded (L2)
│   └── Other Grading (L2)
│
├── 📦 Sealed Products (L1)
│   ├── Booster Boxes (L2)
│   ├── Case Lots (L2)
│   ├── Collector Boxes (L2)
│   ├── Starter Sets (L2)
│   └── Gift Sets (L2)
│
├── 🎯 Accessories (L1)
│   ├── Card Sleeves (L2)
│   ├── Deck Boxes (L2)
│   ├── Binders & Albums (L2)
│   ├── Top Loaders & Holders (L2)
│   ├── Playmats (L2)
│   ├── Display Cases (L2)
│   └── Grading Supplies (L2)
│
└── 📚 Memorabilia (L1)
    ├── Autographed Cards (L2)
    ├── Game-Used/Relic Cards (L2)
    ├── Patch Cards (L2)
    ├── Numbered Cards (L2)
    └── Printing Plates (L2)
```

**Total Categories: 1 (L0) + 9 (L1) + 65 (L2) = 75 categories**

---

## 📊 Complete Category Reference

### L1: ⚡ POKÉMON

#### L2: Booster Packs | Бустер пакове
**Slug:** `pokemon/booster-packs`  
**Description:** Sealed Pokémon TCG booster packs from various sets.

**Set/Era (Attribute, not subcategory):**

| EN | BG | Era |
|----|----|----|
| Scarlet & Violet | Scarlet & Violet | Current |
| Paldea Evolved | Paldea Evolved | Current |
| Obsidian Flames | Obsidian Flames | Current |
| Paradox Rift | Paradox Rift | Current |
| Sword & Shield | Sword & Shield | Modern |
| Sun & Moon | Sun & Moon | Modern |
| XY | XY | Legacy |
| Black & White | Black & White | Legacy |
| HeartGold SoulSilver | HeartGold SoulSilver | Vintage |
| Base Set | Base Set | Vintage |
| Jungle | Jungle | Vintage |
| Fossil | Fossil | Vintage |

---

#### L2: Single Cards | Единични карти
**Slug:** `pokemon/singles`

**Rarity (Attribute):**
- Common | Обичайна
- Uncommon | Необичайна
- Rare | Рядка
- Holo Rare | Холографска рядка
- Reverse Holo | Обратен холо
- Ultra Rare | Ултра рядка
- Secret Rare | Секретна рядка
- Full Art | Пълен арт
- Alt Art | Алтернативен арт
- Gold | Златна
- Rainbow | Дъга
- Special Art Rare | SAR
- Illustration Rare | IR

---

#### L2: Graded Cards | Оценени карти
**Slug:** `pokemon/graded`

**Popular Graded Cards (Attribute):**
- Charizard | Charizard
- Pikachu | Pikachu
- Mewtwo | Mewtwo
- Blastoise | Blastoise
- Venusaur | Venusaur
- First Edition | Първо издание
- Shadowless | Без сянка
- Gold Star | Златна звезда

---

#### L2: Japanese Cards | Японски карти
**Slug:** `pokemon/japanese`

- Japanese Booster Packs | Японски бустери
- Japanese Singles | Японски единични
- CHR/CSR Cards | CHR/CSR карти
- Promo Cards | Промо карти
- Exclusive Japanese Sets | Ексклузивни японски сетове

---

### L1: ⚔️ MAGIC: THE GATHERING

#### L2: Single Cards | Единични карти
**Slug:** `mtg/singles`

**Card Type (Attribute):**
- Creature | Същество
- Instant | Мигновено
- Sorcery | Магия
- Enchantment | Омагьосване
- Artifact | Артефакт
- Planeswalker | Planeswalker
- Land | Земя

**Format Legality (Attribute):**
- Standard | Стандарт
- Modern | Модерн
- Legacy | Легаси
- Vintage | Винтидж
- Commander | Командир
- Pioneer | Пионер
- Pauper | Паупер

---

#### L2: Commander Decks | Командир колоди
**Slug:** `mtg/commander`

- Precon Commander | Готови колоди
- Custom Commander | Персонализирани
- cEDH | cEDH

---

#### L2: Vintage & Reserved List | Винтидж и Reserved List
**Slug:** `mtg/vintage`

**Iconic Cards:**
- Black Lotus | Black Lotus
- Mox Pearl/Sapphire/Jet/Ruby/Emerald | Mox-ове
- Ancestral Recall | Ancestral Recall
- Time Walk | Time Walk
- Underground Sea | Underground Sea
- Dual Lands | Двойни земи
- Power 9 | Power 9

---

### L1: 👹 YU-GI-OH!

#### L2: Single Cards | Единични карти
**Slug:** `yugioh/singles`

**Rarity (Attribute):**
- Common | Обичайна
- Rare | Рядка
- Super Rare | Супер рядка
- Ultra Rare | Ултра рядка
- Secret Rare | Секретна рядка
- Ultimate Rare | Ултимейт рядка
- Ghost Rare | Призрачна рядка
- Starlight Rare | Звездна рядка
- Collector's Rare | Колекционерска

---

### L1: ⚽ SPORTS CARDS

#### L2: Football/Soccer | Футбол
**Slug:** `sports/football`

**Brands (Attribute):**
- Topps | Topps
- Panini | Panini
- Match Attax | Match Attax
- Donruss | Donruss
- Select | Select
- Prizm | Prizm

**Leagues (Attribute):**
- Premier League | Премиър лига
- La Liga | Ла Лига
- Bundesliga | Бундеслига
- Serie A | Серия А
- Ligue 1 | Лига 1
- UEFA Champions League | Шампионска лига
- World Cup | Световно първенство
- Bulgarian League | Българска лига

**Popular Players:**
- Messi | Меси
- Ronaldo | Роналдо
- Mbappé | Мбапе
- Haaland | Холанд
- Bellingham | Белингам
- Stoichkov | Стоичков (Bulgarian Legend)
- Berbatov | Бербатов

---

#### L2: Basketball | Баскетбол
**Slug:** `sports/basketball`

**Brands:**
- Panini Prizm | Panini Prizm
- NBA Hoops | NBA Hoops
- Donruss Optic | Donruss Optic
- Select | Select
- Mosaic | Mosaic
- Contenders | Contenders

**Popular Players:**
- LeBron James | Леброн Джеймс
- Michael Jordan | Майкъл Джордан
- Kobe Bryant | Коби Брайънт
- Luka Dončić | Лука Дончич
- Giannis Antetokounmpo | Янис Антетокумбо

---

### L1: 🎮 OTHER TCGs

#### L2: One Piece TCG | One Piece TCG
**Slug:** `tcg/one-piece`

- Booster Packs | Бустер пакове
- Starter Decks | Стартови колоди
- Singles | Единични карти
- Leader Cards | Лидер карти
- Japanese Product | Японски продукти

---

#### L2: Lorcana | Lorcana
**Slug:** `tcg/lorcana`

- Booster Packs | Бустер пакове
- Starter Decks | Стартови колоди
- Gift Sets | Подаръчни сетове
- Singles | Единични карти
- Enchanted Cards | Омагьосани карти

---

### L1: 🏆 GRADED CARDS

#### L2: PSA Graded | PSA оценени
**Slug:** `graded/psa`

**PSA Grades (Attribute):**
- PSA 10 Gem Mint | PSA 10
- PSA 9 Mint | PSA 9
- PSA 8 NM-MT | PSA 8
- PSA 7 Near Mint | PSA 7
- PSA 6 and below | PSA 6-

---

#### L2: BGS/Beckett Graded | BGS оценени
**Slug:** `graded/bgs`

**BGS Grades:**
- BGS 10 Pristine | BGS 10
- BGS 10 Black Label | BGS 10 Black Label
- BGS 9.5 Gem Mint | BGS 9.5
- BGS 9 Mint | BGS 9

**Subgrades (Attribute):**
- Centering | Центриране
- Corners | Ъгли
- Edges | Ръбове
- Surface | Повърхност

---

### L1: 🎯 ACCESSORIES

#### L2: Card Sleeves | Протектори за карти
**Slug:** `accessories/sleeves`

**Brands:**
- Ultra Pro | Ultra Pro
- Dragon Shield | Dragon Shield
- KMC | KMC
- Katana | Katana
- Eclipse | Eclipse
- Matte | Матови
- Clear | Прозрачни

**Size:**
- Standard | Стандартни
- Japanese Size | Японски размер
- Oversized | Големи

---

#### L2: Playmats | Плеймат-ове
**Slug:** `accessories/playmats`

- Official Playmats | Официални
- Custom Playmats | Персонализирани
- Two-Player Mats | За двама играчи
- Art Playmats | Артистични

---

---

## 🏷️ Attribute System (The Power Layer)

### Trading Card Attributes Schema

```typescript
interface TradingCardProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "pokemon/singles"
  
  // === BASIC INFO ===
  title: string;                 // "Charizard 4/102 Base Set PSA 9"
  description: string;
  price: number;
  currency: 'BGN' | 'EUR' | 'USD';
  negotiable: boolean;
  
  // === CARD IDENTIFICATION ===
  game: Game;                    // "pokemon", "mtg", "yugioh"
  card_name: string;             // "Charizard"
  card_number: string;           // "4/102"
  set_name: string;              // "Base Set"
  set_code?: string;             // "BS"
  
  // === RARITY ===
  rarity: string;                // "Holo Rare"
  is_first_edition: boolean;
  is_shadowless?: boolean;       // Pokémon specific
  print_run?: string;            // "1st Edition", "Unlimited"
  
  // === CONDITION ===
  condition: Condition;
  
  // === GRADING ===
  is_graded: boolean;
  grading_company?: GradingCompany;
  grade?: string;                // "10", "9.5"
  cert_number?: string;          // PSA cert number
  subgrades?: {
    centering?: string;
    corners?: string;
    edges?: string;
    surface?: string;
  };
  
  // === LANGUAGE & REGION ===
  language: CardLanguage;
  region: CardRegion;
  
  // === CARD DETAILS (Game-Specific) ===
  pokemon_type?: string;         // "Fire", "Water"
  mtg_color?: string;            // "Red", "Blue"
  mtg_format_legal?: string[];   // ["Modern", "Legacy"]
  
  // === AUTHENTICITY ===
  is_authentic: boolean;
  purchase_source?: string;      // "Local game store"
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer' | 'store';
  location_city: string;
  
  // === LISTING META ===
  images: string[];              // Front and back photos
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS ===
  tags: string[];                // ["graded", "vintage", "holo"]
}

// === ENUMS ===

type Game = 
  | 'pokemon' | 'mtg' | 'yugioh' | 'sports' 
  | 'one_piece' | 'lorcana' | 'digimon' | 'other';

type Condition = 
  | 'mint' | 'near_mint' | 'lightly_played' 
  | 'moderately_played' | 'heavily_played' | 'damaged';

type GradingCompany = 
  | 'psa' | 'bgs' | 'cgc' | 'sgc' | 'ace' | 'other';

type CardLanguage = 
  | 'english' | 'japanese' | 'german' | 'french' 
  | 'italian' | 'spanish' | 'korean' | 'chinese';

type CardRegion = 
  | 'english' | 'japanese' | 'korean' | 'tcg' | 'ocg';
```

### Sports Card Attributes Schema

```typescript
interface SportsCardProduct {
  id: string;
  category_id: string;           // "sports/football"
  
  title: string;                 // "Messi 2022 Prizm PSA 10"
  description: string;
  price: number;
  
  // === CARD INFO ===
  player_name: string;           // "Lionel Messi"
  team: string;                  // "Inter Miami"
  sport: Sport;                  // "football"
  
  // === PRODUCT INFO ===
  brand: string;                 // "Panini Prizm"
  year: number;                  // 2022
  set_name: string;              // "Prizm World Cup"
  card_number: string;
  
  // === RARITY ===
  rarity: string;                // "Base", "Silver", "Gold"
  is_numbered: boolean;
  print_run?: number;            // /99, /25
  is_parallel: boolean;
  parallel_type?: string;        // "Silver Prizm", "Gold"
  
  // === SPECIAL FEATURES ===
  is_autograph: boolean;
  is_relic: boolean;             // Game-used material
  is_patch: boolean;
  is_rookie_card: boolean;
  
  // === CONDITION/GRADING ===
  condition: Condition;
  is_graded: boolean;
  grading_company?: GradingCompany;
  grade?: string;
  
  // === AUTHENTICITY ===
  is_authentic: boolean;
  
  seller_type: 'private' | 'dealer' | 'store';
  location_city: string;
  
  images: string[];
}

type Sport = 'football' | 'basketball' | 'baseball' | 'hockey' | 'tennis' | 'f1' | 'mma';
```

### Sealed Product Attributes Schema

```typescript
interface SealedProduct {
  id: string;
  category_id: string;
  
  title: string;                 // "Pokémon Obsidian Flames Booster Box"
  description: string;
  price: number;
  
  // === PRODUCT INFO ===
  game: Game;
  product_type: SealedProductType;
  set_name: string;
  release_date: string;
  
  // === CONTENTS ===
  packs_included?: number;       // 36 packs in booster box
  cards_per_pack?: number;
  
  // === CONDITION ===
  is_sealed: boolean;
  seal_condition?: string;       // "Factory sealed", "Resealed"
  box_condition?: string;
  
  // === LANGUAGE & REGION ===
  language: CardLanguage;
  region: CardRegion;
  
  seller_type: 'private' | 'dealer' | 'store';
  location_city: string;
  
  images: string[];
}

type SealedProductType = 
  | 'booster_pack' | 'booster_box' | 'case' 
  | 'etb' | 'collection_box' | 'starter_deck' | 'bundle';
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "PSA 10 Graded Cards"
SELECT * FROM products 
WHERE category LIKE 'trading-cards/%'
AND attributes->>'is_graded' = 'true'
AND attributes->>'grading_company' = 'psa'
AND attributes->>'grade' = '10';

-- 🏷️ "First Edition Pokémon"
SELECT * FROM products 
WHERE category LIKE 'trading-cards/pokemon/%'
AND attributes->>'is_first_edition' = 'true';

-- 🏷️ "Charizard Collection"
SELECT * FROM products 
WHERE category LIKE 'trading-cards/pokemon/%'
AND attributes->>'card_name' ILIKE '%charizard%';

-- 🏷️ "Vintage Base Set"
SELECT * FROM products 
WHERE category LIKE 'trading-cards/pokemon/%'
AND attributes->>'set_name' = 'Base Set';

-- 🏷️ "Messi & Ronaldo Cards"
SELECT * FROM products 
WHERE category LIKE 'trading-cards/sports/football'
AND (attributes->>'player_name' ILIKE '%messi%' 
     OR attributes->>'player_name' ILIKE '%ronaldo%');

-- 🏷️ "Rookie Cards Under 100 лв"
SELECT * FROM products 
WHERE category LIKE 'trading-cards/sports/%'
AND attributes->>'is_rookie_card' = 'true'
AND price <= 100;

-- 🏷️ "Japanese Exclusive"
SELECT * FROM products 
WHERE category LIKE 'trading-cards/%'
AND attributes->>'language' = 'japanese';

-- 🏷️ "Sealed Booster Boxes"
SELECT * FROM products 
WHERE category LIKE 'trading-cards/%/booster-boxes'
AND attributes->>'is_sealed' = 'true';
```

### Search Filter Configuration

```typescript
const tradingCardFilters = {
  // Price
  price: { type: 'range', min: 0, max: 10000, step: 5 },
  
  // Game
  game: { type: 'multi-select', options: ['pokemon', 'mtg', 'yugioh', 'sports', 'one_piece', 'lorcana'] },
  
  // Condition
  condition: { type: 'multi-select', options: conditions },
  
  // Grading
  is_graded: { type: 'checkbox' },
  grading_company: { type: 'multi-select', options: ['psa', 'bgs', 'cgc', 'sgc'] },
  grade: { type: 'multi-select', options: ['10', '9.5', '9', '8', '7', '6'] },
  
  // Rarity
  rarity: { type: 'multi-select', options: rarities },
  is_first_edition: { type: 'checkbox' },
  
  // Language
  language: { type: 'multi-select', options: ['english', 'japanese', 'german'] },
  
  // Seller
  seller_type: { type: 'radio', options: ['all', 'private', 'dealer', 'store'] },
};

const sportsCardFilters = {
  price: { type: 'range', min: 0, max: 5000 },
  
  sport: { type: 'multi-select', options: ['football', 'basketball', 'baseball'] },
  
  year: { type: 'range', min: 1950, max: 2024 },
  
  brand: { type: 'searchable-select', options: cardBrands },
  
  is_rookie_card: { type: 'checkbox' },
  is_autograph: { type: 'checkbox' },
  is_relic: { type: 'checkbox' },
  is_numbered: { type: 'checkbox' },
  
  is_graded: { type: 'checkbox' },
  grade: { type: 'multi-select', options: grades },
};
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('trading-cards', 'Trading Cards & TCG', 'Колекционерски карти', 'trading-cards', 'trading-cards', NULL, 0, '🃏', 39, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('tc-pokemon', 'Pokémon', 'Pokémon', 'pokemon', 'trading-cards/pokemon', 'trading-cards', 1, '⚡', 1, true),
('tc-mtg', 'Magic: The Gathering', 'Magic: The Gathering', 'mtg', 'trading-cards/mtg', 'trading-cards', 1, '⚔️', 2, true),
('tc-yugioh', 'Yu-Gi-Oh!', 'Yu-Gi-Oh!', 'yugioh', 'trading-cards/yugioh', 'trading-cards', 1, '👹', 3, true),
('tc-sports', 'Sports Cards', 'Спортни карти', 'sports', 'trading-cards/sports', 'trading-cards', 1, '⚽', 4, true),
('tc-other', 'Other TCGs', 'Други TCG', 'other-tcg', 'trading-cards/other-tcg', 'trading-cards', 1, '🎮', 5, true),
('tc-graded', 'Graded Cards', 'Оценени карти', 'graded', 'trading-cards/graded', 'trading-cards', 1, '🏆', 6, true),
('tc-sealed', 'Sealed Products', 'Запечатани продукти', 'sealed', 'trading-cards/sealed', 'trading-cards', 1, '📦', 7, true),
('tc-accessories', 'Accessories', 'Аксесоари', 'accessories', 'trading-cards/accessories', 'trading-cards', 1, '🎯', 8, true),
('tc-memorabilia', 'Memorabilia', 'Меморабилия', 'memorabilia', 'trading-cards/memorabilia', 'trading-cards', 1, '📚', 9, true);

-- L2: Pokémon
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('poke-boosters', 'Booster Packs', 'Бустер пакове', 'booster-packs', 'pokemon/booster-packs', 'tc-pokemon', 2, '🎴', 1, true),
('poke-boxes', 'Booster Boxes', 'Бустер кутии', 'booster-boxes', 'pokemon/booster-boxes', 'tc-pokemon', 2, '📦', 2, true),
('poke-etb', 'Elite Trainer Boxes', 'Elite Trainer кутии', 'etb', 'pokemon/etb', 'tc-pokemon', 2, '🎁', 3, true),
('poke-singles', 'Single Cards', 'Единични карти', 'singles', 'pokemon/singles', 'tc-pokemon', 2, '🃏', 4, true),
('poke-graded', 'Graded Cards', 'Оценени карти', 'graded', 'pokemon/graded', 'tc-pokemon', 2, '🏆', 5, true),
('poke-sets', 'Complete Sets', 'Пълни сетове', 'complete-sets', 'pokemon/complete-sets', 'tc-pokemon', 2, '📚', 6, true),
('poke-theme', 'Theme Decks', 'Тема колоди', 'theme-decks', 'pokemon/theme-decks', 'tc-pokemon', 2, '🎴', 7, true),
('poke-promo', 'Promo Cards', 'Промо карти', 'promo', 'pokemon/promo', 'tc-pokemon', 2, '⭐', 8, true),
('poke-japanese', 'Japanese Cards', 'Японски карти', 'japanese', 'pokemon/japanese', 'tc-pokemon', 2, '🇯🇵', 9, true),
('poke-vintage', 'Vintage (Pre-2010)', 'Винтидж', 'vintage', 'pokemon/vintage', 'tc-pokemon', 2, '🏛️', 10, true);

-- L2: Magic
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('mtg-boosters', 'Booster Packs', 'Бустер пакове', 'booster-packs', 'mtg/booster-packs', 'tc-mtg', 2, '🎴', 1, true),
('mtg-boxes', 'Booster Boxes', 'Бустер кутии', 'booster-boxes', 'mtg/booster-boxes', 'tc-mtg', 2, '📦', 2, true),
('mtg-bundles', 'Bundle Boxes', 'Bundle кутии', 'bundles', 'mtg/bundles', 'tc-mtg', 2, '🎁', 3, true),
('mtg-singles', 'Single Cards', 'Единични карти', 'singles', 'mtg/singles', 'tc-mtg', 2, '🃏', 4, true),
('mtg-graded', 'Graded Cards', 'Оценени карти', 'graded', 'mtg/graded', 'tc-mtg', 2, '🏆', 5, true),
('mtg-commander', 'Commander Decks', 'Commander колоди', 'commander', 'mtg/commander', 'tc-mtg', 2, '👑', 6, true),
('mtg-challenger', 'Challenger Decks', 'Challenger колоди', 'challenger', 'mtg/challenger', 'tc-mtg', 2, '⚔️', 7, true),
('mtg-secretlair', 'Secret Lair', 'Secret Lair', 'secret-lair', 'mtg/secret-lair', 'tc-mtg', 2, '🔮', 8, true),
('mtg-vintage', 'Vintage & Reserved List', 'Винтидж', 'vintage', 'mtg/vintage', 'tc-mtg', 2, '🏛️', 9, true),
('mtg-foils', 'Foils & Special Editions', 'Фойли', 'foils', 'mtg/foils', 'tc-mtg', 2, '✨', 10, true);

-- L2: Sports Cards
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('sp-football', 'Football/Soccer', 'Футбол', 'football', 'sports/football', 'tc-sports', 2, '⚽', 1, true),
('sp-basketball', 'Basketball', 'Баскетбол', 'basketball', 'sports/basketball', 'tc-sports', 2, '🏀', 2, true),
('sp-nfl', 'American Football', 'Американски футбол', 'nfl', 'sports/nfl', 'tc-sports', 2, '🏈', 3, true),
('sp-baseball', 'Baseball', 'Бейзбол', 'baseball', 'sports/baseball', 'tc-sports', 2, '⚾', 4, true),
('sp-hockey', 'Hockey', 'Хокей', 'hockey', 'sports/hockey', 'tc-sports', 2, '🏒', 5, true),
('sp-tennis', 'Tennis', 'Тенис', 'tennis', 'sports/tennis', 'tc-sports', 2, '🎾', 6, true),
('sp-f1', 'Formula 1', 'Формула 1', 'f1', 'sports/f1', 'tc-sports', 2, '🏎️', 7, true),
('sp-mma', 'UFC/MMA', 'UFC/MMA', 'mma', 'sports/mma', 'tc-sports', 2, '🥊', 8, true),
('sp-wrestling', 'Wrestling', 'Кеч', 'wrestling', 'sports/wrestling', 'tc-sports', 2, '🤼', 9, true);

-- L2: Graded Cards
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gr-psa', 'PSA Graded', 'PSA оценени', 'psa', 'graded/psa', 'tc-graded', 2, '🔴', 1, true),
('gr-bgs', 'BGS/Beckett Graded', 'BGS оценени', 'bgs', 'graded/bgs', 'tc-graded', 2, '🔵', 2, true),
('gr-cgc', 'CGC Graded', 'CGC оценени', 'cgc', 'graded/cgc', 'tc-graded', 2, '🟢', 3, true),
('gr-sgc', 'SGC Graded', 'SGC оценени', 'sgc', 'graded/sgc', 'tc-graded', 2, '🟡', 4, true),
('gr-other', 'Other Grading', 'Друго оценяване', 'other', 'graded/other', 'tc-graded', 2, '⚪', 5, true);

-- L2: Accessories
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('acc-sleeves', 'Card Sleeves', 'Протектори', 'sleeves', 'accessories/sleeves', 'tc-accessories', 2, '🧤', 1, true),
('acc-deckbox', 'Deck Boxes', 'Кутии за колоди', 'deck-boxes', 'accessories/deck-boxes', 'tc-accessories', 2, '📦', 2, true),
('acc-binders', 'Binders & Albums', 'Албуми', 'binders', 'accessories/binders', 'tc-accessories', 2, '📒', 3, true),
('acc-toploaders', 'Top Loaders & Holders', 'Тоупоудъри', 'toploaders', 'accessories/toploaders', 'tc-accessories', 2, '🛡️', 4, true),
('acc-playmats', 'Playmats', 'Плеймат-ове', 'playmats', 'accessories/playmats', 'tc-accessories', 2, '🗺️', 5, true),
('acc-display', 'Display Cases', 'Витрини', 'display', 'accessories/display', 'tc-accessories', 2, '🖼️', 6, true),
('acc-grading', 'Grading Supplies', 'Консумативи за оценяване', 'grading-supplies', 'accessories/grading-supplies', 'tc-accessories', 2, '📋', 7, true);
```

### Grading Reference Data

```sql
-- Grading Companies
INSERT INTO public.grading_companies (code, name, scale_min, scale_max, website) VALUES
('psa', 'Professional Sports Authenticator', 1, 10, 'psacard.com'),
('bgs', 'Beckett Grading Services', 1, 10, 'beckett.com'),
('cgc', 'Certified Guaranty Company', 1, 10, 'cgccomics.com'),
('sgc', 'Sportscard Guaranty Corporation', 1, 10, 'sgccard.com');
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Trading Cards & TCG | Колекционерски карти |
| Pokémon | Pokémon |
| Magic: The Gathering | Magic: The Gathering |
| Yu-Gi-Oh! | Yu-Gi-Oh! |
| Sports Cards | Спортни карти |
| Graded Cards | Оценени карти |
| Sealed Products | Запечатани продукти |
| Accessories | Аксесоари |
| Booster Packs | Бустер пакове |
| Single Cards | Единични карти |

### Attribute Labels

| EN | BG |
|----|----|
| Card Name | Име на карта |
| Set Name | Име на сет |
| Condition | Състояние |
| Rarity | Рядкост |
| Grading Company | Грейдинг компания |
| Grade | Оценка |
| First Edition | Първо издание |
| Language | Език |
| Is Graded | Оценена |

### Condition Values

| EN | BG |
|----|----|
| Mint | Мент |
| Near Mint | Близо до мент |
| Lightly Played | Леко играна |
| Moderately Played | Умерено играна |
| Heavily Played | Силно играна |
| Damaged | Повредена |

### Rarity Values

| EN | BG |
|----|----|
| Common | Обичайна |
| Uncommon | Необичайна |
| Rare | Рядка |
| Holo Rare | Холо рядка |
| Ultra Rare | Ултра рядка |
| Secret Rare | Секретна рядка |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add grading companies reference
- [ ] Add card sets reference data
- [ ] Test JSONB queries for grading
- [ ] Verify indexes for card_name searches

### API
- [ ] GET /categories/trading-cards (tree structure)
- [ ] GET /categories/trading-cards/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)
- [ ] Grading validation endpoint

### Frontend
- [ ] Category browser component
- [ ] Grading filter
- [ ] Condition selector
- [ ] Card name search
- [ ] Set filter
- [ ] Image gallery (front/back)
- [ ] Results grid/list view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 75  
**Created:** December 3, 2025

````

