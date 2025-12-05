# 📊 Supabase Categories & Attributes - Full Backend Documentation

> Generated: December 4, 2025
> Database: amazong Supabase Project

---

## 📋 Table of Contents

1. [Database Schema Overview](#database-schema-overview)
2. [L0 Main Categories](#l0-main-categories-21-active)
3. [Complete Category Hierarchy](#complete-category-hierarchy)
4. [Category Attributes](#category-attributes)

---

## Database Schema Overview

### Categories Table (`public.categories`)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | English name |
| `name_bg` | TEXT | Bulgarian name |
| `slug` | TEXT | URL slug (unique) |
| `parent_id` | UUID | Parent category reference |
| `image_url` | TEXT | Category image |
| `icon` | TEXT | Emoji icon |
| `display_order` | INTEGER | Sort order |
| `description` | TEXT | English description |
| `description_bg` | TEXT | Bulgarian description |

**Total Categories: 7,100+ rows** *(Updated Jan 2025 - WHOLESALE expansion +487 categories)*

### Category Attributes Table (`public.category_attributes`)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `category_id` | UUID | Category reference (nullable = global) |
| `name` | TEXT | English attribute name |
| `name_bg` | TEXT | Bulgarian attribute name |
| `attribute_type` | TEXT | `text`, `number`, `select`, `multiselect`, `boolean`, `date` |
| `is_required` | BOOLEAN | Required field |
| `is_filterable` | BOOLEAN | Show in filters |
| `options` | JSONB | English options array |
| `options_bg` | JSONB | Bulgarian options array |
| `validation_rules` | JSONB | Custom validation rules |
| `sort_order` | INTEGER | Display order |

**Total Attributes: 1,220+ rows** *(Updated Jan 2025 - WHOLESALE expansion +70 attributes)*

---

## L0 Main Categories (21 Active)

| # | Name (EN) | Name (BG) | Slug | Icon | Display Order |
|---|-----------|-----------|------|------|---------------|
| 1 | Electronics | Електроника | `electronics` | 📱 | 2 |
| 2 | Home & Kitchen | Дом и кухня | `home` | 🏠 | 3 |
| 3 | Beauty | Красота | `beauty` | 💄 | 4 |
| 4 | Fashion | Мода | `fashion` | 👗 | 5 |
| 5 | Sports | Спорт | `sports` | ⚽ | 6 |
| 6 | Kids | Деца | `baby-kids` | 👶 | 7 |
| 7 | Gaming | Гейминг | `gaming` | 🎮 | 8 |
| 8 | Automotive | Автомобили | `automotive` | 🚗 | 9 |
| 9 | Pets | Зоо | `pets` | 🐕 | 10 |
| 10 | Real Estate | Имоти | `real-estate` | 🏡 | 11 |
| 11 | Software | Софтуер | `software` | 💿 | 12 |
| 13 | Collectibles | Колекции | `collectibles` | 🎨 | 13 |
| 14 | Wholesale | На едро | `wholesale` | 📦 | 14 |
| 15 | Hobbies | Хобита | `hobbies` | 🎨 | 15 |
| 16 | Jewelry & Watches | Бижута и часовници | `jewelry-watches` | 💎 | 16 |
| 17 | Grocery & Food | Храни и напитки | `grocery` | 🛒 | 17 |
| 18 | Tools & Industrial | Инструменти и индустриално | `tools-home` | 🔧 | 18 |
| 19 | E-Mobility | Електромобилност | `e-mobility` | ⚡ | 19 |
| 20 | Services & Events | Услуги и събития | `services` | 🛠️ | 20 |
| 21 | Bulgarian Traditional | Българско | `bulgarian-traditional` | 🇧🇬 | 21 |

### Deprecated/Hidden Categories:
- `[DEPRECATED] Computers` (slug: `computers`) - display_order: 9999
- `[DEPRECATED] Office` (slug: `office-school`) - display_order: 9993
- `[DEPRECATED] Smart Home` (slug: `smart-home`) - display_order: 9998
- `[DEPRECATED] Toys` (slug: `toys`) - display_order: 9994

---

## Complete Category Hierarchy

### 🚗 1. AUTOMOTIVE (`automotive`)
**L1 Subcategories:**
- **Vehicles** (`vehicles`) 🚘
  - L2: Cars (`cars`) → L3: Седани, Хечбеци, Комбита, Купета, Кабриолети, Electric Cars
  - L2: SUVs & Crossovers (`suvs`)
  - L2: Motorcycles (`motorcycles`) → L3: Sport Bikes, Cruisers, Touring, Enduro/Off-Road, Scooters, Electric Motorcycles
  - L2: Trucks (`trucks`)
  - L2: Vans & Buses (`vans-buses`)
  - L2: Campers (`campers`)
  - L2: Boats (`boats`)
  - L2: ATVs (`atvs`)
  - L2: Trailers (`trailers`)
- **Parts & Components** (`auto-parts`) 🔧
  - L2: Engine Parts (`engine-parts`) → L3: Oil Filters, Air Filters, Spark Plugs, Belts & Hoses, Gaskets, Turbo Parts
  - L2: Brakes & Suspension (`brakes-suspension`)
  - L2: Body Parts (`body-parts`)
  - L2: Interior Parts (`interior-parts`)
  - L2: Electrical Parts (`electrical-parts`)
  - L2: Wheels & Tires (`wheels-tires`) → L3: Summer Tires, Winter Tires, All-Season Tires, Alloy Wheels, Steel Wheels, Wheel Accessories
  - L2: Exhaust (`exhaust`)
  - L2: Transmission (`transmission`)
  - L2: Filters (`filters`)
- **Car Accessories** (`auto-accessories`) 🎨
  - L2: Car Audio (`car-audio`)
  - L2: Car Electronics (`car-electronics`)
  - L2: Interior Accessories (`auto-interior-accessories`)
  - L2: Exterior Accessories (`auto-exterior-accessories`)
  - L2: Car Care (`car-care`)
  - L2: Cargo (`cargo`)
  - L2: Safety (`auto-safety-acc`)
- **Auto Services** (`auto-services`) 🛠️
- **Electric Vehicles** (`electric-vehicles`) 🚗
- **E-Scooters** (`e-scooters`) 🛴
- **E-Bikes** (`e-bikes-cat`) 🚲
- **EV Chargers** (`ev-chargers`) 🔌
- **EV Parts & Accessories** (`ev-parts`) 🔧

---

### 💄 2. BEAUTY (`beauty`) ✅ COMPLETE - 275 categories, 51 attributes
**L1 Subcategories (8):**

- **Makeup** (`makeup`) 💋
  - L2: Face Makeup (`face-makeup`) → L3: Foundation, Concealer, Powder, Blush, Bronzer, Highlighter
  - L2: Eye Makeup (`eye-makeup`) → L3: Eyeshadow, Mascara, Eyeliner, Eyebrow Products, False Lashes
  - L2: Lip Makeup (`lip-makeup`) → L3: Lipstick, Lip Gloss, Lip Liner, Lip Balm
  - L2: Nail Polish (`nail-polish`)
  - L2: Makeup Brushes (`makeup-brushes`)

- **Skincare** (`skincare`) 🧴
  - L2: Cleansers (`cleansers`) → L3: Face Wash, Micellar Water, Toner, Makeup Remover
  - L2: Moisturizers (`moisturizers`) → L3: Day Cream, Night Cream, Face Oil, Gel Moisturizer
  - L2: Serums (`serums`) → L3: Vitamin C, Hyaluronic Acid, Retinol, Niacinamide, Anti-Aging, Brightening, Acne
  - L2: Face Masks (`face-masks`) → L3: Sheet Masks, Clay Masks, Peel-Off, Overnight, Hydrating, Exfoliating, Eye Masks, Lip Masks
  - L2: Sunscreen (`sunscreen`) → L3: Face, Body, Tinted, Sprays, After Sun, Kids, SPF Lip Balm
  - L2: Eye Cream (`eye-cream`) → L3: Anti-Wrinkle, Dark Circle, Depuffing, Eye Gels, Eye Serums

- **Hair Care** (`haircare`) 💇
  - L2: Shampoos (`shampoos`) → L3: Daily, Anti-Dandruff, Color-Treated, Volumizing, Moisturizing, Clarifying, Dry, Sulfate-Free, Men's
  - L2: Conditioners (`conditioners`) → L3: Daily, Deep, Leave-In, Color-Treated, Volumizing, Detangling
  - L2: Hair Treatments (`hair-treatments`) → L3: Hair Masks, Hair Oils, Hair Serums, Scalp, Hair Growth, Keratin, Bond Repair
  - L2: Styling Products (`styling-products`) → L3: Spray, Gel, Mousse, Wax, Pomade, Heat Protectant, Curl Defining, Texturizing

- **Fragrance** (`fragrance`) 🌸 **← Now with Men's/Women's/Unisex**
  - L2: Women's Fragrances (`fragrance-women`) 👩 → L3: EDP, EDT, Parfum, Body Mist, Floral, Oriental, Fresh
  - L2: Men's Fragrances (`fragrance-men`) 👨 → L3: EDP, EDT, Cologne, After Shave, Woody, Aquatic, Spicy
  - L2: Unisex Fragrances (`fragrance-unisex`) ✨ → L3: Niche, Clean, Citrus, Oud
  - L2: Fragrance Gift Sets (`fragrance-sets`) 🎁 → L3: Women's Sets, Men's Sets, Travel Size, Discovery Sets

- **Bath & Body** (`bath-body`) 🧼
  - L2: Bath & Shower (`bb-bath-shower`) 🚿 → L3: Shower Gels, Body Wash, Bar Soap, Bath Bombs, Bubble Bath, Bath Salts, Shower Oils
  - L2: Body Care (`bb-body-care`) 🧴 → L3: Lotions, Creams, Butters, Oils, Scrubs, Stretch Mark, Cellulite
  - L2: Hand & Foot Care (`bb-hand-foot`) 🦶 → L3: Hand Creams, Soaps, Sanitizers, Foot Creams, Scrubs, Masks, Cuticle Care
  - L2: Deodorants & Antiperspirants (`bb-deodorants`) 💨 → L3: Women's, Men's, Roll-On, Spray, Stick, Natural

- **Oral Care** (`oral-care`) 🪥
  - L2: Toothpaste (`oc-toothpaste`) 🦷 → L3: Whitening, Sensitive, Kids, Natural, Gum Care, Cavity Protection
  - L2: Toothbrushes (`oc-toothbrush`) 🪥 → L3: Electric, Manual, Kids, Brush Heads, Travel
  - L2: Mouthwash (`oc-mouthwash`) 💧 → L3: Antiseptic, Whitening, Kids, Alcohol-Free
  - L2: Teeth Whitening (`oc-whitening`) ✨ → L3: Strips, Kits, Pens, LED
  - L2: Dental Floss & Accessories (`oc-floss`) 🧵 → L3: Floss, Picks, Water Flossers, Interdental Brushes, Tongue Cleaners

- **Men's Grooming** (`mens-grooming`) 🧔 **← Fully expanded**
  - L2: Shaving (`mg-shaving`) 🪒 → L3: Razors, Electric Shavers, Cream, Foam, Gel, Pre-Shave, Aftershave Balm/Lotion, Blades, Brushes
  - L2: Beard Care (`mg-beard`) 🧔 → L3: Oil, Balm, Wax, Shampoo, Conditioner, Trimmers, Combs/Brushes, Growth, Mustache Care
  - L2: Men's Hair Care (`mg-haircare`) 💈 → L3: Shampoo, Conditioner, Hair Loss Treatment, Styling, Clippers, Gray Hair
  - L2: Men's Skincare (`mg-skincare`) 🧴 → L3: Face Wash, Moisturizer, Anti-Aging, Eye Cream, Sunscreen, Lip Balm
  - L2: Men's Body Care (`mg-bodycare`) 🚿 → L3: Body Wash, Lotion, Deodorant, Body Grooming, Intimate Care

- **Beauty Tools** (`beauty-tools`) 💅
  - L2: Face Tools (`bt-face`) 🪞 → L3: Cleansing Brushes, Rollers, Gua Sha, Pore Extractors, Steamers, Massagers, Dermaplaning
  - L2: Hair Tools (`bt-hair`) 💇 → L3: Dryers, Flat Irons, Curling Irons, Hot Brushes, Brushes, Combs, Rollers, Clips
  - L2: Nail Tools (`bt-nail`) 💅 → L3: Files, Clippers, Cuticle Tools, Buffers, Nail Art, UV/LED Lamps, Drills, Manicure Sets
  - L2: Beauty Devices (`bt-devices`) ⚡ → L3: LED Therapy, Microcurrent, RF Tightening, IPL, Laser, Ultrasonic, Epilators, Waxing
  - L2: Beauty Accessories (`bt-accessories`) 👜 → L3: Makeup Bags, Organizers, Mirrors, Sponges, Brush Cleaners, Headbands, Travel Containers

**Beauty Attributes (51 total):**
- Global: Gender (Women/Men/Unisex)
- Skincare: Skin Type, Skin Concern, Key Ingredients, Product Form, SPF Level, Cruelty Free, Vegan, Organic, Size/Volume
- Hair Care: Hair Type, Hair Concern, Hair Length, Sulfate/Paraben/Silicone Free
- Fragrance: Type, Scent Family, Longevity, Sillage, Season, Occasion, Size
- Makeup: Finish, Coverage, Skin Tone, Undertone, Long Wearing, Waterproof, Transfer Proof
- Bath & Body: Scent, Skin Benefit, Natural/Organic
- Oral Care: Benefit, Fluoride, Flavor
- Men's Grooming: Beard Length, Shaving Type, Skin Sensitivity, Scent
- Beauty Tools: Tool Type, Material, Heat Settings, Travel Friendly, Professional Grade

---

### 🇧🇬 3. BULGARIAN TRADITIONAL (`bulgarian-traditional`)
**L1 Subcategories:**
- **Traditional Foods** (`traditional-foods`) 🍯
- **Rose Products** (`rose-products`) 🌹
- **Traditional Crafts** (`traditional-crafts`) 🎭
- **Folk Costumes** (`folk-costumes`) 👘
- **Bulgarian Wine** (`bulgarian-wine`) 🍷
- **Souvenirs** (`souvenirs`) 🎁

---

### 🎨 4. COLLECTIBLES (`collectibles`) ✅ COMPLETE - 214 categories, 99 attributes
**L1 Subcategories (14):**

- **Art** (`art`) 🖼️
  - L2: Paintings (`art-paintings`) → L3: Oil, Acrylic, Watercolor, Abstract, Portrait, Landscape, Modern, Bulgarian Art
  - L2: Prints & Posters (`art-prints`)
  - L2: Sculptures (`art-sculptures`) → L3: Bronze, Stone, Wood, Modern, Figurines
  - L2: Photography (`art-photography`)
  - L2: Drawings & Illustrations (`art-drawings`)
  - L2: Digital Art & NFTs (`art-digital`)
  - L2: Mixed Media (`art-mixed-media`)
  - L2: Folk Art (`art-folk`)
  - L2: Art Glass (`art-glass`)
  - L2: Textiles & Fiber Art (`art-textiles`)

- **Antiques** (`antiques`) 🏺
  - L2: Antique Furniture (`antiques-furniture`)
  - L2: Antique Art (`antiques-art`)
  - L2: Antique Clocks (`antiques-clocks`)
  - L2: Vintage Porcelain (`antiques-porcelain`)
  - L2: Antique Jewelry (`antiques-jewelry`)
  - L2: Antique Silverware (`antiques-silverware`)
  - L2: Antique Books & Maps (`antiques-books`)
  - L2: Antique Textiles (`antiques-textiles`)
  - L2: Antique Scientific Instruments (`antiques-scientific`)
  - L2: Antique Asian Art (`antiques-asian`)
  - L2: Antique Rugs & Carpets (`antiques-rugs`)
  - L2: Antique Lighting (`antiques-lighting`)
  - L2: Decorative Objects (`antiques-decorative`)

- **Coins & Currency** (`coins-currency`) 🪙
  - L2: Gold Coins (`coins-gold`) → L3: American Eagles, Canadian Maple Leaf, Krugerrand, Philharmonic, Panda, Sovereign
  - L2: Silver Coins (`coins-silver`)
  - L2: Ancient Coins (`coins-ancient`) → L3: Roman, Greek, Byzantine, Thracian, Medieval, Celtic
  - L2: World Coins (`coins-world`)
  - L2: US Coins (`coins-us`)
  - L2: European Coins (`coins-european`)
  - L2: Bulgarian Coins (`coins-bulgarian`)
  - L2: Paper Money (`coins-paper-money`)
  - L2: Bullion (`coins-bullion`)
  - L2: Coin Sets (`coins-sets`)
  - L2: Coin Supplies (`coins-supplies`)

- **Stamps** (`stamps`) 📮
  - L2: Bulgarian Stamps (`stamps-bulgarian`)
  - L2: European Stamps (`stamps-european`)
  - L2: Thematic Stamps (`stamps-thematic`)
  - L2: US Stamps (`stamps-us`)
  - L2: Worldwide Stamps (`stamps-worldwide`)
  - L2: First Day Covers (`stamps-fdc`)
  - L2: Stamp Collections (`stamps-collections`)
  - L2: Stamp Supplies (`stamps-supplies`)
  - L2: Postal History (`stamps-postal-history`)

- **Trading Cards** (`coll-trading-cards`) 🃏 **← NEW: High-value collectible cards**
  - L2: Pokémon Cards (`coll-pokemon`) → L3: Singles, Booster Boxes, Booster Packs, ETB, Graded, Japanese, Vintage WOTC, Promos
  - L2: Magic: The Gathering (`coll-mtg`) → L3: Singles, Booster Boxes, Commander Decks, Graded, Reserved List, Vintage, Foils
  - L2: Yu-Gi-Oh! (`coll-yugioh`) → L3: Singles, Booster Boxes, Structure Decks, Graded, 1st Edition, Ghost/Ultimate Rares
  - L2: Sports Trading Cards (`coll-sports-cards`) → L3: Basketball, Football, Baseball, NFL, Hockey, F1/Racing, UFC, Vintage, Graded
  - L2: One Piece TCG (`coll-onepiece`)
  - L2: Dragon Ball Cards (`coll-dragonball`)
  - L2: Lorcana (`coll-lorcana`)
  - L2: Flesh and Blood (`coll-fab`)
  - L2: Vintage Cards (`coll-vintage-cards`)
  - L2: Graded Cards (`coll-graded-cards`)
  - L2: Sealed Products (`coll-sealed-products`)
  - L2: Non-Sport Cards (`coll-non-sport-cards`)

- **Comics & Graphic Novels** (`coll-comics`) 📚 **← NEW**
  - L2: Marvel Comics (`comics-marvel`)
  - L2: DC Comics (`comics-dc`)
  - L2: Manga (`comics-manga`)
  - L2: Independent Comics (`comics-indie`)
  - L2: Vintage Comics (`comics-vintage`)
  - L2: Graphic Novels (`comics-graphic-novels`)
  - L2: Comic Art (`comics-art`)
  - L2: Graded Comics (`comics-graded`)
  - L2: European Comics (`comics-european`)

- **Collectible Toys & Figures** (`coll-toys`) 🤖 **← NEW**
  - L2: Action Figures (`toys-action-figures`)
  - L2: Funko Pop! (`toys-funko`)
  - L2: Hot Wheels & Diecast (`toys-diecast`)
  - L2: LEGO Collectibles (`toys-lego`)
  - L2: Vintage Toys (`toys-vintage`)
  - L2: Plush & Stuffed Animals (`toys-plush`)
  - L2: Model Kits (`toys-model-kits`)
  - L2: Star Wars Collectibles (`toys-star-wars`)
  - L2: Marvel/DC Figures (`toys-superhero`)
  - L2: Anime Figures (`toys-anime`)
  - L2: Barbie & Dolls (`toys-dolls`)
  - L2: Transformers (`toys-transformers`)
  - L2: G.I. Joe (`toys-gi-joe`)

- **Autographs & Signed Items** (`coll-autographs`) ✍️ **← NEW**
  - L2: Sports Autographs (`autographs-sports`)
  - L2: Music Autographs (`autographs-music`)
  - L2: Movie & TV Autographs (`autographs-entertainment`)
  - L2: Historical Autographs (`autographs-historical`)
  - L2: Political Autographs (`autographs-political`)
  - L2: Literary Autographs (`autographs-literary`)
  - L2: Science & Space Autographs (`autographs-science`)
  - L2: Signed Photos (`autographs-photos`)
  - L2: Signed Memorabilia (`autographs-memorabilia`)

- **Sports Memorabilia** (`sports-memorabilia`) 🏆
  - L2: Football Memorabilia (`sports-mem-football`)
  - L2: Basketball Memorabilia (`sports-mem-basketball`)
  - L2: Baseball Memorabilia (`sports-mem-baseball`)
  - L2: Hockey Memorabilia (`sports-mem-hockey`)
  - L2: Boxing & MMA (`sports-mem-boxing`)
  - L2: Tennis Memorabilia (`sports-mem-tennis`)
  - L2: Golf Memorabilia (`sports-mem-golf`)
  - L2: Racing Memorabilia (`sports-mem-racing`)
  - L2: Olympic Memorabilia (`sports-mem-olympic`)
  - L2: Wrestling (`sports-mem-wrestling`)
  - L2: Vintage Sports Equipment (`sports-mem-vintage-equipment`)

- **Entertainment Memorabilia** (`entertainment-memorabilia`) 🎬
  - L2: Movie Memorabilia (`ent-mem-movies`)
  - L2: TV Show Memorabilia (`ent-mem-tv`)
  - L2: Music Memorabilia (`ent-mem-music`)
  - L2: Theater & Broadway (`ent-mem-theater`)
  - L2: Celebrity Memorabilia (`ent-mem-celebrity`)
  - L2: Animation & Disney (`ent-mem-animation`)
  - L2: Video Game Memorabilia (`ent-mem-gaming`)
  - L2: Concert Memorabilia (`ent-mem-concert`)
  - L2: Historical Entertainment (`ent-mem-historical`)

- **Militaria** (`coll-militaria`) 🎖️ **← NEW**
  - L2: Military Medals & Badges (`militaria-medals`)
  - L2: Military Uniforms (`militaria-uniforms`)
  - L2: Military Helmets & Headgear (`militaria-helmets`)
  - L2: Military Weapons (Deactivated) (`militaria-weapons`)
  - L2: Military Documents (`militaria-documents`)
  - L2: Military Flags & Patches (`militaria-flags`)
  - L2: WWI Items (`militaria-ww1`)
  - L2: WWII Items (`militaria-ww2`)
  - L2: Civil War Items (`militaria-civilwar`)
  - L2: Bulgarian Military (`militaria-bulgarian`)

- **Vintage Electronics** (`coll-vintage-electronics`) 📻 **← NEW**
  - L2: Vintage Audio (`vintage-audio`)
  - L2: Vintage Cameras (`vintage-cameras`)
  - L2: Vintage Computers (`vintage-computers`)
  - L2: Vintage Gaming (`vintage-gaming`)
  - L2: Vintage Radios (`vintage-radios`)
  - L2: Vintage Telephones (`vintage-phones`)
  - L2: Vintage TVs (`vintage-tvs`)
  - L2: Vintage Watches & Clocks (`vintage-watches`)

- **Vintage Clothing** (`vintage-clothing`) 👗
  - L2: Vintage Dresses (`vintage-dresses`)
  - L2: Vintage Jackets & Coats (`vintage-jackets`)
  - L2: Vintage Denim (`vintage-denim`)
  - L2: Vintage T-Shirts (`vintage-tshirts`)
  - L2: Vintage Accessories (`vintage-accessories`)
  - L2: Vintage Shoes (`vintage-shoes`)
  - L2: Designer Vintage (`vintage-designer`)
  - L2: Band & Tour Merchandise (`vintage-band-merch`)

- **Rare & Limited Items** (`coll-rare`) 💎 **← NEW**
  - L2: Limited Editions (`rare-limited`)
  - L2: One-of-a-Kind Items (`rare-unique`)
  - L2: Prototype Items (`rare-prototypes`)
  - L2: Error Items (`rare-errors`)
  - L2: Convention Exclusives (`rare-convention`)
  - L2: First Editions (`rare-first-editions`)
  - L2: Promotional Items (`rare-promo`)
  - L2: Lost & Found Treasures (`rare-treasures`)

**Collectibles Attributes (99 total):**
- Global: Collectible Type, Era/Period, Authenticity, Signed, Numbered Edition, Provenance, Year/Date, Country of Origin, Documentation, Storage Condition
- Trading Cards (12): Card Game, Card Condition (10-point scale), Grading Company (PSA/BGS/CGC/SGC), Grading Score, Card Rarity, Card Set, Card Number, Product Type, Language, First Edition, Shadowless, Holographic
- Art (11): Art Medium, Art Style, Art Subject, Surface, Framed, Frame Included, Artist, Dimensions, Edition Size, Edition Number, COA
- Coins & Currency (11): Coin Type, Metal, Grade (Sheldon scale), Grading Service (PCGS/NGC), Year, Country, Denomination, Weight, Fineness, Mintage, Mint Mark
- Comics (8): Publisher, Comic Era, Comic Grade (CGC scale), Key Issue, First Appearance, Variant Cover, Signed, Issue Number
- Toys (9): Brand, Line/Franchise, Type, Scale, Condition (MISB/MIB/MOC), Original Packaging, Limited Edition, Exclusive, Year Released
- Autographs (6): Category, Item Type, Authentication (PSA/JSA/Beckett), Inscription, Personalized, Photo Size
- Sports Memorabilia (6): Sport, Team, Player, Item Type, Game Used, Season/Year
- Entertainment (6): Entertainment Type, Title/Show, Celebrity/Artist, Item Type, Screen Used, Production Year
- Stamps (6): Type, Country, Condition, Mint/Used, Year Issued, Thematic Topic
- Militaria (5): Military Era, Country, Branch, Item Category, Deactivated
- Antiques (5): Period, Material, Origin, Restoration, Maker/Manufacturer
- Vintage Electronics (4): Type, Decade, Working Condition, Original Parts

---

### ⚡ 5. E-MOBILITY (`e-mobility`) ✅ COMPLETE - 109 categories, 55 attributes
**L1 Subcategories (9):**

- **E-Scooters** (`emob-escooters`) 🛴
  - L2: Adult E-Scooters (`emob-escooters-adult`) → L3: Commuter, Folding, Lightweight, Long-Range
  - L2: Kids E-Scooters (`emob-escooters-kids`)
  - L2: Off-Road E-Scooters (`emob-escooters-offroad`)
  - L2: Seated E-Scooters (`emob-escooters-seated`)
  - L2: Performance E-Scooters (`emob-escooters-performance`) → L3: Dual Motor, Racing, High-Speed

- **E-Bikes** (`emob-ebikes`) 🚲
  - L2: City E-Bikes (`emob-ebikes-city`)
  - L2: Mountain E-Bikes (`emob-ebikes-mountain`) → L3: Hardtail E-MTB, Full Suspension E-MTB, Enduro E-MTB, Downhill E-MTB
  - L2: Folding E-Bikes (`emob-ebikes-folding`)
  - L2: Cargo E-Bikes (`emob-ebikes-cargo`) → L3: Front Loader, Longtail, Utility
  - L2: Fat Tire E-Bikes (`emob-ebikes-fat`)
  - L2: Road E-Bikes (`emob-ebikes-road`)
  - L2: Commuter E-Bikes (`emob-ebikes-commuter`)
  - L2: Kids E-Bikes (`emob-ebikes-kids`)

- **E-Skateboards & Boards** (`emob-eboards`) 🛹
  - L2: Electric Skateboards (`emob-eboards-skateboard`) → L3: Hub Motor Boards, Belt Drive Boards, Off-Road E-Boards, Mini E-Boards
  - L2: Electric Longboards (`emob-eboards-longboard`)
  - L2: Onewheel & Floatboards (`emob-eboards-onewheel`)
  - L2: Electric Surfboards (`emob-eboards-surfboard`)

- **Hoverboards & Segways** (`emob-hoverboards`) 🛞
  - L2: Standard Hoverboards (`emob-hover-standard`) → L3: 6.5 Inch, 8 Inch, 10 Inch, Kids Hoverboards
  - L2: Off-Road Hoverboards (`emob-hover-offroad`)
  - L2: Hoverboard Go-Kart Kits (`emob-hover-gokart`)
  - L2: Segways & Ninebot (`emob-hover-segway`)

- **E-Unicycles** (`emob-eunicycles`) 🎡
  - L2: Beginner EUC (`emob-euc-beginner`)
  - L2: Commuter EUC (`emob-euc-commuter`)
  - L2: Performance EUC (`emob-euc-performance`) → L3: High-Speed EUC, Long-Range EUC, Suspension EUC
  - L2: Off-Road EUC (`emob-euc-offroad`)

- **Electric Go-Karts** (`emob-gokarts`) 🏎️
  - L2: Kids Go-Karts (`emob-kart-kids`)
  - L2: Adult Go-Karts (`emob-kart-adult`)
  - L2: Drift Karts (`emob-kart-drift`)

- **E-Mobility Accessories** (`emob-accessories`) 🎒
  - L2: Helmets (`emob-acc-helmets`) → L3: Full Face, Half Shell, Smart Helmets, Kids Helmets
  - L2: Protection Gear (`emob-acc-protection`) → L3: Knee Pads, Elbow Pads, Wrist Guards, Gloves, Body Armor
  - L2: Bags & Carriers (`emob-acc-bags`)
  - L2: Locks & Security (`emob-acc-locks`)
  - L2: Lights & Reflectors (`emob-acc-lights`)
  - L2: Phone Mounts (`emob-acc-phone`)
  - L2: Mirrors (`emob-acc-mirrors`)
  - L2: Storage & Baskets (`emob-acc-storage`)

- **E-Mobility Parts** (`emob-parts`) 🔧
  - L2: Batteries (`emob-parts-batteries`) → L3: E-Scooter Batteries, E-Bike Batteries, EUC Batteries, Universal Batteries
  - L2: Motors (`emob-parts-motors`) → L3: Hub Motors, Belt Drive Motors, Mid-Drive Motors, Replacement Motors
  - L2: Controllers (`emob-parts-controllers`)
  - L2: Tires & Tubes (`emob-parts-tires`) → L3: Solid Tires, Pneumatic Tires, Off-Road Tires, Inner Tubes
  - L2: Brakes (`emob-parts-brakes`)
  - L2: Suspension (`emob-parts-suspension`)
  - L2: Handlebars & Grips (`emob-parts-handlebars`)
  - L2: Displays & Speedometers (`emob-parts-displays`)
  - L2: Lights & Wiring (`emob-parts-lights`)

- **Charging & Power** (`emob-charging`) 🔌
  - L2: Home Chargers (`emob-charge-home`) → L3: Wall Chargers, Desktop Chargers, Multi-Port Chargers
  - L2: Portable Chargers (`emob-charge-portable`)
  - L2: Fast Chargers (`emob-charge-fast`)
  - L2: Solar Chargers (`emob-charge-solar`)
  - L2: Charging Stations (`emob-charge-stations`)

**E-Mobility Attributes (55 total):**
- Global: Brand, Motor Power, Battery Capacity, Range, Max Speed, Max Load, Device Weight, Charging Time, IP Rating, Foldable, App Connectivity, Color
- E-Scooters (8): Tire Type, Tire Size, Suspension, Brake Type, Motor Type, Has Seat, Display Type, Lights
- E-Bikes (9): E-Bike Type, Motor Position, Battery Position, Frame Material, Frame Size, Wheel Size, Gears, Pedal Assist Levels, Step-Through Frame
- E-Boards (6): Board Length, Drive System, Deck Material, Deck Flex, Wheel Type, Remote Control
- Hoverboards (5): Wheel Size, Self-Balancing, LED Lights, Bluetooth Speaker, UL Certified
- E-Unicycles (5): Wheel Diameter, Has Suspension, Pedal Type, Trolley Handle, Kickstand
- E-Go-Karts (3): Age Range, Drift Capable, Seat Type
- Accessories (2): Compatibility, Helmet Certification
- Parts (3): Part Condition, Battery Voltage, Battery Cell Type
- Charging (2): Output Voltage, Charger Amperage

---

### 📱 6. ELECTRONICS (`electronics`) ✅ COMPLETE - 387 categories, 78 attributes
**L1 Subcategories (8):**

- **Smartphones** (`smartphones`) 📱
  - L2: iPhone (`iphone`) 🍎 → L3: iPhone 16 Series, iPhone 15 Series, iPhone 14 Series, iPhone 13 Series, iPhone 12 Series, iPhone 11 Series, iPhone SE, iPhone Legacy (X/XS/XR/8/7/6)
  - L2: Samsung Galaxy (`samsung-galaxy`) → L3: Galaxy S Series, Galaxy Z Fold, Galaxy Z Flip, Galaxy A Series, Galaxy M Series, Galaxy Note
  - L2: Xiaomi (`xiaomi-phones`) → L3: Xiaomi 14 Series, Redmi Series, POCO Series, Mi Series
  - L2: Google Pixel (`google-pixel`) → L3: Pixel 9 Series, Pixel 8 Series, Pixel 7 Series, Pixel Fold, Pixel A Series
  - L2: OnePlus (`oneplus-phones`) → L3: OnePlus 12 Series, OnePlus Nord, OnePlus Open
  - L2: Huawei (`huawei-phones`) → L3: Huawei Mate Series, Huawei P Series, Huawei Nova
  - L2: Other Brands (`other-smartphones`) → L3: Motorola, Sony Xperia, Nokia, Oppo, Vivo, Realme, Honor, Asus ROG Phone, Nothing Phone

- **Tablets** (`tablets`) 📟
  - L2: iPad (`ipad`) 🍎 → L3: iPad Pro (M4/M2), iPad Air (M2), iPad (10th/9th Gen), iPad Mini
  - L2: Samsung Tablets (`samsung-tablets`) → L3: Galaxy Tab S Series, Galaxy Tab A Series, Galaxy Tab FE
  - L2: Android Tablets (`android-tablets`) → L3: Xiaomi Pad, Lenovo Tab, OnePlus Pad, Google Pixel Tablet
  - L2: Windows Tablets (`windows-tablets`) → L3: Microsoft Surface Pro, Surface Go, 2-in-1 Tablets
  - L2: E-Readers (`e-readers`) → L3: Amazon Kindle, Kobo, PocketBook
  - L2: Kids Tablets (`kids-tablets`)

- **PC & Laptops** (`pc-laptops`) 💻
  - L2: Laptops (`laptops`) → L3: Gaming Laptops, Business Laptops, Ultrabooks, Student Laptops, Workstation Laptops, 2-in-1 Laptops, MacBooks (Pro/Air/Legacy)
  - L2: Desktop PCs (`desktops`) → L3: Gaming PCs, Office PCs, All-in-One PCs, Workstations, Mini PCs, Barebone Systems
  - L2: Monitors (`monitors`) → L3: Gaming Monitors, Professional Monitors, Ultrawide Monitors, 4K/8K Monitors, Portable Monitors
  - L2: PC Components (`pc-components`) 🔧
    - L3: Graphics Cards (GPUs) (`gpus`) - NVIDIA GeForce, AMD Radeon, Intel Arc
    - L3: Processors (CPUs) (`cpus`) - Intel Core, AMD Ryzen, AMD Threadripper
    - L3: Memory (RAM) (`ram`) - DDR5, DDR4, SODIMM, Server RAM
    - L3: Storage (`storage`) - NVMe SSDs, SATA SSDs, HDDs, External Drives
    - L3: Motherboards (`motherboards`) - Intel Chipset, AMD Chipset, Mini-ITX, EATX
    - L3: Power Supplies (PSUs) (`psus`) - Modular, Semi-Modular, Non-Modular
    - L3: PC Cases (`pc-cases`) - Full Tower, Mid Tower, Mini-ITX, Open Frame
    - L3: CPU Coolers (`cpu-coolers`) - Air Coolers, AIO Liquid Coolers, Custom Loop
    - L3: Case Fans (`case-fans`)
    - L3: Thermal Paste & Pads (`thermal-paste`)
  - L2: PC Peripherals (`pc-peripherals`)
    - L3: Keyboards (`keyboards`) - Mechanical, Membrane, Wireless, Ergonomic
    - L3: Mice (`mice`) - Gaming Mice, Ergonomic Mice, Wireless Mice, Trackballs
    - L3: Mouse Pads (`mouse-pads`)
    - L3: Webcams (`webcams`)
    - L3: USB Hubs & Docks (`usb-hubs`)
    - L3: Card Readers (`card-readers`)
  - L2: Networking (`networking`)
    - L3: Routers (`routers`) - WiFi 6/6E/7, Mesh Systems, Gaming Routers
    - L3: Switches (`network-switches`)
    - L3: Network Adapters (`network-adapters`) - WiFi Adapters, Ethernet Cards
    - L3: Modems (`modems`)
    - L3: Network Cables (`network-cables`)
    - L3: Access Points (`access-points`)
  - L2: Printers & Scanners (`printers-scanners`)
    - L3: Inkjet Printers (`inkjet-printers`)
    - L3: Laser Printers (`laser-printers`)
    - L3: All-in-One Printers (`aio-printers`)
    - L3: Photo Printers (`photo-printers`)
    - L3: 3D Printers (`3d-printers`)
    - L3: Scanners (`scanners`)
    - L3: Printer Supplies (`printer-supplies`) - Ink, Toner, Paper

- **Audio** (`audio`) 🎧
  - L2: Headphones (`headphones`)
    - L3: Over-Ear Headphones (`over-ear-headphones`) - Wired, Wireless, Noise-Cancelling
    - L3: On-Ear Headphones (`on-ear-headphones`)
    - L3: In-Ear / Earbuds (`in-ear-headphones`) - Wired Earbuds, Neckband
    - L3: True Wireless Earbuds (`tws-earbuds`) - AirPods, Galaxy Buds, Sony WF, Jabra
    - L3: Gaming Headsets (`gaming-headsets-audio`)
    - L3: Sports & Running Headphones (`sports-headphones`)
    - L3: Studio & DJ Headphones (`studio-headphones`)
  - L2: Speakers (`speakers`)
    - L3: Bluetooth Speakers (`bluetooth-speakers`) - Portable, Waterproof, Party Speakers
    - L3: Smart Speakers (`smart-speakers-audio`) - Amazon Echo, Google Nest, Apple HomePod
    - L3: Computer Speakers (`computer-speakers`)
    - L3: Bookshelf Speakers (`bookshelf-speakers`)
    - L3: Floorstanding Speakers (`floorstanding-speakers`)
    - L3: Subwoofers (`subwoofers`)
    - L3: Center Channel Speakers (`center-speakers`)
  - L2: Home Audio Systems (`home-audio`)
    - L3: Soundbars (`soundbars`) - With Subwoofer, Dolby Atmos, Compact
    - L3: Home Theater Systems (`home-theater`) - 5.1, 7.1, Dolby Atmos
    - L3: AV Receivers (`av-receivers`)
    - L3: Stereo Amplifiers (`stereo-amplifiers`)
    - L3: Hi-Fi Systems (`hifi-systems`)
    - L3: Turntables & Vinyl (`turntables`)
    - L3: CD Players (`cd-players`)
  - L2: Microphones (`microphones`)
    - L3: USB Microphones (`usb-microphones`) - Streaming, Podcasting
    - L3: XLR Microphones (`xlr-microphones`) - Condenser, Dynamic
    - L3: Lavalier Microphones (`lavalier-mics`)
    - L3: Shotgun Microphones (`shotgun-mics`)
    - L3: Wireless Microphone Systems (`wireless-mic-systems`)
    - L3: Audio Interfaces (`audio-interfaces`)
    - L3: Mic Accessories (`mic-accessories`) - Boom Arms, Pop Filters, Shock Mounts
  - L2: Headphone & Audio Accessories (`audio-accessories`)
    - L3: Headphone Stands (`headphone-stands`)
    - L3: DACs & Headphone Amps (`dacs-amps`)
    - L3: Ear Pads & Cushions (`ear-pads`)
    - L3: Audio Cables (`audio-cables`)
    - L3: Portable DACs (`portable-dacs`)

- **Televisions** (`televisions-category`) 📺
  - L2: By Display Technology (`tv-by-technology`)
    - L3: OLED TVs (`oled-tvs`) - LG OLED, Sony OLED, Samsung QD-OLED
    - L3: QLED TVs (`qled-tvs`) - Samsung QLED, TCL QLED
    - L3: Mini-LED TVs (`mini-led-tvs`)
    - L3: LED/LCD TVs (`led-lcd-tvs`)
    - L3: 8K TVs (`8k-tvs`)
  - L2: By Screen Size (`tv-by-size`)
    - L3: Small TVs (Under 43") (`small-tvs`)
    - L3: Medium TVs (43-55") (`medium-tvs`)
    - L3: Large TVs (55-65") (`large-tvs`)
    - L3: Extra Large TVs (65-75") (`xlarge-tvs`)
    - L3: Giant TVs (75"+) (`giant-tvs`)
  - L2: By Brand (`tv-by-brand`)
    - L3: Samsung TVs (`samsung-tvs`)
    - L3: LG TVs (`lg-tvs`)
    - L3: Sony TVs (`sony-tvs`)
    - L3: TCL TVs (`tcl-tvs`)
    - L3: Hisense TVs (`hisense-tvs`)
    - L3: Philips TVs (`philips-tvs`)
  - L2: TV Accessories (`tv-accessories`)
    - L3: TV Mounts & Stands (`tv-mounts`)
    - L3: Streaming Devices (`streaming-devices`) - Fire TV, Chromecast, Apple TV, Roku
    - L3: HDMI Cables & Adapters (`hdmi-cables`)
    - L3: Universal Remotes (`universal-remotes`)
    - L3: TV Antenna (`tv-antenna`)
    - L3: Screen Cleaners (`screen-cleaners`)

- **Cameras** (`electronics-cameras`) 📷
  - L2: Digital Cameras (`digital-cameras`)
    - L3: Mirrorless Cameras (`mirrorless-cameras`) - Full-Frame, APS-C, Micro Four Thirds
    - L3: DSLR Cameras (`dslr-cameras`) - Full-Frame DSLR, APS-C DSLR
    - L3: Compact Cameras (`compact-cameras`) - Point & Shoot, Premium Compact
    - L3: Medium Format Cameras (`medium-format`)
  - L2: Video Cameras (`video-cameras`)
    - L3: Camcorders (`camcorders`)
    - L3: Action Cameras (`action-cameras`) - GoPro, DJI, Insta360
    - L3: Cinema Cameras (`cinema-cameras`)
    - L3: Vlogging Cameras (`vlogging-cameras`)
    - L3: 360° Cameras (`360-cameras`)
    - L3: Body Cameras (`body-cameras`)
  - L2: Camera Lenses (`camera-lenses`)
    - L3: Wide Angle Lenses (`wide-angle-lenses`)
    - L3: Standard/Kit Lenses (`standard-lenses`)
    - L3: Telephoto Lenses (`telephoto-lenses`)
    - L3: Prime Lenses (`prime-lenses`)
    - L3: Macro Lenses (`macro-lenses`)
    - L3: Zoom Lenses (`zoom-lenses`)
    - L3: Specialty Lenses (`specialty-lenses`) - Fisheye, Tilt-Shift
  - L2: Camera by Brand (`camera-by-brand`)
    - L3: Canon Cameras (`canon-cameras`)
    - L3: Sony Cameras (`sony-cameras`)
    - L3: Nikon Cameras (`nikon-cameras`)
    - L3: Fujifilm Cameras (`fujifilm-cameras`)
    - L3: Panasonic Cameras (`panasonic-cameras`)
    - L3: GoPro (`gopro`)
    - L3: DJI Cameras & Gimbals (`dji-cameras`)
  - L2: Drones (`drones`)
    - L3: Consumer Drones (`consumer-drones`)
    - L3: Professional Drones (`professional-drones`)
    - L3: FPV Drones (`fpv-drones`)
    - L3: Mini Drones (`mini-drones`)
    - L3: Drone Accessories (`drone-accessories`)
  - L2: Camera Accessories (`camera-accessories`)
    - L3: Camera Bags & Cases (`camera-bags`)
    - L3: Tripods & Monopods (`tripods`)
    - L3: Gimbals & Stabilizers (`gimbals`)
    - L3: Memory Cards (`memory-cards`) - SD, microSD, CFexpress
    - L3: Camera Batteries & Chargers (`camera-batteries`)
    - L3: Camera Straps (`camera-straps`)
    - L3: Lens Filters (`lens-filters`)
    - L3: Camera Flashes (`camera-flashes`)
    - L3: Lighting Equipment (`lighting-equipment`) - Softboxes, Ring Lights, LED Panels

- **Smart Devices** (`smart-devices`) 🔌
  - L2: Wearables (`wearables`)
    - L3: Smartwatches (`smartwatches`) - Apple Watch, Samsung Galaxy Watch, Garmin, Fitbit
    - L3: Fitness Trackers (`fitness-trackers`)
    - L3: Smart Rings (`smart-rings`)
    - L3: Smart Glasses (`smart-glasses`)
  - L2: Smart Home (`smart-home`)
    - L3: Smart Speakers & Displays (`smart-speakers-displays`) - Echo, Nest Hub, HomePod
    - L3: Smart Lighting (`smart-lighting`) - Smart Bulbs, Light Strips, Smart Switches
    - L3: Smart Plugs & Outlets (`smart-plugs-outlets`)
    - L3: Smart Thermostats (`smart-thermostats`)
    - L3: Robot Vacuums (`robot-vacuums`) - Roomba, Roborock, Ecovacs
    - L3: Smart Locks (`smart-locks`)
    - L3: Video Doorbells (`video-doorbells`) - Ring, Nest, Eufy
    - L3: Security Cameras (`security-cameras`) - Indoor, Outdoor, PTZ
    - L3: Smart Sensors (`smart-sensors`) - Motion, Door/Window, Leak
    - L3: Smart Hubs (`smart-hubs`) - SmartThings, Hubitat, Home Assistant
  - L2: Health & Wellness Devices (`health-devices`)
    - L3: Blood Pressure Monitors (`bp-monitors`)
    - L3: Smart Scales (`smart-scales`)
    - L3: Pulse Oximeters (`pulse-oximeters`)
    - L3: Thermometers (`smart-thermometers`)
    - L3: Sleep Trackers (`sleep-trackers`)

- **Accessories** (`electronics-accessories`) 🔌
  - L2: Phone Accessories (`phone-accessories`)
    - L3: Phone Cases (`phone-cases`) - iPhone Cases, Samsung Cases, Universal Cases
    - L3: Screen Protectors (`screen-protectors`) - Tempered Glass, Film, Privacy
    - L3: Phone Chargers (`phone-chargers`) - Wall Chargers, Car Chargers, Fast Chargers
    - L3: Wireless Chargers (`wireless-chargers`) - Qi Chargers, MagSafe, Charging Pads
    - L3: Power Banks (`power-banks`) - 10000mAh, 20000mAh, Solar Power Banks
    - L3: Phone Holders & Mounts (`phone-holders`) - Car Mounts, Desk Stands, Bike Mounts
    - L3: PopSockets & Grips (`phone-grips`)
    - L3: Selfie Sticks & Tripods (`selfie-sticks`)
  - L2: Cables & Adapters (`cables-adapters`)
    - L3: USB Cables (`usb-cables`) - USB-C, Lightning, Micro USB
    - L3: HDMI Cables (`hdmi-cables-acc`)
    - L3: DisplayPort Cables (`displayport-cables`)
    - L3: Adapters & Converters (`adapters-converters`)
    - L3: Docking Stations (`docking-stations`)
  - L2: Laptop Accessories (`laptop-accessories`)
    - L3: Laptop Bags & Sleeves (`laptop-bags`)
    - L3: Laptop Stands (`laptop-stands`)
    - L3: Laptop Chargers (`laptop-chargers`)
    - L3: Privacy Screens (`privacy-screens`)
    - L3: Laptop Cooling Pads (`laptop-cooling`)
  - L2: Tablet Accessories (`tablet-accessories`)
    - L3: Tablet Cases (`tablet-cases`) - iPad Cases, Samsung Tab Cases
    - L3: Tablet Keyboards (`tablet-keyboards`)
    - L3: Tablet Stands (`tablet-stands`)
    - L3: Stylus Pens (`stylus-pens`) - Apple Pencil, S Pen, Universal

**Electronics Attributes (78 total):**

**Global Electronics Attributes (apply to all):**
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Brand | select | ❌ | ✅ | Apple, Samsung, Xiaomi, Google, Sony, LG, Dell, HP, Lenovo, Asus, Acer, MSI, Huawei, OnePlus, Other |
| Color | select | ❌ | ✅ | Black, White, Silver, Gold, Blue, Red, Green, Gray, Rose Gold, Purple, Multi-color |
| Condition | select | ✅ | ✅ | New, Like New, Very Good, Good, Acceptable |
| Warranty | select | ❌ | ✅ | No Warranty, 1 Month, 3 Months, 6 Months, 1 Year, 2 Years, 3+ Years, Manufacturer Warranty |
| Original Box | boolean | ❌ | ✅ | Yes/No |

**Smartphones Attributes (`smartphones`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Model Series | select | ✅ | iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16 Plus, iPhone 16, iPhone 15 Series, iPhone 14 Series, iPhone 13 Series, iPhone SE, Galaxy S24 Ultra, Galaxy S24+, Galaxy S24, Galaxy Z Fold 6, Galaxy Z Flip 6, Galaxy A55, Pixel 9 Pro XL, Pixel 9 Pro, Pixel 9, Redmi Note 13, Other |
| Storage | select | ✅ | 32GB, 64GB, 128GB, 256GB, 512GB, 1TB |
| RAM | select | ❌ | 4GB, 6GB, 8GB, 12GB, 16GB, 18GB |
| Screen Size | select | ❌ | Under 5.5", 5.5-6.0", 6.0-6.5", 6.5-7.0", 7.0"+ (Foldable) |
| Operating System | select | ❌ | iOS 18, iOS 17, iOS 16, Android 15, Android 14, Android 13, HarmonyOS |
| Network | select | ✅ | 5G, 4G LTE, 3G Only |
| SIM Type | multiselect | ❌ | Single SIM, Dual SIM, eSIM, Nano SIM |
| Battery Capacity | select | ❌ | Under 3000mAh, 3000-4000mAh, 4000-5000mAh, 5000-6000mAh, 6000mAh+ |
| Camera MP | select | ❌ | Under 12MP, 12-48MP, 48-64MP, 64-108MP, 108-200MP, 200MP+ |
| Features | multiselect | ❌ | 5G, NFC, Wireless Charging, Fast Charging, MagSafe, Water Resistant (IP67/IP68), Face ID, Fingerprint (Under Display), Fingerprint (Side), Satellite Connectivity |
| Carrier Lock | select | ❌ | Unlocked, Locked (specify carrier) |

**Tablets Attributes (`tablets`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Model | select | ✅ | iPad Pro 13" M4, iPad Pro 11" M4, iPad Air M2, iPad 10th Gen, iPad Mini, Galaxy Tab S9 Ultra, Galaxy Tab S9+, Galaxy Tab S9, Surface Pro 9, Kindle Paperwhite, Other |
| Storage | select | ✅ | 32GB, 64GB, 128GB, 256GB, 512GB, 1TB, 2TB |
| Connectivity | select | ❌ | WiFi Only, WiFi + Cellular (LTE), WiFi + Cellular (5G) |
| Screen Size | select | ❌ | Under 8", 8-10", 10-11", 11-12", 12-13", 13"+ |
| Display Type | select | ❌ | LCD, LED, OLED, Mini-LED, E-Ink |
| Stylus Support | boolean | ❌ | Yes/No |
| Keyboard Compatible | boolean | ❌ | Yes/No |
| Processor | select | ❌ | Apple M4, Apple M2, Apple A-Series, Snapdragon, MediaTek, Intel, AMD |

**Laptops Attributes (`laptops`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Laptop Type | select | ✅ | Gaming, Business/Professional, Ultrabook, Student, Workstation, 2-in-1 Convertible, MacBook |
| Processor Brand | select | ❌ | Intel Core i3, Intel Core i5, Intel Core i7, Intel Core i9, Intel Core Ultra, AMD Ryzen 3, AMD Ryzen 5, AMD Ryzen 7, AMD Ryzen 9, Apple M1, Apple M2, Apple M3, Apple M4 |
| Processor Generation | select | ❌ | Latest Gen, Previous Gen, 2+ Years Old |
| RAM | select | ✅ | 4GB, 8GB, 16GB, 32GB, 64GB, 128GB |
| Storage Type | select | ❌ | NVMe SSD, SATA SSD, HDD, SSD + HDD Combo |
| Storage Size | select | ✅ | 128GB, 256GB, 512GB, 1TB, 2TB, 4TB+ |
| Screen Size | select | ✅ | 11-12", 13-14", 15-16", 17-18" |
| Screen Resolution | select | ❌ | HD (1366x768), Full HD (1920x1080), 2K QHD, 4K UHD, OLED, Retina |
| Refresh Rate | select | ❌ | 60Hz, 90Hz, 120Hz, 144Hz, 165Hz, 240Hz, 360Hz |
| Graphics Card | select | ❌ | Integrated Intel, Integrated AMD, NVIDIA GeForce GTX, NVIDIA GeForce RTX 30 Series, NVIDIA GeForce RTX 40 Series, AMD Radeon RX, Apple Integrated |
| Battery Life | select | ❌ | Under 4 hours, 4-6 hours, 6-8 hours, 8-10 hours, 10-12 hours, 12+ hours |
| Weight | select | ❌ | Under 1kg, 1-1.5kg, 1.5-2kg, 2-2.5kg, 2.5kg+ |
| Touch Screen | boolean | ❌ | Yes/No |
| Backlit Keyboard | boolean | ❌ | Yes/No |
| Fingerprint Reader | boolean | ❌ | Yes/No |
| Ports | multiselect | ❌ | USB-A, USB-C, Thunderbolt 4, HDMI, DisplayPort, SD Card Slot, Ethernet (RJ45), Headphone Jack |

**Desktop PCs Attributes (`desktops`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| PC Type | select | ✅ | Gaming PC, Office/Home PC, All-in-One, Workstation, Mini PC, Barebone |
| Processor | select | ✅ | Intel Core i3, Intel Core i5, Intel Core i7, Intel Core i9, AMD Ryzen 3, AMD Ryzen 5, AMD Ryzen 7, AMD Ryzen 9, AMD Threadripper |
| RAM | select | ✅ | 4GB, 8GB, 16GB, 32GB, 64GB, 128GB |
| Storage | select | ✅ | 256GB SSD, 512GB SSD, 1TB SSD, 2TB+ SSD, HDD + SSD Combo |
| Graphics Card | select | ❌ | Integrated, NVIDIA GeForce GTX, NVIDIA GeForce RTX 30, NVIDIA GeForce RTX 40, NVIDIA RTX Quadro, AMD Radeon RX 6000, AMD Radeon RX 7000 |
| Form Factor | select | ❌ | Full Tower, Mid Tower, Mini Tower, Small Form Factor (SFF), All-in-One |
| Operating System | select | ❌ | Windows 11 Pro, Windows 11 Home, Windows 10, Linux, No OS |

**Monitors Attributes (`monitors`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Screen Size | select | ✅ | Under 22", 22-24", 24-27", 27-32", 32-34" (Ultrawide), 34-38" (Ultrawide), 38"+ |
| Resolution | select | ✅ | Full HD 1080p, QHD 1440p, 4K UHD, 5K, 8K, Ultrawide 2560x1080, Ultrawide 3440x1440, Super Ultrawide 5120x1440 |
| Panel Type | select | ✅ | IPS, VA, TN, OLED, Mini-LED, Nano IPS |
| Refresh Rate | select | ✅ | 60Hz, 75Hz, 100Hz, 120Hz, 144Hz, 165Hz, 180Hz, 240Hz, 280Hz, 360Hz, 500Hz |
| Response Time | select | ❌ | 0.5ms, 1ms, 2ms, 4ms, 5ms+ |
| Aspect Ratio | select | ❌ | 16:9, 21:9 (Ultrawide), 32:9 (Super Ultrawide), 16:10, 4:3 |
| HDR Support | select | ❌ | No HDR, HDR10, HDR400, HDR600, HDR1000, DisplayHDR True Black, Dolby Vision |
| Adaptive Sync | multiselect | ❌ | None, NVIDIA G-Sync, G-Sync Compatible, AMD FreeSync, FreeSync Premium, FreeSync Premium Pro |
| Curved | boolean | ❌ | Yes/No |
| Built-in Speakers | boolean | ❌ | Yes/No |
| USB Hub | boolean | ❌ | Yes/No |
| Use Case | multiselect | ❌ | Gaming, Office Work, Photo/Video Editing, Graphic Design, Programming, General Use |

**Audio/Headphones Attributes (`audio`, `headphones`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Headphone Type | select | ✅ | Over-Ear, On-Ear, In-Ear/Earbuds, True Wireless (TWS), Neckband, Bone Conduction, Open-Back, Closed-Back |
| Connection Type | multiselect | ✅ | Wired 3.5mm, Wired USB-C, Wired USB-A, Bluetooth 5.0, Bluetooth 5.2, Bluetooth 5.3, 2.4GHz Wireless, Both Wired & Wireless |
| Noise Cancellation | select | ❌ | None, Passive, Active (ANC), Adaptive ANC, Transparency Mode |
| Driver Size | select | ❌ | Under 10mm, 10-30mm, 30-40mm, 40-50mm, 50mm+ |
| Battery Life | select | ❌ | Under 10h, 10-20h, 20-30h, 30-40h, 40-50h, 50h+ |
| Water Resistance | select | ❌ | None, IPX4 (Splash), IPX5 (Rain), IPX7 (Immersible), IP68 |
| Best For | multiselect | ❌ | Gaming, Music Production, Sports/Workout, Commuting, Office/Work, Home Use, Audiophile |
| Microphone | boolean | ❌ | Yes/No |
| Foldable | boolean | ❌ | Yes/No |
| Hi-Res Audio | boolean | ❌ | Yes/No |

**Televisions Attributes (`televisions-category`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Screen Size | select | ✅ | 32", 40", 43", 50", 55", 58", 65", 70", 75", 77", 83", 85", 98"+ |
| Display Technology | select | ✅ | LED, QLED, QNED, OLED, QD-OLED, Mini-LED, MicroLED, NanoCell, Crystal UHD |
| Resolution | select | ✅ | HD 720p, Full HD 1080p, 4K UHD, 8K |
| Smart TV Platform | select | ❌ | Google TV, Android TV, Tizen (Samsung), webOS (LG), Roku TV, Fire TV, Vidaa, Non-Smart |
| HDR Support | multiselect | ❌ | HDR10, HDR10+, Dolby Vision, HLG, HDR10+ Adaptive |
| Refresh Rate | select | ❌ | 50Hz, 60Hz, 100Hz, 120Hz, 144Hz |
| HDMI Ports | select | ❌ | 1, 2, 3, 4, 5+ |
| HDMI 2.1 | boolean | ❌ | Yes/No |
| VRR (Variable Refresh Rate) | boolean | ❌ | Yes/No |
| ALLM (Auto Low Latency Mode) | boolean | ❌ | Yes/No |
| Voice Assistant | multiselect | ❌ | None, Google Assistant, Amazon Alexa, Bixby, Apple AirPlay |
| Energy Class | select | ❌ | A+++, A++, A+, A, B, C, D, E, F, G |

**Cameras Attributes (`electronics-cameras`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Camera Type | select | ✅ | Mirrorless Full-Frame, Mirrorless APS-C, Mirrorless MFT, DSLR Full-Frame, DSLR APS-C, Compact, Action Camera, Camcorder, Instant Camera, Film Camera |
| Sensor Size | select | ❌ | Full Frame (35mm), APS-C, Micro Four Thirds, 1-inch, 1/2.3", Medium Format |
| Megapixels | select | ❌ | Under 12MP, 12-20MP, 20-30MP, 30-40MP, 40-50MP, 50-60MP, 60MP+ |
| Video Resolution | select | ❌ | 1080p Full HD, 4K 30fps, 4K 60fps, 4K 120fps, 6K, 8K |
| Image Stabilization | select | ❌ | None, Optical (OIS), In-Body (IBIS), Both OIS + IBIS |
| Lens Mount | select | ❌ | Canon RF, Canon EF, Canon EF-M, Sony E, Nikon Z, Nikon F, Fujifilm X, Fujifilm GFX, Micro Four Thirds, Leica L, Fixed Lens |
| Viewfinder Type | select | ❌ | EVF (Electronic), OVF (Optical), Hybrid, LCD Only |
| Weather Sealed | boolean | ❌ | Yes/No |
| WiFi/Bluetooth | boolean | ❌ | Yes/No |
| Flip Screen | boolean | ❌ | Yes/No |
| Dual Card Slots | boolean | ❌ | Yes/No |

**Smart Devices / Wearables Attributes (`smart-devices`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Device Type | select | ✅ | Smartwatch, Fitness Tracker, Smart Ring, Smart Glasses, Smart Speaker, Smart Display, Robot Vacuum, Video Doorbell, Security Camera, Smart Lock, Smart Thermostat, Smart Lighting |
| Compatibility | multiselect | ✅ | iOS (Apple), Android, Both iOS & Android, Standalone |
| Connectivity | multiselect | ❌ | Bluetooth, WiFi, LTE/Cellular, GPS, NFC, Zigbee, Z-Wave, Thread, Matter |
| Battery Life | select | ❌ | Under 1 day, 1-3 days, 3-7 days, 7-14 days, 14-30 days, 30+ days, Wired/No Battery |
| Display | select | ❌ | AMOLED, LCD, E-Ink, No Display |
| Water Resistance | select | ❌ | None, IPX4, IPX7, IP68, 5ATM, 10ATM |
| Health Features | multiselect | ❌ | Heart Rate, SpO2, ECG, Blood Pressure, Sleep Tracking, Stress Monitoring, Body Temperature, Fall Detection |
| Smart Assistant | multiselect | ❌ | Google Assistant, Amazon Alexa, Siri, Bixby, None |
| Case Size (Watches) | select | ❌ | 38-40mm, 41-42mm, 44-46mm, 47mm+ |

---

### 👗 7. FASHION (`fashion`)
**L1 Subcategories:**
- **Women's Clothing** (`womens-clothing`) 👚
  - L2: Dresses (`dresses`)
  - L2: Tops & Blouses (`tops-blouses`)
  - L2: Pants & Jeans (`pants-jeans`)
  - L2: Skirts (`skirts`)
  - L2: Jackets & Coats (`jackets-coats`)
  - L2: Activewear (`activewear`)
  - L2: Swimwear (`swimwear`)
- **Men's Clothing** (`mens-clothing`) 👔
  - L2: T-Shirts (`t-shirts`)
  - L2: Shirts (`shirts`)
  - L2: Pants (`pants`)
  - L2: Suits & Blazers (`suits-blazers`)
  - L2: Outerwear (`outerwear`)
- **Shoes** (`shoes`) 👟
  - L2: Women's Shoes (`womens-shoes`)
  - L2: Men's Shoes (`mens-shoes`)
  - L2: Sports Shoes (`sports-shoes`)
  - L2: Kids' Shoes (`kids-shoes`)
- **Bags & Luggage** (`bags-luggage`) 👜
- **Accessories** (`fashion-accessories`) 🕶️
- **Watches** (`fashion-watches`) ⌚

---

### 🎮 8. GAMING (`gaming`) ✅ COMPLETE - 222 categories, 55 attributes
**L1 Subcategories (9):**

- **PC Gaming** (`pc-gaming-main`) 🖥️
  - L2: Gaming Keyboards (`pc-gaming-keyboards`) ⌨️
    - L3: Mechanical Keyboards (`kb-mechanical`), Membrane Keyboards (`kb-membrane`), 60% Keyboards (`kb-60-percent`), TKL Keyboards (`kb-tkl`), Full-Size Keyboards (`kb-full-size`), Wireless Gaming Keyboards (`kb-wireless`), RGB Keyboards (`kb-rgb`), Keycaps (`kb-keycaps`)
  - L2: Gaming Mice (`pc-gaming-mice`) 🖱️
    - L3: Wired Gaming Mice (`mouse-wired`), Wireless Gaming Mice (`mouse-wireless`), Ambidextrous Mice (`mouse-ambidextrous`), Ergonomic Gaming Mice (`mouse-ergonomic`), MMO Gaming Mice (`mouse-mmo`), FPS Gaming Mice (`mouse-fps`), Lightweight Gaming Mice (`mouse-lightweight`)
  - L2: Gaming Headsets (`pc-gaming-headsets`) 🎧
    - L3: Wired Gaming Headsets (`headset-wired`), Wireless Gaming Headsets (`headset-wireless`), 7.1 Surround Headsets (`headset-surround`), Open-Back Gaming Headsets (`headset-open-back`), Noise Cancelling Headsets (`headset-anc`)
  - L2: Gaming Mousepads (`pc-gaming-mousepads`) 🎯
    - L3: Cloth Mousepads (`mousepad-cloth`), Hard Surface Mousepads (`mousepad-hard`), Extended Desk Mats (`mousepad-extended`), RGB Mousepads (`mousepad-rgb`), Wrist Rest Mousepads (`mousepad-wrist-rest`)
  - L2: PC Controllers (`pc-gaming-controllers`) 🎮
    - L3: Xbox Style Controllers (`controller-xbox-style`), PlayStation Style Controllers (`controller-ps-style`), Arcade Sticks (`controller-arcade-stick`), Racing Wheels (`controller-racing-wheel`), Flight Sticks (`controller-flight-stick`), Custom Controllers (`controller-custom`)
  - L2: Gaming Monitors (`pc-gaming-monitors-cat`) 🖥️
    - L3: 144Hz Gaming Monitors (`monitor-144hz`), 240Hz Gaming Monitors (`monitor-240hz`), 360Hz+ Gaming Monitors (`monitor-360hz`), 4K Gaming Monitors (`monitor-4k-gaming`), Ultrawide Gaming Monitors (`monitor-ultrawide-gaming`), Curved Gaming Monitors (`monitor-curved-gaming`), OLED Gaming Monitors (`monitor-oled-gaming`), Portable Gaming Monitors (`monitor-portable-gaming`)
  - L2: Gaming PCs (`pc-gaming-computers`) 💻
    - L3: Entry-Level Gaming PCs (`gaming-pc-entry`), Mid-Range Gaming PCs (`gaming-pc-mid`), High-End Gaming PCs (`gaming-pc-high`), Extreme Gaming PCs (`gaming-pc-extreme`), Mini Gaming PCs (`gaming-pc-mini`), Gaming Laptops (`gaming-laptops-cat`)
  - L2: PC Games (`pc-games-cat`) 🎮
    - L3: Physical PC Games (`pc-games-physical`), Digital Game Codes (`pc-games-digital`), Steam Gift Cards (`pc-games-steam`), Game Subscriptions (`pc-games-subscriptions`)

- **Console Gaming** (`console-gaming`) 🎮
  - L2: PlayStation (`console-playstation-cat`)
    - L3: PS5 Consoles (`ps5-consoles`), PS5 Games (`ps5-games`), PS5 Controllers (`ps5-controllers`), PS5 Accessories (`ps5-accessories`), PS4 Consoles (`ps4-consoles`), PS4 Games (`ps4-games`), PS4 Controllers (`ps4-controllers`), PS4 Accessories (`ps4-accessories`), PlayStation VR2 (`psvr2`), PSN Gift Cards (`psn-gift-cards`)
  - L2: Xbox (`console-xbox-cat`)
    - L3: Xbox Series X Consoles (`xbox-series-x`), Xbox Series S Consoles (`xbox-series-s`), Xbox Games (`xbox-games`), Xbox Controllers (`xbox-controllers`), Xbox Accessories (`xbox-accessories`), Xbox Elite Controllers (`xbox-elite-controllers`), Xbox One Consoles (`xbox-one-consoles`), Xbox One Games (`xbox-one-games`), Xbox Gift Cards (`xbox-gift-cards`), Xbox Game Pass (`xbox-game-pass`)
  - L2: Nintendo (`console-nintendo-cat`)
    - L3: Nintendo Switch OLED (`switch-oled`), Nintendo Switch (`switch-standard`), Nintendo Switch Lite (`switch-lite`), Switch Games (`switch-games`), Switch Controllers (`switch-controllers`), Joy-Con Controllers (`joycon-controllers`), Switch Accessories (`switch-accessories`), Switch Carrying Cases (`switch-cases`), Nintendo eShop Cards (`nintendo-eshop`), Amiibo (`amiibo-figures`)
  - L2: Console Accessories (`console-accessories-cat`) 🎧
    - L3: Console Headsets (`console-headsets`), Charging Stations (`console-charging-stations`), Controller Grips (`controller-grips`), Controller Skins (`controller-skins`), Console Stands (`console-stands`), Console Cooling (`console-cooling`), External Storage (`console-external-storage`), Console Bags & Cases (`console-bags`)
  - L2: Handheld Gaming (`handheld-gaming`) 📱
    - L3: Steam Deck (`steam-deck`), Steam Deck Accessories (`steam-deck-accessories`), Asus ROG Ally (`rog-ally`), Lenovo Legion Go (`legion-go`), Handheld Accessories (`handheld-accessories`), Retro Handhelds (`retro-handhelds`)

- **Gaming Furniture** (`gaming-furniture`) 🪑
  - L2: Gaming Chairs (`gaming-chairs-cat`)
    - L3: Racing Style Chairs (`chairs-racing`), Ergonomic Gaming Chairs (`chairs-ergonomic`), Gaming Rocker Chairs (`chairs-rocker`), Gaming Bean Bags (`chairs-bean-bags`), Premium Gaming Chairs (`chairs-premium`), Kids Gaming Chairs (`chairs-kids`), Chair Accessories (`chair-accessories`)
  - L2: Gaming Desks (`gaming-desks-cat`) 🖥️
    - L3: Standard Gaming Desks (`desks-standard`), L-Shaped Gaming Desks (`desks-l-shaped`), Standing Gaming Desks (`desks-standing`), Compact Gaming Desks (`desks-compact`), RGB Gaming Desks (`desks-rgb`), Desk Accessories (`desk-accessories`)
  - L2: Gaming Room Setup (`gaming-room-setup`) 🏠
    - L3: Monitor Arms & Mounts (`room-monitor-mounts`), Cable Management (`room-cable-management`), RGB Lighting (`room-rgb-lighting`), LED Strip Lights (`room-led-strips`), Acoustic Panels (`room-acoustic-panels`), Gaming Shelves (`room-shelves`), Headphone Stands (`room-headphone-stands`), Controller Displays (`room-controller-displays`)

- **Gaming Accessories** (`gaming-accessories-main`) 🎧
  - L2: Gaming Glasses (`gaming-glasses`) 👓
    - L3: Blue Light Glasses (`glasses-blue-light`), Prescription Gaming Glasses (`glasses-prescription`), Clip-On Gaming Lenses (`glasses-clip-on`)
  - L2: Gaming Bags & Cases (`gaming-bags`) 🎒
    - L3: Gaming Backpacks (`bags-backpacks`), Laptop Gaming Bags (`bags-laptop`), PC Tower Cases (`bags-tower`), LAN Party Bags (`bags-lan`)
  - L2: Gaming Merchandise (`gaming-merchandise`) 👕
    - L3: Gaming T-Shirts (`merch-tshirts`), Gaming Hoodies (`merch-hoodies`), Gaming Figures (`merch-figures`), Gaming Posters (`merch-posters`), Gaming Mugs (`merch-mugs`), Gaming Collectibles (`merch-collectibles`)

- **VR & AR Gaming** (`vr-ar-gaming`) 🥽
  - L2: VR Headsets (`vr-headsets`)
    - L3: Standalone VR Headsets (`vr-standalone`), PC VR Headsets (`vr-pc`), PlayStation VR (`vr-playstation`), Meta Quest (`vr-meta-quest`), Valve Index (`vr-valve-index`), HP Reverb (`vr-hp-reverb`)
  - L2: VR Accessories (`vr-accessories`) 🎮
    - L3: VR Controllers (`vr-controllers`), VR Face Covers (`vr-face-covers`), VR Head Straps (`vr-head-straps`), VR Charging Docks (`vr-charging`), VR Prescription Lenses (`vr-lenses`), VR Cable Management (`vr-cable-management`)
  - L2: VR Games & Experiences (`vr-games`)
  - L2: AR Gaming (`ar-gaming`) 📱

- **Streaming & Content Creation** (`streaming-equipment`) 📹
  - L2: Capture Cards (`capture-cards`)
    - L3: Internal Capture Cards (`capture-internal`), External Capture Cards (`capture-external`), 4K Capture Cards (`capture-4k`)
  - L2: Stream Decks (`stream-decks`) 🎛️
  - L2: Streaming Microphones (`streaming-microphones`) 🎤
    - L3: USB Streaming Microphones (`mic-usb`), XLR Streaming Microphones (`mic-xlr`), Boom Arms (`mic-boom-arms`), Pop Filters (`mic-pop-filters`), Audio Interfaces (`mic-audio-interfaces`)
  - L2: Webcams & Cameras (`streaming-webcams`) 📷
    - L3: 1080p Webcams (`webcam-1080p`), 4K Webcams (`webcam-4k`), DSLR/Mirrorless for Streaming (`webcam-dslr`)
  - L2: Lighting Equipment (`streaming-lighting`) 💡
    - L3: Ring Lights (`light-ring`), Key Lights (`light-key`), Light Panels (`light-panels`), Light Bars (`light-bars`)
  - L2: Green Screens (`green-screens`) 🟩

- **Retro Gaming** (`retro-gaming`) 👾
  - L2: Retro Consoles (`retro-consoles`) 🕹️
    - L3: Nintendo NES/SNES (`retro-nintendo`), Sega Genesis/Mega Drive (`retro-sega`), PlayStation 1/2/3 (`retro-playstation`), Xbox/Xbox 360 (`retro-xbox`), Atari (`retro-atari`), Arcade Cabinets (`retro-arcade`), Mini Consoles (`retro-mini`)
  - L2: Retro Games (`retro-games`) 🎮
    - L3: NES Games (`retro-nes-games`), SNES Games (`retro-snes-games`), Sega Games (`retro-sega-games`), PS1/PS2 Games (`retro-ps-games`), N64 Games (`retro-n64-games`), GameBoy Games (`retro-gameboy-games`)
  - L2: Retro Accessories (`retro-accessories`)
    - L3: Retro Controllers (`retro-controllers`), AV Cables & Adapters (`retro-av-cables`), Memory Cards (`retro-memory-cards`), Console Mods (`retro-mods`)

- **Trading Cards** (`trading-cards`) 🃏
  - L2: Pokémon Cards (`pokemon-cards`)
  - L2: Magic: The Gathering (`mtg-cards`)
  - L2: Yu-Gi-Oh! Cards (`yugioh-cards`)
  - L2: Sports Cards (`sports-cards`)

- **Board Games** (`board-games`) 🎲
  - L2: Strategy Games (`board-strategy`)
  - L2: Party Games (`board-party`)
  - L2: Card Games (`board-cards`)
  - L2: Family Games (`board-family`)
  - L2: Classic Games (`board-classic`)

**Gaming Attributes (55 total):**

**Global Gaming Attributes:**
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Brand | select | ❌ | ✅ | Razer, Logitech, Corsair, SteelSeries, HyperX, ASUS ROG, MSI, Alienware, Roccat, Glorious, Ducky, Sony, Microsoft, Nintendo, NZXT, Secretlab, noblechairs, DXRacer, Elgato, Blue, Rode, Audio-Technica, Other |
| Condition | select | ✅ | ✅ | New, Like New, Very Good, Good, Acceptable, For Parts |
| Color | select | ❌ | ✅ | Black, White, Gray, Red, Blue, Green, Pink, Purple, RGB/Multi-color, Custom |
| RGB Lighting | boolean | ❌ | ✅ | Yes/No |
| Warranty | select | ❌ | ✅ | No Warranty, 1 Month, 3 Months, 6 Months, 1 Year, 2 Years, 3+ Years, Manufacturer Warranty |

**Gaming Keyboards Attributes (`pc-gaming-keyboards`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Switch Type | select | Cherry MX Red/Blue/Brown/Black/Speed, Gateron Red/Blue/Brown, Razer Green/Orange/Yellow, Logitech GX, Hot-Swappable, Membrane, Optical, Other |
| Keyboard Layout | select | Full Size (100%), TKL (80%), 75%, 65%, 60%, 40%, Numpad Only |
| Connection Type | select | Wired USB, Wired USB-C, Wireless 2.4GHz, Bluetooth, Wired + Wireless, Triple Mode |
| Hot-Swappable | boolean | Yes/No |
| N-Key Rollover | boolean | Yes/No |
| Wrist Rest | boolean | Yes/No |

**Gaming Mice Attributes (`pc-gaming-mice`):**
| Attribute | Type | Options |
|-----------|------|---------|
| DPI/CPI | select | Up to 8000, 8000-12000, 12000-16000, 16000-20000, 20000-25000, 25000+ |
| Sensor Type | select | Optical, Laser, Hero (Logitech), Focus+ (Razer), TrueMove (SteelSeries), PAW3370, PAW3399, Other |
| Mouse Connection | select | Wired, Wireless 2.4GHz, Bluetooth, Wired + Wireless, Triple Mode |
| Mouse Weight | select | Ultra Light (<60g), Light (60-80g), Medium (80-100g), Heavy (100-120g), Very Heavy (120g+), Adjustable |
| Number of Buttons | select | 2-4 Buttons, 5-6 Buttons, 7-9 Buttons, 10-12 Buttons, 12+ Buttons (MMO) |
| Grip Style | select | Palm Grip, Claw Grip, Fingertip Grip, Universal/All Grips |
| Polling Rate | select | 125Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz |

**Gaming Headsets Attributes (`pc-gaming-headsets`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Headset Connection | select | Wired 3.5mm, Wired USB, Wireless 2.4GHz, Bluetooth, Wired + Wireless |
| Surround Sound | select | Stereo, Virtual 7.1, True 7.1, Dolby Atmos, DTS:X, 3D Audio |
| Driver Size | select | 40mm, 50mm, 53mm, 55mm+, Other |
| Microphone Type | select | Fixed Boom, Detachable Boom, Retractable, Flip-to-Mute, No Microphone |
| Noise Cancellation | select | None, Passive, Active (ANC), Hybrid ANC |
| Ear Cup Design | select | Over-Ear Closed, Over-Ear Open, On-Ear |

**Gaming Monitors Attributes (`pc-gaming-monitors-cat`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Screen Size | select | Under 24", 24-25", 27", 28-32", 34" Ultrawide, 38"+ Ultrawide, 49" Super Ultrawide |
| Resolution | select | 1080p (Full HD), 1440p (2K QHD), 4K UHD, 1080p Ultrawide, 1440p Ultrawide, 5K |
| Refresh Rate | select | 60Hz, 75Hz, 100Hz, 120Hz, 144Hz, 165Hz, 180Hz, 240Hz, 280Hz, 360Hz, 500Hz+ |
| Panel Type | select | IPS, VA, TN, OLED, QD-OLED, Mini-LED, Nano IPS |
| Response Time | select | 0.5ms, 1ms, 2ms, 4ms, 5ms+ |
| Adaptive Sync | multiselect | None, G-Sync, G-Sync Compatible, G-Sync Ultimate, FreeSync, FreeSync Premium, FreeSync Premium Pro |
| HDR Support | select | No HDR, HDR10, HDR400, HDR600, HDR1000, HDR1400, Dolby Vision |
| Curved | boolean | Yes/No |

**Console Gaming Attributes (`console-gaming`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Console Platform | select | PlayStation 5, PlayStation 4, Xbox Series X, Xbox Series S, Xbox One, Nintendo Switch, Nintendo Switch OLED, Nintendo Switch Lite, Steam Deck |
| Console Storage | select | 256GB, 500GB, 512GB, 825GB, 1TB, 2TB |
| Console Edition | select | Standard, Digital Edition, Limited Edition, Bundle, Slim, Pro/Enhanced |
| Game Genre | multiselect | Action, Adventure, RPG, Sports, Racing, Shooter, Strategy, Simulation, Fighting, Horror, Puzzle, Platformer, Open World, Battle Royale, MMORPG, Indie |
| Game Rating (PEGI) | select | PEGI 3, PEGI 7, PEGI 12, PEGI 16, PEGI 18 |
| Multiplayer | multiselect | Single Player Only, Local Co-op, Online Co-op, Local PvP, Online PvP, Cross-Platform, Split Screen |

**Gaming Chairs Attributes (`gaming-chairs-cat`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Chair Style | select | Racing Style, Ergonomic, Executive, Rocker, Bean Bag, Floor |
| Max Weight Capacity | select | Up to 100kg, 100-120kg, 120-150kg, 150-180kg, 180kg+ |
| Armrests | select | None, Fixed, 1D (Height), 2D (Height + Width), 3D, 4D (All Directions) |
| Chair Material | select | PU Leather, Real Leather, Fabric/Mesh, Hybrid |
| Recline Angle | select | 90-120°, 90-135°, 90-155°, 90-180° (Full Flat) |
| Lumbar Support | select | None, Fixed Pillow, Adjustable Pillow, Built-in Adjustable, Built-in + Pillow |

**VR Headsets Attributes (`vr-headsets`):**
| Attribute | Type | Options |
|-----------|------|---------|
| VR Type | select | Standalone, PC VR (Tethered), PC VR (Wireless), PlayStation VR, Mobile VR |
| VR Resolution (per eye) | select | 1080p, 1440p, 1832x1920, 2160x2160, 2448x2448, 2880x2880+ |
| VR Refresh Rate | select | 72Hz, 80Hz, 90Hz, 120Hz, 144Hz |
| Tracking | select | Inside-Out, Outside-In (Base Stations), Hybrid, Controller-Based |
| Controllers Included | boolean | Yes/No |

**Streaming Equipment Attributes (`streaming-equipment`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Capture Resolution | select | 720p, 1080p 30fps, 1080p 60fps, 1440p 60fps, 4K 30fps, 4K 60fps, 4K 120fps |
| Passthrough | select | 1080p 60fps, 1440p 60fps, 4K 60fps, 4K 60fps HDR, 4K 120fps, 4K 144fps VRR |
| Interface | select | USB 2.0, USB 3.0, USB-C, PCIe, Thunderbolt |

**Retro Gaming Attributes (`retro-gaming`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Retro Console | select | NES, SNES, N64, GameCube, Wii, Game Boy, GBA, DS/3DS, Sega Genesis/Mega Drive, Sega Saturn, Dreamcast, PS1, PS2, PS3, PSP, PS Vita, Original Xbox, Xbox 360, Atari 2600/7800, Neo Geo, TurboGrafx-16, Other |
| Region | select | PAL, NTSC-U, NTSC-J, Region Free |
| Complete In Box | select | CIB (Complete In Box), Cartridge/Disc Only, Box + Game (No Manual), Sealed/New |

---

### 🛒 9. GROCERY & FOOD (`grocery`)
> **Updated December 4, 2025** - Comprehensive expansion with 300 categories and 21 attributes
> Focus on Bulgarian marketplace: homegrown products, traditional foods, local specialties

**L1 Subcategories (13):**

- **Dairy & Animal Products** (`grocery-dairy`) 🥛
  - L2: Milk & Cream (`dairy-milk`) → L3: Whole Milk, Skimmed, Goat Milk, Sheep Milk, Plant-Based, Cream
  - L2: Cheese (`dairy-cheese`) → L3: Sirene 🇧🇬, Kashkaval 🇧🇬, Feta, Mozzarella, Cheddar, Goat Cheese, Sheep Cheese, Cream Cheese, Blue Cheese, Brie, Parmesan, Cottage
  - L2: Yogurt (`dairy-yogurt`) → L3: Bulgarian Yogurt 🇧🇬, Greek Yogurt, Fruit Yogurt, Probiotic, Goat Yogurt, Sheep Yogurt, Kids Yogurt, Dairy-Free
  - L2: Eggs (`dairy-eggs`) → L3: Chicken Eggs, Free-Range, Organic, Quail Eggs, Duck Eggs
  - L2: Butter & Margarine (`dairy-butter`)
  - L2: Honey & Bee Products (`dairy-honey`) → L3: Acacia Honey, Wildflower, Mountain Honey, Linden Honey, Honeycomb, Propolis, Royal Jelly, Bee Pollen

- **Fruits** (`grocery-fruits`) 🍎
  - L2: Fresh Apples & Pears (`fruits-apples`)
  - L2: Citrus Fruits (`fruits-citrus`)
  - L2: Berries (`fruits-berries`) → L3: Strawberries, Blueberries, Raspberries, Blackberries, Mulberries, Currants, Gooseberries
  - L2: Stone Fruits (`fruits-stone`) → L3: Peaches, Plums, Cherries, Sour Cherries, Apricots, Nectarines
  - L2: Tropical Fruits (`fruits-tropical`)
  - L2: Melons (`fruits-melons`)
  - L2: Grapes (`fruits-grapes`)
  - L2: Dried Fruits (`fruits-dried`)

- **Vegetables** (`grocery-vegetables`) 🥬
  - L2: Leafy Greens (`veg-leafy`) → L3: Lettuce, Spinach, Cabbage, Kale, Arugula, Swiss Chard
  - L2: Tomatoes & Peppers (`veg-tomatoes`) → L3: Tomatoes, Cherry Tomatoes, Bell Peppers, Hot Peppers, Kapia Peppers 🇧🇬
  - L2: Root Vegetables (`veg-roots`) → L3: Potatoes, Carrots, Beets, Radishes, Sweet Potatoes, Turnips, Parsnips
  - L2: Onions & Garlic (`veg-onions`)
  - L2: Cucumbers & Squash (`veg-cucumbers`)
  - L2: Legumes & Beans (`veg-legumes`)
  - L2: Mushrooms (`veg-mushrooms`)
  - L2: Corn & Peas (`veg-corn`)
  - L2: Fresh Herbs (`veg-herbs`) → L3: Parsley, Dill, Coriander, Basil, Mint, Rosemary, Thyme, Oregano, Chives

- **Meat & Seafood** (`grocery-meat`) 🥩
  - L2: Beef (`meat-beef`) → L3: Ground Beef, Steaks, Ribs, Roasts, Tongue
  - L2: Pork (`meat-pork`) → L3: Ground Pork, Chops, Ribs, Tenderloin, Shoulder, Belly
  - L2: Chicken (`meat-chicken`) → L3: Whole Chicken, Breast, Thighs, Wings, Drumsticks, Ground
  - L2: Lamb & Goat (`meat-lamb`)
  - L2: Sausages & Deli (`meat-sausages`) → L3: Lukanka 🇧🇬, Sudzhuk 🇧🇬, Nadenitsa 🇧🇬, Kebapche Mix 🇧🇬, Kyufte Mix 🇧🇬, Pastarma 🇧🇬, Frankfurt, Chorizo
  - L2: Game Meat (`meat-game`)
  - L2: Fresh Fish (`seafood-fish`) → L3: Salmon, Trout, Mackerel, Sardines, Carp, Catfish, Sea Bass, Cod
  - L2: Shellfish (`seafood-shellfish`) → L3: Shrimp, Mussels, Calamari, Octopus, Crab

- **Bakery & Bread** (`grocery-bakery`) 🥖
  - L2: Fresh Bread (`bakery-bread`) → L3: White, Whole Wheat, Rye, Sourdough, Baguette, Pogacha 🇧🇬, Pitka 🇧🇬
  - L2: Pastries (`bakery-pastry`) → L3: Banitsa (Cheese) 🇧🇬, Banitsa (Spinach) 🇧🇬, Tikvenik 🇧🇬, Mekitsi 🇧🇬, Tutmanik 🇧🇬, Burek, Croissant, Danish
  - L2: Cakes & Desserts (`bakery-cakes`) → L3: Birthday Cakes, Cheesecake, Chocolate Cake, Fruit Cake, Garash 🇧🇬, Custom Cakes
  - L2: Cookies & Biscuits (`bakery-cookies`)
  - L2: Rolls & Buns (`bakery-rolls`)
  - L2: Gluten-Free (`bakery-glutenfree`)

- **Drinks & Beverages** (`grocery-drinks`) 🍷
  - L2: Wine (`drinks-wine`) → L3: Red Wine, White Wine, Rosé, Mavrud 🇧🇬, Melnik 🇧🇬, Gamza 🇧🇬, Sparkling, Dessert Wine
  - L2: Rakia & Spirits (`drinks-rakia`) → L3: Grape Rakia 🇧🇬, Plum (Slivova) 🇧🇬, Apricot (Kaisiyeva) 🇧🇬, Quince (Dunyova) 🇧🇬, Muscat 🇧🇬, Mastika 🇧🇬, Homemade Rakia 🇧🇬
  - L2: Beer (`drinks-beer`) → L3: Lager, Dark Beer, Wheat Beer, Craft Beer, Non-Alcoholic
  - L2: Coffee (`drinks-coffee`) → L3: Ground Coffee, Beans, Instant, Capsules, Turkish Coffee, Decaf
  - L2: Tea (`drinks-tea`) → L3: Black Tea, Green Tea, Herbal, Fruit Tea, Mountain Tea (Mursalski) 🇧🇬, Chamomile, Mint
  - L2: Soft Drinks (`drinks-soft`) → L3: Mineral Water, Spring Water, Carbonated, Energy Drinks, Ice Tea
  - L2: Natural Juices (`drinks-juices`) → L3: Orange, Apple, Grape, Tomato, Peach Nectar, Multivitamin, Fresh Pressed
  - L2: Ayran & Boza (`drinks-traditional`) 🇧🇬
  - L2: Energy & Sports (`drinks-energy`)

- **Pantry & Dry Goods** (`grocery-pantry`) 🥫
  - L2: Rice & Grains (`pantry-rice`) → L3: White Rice, Brown Rice, Basmati, Jasmine, Risotto Rice
  - L2: Pasta & Noodles (`pantry-pasta`) → L3: Spaghetti, Penne, Fusilli, Macaroni, Lasagna, Egg Noodles (Yufka)
  - L2: Cooking Oils (`pantry-oils`) → L3: Sunflower Oil, Olive Oil, Extra Virgin, Coconut Oil, Sesame Oil
  - L2: Canned Goods (`pantry-canned`) → L3: Tomatoes, Beans, Corn, Peas, Fish, Meat
  - L2: Flour & Baking (`pantry-flour`) → L3: All-Purpose, Whole Wheat, Bread Flour, Cornmeal, Baking Powder, Yeast, Sugar
  - L2: Condiments & Sauces (`pantry-sauces`)
  - L2: Spices & Seasonings (`pantry-spices`)
  - L2: Nuts & Seeds (`pantry-nuts`)
  - L2: Cereals & Breakfast (`pantry-cereals`)

- **Organic & Bio** (`grocery-organic`) 🌿
  - L2: Organic Produce (`organic-produce`)
  - L2: Organic Dairy (`organic-dairy`)
  - L2: Organic Meat (`organic-meat`)
  - L2: Organic Pantry (`organic-pantry`)
  - L2: Eco-Friendly (`organic-eco`)
  - L2: Superfoods (`organic-superfoods`)
  - L2: Vegan Products (`organic-vegan`)

- **Bulgarian Specialty** (`grocery-bulgarian`) 🇧🇬
  - L2: Traditional Dairy (`grocery-bg-trad-dairy`)
  - L2: Preserves & Spreads (`grocery-bg-preserves`) → L3: Lutenitsa 🇧🇬, Kyopolou 🇧🇬, Ajvar 🇧🇬, Turshia (Pickled Vegetables) 🇧🇬, Sauerkraut, Pickled Peppers, Tomato Sauce
  - L2: Traditional Sweets (`grocery-bg-sweets`) → L3: Fruit Jam, Slatko 🇧🇬, Rose Jam 🇧🇬, Fig Jam, Quince Paste, Walnut Preserve, Petmez 🇧🇬
  - L2: Bulgarian Spices (`grocery-bg-spices`) → L3: Sharena Sol 🇧🇬, Chubritsa 🇧🇬, Sweet Paprika, Hot Paprika, Dried Mint, Cumin (Kimion)
  - L2: Rose Products (`grocery-bg-rose`) → L3: Rose Oil 🇧🇬, Rose Water 🇧🇬, Rose Liqueur, Rose Lokum, Dried Rose Petals
  - L2: Homemade Products (`grocery-bg-homemade`) → L3: Homemade Cheese, Yogurt, Butter, Wine, Rakia, Sausages, Bread
  - L2: Regional Specialties (`grocery-bg-regional`)
  - L2: Seasonal Products (`grocery-bg-seasonal`) → L3: Fresh Farm Produce, Garden Vegetables, Orchard Fruits, Wild Mushrooms, Wild Berries, Forest Herbs

- **Frozen Foods** (`grocery-frozen`) 🧊
  - L2: Frozen Vegetables (`frozen-vegetables`)
  - L2: Frozen Fruits (`frozen-fruits`)
  - L2: Frozen Meat (`frozen-meat`)
  - L2: Frozen Seafood (`frozen-seafood`)
  - L2: Ice Cream (`frozen-icecream`)
  - L2: Ready Meals (`frozen-meals`)

- **Snacks & Sweets** (`grocery-snacks`) 🍫
  - L2: Chips & Crisps (`snacks-chips`)
  - L2: Nuts & Trail Mix (`snacks-nuts`)
  - L2: Chocolate (`snacks-chocolate`)
  - L2: Candy (`snacks-candy`)
  - L2: Cookies & Crackers (`snacks-cookies`)
  - L2: Popcorn (`snacks-popcorn`)
  - L2: Lokum & Turkish Delight (`snacks-lokum`)

- **Baby & Kids Food** (`grocery-baby-food`) 🍼
  - L2: Baby Formula (`baby-formula`)
  - L2: Baby Purees (`baby-purees`)
  - L2: Baby Snacks (`baby-snacks`)
  - L2: Kids Meals (`baby-kids-meals`)
  - L2: Kids Drinks (`baby-kids-drinks`)
  - L2: Baby Cereals (`baby-cereals`)

- **International Foods** (`grocery-international`) 🌍
  - L2: Greek (`intl-greek`)
  - L2: Turkish (`intl-turkish`)
  - L2: Italian (`intl-italian`)
  - L2: Asian (`intl-asian`)
  - L2: Mexican (`intl-mexican`)
  - L2: Middle Eastern (`intl-middle-eastern`)
  - L2: American (`intl-american`)

**Grocery Attributes (21 total):**

**Global Grocery Attributes (`grocery`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Organic Certified | boolean | - |
| Local/Homegrown | boolean | - |
| Freshness | select | Fresh, Frozen, Dried, Preserved, Canned |
| Storage Type | select | Room Temperature, Refrigerated, Frozen, Cool & Dry |
| Dietary | multiselect | Vegan, Vegetarian, Gluten-Free, Lactose-Free, Sugar-Free, Keto, Low-Sodium |
| Allergens | multiselect | Contains Gluten, Contains Dairy, Contains Eggs, Contains Nuts, Contains Soy, Contains Fish, Contains Shellfish, Contains Sesame |
| Brand | text | - |
| Weight/Volume | text | - |
| Country of Origin | select | Bulgaria, European Union, Turkey, Greece, Serbia, Romania, Other |
| Bulgarian Region | select | Thracian Valley, Rhodope Mountains, Rose Valley, Danube Plain, Black Sea Coast, Pirin, Rila, Stara Planina, Sofia Region |

**Dairy-Specific Attributes (`grocery-dairy`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Fat Content | select | Full Fat, Low Fat, Fat Free, 2%, Whole |
| Milk Type | select | Cow, Goat, Sheep, Buffalo, Plant-Based |

**Meat-Specific Attributes (`grocery-meat`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Cut Type | select | Whole, Sliced, Ground, Cubed, Fillet, Bone-In, Boneless |
| Farming Method | select | Free Range, Organic, Grass Fed, Farm Raised, Wild Caught |

**Drinks-Specific Attributes (`grocery-drinks`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Alcohol Content | select | Non-Alcoholic, Low (1-5%), Medium (5-15%), High (15-25%), Strong (25%+) |

**Wine Attributes (`drinks-wine`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Wine Type | select | Red, White, Rosé, Sparkling, Dessert, Fortified |
| Grape Variety | select | Mavrud, Melnik, Gamza, Dimyat, Muscat, Cabernet Sauvignon, Merlot, Chardonnay, Traminer, Blend |

**Rakia Attributes (`drinks-rakia`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Rakia Base | select | Grape, Plum, Apricot, Quince, Apple, Pear, Cherry, Muscat, Mixed |

**Produce Attributes (`grocery-fruits`, `grocery-vegetables`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Produce Quality | select | Premium, Standard, Economy, Seconds |

**Bakery Attributes (`grocery-bakery`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Baked Fresh | select | Same Day, Pre-Order, Frozen Dough, Ready to Bake |

**Organic Attributes (`grocery-organic`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Certification | select | EU Organic, Bulgarian Bio, Demeter, Non-GMO, Fair Trade, None |

---

### ❤️ 10. HEALTH & WELLNESS (`health-wellness`)
**Total: 370 categories (L0:1, L1:5, L2:31, L3:228, L4:105) | 89 attributes**

**L1 Subcategories (Reorganized Hierarchy):**

#### 💊 **Supplements & Vitamins** (`supplements-vitamins`) - 8 L2, 70+ L3/L4
*Daily health supplements, vitamins, and nutritional products*
- **Vitamins & Supplements** (`vitamins-supplements`)
  - L3: Multivitamins → L4: Men's Multi, Women's Multi, Senior Multi, Children's Multi, Prenatal, Vegan Multi, Sport Multi, One-A-Day
  - L3: Vitamin D, Vitamin C, Vitamin B Complex, Vitamin E, Vitamin K, Vitamin A
  - L3: Minerals, Herbal Supplements
- **Omega & Fish Oils** (`omega-fish-oils`)
  - L3: Omega-3, Fish Oil, Krill Oil, Cod Liver Oil, Vegan Omega
- **Probiotics & Gut Health** (`probiotics-gut-health`)
  - L3: Probiotic Capsules, Prebiotic Fiber, Digestive Enzymes, Synbiotics, Spore Probiotics, Gut Health Tests
- **Superfoods & Greens** (`superfoods-greens`)
  - L3: Spirulina, Chlorella, Green Powders, Wheatgrass, Moringa, Maca Root, Acai Berry, Chia Seeds
- **Collagen & Beauty** (`collagen-beauty`)
  - L3: Marine Collagen, Bovine Collagen, Collagen Peptides, Collagen Powder, Hyaluronic Acid, Biotin, Keratin, Silica
- **Joint & Mobility** (`joint-mobility`)
  - L3: Glucosamine, Chondroitin, MSM, Joint Collagen, Turmeric Curcumin, Joint Formula
- **Immune Support** (`immune-support`)
  - L3: Elderberry, Vitamin C Immune, Zinc, Echinacea, Beta-Glucan, Propolis, Olive Leaf
- **Sleep & Relaxation** (`sleep-relaxation`)
  - L3: Melatonin, Magnesium Sleep, Valerian Root, GABA, Passionflower, Chamomile, Sleep Blends
  - L3: Sleep Devices, White Noise, Sleep Masks, Aromatherapy Sleep
- **Attributes (7)**: Supplement Form (11 options), Serving Size, Servings Per Container, Dietary Preference (13 options), Certifications (9 options), Target Audience, Primary Benefit

#### 🧬 **Specialty & Targeted Health** (`specialty-health`) - 7 L2, 43 L3/L4
*Gender-specific, age-specific, and condition-specific health products*
- **Women's Health** (`womens-health`)
  - L3: Prenatal Vitamins, Postnatal, Menstrual Support, Menopause, Hormone Balance, Iron Women, Fertility Support
- **Men's Health** (`mens-health`)
  - L3: Prostate Health, Testosterone Support, Male Fertility, Men's Multivitamins, Hair & Beard
- **Children's Health** (`childrens-health`)
  - L3: Kids Multivitamins, Kids Omega, Kids Probiotics, Kids Immune, Vitamin Gummies
- **Heart Health** (`heart-health`)
  - L3: CoQ10, Heart Omega, Cholesterol Support, Blood Pressure, Circulation
- **Blood Sugar Support** (`blood-sugar-support`)
  - L3: Berberine, Chromium, Ceylon Cinnamon, Alpha-Lipoic Acid, Gymnema, Bitter Melon
- **Stress & Mood** (`stress-mood`)
  - L3: Ashwagandha, 5-HTP, GABA Calm, Magnesium Stress, Stress Gummies, Lemon Balm, Valerian Mood
- **Longevity & Anti-Aging** (`longevity-anti-aging`)
  - L3: NMN, NAD+, Resveratrol, Pterostilbene, Spermidine, Fisetin, Quercetin, Senolytics
- **Attributes (4)**: Target Demographic, Life Stage, Health Focus, Condition Support

#### 🏋️ **Sports & Fitness Nutrition** (`sports-fitness-nutrition`) - 5 L2, 39 L3/L4
*Performance, workout supplements, and fitness products*
- **Sports Nutrition** (`sports-nutrition`)
  - L3: Pre-Workout, Protein Powders, BCAAs, Creatine, Beta-Alanine, L-Carnitine, Electrolytes, Post-Workout
- **Fitness & Nutrition** (`fitness-nutrition`)
  - L3: Whey Concentrate, Whey Isolate, Casein Protein, Plant Protein, Egg Protein, Collagen Protein, Beef Protein, Mass Gainers
- **Weight Management** (`weight-management`)
  - L3: Fat Burners, Appetite Control, Meal Replacements, Metabolism Boosters, CLA, Detox & Cleanse
- **Energy & Nootropics** (`energy-nootropics`)
  - L3: Nootropic Stacks, Alpha-GPC, L-Theanine Caffeine, Ginkgo Biloba, CoQ10 Energy, NAD+ Boost
- **Therapy & Recovery** (`therapy-recovery`)
  - L3: Massage Guns, Red Light Therapy, TENS/EMS, Foam Rollers, Acupressure, Cupping, Compression, Cold Therapy, Infrared Therapy
- **Attributes (6)**: Fitness Goal (15 options), Sport Type, Flavor (18 options), Protein Content, Caffeine Content, Sugar Content

#### 🏥 **Medical & Personal Care** (`medical-personal-care`) - 4 L2, 25 L3/L4
*Medical supplies, mobility aids, vision, and personal care*
- **Medical Supplies** (`medical-supplies`)
  - L3: First Aid → L4: Bandages, Antiseptics, First Aid Kits, Wound Care, Burn Care, Cold Packs, Emergency, Eye Wash
  - L3: Health Monitoring → L4: Blood Pressure Monitors, Glucose Monitors, Thermometers, Pulse Oximeters, Smart Scales
  - L3: Nebulizers, Medical Tests, PPE
- **Vision Care** (`vision-care`)
  - L3: Contact Lenses → L4: Daily, Weekly, Monthly, Colored, Toric, Multifocal
  - L3: Contact Solutions, Reading Glasses, Eye Drops, Eye Vitamins, Blue Light Glasses
- **Mobility & Disability** (`mobility-disability`)
  - L3: Wheelchairs, Walkers, Canes & Crutches, Mobility Scooters, Transfer Aids, Orthopedic Supports
- **Personal Care** (`personal-care`)
  - L3: Body Care, Hair Care, Shaving & Grooming
- **Attributes (6)**: Product Category, Medical Grade, Prescription Required, Reusable/Disposable, Power Source, Connectivity

#### 🌿 **Natural & Alternative Wellness** (`natural-alternative-wellness`) - 7 L2, 66 L3/L4
*CBD, functional mushrooms, adaptogens, herbal remedies, and traditional medicine*
- **CBD Products** (`cbd-products`)
  - L3: Oils & Tinctures, CBD Capsules, CBD Edibles, CBD Topicals, CBD Vape, CBD Flowers, CBD Beauty, CBD Concentrates, Pet CBD, CBD Accessories
- **Functional Mushrooms** (`functional-mushrooms`)
  - L3: Lion's Mane, Reishi, Chaga, Cordyceps, Turkey Tail, Shiitake, Maitake, Mushroom Blends
- **Adaptogens** (`adaptogens`)
  - L3: Ashwagandha Root, Rhodiola Rosea, Ginseng, Holy Basil, Maca Adaptogen, Eleuthero, Schisandra, Adaptogen Blends
- **Herbal Remedies** (`herbal-remedies`)
  - L3: Echinacea, Elderberry, Valerian, St John's Wort, Milk Thistle, Ginkgo Biloba, Turmeric, Herbal Teas, Herbal Tinctures
- **Traditional Medicine** (`traditional-medicine`)
  - L3: Ayurveda, Traditional Chinese Medicine, Homeopathy, Naturopathy, Bach Flower Remedies, Acupuncture Supplies
- **Essential Oils & Aromatherapy** (`essential-oils-aromatherapy`)
  - L3: Pure Essential Oils, Essential Oil Blends, Carrier Oils, Diffusers, Aromatherapy Accessories, Roll-Ons
- **Hemp Products** (`hemp-products`)
  - L3: Hemp Seed Oil, Hemp Protein, Hemp Seeds, Hemp Flour, Hemp Skincare
- **Attributes (7)**: Wellness Category (11 options), Extract Type (10 options), Primary Ingredient, Strength/Potency, Effect/Benefit, Lab Tested (boolean), COA Available (boolean)

---

### 🎨 11. HOBBIES (`hobbies`) ✅ COMPLETE
> **Updated: December 4, 2025** | **L1: 9** | **L2: 69** | **L3: 298** | **Attributes: 50**

**L1 Subcategories:**

- **Handmade & Crafts** (`handmade`) ✂️
  - L2: Handmade Jewelry (`handmade-jewelry`) → L3: Necklaces, Bracelets, Earrings, Rings, Beaded, Wire Wrapped, Resin, Polymer Clay
  - L2: Handmade Clothing (`handmade-clothing`) → L3: Knitted, Crocheted, Embroidered, Hand-Sewn, Baby Clothes, Bags, Scarves, Hats
  - L2: Home Décor Crafts (`home-decor-crafts`) → L3: Candles, Wall Art, Pottery, Macrame, Woodworking, Wreaths, Dream Catchers, Terrariums
  - L2: Craft Supplies (`craft-supplies`) → L3: Beads & Findings, Yarn & Fiber, Fabric, Leather, Resin & Molds, Wood Blanks, Tools, Embroidery
  - L2: Paper & Party (`paper-party`)
  - L2: Art & Collectibles (`art-collectibles`)
  - L2: Bath & Body (`handmade-bath-body`) → L3: Soaps, Bath Bombs, Lotions, Lip Balms, Beard Products, Essential Oils
  - L2: Personalized & Custom (`handmade-personalized`) → L3: Custom Portraits, Name Signs, Pet Portraits, Custom Gifts, Engraved Items, Wedding Items
  - L2: Bulgarian Crafts (`handmade-bulgarian`) → L3: Martenitsi, Embroidery/Shevitsi, Rose Products, Woodcarving, Troyan Pottery, Copper Craft, Icon Painting

- **Trading Card Games** (`hobby-tcg`) 🃏 *(for PLAYING, not graded collectibles)*
  - L2: Pokemon TCG (`hobby-pokemon-tcg`) → L3: Singles, Booster Packs, Booster Boxes, ETB, Tins & Sets, Japanese, Vintage, Bundles
  - L2: Magic: The Gathering (`hobby-mtg`) → L3: Singles, Booster Boxes, Commander Decks, Sealed Product, Foils, Bundles
  - L2: Yu-Gi-Oh! (`hobby-yugioh`) → L3: Singles, Booster Boxes, Structure Decks, Sealed, 1st Edition
  - L2: One Piece TCG (`hobby-onepiece-tcg`) → L3: Singles, Booster Boxes, Starter Decks
  - L2: Dragon Ball TCG (`hobby-dragonball-tcg`)
  - L2: Sports Cards (`hobby-sports-cards`)
  - L2: Card Accessories (`hobby-card-accessories`) → L3: Sleeves, Deck Boxes, Binders, Playmats, Toploaders, Display Cases

- **Board Games & Puzzles** (`hobby-tabletop`) 🎲
  - L2: Strategy Games (`tabletop-strategy`) → L3: Euro Games, War Games, Worker Placement, Deck Building, Area Control
  - L2: Party Games (`tabletop-party`) → L3: Social Deduction, Word Games, Drinking Games, Kids Games, Trivia
  - L2: Family Games (`tabletop-family`) → L3: Cooperative, Gateway Games
  - L2: Classic Games (`tabletop-classic`) → L3: Chess, Checkers & Backgammon, Monopoly, Dominos & Mahjong, Playing Cards
  - L2: Jigsaw Puzzles (`tabletop-puzzles`) → L3: 500 Pieces, 1000 Pieces, 2000+ Pieces, 3D Puzzles, Custom Photo
  - L2: Tabletop RPG (`tabletop-rpg`) → L3: D&D, Pathfinder, Other Systems, Dice Sets, Miniatures, RPG Accessories
  - L2: Warhammer & Miniatures (`tabletop-warhammer`) → L3: Warhammer 40K, Age of Sigmar, Kill Team, Paints & Supplies, Terrain

- **Model Building & RC** (`hobby-model-building`) 🚂
  - L2: Plastic Model Kits (`hobby-plastic-models`) → L3: Aircraft, Vehicles, Ships, Sci-Fi, Military, Gundam, Figures
  - L2: Model Trains (`hobby-model-trains`) → L3: HO Scale, N Scale, O Scale, G Scale, Track & Accessories, Scenery
  - L2: Model Ships (`hobby-model-ships`) → L3: Sailing Ships, Warships, Submarines, Ship Bottles
  - L2: Model Aircraft (`hobby-model-aircraft`) → L3: WWII Aircraft, Modern Jets, Civilian, Helicopters, Spacecraft
  - L2: Model Tools & Paints (`hobby-model-tools`) → L3: Model Paints, Airbrushes, Model Glue, Cutting Tools, Detail Tools, Decals
  - L2: Diecast Models (`hobby-diecast`) → L3: 1:18, 1:24, 1:43, 1:64, Hot Wheels, F1 & Racing, Trucks
  - L2: RC & Drones (`hobby-rc-drones`) → L3: RC Cars & Trucks, RC Helicopters, FPV Drones, RC Boats, RC Planes, RC Parts

- **Musical Instruments** (`musical-instruments`) 🎸
  - L2: Guitars & Basses (`guitars-basses`) → L3: Electric, Acoustic, Classical, Bass, Amplifiers, Pedals, Accessories
  - L2: Keyboards & Pianos (`keyboards-pianos`) → L3: Digital Pianos, Synthesizers, MIDI Controllers, Acoustic Pianos, Organs
  - L2: Drums & Percussion (`drums-percussion`) → L3: Acoustic Drums, Electronic Drums, Cymbals, Hand Percussion, Hardware
  - L2: Wind Instruments (`wind-instruments`) → L3: Saxophones, Trumpets, Flutes, Clarinets, Harmonicas
  - L2: String Instruments (`string-instruments`)
  - L2: DJ Equipment (`dj-equipment`)
  - L2: Recording Equipment (`recording-equipment`)
  - L2: Instrument Accessories (`instrument-accessories`)

- **Music & Vinyl** (`movies-music`) 📀
  - L2: Vinyl Records (`vinyl-records`) → L3: Rock & Metal, Pop, Jazz & Blues, Classical, Electronic, Bulgarian Music
  - L2: CDs (`cds`)
  - L2: Cassette Tapes (`cassettes`) → L3: Blank Cassettes, Pre-Recorded, Rare Cassettes
  - L2: Turntables & Equipment (`turntables`) → L3: Record Players, Parts, Stylus & Cartridges, Cleaning, Storage
  - L2: DVDs & Blu-ray (`dvds-bluray`)
  - L2: Movie Memorabilia (`movie-memorabilia`)
  - L2: Music Memorabilia (`music-memorabilia`)
  - L2: Digital Music (`digital-music`)

- **Books & Reading** (`books`) 📚
  - L2: Fiction (`fiction`) → L3: Science Fiction, Romance, Fantasy, Mystery, Horror, Historical, Literary, Contemporary, Classics, Short Stories, Bulgarian Fiction
  - L2: Non-Fiction (`non-fiction`) → L3: Biography, Self-Help, History, Business, Science, Cookbooks
  - L2: Rare & Antiquarian (`books-rare`) → L3: First Editions, Signed Books, Vintage Books, Bulgarian Antiquarian, Illustrated
  - L2: Comics & Graphic Novels (`books-comics`) → L3: Superhero, Manga Reading, Indie, European, Bulgarian Comics
  - L2: Self-Published & Zines (`books-zines`) → L3: Art Zines, Poetry, Music Zines, DIY, Self-Published
  - L2: Textbooks (`textbooks`)
  - L2: Manga (`comics-manga`)
  - L2: Children's Books (`childrens-books`)
  - L2: Arts & Photography (`arts-photography`)
  - L2: Lifestyle Books (`lifestyle-books`)
  - L2: Magazines (`magazines`)
  - L2: E-Books & Audiobooks (`ebooks-audiobooks`)

- **Outdoor Hobbies** (`hobby-outdoor`) 🎣
  - L2: Fishing (`hobby-fishing`) → L3: Fishing Rods, Reels, Lures & Baits, Line, Tackle Boxes, Nets, Accessories, Ice Fishing, Fly Fishing
  - L2: Hunting (`hobby-hunting`) → L3: Optics, Clothing, Calls, Blinds, Cameras, Knives, Decoys
  - L2: Birdwatching (`hobby-birdwatching`) → L3: Binoculars, Spotting Scopes, Feeders, Bird Houses, Field Guides
  - L2: Hobby Gardening (`hobby-gardening`) → L3: Seeds & Bulbs, Bonsai, Succulents, Indoor Plants, Hydroponics, Garden Décor
  - L2: Astronomy (`hobby-astronomy`) → L3: Telescopes, Mounts, Eyepieces & Filters, Astrophotography, Star Charts

- **Creative Arts** (`hobby-creative-arts`) 🎨
  - L2: Painting & Drawing (`creative-painting`) → L3: Oil Paints, Acrylic, Watercolors, Gouache, Pencils & Charcoal, Pastels, Canvas & Paper, Brushes, Easels
  - L2: Photography (`creative-photography`) → L3: Film Photography, Instant, Photo Printing, Darkroom, Photo Albums, Frames
  - L2: Calligraphy & Lettering (`creative-calligraphy`) → L3: Calligraphy Pens, Fountain Pens, Brush Pens, Inks, Practice Paper
  - L2: Sculpting & Pottery (`creative-sculpting`) → L3: Clay & Pottery, Wheels, Kilns, Tools, Glazes, Polymer Clay
  - L2: Digital Art (`creative-digital`) → L3: Drawing Tablets, Stylus Pens, Software, Pen Displays
  - L2: Journaling & Planning (`creative-journaling`) → L3: Bullet Journals, Planners, Stickers & Washi, Stamps, Journal Supplies

---

### 🏠 12. HOME & KITCHEN (`home`) ✅ COMPLETE
> **Updated: December 4, 2025** | **L1: 11** | **L2: 70** | **L3: 345** | **Attributes: 45**

**L1 Subcategories (11):**

- **Furniture** (`furniture`) 🛋️
  - L2: Sofas & Couches (`furn-sofas`) → L3: Sectional Sofas, Loveseats, Sleeper Sofas, Recliners, Futons, Armchairs, Ottoman & Poufs
  - L2: Beds & Mattresses (`furn-beds`) → L3: Platform Beds, Bed Frames, Bunk Beds, Daybeds, Headboards, Adjustable Beds, Kids Beds
  - L2: Tables (`furn-tables`) → L3: Dining Tables, Coffee Tables, Console Tables, Side Tables, Nightstands, Folding Tables, Outdoor Tables
  - L2: Chairs (`furn-chairs`) → L3: Dining Chairs, Office Chairs, Gaming Chairs, Accent Chairs, Bar Stools, Rocking Chairs, Folding Chairs, Kids Chairs
  - L2: Mattresses (`mattresses`) → L3: Memory Foam, Innerspring, Hybrid, Latex, Mattress Toppers, Mattress Protectors, Kids Mattresses
  - L2: Storage & Shelving (`furn-storage`) → L3: Bookcases, Cabinets, Dressers, Shoe Racks, Coat Racks, Storage Benches
  - L2: Wardrobes (`wardrobes`) → L3: Sliding Door, Hinged Door, Open Wardrobes, Corner Wardrobes, Kids Wardrobes
  - L2: Desks (`desks`) → L3: Computer Desks, Standing Desks, L-Shaped Desks, Writing Desks, Gaming Desks, Kids Desks
  - L2: TV Stands (`tv-stands`) → L3: TV Cabinets, Wall Mount TV Units, Entertainment Centers, Media Consoles, Floating Shelves

- **Kitchen & Dining** (`kitchen-dining`) 🍳
  - L2: Large Appliances (`kitchen-large-appliances`) → L3: Refrigerators, Ovens & Stoves, Dishwashers, Microwaves, Washing Machines, Dryers, Freezers, Range Hoods
  - L2: Small Appliances (`kitchen-small-appliances`) → L3: Coffee Machines, Blenders & Mixers, Toasters & Ovens, Air Fryers, Electric Kettles, Food Processors, Juicers, Rice Cookers, Slow Cookers, Electric Grills, Sandwich Makers, Waffle Makers
  - L2: Cookware (`cookware`) → L3: Pots & Pans, Frying Pans, Saucepans, Dutch Ovens, Woks, Cookware Sets, Grill Pans
  - L2: Bakeware (`bakeware`) → L3: Baking Sheets, Cake Pans, Muffin Pans, Bread Pans, Pie Dishes, Baking Mats, Cooling Racks
  - L2: Dinnerware (`dinnerware`) → L3: Dinner Plates, Bowls, Dinnerware Sets, Serving Platters, Mugs & Cups, Kids Dinnerware
  - L2: Glassware (`glassware`) → L3: Drinking Glasses, Wine Glasses, Beer Glasses, Champagne Flutes, Shot Glasses, Pitchers, Decanters
  - L2: Cutlery (`cutlery`) → L3: Cutlery Sets, Knives, Forks, Spoons, Serving Utensils, Steak Knives, Kids Cutlery
  - L2: Food Storage (`food-storage`) → L3: Containers, Glass Jars, Vacuum Sealers, Bag Clips, Food Wraps, Bread Boxes
  - L2: Kitchen Utensils (`kitchen-utensils`) → L3: Cooking Spoons, Spatulas, Tongs, Ladles, Whisks, Colanders, Cutting Boards, Measuring Cups

- **Bedding & Bath** (`bedding-bath`) 🛏️
  - L2: Bedding (`bedding-bedding`) → L3: Sheet Sets, Duvet Covers, Pillowcases, Blankets & Throws, Comforters, Quilts, Bed Skirts, Mattress Toppers
  - L2: Towels (`bath-towels`) → L3: Bath Towels, Hand Towels, Face Towels, Bath Sheets, Beach Towels, Kitchen Towels, Bath Mats
  - L2: Bathroom Accessories (`bath-accessories`) → L3: Soap Dishes, Toothbrush Holders, Bathroom Bins, Bathroom Sets, Shower Caddies, Toilet Brushes
  - L2: Bathroom Furniture (`bath-furniture`) → L3: Bathroom Cabinets, Vanities, Mirrors, Shelves, Storage

- **Lighting** (`lighting`) 💡
  - L2: Ceiling Lights (`light-ceiling`) → L3: Chandeliers, Pendant Lights, Flush Mounts, Semi-Flush, Track Lighting, Recessed
  - L2: Wall Lights (`light-wall`) → L3: Sconces, Vanity Lights, Picture Lights, Plug-In Walls, Swing Arms
  - L2: Table & Floor Lamps (`light-table-floor`) → L3: Table Lamps, Floor Lamps, Desk Lamps, Bedside Lamps, Tripod Lamps
  - L2: Outdoor Lighting (`light-outdoor`) → L3: Porch Lights, Landscape Lights, String Lights, Solar Lights, Security Lights
  - L2: Smart Lighting (`light-smart`) → L3: Smart Bulbs, Light Strips, Smart Switches, Smart Plugs, Hue System
  - L2: Light Bulbs (`light-bulbs`) → L3: LED Bulbs, Incandescent, CFL, Halogen, Edison Bulbs, Smart Bulbs

- **Home Décor** (`home-decor`) 🖼️
  - L2: Wall Art (`decor-wall-art`) → L3: Canvas Prints, Framed Art, Posters, Wall Stickers, Metal Wall Art, Photo Frames, Gallery Sets
  - L2: Mirrors (`decor-mirrors`) → L3: Wall Mirrors, Floor Mirrors, Vanity Mirrors, Decorative Mirrors, Bathroom Mirrors
  - L2: Clocks (`decor-clocks`) → L3: Wall Clocks, Alarm Clocks, Table Clocks, Grandfather Clocks, Digital Clocks
  - L2: Rugs & Carpets (`decor-rugs`) → L3: Area Rugs, Runner Rugs, Round Rugs, Outdoor Rugs, Kids Rugs, Shag Rugs
  - L2: Window Treatments (`decor-window`) → L3: Curtains, Blinds, Shades, Valances, Curtain Rods, Sheers
  - L2: Decorative Accents (`decor-accents`) → L3: Vases, Candles, Figurines, Artificial Plants, Bookends, Decorative Bowls
  - L2: Cushions & Pillows (`decor-cushions`) → L3: Throw Pillows, Floor Cushions, Outdoor Cushions, Pillow Covers, Body Pillows

- **Household & Cleaning** (`household`) 🧹
  - L2: Cleaning Supplies (`house-cleaning`) → L3: All-Purpose Cleaners, Glass Cleaners, Floor Cleaners, Bathroom Cleaners, Kitchen Cleaners, Disinfectants
  - L2: Laundry (`house-laundry`) → L3: Detergents, Fabric Softeners, Stain Removers, Bleach, Dryer Sheets, Laundry Baskets, Irons
  - L2: Cleaning Tools (`house-tools`) → L3: Brooms, Mops, Vacuum Cleaners, Dustpans, Dusters, Cleaning Cloths, Squeegees
  - L2: Trash & Recycling (`house-trash`) → L3: Trash Cans, Recycling Bins, Trash Bags, Compost Bins, Outdoor Bins
  - L2: Pest Control (`house-pest`) → L3: Insect Repellent, Mouse Traps, Bug Spray, Ant Killers, Moth Balls, Ultrasonic Repellers

- **Storage & Organization** (`home-storage`) 📦
  - L2: Closet Organization (`store-closet`) → L3: Hangers, Shelf Dividers, Shoe Organizers, Drawer Organizers, Garment Bags
  - L2: Storage Bins & Boxes (`store-bins`) → L3: Plastic Bins, Fabric Boxes, Under-Bed Storage, Vacuum Bags, Clear Containers
  - L2: Garage & Workshop (`store-garage`) → L3: Tool Storage, Shelving Units, Pegboards, Workbenches, Garage Cabinets

- **Climate Control** (`home-climate`) 🌡️
  - L2: Air Conditioning (`climate-ac`) → L3: Split AC, Window AC, Portable AC, AC Parts, AC Accessories
  - L2: Heating (`climate-heating`) → L3: Space Heaters, Radiators, Electric Fireplaces, Heated Blankets, Underfloor Heating
  - L2: Fans (`climate-fans`) → L3: Ceiling Fans, Tower Fans, Desk Fans, Pedestal Fans, Box Fans, USB Fans
  - L2: Air Quality (`climate-air`) → L3: Air Purifiers, Humidifiers, Dehumidifiers, Air Quality Monitors, Filters

- **Home Improvement** (`home-improvement`) 🔧
  - L2: Painting & Wallpaper (`improve-paint`) → L3: Interior Paint, Exterior Paint, Primers, Paint Tools, Wallpaper, Wall Decals
  - L2: Flooring (`improve-flooring`) → L3: Laminate, Vinyl, Hardwood, Tiles, Carpet Tiles, Flooring Accessories
  - L2: Hardware (`improve-hardware`) → L3: Door Handles, Cabinet Hardware, Locks, Hinges, Hooks, Fasteners
  - L2: Plumbing (`improve-plumbing`) → L3: Faucets, Showerheads, Pipes & Fittings, Toilet Parts, Water Filters
  - L2: Electrical (`improve-electrical`) → L3: Light Switches, Outlets, Extension Cords, Power Strips, Smart Plugs, Batteries

- **Office & School** (`home-office`) 📝
  - L2: Office Supplies (`office-supplies`) → L3: Pens & Pencils, Notebooks & Paper, Folders & Binders, Desk Organizers, Staplers & Punches
  - L2: Office Furniture (`office-furniture`) → L3: Office Desks, Office Chairs, Filing Cabinets, Bookcases
  - L2: Office Electronics (`office-electronics`) → L3: Calculators, Shredders, Laminators, Label Makers
  - L2: School Supplies (`school-supplies`) → L3: Backpacks, Pencil Cases, Art Supplies, Calculators, Textbooks
  - L2: Art Supplies (`art-supplies`) → L3: Paint Sets, Brushes, Canvas, Sketchbooks, Markers, Colored Pencils
  - L2: Calendars & Planners (`calendars-planners`) → L3: Wall Calendars, Desk Calendars, Planners, Diaries

- **Garden & Outdoor** (`garden-outdoor`) 🌱
  - L2: Plants & Seeds (`plants-seeds`) → L3: Indoor Plants, Outdoor Plants, Seeds, Bulbs, Planters, Plant Care
  - L2: Garden Tools (`garden-tools`) → L3: Lawn Mowers, Hedge Trimmers, Chainsaws, Leaf Blowers, Watering Equipment, Hand Tools
  - L2: Outdoor Furniture (`outdoor-furniture`) → L3: Patio Furniture, Outdoor Seating, Hammocks & Swings, Outdoor Tables, Umbrellas
  - L2: BBQ & Grilling (`bbq-grilling`) → L3: Gas Grills, Charcoal Grills, Smokers, BBQ Accessories, Outdoor Cooking
  - L2: Lawn Care (`lawn-care`) → L3: Fertilizers, Seeds, Weed Control, Pest Control, Lawn Edgers
  - L2: Outdoor Décor (`outdoor-decor`) → L3: Garden Statues, Wind Chimes, Fountains, Flags, Solar Decorations
  - L2: Pools & Spas (`pools-spas`) → L3: Above Ground Pools, Pool Accessories, Hot Tubs, Pool Chemicals, Pool Toys

**Home & Kitchen Attributes (45 total):**

**Furniture Attributes (`furniture`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Furniture Material | select | Solid Wood, Engineered Wood, MDF, Particle Board, Metal, Glass, Leather, Fabric, Rattan, Plastic, Bamboo, Marble |
| Style | select | Modern, Contemporary, Traditional, Scandinavian, Industrial, Mid-Century, Rustic, Minimalist, Bohemian, Art Deco, Farmhouse, Coastal |
| Color | select | White, Black, Gray, Brown, Beige, Oak, Walnut, Cherry, Espresso, Natural Wood, Blue, Green, Yellow, Red, Pink, Multi-color |
| Assembly Required | boolean | - |
| Room | multiselect | Living Room, Bedroom, Dining Room, Kitchen, Office, Bathroom, Kids Room, Outdoor, Entryway, Garage |

**Kitchen & Dining Attributes (`kitchen-dining`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Brand | select | Bosch, Siemens, Samsung, LG, Whirlpool, Electrolux, Miele, AEG, Gorenje, Beko, Candy, Indesit, Hotpoint, Philips, KitchenAid, Tefal, De'Longhi, Nespresso, Other |
| Energy Rating | select | A+++, A++, A+, A, B, C, D, E, F, G |
| Capacity | select | Under 100L, 100-200L, 200-300L, 300-400L, 400-500L, Over 500L, 1-2 Servings, 3-4 Servings, 5-6 Servings, 7+ Servings |
| Finish | select | Stainless Steel, Black Stainless, White, Black, Silver, Copper, Matte, Glossy |
| Material | select | Stainless Steel, Aluminum, Cast Iron, Non-Stick, Ceramic, Glass, Silicone, Porcelain, Bone China, Melamine, Wood, Bamboo |
| Dishwasher Safe | boolean | - |

**Bedding & Bath Attributes (`bedding-bath`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Bed Size | select | Single (90x200), Double (140x200), Queen (160x200), King (180x200), Super King (200x200), Kids (70x140), Cot (60x120) |
| Thread Count | select | Under 200, 200-300, 300-400, 400-600, 600-800, 800+ |
| Material | select | Cotton, Egyptian Cotton, Linen, Silk, Microfiber, Bamboo, Polyester, Cotton Blend, Satin, Flannel, Jersey |
| GSM (Towels) | select | 300-400 (Light), 400-500 (Medium), 500-600 (Plush), 600-700 (Luxury), 700+ (Ultra Plush) |

**Lighting Attributes (`lighting`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Light Type | select | LED, Incandescent, CFL, Halogen, Smart/WiFi, Solar |
| Color Temperature | select | Warm White (2700K), Soft White (3000K), Neutral White (4000K), Cool White (5000K), Daylight (6500K), RGB/Color Changing |
| Dimmable | boolean | - |
| Bulb Base | select | E27, E14, GU10, GU5.3, G9, G4, B22, Integrated |
| Lumens | select | Under 400 (Accent), 400-800 (Table Lamp), 800-1100 (Room), 1100-1600 (Bright), 1600+ (Very Bright) |

**Home Décor Attributes (`home-decor`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Style | select | Modern, Contemporary, Traditional, Bohemian, Scandinavian, Industrial, Farmhouse, Coastal, Minimalist, Vintage, Art Deco, Eclectic |
| Color Family | select | Neutral, Earth Tones, Pastels, Bold/Vibrant, Metallics, Monochrome, Multi-Color |
| Room | multiselect | Living Room, Bedroom, Dining Room, Kitchen, Bathroom, Office, Entryway, Kids Room, Outdoor |

**Household Attributes (`household`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Scent | select | Unscented, Fresh, Lavender, Lemon, Pine, Ocean, Floral, Citrus |
| Eco-Friendly | boolean | - |
| Size/Quantity | select | Single, Pack of 2, Pack of 3, Pack of 5, Pack of 10, Bulk Pack, Refill |

**Storage Attributes (`home-storage`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Material | select | Plastic, Metal, Wood, Fabric, Wicker, Wire, Cardboard, Canvas |
| Size | select | Small (Under 10L), Medium (10-30L), Large (30-60L), Extra Large (60L+), Set/Multiple Sizes |
| Stackable | boolean | - |
| Lid Type | select | With Lid, Without Lid, Snap-On Lid, Hinged Lid, Flip Lid |

**Climate Control Attributes (`home-climate`):**
| Attribute | Type | Options |
|-----------|------|---------|
| BTU/Power | select | Under 5000 BTU, 5000-8000 BTU, 8000-12000 BTU, 12000-18000 BTU, 18000-24000 BTU, 24000+ BTU |
| Room Size | select | Small (up to 15m²), Medium (15-25m²), Large (25-40m²), Extra Large (40m²+), Whole House |
| Energy Class | select | A+++, A++, A+, A, B, C, D |
| WiFi/Smart | boolean | - |

**Home Improvement Attributes (`home-improvement`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Finish Type | select | Matte, Satin, Semi-Gloss, Gloss, Eggshell, Flat |
| Indoor/Outdoor | select | Indoor Only, Outdoor Only, Indoor/Outdoor |
| DIY Difficulty | select | Easy (Beginner), Medium (Intermediate), Hard (Professional) |

**Office & School Attributes (`home-office`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Type | select | Desk, Chair, Storage, Accessories, Writing, Paper, Technology |
| Ergonomic | boolean | - |
| For | select | Adults, Kids/Students, Both |

**Garden & Outdoor Attributes (`garden-outdoor`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Material | select | Rattan/Wicker, Aluminum, Steel, Wood, Teak, Plastic/Resin, Wrought Iron, Cast Aluminum |
| Weather Resistant | boolean | - |
| UV Protected | boolean | - |
| Style | select | Modern, Traditional, Coastal, Rustic, Contemporary, Bohemian, Industrial |
| Set Size | select | Single Piece, 2-Piece Set, 3-Piece Set, 4-Piece Set, 5+ Piece Set |

---

### 💎 13. JEWELRY & WATCHES (`jewelry-watches`) ✅ UPDATED - 333 Categories, 59 Attributes
**Total Categories:** 333 | **Attributes:** 59 (55 filterable)

**L1 Subcategories (10):**

#### 💍 Rings (`jw-rings`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Engagement Rings | `rings-engagement` | Solitaire, Halo, Three-Stone, Vintage, Princess, Cushion, Oval, Pear, Emerald Cut, Marquise, Unique/Alternative, Cluster |
| Wedding Bands | `rings-wedding` | Plain Bands, Diamond Bands, Eternity Bands, His & Hers Sets, Titanium/Tungsten Bands, Rose Gold, White Gold, Platinum, Celtic/Vintage |
| Fashion Rings | `rings-fashion` | - |
| Cocktail Rings | `rings-cocktail` | - |
| Promise Rings | `rings-promise` | - |
| Anniversary Rings | `rings-anniversary` | - |
| Eternity Rings | `rings-eternity` | - |
| Signet Rings | `rings-signet` | - |
| Gemstone Rings | `rings-gemstone` | Diamond, Ruby, Sapphire, Emerald, Opal, Amethyst, Aquamarine, Topaz, Garnet, Morganite |
| Birthstone Rings | `rings-birthstone` | - |
| Religious Rings | `rings-religious` | - |
| Stackable Rings | `rings-stackable` | - |
| Men's Rings | `rings-mens` | Tungsten, Titanium, Gold, Silver, Black Rings, Celtic/Norse, Diamond/Stone, Spinner |

#### 📿 Necklaces & Pendants (`jw-necklaces`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Chains | `necklaces-chains` | Cable, Rope, Box, Snake, Figaro, Curb/Cuban, Byzantine, Herringbone, Wheat, Franco, Singapore, Mariner |
| Pendants | `necklaces-pendants` | Diamond, Gemstone, Heart, Cross, Initial, Birthstone, Locket, Photo |
| Statement Necklaces | `necklaces-statement` | - |
| Chokers | `necklaces-chokers` | - |
| Pearl Necklaces | `necklaces-pearls` | Single Strand, Multi-Strand, Graduated, Collar, Princess, Matinee, Opera, Freshwater |
| Layering Necklaces | `necklaces-layering` | - |
| Religious Necklaces | `necklaces-religious` | - |
| Name & Initial | `necklaces-personalized` | - |
| Lockets | `necklaces-lockets` | - |
| Men's Necklaces | `necklaces-mens` | - |

#### ✨ Earrings (`jw-earrings`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Stud Earrings | `earrings-studs` | Diamond Studs, Pearl Studs, Gemstone Studs, Halo Studs, Cluster Studs, Minimalist, Gold |
| Hoop Earrings | `earrings-hoops` | Small, Medium, Large, Huggie, Endless, Diamond/Pave, Gold, Silver |
| Drop & Dangle | `earrings-drop` | - |
| Chandelier | `earrings-chandelier` | - |
| Huggie Earrings | `earrings-huggie` | - |
| Clip-On | `earrings-clipon` | - |
| Ear Cuffs | `earrings-cuffs` | - |
| Threader | `earrings-threader` | - |
| Pearl Earrings | `earrings-pearls` | - |
| Crawler | `earrings-crawler` | - |
| Men's Earrings | `earrings-mens` | - |

#### 💫 Bracelets & Bangles (`jw-bracelets`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Tennis Bracelets | `bracelets-tennis` | - |
| Bangles | `bracelets-bangles` | Solid, Hinged, Cuff, Stackable, Gemstone, Enamel |
| Chain Bracelets | `bracelets-chain` | Cable, Curb, Figaro, Byzantine, Box |
| Charm Bracelets | `bracelets-charm` | - |
| Cuff Bracelets | `bracelets-cuff` | - |
| Link Bracelets | `bracelets-link` | - |
| Pearl Bracelets | `bracelets-pearls` | - |
| Leather Bracelets | `bracelets-leather` | - |
| Beaded Bracelets | `bracelets-beaded` | - |
| Friendship | `bracelets-friendship` | - |
| ID Bracelets | `bracelets-id` | - |
| Medical ID | `bracelets-medical` | - |
| Men's Bracelets | `bracelets-mens` | - |
| Anklets | `bracelets-anklets` | - |

#### ⌚ Watches (`watches`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Luxury Watches | `watches-luxury` | Swiss Made, German, Japanese, Dress Luxury, Sports Luxury, Complication, Limited Edition |
| Sport Watches | `watches-sport` | - |
| Dress Watches | `watches-dress` | - |
| Pocket Watches | `watches-pocket` | - |
| Women's Watches | `watches-womens` | - |
| Men's Watches | `watches-mens` | - |
| Fashion Watches | `watches-fashion` | - |
| Vintage Watches | `watches-vintage-cat` | - |
| Smart Watches | `watches-smart-cat` | - |
| Dive Watches | `watches-dive` | - |
| Chronograph | `watches-chronograph` | - |
| Watch Straps | `watches-straps-cat` | Leather, Metal, Rubber, NATO, Silicone, Exotic Leather, OEM, Deployment |
| Watch Accessories | `watches-accessories-cat` | Winders, Boxes, Tools, Travel Cases, Cleaning, Display, Parts |
| Watch by Brand | `watches-brands` | Rolex, Omega, Patek Philippe, AP, Cartier, Tudor, Seiko, Citizen, Casio, Tag Heuer, Breitling, IWC, Panerai |

#### 👑 Fine Jewelry (`fine-jewelry`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Diamond Jewelry | `fine-diamonds` | - |
| Gold Jewelry | `fine-gold` | 24K, 22K, 18K, 14K, 10K, White Gold, Rose Gold, Two-Tone, Vintage Gold |
| Platinum Jewelry | `fine-platinum` | - |
| Pearl Jewelry | `fine-pearls` | Akoya, South Sea, Tahitian, Freshwater, Baroque, Keshi |
| Gemstone Jewelry | `fine-gemstones` | Ruby, Sapphire, Emerald, Tanzanite, Aquamarine, Morganite, Opal, Tourmaline, Spinel, Alexandrite |
| Birthstone | `fine-birthstones` | - |
| Jewelry Sets | `fine-sets` | - |
| Luxury Brands | `fine-luxury-brands` | Tiffany, Cartier, Bulgari, Van Cleef, Harry Winston, Chopard, Graff, David Yurman, Mikimoto, Boucheron |
| Loose Diamonds | `fine-loose-diamonds` | - |
| Loose Gemstones | `fine-loose-gemstones` | - |

#### 🎭 Fashion Jewelry (`costume-jewelry`)
| L2 Category | Slug |
|-------------|------|
| Sterling Silver | `fashion-silver` |
| Stainless Steel | `fashion-steel` |
| Costume Pieces | `fashion-costume` |
| Bohemian | `fashion-boho` |
| Minimalist | `fashion-minimalist` |
| Statement | `fashion-statement` |
| Body Jewelry | `fashion-body` |
| Designer Fashion | `fashion-designer` |
| Seasonal Collections | `fashion-seasonal` |
| Handmade | `fashion-handmade` |

#### 🧔 Men's Jewelry (`jw-mens`)
| L2 Category | Slug |
|-------------|------|
| Men's Rings | `mens-rings` |
| Men's Necklaces | `mens-necklaces` |
| Men's Bracelets | `mens-bracelets` |
| Men's Earrings | `mens-earrings` |
| Cufflinks | `mens-cufflinks` |
| Tie Accessories | `mens-tie` |
| Money Clips | `mens-moneyclips` |
| Lapel Pins | `mens-lapels` |
| Men's Pendants | `mens-pendants` |

#### 🏺 Vintage & Estate (`jw-vintage-estate`)
| L2 Category | Slug |
|-------------|------|
| Victorian (1837-1901) | `vintage-victorian` |
| Art Deco (1920-1935) | `vintage-artdeco` |
| Art Nouveau (1890-1910) | `vintage-artnouveau` |
| Retro (1935-1950) | `vintage-retro` |
| Mid-Century (1950-1970) | `vintage-midcentury` |
| Estate Jewelry | `vintage-estate` |
| Antique Watches | `vintage-antique-watches` |
| Signed Pieces | `vintage-signed` |
| Edwardian (1901-1910) | `vintage-edwardian` |

#### 🛠️ Supplies & Care (`jw-supplies`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Beads & Findings | `supplies-beads` | Glass Beads, Crystal Beads, Gemstone Beads, Metal Beads, Seed Beads, Pearl Beads, Pendants, Spacers, Clasps, Jump Rings, Crimp Beads |
| Chains & Wire | `supplies-chains` | - |
| Settings & Mounts | `supplies-settings` | - |
| Jewelry Tools | `supplies-tools` | - |
| Jewelry Cleaning | `supplies-cleaning` | - |
| Storage & Display | `supplies-storage` | Jewelry Boxes, Ring Trays, Necklace Stands, Earring Holders, Watch Boxes, Velvet Pouches, Travel Cases, Display Cases |
| Repair Supplies | `supplies-repair` | - |
| Packaging | `supplies-packaging` | - |
| Jewelry Boxes | `supplies-boxes` | - |

---

### 👶 14. KIDS (`baby-kids`) ✅ UPDATED - 294 Categories, 46 Attributes
**Total Categories:** 294 | **Attributes:** 46 (all filterable)

**L1 Subcategories (7):**

#### 🍼 Baby Gear (`baby-gear`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Strollers | `babygear-strollers` | Standard Strollers, Jogging Strollers, Lightweight Strollers, Double Strollers, Travel Systems |
| Car Seats | `babygear-carseats` | Infant Car Seats, Convertible Car Seats, Booster Seats, All-in-One Car Seats |
| Baby Carriers | `babygear-carriers` | Wraps, Slings, Structured Carriers, Hip Carriers |
| Swings & Bouncers | `babygear-swings` | Baby Swings, Bouncers, Rockers |
| Walkers & Jumpers | `babygear-walkers` | Activity Walkers, Push Walkers, Jumpers, Activity Centers |
| Playards & Travel | `babygear-playards` | Playards, Travel Cribs, Travel Accessories |
| High Chairs | `babygear-highchairs` | Standard High Chairs, Portable High Chairs, Booster Seats, Hook-On Chairs |
| Baby Monitors | `babygear-monitors` | Video Monitors, Audio Monitors, Smart Monitors, Movement Monitors |
| Diaper Bags | `babygear-bags` | Backpack Bags, Tote Bags, Messenger Bags, Clutch Bags |

#### 🥛 Baby Feeding (`baby-feeding`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Bottles & Nipples | `feeding-bottles` | Glass Bottles, Plastic Bottles, Anti-Colic Bottles, Wide-Neck Bottles, Nipples, Bottle Accessories |
| Breastfeeding | `feeding-breastfeeding` | Breast Pumps, Nursing Pillows, Nursing Covers, Breast Milk Storage, Nipple Care, Nursing Bras |
| Formula & Food | `feeding-formula` | Infant Formula, Baby Cereal, Baby Purees, Toddler Snacks, Organic Baby Food |
| Feeding Accessories | `feeding-accessories` | Bibs, Burp Cloths, Bottle Warmers, Sterilizers, Bottle Brushes, Drying Racks |
| Sippy Cups & Tableware | `feeding-tableware` | Sippy Cups, Straw Cups, Plates & Bowls, Utensils, Placemats |
| Food Prep | `feeding-prep` | Baby Food Makers, Blenders, Storage Containers, Freezer Trays |

#### 👶 Diapering & Potty (`diapering`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Disposable Diapers | `diaper-disposable` | Newborn, Size 1, Size 2, Size 3, Size 4, Size 5, Size 6, Overnight Diapers |
| Cloth Diapers | `diaper-cloth` | All-in-One, Pocket Diapers, Prefolds, Covers, Inserts |
| Wipes & Warmers | `diaper-wipes` | Baby Wipes, Wipe Warmers, Wipe Dispensers, Reusable Wipes |
| Diaper Rash Care | `diaper-rash` | Diaper Creams, Ointments, Powders, Sprays |
| Potty Training | `diaper-potty` | Potty Chairs, Training Seats, Step Stools, Training Pants, Potty Books |

#### 🔒 Baby Safety & Health (`baby-safety`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Baby Proofing | `safety-proofing` | Cabinet Locks, Outlet Covers, Corner Guards, Door Knob Covers, Gate Accessories |
| Baby Gates | `safety-gates` | Pressure Gates, Hardware Gates, Extra-Wide Gates, Stair Gates, Play Yards |
| Health & Grooming | `safety-health` | Thermometers, Nasal Aspirators, Medicine Dispensers, First Aid Kits, Humidifiers |
| Bath Safety | `safety-bath` | Bath Seats, Bath Mats, Spout Covers, Bath Thermometers |
| Sleep Safety | `safety-sleep` | Swaddles, Sleep Sacks, Crib Mattresses, Breathable Bumpers, Sound Machines |

#### 🛏️ Nursery & Furniture (`nursery`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Cribs & Bassinets | `nursery-cribs` | Standard Cribs, Convertible Cribs, Mini Cribs, Portable Cribs, Bassinets, Cradles |
| Changing Tables | `nursery-changing` | Standard Changing Tables, Dresser Combos, Changing Pads, Pad Covers |
| Nursery Furniture | `nursery-furniture` | Dressers, Gliders & Rockers, Nursery Chairs, Toy Storage, Bookshelves |
| Nursery Bedding | `nursery-bedding` | Crib Sheets, Blankets, Mattress Pads, Bed Rail Covers, Crib Skirts |
| Nursery Décor | `nursery-decor` | Wall Art, Mobiles, Night Lights, Rugs, Curtains, Lamps |

#### 👕 Kids Clothing & Shoes (`kids-clothing`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Baby Clothing (0-24M) | `clothing-baby` | Bodysuits, Sleepers, Rompers, Sets, Dresses, Outerwear |
| Toddler Clothing (2T-5T) | `clothing-toddler` | Tops, Bottoms, Dresses, Sets, Outerwear, Sleepwear |
| Kids Clothing (4-12) | `clothing-kids` | Boys Tops, Boys Bottoms, Girls Tops, Girls Bottoms, Girls Dresses, Outerwear, Uniforms |
| Baby Shoes | `clothing-babyshoes` | Pre-Walkers, First Walkers, Booties, Sandals |
| Kids Shoes | `clothing-kidsshoes` | Sneakers, Sandals, Boots, Dress Shoes, Athletic Shoes, Rain Boots |
| Accessories | `clothing-accessories` | Hats, Mittens, Socks, Hair Accessories, Bags, Belts |

#### 🧸 Toys & Games (`toys-games`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Action Figures & Playsets | `toys-action` | Superheroes, Anime & Manga, Video Game Figures, Movie Characters, Playsets |
| Building Toys | `toys-building` | LEGO, LEGO Technic, LEGO Duplo, Building Blocks, Magnetic Tiles, Construction Sets |
| Dolls & Accessories | `toys-dolls` | Baby Dolls, Fashion Dolls, Doll Houses, Doll Clothes, Doll Accessories |
| Educational Toys | `toys-educational` | STEM Toys, Science Kits, Coding Toys, Learning Tablets, Montessori, Language Learning |
| Games & Puzzles | `toys-games-puzzles` | Board Games, Card Games, Jigsaw Puzzles, Strategy Games, Family Games |
| Outdoor Play | `toys-outdoor` | Swing Sets, Trampolines, Playhouses, Sandboxes, Water Tables, Sports Equipment |
| Ride-On Toys | `toys-rideon` | Tricycles, Balance Bikes, Electric Ride-Ons, Scooters, Wagons |
| Plush & Stuffed Animals | `toys-plush` | Teddy Bears, Character Plush, Interactive Plush, Weighted Plush |
| Arts & Crafts | `toys-arts` | Drawing & Painting, Craft Kits, Modeling Clay, Jewelry Making, Sewing Kits |
| Pretend Play | `toys-pretend` | Kitchen Sets, Tool Sets, Dress-Up, Doctor Kits, Shopping/Market |
| Baby & Toddler Toys | `toys-baby` | Rattles, Teethers, Activity Gyms, Stacking Toys, Push & Pull Toys |
| Remote Control | `toys-rc` | RC Cars, RC Drones, RC Helicopters, RC Boats, RC Robots |
| Collectibles | `toys-collectibles` | Trading Cards, Mini Figures, Blind Bags, Limited Editions |

---

**Kids Attributes:**

**Baby Gear Attributes (`baby-gear`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Age Range | select | 0-6 Months, 6-12 Months, 12-24 Months, 2-3 Years, 3-5 Years, 5+ Years |
| Weight Limit | select | Up to 10kg, Up to 15kg, Up to 20kg, Up to 25kg, Up to 30kg, 30kg+ |
| Foldable | boolean | - |
| Brand | select | Graco, Chicco, Baby Jogger, UPPAbaby, Britax, Maxi-Cosi, Bugaboo, Cybex, Nuna, Joie |

**Baby Feeding Attributes (`baby-feeding`):**
| Attribute | Type | Options |
|-----------|------|---------|
| BPA Free | boolean | - |
| Dishwasher Safe | boolean | - |
| Material | select | Plastic, Glass, Silicone, Stainless Steel, Bamboo |
| Bottle Size | select | 60ml, 120ml, 150ml, 240ml, 260ml, 330ml |

**Nursery Attributes (`nursery`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Material | select | Solid Wood, MDF, Pine, Oak, Bamboo, Metal |
| Color | select | White, Gray, Natural Wood, Espresso, Black, Walnut, Two-Tone |
| Convertible | boolean | - |
| Assembly Required | boolean | - |
| Safety Standard | select | ASTM, JPMA, EN, CPSC |
| Theme | select | Animals, Space, Princess, Dinosaurs, Nature, Minimalist, Bohemian |

**Baby Safety Attributes (`baby-safety`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Installation Type | select | Pressure Mount, Hardware Mount, Adhesive, No Install |
| Width Range | select | Up to 75cm, 75-100cm, 100-125cm, 125-150cm, Extra Wide 150cm+ |
| Height | select | Standard (75cm), Tall (90cm), Extra Tall (100cm+) |
| Pet Safe | boolean | - |

**Diapering Attributes (`diapering`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Size | select | Newborn, Size 1, Size 2, Size 3, Size 4, Size 5, Size 6, Size 7 |
| Pack Size | select | Travel Pack, Regular Pack, Large Pack, Bulk Box |
| Eco-Friendly | boolean | - |
| Overnight | boolean | - |

**Kids Clothing Attributes (`kids-clothing`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Size | select | Newborn, 0-3M, 3-6M, 6-9M, 9-12M, 12-18M, 18-24M, 2T, 3T, 4T, 5T, 4, 5, 6, 7, 8, 10, 12, 14 |
| Gender | select | Boys, Girls, Unisex |
| Material | select | Cotton, Organic Cotton, Polyester, Fleece, Denim, Wool Blend |
| Season | select | Spring/Summer, Fall/Winter, All Season |

**Toys & Games Attributes (`toys-games`):**
| Attribute | Type | Options |
|-----------|------|---------|
| Age Range | select | 0-6 Months, 6-12 Months, 1-2 Years, 3-4 Years, 5-7 Years, 8-11 Years, 12+ Years |
| Brand | select | LEGO, Fisher-Price, Hasbro, Mattel, Melissa & Doug, VTech, Playmobil, Hot Wheels, Barbie, Nerf |
| Educational Focus | multiselect | STEM, Motor Skills, Creativity, Language, Social Skills, Problem Solving |
| Battery Required | boolean | - |

---

### 🐕 15. PETS (`pets`)
**Database Stats:** L0: 1 | L1: 12 | L2: 112 | L3: 567 | **Total: 692 categories** | **59 attributes**
**L0 ID:** `fbda10eb-556a-4db9-82e6-5f643f003a06`

#### L1 Subcategories:

**1. Dogs** (`dogs`) 🐶
- L2: Dog Food (`dog-food`)
  - L3: Dry Dog Food (`dog-dry-food`) | Суха храна за кучета
  - L3: Wet Dog Food (`dog-wet-food`) | Влажна храна за кучета
  - L3: Raw Dog Food (`dog-raw-food`) | Сурова храна за кучета
  - L3: Freeze-Dried Food (`dog-freeze-dried`) | Лиофилизирана храна
  - L3: Dehydrated Food (`dog-dehydrated`) | Дехидратирана храна
  - L3: Fresh Dog Food (`dog-fresh-food`) | Прясна храна за кучета
  - L3: Puppy Food (`puppy-food`) | Храна за кученца
  - L3: Senior Dog Food (`senior-dog-food`) | Храна за възрастни кучета
- L2: Dog Treats (`dog-treats`)
  - L3: Biscuits & Cookies (`dog-biscuits`) | Бисквити и сладки
  - L3: Jerky & Meat Treats (`dog-jerky`) | Сушено месо
  - L3: Dental Treats (`dog-dental-treats`) | Дентални лакомства
  - L3: Training Treats (`dog-training-treats`) | Лакомства за тренировка
  - L3: Natural & Organic Treats (`dog-natural-treats`) | Натурални лакомства
  - L3: Bones & Chews (`dog-bones-chews`) | Кокали и дъвки
- L2: Dog Toys (`dog-toys`)
  - L3: Chew Toys (`dog-chew-toys`) | Играчки за дъвчене
  - L3: Fetch Toys (`dog-fetch-toys`) | Играчки за хвърляне
  - L3: Tug Toys (`dog-tug-toys`) | Играчки за дърпане
  - L3: Interactive Toys (`dog-interactive-toys`) | Интерактивни играчки
  - L3: Plush Toys (`dog-plush-toys`) | Плюшени играчки
  - L3: Puzzle Toys (`dog-puzzle-toys`) | Пъзел играчки
  - L3: Squeaky Toys (`dog-squeaky-toys`) | Пищящи играчки
  - L3: Outdoor Toys (`dog-outdoor-toys`) | Играчки за открито
- L2: Dog Beds & Furniture (`dog-beds`)
  - L3: Bolster Beds (`dog-bolster-beds`) | Легла с борд
  - L3: Orthopedic Beds (`dog-orthopedic-beds`) | Ортопедични легла
  - L3: Donut Beds (`dog-donut-beds`) | Кръгли легла
  - L3: Elevated Beds (`dog-elevated-beds`) | Повдигнати легла
  - L3: Heated & Cooling Beds (`dog-heated-beds`) | Отопляеми и охлаждащи легла
  - L3: Outdoor Beds (`dog-outdoor-beds`) | Легла за открито
  - L3: Dog Blankets (`dog-blankets`) | Одеяла за кучета
- L2: Dog Collars & Leashes (`dog-collars`)
  - L3: Standard Collars (`dog-standard-collars`) | Стандартни нашийници
  - L3: Martingale Collars (`dog-martingale-collars`) | Мартингейл нашийници
  - L3: Training Collars (`dog-training-collars`) | Тренировъчни нашийници
  - L3: Breakaway Collars (`dog-breakaway-collars`) | Предпазни нашийници
  - L3: LED & Light-Up Collars (`dog-led-collars`) | LED нашийници
  - L3: Standard Leashes (`dog-standard-leashes`) | Стандартни каишки
  - L3: Retractable Leashes (`dog-retractable-leashes`) | Разтегателни каишки
  - L3: Training Leashes (`dog-training-leashes`) | Тренировъчни каишки
- L2: Dog Grooming (`dog-grooming`)
  - L3: Brushes & Combs (`dog-brushes`) | Четки и гребени
  - L3: Shampoos & Conditioners (`dog-shampoos`) | Шампоани и балсами
  - L3: Nail Care (`dog-nail-care`) | Грижа за нокти
  - L3: Ear Care (`dog-ear-care`) | Грижа за уши
  - L3: Dental Care (`dog-dental-care`) | Дентална грижа
  - L3: Grooming Tools (`dog-grooming-tools`) | Инструменти за грууминг
- L2: Dog Clothing & Accessories (`dog-clothing`)
  - L3: Coats & Jackets (`dog-coats`) | Палта и якета
  - L3: Sweaters & Hoodies (`dog-sweaters`) | Пуловери и суитшърти
  - L3: Raincoats (`dog-raincoats`) | Дъждобрани
  - L3: Boots & Shoes (`dog-boots`) | Ботуши и обувки
  - L3: Costumes & Outfits (`dog-costumes`) | Костюми и тоалети
  - L3: Bandanas & Bowties (`dog-bandanas`) | Бандани и папионки
- L2: Dog Health & Wellness (`dog-health`)
  - L3: Vitamins & Supplements (`dog-vitamins`) | Витамини и добавки
  - L3: Flea & Tick Prevention (`dog-flea-tick`) | Против бълхи и кърлежи
  - L3: Joint Care (`dog-joint-care`) | Грижа за стави
  - L3: Skin & Coat Care (`dog-skin-coat`) | Грижа за кожа и козина
  - L3: Digestive Health (`dog-digestive`) | Храносмилателно здраве
  - L3: Calming Aids (`dog-calming`) | Успокояващи средства
- L2: Dog Training & Behavior (`dog-training`)
  - L3: Training Pads (`dog-training-pads`) | Подложки за тренировка
  - L3: Clickers & Whistles (`dog-clickers`) | Кликери и свирки
  - L3: Bark Control (`dog-bark-control`) | Контрол на лаене
  - L3: Crate Training (`dog-crate-training`) | Обучение в клетка
  - L3: Agility Equipment (`dog-agility`) | Аджилити оборудване
- L2: Dog Bowls & Feeding (`dog-bowls`)
  - L3: Standard Bowls (`dog-standard-bowls`) | Стандартни купички
  - L3: Elevated Feeders (`dog-elevated-feeders`) | Повдигнати хранилки
  - L3: Slow Feeders (`dog-slow-feeders`) | Бавни хранилки
  - L3: Travel Bowls (`dog-travel-bowls`) | Пътни купички
  - L3: Automatic Feeders (`dog-auto-feeders`) | Автоматични хранилки
  - L3: Water Fountains (`dog-water-fountains`) | Фонтани за вода
- L2: Dog Crates & Kennels (`dog-crates`)
  - L3: Wire Crates (`dog-wire-crates`) | Телени клетки
  - L3: Plastic Crates (`dog-plastic-crates`) | Пластмасови клетки
  - L3: Soft-Sided Crates (`dog-soft-crates`) | Меки клетки
  - L3: Heavy-Duty Crates (`dog-heavy-duty-crates`) | Здрави клетки
  - L3: Dog Playpens (`dog-playpens`) | Кошари за игра
- L2: Dog Houses & Outdoor (`dog-houses`)
  - L3: Wooden Dog Houses (`dog-wooden-houses`) | Дървени къщички
  - L3: Plastic Dog Houses (`dog-plastic-houses`) | Пластмасови къщички
  - L3: Insulated Houses (`dog-insulated-houses`) | Изолирани къщички
- L2: Dog Doors & Gates (`dog-doors`)
  - L3: Dog Doors (`dog-door-flaps`) | Врати за кучета
  - L3: Pet Gates (`dog-pet-gates`) | Порти за домашни любимци
  - L3: Barrier Fences (`dog-barrier-fences`) | Бариерни огради
- L2: Dog Waste Management (`dog-waste`)
  - L3: Poop Bags (`dog-poop-bags`) | Торбички за изпражнения
  - L3: Pooper Scoopers (`dog-pooper-scoopers`) | Лопатки за събиране
  - L3: Indoor Potties (`dog-indoor-potties`) | Вътрешни тоалетни
- L2: Dog Harnesses & Carriers (`dog-harnesses`)
  - L3: Standard Harnesses (`dog-standard-harnesses`) | Стандартни нагръдници
  - L3: No-Pull Harnesses (`dog-no-pull-harnesses`) | Нагръдници против дърпане
  - L3: Car Harnesses (`dog-car-harnesses`) | Автомобилни нагръдници
  - L3: Hiking Harnesses (`dog-hiking-harnesses`) | Нагръдници за туризъм
  - L3: Dog Carriers (`dog-carriers`) | Транспортни чанти
  - L3: Dog Strollers (`dog-strollers`) | Колички за кучета
- L2: Dog Tech & Monitoring (`dog-tech`)
  - L3: GPS Trackers (`dog-gps`) | GPS тракери
  - L3: Activity Monitors (`dog-activity-monitors`) | Монитори за активност
  - L3: Smart Collars (`dog-smart-collars`) | Умни нашийници
  - L3: Pet Cameras (`dog-pet-cameras`) | Камери за домашни любимци

**2. Cats** (`cats`) 🐱
- L2: Cat Food (`cat-food`)
  - L3: Dry Cat Food (`cat-dry-food`) | Суха храна за котки
  - L3: Wet Cat Food (`cat-wet-food`) | Влажна храна за котки
  - L3: Raw Cat Food (`cat-raw-food`) | Сурова храна за котки
  - L3: Freeze-Dried Cat Food (`cat-freeze-dried`) | Лиофилизирана храна
  - L3: Kitten Food (`kitten-food`) | Храна за котенца
  - L3: Senior Cat Food (`senior-cat-food`) | Храна за възрастни котки
  - L3: Indoor Cat Food (`indoor-cat-food`) | Храна за домашни котки
  - L3: Weight Management Food (`cat-weight-food`) | Храна за контрол на теглото
- L2: Cat Treats (`cat-treats`)
  - L3: Crunchy Treats (`cat-crunchy-treats`) | Хрупкави лакомства
  - L3: Soft Treats (`cat-soft-treats`) | Меки лакомства
  - L3: Freeze-Dried Treats (`cat-freeze-dried-treats`) | Лиофилизирани лакомства
  - L3: Dental Treats (`cat-dental-treats`) | Дентални лакомства
  - L3: Catnip Treats (`cat-catnip-treats`) | Лакомства с коча билка
  - L3: Hairball Control Treats (`cat-hairball-treats`) | Против космени топки
- L2: Cat Toys (`cat-toys`)
  - L3: Interactive Cat Toys (`cat-interactive-toys`) | Интерактивни играчки
  - L3: Feather Toys (`cat-feather-toys`) | Играчки с пера
  - L3: Laser Toys (`cat-laser-toys`) | Лазерни играчки
  - L3: Catnip Toys (`cat-catnip-toys`) | Играчки с коча билка
  - L3: Ball Toys (`cat-ball-toys`) | Топки
  - L3: Mice & Critters (`cat-mice-toys`) | Мишки и животинки
  - L3: Tunnel Toys (`cat-tunnel-toys`) | Тунели
  - L3: Electronic Toys (`cat-electronic-toys`) | Електронни играчки
- L2: Cat Furniture (`cat-furniture`)
  - L3: Cat Trees (`cat-trees`) | Катерици за котки
  - L3: Cat Condos (`cat-condos`) | Къщички за котки
  - L3: Wall Shelves (`cat-wall-shelves`) | Стенни рафтове
  - L3: Window Perches (`cat-window-perches`) | Прозоречни кацалки
  - L3: Scratching Posts (`cat-scratching-posts`) | Драскалки
  - L3: Cat Hammocks (`cat-hammocks`) | Хамаци за котки
- L2: Cat Litter & Accessories (`cat-litter`)
  - L3: Clumping Litter (`clumping-litter`) | Сбиваща се постелка
  - L3: Non-Clumping Litter (`non-clumping-litter`) | Несбиваща се постелка
  - L3: Crystal Litter (`crystal-litter`) | Кристална постелка
  - L3: Natural Litter (`natural-litter`) | Натурална постелка
  - L3: Litter Boxes (`litter-boxes`) | Котешки тоалетни
  - L3: Self-Cleaning Boxes (`self-cleaning-litter`) | Самопочистващи се тоалетни
  - L3: Litter Mats (`litter-mats`) | Постелки за тоалетна
  - L3: Litter Deodorizers (`litter-deodorizers`) | Дезодоранти за постелка
- L2: Cat Grooming (`cat-grooming`)
  - L3: Brushes & Combs (`cat-brushes`) | Четки и гребени
  - L3: Nail Clippers (`cat-nail-clippers`) | Ножички за нокти
  - L3: Shampoos (`cat-shampoos`) | Шампоани
  - L3: Deshedding Tools (`cat-deshedding`) | Инструменти за козина
  - L3: Ear & Eye Care (`cat-ear-eye-care`) | Грижа за уши и очи
  - L3: Dental Care (`cat-dental-care`) | Дентална грижа
- L2: Cat Health & Wellness (`cat-health`)
  - L3: Vitamins & Supplements (`cat-vitamins`) | Витамини и добавки
  - L3: Flea & Tick Prevention (`cat-flea-tick`) | Против бълхи и кърлежи
  - L3: Hairball Remedies (`cat-hairball`) | Средства против космени топки
  - L3: Joint Support (`cat-joint-support`) | Подкрепа за стави
  - L3: Calming Aids (`cat-calming`) | Успокояващи средства
  - L3: Urinary Health (`cat-urinary`) | Уринарно здраве
- L2: Cat Collars & ID (`cat-collars`)
  - L3: Breakaway Collars (`cat-breakaway-collars`) | Предпазни нашийници
  - L3: Reflective Collars (`cat-reflective-collars`) | Светлоотразителни нашийници
  - L3: Flea Collars (`cat-flea-collars`) | Нашийници против бълхи
  - L3: ID Tags (`cat-id-tags`) | Идентификационни медальони
  - L3: Cat Harnesses (`cat-harnesses`) | Нагръдници за котки
- L2: Cat Bowls & Feeding (`cat-bowls`)
  - L3: Standard Bowls (`cat-standard-bowls`) | Стандартни купички
  - L3: Elevated Bowls (`cat-elevated-bowls`) | Повдигнати купички
  - L3: Slow Feeders (`cat-slow-feeders`) | Бавни хранилки
  - L3: Automatic Feeders (`cat-auto-feeders`) | Автоматични хранилки
  - L3: Water Fountains (`cat-water-fountains`) | Фонтани за вода
- L2: Cat Carriers & Travel (`cat-carriers`)
  - L3: Hard-Sided Carriers (`cat-hard-carriers`) | Твърди транспортни чанти
  - L3: Soft-Sided Carriers (`cat-soft-carriers`) | Меки транспортни чанти
  - L3: Backpack Carriers (`cat-backpack-carriers`) | Раници за котки
  - L3: Cat Strollers (`cat-strollers`) | Колички за котки
  - L3: Travel Accessories (`cat-travel-accessories`) | Аксесоари за пътуване
- L2: Cat Beds (`cat-beds`)
  - L3: Enclosed Beds (`cat-enclosed-beds`) | Затворени легла
  - L3: Open Beds (`cat-open-beds`) | Отворени легла
  - L3: Heated Beds (`cat-heated-beds`) | Отопляеми легла
  - L3: Window Beds (`cat-window-beds`) | Прозоречни легла
  - L3: Cat Blankets (`cat-blankets`) | Одеяла за котки
- L2: Cat Doors & Gates (`cat-doors`)
  - L3: Cat Flaps (`cat-flaps`) | Котешки вратички
  - L3: Microchip Doors (`cat-microchip-doors`) | Врати с микрочип
  - L3: Interior Cat Doors (`cat-interior-doors`) | Вътрешни котешки врати
  - L3: Cat Gates (`cat-gates`) | Порти за котки
- L2: Cat Clothing (`cat-clothing`)
  - L3: Cat Sweaters (`cat-sweaters`) | Пуловери за котки
  - L3: Cat Costumes (`cat-costumes`) | Костюми за котки
  - L3: Recovery Suits (`cat-recovery-suits`) | Възстановителни костюми
- L2: Cat Tech (`cat-tech`)
  - L3: Cat GPS Trackers (`cat-gps`) | GPS тракери за котки
  - L3: Smart Litter Boxes (`smart-litter-boxes`) | Умни тоалетни
  - L3: Interactive Tech Toys (`cat-tech-toys`) | Интерактивни технологични играчки
  - L3: Pet Cameras (`cat-pet-cameras`) | Камери за домашни любимци

**3. Birds** (`birds`) 🐦
- L2: Bird Food (`bird-food`)
  - L3: Seed Mixes, Pellet Food, Fruit & Vegetable Blends, Nectar & Soft Foods, Canary Food, Parakeet Food, Parrot Food, Finch Food
- L2: Bird Treats (`bird-treats`)
  - L3: Millet Sprays, Fruit Treats, Seed Sticks, Honey Sticks, Egg & Protein Treats
- L2: Bird Cages & Habitats (`bird-cages`)
  - L3: Small Bird Cages, Medium Bird Cages, Large Bird Cages, Flight Cages & Aviaries, Travel Cages, Cage Covers
- L2: Bird Toys & Accessories (`bird-toys`)
  - L3: Swings & Rings, Ladders & Bridges, Chew & Shred Toys, Foraging Toys, Mirrors & Bells, Puzzle Toys
- L2: Bird Perches & Stands (`bird-perches`)
  - L3: Wood Perches, Rope Perches, Heated Perches, Grooming Perches, Play Stands, T-Stands
- L2: Bird Health & Grooming (`bird-health`)
  - L3: Bird Vitamins & Supplements, Bird Grooming Tools, Nail Clippers, Mite & Lice Treatment, Bird Baths, Feather Care
- L2: Bird Nesting & Breeding (`bird-nesting`)
  - L3: Nesting Boxes, Nesting Material, Breeding Cages, Egg Incubators, Hand Feeding Supplies
- L2: Bird Cage Accessories (`bird-cage-accessories`)
  - L3: Cage Liners, Seed Guards, Cage Cleaning Supplies, Food & Water Cups, Cuttlebones & Mineral Blocks
- L2: Bird Travel Carriers (`bird-carriers`)
  - L3: Small Bird Carriers, Large Bird Carriers, Bird Backpacks, Bird Harnesses & Leashes

**4. Fish & Aquatic** (`fish-aquatic`) 🐠
- L2: Fish Food (`fish-food`)
  - L3: Flake Food, Pellet Food, Freeze-Dried Food, Frozen Fish Food, Live Food, Betta Food, Goldfish Food, Cichlid Food, Bottom Feeder Food, Vacation Feeders
- L2: Aquariums & Tanks (`aquariums`)
  - L3: Nano Aquariums, Small Aquariums, Medium Aquariums, Large Aquariums, Betta Tanks, Aquarium Kits, Aquarium Stands
- L2: Aquarium Filters (`aquarium-filters`)
  - L3: HOB Filters, Canister Filters, Sponge Filters, Internal Filters, Undergravel Filters, Filter Media, Filter Replacement Parts
- L2: Aquarium Lighting (`aquarium-lighting`)
  - L3: LED Aquarium Lights, Fluorescent Lights, Plant Growth Lights, Moonlights, Light Timers, Replacement Bulbs
- L2: Aquarium Heaters (`aquarium-heaters`)
  - L3: Submersible Heaters, Inline Heaters, Preset Heaters, Adjustable Heaters, Heating Mats, Thermometers
- L2: Aquarium Pumps & Air (`aquarium-pumps`)
  - L3: Air Pumps, Water Pumps, Powerheads, Wave Makers, Air Stones, Air Tubing, Check Valves
- L2: Aquarium Decorations (`aquarium-decor`)
  - L3: Artificial Plants, Live Plants, Rocks & Stones, Driftwood, Ornaments, Backgrounds, Caves & Hideouts
- L2: Aquarium Substrate (`aquarium-substrate`)
  - L3: Gravel, Sand, Plant Substrate, Crushed Coral, Colored Gravel
- L2: Water Care & Testing (`water-care`)
  - L3: Water Conditioners, Test Kits, pH Adjusters, Biological Boosters, Algae Control, Fish Medication
- L2: Aquarium Cleaning (`aquarium-cleaning`)
  - L3: Gravel Vacuums, Algae Scrapers, Magnetic Cleaners, Brushes & Nets, Water Changers
- L2: Pond Supplies (`pond-supplies`)
  - L3: Pond Liners, Pond Pumps, Pond Filters, Pond Fish Food, Pond Lighting, Pond Plants
- L2: Saltwater & Marine (`saltwater-marine`)
  - L3: Marine Salt, Protein Skimmers, Live Rock, Coral Food & Supplements, Reef Lighting, Marine Test Kits

**5. Small Animals** (`small-animals`) 🐹
- L2: Small Animal Food (`small-animal-food`)
  - L3: Rabbit Food, Guinea Pig Food, Hamster Food, Gerbil Food, Chinchilla Food, Rat & Mouse Food, Hedgehog Food, Sugar Glider Food
- L2: Small Animal Treats (`small-animal-treats`)
  - L3: Hay Treats, Fruit Treats, Vegetable Treats, Chew Sticks, Seed & Grain Treats, Yogurt Drops
- L2: Small Animal Hay (`small-animal-hay`)
  - L3: Timothy Hay, Orchard Grass, Alfalfa Hay, Oat Hay, Mixed Hay
- L2: Small Animal Cages & Habitats (`small-animal-cages`)
  - L3: Rabbit Cages, Guinea Pig Cages, Hamster Cages, Wire Cages, Modular Cages, Playpens, Outdoor Hutches
- L2: Small Animal Bedding (`small-animal-bedding`)
  - L3: Paper Bedding, Wood Shavings, Fleece Bedding, Hemp Bedding, Corn Cob Bedding, Nesting Material
- L2: Small Animal Toys (`small-animal-toys`)
  - L3: Exercise Wheels, Exercise Balls, Tunnels & Tubes, Chew Toys, Hideouts, Wooden Toys, Hanging Toys
- L2: Small Animal Health (`small-animal-health`)
  - L3: Vitamins & Supplements, Probiotics, Dental Care, First Aid, Parasite Control
- L2: Small Animal Grooming (`small-animal-grooming`)
  - L3: Brushes & Combs, Nail Clippers, Shampoos & Sprays, Dust Baths, Ear & Eye Care
- L2: Small Animal Bowls & Bottles (`small-animal-bowls`)
  - L3: Food Bowls, Water Bottles, Water Bowls, Hay Racks, Automatic Feeders
- L2: Small Animal Carriers (`small-animal-carriers`)
  - L3: Hard-Sided Carriers, Soft-Sided Carriers, Travel Cages, Harnesses & Leashes
- L2: Ferret Supplies (`ferret-supplies`)
  - L3: Ferret Food, Ferret Treats, Ferret Cages, Ferret Toys, Ferret Litter, Ferret Grooming, Ferret Harnesses

**6. Reptiles & Amphibians** (`reptiles`) 🦎
- L2: Reptile Food (`reptile-food`)
  - L3: Dry Reptile Food, Freeze-Dried Insects, Live Insects, Frozen Feeders, Canned Reptile Food, Herbivore Food, Carnivore Food
- L2: Reptile Terrariums (`reptile-terrariums`)
  - L3: Glass Terrariums, Screen Terrariums, Front-Opening Terrariums, Plastic Tubs, Terrarium Kits, Terrarium Stands
- L2: Reptile Lighting (`reptile-lighting`)
  - L3: UVB Lights, Basking Lights, Night Lights, Light Fixtures, Mercury Vapor Bulbs, Light Timers
- L2: Reptile Heating (`reptile-heating`)
  - L3: Heat Lamps, Heat Mats, Ceramic Heat Emitters, Heat Rocks, Heat Cables, Thermostats
- L2: Reptile Substrate (`reptile-substrate`)
  - L3: Coconut Fiber, Reptile Bark, Reptile Sand, Reptile Carpet, Moss Substrate, Paper Substrate
- L2: Reptile Decorations (`reptile-decor`)
  - L3: Branches & Vines, Hides & Caves, Rocks & Basking Platforms, Artificial Plants, Live Plants, Backgrounds
- L2: Reptile Health (`reptile-health`)
  - L3: Vitamins & Calcium, Shedding Aids, Reptile Medications, Mite Treatment, Reptile First Aid
- L2: Reptile Bowls & Dishes (`reptile-bowls`)
  - L3: Water Dishes, Food Dishes, Waterfalls & Drippers, Feeding Tongs, Insect Dishes
- L2: Reptile Humidity (`reptile-humidity`)
  - L3: Misters & Foggers, Hygrometers, Spray Bottles, Humid Hides, Rain Systems
- L2: Turtle & Tortoise Supplies (`turtle-supplies`)
  - L3: Turtle Food, Turtle Tanks, Turtle Docks, Turtle Filters, Tortoise Houses, Turtle Health

**7. Horses** (`horses`) 🐴
- L2: Horse Feed & Supplements (`horse-feed`)
  - L3: Horse Hay, Horse Grain, Horse Pellets, Senior Horse Food, Performance Feed, Horse Supplements, Horse Vitamins, Joint Supplements
- L2: Horse Treats (`horse-treats`)
  - L3: Carrot Treats, Apple Treats, Peppermint Treats, Sugar Cubes, Training Treats, Treat Balls
- L2: Horse Tack & Saddles (`horse-tack`)
  - L3: Western Saddles, English Saddles, Saddle Pads, Bridles, Reins, Halters & Lead Ropes, Bits, Girths & Cinches, Stirrups
- L2: Horse Blankets & Sheets (`horse-blankets`)
  - L3: Turnout Blankets, Stable Blankets, Fly Sheets, Coolers, Quarter Sheets, Neck Covers
- L2: Horse Health & First Aid (`horse-health`)
  - L3: Horse Dewormers, Fly Control, Wound Care, Horse Liniments, Horse Poultices, Horse Medications, Horse First Aid
- L2: Horse Farrier & Hoof Care (`horse-hoof`)
  - L3: Hoof Picks, Hoof Dressings, Hoof Hardeners, Thrush Treatment, Horse Boots, Farrier Tools
- L2: Horse Riding Apparel (`horse-apparel`)
  - L3: Riding Boots, Riding Pants, Riding Helmets, Riding Gloves, Riding Shirts, Safety Vests, Spurs
- L2: Horse Stable & Barn (`horse-stable`)
  - L3: Horse Stall Mats, Horse Bedding, Feed Buckets, Water Buckets, Hay Nets & Bags, Stable Supplies, Fencing
- L2: Horse Trailers & Transport (`horse-transport`)
  - L3: Trailer Accessories, Shipping Boots, Head Bumpers, Trailer Ties, Travel Blankets
- L2: Horse Toys & Enrichment (`horse-toys`)
  - L3: Horse Balls, Jolly Balls, Treat Dispensers, Hanging Toys, Lick Blocks

**8. Pet Tech & Monitoring** (`pet-tech`) 📱
- L2: GPS Trackers & Location (`pet-gps-trackers`)
  - L3: Dog GPS Trackers, Cat GPS Trackers, GPS Collars, Bluetooth Trackers, GPS Subscription Services
- L2: Pet Cameras (`pet-cameras`)
  - L3: Indoor Pet Cameras, Outdoor Pet Cameras, Treat-Dispensing Cameras, Two-Way Audio Cameras
- L2: Smart Feeders & Waterers (`smart-feeders`)
  - L3: Automatic Pet Feeders, Smart Water Fountains, WiFi-Enabled Feeders, Portion Control Feeders, Microchip Feeders
- L2: Smart Pet Doors (`smart-pet-doors`)
  - L3: Microchip Pet Doors, App-Controlled Doors, Collar Key Doors, Curfew Pet Doors
- L2: Health Monitors & Wearables (`pet-health-monitors`)
  - L3: Activity Trackers, Smart Pet Scales, Heart Rate Monitors, Sleep Trackers, Temperature Monitors
- L2: Pet Apps & Software (`pet-apps`)

**9. Pet Health & Pharmacy** (`pet-pharmacy`) 💊
- L2: Prescription Medications (`prescription-meds`)
  - L3: Antibiotics, Pain Medications, Anti-Inflammatory, Allergy Medications, Heart Medications, Thyroid Medications
- L2: OTC Medications (`otc-medications`)
- L2: Flea & Tick Prevention (`flea-tick-prevention`)
  - L3: Topical Treatments, Oral Flea & Tick, Flea Collars, Flea Sprays, Home & Yard Treatment
- L2: Heartworm Prevention (`heartworm-prevention`)
- L2: Pet First Aid (`pet-first-aid-supplies`)
  - L3: First Aid Kits, Bandages & Wraps, Wound Care, Eye & Ear Care, Recovery Cones
- L2: Supplements & Vitamins (`pet-supplements-vitamins`)

**10. Pet Travel & Carriers** (`pet-travel`) ✈️
- L2: Pet Carriers (`pet-carriers-travel`)
  - L3: Hard-Sided Carriers, Soft-Sided Carriers, Backpack Carriers, Rolling Carriers, Sling Carriers
- L2: Car Travel (`pet-car-accessories`)
  - L3: Car Seat Covers, Car Booster Seats, Pet Seat Belts, Car Barriers, Pet Ramps, Cargo Liners
- L2: Travel Bags & Totes (`pet-travel-bags`)
- L2: Travel Bowls & Bottles (`pet-travel-bowls`)
- L2: Airline Travel (`airline-approved`)
- L2: Strollers & Wagons (`pet-strollers`)

**11. Pet Memorials** (`pet-memorials`) 🕊️
- L2: Pet Urns (`pet-urns`)
  - L3: Wooden Urns, Ceramic Urns, Metal Urns, Biodegradable Urns, Keepsake Urns
- L2: Memorial Jewelry (`pet-memorial-jewelry`)
  - L3: Ash Pendants, Paw Print Jewelry, Photo Lockets, Memorial Bracelets
- L2: Memorial Stones & Markers (`memorial-stones`)
- L2: Pet Caskets (`pet-caskets`)
- L2: Paw Print Kits (`paw-print-kits`)
  - L3: Clay Paw Print Kits, Ink Paw Print Kits, Nose Print Kits, Memory Books
- L2: Memorial Frames & Art (`memorial-frames`)

**12. Pet Gifts & Personalized** (`pet-gifts`) 🎁
- L2: Gift Baskets (`pet-gift-baskets`)
  - L3: Dog Gift Baskets, Cat Gift Baskets, New Pet Parent Gifts, Birthday Gift Sets
- L2: Pet-Themed Clothing (`pet-themed-clothing`)
  - L3: Dog-Themed T-Shirts, Cat-Themed T-Shirts, Pet Socks, Pet Hoodies
- L2: Pet Home Decor (`pet-themed-home-decor`)
  - L3: Pet Wall Art, Pet Pillows & Blankets, Pet Mugs & Drinkware, Pet Door Signs, Pet Figurines
- L2: Gift Cards (`pet-gift-cards`)
- L2: Subscription Boxes (`pet-subscription-boxes`)
- L2: Personalized Items (`personalized-pet-items`)
  - L3: Custom Pet Portraits, Engraved ID Tags, Custom Collars & Leashes, Personalized Bowls, Custom Blankets

---

#### 🐕 PETS Attributes (59 bilingual attributes)

| Attribute Name | Type | Options (EN) |
|----------------|------|--------------|
| Pet Type | select | Dog, Cat, Bird, Fish, Small Animal, Reptile, Horse, Other |
| Pet Size | select | Extra Small, Small, Medium, Large, Extra Large, All Sizes |
| Life Stage | select | Puppy/Kitten, Junior, Adult, Senior, All Life Stages |
| Brand | select | Royal Canin, Hills Science Diet, Purina, Blue Buffalo, Pedigree, Kong, PetSafe, Furminator, etc. |
| Food Type | select | Dry Kibble, Wet/Canned, Fresh/Refrigerated, Freeze-Dried, Dehydrated, Raw, Treats |
| Special Diet | multiselect | Grain-Free, Limited Ingredient, High Protein, Weight Management, Sensitive Stomach, Sensitive Skin, Joint Support, Dental Care, Urinary Health, Hairball Control, Indoor Formula, Outdoor Formula, Organic, Natural, Holistic, Veterinary Diet |
| Protein Source | multiselect | Chicken, Beef, Lamb, Fish, Salmon, Turkey, Duck, Venison, Rabbit, Pork, Plant-Based |
| Package Size | select | Sample/Trial, Small, Medium, Large, Extra Large, Multi-Pack |
| Material | select | Rubber, Nylon, Rope, Plush/Fabric, Leather, Metal, Plastic, Wood, Cotton, Polyester, Memory Foam, Stainless Steel, Silicone |
| Color | select | Black, White, Brown, Gray, Red, Blue, Green, Pink, Purple, Orange, Yellow, Beige, Multi-Color, Pattern |
| Toy Type | select | Chew, Fetch, Tug, Interactive, Puzzle, Plush, Squeaky, Ball, Rope, Teething, Catnip, Feather, Laser, Electronic |
| Durability | select | Light Chewers, Moderate Chewers, Aggressive Chewers, Indestructible |
| Collar Size | select | XXS, XS, S, M, L, XL, XXL |
| Bed Size | select | Small, Medium, Large, Extra Large, Giant |
| Bed Type | select | Bolster, Donut/Cuddler, Flat/Mat, Orthopedic, Elevated/Cot, Cave/Hooded, Heated, Cooling, Travel, Outdoor |
| Aquarium Size | select | Nano, Small, Medium, Large, Extra Large |
| Water Type | select | Freshwater, Saltwater/Marine, Brackish, Pond |
| Habitat Size | select | Small, Medium, Large, Extra Large, Custom/Modular |
| Leash Length | select | 4 ft, 5 ft, 6 ft, 8 ft, 10 ft, 15 ft, 20+ ft, Retractable |
| Health Benefit | multiselect | Joint Health, Skin & Coat, Digestive Health, Immune Support, Heart Health, Dental Health, Weight Management, Calming/Anxiety, Mobility, Senior Support |
| Grooming Type | select | Brush/Comb, Shampoo, Conditioner, Deshedding, Nail Care, Ear Care, Eye Care, Dental, Deodorizing |
| Coat Type | select | Short Hair, Medium Hair, Long Hair, Double Coat, Curly/Wavy, Wire/Harsh, Hairless, All Coat Types |
| Litter Type | select | Clumping Clay, Non-Clumping Clay, Silica Gel/Crystal, Recycled Paper, Pine/Wood, Corn, Wheat, Grass |
| Scent | select | Unscented, Fresh/Clean, Lavender, Oatmeal, Coconut, Aloe, Tea Tree, Cherry, Vanilla |
| Breed Size | select | Teacup, Toy Breeds, Small Breeds, Medium Breeds, Large Breeds, Giant Breeds |
| Training Purpose | select | Basic Obedience, House Training, Crate Training, Leash Training, Trick Training, Behavior Correction, Agility |
| Power Source | select | Battery, Rechargeable, USB, AC Adapter, Solar, Manual |
| Connectivity | select | WiFi, Bluetooth, GPS/Cellular, RFID/Microchip, App-Enabled, No Connectivity |
| Weather Suitability | multiselect | Cold Weather, Hot Weather, Rain/Water Resistant, All Weather, Indoor Only |
| Washable | select | Machine Washable, Hand Wash Only, Spot Clean, Not Washable, Dishwasher Safe |
| Flavor | select | Chicken, Beef, Fish/Salmon, Lamb, Turkey, Duck, Bacon, Peanut Butter, Cheese, Liver, Mixed |
| Carrier Type | select | Hard-Sided, Soft-Sided, Backpack, Rolling, Sling, Airline Approved, Expandable |
| Door Installation | select | Wall Mount, Door Mount, Sliding Glass, Screen Door, Window Mount |
| Temperature Feature | select | Self-Warming, Heated, Cooling Gel, Temperature Regulated, Thermal |
| Bowl Type | select | Standard, Elevated, Slow Feeder, Automatic, Gravity, Travel, Fountain, Anti-Spill |
| Harness Type | select | Standard/Step-In, No-Pull, Vest, Tactical/Service, Car Safety, Lifting/Support, Head Halter |
| Subscription Period | select | Monthly, Every 2 Months, Quarterly, Every 6 Months, Annually, One-Time Purchase |
| Country of Origin | select | USA, Canada, UK, Germany, France, Australia, New Zealand, Japan, China, Other |
| Certification | multiselect | USDA Organic, Non-GMO, Grain-Free Certified, Human-Grade, AAFCO Approved, Veterinarian Recommended, Cruelty-Free, Eco-Friendly |
| Feeding Frequency | select | Once Daily, Twice Daily, Multiple Times Daily, Free Feeding, As Treat/Supplement |
| Dog Breed | select | All Breeds, Labrador, German Shepherd, Golden Retriever, Bulldog, Poodle, Beagle, Husky, French Bulldog, etc. |
| Cat Breed | select | All Breeds, Persian, Maine Coon, Siamese, Ragdoll, Bengal, British Shorthair, Sphynx, Russian Blue, etc. |
| Bird Species | select | All Birds, Parakeet/Budgie, Cockatiel, Canary, Finch, Lovebird, African Grey, Macaw, Cockatoo, etc. |
| Fish Type | select | All Fish, Betta, Goldfish, Tropical, Cichlid, Tetra, Guppy, Angelfish, Discus, Koi, Saltwater/Marine |
| Small Animal Type | select | All, Rabbit, Guinea Pig, Hamster, Gerbil, Chinchilla, Ferret, Rat, Mouse, Hedgehog, Sugar Glider |
| Reptile Type | select | All, Bearded Dragon, Leopard Gecko, Ball Python, Corn Snake, Crested Gecko, Turtle, Tortoise, Iguana, Chameleon |
| Horse Discipline | select | All Disciplines, Western, English, Dressage, Jumping, Trail/Pleasure, Racing, Endurance, Polo |
| Horse Size | select | Pony, Small Horse, Average, Large, Draft |
| Blanket Weight | select | Sheet/No Fill, Lightweight, Medium, Heavyweight, Extra Heavy |
| Filter Flow Rate | select | Up to 50 GPH, 50-100 GPH, 100-200 GPH, 200-400 GPH, 400+ GPH |
| Light Spectrum | select | Full Spectrum, UVA, UVB, Blue Actinic, Plant Growth, Moonlight, Daylight |
| Heater Wattage | select | 25W, 50W, 75W, 100W, 150W, 200W, 300W |
| Terrarium Environment | select | Desert/Arid, Tropical/Humid, Temperate, Aquatic, Semi-Aquatic |
| Safety Feature | multiselect | Non-Toxic, BPA-Free, Lead-Free, Phthalate-Free, Choke-Safe, Flame Retardant, Reflective, Breakaway |
| Age Range | select | 0-3 months, 3-6 months, 6-12 months, 1-3 years, 3-7 years, 7+ years, All Ages |
| Eco Features | multiselect | Biodegradable, Recyclable, Sustainable Materials, Compostable, Recycled Content, Carbon Neutral, Plastic-Free |
| Product Weight | select | Under 1 lb, 1-5 lbs, 5-10 lbs, 10-25 lbs, 25-50 lbs, 50+ lbs |
| Warranty | select | No Warranty, 30 Days, 90 Days, 1 Year, 2 Years, Lifetime |

---

### 🏡 16. REAL ESTATE (`real-estate`)
**Database Stats:** L0: 1 | L1: 12 | L2: 148 | L3: 152 | **Total: 313 categories** | **75 attributes**
**L0 ID:** `ae77bc52-4b8f-4126-b2af-0cf760248996`

> **Major Expansion: December 4, 2025**
> Real Estate expanded from 14 categories/0 attributes to 313 categories/75 attributes
> Following Bulgarian market conventions (imot.bg, homes.bg, OLX) with full bilingual support

#### L1 Subcategories (12):

**1. Residential Sales** (`residential-sales`) 🏠 - ID: `2b174600-a166-48dd-9404-d824555f3612`
- L2: Studios for Sale (`studios-sale`) | Гарсониери продава
  - L3: Box Studios (`box-studios-sale`) | Боксониери
  - L3: Open Plan Studios (`open-studios-sale`) | Студия отворен план
  - L3: Furnished Studios (`furnished-studios-sale`) | Обзаведени студия
  - L3: New Build Studios (`newbuild-studios-sale`) | Новострой студия
  - L3: Investment Studios (`investment-studios-sale`) | Инвестиционни студия
- L2: 1-Bedroom Apartments (`apartments-1room-sale`) | Едностайни апартаменти
- L2: 2-Room Apartments (`apartments-2room-sale`) | 2-стайни апартаменти
- L2: 3-Room Apartments (`apartments-3room-sale`) | 3-стайни апартаменти
- L2: 4-Room Apartments (`apartments-4room-sale`) | Четиристайни апартаменти
- L2: 5+ Room Apartments (`apartments-5room-sale`) | Многостайни апартаменти
- L2: Maisonettes (`maisonettes-sale`) | Мезонети
  - L3: 2-Level Maisonettes (`2level-maisonettes`) | Двуетажни мезонети
  - L3: 3-Level Maisonettes (`3level-maisonettes`) | Триетажни мезонети
  - L3: Roof Maisonettes (`roof-maisonettes`) | Покривни мезонети
  - L3: Garden Maisonettes (`garden-maisonettes`) | Мезонети с градина
  - L3: Luxury Maisonettes (`luxury-maisonettes`) | Луксозни мезонети
- L2: Penthouses (`penthouses-sale`) | Пентхауси
  - L3: Classic Penthouses (`classic-penthouses`) | Класически пентхауси
  - L3: Duplex Penthouses (`duplex-penthouses`) | Дуплекс пентхауси
  - L3: Triplex Penthouses (`triplex-penthouses`) | Триплекс пентхауси
  - L3: Sky Villas (`sky-villas`) | Скай вили
  - L3: Pool Penthouses (`pool-penthouses`) | Пентхауси с басейн
  - L3: Terrace Penthouses (`terrace-penthouses`) | Пентхауси с тераса
- L2: Loft Apartments (`lofts-sale`) | Лофт апартаменти
  - L3: Industrial Lofts (`industrial-lofts`) | Индустриални лофтове
  - L3: Artist Lofts (`artist-lofts`) | Художествени лофтове
  - L3: Modern Lofts (`modern-lofts`) | Модерни лофтове
  - L3: Live-Work Lofts (`live-work-lofts`) | Лофт офиси
  - L3: Hard Lofts (`hard-lofts`) | Хард лофтове
- L2: Attic Apartments (`attic-apartments-sale`) | Тавански апартаменти
- L2: Detached Houses (`detached-houses-sale`) | Самостоятелни къщи
  - L3: Single-Story Houses (`single-story-houses`) | Едноетажни къщи
  - L3: Two-Story Houses (`two-story-houses`) | Двуетажни къщи
  - L3: Three-Story Houses (`three-story-houses`) | Триетажни къщи
  - L3: Split-Level Houses (`split-level-houses`) | Денивелирани къщи
  - L3: Pool Houses (`pool-houses`) | Къщи с басейн
  - L3: Garden Houses (`garden-detached`) | Къщи с градина
  - L3: Garage Houses (`garage-houses`) | Къщи с гараж
- L2: Semi-Detached Houses (`semi-detached-sale`) | Близнаци
- L2: Townhouses (`townhouses-sale`) | Редови къщи
  - L3: Modern Townhouses (`modern-townhouses`) | Модерни редови къщи
  - L3: End-Unit Townhouses (`end-unit-townhouses`) | Крайни редови къщи
  - L3: Multi-Level Townhouses (`multilevel-townhouses`) | Многоетажни редови къщи
  - L3: Garage Townhouses (`garage-townhouses`) | Редови къщи с гараж
  - L3: Garden Townhouses (`garden-townhouses`) | Редови къщи с градина
- L2: Villas (`villas-sale`) | Вили
  - L3: Modern Villas (`modern-villas`) | Модерни вили
  - L3: Classic Villas (`classic-villas`) | Класически вили
  - L3: Mediterranean Villas (`mediterranean-villas`) | Средиземноморски вили
  - L3: Minimalist Villas (`minimalist-villas`) | Минималистични вили
  - L3: Pool Villas (`pool-villas`) | Вили с басейн
  - L3: Seaside Villas (`seaside-villas`) | Морски вили
  - L3: Mountain Villas (`mountain-villas-sale`) | Планински вили
  - L3: Smart Villas (`smart-villas`) | Смарт вили
- L2: Country Houses (`country-houses-sale`) | Селски къщи
  - L3: Traditional Bulgarian Houses (`traditional-bg-houses`) | Традиционни български къщи
  - L3: Revival Houses (`revival-houses`) | Възрожденски къщи
  - L3: Stone Houses (`stone-houses`) | Каменни къщи
  - L3: Wooden Houses (`wooden-houses`) | Дървени къщи
  - L3: Renovated Village Houses (`renovated-village`) | Ремонтирани селски къщи
  - L3: Fixer-Upper Houses (`fixer-upper-houses`) | Къщи за ремонт
  - L3: Eco Village Houses (`eco-village-houses`) | Еко селски къщи
- L2: Bungalows (`bungalows-sale`) | Бунгала
  - L3: Classic Bungalows (`classic-bungalows`) | Класически бунгала
  - L3: Modern Bungalows (`modern-bungalows`) | Модерни бунгала
  - L3: Raised Bungalows (`raised-bungalows`) | Повдигнати бунгала
  - L3: Beach Bungalows (`beach-bungalows`) | Плажни бунгала
  - L3: Retirement Bungalows (`retirement-bungalows`) | Бунгала за пенсионери
- L2: Farmhouses (`farmhouses-sale`) | Селскостопански къщи
- L2: Whole Buildings (`whole-buildings-sale`) | Цели сгради
- L2: New Build Apartments (`newbuild-apartments-sale`) | Новострой апартаменти
- L2: Off-Plan Properties (`offplan-sale`) | На зелено

**2. Residential Rentals** (`residential-rentals`) 🔑 - ID: `87565762-319d-4cfa-85cd-cabb157f75ef`
- L2: Studios (`studios-rent`) | Гарсониери
- L2: Box Studios (`box-studios-rent`) | Боксониери
- L2: 1-Bedroom Apartments Rent (`apartments-1room-rent`) | Едностайни под наем
- L2: 2-Room Apartments (`apartments-2room-rent`) | 2-стайни апартаменти
- L2: 3-Room Apartments (`apartments-3room-rent`) | 3-стайни апартаменти
- L2: 4-Room Apartments Rent (`apartments-4room-rent`) | Четиристайни под наем
- L2: 5+ Room Apartments Rent (`apartments-5room-rent`) | Многостайни под наем
- L2: Maisonettes Rent (`maisonettes-rent`) | Мезонети под наем
- L2: Penthouses Rent (`penthouses-rent`) | Пентхауси под наем
- L2: Loft Apartments Rent (`lofts-rent`) | Лофт под наем
- L2: Houses for Rent (`houses-rent`) | Къщи под наем
- L2: Villas for Rent (`villas-rent`) | Вили под наем
- L2: Furnished Rentals (`furnished-rentals`) | Обзаведени под наем
  - L3: Fully Furnished (`fully-furnished-rent`) | Напълно обзаведени
  - L3: Partially Furnished (`partially-furnished`) | Частично обзаведени
  - L3: Luxury Furnished (`luxury-furnished-rent`) | Луксозно обзаведени
  - L3: Corporate Housing (`corporate-housing`) | Корпоративни жилища
  - L3: Expat Rentals (`expat-rentals`) | Наем за чужденци
- L2: Unfurnished Rentals (`unfurnished-rentals`) | Необзаведени под наем
- L2: Short-Term Rentals (`short-term-rentals`) | Краткосрочен наем
  - L3: Daily Rentals (`daily-rentals`) | Дневен наем
  - L3: Weekly Rentals (`weekly-rentals`) | Седмичен наем
  - L3: Monthly Rentals (`monthly-rentals`) | Месечен наем
  - L3: Airbnb Properties (`airbnb-properties`) | Airbnb имоти
  - L3: Seasonal Rentals (`seasonal-rentals`) | Сезонен наем
- L2: Student Housing (`student-housing`) | Студентски квартири
  - L3: Student Apartments (`student-apartments`) | Студентски апартаменти
  - L3: Student Rooms (`student-rooms`) | Студентски стаи
  - L3: Student Studios (`student-studios`) | Студентски студия
  - L3: Student Shared Housing (`student-shared`) | Студентско споделено
  - L3: Dormitory Style (`dormitory-style`) | Общежитие
- L2: Rooms for Rent (`rooms-rent`) | Стаи под наем
- L2: Shared Apartments (`shared-apartments`) | Споделени жилища

**3. Commercial** (`commercial`) 🏢 - ID: `aced61f5-67c0-4cd0-8c91-c10b653bc1b9`
- L2: Offices for Sale (`offices-commercial-sale`) | Офиси продава
  - L3: Small Offices (`small-offices-sale`) | Малки офиси
  - L3: Medium Offices (`medium-offices-sale`) | Средни офиси
  - L3: Large Offices (`large-offices-sale`) | Големи офиси
  - L3: Open Plan Offices (`open-plan-offices`) | Офиси отворен план
  - L3: Executive Offices (`executive-offices`) | Директорски офиси
  - L3: Ground Floor Offices (`ground-floor-offices`) | Партерни офиси
  - L3: Serviced Offices (`serviced-offices-sale`) | Сервизирани офиси
- L2: Office Buildings (`office-buildings-sale`) | Офис сгради
- L2: Coworking Spaces (`coworking-sale`) | Коуъркинг пространства
- L2: Retail Shops (`retail-shops-sale`) | Магазини
  - L3: Street Retail (`street-retail`) | Улични магазини
  - L3: Mall Units (`mall-units-sale`) | Молови единици
  - L3: Corner Shops (`corner-shops`) | Ъглови магазини
  - L3: Food Retail (`food-retail-sale`) | Хранителни магазини
  - L3: Fashion Retail (`fashion-retail-sale`) | Магазини за мода
  - L3: Electronics Retail (`electronics-retail-sale`) | Магазини за техника
  - L3: Pharmacy Locations (`pharmacy-locations`) | Аптеки локации
  - L3: Pop-Up Spaces (`popup-spaces`) | Поп-ъп пространства
- L2: Shopping Centers (`shopping-centers-sale`) | Търговски центрове
- L2: Showrooms (`showrooms-sale`) | Шоуруми
- L2: Kiosks & Stands (`kiosks-sale`) | Павилиони и сергии
- L2: Warehouses (`warehouses-sale`) | Складове
  - L3: Distribution Warehouses (`distribution-warehouses`) | Дистрибуторски складове
  - L3: Storage Warehouses (`storage-warehouses`) | Складови бази
  - L3: Cold Storage (`cold-storage-sale`) | Хладилни складове
  - L3: Fulfillment Centers (`fulfillment-centers`) | Фулфилмънт центрове
  - L3: Cross-Dock Facilities (`cross-dock-facilities`) | Крос-док съоръжения
  - L3: Self-Storage (`self-storage-sale`) | Селф-сторидж
  - L3: Bonded Warehouses (`bonded-warehouses`) | Митнически складове
- L2: Industrial Buildings (`industrial-buildings-sale`) | Промишлени сгради
- L2: Factories (`factories-sale`) | Фабрики
- L2: Logistics Centers (`logistics-centers-sale`) | Логистични центрове
- L2: Restaurants & Cafes (`restaurants-sale`) | Ресторанти и кафенета
  - L3: Fast Food Locations (`fast-food-locations`) | Фаст фууд локации
  - L3: Fine Dining Spaces (`fine-dining-spaces`) | Ресторанти висок клас
  - L3: Cafe Spaces (`cafe-spaces-sale`) | Кафе локации
  - L3: Bar Locations (`bar-locations`) | Бар локации
  - L3: Bakery Locations (`bakery-locations`) | Пекарни локации
  - L3: Food Court Units (`food-court-units`) | Фууд корт единици
  - L3: Ghost Kitchen Spaces (`ghost-kitchen-spaces`) | Призрачни кухни
- L2: Hotels (`hotels-sale`) | Хотели
  - L3: Boutique Hotels (`boutique-hotels`) | Бутикови хотели
  - L3: Budget Hotels (`budget-hotels`) | Бюджетни хотели
  - L3: Resort Hotels (`resort-hotels`) | Курортни хотели
  - L3: Business Hotels (`business-hotels`) | Бизнес хотели
  - L3: Spa Hotels (`spa-hotels-sale`) | СПА хотели
  - L3: Historic Hotels (`historic-hotels`) | Исторически хотели
  - L3: Apart-Hotels (`apart-hotels`) | Апарт хотели
- L2: Guest Houses (`guesthouses-sale`) | Къщи за гости
- L2: Motels (`motels-sale`) | Мотели
- L2: Gas Stations (`gas-stations-sale`) | Бензиностанции
- L2: Car Washes (`car-washes-sale`) | Автомивки
- L2: Auto Service Centers (`auto-service-sale`) | Автосервизи
- L2: Medical Offices (`medical-offices-sale`) | Медицински кабинети
- L2: Clinics (`clinics-sale`) | Клиники
- L2: Gyms & Fitness Centers (`gyms-sale`) | Фитнес центрове
- L2: Beauty Salons (`beauty-salons-sale`) | Козметични салони
- L2: Educational Facilities (`educational-sale`) | Образователни обекти
- L2: Mixed-Use Buildings (`mixed-use-sale`) | Многофункционални сгради

**4. Commercial Rentals** (`commercial-rentals`) 🏪
- L2: Offices for Rent (`offices-rent`) | Офиси под наем
- L2: Retail Shops Rent (`retail-shops-rent`) | Магазини под наем
- L2: Warehouses Rent (`warehouses-rent`) | Складове под наем
- L2: Industrial Rent (`industrial-rent`) | Промишлени под наем
- L2: Restaurant Spaces Rent (`restaurants-rent`) | Заведения под наем
- L2: Showrooms Rent (`showrooms-rent`) | Шоуруми под наем
- L2: Medical Spaces Rent (`medical-rent`) | Медицински площи под наем
- L2: Coworking Rent (`coworking-rent`) | Коуъркинг под наем
- L2: Event Spaces Rent (`event-spaces-rent`) | Зали под наем
- L2: Production Spaces Rent (`production-rent`) | Производствени площи

**5. Land** (`land`) 🌳 - ID: `9df696ac-5885-4a79-af93-41fb1b977c4b`
- L2: Building Plots (`building-plots`) | Парцели за строеж
  - L3: Small Plots (`small-building-plots`) | Малки парцели
  - L3: Medium Plots (`medium-building-plots`) | Средни парцели
  - L3: Large Plots (`large-building-plots`) | Големи парцели
  - L3: Plots with Permit (`plots-with-permit`) | Парцели с разрешително
  - L3: Plots with Project (`plots-with-project`) | Парцели с проект
  - L3: Corner Plots (`corner-plots`) | Ъглови парцели
  - L3: Flat Plots (`flat-plots`) | Равни парцели
- L2: Urban Plots (`urban-plots`) | Градски парцели
- L2: Suburban Plots (`suburban-plots`) | Крайградски парцели
- L2: Village Plots (`village-plots`) | Селски парцели
- L2: Agricultural Land (`agricultural-land`) | Земеделска земя
  - L3: Irrigated Land (`irrigated-land`) | Напояема земя
  - L3: Rain-Fed Land (`rain-fed-land`) | Богарска земя
  - L3: Organic Farmland (`organic-farmland`) | Биоземя
  - L3: Consolidated Parcels (`consolidated-parcels`) | Окрупнени масиви
  - L3: Fertile Black Earth (`black-earth-land`) | Плодородна черноземна
  - L3: Subsidized Land (`subsidized-land`) | Субсидирана земя
- L2: Arable Land (`arable-land`) | Обработваема земя
- L2: Orchards (`orchards`) | Овощни градини
- L2: Vineyards (`vineyards`) | Лозя
- L2: Pastures & Meadows (`pastures-meadows`) | Пасища и ливади
- L2: Forest Land (`forest-land`) | Горски терени
- L2: Commercial Land (`commercial-land`) | Търговски терени
- L2: Industrial Land (`industrial-land`) | Промишлени терени
- L2: Recreation Land (`recreation-land`) | Рекреационни терени
- L2: Seaside Plots (`seaside-plots`) | Морски парцели
- L2: Mountain Plots (`mountain-plots`) | Планински парцели
- L2: Lakeside Plots (`lakeside-plots`) | Язовирни парцели
- L2: Development Projects (`development-projects`) | Проекти за развитие
- L2: Unregulated Land (`unregulated-land`) | Нерегулирани терени

**6. Vacation Rentals** (`vacation-rentals`) 🏖️ - ID: `0e8c1882-8d46-4e23-8add-97e450fd702b`
- L2: Beach Properties (`beach-properties`) | Морски имоти
  - L3: Beachfront Apartments (`beachfront-apartments`) | Апартаменти на първа линия
  - L3: Sea View Apartments (`seaview-apartments`) | Апартаменти с морска гледка
  - L3: Beach Houses (`beach-houses-vac`) | Морски къщи
  - L3: Beach Studios (`beach-studios`) | Морски студия
  - L3: Resort Apartments (`resort-apartments`) | Курортни апартаменти
  - L3: Beach Penthouses (`beach-penthouses`) | Морски пентхауси
- L2: Mountain Chalets (`mountain-chalets`) | Планински вили
  - L3: Ski-In Ski-Out (`ski-in-ski-out`) | Ски-ин ски-аут
  - L3: Mountain Apartments (`mountain-apartments`) | Планински апартаменти
  - L3: Traditional Chalets (`traditional-chalets`) | Традиционни вили
  - L3: Modern Mountain Homes (`modern-mountain-homes`) | Модерни планински къщи
  - L3: Year-Round Properties (`year-round-mountain`) | Целогодишни имоти
  - L3: Mountain Studios (`mountain-studios`) | Планински студия
- L2: Spa Properties (`spa-properties`) | СПА имоти
- L2: Holiday Apartments (`holiday-apartments`) | Ваканционни апартаменти
- L2: Holiday Houses (`holiday-houses`) | Ваканционни къщи
- L2: Timeshares (`timeshares`) | Споделена собственост
- L2: Camping & Glamping (`camping-glamping`) | Къмпинги и глемпинг
- L2: Rural Retreats (`rural-retreats`) | Селски имоти за почивка

**7. New Construction** (`new-construction`) 🏗️
- L2: New Apartments (`new-apartments`) | Нови апартаменти
  - L3: Act 16 Ready (`act16-apartments`) | С Акт 16
  - L3: Act 15 Stage (`act15-apartments`) | Етап Акт 15
  - L3: Under Construction (`under-construction-apt`) | В строеж
  - L3: Foundation Stage (`foundation-stage`) | Етап основи
  - L3: Early Bird Sales (`early-bird-sales`) | Ранни продажби
  - L3: Green Building Certified (`green-certified-new`) | Зелено сертифициране
- L2: New Houses (`new-houses`) | Нови къщи
- L2: Off-Plan Apartments (`offplan-apartments`) | Апартаменти на зелено
- L2: Off-Plan Houses (`offplan-houses`) | Къщи на зелено
- L2: New Developments (`new-developments`) | Нови проекти
  - L3: Residential Complexes (`residential-complexes`) | Жилищни комплекси
  - L3: Mixed-Use Developments (`mixed-developments`) | Смесени проекти
  - L3: Gated Developments (`gated-developments`) | Затворени комплекси
  - L3: Waterfront Developments (`waterfront-developments`) | Крайбрежни проекти
  - L3: City Center Developments (`city-center-developments`) | Централни проекти
  - L3: Suburban Developments (`suburban-developments`) | Крайградски проекти
- L2: Turnkey Properties (`turnkey-properties`) | До ключ
- L2: Eco Buildings (`eco-buildings`) | Еко сгради
- L2: Pre-Construction (`pre-construction`) | Предстроителство

**8. Luxury Properties** (`luxury-properties`) 👑
- L2: Luxury Apartments (`luxury-apartments`) | Луксозни апартаменти
- L2: Luxury Villas (`luxury-villas`) | Луксозни вили
  - L3: Ultra-Luxury Villas (`ultra-luxury-villas`) | Ултра луксозни вили
  - L3: Golf Course Villas (`golf-villas`) | Вили до голф игрище
  - L3: Private Island Villas (`island-villas`) | Вили на остров
  - L3: Vineyard Estates (`vineyard-estates`) | Лозови имения
  - L3: Branded Residences (`branded-residences`) | Брандирани резиденции
  - L3: Eco-Luxury Villas (`eco-luxury-villas`) | Еко луксозни вили
- L2: Mansions (`mansions-sale`) | Имения
- L2: Waterfront Properties (`waterfront-luxury`) | Имоти на водата
- L2: Historic Properties (`historic-properties`) | Исторически имоти
- L2: Gated Communities (`gated-communities`) | Затворени комплекси
- L2: Smart Homes (`smart-homes`) | Смарт домове
- L2: Designer Properties (`designer-properties`) | Дизайнерски имоти

**9. Investment Properties** (`investment-properties`) 📈
- L2: Multi-Family Buildings (`multi-family-sale`) | Жилищни сгради
- L2: Rental Properties (`rental-investment`) | Имоти под наем
- L2: Commercial Investment (`commercial-investment`) | Търговски инвестиции
- L2: Development Opportunities (`development-opportunities`) | Възможности за развитие
- L2: REITs & Funds (`reits-funds`) | Фондове за недвижими имоти
- L2: Distressed Properties (`distressed-properties`) | Имоти с проблеми
- L2: Portfolio Sales (`portfolio-sales`) | Портфолио продажби
- L2: Off-Market Deals (`off-market-deals`) | Частни сделки

**10. Parking & Storage** (`parking-storage`) 🚗
- L2: Garages (`garages-sale`) | Гаражи
  - L3: Single Garages (`single-garages`) | Единични гаражи
  - L3: Double Garages (`double-garages`) | Двойни гаражи
  - L3: Lockable Garages (`lockable-garages`) | Заключващи се гаражи
  - L3: Electric Garages (`electric-garages`) | Гаражи с ток
  - L3: Workshop Garages (`workshop-garages`) | Работилнични гаражи
- L2: Parking Spaces (`parking-spaces-sale`) | Паркоместа
- L2: Underground Parking (`underground-parking`) | Подземни гаражи
- L2: Storage Units (`storage-units-sale`) | Складови клетки
- L2: Basements (`basements-sale`) | Мазета
- L2: Boat Storage (`boat-storage`) | Лодкостоянки
- L2: Carports (`carports-sale`) | Навеси за коли
- L2: Parking Lots (`parking-lots-sale`) | Паркинги

**11. Rural & Agricultural** (`rural-agricultural`) 🌾
- L2: Farms (`farms-sale`) | Ферми
- L2: Ranches (`ranches-sale`) | Ранчо
- L2: Equestrian Properties (`equestrian-properties`) | Конни бази
- L2: Wineries (`wineries-sale`) | Винарни
- L2: Olive Groves (`olive-groves`) | Маслинови градини
- L2: Greenhouses (`greenhouses-sale`) | Оранжерии
- L2: Fish Farms (`fish-farms`) | Рибарници
- L2: Hunting Grounds (`hunting-grounds`) | Ловни терени
- L2: Beekeeping Properties (`beekeeping-properties`) | Пчеларски имоти

**12. Foreclosures & Auctions** (`foreclosures-auctions`) ⚖️
- L2: Bank Foreclosures (`bank-foreclosures`) | Банкови имоти
- L2: Court Auctions (`court-auctions`) | Съдебни търгове
- L2: Private Bailiff Sales (`private-bailiff-sales`) | ЧСИ продажби
- L2: NRA Auctions (`nra-auctions`) | Търгове на НАП
- L2: Municipal Auctions (`municipal-auctions`) | Общински търгове
- L2: Distressed Sales (`distressed-sales`) | Имоти в несъстоятелност
- L2: Short Sales (`short-sales`) | Кратки продажби

#### Real Estate Attributes (75 Total)

**Property Basics (1-13):**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| Listing Type | select | For Sale, For Rent, For Lease, Auction | Продава, Под наем, Дългосрочен наем, Търг |
| Property Type | select | Apartment, House, Villa, Maisonette, Penthouse, Studio, Office, Shop, Warehouse, Land, Garage, Other | Апартамент, Къща, Вила, Мезонет, Пентхаус, Студио, Офис, Магазин, Склад, Парцел, Гараж, Друго |
| Price | number | - | - |
| Price Currency | select | EUR, BGN, USD | Евро, Лева, Долари |
| Price per sqm | number | - | - |
| Total Area (sqm) | number | - | - |
| Living Area (sqm) | number | - | - |
| Plot Size (sqm) | number | - | - |
| Rooms | select | Studio, 1, 2, 3, 4, 5, 6+ | Студио, 1, 2, 3, 4, 5, 6+ |
| Bedrooms | select | 0-6+ | 0-6+ |
| Bathrooms | select | 1-5+ | 1-5+ |
| Floor Number | select | Basement, Ground, 1-10, 11-15, 16-20, 21+, Last | Сутерен, Партер, 1-10, 11-15, 16-20, 21+, Последен |
| Total Floors | select | 1-21+ | 1-21+ |

**Building & Condition (14-22):**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| Year Built | select | Before 1950, 1950-1970, 1971-1990, 1991-2000, 2001-2010, 2011-2015, 2016-2020, 2021-2025, Under Construction | Преди 1950, 1950-1970, 1971-1990, 1991-2000, 2001-2010, 2011-2015, 2016-2020, 2021-2025, В строеж |
| **Construction Type** | select | **Panel, Brick, EPK, Reinforced Concrete, Wood, Stone, Mixed, Steel Frame, Prefab** | **Панел, Тухла, ЕПК, Стоманобетон, Дърво, Камък, Смесено, Метална конструкция, Сглобяемо** |
| Property Condition | select | New Build, Excellent, Very Good, Good, Satisfactory, Needs Renovation, For Demolition, Under Renovation | Ново строителство, Отлично, Много добро, Добро, Задоволително, За ремонт, За събаряне, В ремонт |
| **Act 16 Status** | select | **With Act 16, Without Act 16, Act 14, Act 15, In Progress, Not Applicable** | **С Акт 16, Без Акт 16, Акт 14, Акт 15, В процес, Неприложимо** |
| Furnishing | select | Unfurnished, Partially Furnished, Fully Furnished, Luxury Furnished, Semi-Furnished | Необзаведен, Частично обзаведен, Напълно обзаведен, Луксозно обзаведен, Полуобзаведен |
| Renovation Status | select | Not Renovated, Cosmetic, Partial, Full, Newly Renovated, Designer | Без ремонт, Козметичен, Частичен, Основен, Ново ремонтиран, Дизайнерски |
| Building Type | select | Residential, Commercial, Mixed Use, Detached House, Villa Complex, Apartment Complex, Industrial, Historic | Жилищна сграда, Търговска сграда, Смесено ползване, Самостоятелна къща, Комплекс вили, Жилищен комплекс, Промишлена сграда, Историческа сграда |
| Apartment Position | select | Street Facing, Yard Facing, Corner, Through, Single-Sided | Към улицата, Към двора, Ъглов, Проходен, Едностранен |
| Property Levels | select | 1-4+ Levels | 1-4+ нива |

**Location (23-31):**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| City | select | Sofia, Plovdiv, Varna, Burgas, Ruse + 25 more Bulgarian cities | София, Пловдив, Варна, Бургас, Русе + 25 още български градове |
| Sofia District | select | Center, Lozenets, Mladost, Lyulin, Studentski grad, Vitosha + 15 more | Център, Лозенец, Младост, Люлин, Студентски град, Витоша + 15 още |
| Neighborhood | text | Free text | Свободен текст |
| Address | text | Free text | Свободен текст |
| Metro Proximity | select | Next to Metro, Under 5 min, 5-10 min, 10-15 min, Over 15 min, No Metro | До метростанция, Под 5 мин, 5-10 мин, 10-15 мин, Над 15 мин, Няма метро |
| Distance to Center | select | In the Center, Under 5 min, 5-45 min, Over 45 min | В центъра, Под 5 мин, 5-45 мин, Над 45 мин |
| Beach Proximity | select | Beachfront, First Line, Second Line, Under 500m, 500m-5km, Over 5km | На плажа, Първа линия, Втора линия, Под 500м, 500м-5км, Над 5км |
| Ski Lift Proximity | select | Ski-In/Ski-Out, Under 100m, 100m-2km, Over 2km | Ски-ин/Ски-аут, Под 100м, 100м-2км, Над 2км |
| Nearby Amenities | multiselect | Metro, Bus, Tram, School, Kindergarten, University, Hospital, Pharmacy, Supermarket, Mall, Park, Gym, Restaurant, Bank, ATM | Метро, Автобус, Трамвай, Училище, Детска градина, Университет, Болница, Аптека, Супермаркет, Мол, Парк, Фитнес, Ресторант, Банка, Банкомат |

**Features & Amenities (32-47):**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| **Heating Type** | select | **Central Heating (TEC), Gas Boiler, Electric, Air Conditioner, Fireplace, Pellet Stove, Floor Heating, Heat Pump, Wood Stove, No Heating, Mixed** | **ТЕЦ (парно), Газов котел, Електрическо, Климатик, Камина, Пелетна печка, Подово отопление, Термопомпа, Печка на дърва, Без отопление, Смесено** |
| Air Conditioning | select | Yes - All Rooms, Yes - Some Rooms, Central AC, VRV System, No, Prepared | Да - във всички стаи, Да - в някои стаи, Централен климатик, VRV система, Не, Подготовка |
| Elevator | select | Yes, No, 2 Elevators, Freight Elevator, Panoramic | Да, Не, 2 асансьора, Товарен асансьор, Панорамен |
| Parking | select | Garage, Underground, Outdoor, Street, No Parking, Multiple Spots | Гараж, Подземен, Открит, Улично, Без паркинг, Няколко места |
| Balcony/Terrace | select | Balcony, Terrace, Multiple, Large Terrace, Rooftop, Loggia, French Balcony, No | Балкон, Тераса, Няколко балкона, Голяма тераса, Покривна, Лоджия, Френски балкон, Без |
| Garden | select | Private, Shared, Roof Garden, Landscaped, No | Частна, Обща, Покривна, Озеленена, Без |
| Pool | select | Private Indoor, Private Outdoor, Shared, Infinity, No | Частен закрит, Частен открит, Общ, Инфинити, Без |
| Storage | select | Basement, Attic, Both, Storage Room, No | Мазе, Таван, Мазе и таван, Складово помещение, Без |
| Windows | select | PVC, Aluminum, Wood, Wood-Aluminum, Old Wooden, Triple Glazed | PVC, Алуминий, Дърво, Дърво-алуминий, Стара дървена, Троен стъклопакет |
| Flooring | multiselect | Laminate, Parquet, Tiles, Marble, Granite, Carpet, Vinyl, Concrete, Heated Floor | Ламинат, Паркет, Теракот, Мрамор, Гранит, Мокет, Винил, Бетон, Подово отопление |
| Interior Features | multiselect | Built-in Wardrobes, Walk-in Closet, Laundry Room, Open Kitchen, Kitchen Island, Fireplace, Home Office, Security Door, Intercom, Video Intercom, Smart Home | Вградени гардероби, Гардеробна, Мокро помещение, Отворена кухня, Кухненски остров, Камина, Домашен офис, Бронирана врата, Домофон, Видеодомофон, Смарт дом |
| Building Amenities | multiselect | Concierge, Security Guard, Gym, Spa, Sauna, Common Terrace, Rooftop Lounge, Meeting Room, Children Playground, BBQ Area, Bike Storage, Car Wash, EV Charging, Mailroom, Package Lockers | Консиерж, Охрана, Фитнес, СПА, Сауна, Обща тераса, Покривен бар, Зала за срещи, Детска площадка, Барбекю зона, Велопаркинг, Автомивка, Зарядна станция, Поща, Пощенски шкафове |
| Security | multiselect | 24/7 Security, CCTV, Gated Community, Alarm System, Access Control, Security Door, Fire Alarm, Smoke Detectors, Sprinkler System, Safe Room | 24/7 охрана, Видеонаблюдение, Затворен комплекс, Алармена система, Контрол на достъпа, Бронирана врата, Пожарна аларма, Датчици за дим, Спринклерна система, Безопасна стая |
| Pet Policy | select | Pets Allowed, Small Pets Only, Cats Only, Dogs Only, No Pets, Negotiable | Домашни любимци - да, Само малки, Само котки, Само кучета, Без любимци, По договаряне |
| Internet & Cable | multiselect | Fiber Optic, High-Speed, Cable TV, Satellite TV, Smart TV Ready, No Internet | Оптика, Високоскоростен, Кабелна телевизия, Сателитна, Smart TV готов, Без интернет |
| Utilities | multiselect | Municipal Water, Well, Septic Tank, Municipal Sewage, Natural Gas, Solar Panels, Central Hot Water, Individual Boiler | Градски водопровод, Кладенец, Септична яма, Градска канализация, Газ, Соларни панели, Центр. топла вода, Индивидуален бойлер |

**Views & Energy (48-56):**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| View | multiselect | Sea, Mountain, City, Park, Garden, River, Lake, Panoramic, Street, Yard, No Special | Морска, Планинска, Градска, Паркова, Дворна, Речна, Езерна, Панорамна, Към улицата, Към двора, Без изглед |
| Exposure | multiselect | North, South, East, West, NE, NW, SE, SW | Север, Юг, Изток, Запад, СИ, СЗ, ЮИ, ЮЗ |
| Energy Rating | select | A+, A, B, C, D, E, F, G, Not Rated, In Process | A+, A, B, C, D, E, F, G, Без сертификат, В процес |
| Ownership Type | select | Private, Company, State/Municipal, Cooperative, Right of Building, Usufruct, Shared | Частна, Фирмена, Държавна/Общинска, Кооперативна, Право на строеж, Вещно право, Споделена |
| Title Status | select | Clean Title, Title Search Required, Multiple Owners, Inheritance in Progress, Court Case | Чиста собственост, Изисква проверка, Множество собственици, В процес на наследство, Съдебно дело |
| Encumbrances | select | No Encumbrances, Mortgage, Court Claim, Tax Lien, Right of Way, Other | Без тежести, Ипотека, Съдебен иск, Данъчна тежест, Право на преминаване, Друга тежест |
| Available From | select | Immediately, Within 1 Month, 1-3 Months, 3-6 Months, Upon Agreement, After Completion | Веднага, До 1 месец, 1-3 месеца, 3-6 месеца, По договаряне, След завършване |
| Rental Terms | select | Long-Term (1+ Year), Short-Term, Monthly, Weekly, Daily, Negotiable | Дългосрочен (1+ год), Краткосрочен, Месечен, Седмичен, Дневен, По договаряне |
| Deposit Required | select | 1 Month, 2 Months, 3 Months, Negotiable, No Deposit | 1 наем, 2 наема, 3 наема, По договаряне, Без депозит |

**Commercial & Land Specific (57-65):**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| Commercial Use | select | Retail, Office, Restaurant, Warehouse, Production, Service, Medical, Educational, Mixed, Other | Търговия, Офис, Ресторант, Склад, Производство, Услуги, Медицинско, Образователно, Смесено, Друго |
| Ceiling Height | select | Under 2.5m, 2.5-3m, 3-4m, 4-6m, 6-8m, Over 8m | Под 2.5м, 2.5-3м, 3-4м, 4-6м, 6-8м, Над 8м |
| Loading Facilities | multiselect | Loading Dock, Ground Level Door, Ramp, Freight Elevator, Overhead Crane, Forklift Access | Товарна рампа, Врата на ниво земя, Рампа, Товарен асансьор, Мостов кран, Достъп за мотокар |
| Zoning | select | Residential, Commercial, Industrial, Mixed, Agricultural, Recreational, Special Purpose | Жилищно, Търговско, Промишлено, Смесено, Земеделско, Рекреационно, Специално |
| Land Type | select | Building Plot (УПИ), Agricultural (Нива), Forest, Pasture, Vineyard, Orchard, Industrial, Recreational | Парцел (УПИ), Земеделска (Нива), Горска, Пасище, Лозе, Овощна градина, Промишлена, Рекреационна |
| Regulation Status | select | Regulated (В регулация), Unregulated (Извън регулация), Pending, Agricultural Only | В регулация, Извън регулация, В процес на регулация, Само земеделска |
| Terrain | select | Flat, Slight Slope, Moderate Slope, Steep, Terraced, Mixed | Равен, Лек наклон, Умерен наклон, Стръмен, Терасиран, Смесен |
| Road Access | select | Asphalt, Paved, Gravel, Dirt, No Direct Access, Highway | Асфалтов път, Павиран път, Чакълен път, Черен път, Без директен достъп, Магистрален достъп |
| Land Utilities | multiselect | Electricity, Water, Sewage, Gas, Phone/Internet, All, None, Partially Connected | Електричество, Вода, Канализация, Газ, Телефон/Интернет, Всички комуникации, Без комуникации, Частично свързан |

**Investment & Additional (66-75):**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| Monthly Maintenance | select | No Fee, Under 50 BGN, 50-100 BGN, 100-200 BGN, 200-500 BGN, 500-1000 BGN, Over 1000 BGN | Без такса, Под 50 лв, 50-100 лв, 100-200 лв, 200-500 лв, 500-1000 лв, Над 1000 лв |
| Rental Yield | select | Under 3%, 3-5%, 5-7%, 7-10%, Over 10%, N/A | Под 3%, 3-5%, 5-7%, 7-10%, Над 10%, Неприложимо |
| Current Status | select | Vacant, Owner Occupied, Tenant Occupied, Short-Term Rental, Under Renovation | Празен, Обитаван от собственика, Под наем, Краткосрочен наем, В ремонт |
| Seller Type | select | Owner (Private), Agency, Developer, Bank, Company, Court/Bailiff | Собственик (частен), Агенция, Строител, Банка, Фирма, Съд/ЧСИ |
| Agent Commission | select | No Commission, 1 Month Rent, 2%, 3%, By Agreement, Included | Без комисиона, 1 наем, 2%, 3%, По договаряне, Включена |
| Virtual Tour | boolean | Yes/No | Да/Не |
| Video Tour | boolean | Yes/No | Да/Не |
| Price Negotiable | boolean | Yes/No | Да/Не |
| Urgent Sale | boolean | Yes/No | Да/Не |
| Exchange Possible | boolean | Yes/No | Да/Не |

> **Bulgarian Market Specifics:**
> - **Construction Types**: Panel (Панел), Brick (Тухла), EPK (ЕПК) - unique Bulgarian terms
> - **Act 16 Status**: Critical legal milestone indicating building completion and occupancy permit
> - **Heating Types**: TEC (ТЕЦ/парно) = Central district heating, common in Bulgaria
> - **Sofia Districts**: Full coverage of all 24 administrative districts
> - **Energy Ratings**: EU standard A+ to G classification

---

### 🛠️ 17. SERVICES & EVENTS (`services`)
**Database Stats:** L0: 1 | L1: 23 | L2: 238 | L3: 219 | Total: 481 categories | 70 attributes
**L0 ID:** `4aa24e30-4596-4d22-85e5-7558936163b3`

#### L1 Subcategories:

**1. Home Services** (`home-services`) 🏠
- L2: Plumbing (`svc-plumbing`)
  - L3: Pipe Repair (`svc-pipe-repair`) | Ремонт на тръби
  - L3: Drain Cleaning (`svc-drain-cleaning`) | Отпушване на канали
  - L3: Water Heater (`svc-water-heater`) | Бойлери
  - L3: Leak Detection (`svc-leak-detection`) | Откриване на течове
  - L3: Bathroom Plumbing (`svc-bathroom-plumbing`) | ВиК за баня
  - L3: Kitchen Plumbing (`svc-kitchen-plumbing`) | ВиК за кухня
  - L3: Emergency Plumbing (`svc-emergency-plumbing`) | Спешен ВиК
  - L3: Sewer Services (`svc-sewer`) | Канализация
- L2: Electrical (`svc-electrical`)
  - L3: Wiring & Rewiring (`svc-wiring`) | Окабеляване
  - L3: Lighting Installation (`svc-lighting-install`) | Монтаж на осветление
  - L3: Panel Upgrades (`svc-panel-upgrade`) | Обновяване на табло
  - L3: Outlet Installation (`svc-outlet-install`) | Монтаж на контакти
  - L3: Ceiling Fan Installation (`svc-ceiling-fan`) | Монтаж на вентилатори
  - L3: Smart Home Wiring (`svc-smart-wiring`) | Умно окабеляване
  - L3: Emergency Electrical (`svc-emergency-electric`) | Спешен електротехник
  - L3: EV Charger Installation (`svc-ev-charger`) | Монтаж на зарядни станции
- L2: HVAC (`svc-hvac`)
  - L3: AC Installation (`svc-ac-install`) | Монтаж на климатик
  - L3: Heating Installation (`svc-heating-install`) | Монтаж на отопление
  - L3: AC Repair (`svc-ac-repair`) | Ремонт на климатик
  - L3: Furnace Repair (`svc-furnace-repair`) | Ремонт на пещ
  - L3: Duct Cleaning (`svc-duct-cleaning`) | Почистване на въздуховоди
  - L3: Ventilation (`svc-ventilation`) | Вентилация
  - L3: Heat Pump Services (`svc-heat-pump`) | Термопомпи
  - L3: Boiler Services (`svc-boiler`) | Котли
- L2: Carpentry (`svc-carpentry`)
  - L3: Furniture Repair (`svc-furniture-repair`) | Ремонт на мебели
  - L3: Custom Cabinets (`svc-custom-cabinets`) | Мебели по поръчка
  - L3: Door Installation (`svc-door-install`) | Монтаж на врати
  - L3: Window Installation (`svc-window-install`) | Монтаж на прозорци
  - L3: Deck Building (`svc-deck-building`) | Изграждане на тераси
  - L3: Trim Work (`svc-trim-work`) | Орнаменти и первази
  - L3: Flooring Installation (`svc-flooring-install`) | Монтаж на подове
  - L3: Staircase Work (`svc-staircase`) | Стълбища
- L2: Painting (`svc-painting`)
  - L3: Interior Painting (`svc-interior-paint`) | Вътрешно боядисване
  - L3: Exterior Painting (`svc-exterior-paint`) | Външно боядисване
  - L3: Wallpaper (`svc-wallpaper`) | Тапети
  - L3: Cabinet Painting (`svc-cabinet-paint`) | Боядисване на шкафове
  - L3: Deck Staining (`svc-deck-stain`) | Лакиране на тераси
  - L3: Texture Coating (`svc-texture`) | Текстурни покрития
- L2: Roofing (`svc-roofing`)
  - L3: Roof Repair (`svc-roof-repair`) | Ремонт на покрив
  - L3: Roof Replacement (`svc-roof-replace`) | Смяна на покрив
  - L3: Gutter Services (`svc-gutter`) | Улуци
  - L3: Roof Inspection (`svc-roof-inspect`) | Инспекция на покрив
  - L3: Flat Roofing (`svc-flat-roof`) | Плоски покриви
  - L3: Metal Roofing (`svc-metal-roof`) | Метални покриви
- L2: Landscaping (`svc-landscaping`)
  - L3: Lawn Care (`svc-lawn-care`) | Поддръжка на трева
  - L3: Garden Design (`svc-garden-design`) | Дизайн на градина
  - L3: Tree Services (`svc-tree-services`) | Услуги за дървета
  - L3: Irrigation (`svc-irrigation`) | Напояване
  - L3: Hardscaping (`svc-hardscaping`) | Настилки и алеи
  - L3: Fence Installation (`svc-fence-install`) | Монтаж на огради
  - L3: Outdoor Lighting (`svc-outdoor-lighting`) | Външно осветление

**2. Cleaning Services** (`cleaning-services`) 🧹
- L2: Residential Cleaning (`svc-residential-cleaning`)
  - L3: Regular Cleaning (`svc-regular-cleaning`) | Редовно почистване
  - L3: Deep Cleaning (`svc-deep-cleaning`) | Основно почистване
  - L3: Move In/Out Cleaning (`svc-moveinout-clean`) | Почистване при нанасяне/изнасяне
  - L3: Post-Construction (`svc-post-construction`) | След ремонт
  - L3: Spring Cleaning (`svc-spring-cleaning`) | Пролетно почистване
- L2: Commercial Cleaning (`svc-commercial-cleaning`)
  - L3: Office Cleaning (`svc-office-cleaning`) | Почистване на офиси
  - L3: Retail Cleaning (`svc-retail-cleaning`) | Почистване на магазини
  - L3: Medical Facility (`svc-medical-cleaning`) | Медицински заведения
  - L3: Industrial Cleaning (`svc-industrial-cleaning`) | Индустриално почистване
- L2: Specialized Cleaning (`svc-specialized-cleaning`)
  - L3: Carpet Cleaning (`svc-carpet-cleaning`) | Почистване на килими
  - L3: Window Cleaning (`svc-window-cleaning`) | Почистване на прозорци
  - L3: Upholstery Cleaning (`svc-upholstery`) | Почистване на мебели
  - L3: Pressure Washing (`svc-pressure-wash`) | Почистване с водоструйка
  - L3: Air Duct Cleaning (`svc-airduct-cleaning`) | Почистване на въздуховоди
  - L3: Pool Cleaning (`svc-pool-cleaning`) | Почистване на басейни

**3. Repairs & Maintenance** (`repairs-maintenance`) 🔧
- L2: Appliance Repair (`svc-appliance-repair`)
  - L3: Washing Machine (`svc-washer-repair`) | Перални
  - L3: Refrigerator (`svc-fridge-repair`) | Хладилници
  - L3: Dishwasher (`svc-dishwasher-repair`) | Съдомиялни
  - L3: Oven & Stove (`svc-oven-repair`) | Фурни и готварски печки
  - L3: Dryer Repair (`svc-dryer-repair`) | Сушилни
  - L3: Small Appliances (`svc-small-appliance`) | Малки уреди
- L2: Furniture Repair (`svc-furniture-repair-cat`)
  - L3: Upholstery Repair (`svc-upholstery-repair`) | Ремонт на тапицерия
  - L3: Wood Furniture (`svc-wood-furniture`) | Дървени мебели
  - L3: Antique Restoration (`svc-antique-restore`) | Реставрация на антики
  - L3: Leather Repair (`svc-leather-repair`) | Ремонт на кожа
- L2: Electronics Repair (`svc-electronics-repair`)
  - L3: TV Repair (`svc-tv-repair`) | Ремонт на телевизори
  - L3: Computer Repair (`svc-computer-repair`) | Ремонт на компютри
  - L3: Phone Repair (`svc-phone-repair`) | Ремонт на телефони
  - L3: Audio Equipment (`svc-audio-repair`) | Ремонт на аудио
- L2: Handyman Services (`svc-handyman`)
  - L3: General Repairs (`svc-general-repairs`) | Общи ремонти
  - L3: Assembly Services (`svc-assembly`) | Монтаж на мебели
  - L3: Mounting & Hanging (`svc-mounting`) | Окачване и монтаж
  - L3: Childproofing (`svc-childproofing`) | Обезопасяване за деца

**4. Moving & Relocation** (`moving-relocation`) 📦
- L2: Local Moving (`svc-local-moving`) | Местно преместване
- L2: Long Distance Moving (`svc-longdistance-moving`) | Далечно преместване
- L2: International Moving (`svc-international-moving`) | Международно преместване
- L2: Packing Services (`svc-packing`) | Опаковане
- L2: Storage Services (`svc-storage`) | Складиране
- L2: Piano Moving (`svc-piano-moving`) | Преместване на пиана
- L2: Office Relocation (`svc-office-relocation`) | Преместване на офиси
- L2: Furniture Delivery (`svc-furniture-delivery`) | Доставка на мебели

**5. Health & Wellness Services** (`service-health-wellness`) 💆
- L2: Massage Therapy (`svc-massage-therapy`)
  - L3: Swedish Massage (`svc-swedish-massage`) | Шведски масаж
  - L3: Deep Tissue (`svc-deep-tissue`) | Дълбокотъканен масаж
  - L3: Sports Massage (`svc-sports-massage`) | Спортен масаж
  - L3: Thai Massage (`svc-thai-massage`) | Тайландски масаж
  - L3: Hot Stone (`svc-hot-stone`) | Масаж с горещи камъни
- L2: Personal Training (`svc-personal-training`)
  - L3: Weight Loss (`svc-weight-loss`) | Отслабване
  - L3: Strength Training (`svc-strength-train`) | Силови тренировки
  - L3: Cardio Training (`svc-cardio-train`) | Кардио тренировки
  - L3: Senior Fitness (`svc-senior-fitness`) | Фитнес за възрастни
- L2: Yoga & Meditation (`svc-yoga-meditation`)
  - L3: Hatha Yoga (`svc-hatha-yoga`) | Хатха йога
  - L3: Vinyasa Yoga (`svc-vinyasa-yoga`) | Виняса йога
  - L3: Meditation Classes (`svc-meditation-class`) | Класове по медитация
  - L3: Pilates (`svc-pilates`) | Пилатес
- L2: Nutrition Consulting (`svc-nutrition-consult`)
  - L3: Diet Planning (`svc-diet-planning`) | Хранителни планове
  - L3: Sports Nutrition (`svc-sports-nutrition`) | Спортно хранене
  - L3: Medical Nutrition (`svc-medical-nutrition`) | Медицинско хранене

**6. Education & Tutoring** (`education-tutoring`) 📚
- L2: Academic Tutoring (`svc-academic-tutoring`)
  - L3: Math Tutoring (`svc-math-tutor`) | Уроци по математика
  - L3: Science Tutoring (`svc-science-tutor`) | Уроци по природни науки
  - L3: Bulgarian Language (`svc-bulgarian-tutor`) | Уроци по български
  - L3: History & Geography (`svc-history-tutor`) | История и география
- L2: Language Learning (`svc-language-learning`)
  - L3: English Lessons (`svc-english-lessons`) | Уроци по английски
  - L3: German Lessons (`svc-german-lessons`) | Уроци по немски
  - L3: French Lessons (`svc-french-lessons`) | Уроци по френски
  - L3: Russian Lessons (`svc-russian-lessons`) | Уроци по руски
- L2: Music Lessons (`svc-music-lessons`)
  - L3: Piano Lessons (`svc-piano-lessons`) | Уроци по пиано
  - L3: Guitar Lessons (`svc-guitar-lessons`) | Уроци по китара
  - L3: Violin Lessons (`svc-violin-lessons`) | Уроци по цигулка
  - L3: Voice Lessons (`svc-voice-lessons`) | Уроци по пеене
- L2: Test Preparation (`svc-test-prep`)
  - L3: Matura Prep (`svc-matura-prep`) | Подготовка за матура
  - L3: University Entrance (`svc-uni-entrance`) | Подготовка за университет
  - L3: Certification Exams (`svc-cert-exams`) | Сертификационни изпити

**7. Tech & IT Services** (`tech-it-services`) 💻
- L2: Computer Services (`svc-computer-services`)
  - L3: Virus Removal (`svc-virus-removal`) | Премахване на вируси
  - L3: Data Recovery (`svc-data-recovery`) | Възстановяване на данни
  - L3: Hardware Upgrade (`svc-hardware-upgrade`) | Хардуерно подобрение
  - L3: OS Installation (`svc-os-install`) | Инсталиране на ОС
  - L3: Network Setup (`svc-network-setup`) | Настройка на мрежа
- L2: Web Development (`svc-web-development`)
  - L3: Website Design (`svc-website-design`) | Уеб дизайн
  - L3: E-commerce Sites (`svc-ecommerce-dev`) | Онлайн магазини
  - L3: WordPress Development (`svc-wordpress-dev`) | WordPress разработка
  - L3: Web Maintenance (`svc-web-maintenance`) | Поддръжка на сайтове
- L2: Mobile App Development (`svc-mobile-dev`)
  - L3: iOS Development (`svc-ios-dev`) | iOS разработка
  - L3: Android Development (`svc-android-dev`) | Android разработка
  - L3: Cross-platform (`svc-cross-platform`) | Крос-платформени приложения
- L2: IT Support (`svc-it-support`)
  - L3: Remote Support (`svc-remote-support`) | Дистанционна поддръжка
  - L3: On-site Support (`svc-onsite-support`) | Поддръжка на място
  - L3: Server Management (`svc-server-manage`) | Управление на сървъри

**8. Business Services** (`business-services`) 💼
- L2: Accounting (`svc-accounting`)
  - L3: Bookkeeping (`svc-bookkeeping`) | Счетоводно обслужване
  - L3: Tax Preparation (`svc-tax-prep`) | Данъчни декларации
  - L3: Payroll Services (`svc-payroll`) | Услуги по заплати
  - L3: Financial Auditing (`svc-auditing`) | Финансов одит
- L2: Marketing Services (`svc-marketing`)
  - L3: Social Media Marketing (`svc-smm`) | Маркетинг в социални мрежи
  - L3: SEO Services (`svc-seo`) | SEO оптимизация
  - L3: Content Marketing (`svc-content-marketing`) | Съдържателен маркетинг
  - L3: PPC Advertising (`svc-ppc`) | PPC реклама
- L2: Consulting (`svc-consulting`)
  - L3: Business Consulting (`svc-business-consult`) | Бизнес консултации
  - L3: HR Consulting (`svc-hr-consult`) | HR консултации
  - L3: IT Consulting (`svc-it-consult`) | IT консултации
- L2: Translation Services (`svc-translation`)
  - L3: Document Translation (`svc-doc-translation`) | Превод на документи
  - L3: Legal Translation (`svc-legal-translation`) | Правен превод
  - L3: Technical Translation (`svc-tech-translation`) | Технически превод
  - L3: Interpretation (`svc-interpretation`) | Устен превод

**9. Wedding Services** (`wedding-services`) 💒
- L2: Wedding Planning (`svc-wedding-planning`)
  - L3: Full Planning (`svc-full-wedding-plan`) | Пълно планиране
  - L3: Day-of Coordination (`svc-day-coordination`) | Координация в деня
  - L3: Partial Planning (`svc-partial-planning`) | Частично планиране
- L2: Wedding Venues (`svc-wedding-venues`)
  - L3: Hotels (`svc-wedding-hotels`) | Хотели за сватби
  - L3: Restaurants (`svc-wedding-restaurants`) | Ресторанти за сватби
  - L3: Outdoor Venues (`svc-outdoor-venues`) | Места на открито
  - L3: Castles & Villas (`svc-castles-villas`) | Замъци и вили
- L2: Wedding Photography (`svc-wedding-photo`)
  - L3: Photo Coverage (`svc-photo-coverage`) | Фото заснемане
  - L3: Video Coverage (`svc-video-coverage`) | Видео заснемане
  - L3: Drone Photography (`svc-drone-photo`) | Дрон фотография
  - L3: Photo Booth (`svc-photo-booth`) | Фотокабина
- L2: Wedding Entertainment (`svc-wedding-entertainment`)
  - L3: DJs (`svc-wedding-dj`) | Сватбени DJ-и
  - L3: Live Bands (`svc-wedding-bands`) | Оркестри
  - L3: Folk Musicians (`svc-folk-musicians`) | Фолклорни музиканти
- L2: Wedding Catering (`svc-wedding-catering`)
  - L3: Full Catering (`svc-full-catering`) | Пълен кетъринг
  - L3: Wedding Cakes (`svc-wedding-cakes`) | Сватбени торти
  - L3: Beverage Services (`svc-beverage-services`) | Напитки

**10. Legal & Financial Services** (`legal-financial`) ⚖️
- L2: Legal Services (`svc-legal`)
  - L3: Family Law (`svc-family-law`) | Семейно право
  - L3: Real Estate Law (`svc-realestate-law`) | Имотно право
  - L3: Business Law (`svc-business-law`) | Търговско право
  - L3: Criminal Defense (`svc-criminal-defense`) | Наказателно право
  - L3: Immigration Law (`svc-immigration-law`) | Имиграционно право
- L2: Financial Planning (`svc-financial-planning`)
  - L3: Investment Advisory (`svc-investment`) | Инвестиционни съвети
  - L3: Retirement Planning (`svc-retirement`) | Пенсионно планиране
  - L3: Wealth Management (`svc-wealth-manage`) | Управление на богатство
- L2: Insurance Services (`svc-insurance`)
  - L3: Life Insurance (`svc-life-insurance`) | Животозастраховане
  - L3: Health Insurance (`svc-health-insurance`) | Здравно застраховане
  - L3: Property Insurance (`svc-property-insurance`) | Имуществено застраховане

**11. Transportation Services** (`transportation-services`) 🚗
- L2: Taxi & Ride Services (`svc-taxi`)
  - L3: Airport Transfers (`svc-airport-transfer`) | Летищен трансфер
  - L3: City Taxi (`svc-city-taxi`) | Градско такси
  - L3: Intercity Transport (`svc-intercity`) | Междуградски превоз
- L2: Car Rental (`svc-car-rental`)
  - L3: Economy Cars (`svc-economy-rental`) | Икономични коли
  - L3: Luxury Cars (`svc-luxury-rental`) | Луксозни коли
  - L3: Van Rental (`svc-van-rental`) | Наем на бусове
- L2: Courier Services (`svc-courier`)
  - L3: Same Day Delivery (`svc-same-day`) | Доставка в същия ден
  - L3: Express Delivery (`svc-express`) | Експресна доставка
  - L3: Document Delivery (`svc-document-delivery`) | Куриер за документи

**12. Freelance & Creative** (`freelance-creative`) 🎨
- L2: Graphic Design (`svc-graphic-design`)
  - L3: Logo Design (`svc-logo-design`) | Дизайн на лого
  - L3: Brand Identity (`svc-brand-identity`) | Корпоративна идентичност
  - L3: Print Design (`svc-print-design`) | Печатен дизайн
  - L3: Packaging Design (`svc-packaging`) | Дизайн на опаковки
- L2: Video Production (`svc-video-production`)
  - L3: Corporate Videos (`svc-corporate-video`) | Корпоративни видеа
  - L3: Promotional Videos (`svc-promo-video`) | Промоционални видеа
  - L3: Video Editing (`svc-video-editing`) | Видеомонтаж
- L2: Photography (`svc-photography`)
  - L3: Portrait Photography (`svc-portrait-photo`) | Портретна фотография
  - L3: Event Photography (`svc-event-photo`) | Събитийна фотография
  - L3: Product Photography (`svc-product-photo`) | Продуктова фотография
- L2: Writing & Content (`svc-writing`)
  - L3: Copywriting (`svc-copywriting`) | Копирайтинг
  - L3: Content Writing (`svc-content-writing`) | Писане на съдържание
  - L3: Technical Writing (`svc-technical-writing`) | Техническо писане

**13. Construction & Renovation** (`construction-renovation`) 🏗️
- L2: General Contracting (`svc-general-contracting`)
  - L3: New Construction (`svc-new-construction`) | Ново строителство
  - L3: Home Additions (`svc-home-additions`) | Разширения на дома
  - L3: Full Renovations (`svc-full-renovation`) | Пълни ремонти
- L2: Interior Remodeling (`svc-interior-remodel`)
  - L3: Kitchen Remodel (`svc-kitchen-remodel`) | Ремонт на кухня
  - L3: Bathroom Remodel (`svc-bathroom-remodel`) | Ремонт на баня
  - L3: Basement Finishing (`svc-basement-finish`) | Завършване на мазе
- L2: Exterior Work (`svc-exterior-work`)
  - L3: Siding Installation (`svc-siding`) | Монтаж на сайдинг
  - L3: Driveway Paving (`svc-driveway`) | Настилка на алеи
  - L3: Pool Construction (`svc-pool-construct`) | Строителство на басейни
- L2: Specialized Construction (`svc-specialized-construction`)
  - L3: Solar Panel Installation (`svc-solar-install`) | Монтаж на соларни панели
  - L3: Home Automation (`svc-home-automation`) | Домашна автоматизация
  - L3: Accessibility Modifications (`svc-accessibility`) | Модификации за достъпност

**14. Automotive Services** (`service-automotive`) 🔧
- L2: Auto Repair (`service-auto-repair`)
  - L3: Engine Repair (`svc-engine-repair`) | Ремонт на двигател
  - L3: Transmission (`svc-transmission`) | Скоростни кутии
  - L3: Brake Service (`svc-brake-service`) | Спирачни системи
  - L3: Suspension (`svc-suspension`) | Окачване
- L2: Auto Maintenance (`svc-auto-maintenance`)
  - L3: Oil Change (`svc-oil-change`) | Смяна на масло
  - L3: Tire Service (`svc-tire-service`) | Гуми
  - L3: AC Service (`svc-auto-ac`) | Автоклиматици
  - L3: Battery Service (`svc-battery-service`) | Акумулатори
- L2: Auto Body (`svc-auto-body`)
  - L3: Dent Repair (`svc-dent-repair`) | Ремонт на вдлъбнатини
  - L3: Paint Jobs (`svc-paint-jobs`) | Боядисване
  - L3: Windshield (`svc-windshield`) | Предни стъкла
- L2: Auto Detailing (`svc-auto-detailing`)
  - L3: Interior Detailing (`svc-interior-detail`) | Вътрешен детайлинг
  - L3: Exterior Detailing (`svc-exterior-detail`) | Външен детайлинг
  - L3: Ceramic Coating (`svc-ceramic-coating`) | Керамично покритие

**15. Security Services** (`security-services`) 🔒
- L2: Home Security (`svc-home-security`)
  - L3: Alarm Systems (`svc-alarm-systems`) | Алармени системи
  - L3: CCTV Installation (`svc-cctv`) | Монтаж на камери
  - L3: Smart Locks (`svc-smart-locks`) | Умни ключалки
  - L3: Safe Installation (`svc-safe-install`) | Монтаж на сейфове
- L2: Commercial Security (`svc-commercial-security`)
  - L3: Access Control (`svc-access-control`) | Контрол на достъпа
  - L3: Security Guards (`svc-security-guards`) | Охрана
  - L3: Fire Protection (`svc-fire-protection`) | Пожарозащита

**16. Agricultural Services** (`agricultural-services`) 🌾
- L2: Farm Services (`svc-farm-services`)
  - L3: Tractor Services (`svc-tractor`) | Трактор услуги
  - L3: Harvesting (`svc-harvesting`) | Жътва
  - L3: Irrigation Systems (`svc-irrigation-farm`) | Напоителни системи
  - L3: Soil Testing (`svc-soil-testing`) | Почвен анализ
- L2: Livestock Services (`svc-livestock`)
  - L3: Veterinary Services (`svc-veterinary`) | Ветеринарни услуги
  - L3: Animal Transport (`svc-animal-transport`) | Транспорт на животни

**17. Personal Services** (`personal-services`) 💇
- L2: Beauty Services (`svc-beauty-services`)
  - L3: Hairdressing (`svc-hairdressing`) | Фризьорски услуги
  - L3: Nail Services (`svc-nail-services`) | Маникюр и педикюр
  - L3: Makeup Services (`svc-makeup`) | Гримиране
  - L3: Spa Treatments (`svc-spa-treatments`) | СПА процедури
- L2: Personal Care (`svc-personal-care`)
  - L3: Personal Styling (`svc-styling`) | Стайлинг
  - L3: Personal Shopping (`svc-personal-shopping`) | Личен асистент пазаруване
  - L3: Life Coaching (`svc-life-coaching`) | Лайф коучинг

**18. Pet Services** (`pet-services`) 🐾
- L2: Pet Grooming (`svc-pet-grooming`) | Грууминг за домашни любимци
- L2: Pet Sitting (`svc-pet-sitting`) | Гледане на домашни любимци
- L2: Dog Walking (`svc-dog-walking`) | Разходка на кучета
- L2: Pet Training (`svc-pet-training`) | Обучение на домашни любимци
- L2: Pet Photography (`svc-pet-photography`) | Фотография на любимци
- L2: Pet Transport (`svc-pet-transport`) | Транспорт на домашни любимци

**19. Events & Entertainment** (`events-entertainment`) 🎉
- L2: Event Planning (`svc-event-planning`)
  - L3: Corporate Events (`svc-corporate-events`) | Корпоративни събития
  - L3: Birthday Parties (`svc-birthday-parties`) | Рождени дни
  - L3: Graduation Parties (`svc-graduation`) | Абитуриентски балове
  - L3: Baby Showers (`svc-baby-showers`) | Baby Shower
- L2: Entertainment Services (`svc-entertainment`)
  - L3: DJs (`svc-djs`) | DJ услуги
  - L3: Musicians (`svc-musicians`) | Музиканти
  - L3: Magicians (`svc-magicians`) | Фокусници
  - L3: Comedians (`svc-comedians`) | Комедианти
  - L3: Dancers (`svc-dancers`) | Танцьори
- L2: Event Rentals (`svc-event-rentals`)
  - L3: Tent Rentals (`svc-tent-rentals`) | Наем на шатри
  - L3: Furniture Rentals (`svc-furniture-rentals`) | Наем на мебели
  - L3: Equipment Rentals (`svc-equipment-rentals`) | Наем на оборудване
  - L3: Decor Rentals (`svc-decor-rentals`) | Наем на декорация

**20. Tickets & Events** (`tickets`) 🎟️
- L2: Concert Tickets (`concert-tickets`) | Билети за концерти
- L2: Sports Tickets (`sports-tickets`) | Билети за спорт
- L2: Theater Tickets (`theater-tickets`) | Билети за театър
- L2: Festival Passes (`festival-passes`) | Фестивални пропуски
- L2: Experience Tickets (`experience-tickets`) | Билети за преживявания

**21. Gift Cards** (`gift-cards`) 🎁
- L2: Retail Gift Cards (`retail-gift-cards`) | Подаръчни карти за магазини
- L2: Restaurant Gift Cards (`restaurant-gift-cards`) | Подаръчни карти за ресторанти
- L2: Entertainment Cards (`entertainment-cards`) | Развлекателни карти
- L2: Travel Gift Cards (`travel-gift-cards`) | Пътнически подаръчни карти
- L2: Experience Gifts (`experience-gifts`) | Преживявания като подарък

**22. Professional Services** (`professional-services`) 💼
- L2: Notary Services (`svc-notary`) | Нотариални услуги
- L2: Real Estate Services (`svc-realestate-services`) | Имотни услуги
- L2: Architectural Services (`svc-architectural`) | Архитектурни услуги
- L2: Interior Design (`svc-interior-design`) | Интериорен дизайн
- L2: Engineering Services (`svc-engineering`) | Инженерни услуги

**23. Lessons & Classes** (`lessons-classes`) 📖
- L2: Sports Lessons (`svc-sports-lessons`)
  - L3: Swimming Lessons (`svc-swimming-lessons`) | Уроци по плуване
  - L3: Tennis Lessons (`svc-tennis-lessons`) | Уроци по тенис
  - L3: Golf Lessons (`svc-golf-lessons`) | Уроци по голф
  - L3: Martial Arts (`svc-martial-arts`) | Бойни изкуства
- L2: Dance Classes (`svc-dance-classes`)
  - L3: Ballroom Dancing (`svc-ballroom`) | Балнни танци
  - L3: Latin Dancing (`svc-latin-dance`) | Латино танци
  - L3: Folk Dancing (`svc-folk-dance`) | Народни танци
- L2: Art Classes (`svc-art-classes`)
  - L3: Painting Classes (`svc-painting-class`) | Рисуване
  - L3: Pottery Classes (`svc-pottery`) | Грънчарство
  - L3: Photography Classes (`svc-photo-class`) | Фотография

---

#### Services & Events Attributes (70 Total)

**Core Service Attributes:**
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| Service Type | Тип услуга | select | Individual, Business, Both |
| Provider Type | Тип доставчик | select | Individual, Company, Freelancer, Agency |
| Experience | Опит | select | <1 year, 1-3 years, 3-5 years, 5-10 years, 10+ years |
| Certifications | Сертификати | text | - |
| Insurance | Застраховка | select | Yes, No, Upon Request |
| Business Registration | Бизнес регистрация | select | Registered Company, Sole Proprietor, Individual |

**Availability & Location:**
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| Availability | Наличност | select | Available Now, This Week, Next Week, By Appointment, Weekends Only |
| Working Days | Работни дни | multiselect | Monday-Sunday |
| Working Hours | Работно време | select | Morning, Afternoon, Evening, Full Day, Flexible, 24 Hours |
| Response Time | Време за отговор | select | Within 1 hour, Same Day, 24 hours, 48 hours, Within a week |
| Service Location | Място на услугата | select | On-Site, Provider Location, Remote, Both, Mobile |
| Service Area | Район на обслужване | select | Sofia Only, Sofia Region, Nationwide, International |
| Travel Radius (km) | Радиус на пътуване | select | 5km, 10km, 20km, 50km, 100km, Unlimited |
| City Coverage | Покритие по градове | multiselect | Sofia, Plovdiv, Varna, Burgas, Ruse, + 6 more |

**Pricing & Booking:**
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| Pricing Type | Тип на цената | select | Fixed, Hourly, Daily, Per Project, Per sqm, Quote Required |
| Minimum Price | Минимална цена | number | - |
| Maximum Price | Максимална цена | number | - |
| Call-Out Fee | Такса за излизане | number | - |
| Consultation Fee | Такса за консултация | select | Free, Paid-Deducted, Paid-Non-refundable |
| Deposit Required | Изисква се депозит | select | No, 10%, 20%, 30%, 50%, Full Upfront |
| Minimum Booking | Минимална резервация | select | No Minimum, 1 Hour, 2 Hours, Half Day, Full Day |
| Cancellation Policy | Политика за отказ | select | Free, 24h Notice, 48h Notice, Non-refundable |
| Payment Methods | Методи на плащане | multiselect | Cash, Bank Transfer, Card, PayPal, ePay, Revolut, Invoice |
| Booking Method | Метод на резервация | multiselect | Phone, WhatsApp, Viber, Email, Online, Walk-in |

**Professional Credentials:**
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| License Number | Номер на лиценз | text | - |
| Languages Spoken | Езици | multiselect | Bulgarian, English, German, Russian, French, +5 more |
| VAT Registered | Регистрация по ДДС | select | Yes, No |
| Invoice Available | Издава фактура | select | Yes, No, Upon Request |
| Years in Business | Години в бизнеса | select | <1 year, 1-2 years, 3-5 years, 5-10 years, 10-20 years, 20+ years |
| Team Size | Размер на екипа | select | Solo, 2-5, 6-10, 11-25, 26-50, 50+ |
| Rating | Рейтинг | select | 5 Stars, 4+, 3+, New Provider |
| Reviews Count | Брой отзиви | number | - |
| Portfolio URL | URL на портфолио | text | - |
| Website | Уебсайт | text | - |

**Event & Wedding Specific:**
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| Event Type | Тип събитие | multiselect | Wedding, Birthday, Corporate, Conference, Concert, +10 more |
| Event Capacity | Капацитет | select | Up to 20, 21-50, 51-100, 101-200, 201-500, 500+ |
| Event Duration | Продължителност | select | 1-2 hours, 3-4 hours, Half day, Full day, Multi-day |
| Venue Type | Тип на мястото | multiselect | Indoor, Outdoor, Hotel, Restaurant, Garden, Beach, Castle |
| Catering Included | Кетъринг включен | select | Yes-Full, Yes-Partial, No, Optional, External Allowed |
| Wedding Style | Стил на сватбата | multiselect | Traditional Bulgarian, Modern, Rustic, Classic, Beach, Destination |
| Guest Count Range | Брой гости | select | Intimate (30), Small (60), Medium (100), Large (150), Grand (250+) |
| Wedding Packages | Сватбени пакети | multiselect | Basic, Standard, Premium, All-Inclusive, Custom |
| Wedding Services | Сватбени услуги | multiselect | Planning, Coordination, Decor, Photography, Video, DJ, Catering |

**Service-Type Specific:**
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| Cleaning Type | Тип почистване | multiselect | Regular, Deep, Move-in/out, Post-Construction, Commercial |
| Property Type | Тип имот | multiselect | Apartment, House, Villa, Office, Commercial, Industrial |
| Property Size | Размер на имота | select | Up to 50 sqm, 51-100, 101-150, 151-200, 200+ sqm |
| Cleaning Supplies | Материали | select | Provided by Cleaner, Provided by Client, Both, Eco-Friendly |
| Construction Type | Тип строителство | multiselect | New, Renovation, Remodeling, Restoration, Demolition |
| Specialization | Специализация | multiselect | Plumbing, Electrical, HVAC, Roofing, Flooring, +10 more |
| Project Scale | Мащаб на проекта | select | Small (<1000 BGN), Medium, Large, Major, Enterprise |
| Warranty Offered | Гаранция | select | No, 6 Months, 1 Year, 2 Years, 5 Years, Lifetime |
| Vehicle Types Serviced | Превозни средства | multiselect | Cars, SUV, Vans, Trucks, Motorcycles, Electric, Hybrid |
| Auto Service Type | Автоуслуги | multiselect | Oil Change, Brakes, Tires, Engine, AC, Diagnostics, GTP |
| Brand Specialization | Специализация | multiselect | All Brands, German, Japanese, French, Italian, American |
| Tech Service Type | IT услуги | multiselect | Repair, Web Dev, Mobile Dev, Network, Data Recovery, Support |
| Technologies | Технологии | multiselect | Windows, macOS, Linux, iOS, Android, WordPress, React, +10 more |
| Support Type | Тип поддръжка | multiselect | Remote, On-Site, Phone, Email, Chat, 24/7 |

**Education & Wellness:**
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| Subject Area | Предмет | multiselect | Math, Physics, Chemistry, Bulgarian, English, German, +10 more |
| Student Level | Ниво | multiselect | Preschool, Primary, Middle School, High School, University, Adult |
| Teaching Method | Метод | multiselect | One-on-One, Group, Online Live, Pre-recorded, Hybrid |
| Wellness Service Type | Уелнес услуга | multiselect | Massage, Yoga, Personal Training, Nutrition, Meditation |
| Qualification Level | Квалификация | select | Certified, Licensed, Master, Student, Self-Taught |

**Bulgarian Market Specific:**
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| Contract Type | Тип договор | select | Service Agreement, Work Contract, Freelance, One-time, Subscription |
| Bulgarian Certifications | Български сертификати | multiselect | BULSTAT, Trade Register, Chamber Member, ISO, Health Permit |
| Emergency Service | Спешна услуга | select | Yes 24/7, Yes Daytime, Yes Extra Charge, No |
| Service Contract | Договор за услуга | select | Written Contract, Oral Agreement, Invoice Only, Website Terms |
| Verified Provider | Проверен доставчик | select | Verified, Pending, Not Verified |

> **Implementation Notes:**
> - **Total Categories:** 481 (1 L0 + 23 L1 + 238 L2 + 219 L3)
> - **Total Attributes:** 70 bilingual attributes
> - **UUID Pattern:** L1: `b1c2d3e4-1111-*`, L2: `b1c2d3e4-200X-*`, L3: `b1c2d3e4-300X-*`
> - **Bulgarian Market Focus:** Bulgarian certifications (BULSTAT, Trade Register), local payment methods (ePay, Revolut), Bulgarian cities coverage
> - **Event Focus:** Comprehensive wedding planning attributes following Bulgarian traditions

---

### 💿 18. SOFTWARE (`software`)
**Database Stats:** L0: 1 | L1: 15 | L2: 149 | L3: 446 | **Total: 611 categories** | **75 attributes**
**L0 ID:** `659a9e6a-4034-403c-bc58-6185d1ee991d`
**Expansion Date:** December 4, 2025
**References:** Steam, G2A, Kinguin, CDKeys, Microsoft Store, Adobe, JetBrains, emag.bg, technopolis.bg

#### L1 Subcategories (15):

**1. Operating Systems** (`operating-systems`) 💻
- L2: Windows (`os-windows`)
  - L3: Windows 11 | Windows 10 | Windows 11 Pro | Windows 10 Pro | Windows Home | Windows Enterprise | Windows Education
- L2: macOS (`os-macos`)
  - L3: macOS Sequoia | macOS Sonoma | macOS Ventura | macOS Monterey | macOS Server
- L2: Linux Distributions (`os-linux`)
  - L3: Ubuntu | Fedora | Debian | Linux Mint | CentOS/Rocky | Arch Linux | openSUSE | Pop!_OS
- L2: Server Operating Systems (`os-server`)
  - L3: Windows Server 2022 | Windows Server 2019 | Red Hat Enterprise Linux | Ubuntu Server | VMware ESXi | Proxmox VE
- L2: Mobile OS (`os-mobile`)
- L2: Chrome OS (`os-chromeos`)
- L2: Legacy & Retro OS (`os-legacy`)

**2. Office Software** (`office-software`) 📊
- L2: Office Suites (`office-suites`)
  - L3: Microsoft 365 | Microsoft Office 2024 | Microsoft Office 2021 | LibreOffice | WPS Office | Google Workspace | Zoho Workplace
- L2: Word Processors (`office-word`)
- L2: Spreadsheet Software (`office-spreadsheet`)
- L2: Presentation Software (`office-presentation`)
- L2: Note-Taking Apps (`office-notes`)
  - L3: Notion | Evernote | OneNote | Obsidian | Roam Research | Bear Notes
- L2: PDF Tools (`office-pdf`)
  - L3: Adobe Acrobat | PDF Editors | PDF Converters | PDF Viewers | PDF Merger/Splitter | OCR Software | Digital Signatures
- L2: Email Clients (`office-email`)
- L2: Calendar & Scheduling (`office-calendar`)
- L2: Project Management (`office-project`)
  - L3: Microsoft Project | Jira | Asana | Monday.com | Trello | ClickUp | Basecamp
- L2: Mind Mapping (`office-mindmap`)

**3. Security Software** (`security-software`) 🛡️
- L2: Antivirus Software (`security-antivirus`)
  - L3: Norton | Kaspersky | Bitdefender | McAfee | ESET NOD32 | Avast | AVG | Windows Defender
- L2: Internet Security Suites (`security-internet`)
  - L3: Total Security Suites | Web Protection | Email Protection | Safe Banking | Multi-device Protection
- L2: VPN Services (`security-vpn`)
  - L3: NordVPN | ExpressVPN | Surfshark | CyberGhost | ProtonVPN | Private Internet Access | Mullvad VPN
- L2: Password Managers (`security-passwords`)
  - L3: LastPass | 1Password | Bitwarden | Dashlane | Keeper | NordPass
- L2: Encryption Software (`security-encryption`)
  - L3: File Encryption | Disk Encryption | Email Encryption | USB Encryption | Cloud Encryption
- L2: Firewall Software (`security-firewall`)
- L2: Parental Controls (`security-parental`)
  - L3: Screen Time Management | Content Filtering | Location Tracking | App Controls | Social Media Monitoring
- L2: Anti-Malware Tools (`security-malware`)
- L2: Privacy Protection (`security-privacy`)
- L2: Identity Protection (`security-identity`)

**4. Creative Software** (`creative-software`) 🎨
- L2: Photo Editing (`creative-photo`)
  - L3: Adobe Photoshop | Adobe Lightroom | Affinity Photo | Capture One | GIMP | Luminar | DxO PhotoLab | AI Photo Enhancers
- L2: Video Editing (`creative-video`)
  - L3: Adobe Premiere Pro | DaVinci Resolve | Final Cut Pro | Vegas Pro | Filmora | Adobe After Effects | Camtasia | AI Video Editors
- L2: Graphic Design (`creative-graphic`)
  - L3: Adobe Illustrator | CorelDRAW | Affinity Designer | Canva Pro | Figma | Sketch | InVision | Adobe InDesign
- L2: 3D Modeling & Animation (`creative-3d`)
  - L3: Autodesk Maya | 3ds Max | Blender | Cinema 4D | ZBrush | SketchUp | Houdini | AI 3D Generators
- L2: CAD Software (`creative-cad`)
  - L3: AutoCAD | SolidWorks | Fusion 360 | CATIA | Inventor | FreeCAD | Rhino
- L2: Audio Production (`creative-audio`)
  - L3: Pro Tools | FL Studio | Ableton Live | Logic Pro | Cubase | Audacity | Adobe Audition | AI Music Generators
- L2: Digital Drawing (`creative-drawing`)
- L2: UI/UX Design (`creative-uiux`)
- L2: Motion Graphics (`creative-motion`)
- L2: Typography & Fonts (`creative-fonts`)
- L2: AI Creative Tools (`creative-ai`) 🤖
  - L3: Midjourney | DALL-E | Stable Diffusion | Adobe Firefly | RunwayML | AI Upscalers | AI Background Removers

**5. Games & Entertainment** (`games-software`) 🎮
- L2: Action Games (`games-action`)
  - L3: First-Person Shooters | Third-Person Shooters | Battle Royale | Hack and Slash | Fighting Games | Stealth Games
- L2: RPG Games (`games-rpg`)
  - L3: Action RPG | JRPG | Western RPG | Turn-Based RPG | Open World RPG | Roguelike
- L2: Strategy Games (`games-strategy`)
  - L3: Real-Time Strategy | Turn-Based Strategy | 4X Strategy | Tower Defense | Grand Strategy | MOBA
- L2: Simulation Games (`games-simulation`)
  - L3: Life Simulation | City Builders | Farming Simulation | Flight Simulation | Vehicle Simulation | Management Simulation
- L2: Sports & Racing (`games-sports`)
  - L3: Racing Games | Football/Soccer | Basketball | Combat Sports | Extreme Sports | Golf & Tennis
- L2: Adventure Games (`games-adventure`)
- L2: Puzzle Games (`games-puzzle`)
- L2: Indie Games (`games-indie`)
- L2: VR Games (`games-vr`)
- L2: MMO Games (`games-mmo`)
- L2: Horror Games (`games-horror`)
- L2: Game Subscriptions (`games-subscriptions`)
  - L3: Xbox Game Pass | PlayStation Plus | EA Play | Ubisoft+ | Nintendo Switch Online | Humble Bundle
- L2: Gaming Utilities (`games-utilities`)
- L2: Emulators (`games-emulators`)
- L2: Game Streaming (`games-streaming`)

**6. Web & Development** (`web-development`) 👨‍💻
- L2: IDEs & Code Editors (`dev-ide`)
  - L3: Visual Studio | VS Code | JetBrains IDEs | Xcode | Android Studio | Eclipse | Cloud IDEs | Code Editors
- L2: Version Control (`dev-vcs`)
  - L3: GitHub | GitLab | Bitbucket | Azure DevOps | Git Clients
- L2: Database Tools (`dev-database`)
  - L3: SQL Clients | NoSQL Tools | Database Design | Data Migration | Database Monitoring | Backup & Recovery
- L2: API Development (`dev-api`)
  - L3: Postman & API Clients | API Documentation | API Mocking | GraphQL Tools | REST Tools
- L2: Testing & QA (`dev-testing`)
  - L3: Unit Testing | End-to-End Testing | Load Testing | Security Testing | Bug Tracking | Test Management
- L2: Web Frameworks (`dev-frameworks`)
- L2: DevOps Tools (`dev-devops`)
  - L3: CI/CD Tools | Container Tools | Infrastructure as Code | Monitoring & Logging | Configuration Management
- L2: Documentation Tools (`dev-docs`)
- L2: CMS Platforms (`dev-cms`)
  - L3: WordPress | Drupal | Joomla | Ghost | Strapi | Contentful
- L2: E-commerce Platforms (`dev-ecommerce`)
  - L3: Shopify | WooCommerce | Magento | BigCommerce | PrestaShop | OpenCart
- L2: Website Builders (`dev-builders`)
  - L3: Wix | Squarespace | Webflow | Weebly | Framer | Carrd
- L2: SEO & Analytics (`dev-seo`)
  - L3: Google Analytics | SEMrush | Ahrefs | Moz | Screaming Frog | Hotjar

**7. Utilities & System Tools** (`utilities-system`) 🔧
- L2: Backup & Recovery (`util-backup`)
  - L3: Acronis True Image | EaseUS Todo | Macrium Reflect | Veeam | Carbonite | Backblaze
- L2: Disk Management (`util-disk`)
  - L3: Partition Managers | Disk Cloning | SSD Tools | Defragmenters | Disk Cleanup
- L2: System Optimization (`util-optimize`)
  - L3: CCleaner | IObit Advanced | Glary Utilities | Registry Cleaners | Memory Optimizers | Startup Managers
- L2: File Recovery (`util-recovery`)
- L2: Driver Management (`util-drivers`)
- L2: Uninstallers (`util-uninstall`)
- L2: File Managers (`util-files`)
- L2: Compression Tools (`util-compress`)
  - L3: WinRAR | 7-Zip | WinZip | PeaZip | Bandizip
- L2: System Monitoring (`util-monitor`)
- L2: Clipboard Managers (`util-clipboard`)
- L2: Remote Access (`util-remote`)
  - L3: TeamViewer | AnyDesk | LogMeIn | Chrome Remote Desktop | Parsec | RustDesk
- L2: Automation Tools (`util-automation`)

**8. Business Software** (`business-software`) 💼
- L2: Accounting Software (`biz-accounting`)
  - L3: Personal Finance | Small Business Accounting | Enterprise Accounting | Tax Software | Payroll Software | Bulgarian Accounting
- L2: CRM Software (`biz-crm`)
  - L3: Salesforce | HubSpot | Zoho CRM | Pipedrive | Microsoft Dynamics | Monday CRM
- L2: ERP Systems (`biz-erp`)
- L2: Invoicing & Billing (`biz-invoicing`)
  - L3: FreshBooks | QuickBooks | Wave | Xero | Bulgarian Invoicing | E-invoicing Solutions
- L2: HR Management (`biz-hr`)
- L2: Inventory Management (`biz-inventory`)
- L2: Point of Sale (POS) (`biz-pos`)
- L2: Legal & Compliance (`biz-legal`)
- L2: Business Intelligence (`biz-bi`)
- L2: Time Tracking (`biz-time`)

**9. Educational Software** (`educational-software`) 📚
- L2: E-Learning Platforms (`edu-elearning`)
  - L3: Coursera | Udemy | LinkedIn Learning | Skillshare | MasterClass | Pluralsight
- L2: Language Learning (`edu-language`)
  - L3: Duolingo | Babbel | Rosetta Stone | Pimsleur | Busuu | Bulgarian Language
- L2: Coding & Programming (`edu-coding`)
  - L3: Codecademy | freeCodeCamp | DataCamp | Treehouse | Frontend Masters | LeetCode Premium
- L2: Math & Science (`edu-math`)
- L2: Kids Education (`edu-kids`)
  - L3: ABCmouse | Khan Academy Kids | Scratch | Typing Games | Math Games | Reading Apps
- L2: Exam Preparation (`edu-exams`)
- L2: Typing & Skills (`edu-typing`)
- L2: Music & Art Education (`edu-music`)
- L2: Reference & Encyclopedia (`edu-reference`)
- L2: Professional Training (`edu-professional`)

**10. AI & Machine Learning** (`ai-machine-learning`) 🤖 ⭐ **KEY CATEGORY FOR AI-GENERATED CONTENT**
- L2: AI Assistants & Chatbots (`ai-assistants`)
  - L3: ChatGPT Plus | Claude Pro | Gemini Advanced | Microsoft Copilot | Perplexity AI | Custom AI Assistants | AI-Powered Search
- L2: AI Image Generation (`ai-image-gen`)
  - L3: Midjourney Subscriptions | DALL-E Credits | Stable Diffusion Tools | AI Art Generators | AI Portrait Tools | AI Logo Generators | AI Stock Images
- L2: AI Video & Animation (`ai-video`)
  - L3: AI Video Generators | AI Animation Tools | AI Video Editing | AI Avatar Creators | Deepfake Tools | AI Lip Sync
- L2: AI Audio & Music (`ai-audio`)
  - L3: AI Music Generators | AI Voice Cloning | Text-to-Speech AI | Speech-to-Text AI | AI Podcast Tools | AI Sound Effects
- L2: AI Writing & Content (`ai-writing`)
  - L3: AI Copywriting | AI Blog Writers | AI SEO Content | AI Translation | AI Grammar Tools | AI Story Generators | AI Email Writers
- L2: AI Code Generation (`ai-code`)
  - L3: GitHub Copilot | Cursor IDE | Tabnine | Codeium | Amazon CodeWhisperer | AI Code Review | AI Debugging Tools
- L2: ML Platforms & Frameworks (`ai-ml-platforms`)
  - L3: TensorFlow Tools | PyTorch Tools | AWS ML Services | Google Cloud AI | Azure AI Services | Hugging Face
- L2: Data Science Tools (`ai-data-science`)
  - L3: Jupyter Notebooks | Data Visualization | Data Cleaning Tools | Big Data Tools | ETL Tools
- L2: Automation & RPA (`ai-automation`)
  - L3: Zapier | Make (Integromat) | UiPath | Power Automate | Automation Anywhere | n8n
- L2: AI Development SDKs (`ai-sdks`)
- L2: AI-Generated Content Marketplace (`ai-marketplace`) 🛒
  - L3: AI-Generated Art Sales | AI-Generated Music | AI-Generated Content Packs | AI Prompts & Templates | AI Models & Fine-tunes | AI-Generated Videos
- L2: AI Training & Datasets (`ai-datasets`)

**11. Mobile Apps** (`mobile-apps`) 📱
- L2: Android Apps (`mobile-android`)
  - L3: Android Productivity | Android Entertainment | Android Tools | Android Photo & Video | Android Health
- L2: iOS Apps (`mobile-ios`)
  - L3: iOS Productivity | iOS Entertainment | iOS Tools | iOS Photo & Video | iOS Health
- L2: Cross-Platform Apps (`mobile-cross`)
- L2: App Subscriptions (`mobile-subs`)
- L2: Mobile Productivity (`mobile-productivity`)
- L2: Mobile Games (`mobile-games`)
  - L3: Mobile Puzzle Games | Mobile Action Games | Mobile Strategy | Mobile Racing | Mobile Casual
- L2: Social & Communication (`mobile-social`)
- L2: Health & Fitness Apps (`mobile-health`)

**12. Cloud Services & SaaS** (`cloud-saas`) ☁️
- L2: Cloud Storage (`cloud-storage`)
  - L3: Google Drive | Dropbox | OneDrive | iCloud | pCloud | MEGA
- L2: Web Hosting (`cloud-hosting`)
  - L3: Shared Hosting | VPS Hosting | Dedicated Servers | Cloud Hosting | WordPress Hosting | Bulgarian Hosting
- L2: Email Hosting (`cloud-email`)
- L2: Domain Services (`cloud-domains`)
- L2: Cloud Computing (`cloud-computing`)
  - L3: AWS | Google Cloud | Microsoft Azure | DigitalOcean | Linode | Vultr
- L2: CDN Services (`cloud-cdn`)
- L2: SaaS Subscriptions (`cloud-saas-subs`)
- L2: Database Hosting (`cloud-database`)

**13. Multimedia Software** (`multimedia-software`) 🎬
- L2: Media Players (`media-players`)
  - L3: VLC Media Player | PotPlayer | MPC-HC | Plex | Kodi
- L2: Video Converters (`media-converters`)
  - L3: HandBrake | FFmpeg Tools | Wondershare | Format Factory | Any Video Converter
- L2: Screen Recorders (`media-screen-rec`)
  - L3: OBS Studio | Camtasia | Bandicam | ScreenPal | ShareX | Loom
- L2: DVD & Blu-ray Software (`media-dvd`)
- L2: Codecs & Plugins (`media-codecs`)
- L2: Streaming Software (`media-streaming`)
- L2: Audio Players (`media-audio`)
- L2: Photo Viewers (`media-photo`)

**14. Scientific & Engineering** (`scientific-engineering`) 🔬
- L2: MATLAB & Alternatives (`sci-matlab`)
  - L3: MATLAB | GNU Octave | Mathematica | Maple | SciPy Tools
- L2: CAE & Simulation (`sci-cae`)
- L2: GIS & Mapping (`sci-gis`)
  - L3: ArcGIS | QGIS | Google Earth Pro | MapInfo | AutoCAD Map
- L2: Statistical Analysis (`sci-statistics`)
  - L3: SPSS | SAS | Stata | R Studio | JMP | Minitab
- L2: Laboratory Software (`sci-lab`)
- L2: Electronic Design (`sci-electronics`)
- L2: Chemical Software (`sci-chemistry`)
- L2: Bioinformatics (`sci-bio`)

**15. Communication & Collaboration** (`communication-collab`) 💬
- L2: Video Conferencing (`comm-video`)
  - L3: Zoom | Microsoft Teams | Google Meet | Webex | GoToMeeting
- L2: Team Chat (`comm-chat`)
  - L3: Slack | Microsoft Teams Chat | Discord | Telegram Business | Mattermost
- L2: Email Management (`comm-email`)
- L2: Remote Desktop (`comm-remote`)
- L2: Screen Sharing (`comm-screen`)
- L2: VoIP & Calling (`comm-voip`)
- L2: Webinar Platforms (`comm-webinar`)
- L2: File Sharing (`comm-files`)

---

#### SOFTWARE Attributes (75 Total - All Bilingual)

**License & Pricing (7):**
1. License Type | Тип лиценз - `select` [Perpetual, Subscription, Freemium, Open Source, Trial, OEM, Volume, Educational, NFR, Site License]
2. Subscription Period | Период на абонамент - `select` [Monthly, Quarterly, 6 Months, Annual, 2 Years, 3 Years, Lifetime, One-time]
3. License Seats | Брой лицензи - `select` [Single User 1PC/3PC/5PC, Family, Small Team, Business, Enterprise, Unlimited, Per Seat]
4. Activation Method | Метод на активиране - `select` [License Key, Online Account, Hardware Dongle, Phone, Email, Auto, Offline, None]
5. Price | Цена - `number`
6. Original Price | Оригинална цена - `number`
7. Discount Percentage | Процент отстъпка - `number`

**Platform & Compatibility (9):**
8. Platform | Платформа - `multiselect` [Windows, macOS, Linux, iOS, Android, Web Browser, Chrome OS, Cross-Platform, Universal]
9. Windows Versions | Версии на Windows - `multiselect` [Windows 11, 10, 8.1, 7, Server 2022/2019/2016]
10. macOS Versions | Версии на macOS - `multiselect` [Sequoia, Sonoma, Ventura, Monterey, Big Sur, Catalina]
11. Architecture | Архитектура - `multiselect` [64-bit, 32-bit, ARM64, Apple Silicon, Universal Binary]
12. Minimum RAM | Минимална RAM - `select` [1GB-64GB]
13. Minimum Storage | Минимално пространство - `select` [100MB-100GB+]
14. GPU Required | Изисква се GPU - `select` [No, Integrated OK, Dedicated Recommended, NVIDIA/AMD/CUDA Required]
15. Browser Compatibility | Съвместимост с браузъри - `multiselect` [Chrome, Firefox, Edge, Safari, Opera, Brave, All Modern]
16. Internet Required | Изисква се интернет - `select` [No, For Activation, For Updates, Always Online, Partial/Full Offline]

**Product Details (9):**
17. Software Version | Версия на софтуера - `text`
18. Release Year | Година на издаване - `select` [2018-2025+]
19. Edition | Издание - `select` [Free, Home, Personal, Standard, Pro, Business, Enterprise, Ultimate, Student, Developer]
20. Developer/Publisher | Разработчик/Издател - `text`
21. Brand | Марка - `text`
22. Language Support | Езикова поддръжка - `multiselect` [English, Bulgarian, German, French, Spanish, Russian, Chinese, Japanese, Multilingual]
23. Bulgarian Interface | Български интерфейс - `select` [Full, Partial, English Only, Language Pack]
24. Download Size | Размер за изтегляне - `text`
25. Product Code/SKU | Продуктов код/SKU - `text`

**Delivery & Support (6):**
26. Delivery Method | Метод на доставка - `select` [Digital Download, License Key Only, Physical DVD/USB, Cloud Access, Instant Email, Account Credentials]
27. Support Level | Ниво на поддръжка - `select` [Community, Email, Phone, Live Chat, 24/7, Priority, Dedicated Manager, None]
28. Update Policy | Политика за актуализации - `select` [Free Lifetime, Free 1 Year, Free Subscription, Major Paid, No Updates, Auto/Manual]
29. Documentation | Документация - `multiselect` [Online Help, PDF Manual, Video Tutorials, Knowledge Base, Forum, In-App, Quick Start, API Docs]
30. Warranty/Guarantee | Гаранция - `select` [30/60/90-Day Money Back, No Refunds, Satisfaction Guarantee, As-Is]
31. Technical Support Duration | Продължителност на поддръжка - `select` [90 Days, 1-3 Years, Subscription Duration, Lifetime, None]

**Features & Capabilities (8):**
32. Key Features | Основни функции - `multiselect` [Cloud Sync, Collaboration, Offline Mode, Dark Mode, Mobile App, API, Plugins, Templates, AI Features]
33. Cloud Sync | Облачна синхронизация - `select` [Yes Included, Yes Optional, Third-Party, No]
34. Offline Mode | Офлайн режим - `select` [Full, Limited, Online Only, After Setup]
35. Plugin/Extension Support | Поддръжка на плъгини - `select` [Yes Large Ecosystem, Yes Limited, Third-Party, No]
36. API Access | API достъп - `select` [Full REST, Limited, GraphQL, Webhooks, SDK, No]
37. Third-Party Integrations | Интеграции - `multiselect` [Google Workspace, Microsoft 365, Slack, Zapier, Dropbox, Salesforce, GitHub, Jira, etc.]
38. Collaboration Features | Функции за сътрудничество - `multiselect` [Real-time Editing, Comments, Version History, Permissions, Team Workspaces, Guest Access]
39. Security Features | Функции за сигурност - `multiselect` [2FA, SSO/SAML, Encryption, HIPAA, SOC 2, GDPR, Password Protection, Role-Based Access]

**Business/Bulgarian-Specific (6):**
40. Invoice Available | Фактура - `select` [Yes Bulgarian, Yes EU, Yes International, No]
41. VAT Included | ДДС включено - `select` [Yes 20%, No VAT Extra, VAT Exempt, Reverse Charge]
42. Local Support | Локална поддръжка - `select` [Bulgarian, EU Only, International Only, None]
43. GDPR Compliant | GDPR съвместим - `select` [Fully, Partial, Not Applicable, Unknown]
44. License Region | Регион на лиценза - `select` [Global, Europe, EU, Bulgaria, USA, Region Locked, No Restrictions]
45. Payment Methods | Методи на плащане - `multiselect` [Credit Card, PayPal, Bank Transfer, ePay.bg, EasyPay, Cash on Delivery, Crypto]

**AI-Specific (4):** ⭐ **NEW FOR AI MARKETPLACE**
46. AI-Generated | Генерирано от AI - `select` [Not AI, Partially, Fully, AI-Assisted, AI Model/Training Data]
47. AI Technology Used | Използвана AI технология - `multiselect` [GPT-4, GPT-3.5, Claude, Gemini, DALL-E, Midjourney, Stable Diffusion, LLaMA, Custom AI, ML, Deep Learning, NLP]
48. AI Features Included | Включени AI функции - `multiselect` [AI Chat, AI Image Gen, AI Writing, AI Code, AI Translation, AI Voice, AI Video, AI Music, AI Upscaling, AI Background Removal]
49. AI Credits/Usage | AI кредити/Употреба - `select` [Unlimited, Monthly Credits, Pay Per Use, Limited Free, Credits Separate, N/A]

**Gaming-Specific (5):**
50. Game Genre | Жанр на играта - `multiselect` [Action, Adventure, RPG, Strategy, Simulation, Sports, Racing, Puzzle, Horror, Shooter, MMO, Indie, VR, Battle Royale]
51. Game Platform | Платформа за игри - `multiselect` [Steam, Epic Games, GOG, Origin/EA, Ubisoft, Battle.net, Xbox/Microsoft Store, PlayStation, Nintendo, Standalone, Web]
52. Multiplayer | Мултиплейър - `select` [Single Player, Local Co-op, Online Co-op, Competitive, MMO, Split Screen, Cross-Platform]
53. Game Age Rating | Възрастова оценка - `select` [PEGI 3/7/12/16/18, ESRB E/E10+/T/M/AO, Not Rated]
54. DRM | DRM защита - `select` [DRM-Free, Steam, Denuvo, Origin, Ubisoft, Epic, Microsoft, Other]

**Additional (6):**
55. Trial Available | Пробен период - `select` [7/14/30 Days, Limited Features, Demo, Free Tier, No Trial]
56. Upgrade Path | Път за надграждане - `select` [Available, Competitive Upgrade, Cross-Grade, No Upgrades, Auto-Upgrades]
57. Training/Certification | Обучение/Сертификация - `multiselect` [Free Courses, Paid Courses, Official Certification, YouTube, Community, None]
58. Condition | Състояние - `select` [New Unused Key, New Sealed Physical, Used Working Key, Used Previously Activated, Bundle Key, Promotional]
59. Source/Origin | Произход - `select` [Official Retailer, Authorized Reseller, Key Reseller, Bundle/Humble, Giveaway, Developer Direct, Unknown]
60. Transferable | Прехвърляем - `select` [Fully Transferable, One Transfer, Non-Transferable, Account Bound, Hardware Bound]

**Content Creator (4):**
61. Export Formats | Формати за експорт - `multiselect` [PDF, DOCX, XLSX, PNG, JPG, SVG, PSD, MP4, MOV, MP3, WAV, HTML, JSON, XML, CSV]
62. Import Formats | Формати за импорт - `multiselect` [PDF, DOCX, XLSX, PNG, JPG, RAW, PSD, MP4, MOV, HTML, JSON, XML, CSV]
63. Color Space Support | Цветови пространства - `multiselect` [sRGB, Adobe RGB, ProPhoto RGB, CMYK, Lab Color, Display P3, Rec. 709/2020, DCI-P3]
64. Video Resolution Support | Видео резолюция - `multiselect` [720p, 1080p, 2K, 4K, 6K, 8K, 16K, Custom]

**Education-Specific (4):**
65. Target Audience | Целева аудитория - `multiselect` [Beginners, Intermediate, Advanced, Professionals, Students, Kids, Teens, Seniors, Business, Developers, Designers, Everyone]
66. Difficulty Level | Ниво на трудност - `select` [Very Easy, Easy, Moderate, Difficult, Very Difficult, Expert Only]
67. Learning Hours | Часове обучение - `select` [<1h, 1-5h, 5-10h, 10-20h, 20-50h, 50-100h, 100+h, Self-paced]
68. Certificate Included | Сертификат включен - `select` [Yes Accredited, Yes Completion, Yes Professional, No, Extra Cost]

**Business-Specific (7):**
69. Industry Focus | Индустриален фокус - `multiselect` [General, Healthcare, Finance, Education, Retail, Manufacturing, Technology, Legal, Real Estate, Marketing, Construction]
70. Compliance Standards | Стандарти за съответствие - `multiselect` [GDPR, HIPAA, SOC 2, ISO 27001, PCI DSS, CCPA, FERPA, FedRAMP, NIST]
71. User Capacity | Капацитет потребители - `select` [1-5, 5-10, 10-25, 25-50, 50-100, 100-500, 500-1000, 1000+, Unlimited]
72. Storage Included | Включено пространство - `select` [1-5-10-50-100-500GB, 1-2-5TB, Unlimited, None, Local Only]
73. White Label Available | White Label - `select` [Yes Full, Yes Partial, Enterprise Only, Not Available]
74. Data Export | Експорт на данни - `select` [Full, Limited, API Only, None, On Request]
75. Backup Frequency | Честота на архивиране - `select` [Real-time, Hourly, Daily, Weekly, Monthly, Manual, N/A]

> **Summary:**
> - **Total Categories:** 611 (1 L0 + 15 L1 + 149 L2 + 446 L3)
> - **Total Attributes:** 75 bilingual attributes
> - **AI Marketplace Focus:** Comprehensive AI-Generated content marketplace with dedicated L1 category and 4 AI-specific attributes
> - **Bulgarian Market:** Local invoicing, VAT, payment methods (ePay.bg, EasyPay), Bulgarian interface support
> - **Gaming Integration:** Steam, Epic Games, GOG, PlayStation, Xbox compatibility attributes
> - **Reference Markets:** Steam, G2A, Kinguin, CDKeys, Microsoft Store, Adobe, JetBrains, emag.bg, technopolis.bg

---

### ⚽ 19. SPORTS & OUTDOORS (`sports`)
**Database Stats:** L0: 1 | L1: 15 | L2: 93 | L3: 328 | Total: 437 categories | 80 attributes
**L0 ID:** `7b423774-3be8-43de-989d-7a4253eda995`

#### L1 Subcategories:

**1. Exercise & Fitness** (`fitness`) 🏋️
- L2: Cardio Equipment (`cardio-equipment`)
  - L3: Treadmills (`fit-treadmill`) | Бягащи пътеки
  - L3: Exercise Bikes (`fit-bike`) | Велоергометри
  - L3: Ellipticals (`fit-elliptical`) | Елиптични тренажори
  - L3: Rowing Machines (`fit-rowing`) | Гребни тренажори
  - L3: Stair Climbers (`fit-stair`) | Катерачи
  - L3: Air Bikes (`fit-airbike`) | Въздушни велосипеди
  - L3: Spin Bikes (`fit-spin`) | Спининг велосипеди
  - L3: Under Desk Bikes (`fit-underdesk`) | Велосипеди под бюро
- L2: Strength Training (`strength-training`)
  - L3: Dumbbells & Weights (`fit-weights`) | Дъмбели и тежести
  - L3: Barbells (`fit-barbells`) | Щанги
  - L3: Kettlebells (`fit-kettlebells`) | Гири
  - L3: Weight Benches (`fit-bench`) | Пейки за тежести
  - L3: Power Racks (`fit-rack`) | Силови рамки
  - L3: Cable Machines (`fit-cable`) | Кабелни машини
  - L3: Smith Machines (`fit-smith`) | Машини Смит
  - L3: Weight Plates (`fit-plates`) | Дискове за тежести
- L2: Yoga & Pilates (`fit-yoga`)
  - L3: Yoga Mats (`yoga-mats`) | Постелки за йога
  - L3: Yoga Blocks (`yoga-blocks`) | Блокове за йога
  - L3: Yoga Straps (`yoga-straps`) | Ленти за йога
  - L3: Pilates Reformers (`pilates-reformers`) | Пилатес реформатори
  - L3: Yoga Bolsters (`yoga-bolsters`) | Възглавници за йога
  - L3: Meditation Cushions (`meditation-cushions`) | Възглавници за медитация
- L2: Home Gym (`home-gym`)
  - L3: Multi-Gyms (`home-multigym`) | Мултифункционални фитнеси
  - L3: Pull-up Bars (`home-pullup`) | Лостове за набиране
  - L3: Suspension Trainers (`home-suspension`) | Висящи тренажори
  - L3: Ab Machines (`home-abs`) | Машини за коремни преси
  - L3: Home Gym Flooring (`home-flooring`) | Настилки за домашен фитнес
- L2: Fitness Accessories (`fitness-accessories`)
  - L3: Resistance Bands (`fit-bands`) | Ластици за съпротивление
  - L3: Jump Ropes (`fit-jumprope`) | Въжета за скачане
  - L3: Exercise Balls (`fit-balls`) | Фитнес топки
  - L3: Foam Rollers (`fit-rollers`) | Масажни ролки
  - L3: Fitness Trackers (`fit-trackers`) | Фитнес тракери
  - L3: Workout Gloves (`fit-gloves`) | Ръкавици за тренировка
  - L3: Weight Belts (`fit-belts`) | Колани за тежести

**2. Cycling** (`cycling`) 🚴
- L2: Road Bikes (`bike-road`)
  - L3: Race Bikes (`bike-race`) | Състезателни велосипеди
  - L3: Endurance Bikes (`bike-endurance`) | Велосипеди за издръжливост
  - L3: Aero Bikes (`bike-aero`) | Аеродинамични велосипеди
  - L3: Gravel Bikes (`bike-gravel`) | Гравъл велосипеди
  - L3: Touring Bikes (`bike-touring`) | Туристически велосипеди
- L2: Mountain Bikes (`bike-mountain`)
  - L3: Cross Country (`bike-xc`) | Крос-кънтри
  - L3: Trail Bikes (`bike-trail`) | Трейл велосипеди
  - L3: Enduro Bikes (`bike-enduro`) | Ендуро велосипеди
  - L3: Downhill Bikes (`bike-downhill`) | Даунхил велосипеди
  - L3: Fat Bikes (`bike-fat`) | Фатбайкове
- L2: Electric Bikes (`bike-electric`)
  - L3: E-City Bikes (`ebike-city`) | Електрически градски
  - L3: E-Mountain Bikes (`ebike-mtb`) | Електрически планински
  - L3: E-Road Bikes (`ebike-road`) | Електрически шосейни
  - L3: E-Cargo Bikes (`ebike-cargo`) | Електрически товарни
  - L3: E-Folding Bikes (`ebike-folding`) | Електрически сгъваеми
- L2: City Bikes (`bike-city`)
  - L3: Commuter Bikes (`bike-commuter`) | Велосипеди за ежедневно пътуване
  - L3: Folding Bikes (`bike-folding`) | Сгъваеми велосипеди
  - L3: Dutch Style Bikes (`bike-dutch`) | Холандски велосипеди
  - L3: Cargo Bikes (`bike-cargo`) | Товарни велосипеди
- L2: BMX & Freestyle (`bike-bmx`)
  - L3: BMX Race (`bmx-race`) | BMX състезателни
  - L3: BMX Freestyle (`bmx-freestyle`) | BMX фристайл
  - L3: Dirt Jump (`bmx-dirtjump`) | Дърт джъмп
- L2: Kids Bikes (`bike-kids-cycle`)
  - L3: Balance Bikes (`bike-balance`) | Баланс велосипеди
  - L3: Kids Training Wheels (`bike-training`) | Помощни колела
  - L3: Kids Mountain Bikes (`bike-kids-mtb`) | Детски планински
- L2: Bike Components (`bike-components`)
  - L3: Drivetrains (`comp-drivetrain`) | Задвижвания
  - L3: Brakes (`comp-brakes`) | Спирачки
  - L3: Wheels & Rims (`comp-wheels`) | Колела и джанти
  - L3: Tires & Tubes (`comp-tires`) | Гуми и вътрешни
  - L3: Handlebars & Stems (`comp-handlebars`) | Кормила и лапи
  - L3: Saddles & Seatposts (`comp-saddles`) | Седалки и колчета
  - L3: Pedals (`comp-pedals`) | Педали
  - L3: Forks & Suspension (`comp-forks`) | Вилки и окачване
- L2: Bike Accessories (`bike-accessories`)
  - L3: Helmets (`acc-helmets`) | Каски
  - L3: Lights (`acc-lights`) | Светлини
  - L3: Locks (`acc-locks`) | Ключалки
  - L3: Pumps (`acc-pumps`) | Помпи
  - L3: Bags & Panniers (`acc-bags`) | Чанти и дисаги
  - L3: Phone Mounts (`acc-mounts`) | Стойки за телефон
  - L3: Bike Computers (`acc-computers`) | Велокомпютри
  - L3: Racks & Carriers (`acc-racks`) | Багажници
- L2: Bike Clothing (`bike-clothing`)
  - L3: Jerseys (`cloth-jerseys`) | Тениски
  - L3: Shorts & Bibs (`cloth-shorts`) | Шорти и гащеризони
  - L3: Jackets (`cloth-jackets`) | Якета
  - L3: Gloves (`cloth-gloves`) | Ръкавици
  - L3: Shoes (`cloth-shoes`) | Обувки
  - L3: Glasses (`cloth-glasses`) | Очила

**3. Team Sports** (`team-sports`) ⚽
- L2: Soccer/Football (`team-soccer`)
  - L3: Soccer Balls (`soccer-balls`) | Футболни топки
  - L3: Soccer Cleats (`soccer-cleats`) | Футболни бутонки
  - L3: Soccer Goals (`soccer-goals`) | Футболни врати
  - L3: Soccer Jerseys (`soccer-jerseys`) | Футболни фланелки
  - L3: Shin Guards (`soccer-shinguards`) | Протектори за пищяли
  - L3: Goalkeeper Gear (`soccer-goalkeeper`) | Вратарска екипировка
- L2: Basketball (`team-basketball`)
  - L3: Basketballs (`basketball-balls`) | Баскетболни топки
  - L3: Basketball Shoes (`basketball-shoes`) | Баскетболни обувки
  - L3: Basketball Hoops (`basketball-hoops`) | Баскетболни кошове
  - L3: Basketball Jerseys (`basketball-jerseys`) | Баскетболни екипи
- L2: American Football (`team-american-football`)
  - L3: Footballs (`football-balls`) | Топки за американски футбол
  - L3: Football Helmets (`football-helmets`) | Каски за американски футбол
  - L3: Pads & Protection (`football-pads`) | Протектори
  - L3: Football Gloves (`football-gloves`) | Ръкавици
- L2: Volleyball (`team-volleyball`)
  - L3: Volleyballs (`volleyball-balls`) | Волейболни топки
  - L3: Volleyball Nets (`volleyball-nets`) | Волейболни мрежи
  - L3: Knee Pads (`volleyball-kneepads`) | Наколенки
- L2: Baseball & Softball (`team-baseball`)
  - L3: Bats (`baseball-bats`) | Бейзболни бухалки
  - L3: Gloves & Mitts (`baseball-gloves`) | Ръкавици
  - L3: Balls (`baseball-balls`) | Топки
  - L3: Helmets & Protection (`baseball-helmets`) | Каски и протекция
- L2: Rugby (`team-rugby`)
  - L3: Rugby Balls (`rugby-balls`) | Ръгби топки
  - L3: Rugby Boots (`rugby-boots`) | Ръгби обувки
  - L3: Rugby Protection (`rugby-protection`) | Ръгби протекция
- L2: Hockey (`team-hockey`)
  - L3: Hockey Sticks (`hockey-sticks`) | Хокейни стикове
  - L3: Hockey Pucks (`hockey-pucks`) | Хокейни шайби
  - L3: Hockey Skates (`hockey-skates`) | Хокейни кънки
  - L3: Hockey Pads (`hockey-pads`) | Хокейни протектори
- L2: Handball (`team-handball`)
  - L3: Handballs (`handball-balls`) | Хандбални топки
  - L3: Handball Shoes (`handball-shoes`) | Хандбални обувки

**4. Water Sports** (`water-sports`) 🏊
- L2: Swimming (`water-swimming`)
  - L3: Swimsuits (`swim-suits`) | Бански костюми
  - L3: Goggles (`swim-goggles`) | Плувни очила
  - L3: Swim Caps (`swim-caps`) | Плувни шапки
  - L3: Training Aids (`swim-training`) | Помощни средства за плуване
  - L3: Pool Equipment (`swim-pool`) | Оборудване за басейн
- L2: Surfing (`water-surfing`)
  - L3: Surfboards (`surf-boards`) | Сърф дъски
  - L3: Wetsuits (`surf-wetsuits`) | Неопренови костюми
  - L3: Surf Accessories (`surf-accessories`) | Сърф аксесоари
  - L3: Bodyboards (`surf-bodyboards`) | Бодиборд дъски
- L2: Kayaking & Canoeing (`water-kayak`)
  - L3: Kayaks (`kayak-boats`) | Каяци
  - L3: Canoes (`canoe-boats`) | Канута
  - L3: Paddles (`kayak-paddles`) | Гребла
  - L3: Life Jackets (`kayak-lifejackets`) | Спасителни жилетки
  - L3: Kayak Accessories (`kayak-accessories`) | Аксесоари за каяк
- L2: Diving & Snorkeling (`water-diving`)
  - L3: Masks (`dive-masks`) | Маски за гмуркане
  - L3: Fins (`dive-fins`) | Перки
  - L3: Snorkels (`dive-snorkels`) | Шнорхели
  - L3: Dive Computers (`dive-computers`) | Компютри за гмуркане
  - L3: Regulators (`dive-regulators`) | Регулатори
  - L3: BCDs (`dive-bcds`) | BCD жилетки
- L2: Wakeboarding & Waterskiing (`water-wakeboard`)
  - L3: Wakeboards (`wake-boards`) | Уейкборд дъски
  - L3: Water Skis (`wake-skis`) | Водни ски
  - L3: Bindings (`wake-bindings`) | Крепления
  - L3: Tow Ropes (`wake-ropes`) | Въжета за теглене
- L2: Paddleboarding (`water-sup`)
  - L3: SUP Boards (`sup-boards`) | SUP дъски
  - L3: SUP Paddles (`sup-paddles`) | SUP гребла
  - L3: Inflatable SUPs (`sup-inflatable`) | Надуваеми SUP
- L2: Sailing (`water-sailing`)
  - L3: Sailing Gear (`sail-gear`) | Екипировка за ветроходство
  - L3: Sailing Clothing (`sail-clothing`) | Облекло за ветроходство
  - L3: Sailing Hardware (`sail-hardware`) | Такелаж

**5. Winter Sports** (`winter-sports`) ⛷️
- L2: Skiing (`winter-skiing`)
  - L3: Alpine Skis (`ski-alpine`) | Алпийски ски
  - L3: Ski Boots (`ski-boots`) | Ски обувки
  - L3: Ski Poles (`ski-poles`) | Ски щеки
  - L3: Ski Bindings (`ski-bindings`) | Ски автомати
  - L3: Cross-Country Skis (`ski-xc`) | Ски бягане
  - L3: Backcountry Skis (`ski-backcountry`) | Ски за ски-алпинизъм
  - L3: Freestyle Skis (`ski-freestyle`) | Фрийстайл ски
- L2: Snowboarding (`winter-snowboard`)
  - L3: Snowboards (`snowboard-boards`) | Сноуборд дъски
  - L3: Snowboard Boots (`snowboard-boots`) | Сноуборд обувки
  - L3: Snowboard Bindings (`snowboard-bindings`) | Сноуборд автомати
  - L3: Splitboards (`snowboard-split`) | Сплитборд дъски
- L2: Ice Skating (`winter-skating`)
  - L3: Figure Skates (`skate-figure`) | Фигурни кънки
  - L3: Speed Skates (`skate-speed`) | Скоростни кънки
  - L3: Recreational Skates (`skate-recreational`) | Рекреационни кънки
- L2: Winter Clothing (`winter-clothing`)
  - L3: Ski Jackets (`winter-jackets`) | Ски якета
  - L3: Ski Pants (`winter-pants`) | Ски панталони
  - L3: Base Layers (`winter-baselayers`) | Термо бельо
  - L3: Ski Gloves (`winter-gloves`) | Ски ръкавици
  - L3: Ski Socks (`winter-socks`) | Ски чорапи
- L2: Winter Protection (`winter-protection`)
  - L3: Ski Helmets (`winter-helmets`) | Ски каски
  - L3: Ski Goggles (`winter-goggles`) | Ски очила
  - L3: Avalanche Safety (`winter-avalanche`) | Лавинна безопасност
  - L3: Back Protectors (`winter-backprotect`) | Протектори за гръб
- L2: Sledding (`winter-sledding`)
  - L3: Sleds (`sled-sleds`) | Шейни
  - L3: Toboggans (`sled-toboggans`) | Тобогани
  - L3: Snow Tubes (`sled-tubes`) | Снежни тръби

**6. Hiking & Camping** (`hiking-camping`) 🥾
- L2: Tents & Shelters (`hike-tents`)
  - L3: Backpacking Tents (`tent-backpack`) | Палатки за туризъм
  - L3: Family Tents (`tent-family`) | Семейни палатки
  - L3: Camping Tents (`tents`) | Палатки за къмпинг
  - L3: Tarps & Shelters (`tent-tarps`) | Покривала и навеси
  - L3: Tent Accessories (`tent-accessories`) | Аксесоари за палатки
- L2: Sleeping Gear (`hike-sleeping`)
  - L3: Sleeping Bags (`sleeping-bags`) | Спални чували
  - L3: Sleeping Pads (`sleep-pads`) | Постелки за спане
  - L3: Camping Pillows (`sleep-pillows`) | Къмпинг възглавници
  - L3: Hammocks (`sleep-hammocks`) | Хамаци
  - L3: Bivy Sacks (`sleep-bivy`) | Биваци
- L2: Hiking Backpacks (`hike-backpacks`)
  - L3: Daypacks (`pack-daypacks`) | Раници за дневни излети
  - L3: Trekking Packs (`hiking-backpacks`) | Туристически раници
  - L3: Ultralight Packs (`pack-ultralight`) | Ултралеки раници
  - L3: Hydration Packs (`pack-hydration`) | Раници с хидратация
- L2: Camping Cooking (`hike-cooking`)
  - L3: Camp Stoves (`cook-stoves`) | Къмпинг печки
  - L3: Cookware Sets (`camping-cooking`) | Комплекти за готвене
  - L3: Coolers & Ice Boxes (`cook-coolers`) | Хладилни чанти
  - L3: Water Filtration (`cook-filtration`) | Филтриране на вода
  - L3: Camp Utensils (`cook-utensils`) | Прибори за хранене
- L2: Hiking Footwear (`hike-footwear`)
  - L3: Hiking Boots (`boot-hiking`) | Туристически обувки
  - L3: Trail Runners (`boot-trail`) | Обувки за бягане по пътеки
  - L3: Approach Shoes (`boot-approach`) | Апроуч обувки
  - L3: Sandals (`boot-sandals`) | Сандали за туризъм
- L2: Navigation & Lighting (`hike-navigation`)
  - L3: GPS Devices (`nav-gps`) | GPS устройства
  - L3: Compasses (`nav-compass`) | Компаси
  - L3: Headlamps (`nav-headlamps`) | Челни лампи
  - L3: Lanterns (`nav-lanterns`) | Фенери
- L2: Camping Furniture (`hike-furniture`)
  - L3: Camp Chairs (`furn-chairs`) | Къмпинг столове
  - L3: Camp Tables (`furn-tables`) | Къмпинг маси
  - L3: Cots (`furn-cots`) | Къмпинг легла
- L2: Climbing Gear (`hike-climbing`)
  - L3: Climbing Harnesses (`climb-harness`) | Катерачни колани
  - L3: Climbing Ropes (`climb-ropes`) | Катерачни въжета
  - L3: Carabiners (`climb-carabiners`) | Карабинери
  - L3: Climbing Shoes (`climb-shoes`) | Катерачни обувки
  - L3: Belay Devices (`climb-belay`) | Осигурителни устройства

**7. Running** (`running`) 🏃
- L2: Running Shoes (`run-shoes`)
  - L3: Road Running (`run-road`) | Шосейно бягане
  - L3: Trail Running (`run-trail`) | Планинско бягане
  - L3: Racing Flats (`run-racing`) | Състезателни маратонки
  - L3: Stability Shoes (`run-stability`) | Стабилизиращи обувки
  - L3: Motion Control (`run-motion`) | С контрол на движението
- L2: Running Apparel (`run-apparel`)
  - L3: Running Shorts (`run-shorts`) | Шорти за бягане
  - L3: Running Tights (`run-tights`) | Клинове за бягане
  - L3: Running Shirts (`run-shirts`) | Тениски за бягане
  - L3: Running Jackets (`run-jackets`) | Якета за бягане
- L2: Running Accessories (`run-accessories`)
  - L3: Running Watches (`run-watches`) | Часовници за бягане
  - L3: Heart Rate Monitors (`run-hrm`) | Монитори за пулс
  - L3: Running Belts (`run-belts`) | Колани за бягане
  - L3: Armbands (`run-armbands`) | Лентички за ръка
  - L3: Reflective Gear (`run-reflective`) | Отразително оборудване

**8. Golf** (`golf`) ⛳
- L2: Golf Clubs (`golf-clubs`)
  - L3: Drivers (`golf-drivers`) | Драйвери
  - L3: Fairway Woods (`golf-woods`) | Фейруей ууд
  - L3: Hybrids (`golf-hybrids`) | Хибриди
  - L3: Irons (`golf-irons`) | Айрони
  - L3: Wedges (`golf-wedges`) | Уеджове
  - L3: Putters (`golf-putters`) | Путери
  - L3: Complete Sets (`golf-sets`) | Пълни комплекти
- L2: Golf Balls (`golf-balls`)
  - L3: Distance Balls (`ball-distance`) | Топки за дистанция
  - L3: Tour Balls (`ball-tour`) | Професионални топки
  - L3: Practice Balls (`ball-practice`) | Топки за тренировка
- L2: Golf Bags (`golf-bags`)
  - L3: Cart Bags (`bag-cart`) | Чанти за количка
  - L3: Stand Bags (`bag-stand`) | Чанти със стойка
  - L3: Travel Bags (`bag-travel`) | Пътни чанти
- L2: Golf Apparel (`golf-apparel`)
  - L3: Golf Shirts (`golf-shirts`) | Голф тениски
  - L3: Golf Pants (`golf-pants`) | Голф панталони
  - L3: Golf Shoes (`golf-shoes`) | Голф обувки
  - L3: Golf Gloves (`golf-gloves`) | Голф ръкавици
- L2: Golf Accessories (`golf-accessories`)
  - L3: Rangefinders (`golf-rangefinder`) | Далекомери
  - L3: Golf GPS (`golf-gps`) | Голф GPS
  - L3: Tees (`golf-tees`) | Тийта
  - L3: Golf Towels (`golf-towels`) | Голф кърпи

**9. Combat Sports** (`combat-sports`) 🥊
- L2: Boxing (`combat-boxing`)
  - L3: Boxing Gloves (`box-gloves`) | Боксови ръкавици
  - L3: Punching Bags (`box-bags`) | Боксови круши
  - L3: Hand Wraps (`box-wraps`) | Бинтове за ръце
  - L3: Boxing Headgear (`box-headgear`) | Боксови каски
  - L3: Boxing Shoes (`box-shoes`) | Боксови обувки
- L2: MMA (`combat-mma`)
  - L3: MMA Gloves (`mma-gloves`) | MMA ръкавици
  - L3: MMA Shorts (`mma-shorts`) | MMA шорти
  - L3: Shin Guards (`mma-shinguards`) | Протектори за пищяли
  - L3: Rash Guards (`mma-rashguards`) | Рашгарди
- L2: Wrestling (`combat-wrestling`)
  - L3: Wrestling Shoes (`wrestling-shoes`) | Обувки за борба
  - L3: Wrestling Singlets (`wrestling-singlets`) | Борбени екипи
  - L3: Wrestling Mats (`wrestling-mats`) | Борбени постелки
- L2: Martial Arts (`combat-martialarts`)
  - L3: Gi/Uniforms (`martial-gi`) | Кимона
  - L3: Belts (`martial-belts`) | Колани
  - L3: Protective Gear (`martial-protection`) | Протекция
  - L3: Training Equipment (`martial-training`) | Тренировъчно оборудване
- L2: Fencing (`combat-fencing`)
  - L3: Foils (`fencing-foils`) | Флоретове
  - L3: Epees (`fencing-epees`) | Шпаги
  - L3: Sabers (`fencing-sabers`) | Саби
  - L3: Fencing Masks (`fencing-masks`) | Фехтовачни маски
  - L3: Fencing Jackets (`fencing-jackets`) | Фехтовачни якета

**10. Racket Sports** (`racket-sports`) 🎾
- L2: Tennis (`racket-tennis`)
  - L3: Tennis Rackets (`tennis-rackets`) | Тенис ракети
  - L3: Tennis Balls (`tennis-balls`) | Тенис топки
  - L3: Tennis Strings (`tennis-strings`) | Тенис кордажи
  - L3: Tennis Bags (`tennis-bags`) | Тенис чанти
  - L3: Tennis Shoes (`tennis-shoes`) | Тенис обувки
- L2: Badminton (`racket-badminton`)
  - L3: Badminton Rackets (`badminton-rackets`) | Бадминтон ракети
  - L3: Shuttlecocks (`badminton-shuttles`) | Перца
  - L3: Badminton Nets (`badminton-nets`) | Бадминтон мрежи
- L2: Table Tennis (`racket-tabletennis`)
  - L3: Table Tennis Paddles (`tt-paddles`) | Хилки за тенис на маса
  - L3: Table Tennis Balls (`tt-balls`) | Топки за тенис на маса
  - L3: Table Tennis Tables (`tt-tables`) | Маси за тенис на маса
  - L3: Table Tennis Rubbers (`tt-rubbers`) | Гуми за хилки
- L2: Squash (`racket-squash`)
  - L3: Squash Rackets (`squash-rackets`) | Скуош ракети
  - L3: Squash Balls (`squash-balls`) | Скуош топки
  - L3: Squash Shoes (`squash-shoes`) | Скуош обувки
- L2: Pickleball (`racket-pickleball`)
  - L3: Pickleball Paddles (`pickle-paddles`) | Пиклбол ракети
  - L3: Pickleballs (`pickle-balls`) | Пиклбол топки
  - L3: Pickleball Nets (`pickle-nets`) | Пиклбол мрежи

**11. Fishing & Hunting** (`fishing-hunting`) 🎣
- L2: Fishing (`fh-fishing`)
  - L3: Fishing Rods (`fish-rods`) | Въдици
  - L3: Fishing Reels (`fish-reels`) | Макари
  - L3: Fishing Lures (`fish-lures`) | Примамки
  - L3: Fishing Line (`fish-line`) | Влакна
  - L3: Tackle Boxes (`fish-tackle`) | Кутии за принадлежности
  - L3: Fishing Nets (`fish-nets`) | Риболовни мрежи
  - L3: Fish Finders (`fish-finders`) | Сонари
- L2: Hunting (`fh-hunting`)
  - L3: Hunting Clothing (`hunt-clothing`) | Ловно облекло
  - L3: Hunting Blinds (`hunt-blinds`) | Ловни укрития
  - L3: Game Calls (`hunt-calls`) | Примамки за дивеч
  - L3: Hunting Knives (`hunt-knives`) | Ловни ножове
  - L3: Trail Cameras (`hunt-cameras`) | Камери за наблюдение
- L2: Archery (`fh-archery`)
  - L3: Compound Bows (`archery-compound`) | Съставни лъкове
  - L3: Recurve Bows (`archery-recurve`) | Рекурсивни лъкове
  - L3: Crossbows (`archery-crossbow`) | Арбалети
  - L3: Arrows (`archery-arrows`) | Стрели
  - L3: Archery Targets (`archery-targets`) | Мишени
- L2: Shooting Sports (`fh-shooting`)
  - L3: Air Rifles (`shoot-airrifles`) | Въздушни пушки
  - L3: Air Pistols (`shoot-airpistols`) | Въздушни пистолети
  - L3: Targets (`shoot-targets`) | Мишени за стрелба
  - L3: Shooting Glasses (`shoot-glasses`) | Стрелкови очила

**12. Outdoor Recreation** (`outdoor-rec`) 🏕️
- L2: Skateboarding (`outdoor-skate`)
  - L3: Skateboards (`skate-boards`) | Скейтборди
  - L3: Longboards (`skate-longboards`) | Лонгборди
  - L3: Skate Shoes (`skate-shoes`) | Скейт обувки
  - L3: Skate Protection (`skate-protection`) | Протекция за скейт
- L2: Inline Skating (`outdoor-inline`)
  - L3: Inline Skates (`inline-skates`) | Ролери
  - L3: Inline Protection (`inline-protection`) | Протекция за ролери
  - L3: Inline Wheels (`inline-wheels`) | Колела за ролери
- L2: Scooters (`outdoor-scooter`)
  - L3: Kick Scooters (`scooter-kick`) | Тротинетки
  - L3: Electric Scooters (`scooter-electric`) | Електрически тротинетки
  - L3: Stunt Scooters (`scooter-stunt`) | Стънт тротинетки
- L2: Outdoor Games (`outdoor-games`)
  - L3: Lawn Games (`game-lawn`) | Градински игри
  - L3: Beach Games (`game-beach`) | Плажни игри
  - L3: Disc Golf (`game-disc`) | Диск голф
  - L3: Cornhole (`game-cornhole`) | Корнхол
- L2: Trampolines (`outdoor-trampoline`)
  - L3: Backyard Trampolines (`tramp-backyard`) | Градински батути
  - L3: Fitness Trampolines (`tramp-fitness`) | Фитнес батути
  - L3: Trampoline Accessories (`tramp-accessories`) | Аксесоари за батути

**13. Sports Supplements** (`sports-supplements`) 💪
- L2: Protein (`supp-protein`)
  - L3: Whey Protein (`protein-whey`) | Суроватъчен протеин
  - L3: Casein Protein (`protein-casein`) | Казеинов протеин
  - L3: Plant Protein (`protein-plant`) | Растителен протеин
  - L3: Protein Bars (`protein-bars`) | Протеинови барове
- L2: Pre-Workout (`supp-preworkout`)
  - L3: Stimulant Pre-Workout (`pre-stim`) | Предтренировъчни със стимуланти
  - L3: Non-Stim Pre-Workout (`pre-nonstim`) | Предтренировъчни без стимуланти
  - L3: Pump Products (`pre-pump`) | Продукти за помпа
- L2: Post-Workout (`supp-postworkout`)
  - L3: BCAAs (`post-bcaa`) | BCAA аминокиселини
  - L3: Creatine (`post-creatine`) | Креатин
  - L3: Recovery Blends (`post-recovery`) | Смеси за възстановяване
- L2: Weight Management (`supp-weight`)
  - L3: Fat Burners (`weight-fatburn`) | Фетбърнъри
  - L3: Mass Gainers (`weight-gainer`) | Гейнъри
  - L3: Meal Replacements (`weight-meal`) | Заместители на храна
- L2: Sports Vitamins (`supp-vitamins`)
  - L3: Multivitamins (`vit-multi`) | Мултивитамини
  - L3: Electrolytes (`vit-electrolytes`) | Електролити
  - L3: Joint Support (`vit-joints`) | Добавки за стави

**14. Fan Gear & Merchandise** (`fan-gear`) 🏆
- L2: Team Apparel (`fan-apparel`)
  - L3: Official Jerseys (`fan-jerseys`) | Официални фланелки
  - L3: Team T-Shirts (`fan-tshirts`) | Отборни тениски
  - L3: Team Hats (`fan-hats`) | Отборни шапки
  - L3: Team Jackets (`fan-jackets`) | Отборни якета
- L2: Collectibles (`fan-collectibles`)
  - L3: Signed Memorabilia (`collect-signed`) | Подписани колекционерски предмети
  - L3: Trading Cards (`collect-cards`) | Колекционерски картички
  - L3: Sports Figurines (`collect-figurines`) | Спортни фигурки
  - L3: Display Cases (`collect-cases`) | Витрини за колекции
- L2: Accessories (`fan-accessories`)
  - L3: Team Flags (`fan-flags`) | Отборни знамена
  - L3: Stadium Gear (`fan-stadium`) | Екипировка за стадион
  - L3: Car Accessories (`fan-car`) | Автомобилни аксесоари

**15. Equestrian** (`equestrian`) 🐴
- L2: Riding Apparel (`eq-apparel`)
  - L3: Riding Helmets (`eq-helmets`) | Каски за езда
  - L3: Riding Boots (`eq-boots`) | Ботуши за езда
  - L3: Breeches (`eq-breeches`) | Бричове
  - L3: Show Jackets (`eq-jackets`) | Якета за състезания
- L2: Saddles & Tack (`eq-saddles`)
  - L3: English Saddles (`saddle-english`) | Английски седла
  - L3: Western Saddles (`saddle-western`) | Уестърн седла
  - L3: Bridles (`saddle-bridles`) | Юзди
  - L3: Girths & Cinches (`saddle-girths`) | Подпръгове
- L2: Horse Care (`eq-horsecare`)
  - L3: Grooming Supplies (`horse-grooming`) | Грижа за козина
  - L3: Horse Blankets (`horse-blankets`) | Попони
  - L3: Leg Protection (`horse-legprotect`) | Защита за крака
  - L3: Hoof Care (`horse-hoofcare`) | Грижа за копита
- L2: Stable Equipment (`eq-stable`)
  - L3: Feed Buckets (`stable-buckets`) | Хранилки
  - L3: Water Troughs (`stable-troughs`) | Поилки
  - L3: Stable Mats (`stable-mats`) | Постелки за обор

---

#### Sports Category Attributes (80 Total)

**Cycling Attributes (16):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Bike Type | select | Road, Mountain, City, Electric, BMX, Gravel, Kids | Шосеен, Планински, Градски, Електрически, BMX, Гравъл, Детски |
| Frame Size | select | XS, S, M, L, XL, XXL, 24", 26", 27.5", 29" | XS, S, M, L, XL, XXL, 24", 26", 27.5", 29" |
| Frame Material | select | Aluminum, Carbon, Steel, Titanium, Chromoly | Алуминий, Карбон, Стомана, Титан, Хромомолибден |
| Wheel Size | select | 12", 16", 20", 24", 26", 27.5", 29", 700c | 12", 16", 20", 24", 26", 27.5", 29", 700c |
| Suspension Type | select | None, Hardtail, Full Suspension, Front Suspension | Без, Hardtail, Пълно окачване, Предно окачване |
| Gear Count | select | Single Speed, 7-Speed, 8-Speed, 9-Speed, 10-Speed, 11-Speed, 12-Speed, 21-Speed+ | Една скорост, 7, 8, 9, 10, 11, 12, 21+ скорости |
| Brake Type | select | Rim, Disc Mechanical, Disc Hydraulic, Coaster | Челюстни, Дискови механични, Дискови хидравлични, Торпедо |
| E-Bike Motor | select | Hub Front, Hub Rear, Mid-Drive, None | Преден ступичен, Заден ступичен, Централен, Няма |
| E-Bike Battery | select | Under 300Wh, 300-400Wh, 400-500Wh, 500-600Wh, 600Wh+ | Под 300Wh, 300-400Wh, 400-500Wh, 500-600Wh, 600Wh+ |
| Bike Component Level | select | Entry, Mid-Range, Performance, Pro | Начално ниво, Средно ниво, Високо ниво, Професионално |
| Helmet Type | select | Road, MTB, Commuter, BMX, Full Face, Kids | Шосейна, Планинска, Градска, BMX, Цялостна, Детска |
| Helmet Size | select | XS, S, M, L, XL, Youth, Child | XS, S, M, L, XL, Юношеска, Детска |
| Light Type | select | Front, Rear, Set, Combo, Rechargeable, Battery | Предна, Задна, Комплект, Комбо, Акумулаторна, С батерии |
| Lock Type | select | Cable, Chain, U-Lock, Folding, Combination | Кабелен, Верижен, U-образен, Сгъваем, С код |
| Cycling Gender | select | Men, Women, Unisex, Kids, Youth | Мъжки, Дамски, Унисекс, Детски, Юношески |
| Cycling Season | multiselect | Spring, Summer, Fall, Winter, All Season | Пролет, Лято, Есен, Зима, Цял сезон |

**Fitness Attributes (14):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Equipment Type | select | Cardio, Strength, Flexibility, Recovery, Accessories | Кардио, Сила, Гъвкавост, Възстановяване, Аксесоари |
| Max User Weight | select | Up to 100kg, Up to 120kg, Up to 150kg, Up to 180kg, 180kg+ | До 100кг, До 120кг, До 150кг, До 180кг, 180кг+ |
| Resistance Levels | select | Light, Medium, Heavy, Extra Heavy, Adjustable, Multiple | Лека, Средна, Тежка, Екстра тежка, Регулируема, Множество |
| Foldable | boolean | Yes, No | Да, Не |
| Display Type | select | None, Basic LCD, Advanced LCD, LED, Touchscreen | Без, Основен LCD, Разширен LCD, LED, Тъчскрийн |
| Connectivity | multiselect | None, Bluetooth, ANT+, WiFi, App Compatible | Без, Bluetooth, ANT+, WiFi, Съвместим с приложение |
| Weight Set Type | select | Fixed, Adjustable, Olympic, Standard, Kettlebell | Фиксиран, Регулируем, Олимпийски, Стандартен, Гира |
| Weight kg | select | 1-5kg, 5-10kg, 10-20kg, 20-30kg, 30-50kg, 50kg+ | 1-5кг, 5-10кг, 10-20кг, 20-30кг, 30-50кг, 50кг+ |
| Mat Thickness | select | 3mm, 4mm, 5mm, 6mm, 8mm, 10mm+ | 3мм, 4мм, 5мм, 6мм, 8мм, 10мм+ |
| Mat Material | select | PVC, TPE, Rubber, Cork, Natural, Foam | PVC, TPE, Гума, Корк, Натурален, Пяна |
| Fitness Level | select | Beginner, Intermediate, Advanced, Professional | Начинаещ, Среден, Напреднал, Професионален |
| Heart Rate Monitor | boolean | Yes, No | Да, Не |
| Programs Included | boolean | Yes, No | Да, Не |
| Assembly Required | select | None, Minimal, Some, Full Assembly | Не се изисква, Минимална, Частична, Пълна |

**Team Sports Attributes (5):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Team Sport | select | Soccer, Basketball, Football, Volleyball, Baseball, Rugby, Hockey, Handball | Футбол, Баскетбол, Американски футбол, Волейбол, Бейзбол, Ръгби, Хокей, Хандбал |
| Ball Size | select | Size 1, Size 3, Size 4, Size 5, Official, Youth, Mini | Размер 1, Размер 3, Размер 4, Размер 5, Официален, Детски, Мини |
| League Official | boolean | Yes, No | Да, Не |
| Age Group | select | Youth, Junior, Senior, Professional | Деца, Юноши, Възрастни, Професионалисти |
| Indoor/Outdoor | select | Indoor, Outdoor, Both | На закрито, На открито, И двете |

**Winter Sports Attributes (5):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Skill Level | select | Beginner, Intermediate, Advanced, Expert | Начинаещ, Среден, Напреднал, Експерт |
| Ski/Board Length | select | Under 140cm, 140-150cm, 150-160cm, 160-170cm, 170-180cm, 180cm+ | Под 140см, 140-150см, 150-160см, 160-170см, 170-180см, 180см+ |
| Binding Compatibility | select | Universal, Brand Specific, Alpine, Touring, Nordic | Универсален, Специфичен за марка, Алпийски, Туристически, Нордически |
| Insulation Level | select | Light, Medium, Heavy, Extreme Cold | Лека, Средна, Тежка, Екстремен студ |
| Waterproof Rating | select | 5000mm, 10000mm, 15000mm, 20000mm, 30000mm+ | 5000мм, 10000мм, 15000мм, 20000мм, 30000мм+ |

**Water Sports Attributes (5):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Water Activity | select | Swimming, Surfing, Kayaking, Diving, Wakeboarding, SUP, Sailing | Плуване, Сърфинг, Каякинг, Гмуркане, Уейкборд, SUP, Ветроходство |
| Wetsuit Thickness | select | 1mm, 2mm, 3mm, 4/3mm, 5/4mm, Drysuit | 1мм, 2мм, 3мм, 4/3мм, 5/4мм, Сух костюм |
| Buoyancy Type | select | None, PFD Type I, PFD Type II, PFD Type III, Inflatable | Без, PFD Тип I, PFD Тип II, PFD Тип III, Надуваем |
| Board Length | select | Under 6ft, 6-7ft, 7-8ft, 8-9ft, 9-10ft, 10ft+, Inflatable | Под 6фт, 6-7фт, 7-8фт, 8-9фт, 9-10фт, 10фт+, Надуваем |
| Dive Certification Level | select | None Required, Open Water, Advanced, Rescue, Divemaster | Не се изисква, Open Water, Advanced, Rescue, Divemaster |

**Combat Sports Attributes (5):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Combat Sport | select | Boxing, MMA, Wrestling, Karate, Judo, BJJ, Muay Thai, Fencing | Бокс, MMA, Борба, Карате, Джудо, BJJ, Муай Тай, Фехтовка |
| Glove Weight | select | 8oz, 10oz, 12oz, 14oz, 16oz, 18oz | 8oz, 10oz, 12oz, 14oz, 16oz, 18oz |
| Belt Rank | select | White, Yellow, Orange, Green, Blue, Purple, Brown, Black | Бял, Жълт, Оранжев, Зелен, Син, Лилав, Кафяв, Черен |
| Protection Level | select | Training, Sparring, Competition | Тренировка, Спаринг, Състезание |
| Bag Weight | select | 25lb, 40lb, 70lb, 100lb, 150lb, Freestanding | 25lb, 40lb, 70lb, 100lb, 150lb, Свободностоящ |

**Hiking & Camping Attributes (6):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Tent Capacity | select | 1-Person, 2-Person, 3-Person, 4-Person, 6-Person, 8-Person+ | 1 човек, 2 човека, 3 човека, 4 човека, 6 човека, 8+ човека |
| Season Rating | select | 2-Season, 3-Season, 4-Season, All-Season | 2 сезона, 3 сезона, 4 сезона, Всички сезони |
| Backpack Capacity | select | Under 20L, 20-35L, 35-50L, 50-65L, 65-80L, 80L+ | Под 20L, 20-35L, 35-50L, 50-65L, 65-80L, 80L+ |
| Sleeping Bag Temp Rating | select | 40°F+, 30°F, 20°F, 10°F, 0°F, -10°F, -20°F | 4°C+, -1°C, -7°C, -12°C, -18°C, -23°C, -29°C |
| Sleeping Bag Fill | select | Synthetic, Down 550, Down 650, Down 750, Down 850+ | Синтетика, Пух 550, Пух 650, Пух 750, Пух 850+ |
| Stove Fuel Type | select | Propane, Butane, White Gas, Multi-Fuel, Wood, Alcohol | Пропан, Бутан, Бял газ, Мултигориво, Дърва, Спирт |

**Racket Sports Attributes (5):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Racket Sport | select | Tennis, Badminton, Table Tennis, Squash, Pickleball, Padel | Тенис, Бадминтон, Тенис на маса, Скуош, Пиклбол, Падел |
| Racket Weight | select | Under 250g, 250-280g, 280-300g, 300-320g, 320g+ | Под 250г, 250-280г, 280-300г, 300-320г, 320г+ |
| String Pattern | select | 16x19, 18x20, 16x18, 16x16, Other | 16x19, 18x20, 16x18, 16x16, Друго |
| Grip Size | select | G0, G1, G2, G3, G4, G5, Junior | G0, G1, G2, G3, G4, G5, Юниорски |
| Head Size | select | Midsize, Mid-Plus, Oversize, Super Oversize | Среден, Среден плюс, Голям, Супер голям |

**Running Attributes (5):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Running Surface | select | Road, Trail, Track, Treadmill, Mixed | Асфалт, Пътека, Писта, Бягаща пътека, Смесено |
| Pronation Type | select | Neutral, Overpronation, Underpronation, Stability | Неутрална, Свръхпронация, Супинация, Стабилизираща |
| Cushioning Level | select | Minimal, Low, Medium, High, Max | Минимална, Ниска, Средна, Висока, Максимална |
| Drop mm | select | 0mm, 4mm, 6mm, 8mm, 10mm, 12mm+ | 0мм, 4мм, 6мм, 8мм, 10мм, 12мм+ |
| Running Shoe Width | select | Narrow, Standard, Wide, Extra Wide | Тесни, Стандартни, Широки, Екстра широки |

**Golf Attributes (5):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Club Type | select | Driver, Fairway Wood, Hybrid, Iron, Wedge, Putter, Complete Set | Драйвер, Ууд, Хибрид, Айрон, Уедж, Путер, Пълен комплект |
| Shaft Flex | select | Ladies, Senior, Regular, Stiff, Extra Stiff | Дамски, Сеньор, Регулярен, Твърд, Екстра твърд |
| Shaft Material | select | Steel, Graphite, Multi-Material | Стомана, Графит, Комбиниран |
| Hand Orientation | select | Right, Left | Дясна, Лява |
| Handicap Level | select | Beginner (36+), High (19-36), Mid (10-18), Low (0-9), Pro | Начинаещ (36+), Висок (19-36), Среден (10-18), Нисък (0-9), Про |

**Fishing & Hunting Attributes (9):**
| Attribute | Type | Options EN | Options BG |
|-----------|------|------------|------------|
| Fishing Type | select | Freshwater, Saltwater, Fly Fishing, Ice Fishing, Surf | Сладководен, Морски, Мухарски, Подледен, Сърф |
| Rod Action | select | Ultra Light, Light, Medium Light, Medium, Medium Heavy, Heavy | Ултра лека, Лека, Средно лека, Средна, Средно тежка, Тежка |
| Rod Length | select | Under 6ft, 6-7ft, 7-8ft, 8-9ft, 9ft+ | Под 6фт, 6-7фт, 7-8фт, 8-9фт, 9фт+ |
| Reel Type | select | Spinning, Baitcasting, Fly, Spincast, Conventional | Спининг, Бейткастинг, Мухарска, Спинкаст, Конвенционална |
| Lure Type | select | Soft Plastic, Hard Bait, Spinnerbait, Jig, Fly, Live Bait | Мека пластмаса, Твърда примамка, Спинербейт, Джиг, Муха, Жива стръв |
| Bow Draw Weight | select | 15-25 lbs, 25-35 lbs, 35-45 lbs, 45-55 lbs, 55-70 lbs, 70+ lbs | 15-25 lbs, 25-35 lbs, 35-45 lbs, 45-55 lbs, 55-70 lbs, 70+ lbs |
| Arrow Length | select | 26", 28", 29", 30", 31", 32", Custom | 26", 28", 29", 30", 31", 32", По поръчка |
| Hunting Season | multiselect | Deer, Turkey, Waterfowl, Upland Bird, Small Game, Big Game | Елен, Пуйка, Водолюбиви, Полска птица, Дребен дивеч, Едър дивеч |
| Camo Pattern | select | Woodland, Realtree, Mossy Oak, Snow, Desert, Solid | Горски, Realtree, Mossy Oak, Снежен, Пустинен, Едноцветен |

---

### 🔧 20. TOOLS & INDUSTRIAL (`tools-home`) ✅ COMPLETE - 456 Categories, 77 Attributes
> **Updated: December 2025** | **L0: 1** | **L1: 27** | **L2: 232** | **L3: 196** | **Attributes: 77**
> Reference Sources: Praktiker.bg, Mr-Bricolage.bg, Bauhaus.bg, OBI.bg, HomeDepot, Grainger, Bosch, Makita, DeWalt

**L1 Subcategories (27):**

#### 🔨 **Power Tools** (`power-tools`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Drills | `powertools-drills` | Cordless Drills, Hammer Drills, Drill Presses, Magnetic Drills, Right Angle Drills |
| Saws | `powertools-saws` | Circular Saws, Jigsaws, Miter Saws, Reciprocating Saws, Band Saws, Table Saws, Tile Saws |
| Sanders | `powertools-sanders` | Orbital Sanders, Belt Sanders, Detail Sanders, Drywall Sanders |
| Grinders | `powertools-grinders` | Angle Grinders, Bench Grinders, Die Grinders, Straight Grinders |
| Impact Wrenches | `powertools-wrenches` | - |
| Routers & Planers | `powertools-routers` | Fixed Routers, Plunge Routers, Electric Planers, Jointers |
| Rotary Hammers | `powertools-rotary-hammers` | SDS Plus, SDS Max, Demolition Hammers |
| Heat Guns | `powertools-heat-guns` | - |
| Polishers | `powertools-polishers` | - |
| Oscillating Tools | `powertools-oscillating` | - |
| Concrete Tools | `powertools-concrete` | Concrete Mixers, Concrete Vibrators, Concrete Cutters |

#### 🔧 **Hand Tools** (`hand-tools`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Screwdrivers | `handtools-screwdrivers` | Flathead, Phillips, Torx Sets, Precision, Ratcheting |
| Wrenches & Spanners | `handtools-wrenches` | Adjustable, Combination, Socket Sets, Allen Keys, Pipe Wrenches |
| Pliers | `handtools-pliers` | Needle Nose, Slip Joint, Locking, Cutting, Circlip |
| Hammers | `handtools-hammers` | Claw, Ball Peen, Sledge, Mallets, Dead Blow |
| Measuring Tools | `handtools-measuring` | - |
| Cutting Tools | `handtools-cutting` | Utility Knives, Snips, Shears, Wire Cutters |
| Clamps & Vises | `handtools-clamps` | C-Clamps, Bar Clamps, Pipe Clamps, Bench Vises |
| Files & Rasps | `handtools-files` | - |
| Pry Bars | `handtools-pry-bars` | - |
| Levels | `handtools-levels` | - |
| Hand Saws | `handtools-saws` | - |

#### ⚡ **Welding & Soldering** (`welding-soldering`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| MIG Welders | `welding-mig` | Flux Core, Gas MIG, Multi-Process |
| TIG Welders | `welding-tig` | - |
| Stick/Arc Welders | `welding-stick` | - |
| Plasma Cutters | `welding-plasma` | - |
| Soldering Equipment | `welding-soldering-equip` | Soldering Irons, Stations, Hot Air, Desoldering |
| Welding Accessories | `welding-accessories` | Helmets, Gloves, Wire & Rods, Clamps |
| Spot Welders | `welding-spot` | - |
| Brazing Equipment | `welding-brazing` | - |

#### 💨 **Pneumatic & Air Tools** (`pneumatic-tools`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Air Compressors | `pneumatic-compressors` | Portable, Stationary, Oil-Free, Pancake |
| Pneumatic Nailers | `pneumatic-nailers` | Framing, Finish, Brad, Staple |
| Air Impact Wrenches | `pneumatic-impact` | - |
| Air Sanders | `pneumatic-sanders` | - |
| Air Drills | `pneumatic-drills` | - |
| Spray Guns | `pneumatic-spray` | HVLP, Conventional, Airless |
| Pneumatic Accessories | `pneumatic-accessories` | Hoses, Fittings, Quick Couplers |
| Blow Guns | `pneumatic-blow-guns` | - |

#### 🚗 **Automotive Tools** (`automotive-tools`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Diagnostic Tools | `auto-diagnostic` | OBD Scanners, Code Readers, Diagnostic Software |
| Jack & Lifting | `auto-jacks` | Floor Jacks, Bottle Jacks, Jack Stands, Lift Tables |
| Automotive Hand Tools | `auto-hand-tools` | - |
| Specialty Auto Tools | `auto-specialty` | Timing Tools, Bearing Pullers, Oil Filter Tools |
| Tire & Wheel Tools | `auto-tire-tools` | - |
| Body Repair | `auto-body-repair` | - |
| Fluid Tools | `auto-fluid-tools` | - |
| Battery Tools | `auto-battery-tools` | Jump Starters, Battery Chargers, Testers |

#### 🌳 **Garden & Outdoor Power** (`garden-power`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Lawn Mowers | `garden-mowers` | Push, Self-Propelled, Riding, Robotic, Reel |
| String Trimmers | `garden-trimmers` | Gas, Electric, Battery |
| Chainsaws | `garden-chainsaws` | Gas, Electric, Battery, Pole Saws |
| Leaf Blowers | `garden-blowers` | Handheld, Backpack, Walk-Behind |
| Hedge Trimmers | `garden-hedge` | - |
| Pressure Washers | `garden-pressure-washers` | Electric, Gas, Commercial |
| Tillers & Cultivators | `garden-tillers` | - |
| Log Splitters | `garden-log-splitters` | - |
| Snow Blowers | `garden-snow-blowers` | - |

#### 🪵 **Woodworking Tools** (`woodworking-tools`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Table Saws | `wood-table-saws` | Contractor, Cabinet, Jobsite |
| Band Saws | `wood-band-saws` | - |
| Jointers & Planers | `wood-jointers` | - |
| Wood Lathes | `wood-lathes` | Mini, Midi, Full Size |
| Scroll Saws | `wood-scroll-saws` | - |
| Router Tables | `wood-router-tables` | - |
| Dust Collection | `wood-dust-collection` | - |
| Woodworking Clamps | `wood-clamps` | - |
| Carving Tools | `wood-carving` | - |

#### ⚙️ **Metalworking Tools** (`metalworking-tools`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Metal Lathes | `metal-lathes` | Mini, Bench, Industrial |
| Milling Machines | `metal-milling` | - |
| Metal Band Saws | `metal-band-saws` | Horizontal, Vertical |
| Sheet Metal Tools | `metal-sheet` | - |
| Threading Tools | `metal-threading` | - |
| Metal Forming | `metal-forming` | - |
| Deburring Tools | `metal-deburring` | - |

#### 🔩 **Hardware** (`hardware`) 
*L2: Screws & Bolts, Nuts & Washers, Anchors, Hinges, Handles & Knobs, Hooks & Hangers, Chains & Rope, Cabinet Hardware*

#### 🏭 **Industrial & Scientific** (`industrial`)
*L2: Industrial Equipment, Lab Equipment, Test & Measurement, Material Handling, Electrical & Power, Hydraulics & Pneumatics*

#### 📏 **Measuring Tools** (`measuring-tools`)
*L2: Tape Measures, Laser Measures, Calipers, Micrometers, Squares & Angles, Stud Finders, Moisture Meters*

#### 🥽 **Safety Equipment** (`safety-equipment`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Eye Protection | `safety-eye` | Safety Glasses, Goggles, Face Shields, Prescription Safety |
| Hearing Protection | `safety-hearing` | Earplugs, Earmuffs, Electronic |
| Respiratory Protection | `safety-respiratory` | Dust Masks, N95, Half-Face, Full-Face |
| Head Protection | `safety-head` | Hard Hats, Bump Caps, Winter Liners |
| Hand Protection | `safety-hand` | Work Gloves, Cut Resistant, Chemical, Welding |
| Foot Protection | `safety-foot` | Steel Toe, Composite Toe, Metatarsal |
| High Visibility | `safety-hi-vis` | - |
| Fall Protection | `safety-fall` | Harnesses, Lanyards, Anchors |

#### 🧰 **Tool Storage** (`tool-storage`)
| L2 Category | Slug | L3 Categories |
|-------------|------|---------------|
| Tool Boxes | `storage-tool-boxes` | Portable, Cantilever, Truck Boxes |
| Tool Chests | `storage-chests` | Top Chests, Rolling Cabinets, Combos |
| Tool Bags | `storage-tool-bags` | Open Top, Closed, Backpacks, Totes |
| Tool Belts & Pouches | `storage-belts` | - |
| Wall Organization | `storage-wall` | Pegboards, Shelving, Bin Systems |
| Parts Organizers | `storage-organizers` | Small Parts, Drawer Units, Bins |
| Mobile Workbenches | `storage-workbenches` | - |

#### 🏗️ **Workshop Equipment** (`workshop-equipment`)
*L2: Workbenches, Shop Vacuums, Air Filtration, Lighting, Ladders & Scaffolding*

#### 🚜 **Agriculture** (`agriculture`)
*L2: Farm Equipment, Livestock Supplies, Crop Supplies, Irrigation, Farm Supplies*

#### 🔥 **Plumbing Tools** (`plumbing-tools`)
*L2: Pipe Wrenches, Tube Cutters, Plungers & Augers, Drain Cleaning, Soldering Tools, PEX Tools, Pipe Threaders*

#### ⚡ **Electrical Tools** (`electrical-tools`)
*L2: Wire Strippers, Crimpers, Fish Tapes, Voltage Testers, Conduit Tools, Terminal Tools*

#### 🧱 **Construction & Masonry** (`construction-masonry`)
*L2: Concrete Mixers, Trowels & Floats, Brick Tools, Drywall Tools, Tile Tools, Scaffolding*

#### 🎨 **Painting & Finishing** (`painting-finishing`)
*L2: Paint Sprayers, Rollers & Brushes, Prep Tools, Caulking Tools, Tape & Masking, Ladders & Platforms*

#### 🔲 **Abrasives & Finishing** (`abrasives-finishing`)
*L2: Sandpaper & Sheets, Grinding Wheels, Cutting Discs, Flap Discs, Wire Brushes, Polishing*

#### 🔗 **Adhesives & Sealants** (`adhesives-sealants`)
*L2: Construction Adhesives, Wood Glue, Epoxy, Silicone Sealants, Thread Lockers, Spray Adhesives*

#### ❄️ **HVAC Tools** (`hvac-tools`)
*L2: Manifold Gauges, Vacuum Pumps, Recovery Machines, Leak Detectors, Refrigerant, Ductwork Tools*

#### 🔩 **Fasteners & Hardware** (`fasteners-hardware`)
*L2: Screws, Bolts, Nuts, Washers, Anchors, Nails, Staples, Rivets*

#### 📐 **Test & Measurement** (`test-measurement-tools`)
*L2: Multimeters, Oscilloscopes, Clamp Meters, Thermal Cameras, Sound Meters, Light Meters*

#### 🔧 **Tool Accessories & Parts** (`tool-accessories`)
*L2: Drill Bits, Saw Blades, Router Bits, Sanding Accessories, Battery Packs, Chargers*

#### ⚡ **Generators & Power** (`generators-power`)
*L2: Portable Generators, Inverter Generators, Standby Generators, Transfer Switches, Generator Accessories*

#### 🧹 **Cleaning Equipment** (`cleaning-equipment`)
*L2: Industrial Vacuums, Pressure Washers, Floor Scrubbers, Steam Cleaners, Parts Washers*

---

**Tools & Industrial Attributes (77 total):**

**Tool Specifications:**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| Tool Type | select | Power Tool, Hand Tool, Pneumatic, Hydraulic, Electric, Cordless, Manual | Електроинструмент, Ръчен инструмент, Пневматичен, Хидравличен, Електрически, Акумулаторен, Ръчен |
| Tool Category | select | Drilling, Cutting, Fastening, Grinding, Sanding, Measuring, Welding, Automotive, Garden, Woodworking, Metalworking, Plumbing, Electrical, Construction | Пробиване, Рязане, Закрепване, Шлайфане, Шлифоване, Измерване, Заваряване, Автомобилен, Градински, Дървообработка, Металообработка, ВиК, Електро, Строителство |

**Power & Performance:**
| Attribute | Type | Options |
|-----------|------|---------|
| Battery Voltage | select | 3.6V, 7.2V, 10.8V, 12V, 14.4V, 18V, 20V MAX, 36V, 40V MAX, 54V, 60V MAX, 80V |
| Battery Type | select | Li-Ion, NiCd, NiMH, Lead Acid |
| Battery Capacity (Ah) | select | 1.5Ah, 2.0Ah, 3.0Ah, 4.0Ah, 5.0Ah, 6.0Ah, 8.0Ah, 9.0Ah, 12.0Ah |
| Motor Power (Watts) | select | <500W, 500-750W, 750-1000W, 1000-1500W, 1500-2000W, 2000-3000W, >3000W |
| Motor Type | select | Brushed, Brushless, Universal, Induction |
| RPM/Speed | select | <1000, 1000-3000, 3000-5000, 5000-10000, 10000-20000, 20000-30000, >30000 |
| Variable Speed | boolean | Yes / No |
| Torque (Nm) | select | <20Nm, 20-50Nm, 50-100Nm, 100-200Nm, 200-500Nm, >500Nm |

**Brand & Quality:**
| Attribute | Type | Options |
|-----------|------|---------|
| Brand | select | Bosch, Makita, DeWalt, Milwaukee, Metabo, Hilti, Festool, Ryobi, Black+Decker, Einhell, Parkside, Stanley, Fiskars, Stihl, Husqvarna, Kärcher, Würth, Knipex, Wiha, Wera, Bahco, Gedore, Hazet, Other |
| Product Line | select | Professional/Pro, Home & Garden, Industrial, Compact, Heavy Duty, XR/Xtreme, M12/M18, LXT, CXT, FlexVolt |
| Condition | select | New, Like New, Refurbished, Used - Excellent, Used - Good, Used - Fair, For Parts |
| Warranty Period | select | No Warranty, 1 Year, 2 Years, 3 Years, 5 Years, Lifetime |
| Certification | multiselect | CE, GS, TÜV, VDE, UL, CSA, ISO 9001, OSHA Compliant |

**Safety & Features:**
| Attribute | Type | Options |
|-----------|------|---------|
| Safety Features | multiselect | Anti-Vibration, Soft Start, Overload Protection, Electric Brake, Kickback Protection, Dead Man Switch, Lock-On, Blade Guard |
| IP Rating | select | IP20, IP44, IP54, IP65, IP67, IP68 |
| Noise Level (dB) | select | <70dB, 70-80dB, 80-90dB, 90-100dB, >100dB |
| Dust Collection | select | None, Bag, Port Compatible, Built-in HEPA, Cyclonic |
| LED Work Light | boolean | Yes / No |
| Battery Platform | select | Bosch 18V, Makita LXT, DeWalt 20V MAX, Milwaukee M18, Metabo 18V LTX, Einhell Power X-Change, Ryobi ONE+, Parkside 20V |

**Bulgarian Market Specifics:**
| Attribute | Type | Options (EN) | Options (BG) |
|-----------|------|--------------|--------------|
| Invoice Available | select | Yes - Company Invoice, Yes - Individual Invoice, No Invoice | Да - Фирмена фактура, Да - Лична фактура, Без фактура |
| VAT Included | select | Yes (20% VAT), No (Price + VAT), Export (0% VAT) | Да (20% ДДС), Не (Цена + ДДС), Износ (0% ДДС) |
| Warranty Service Location | select | Bulgaria - Sofia, Bulgaria - Plovdiv, Bulgaria - Varna, Bulgaria - Other, EU Service Center, International | България - София, България - Пловдив, България - Варна, България - Друг, ЕС Сервизен център, Международен |
| Local Availability | select | In Stock Sofia, In Stock Plovdiv, Ships from Bulgaria, Ships from EU, Ships International | Наличен София, Наличен Пловдив, Доставка от България, Доставка от ЕС, Международна доставка |
| Delivery Type | select | Econt, Speedy, Personal Pickup, Courier, Freight | Еконт, Спиди, Личен прием, Куриер, Товарен транспорт |
| Payment Options | multiselect | Cash on Delivery, Bank Transfer, Card Payment, PayPal, Installments, Leasing | Наложен платеж, Банков превод, Картово плащане, PayPal, Разсрочено, Лизинг |

**Dimensions & Specifications:**
| Attribute | Type |
|-----------|------|
| Chuck Size | select: 6mm, 10mm, 13mm, 16mm, 1/4", 3/8", 1/2" |
| Blade/Disc Size | select: 76mm, 115mm, 125mm, 150mm, 180mm, 230mm, 254mm, 305mm, 355mm |
| Cutting Capacity - Wood | select: <25mm, 25-50mm, 50-75mm, 75-100mm, >100mm |
| Cutting Capacity - Metal | select: <3mm, 3-6mm, 6-10mm, 10-15mm, >15mm |
| Set Size | select: Single, 2-Piece, 3-Piece, 5-Piece, 10-Piece, 15-Piece, 20+ Piece |
| Pack Quantity | select: 1, 2, 5, 10, 25, 50, 100, Bulk |

**Additional Features:**
| Attribute | Type |
|-----------|------|
| Professional Grade | boolean |
| Includes Accessories | boolean |
| Rental Available | boolean |
| Bulk Discount Available | boolean |
| Compact/Subcompact | boolean |
| Ergonomic Design | boolean |
| Replacement Parts Available | boolean |
| Color | select: Red, Blue, Yellow, Green, Orange, Black, Teal, Grey |
| Year of Manufacture | select: 2024, 2023, 2022, 2021, 2020, Pre-2020 |
| Model Number | text |
| Original Box/Packaging | boolean |

---

### 📦 21. WHOLESALE (`wholesale`)
> **Updated: January 2025** | **Total: 499 categories (1 L0 + 20 L1 + 161 L2 + 317 L3)** | **70 Attributes**

**L1 Subcategories (20):**

#### 📱 Wholesale Electronics & Tech (`wholesale-electronics`)
- L2: Phone Accessories → L3: Screen Protectors, Cases, Chargers, Cables, Earbuds, Power Banks, Mounts, Styluses
- L2: Consumer Electronics → L3: Speakers, Headphones, Cameras, Smart Devices, GPS, Media Players, Remotes, Drones
- L2: Computer Parts → L3: RAM, Storage, Graphics Cards, CPUs, Motherboards, Power Supplies, Cooling, Cables
- L2: Security & Surveillance → L3: CCTV Cameras, DVR/NVR, Access Control, Alarm Systems, Monitors, Cables, Accessories
- L2: LED Lighting, L2: Cables & Adapters, L2: Batteries & Power, L2: Smart Home Devices, L2: Audio Equipment, L2: Networking Equipment

#### 👗 Wholesale Fashion & Apparel (`wholesale-fashion`)
- L2: Women's Clothing → L3: Dresses, Tops, Pants, Skirts, Outerwear, Activewear, Swimwear, Lingerie, Plus Size
- L2: Men's Clothing → L3: T-Shirts, Shirts, Pants, Jeans, Jackets, Suits, Sportswear, Underwear, Big & Tall
- L2: Shoes & Footwear → L3: Sneakers, Heels, Boots, Sandals, Slippers, Athletic, Kids Shoes, Work Boots
- L2: Bags & Luggage, L2: Accessories & Scarves, L2: Blank Apparel → L3: Blank T-Shirts, Hoodies, Polos, Hats, Tote Bags, Jackets, Tank Tops, Socks
- L2: Sunglasses & Eyewear, L2: Hats & Caps, L2: Belts & Wallets, L2: Children's Clothing → L3: Boys Clothing, Girls Clothing, Baby Clothing, School Uniforms, Sleepwear, Outerwear, Swimwear, Accessories

#### 💄 Wholesale Beauty & Personal Care (`wholesale-beauty`)
- L2: Skincare → L3: Cleansers, Moisturizers, Serums, Masks, Sunscreen, Anti-Aging, Acne Treatment, Eye Care
- L2: Makeup → L3: Foundation, Lipstick, Eyeshadow, Mascara, Brushes, Palettes, Nail Polish, Setting Spray
- L2: Hair Care → L3: Shampoo, Conditioner, Hair Oil, Styling, Hair Color, Hair Tools, Wigs, Extensions
- L2: Fragrances, L2: Nail Products, L2: Men's Grooming, L2: Salon Equipment, L2: Spa Products, L2: Dental Care, L2: Personal Hygiene

#### 🏠 Wholesale Home & Garden (`wholesale-home-garden`)
- L2: Home Decor → L3: Wall Art, Vases, Candles, Mirrors, Clocks, Photo Frames, Artificial Plants, Figurines
- L2: Furniture → L3: Chairs, Tables, Sofas, Beds, Storage, Shelving, Outdoor Furniture, Office Furniture
- L2: Kitchen & Dining → L3: Cookware, Bakeware, Utensils, Storage Containers, Dinnerware, Glassware, Small Appliances, Gadgets
- L2: Bedding & Textiles, L2: Bathroom Products, L2: Cleaning Supplies, L2: Garden Tools, L2: Outdoor Living, L2: Storage & Organization, L2: Lighting Fixtures

#### 🍎 Wholesale Food & Beverages (`wholesale-food`)
- L2: Packaged Foods → L3: Snacks, Candy, Canned Goods, Pasta, Sauces, Spices, Dry Goods, Organic
- L2: Beverages → L3: Soft Drinks, Juices, Tea, Coffee, Energy Drinks, Water, Dairy, Plant-Based
- L2: Confectionery, L2: Organic & Natural, L2: International Foods, L2: Restaurant Ingredients, L2: Baking Supplies, L2: Food Packaging, L2: Beverages Wholesale, L2: Health Foods

#### 🧸 Wholesale Toys & Games (`wholesale-toys`)
- L2: Educational Toys → L3: STEM Toys, Learning Games, Building Blocks, Science Kits, Musical Toys, Art Supplies, Books, Puzzles
- L2: Action Figures → L3: Superheroes, Anime Figures, Movie Characters, Video Game Figures, Collectibles, Playsets, Vehicles, Animals
- L2: Plush Toys → L3: Stuffed Animals, Character Plush, Giant Plush, Interactive Plush, Pillows, Keychains, Licensed Plush, Custom Plush
- L2: Board Games, L2: Outdoor Toys, L2: RC Toys, L2: Dolls & Playsets, L2: Party Supplies → L3: Balloons, Decorations, Tableware, Favors, Costumes, Props, Invitations, Banners
- L2: Trading Cards, L2: Building Sets

#### ⚽ Wholesale Sports & Outdoor (`wholesale-sports`)
- L2: Fitness Equipment → L3: Dumbbells, Resistance Bands, Yoga Mats, Kettlebells, Benches, Cardio Equipment, Accessories, Recovery Tools
- L2: Team Sports Equipment, L2: Camping Gear, L2: Water Sports, L2: Cycling Products, L2: Fishing Tackle, L2: Athletic Apparel, L2: Sports Accessories, L2: Golf Equipment, L2: Martial Arts Supplies

#### 🚗 Wholesale Automotive & Parts (`wholesale-automotive`)
- L2: Car Parts → L3: Filters, Brakes, Suspension, Engine Parts, Electrical, Body Parts, Interior, Exhaust
- L2: Motorcycle Parts → L3: Helmets, Riding Gear, Performance Parts, Fairings, Accessories, Lighting, Tires, Maintenance
- L2: Car Accessories, L2: Tools & Equipment, L2: Tires & Wheels, L2: Car Care Products, L2: Interior Accessories, L2: Electronics & Audio, L2: Truck Parts, L2: Performance Parts

#### ⚕️ Wholesale Health & Medical (`wholesale-health`)
- L2: Medical Supplies → L3: Bandages, Gloves, Masks, Syringes, Thermometers, First Aid, Wound Care, PPE
- L2: Medical Equipment → L3: Blood Pressure Monitors, Glucose Meters, Nebulizers, Wheelchairs, Crutches, Hospital Beds, Diagnostic Tools, Therapy Equipment
- L2: Vitamins & Supplements, L2: OTC Medications, L2: Mobility Aids, L2: Lab Supplies, L2: Dental Supplies, L2: Eye Care, L2: Respiratory Care, L2: Rehabilitation Equipment

#### 📝 Wholesale Office & School (`wholesale-office`)
- L2: Office Supplies, L2: School Supplies, L2: Stationery, L2: Writing Instruments, L2: Filing & Organization, L2: Presentation Supplies, L2: Desk Accessories, L2: Paper Products, L2: Art & Craft Supplies, L2: Office Furniture

#### 🔧 Wholesale Industrial & Hardware (`wholesale-industrial`)
- L2: Hand Tools, L2: Power Tools, L2: Fasteners & Hardware, L2: Safety Equipment, L2: Electrical Supplies, L2: Plumbing Supplies, L2: Welding Equipment, L2: Construction Materials, L2: Janitorial Supplies, L2: MRO Supplies

#### 🐕 Wholesale Pet Supplies (`wholesale-pet`)
- L2: Dog Products, L2: Cat Products, L2: Pet Food, L2: Aquarium Supplies, L2: Bird Supplies, L2: Small Animal Supplies, L2: Pet Accessories, L2: Grooming Supplies, L2: Pet Health, L2: Pet Toys

#### 📦 Wholesale Packaging & Shipping (`wholesale-packaging`)
- L2: Boxes & Cartons, L2: Bubble Wrap & Cushioning, L2: Tape & Adhesives, L2: Poly Bags & Mailers, L2: Labels & Tags, L2: Stretch Film & Shrink Wrap, L2: Packing Peanuts & Fill, L2: Shipping Supplies, L2: Gift Packaging, L2: Display Packaging

#### 🖨️ Wholesale Printing & Customization (`wholesale-printing`)
- L2: Custom T-Shirts, L2: Promotional Products, L2: Business Cards & Printing, L2: Banners & Signs, L2: Labels & Stickers, L2: Embroidery Products, L2: Heat Transfer Materials, L2: Sublimation Products, L2: Screen Printing Supplies, L2: DTG Supplies

#### ⛏️ Wholesale Raw Materials (`wholesale-raw`)
- L2: Textiles & Fabrics, L2: Metals & Alloys, L2: Plastics & Polymers, L2: Chemicals & Compounds, L2: Wood & Lumber, L2: Paper & Cardboard, L2: Glass & Ceramics, L2: Rubber & Silicone, L2: Leather & Faux Leather, L2: Minerals & Aggregates

#### 🎄 Wholesale Seasonal & Holiday (`wholesale-seasonal`)
- L2: Christmas → L3: Trees, Ornaments, Lights, Decorations, Stockings, Wreaths, Gift Wrap, Costumes
- L2: Halloween, L2: Easter, L2: Valentine's Day, L2: Summer/Beach, L2: Back to School, L2: Wedding & Events, L2: New Year, L2: National Holidays, L2: Religious Holidays

#### 🍽️ Wholesale Restaurant & Hospitality (`wholesale-restaurant`)
- L2: Commercial Kitchen → L3: Cookware, Prep Equipment, Storage, Refrigeration, Ovens, Fryers, Mixers, Smallwares
- L2: Tableware & Servingware, L2: Food Containers & Packaging, L2: Cleaning & Sanitation, L2: Disposables, L2: Bar Equipment, L2: Hotel Amenities, L2: Restaurant Furniture, L2: Point of Sale, L2: Uniforms & Apparel

#### 💍 Wholesale Jewelry & Accessories (`wholesale-jewelry`)
- L2: Fashion Jewelry, L2: Fine Jewelry, L2: Watches, L2: Hair Accessories, L2: Body Jewelry, L2: Jewelry Displays, L2: Jewelry Components, L2: Jewelry Tools, L2: Packaging & Boxes, L2: Custom Jewelry

#### 👶 Wholesale Baby & Maternity (`wholesale-baby`)
- L2: Baby Clothing → L3: Onesies, Sleepwear, Outfits, Outerwear, Socks, Hats, Special Occasion, Organic
- L2: Baby Gear → L3: Strollers, Car Seats, High Chairs, Playpens, Carriers, Bouncers, Walkers, Monitors
- L2: Nursery, L2: Feeding, L2: Diapers & Wipes, L2: Bath & Grooming, L2: Baby Toys, L2: Safety Products, L2: Maternity Wear, L2: Maternity Accessories

#### 🎨 Wholesale Crafts & Hobbies (`wholesale-crafts`)
- L2: Art Supplies, L2: Sewing & Fabrics, L2: Beading & Jewelry Making, L2: Scrapbooking, L2: Knitting & Crochet, L2: Woodworking, L2: Model Kits, L2: DIY Craft Kits, L2: Party Crafts, L2: Educational Crafts

---

### 📦 Wholesale Attributes (70 Total)
**Category:** `wholesale`

#### Business & Order Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| MOQ (Minimum Order Quantity) | select | ✅ | ✅ | 1-10, 11-50, 51-100, 101-500, 501-1000, 1000+ |
| Unit Type | select | ❌ | ✅ | Piece, Pack, Box, Carton, Pallet, Container, Set, Pair, Dozen |
| Lead Time | select | ❌ | ✅ | Same Day, 1-3 Days, 3-7 Days, 1-2 Weeks, 2-4 Weeks, 1-2 Months |
| Sample Available | boolean | ❌ | ✅ | Yes/No |
| Customization Available | boolean | ❌ | ✅ | Yes/No |
| Private Label Available | boolean | ❌ | ✅ | Yes/No |

#### Pricing Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Price Type | select | ❌ | ✅ | FOB, CIF, EXW, DDP, DAP |
| Price Tier | select | ❌ | ❌ | Single Price, Tiered, Negotiable, Request Quote |
| Bulk Discount | select | ❌ | ❌ | None, 5-10%, 11-20%, 21-30%, 30%+ |
| Payment Terms | multiselect | ❌ | ✅ | T/T, L/C, PayPal, Western Union, Trade Assurance, Escrow, Net 30, COD |
| Currency | select | ❌ | ❌ | USD, EUR, GBP, BGN, CNY |

#### Supplier Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Supplier Type | select | ❌ | ✅ | Manufacturer, Trading Company, Wholesaler, Distributor, Agent |
| Business Type | select | ❌ | ✅ | Factory Direct, Authorized Dealer, OEM/ODM, Dropshipper, Importer |
| Verified Supplier | boolean | ❌ | ✅ | Yes/No |
| Years in Business | select | ❌ | ✅ | New (<1 year), 1-3 Years, 3-5 Years, 5-10 Years, 10+ Years |
| Export Markets | multiselect | ❌ | ❌ | Europe, North America, South America, Asia, Africa, Middle East, Australia |
| Production Capacity | select | ❌ | ✅ | Small (100-1K/mo), Medium (1K-10K/mo), Large (10K-100K/mo), Enterprise (100K+/mo) |
| Verification Level | select | ❌ | ✅ | Verified Premium, Verified Standard, Basic Verified, Pending, Self-Reported |

#### Shipping & Logistics Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Shipping Method | multiselect | ❌ | ✅ | Air Freight, Sea Freight, Express (DHL/FedEx/UPS), Rail, Truck, Pickup |
| Shipping Port | text | ❌ | ❌ | Free text |
| Packaging Type | select | ❌ | ✅ | Standard, Custom Box, Blister Pack, OPP Bag, Gift Box, Bulk |
| HS Code | text | ❌ | ❌ | Free text |
| Weight per Unit | text | ❌ | ❌ | Free text |
| Carton Dimensions | text | ❌ | ❌ | Free text |

#### Product Specification Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Brand | select | ❌ | ✅ | No Brand, Generic, OEM Brand, Licensed Brand, Own Brand |
| Quality Grade | select | ❌ | ✅ | Premium, Standard, Economy, Overstock, B-Grade |
| Material | text | ❌ | ✅ | Free text |
| Condition | select | ❌ | ✅ | New, Refurbished, Used, Overstock, End of Line |
| Origin Type | select | ❌ | ✅ | Imported, Domestic, Regional, Local |
| Shelf Life | select | ❌ | ✅ | No Expiry, 3 Months, 6 Months, 1 Year, 2 Years, 3+ Years |
| Storage Requirements | select | ❌ | ✅ | No Special, Cool & Dry, Refrigerated, Frozen, Climate Controlled |

#### Certification Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Certification | multiselect | ❌ | ✅ | CE, FCC, RoHS, ISO9001, ISO14001, REACH, UL, FDA, GMP, Organic, BSCI |
| Country of Origin | select | ❌ | ✅ | China, Turkey, Bulgaria, USA, Germany, Italy, India, Vietnam, Poland |
| Import License Required | boolean | ❌ | ✅ | Yes/No |
| Customs Clearance Included | boolean | ❌ | ❌ | Yes/No |

#### Bulgarian B2B Market Attributes (Български B2B)
| Attribute | Attribute (BG) | Type | Options |
|-----------|----------------|------|---------|
| Invoice Available | Фактура | select | Про-форма, Оригинал, Електронна фактура, Касов бон, Без фактура |
| VAT Status | ДДС статус | select | С ДДС, Без ДДС, Reverse Charge, Освободен |
| БУЛСТАТ/ЕИК | БУЛСТАТ/ЕИК | text | Free text |
| Delivery Bulgaria | Доставка България | multiselect | Еконт, Спиди, Лично предаване, До врата, До офис |
| Min Order Bulgaria | Мин. поръчка България | select | 100 лв, 200 лв, 500 лв, 1000 лв, 2000 лв+ |
| Trade Discounts | Търговски отстъпки | select | Без, 5-10%, 11-20%, 21-30%, По договаряне |
| Deferred Payment | Разсрочено плащане | select | Не, 7 дни, 14 дни, 30 дни, 60 дни, По договаряне |

#### Listing & Display Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Stock Status | select | ❌ | ✅ | In Stock, Pre-Order, Low Stock, Out of Stock, Made to Order |
| Listing Type | select | ❌ | ❌ | Standard, Featured, Sponsored, Clearance, Flash Deal |
| Images Available | select | ❌ | ❌ | Product Only, Lifestyle, 360°, Video, Custom Available |
| Data Sheet | boolean | ❌ | ❌ | Yes/No |

#### Additional Wholesale Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Trade Terms | select | ❌ | ❌ | Standard, Exclusive, Non-Exclusive, Territory Rights |
| Return Policy | select | ❌ | ✅ | No Returns, 7 Days, 14 Days, 30 Days, Quality Issues Only |
| Warranty | select | ❌ | ✅ | None, 30 Days, 90 Days, 1 Year, 2 Years, Manufacturer |
| Sample Lead Time | select | ❌ | ❌ | 1-3 Days, 3-7 Days, 1-2 Weeks, 2-4 Weeks |
| Product Lifecycle | select | ❌ | ❌ | New Release, Active, Mature, End of Life, Discontinued |
| Market Target | multiselect | ❌ | ❌ | Retail, Resale, Industrial, Institutional, Government |
| Color Availability | select | ❌ | ❌ | Single Color, 2-5 Colors, 5-10 Colors, 10+ Colors, Custom Colors |
| Size Range | select | ❌ | ❌ | One Size, S-XL, XS-3XL, Kids, Plus Sizes, Custom |
| Packaging MOQ | select | ❌ | ❌ | Same as Product, 100+, 500+, 1000+, Negotiable |
| Print Area | text | ❌ | ❌ | Free text |
| Pantone Matching | boolean | ❌ | ❌ | Yes/No |
| Rush Order Available | boolean | ❌ | ✅ | Yes/No |
| Age Restriction | select | ❌ | ✅ | No Restriction, 18+, 21+, Children Safe, Professional Use |
| Reorder Frequency | select | ❌ | ❌ | High (Weekly), Medium (Monthly), Low (Quarterly), Seasonal |
| Profit Margin | select | ❌ | ❌ | High (50%+), Good (30-50%), Standard (15-30%), Low (<15%) |

---

## Category Attributes

### 🌐 Global Attributes (Applied to ALL products)
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| **Condition** | select | ✅ Yes | ✅ Yes | New, Like New, Very Good, Good, Acceptable, For Parts |
| **Brand** | text | ❌ No | ✅ Yes | Free text |
| **Model** | text | ❌ No | ✅ Yes | Free text |
| **Warranty** | select | ❌ No | ✅ Yes | No warranty, 1 month, 3 months, 6 months, 1 year, 2 years, 3+ years |
| **Original Box** | boolean | ❌ No | ✅ Yes | Yes/No |

---

### 👗 Fashion Attributes
**Category:** `fashion`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Shoe Size EU | select | ❌ | 35-48 |
| Clothing Size | select | ❌ | XXS, XS, S, M, L, XL, XXL, XXXL, One Size |
| Style | select | ❌ | Casual, Formal, Sport, Streetwear, Vintage, Bohemian, Classic, Minimalist |
| Season | multiselect | ❌ | Spring, Summer, Fall, Winter, All Season |
| Pattern | select | ❌ | Solid, Striped, Plaid, Floral, Animal Print, Geometric, Abstract, Camo |
| Size | select | ❌ | XS, S, M, L, XL, XXL, XXXL |
| Color | select | ❌ | Black, White, Blue, Red, Green, Yellow, Pink, Purple, Brown, Gray, Beige, Multi |
| Material | select | ❌ | Cotton, Polyester, Wool, Silk, Leather, Denim, Linen, Synthetic |
| Gender | select | ❌ | Men, Women, Unisex, Boys, Girls |

---

### 🎮 Gaming Attributes (55 Total)
**Category:** `gaming`

#### General Gaming Attributes
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Platform | multiselect | ❌ | PC, PlayStation 5, PlayStation 4, PlayStation 3, Xbox Series X/S, Xbox One, Xbox 360, Nintendo Switch, Nintendo Wii, Nintendo 3DS, Mobile, Retro |
| Game Genre | multiselect | ❌ | Action, Adventure, RPG, Sports, Racing, Shooter, Strategy, Simulation, Fighting, Horror, Puzzle, Platformer, Battle Royale, MOBA, MMO |
| Console Generation | select | ❌ | Current Gen, Last Gen, Retro, Handheld |
| Region | select | ❌ | PAL, NTSC, Region Free, Asia |
| Game Rating | select | ❌ | PEGI 3, PEGI 7, PEGI 12, PEGI 16, PEGI 18 |
| Multiplayer | multiselect | ❌ | Local Co-op, Online Co-op, Competitive Online, Splitscreen, Single Player Only, Cross-Platform |
| Storage Size | select | ❌ | Under 10GB, 10-25GB, 25-50GB, 50-100GB, 100GB+ |
| Includes Case/Manual | boolean | ❌ | Yes/No |

#### PC Gaming Peripherals
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Switch Type | select | ❌ | Cherry MX Red, Cherry MX Blue, Cherry MX Brown, Cherry MX Black, Gateron, Kailh, Membrane, Optical, Custom |
| Keyboard Layout | select | ❌ | Full Size (100%), TKL (80%), 75%, 65%, 60%, 40%, Numpad |
| Keyboard Connection | select | ❌ | Wired USB, Wireless 2.4GHz, Bluetooth, USB-C, Wireless + Wired |
| RGB Lighting | boolean | ❌ | Yes/No |
| Hot Swappable | boolean | ❌ | Yes/No |
| Mouse Sensor | select | ❌ | Optical, Laser, Hero 25K, Focus Pro 30K, PAW3395, PMW3360, Budget Optical |
| Mouse DPI | select | ❌ | Up to 6400, Up to 12000, Up to 16000, Up to 25600, Up to 30000+ |
| Mouse Shape | select | ❌ | Ambidextrous, Ergonomic Right, Ergonomic Left, MMO, Ultralight, Trackball |
| Mouse Buttons | select | ❌ | 2-3 Buttons, 4-6 Buttons, 7-9 Buttons, 10+ Buttons, Customizable |
| Mouse Weight | select | ❌ | Ultralight (<60g), Light (60-80g), Medium (80-100g), Heavy (100g+), Adjustable |

#### Audio/Headset Attributes
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Headset Type | select | ❌ | Over-Ear Closed, Over-Ear Open, On-Ear, In-Ear Gaming, Wireless, Wired |
| Audio Driver | select | ❌ | 40mm, 50mm, 53mm, Planar Magnetic, Custom |
| Surround Sound | select | ❌ | Stereo, 7.1 Virtual, Dolby Atmos, DTS Headphone:X, 3D Audio |
| Microphone Type | select | ❌ | Boom Detachable, Boom Fixed, Retractable, Built-in, No Microphone |
| Active Noise Cancellation | boolean | ❌ | Yes/No |
| Battery Life Hours | select | ❌ | Under 10h, 10-20h, 20-30h, 30-40h, 40h+, Wired |

#### Monitor/Display Attributes
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Screen Size | select | ❌ | 24", 27", 32", 34" Ultrawide, 38" Ultrawide, 49" Super Ultrawide, Portable |
| Resolution | select | ❌ | 1080p FHD, 1440p QHD, 2160p 4K, 1080p Ultrawide, 1440p Ultrawide, 4K Ultrawide |
| Refresh Rate | select | ❌ | 60Hz, 75Hz, 120Hz, 144Hz, 165Hz, 240Hz, 360Hz |
| Panel Type | select | ❌ | IPS, VA, TN, OLED, Mini-LED, QD-OLED |
| Response Time | select | ❌ | 0.5ms, 1ms, 2ms, 4ms, 5ms+ |
| Adaptive Sync | select | ❌ | None, G-Sync, G-Sync Compatible, FreeSync, FreeSync Premium, FreeSync Premium Pro |
| HDR Support | select | ❌ | None, HDR10, HDR400, HDR600, HDR1000, HDR1400, Dolby Vision |
| Curved Display | boolean | ❌ | Yes/No |

#### Console/Controller Attributes
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Controller Type | select | ❌ | Standard Gamepad, Pro Controller, Fight Stick, Racing Wheel, Flight Stick, Mobile Controller |
| Controller Connectivity | select | ❌ | Wired, Wireless Bluetooth, Wireless Proprietary, Wired + Wireless |
| Haptic Feedback | select | ❌ | None, Standard Rumble, HD Rumble, DualSense Haptics, Adaptive Triggers |
| Console Storage | select | ❌ | 500GB, 825GB, 1TB, 2TB, Digital Only, Expandable |
| Console Edition | select | ❌ | Standard, Digital, Pro/Enhanced, Slim, Limited Edition, Bundle |

#### Gaming Furniture
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Chair Style | select | ❌ | Racing Style, Ergonomic Office, Mesh Office, Bean Bag, Floor Chair, Standing Mat |
| Weight Capacity | select | ❌ | Up to 100kg, Up to 120kg, Up to 150kg, Up to 180kg, 180kg+ |
| Adjustable Features | multiselect | ❌ | Height, Armrests 4D, Lumbar Support, Recline, Tilt Lock, Headrest |
| Desk Type | select | ❌ | Standard, L-Shaped, Sit-Stand Electric, Sit-Stand Manual, Compact, Wall-Mount |
| Desk Size | select | ❌ | Small (100-120cm), Medium (120-150cm), Large (150-180cm), XL (180cm+) |
| Cable Management | boolean | ❌ | Yes/No |

#### VR/AR Gaming
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| VR Type | select | ❌ | Standalone, PC VR Tethered, PC VR Wireless, PSVR, Mobile VR |
| Display Resolution Per Eye | select | ❌ | Under 1200x1200, 1200x1200, 1800x1920, 2000x2000+, Passthrough |
| Tracking Type | select | ❌ | Inside-Out 6DOF, Outside-In, 3DOF, Hand Tracking, Full Body |
| FOV | select | ❌ | Under 100°, 100-110°, 110-120°, 120°+ |
| IPD Adjustment | select | ❌ | Fixed, Manual Physical, Software Only, Motorized |

#### Streaming/Content
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Capture Resolution | select | ❌ | 1080p60, 1440p60, 4K30, 4K60, 4K120 |
| Stream Encoding | select | ❌ | H.264, H.265/HEVC, AV1, Hardware Encoding |
| Webcam Resolution | select | ❌ | 720p, 1080p30, 1080p60, 4K30, 4K60 |
| Microphone Pattern | select | ❌ | Cardioid, Omnidirectional, Bidirectional, Multi-Pattern |
| Key Light Type | select | ❌ | Ring Light, Panel Light, Key Light, Softbox, RGB |

---

### 🚗 Vehicles Attributes
**Category:** `vehicles`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Make | text | ✅ | Free text |
| Model | text | ✅ | Free text |
| Year | number | ✅ | Free text |
| Fuel Type | select | ❌ | Petrol, Diesel, Electric, Hybrid, Plug-in Hybrid, LPG, CNG |
| Transmission | select | ❌ | Manual, Automatic, Semi-Automatic, CVT |
| Mileage | number | ❌ | Free text (km) |
| Body Type | select | ❌ | Sedan, Hatchback, Wagon, SUV, Coupe, Convertible, Pickup, Van, Minivan |
| Doors | select | ❌ | 2, 3, 4, 5 |
| Seats | select | ❌ | 2, 4, 5, 6, 7, 8, 9+ |
| Engine Size | select | ❌ | Under 1.0L, 1.0-1.5L, 1.5-2.0L, 2.0-2.5L, 2.5-3.0L, 3.0-4.0L, 4.0L+, Electric |
| Horsepower | select | ❌ | Under 100hp, 100-150hp, 150-200hp, 200-300hp, 300-400hp, 400-500hp, 500hp+ |
| Drivetrain | select | ❌ | FWD, RWD, AWD, 4x4 |
| Color | select | ❌ | White, Black, Silver, Gray, Blue, Red, Green, Brown, Beige, Other |
| Euro Standard | select | ❌ | Euro 3, Euro 4, Euro 5, Euro 6, Euro 6d |
| Service History | select | ❌ | Full, Partial, None, Unknown |
| Accident Free | boolean | ❌ | Yes/No |
| First Owner | boolean | ❌ | Yes/No |

---

### 🔧 Auto Parts Attributes
**Category:** `auto-parts`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Part Condition | select | ✅ | New OEM, New Aftermarket, Used, Refurbished, For Rebuild |
| Compatible Makes | text | ✅ | Free text |
| Compatible Years | text | ❌ | Free text |
| Part Number | text | ❌ | Free text |
| OEM Number | text | ❌ | Free text |
| Position | select | ❌ | Front, Rear, Left, Right, Front Left, Front Right, Rear Left, Rear Right, All |

---

### 💄 Beauty Attributes ✅ UPDATED - 51 Attributes
**Global Beauty Attribute (applies to ALL beauty products):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Gender | select | ❌ | Women, Men, Unisex |

**Skincare Attributes (`skincare`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Skin Type | multiselect | ❌ | Normal, Dry, Oily, Combination, Sensitive, Mature, Acne-Prone |
| Skin Concern | multiselect | ❌ | Anti-Aging, Acne, Dark Spots, Wrinkles, Pores, Redness, Dryness, Dullness, Uneven Texture |
| Key Ingredients | multiselect | ❌ | Vitamin C, Retinol, Hyaluronic Acid, Niacinamide, Salicylic Acid, Glycolic Acid, Peptides, Ceramides, Collagen, SPF, Aloe Vera, Tea Tree, Snail Mucin, Bakuchiol |
| Product Form | select | ❌ | Cream, Gel, Serum, Oil, Foam, Lotion, Essence, Toner, Mist, Balm, Stick |
| SPF Level | select | ❌ | None, SPF 15, SPF 30, SPF 50, SPF 50+ |
| Cruelty Free | boolean | ❌ | Yes/No |
| Vegan | boolean | ❌ | Yes/No |
| Organic | boolean | ❌ | Yes/No |
| Size/Volume | select | ❌ | Travel Size (<30ml), Mini (30-50ml), Standard (50-100ml), Large (100-200ml), Value Size (200ml+) |

**Hair Care Attributes (`haircare`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Hair Type | multiselect | ❌ | Straight, Wavy, Curly, Coily, Fine, Thick, Normal |
| Hair Concern | multiselect | ❌ | Dry, Oily, Damaged, Color-Treated, Dandruff, Hair Loss, Frizzy, Split Ends, Thinning, Gray Coverage |
| Hair Length | select | ❌ | Short, Medium, Long, All Lengths |
| Sulfate Free | boolean | ❌ | Yes/No |
| Paraben Free | boolean | ❌ | Yes/No |
| Silicone Free | boolean | ❌ | Yes/No |

**Fragrance Attributes (`fragrance`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Fragrance Type | select | ❌ | Eau de Parfum, Eau de Toilette, Parfum/Extrait, Eau de Cologne, Body Mist |
| Scent Family | multiselect | ❌ | Floral, Oriental, Woody, Fresh, Citrus, Fruity, Aquatic, Spicy, Musky, Gourmand, Green, Powdery, Amber, Oud |
| Longevity | select | ❌ | 1-2 hours, 3-4 hours, 5-6 hours, 7-10 hours, 12+ hours |
| Sillage | select | ❌ | Light, Moderate, Strong, Enormous |
| Season | multiselect | ❌ | Spring, Summer, Fall, Winter, All Seasons |
| Occasion | multiselect | ❌ | Daily Wear, Office, Evening/Night Out, Date Night, Special Occasion, Casual |
| Fragrance Size | select | ❌ | 5ml, 10ml, 30ml, 50ml, 75ml, 100ml, 150ml, 200ml+ |

**Makeup Attributes (`makeup`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Finish | select | ❌ | Matte, Dewy, Satin, Natural, Luminous, Shimmer, Glitter, Metallic |
| Coverage | select | ❌ | Sheer, Light, Medium, Full, Buildable |
| Skin Tone | select | ❌ | Fair, Light, Light-Medium, Medium, Medium-Tan, Tan, Deep, Very Deep |
| Undertone | select | ❌ | Cool, Warm, Neutral |
| Long Wearing | boolean | ❌ | Yes/No |
| Waterproof | boolean | ❌ | Yes/No |
| Transfer Proof | boolean | ❌ | Yes/No |

**Bath & Body Attributes (`bath-body`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Scent | select | ❌ | Unscented, Floral, Fruity, Fresh, Woody, Sweet, Citrus, Coconut, Vanilla, Lavender, Rose |
| Skin Benefit | multiselect | ❌ | Moisturizing, Exfoliating, Firming, Relaxing, Energizing, Soothing, Anti-Cellulite, Nourishing |
| Natural/Organic | boolean | ❌ | Yes/No |

**Oral Care Attributes (`oral-care`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Oral Care Benefit | multiselect | ❌ | Whitening, Cavity Protection, Sensitive Teeth, Fresh Breath, Gum Care, Plaque Removal, Enamel Strength |
| Fluoride | select | ❌ | With Fluoride, Fluoride Free |
| Flavor | select | ❌ | Mint, Spearmint, Peppermint, Bubblegum, Fruit, Unflavored |

**Men's Grooming Attributes (`mens-grooming`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Beard Length | select | ❌ | Stubble, Short, Medium, Long, All Lengths |
| Shaving Type | select | ❌ | Safety Razor, Cartridge Razor, Electric Shaver, Straight Razor, Disposable |
| Skin Sensitivity | select | ❌ | Normal, Sensitive, Very Sensitive |
| Scent (Men) | select | ❌ | Unscented, Fresh, Woody, Spicy, Citrus, Classic |

**Beauty Tools Attributes (`beauty-tools`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Tool Type | select | ❌ | Manual, Electric/Battery, USB Rechargeable, Corded |
| Material | select | ❌ | Stainless Steel, Ceramic, Titanium, Silicone, Wood, Plastic, Jade, Rose Quartz |
| Heat Settings | select | ❌ | None, Single, Multiple, Adjustable Temperature |
| Travel Friendly | boolean | ❌ | Yes/No |
| Professional Grade | boolean | ❌ | Yes/No |

---

### 🏠 Home & Kitchen Attributes ✅ UPDATED - 45 Attributes
**Category:** `home` (Global + Category-Specific Attributes)

**Furniture Attributes (`furniture`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Furniture Material | select | ❌ | Solid Wood, Engineered Wood, MDF, Particle Board, Metal, Glass, Leather, Fabric, Rattan, Plastic, Bamboo, Marble |
| Style | select | ❌ | Modern, Contemporary, Traditional, Scandinavian, Industrial, Mid-Century, Rustic, Minimalist, Bohemian, Art Deco, Farmhouse, Coastal |
| Color | select | ❌ | White, Black, Gray, Brown, Beige, Oak, Walnut, Cherry, Espresso, Natural Wood, Blue, Green, Yellow, Red, Pink, Multi-color |
| Assembly Required | boolean | ❌ | Yes/No |
| Room | multiselect | ❌ | Living Room, Bedroom, Dining Room, Kitchen, Office, Bathroom, Kids Room, Outdoor, Entryway, Garage |

**Kitchen & Dining Attributes (`kitchen-dining`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Brand | select | ❌ | Bosch, Siemens, Samsung, LG, Whirlpool, Electrolux, Miele, AEG, Gorenje, Beko, Candy, Indesit, Hotpoint, Philips, KitchenAid, Tefal, De'Longhi, Nespresso, Other |
| Energy Rating | select | ❌ | A+++, A++, A+, A, B, C, D, E, F, G |
| Capacity | select | ❌ | Under 100L, 100-200L, 200-300L, 300-400L, 400-500L, Over 500L, 1-2 Servings, 3-4 Servings, 5-6 Servings, 7+ Servings |
| Finish | select | ❌ | Stainless Steel, Black Stainless, White, Black, Silver, Copper, Matte, Glossy |
| Material | select | ❌ | Stainless Steel, Aluminum, Cast Iron, Non-Stick, Ceramic, Glass, Silicone, Porcelain, Bone China, Melamine, Wood, Bamboo |
| Dishwasher Safe | boolean | ❌ | Yes/No |

**Bedding & Bath Attributes (`bedding-bath`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Bed Size | select | ❌ | Single (90x200), Double (140x200), Queen (160x200), King (180x200), Super King (200x200), Kids (70x140), Cot (60x120) |
| Thread Count | select | ❌ | Under 200, 200-300, 300-400, 400-600, 600-800, 800+ |
| Material | select | ❌ | Cotton, Egyptian Cotton, Linen, Silk, Microfiber, Bamboo, Polyester, Cotton Blend, Satin, Flannel, Jersey |
| GSM (Towels) | select | ❌ | 300-400 (Light), 400-500 (Medium), 500-600 (Plush), 600-700 (Luxury), 700+ (Ultra Plush) |

**Lighting Attributes (`lighting`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Light Type | select | ❌ | LED, Incandescent, CFL, Halogen, Smart/WiFi, Solar |
| Color Temperature | select | ❌ | Warm White (2700K), Soft White (3000K), Neutral White (4000K), Cool White (5000K), Daylight (6500K), RGB/Color Changing |
| Dimmable | boolean | ❌ | Yes/No |
| Bulb Base | select | ❌ | E27, E14, GU10, GU5.3, G9, G4, B22, Integrated |
| Lumens | select | ❌ | Under 400 (Accent), 400-800 (Table Lamp), 800-1100 (Room), 1100-1600 (Bright), 1600+ (Very Bright) |

**Home Décor Attributes (`home-decor`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Style | select | ❌ | Modern, Contemporary, Traditional, Bohemian, Scandinavian, Industrial, Farmhouse, Coastal, Minimalist, Vintage, Art Deco, Eclectic |
| Color Family | select | ❌ | Neutral, Earth Tones, Pastels, Bold/Vibrant, Metallics, Monochrome, Multi-Color |
| Room | multiselect | ❌ | Living Room, Bedroom, Dining Room, Kitchen, Bathroom, Office, Entryway, Kids Room, Outdoor |

**Household Attributes (`household`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Scent | select | ❌ | Unscented, Fresh, Lavender, Lemon, Pine, Ocean, Floral, Citrus |
| Eco-Friendly | boolean | ❌ | Yes/No |
| Size/Quantity | select | ❌ | Single, Pack of 2, Pack of 3, Pack of 5, Pack of 10, Bulk Pack, Refill |

**Storage Attributes (`home-storage`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Material | select | ❌ | Plastic, Metal, Wood, Fabric, Wicker, Wire, Cardboard, Canvas |
| Size | select | ❌ | Small (Under 10L), Medium (10-30L), Large (30-60L), Extra Large (60L+), Set/Multiple Sizes |
| Stackable | boolean | ❌ | Yes/No |
| Lid Type | select | ❌ | With Lid, Without Lid, Snap-On Lid, Hinged Lid, Flip Lid |

**Climate Control Attributes (`home-climate`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| BTU/Power | select | ❌ | Under 5000 BTU, 5000-8000 BTU, 8000-12000 BTU, 12000-18000 BTU, 18000-24000 BTU, 24000+ BTU |
| Room Size | select | ❌ | Small (up to 15m²), Medium (15-25m²), Large (25-40m²), Extra Large (40m²+), Whole House |
| Energy Class | select | ❌ | A+++, A++, A+, A, B, C, D |
| WiFi/Smart | boolean | ❌ | Yes/No |

**Home Improvement Attributes (`home-improvement`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Finish Type | select | ❌ | Matte, Satin, Semi-Gloss, Gloss, Eggshell, Flat |
| Indoor/Outdoor | select | ❌ | Indoor Only, Outdoor Only, Indoor/Outdoor |
| DIY Difficulty | select | ❌ | Easy (Beginner), Medium (Intermediate), Hard (Professional) |

**Office & School Attributes (`home-office`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Type | select | ❌ | Desk, Chair, Storage, Accessories, Writing, Paper, Technology |
| Ergonomic | boolean | ❌ | Yes/No |
| For | select | ❌ | Adults, Kids/Students, Both |

**Garden & Outdoor Attributes (`garden-outdoor`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Material | select | ❌ | Rattan/Wicker, Aluminum, Steel, Wood, Teak, Plastic/Resin, Wrought Iron, Cast Aluminum |
| Weather Resistant | boolean | ❌ | Yes/No |
| UV Protected | boolean | ❌ | Yes/No |
| Style | select | ❌ | Modern, Traditional, Coastal, Rustic, Contemporary, Bohemian, Industrial |
| Set Size | select | ❌ | Single Piece, 2-Piece Set, 3-Piece Set, 4-Piece Set, 5+ Piece Set |

---

### 💎 Jewelry & Watches Attributes ✅ UPDATED - 59 Attributes
**Category:** `jewelry-watches`
**Total:** 59 attributes (55 filterable) | **Bilingual:** EN/BG

#### Global Jewelry Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Metal Type | select | ❌ | ✅ | Gold 24K-9K, White/Rose Gold, Platinum 950/900, Sterling Silver 925, Silver 800, Stainless Steel, Titanium, Tungsten, Palladium, Vermeil, Gold Filled/Plated, Mixed |
| Main Stone | multiselect | ❌ | ✅ | Diamond, Ruby, Sapphire, Emerald, Opal, Pearl, Amethyst, Topaz, Aquamarine, Garnet, Tourmaline, Tanzanite, Peridot, Citrine, Turquoise, Morganite, Alexandrite, Lab-Created variants |
| Jewelry Type | select | ❌ | ✅ | Ring, Necklace, Pendant, Bracelet, Bangle, Earrings, Watch, Brooch, Pin, Anklet, Body Jewelry, Hair Jewelry, Cufflinks, Tie Accessories, Set |
| Gender | select | ❌ | ✅ | Women's, Men's, Unisex, Children's |
| Jewelry Condition | select | ✅ | ✅ | New with Tags, New without Tags, Like New, Excellent, Very Good, Good, Fair, Vintage, Antique, For Restoration |
| Jewelry Brand | select | ❌ | ✅ | Tiffany, Cartier, Bulgari, Van Cleef, Harry Winston, Chopard, Graff, Pandora, Swarovski, David Yurman, Mikimoto, Tacori, 27 brands total |
| Style | select | ❌ | ✅ | Classic, Modern, Vintage, Bohemian, Minimalist, Statement, Art Deco, Victorian, Edwardian, Art Nouveau, Gothic, Religious |
| Certification | select | ❌ | ✅ | GIA, AGS, IGI, EGL, HRD Antwerp, GSI, GCAL, No Certification |
| Country of Origin | select | ❌ | ✅ | Italy, USA, India, France, Switzerland, UK, Germany, Thailand, China, Japan, Bulgaria, Belgium +10 more |
| Handmade | boolean | ❌ | ✅ | Yes/No |
| Hallmarked | boolean | ❌ | ✅ | Yes/No |
| Original Box | boolean | ❌ | ✅ | Yes/No |
| Original Papers | boolean | ❌ | ✅ | Yes/No |
| Metal Weight (grams) | number | ❌ | ❌ | Free input |

#### Ring-Specific Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Ring Size EU | select | ❌ | ✅ | 44-75 (32 sizes) |
| Ring Size US | select | ❌ | ✅ | 3-15 (25 sizes with half sizes) |
| Ring Style | select | ❌ | ✅ | Solitaire, Halo, Three-Stone, Cluster, Pavé, Channel Set, Bezel Set, Tension Set, Cathedral, Split Shank, Eternity Band, Stackable, Cocktail, Signet |
| Band Width (mm) | select | ❌ | ✅ | 1mm-10mm+ (14 options) |
| Stone Shape | select | ❌ | ✅ | Round Brilliant, Princess, Cushion, Oval, Emerald, Radiant, Pear, Marquise, Asscher, Heart, Trillion, Baguette, Cabochon, Rose Cut, Old Mine Cut |
| Total Carat Weight | select | ❌ | ✅ | Under 0.25ct to 5.00ct+ (11 ranges) |

#### Diamond 4C's Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Diamond Cut Grade | select | ❌ | ✅ | Excellent/Ideal, Very Good, Good, Fair, Poor, N/A |
| Diamond Color Grade | select | ❌ | ✅ | D-F (Colorless), G-J (Near Colorless), K-L (Faint), M-Z (Light), Fancy Colors |
| Diamond Clarity Grade | select | ❌ | ✅ | FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3 |
| Stone Treatment | select | ❌ | ✅ | None (Natural), Heat Treated, Irradiated, Fracture Filled, HPHT, Lab-Created |

#### Watch-Specific Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Watch Movement | select | ❌ | ✅ | Automatic, Manual/Hand-Wound, Quartz, Solar/Eco-Drive, Kinetic, Spring Drive, Tourbillon, Digital |
| Watch Type | select | ❌ | ✅ | Dress/Formal, Sport, Dive, Chronograph, Pilot, Field/Military, Racing, GMT, Skeleton, Luxury, Smart Watch, Pocket Watch |
| Watch Brand | select | ❌ | ✅ | Rolex, Omega, Patek Philippe, Audemars Piguet, Cartier, IWC, TAG Heuer, Tudor, Seiko, Citizen, Casio, G-Shock, Tissot + 29 more |
| Case Material | select | ❌ | ✅ | Stainless Steel, Yellow/Rose/White Gold, Platinum, Titanium, Ceramic, Carbon Fiber, Bronze, PVD, Two-Tone |
| Case Diameter (mm) | select | ❌ | ✅ | Under 30mm to 48mm+ (9 ranges) |
| Water Resistance | select | ❌ | ✅ | Not Resistant, 3-50+ ATM, Diver Certified (ISO 6425) |
| Dial Color | select | ❌ | ✅ | Black, White, Silver, Blue, Green, Champagne, Gold, Brown, Grey, Mother of Pearl, Skeleton |
| Crystal Type | select | ❌ | ✅ | Sapphire, Mineral, Acrylic/Hesalite, Hardlex |
| Complications | multiselect | ❌ | ✅ | Date, Day-Date, Chronograph, GMT, Moon Phase, Power Reserve, Minute Repeater, Perpetual Calendar, Tourbillon, Tachymeter |
| Watch Strap Type | select | ❌ | ✅ | Metal Bracelet (Oyster/Jubilee/President), Leather, Alligator, Rubber, NATO, Milanese |

#### Necklace/Chain Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Chain Length | select | ❌ | ✅ | 35cm Collar, 40cm Choker, 45cm Princess, 50cm Matinee, 60cm Opera, 90cm Rope |
| Chain Style | select | ❌ | ✅ | Cable, Rope, Box, Snake, Figaro, Curb/Cuban, Byzantine, Herringbone, Omega, Bead |
| Chain Width (mm) | select | ❌ | ✅ | 0.5-1mm Delicate to 7mm+ Statement |

#### Bracelet Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Bracelet Length | select | ❌ | ✅ | 15cm Petite to 23cm+ XX-Large, Adjustable |
| Bracelet Style | select | ❌ | ✅ | Bangle, Cuff, Chain Link, Tennis, Charm, Beaded, Wrap, Cord, Stretch, Hinged |
| Clasp Type | select | ❌ | ✅ | Lobster Claw, Spring Ring, Toggle, Box, Fold-Over, Magnetic, Barrel/Screw |

#### Earring Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Earring Style | select | ❌ | ✅ | Stud, Hoop, Drop/Dangle, Chandelier, Huggie, Climber, Threader, Ear Cuff, Clip-On |
| Earring Back Type | select | ❌ | ✅ | Push Back/Butterfly, Screw Back, Lever Back, French Wire, Clip-On, Omega Back |
| Hoop Diameter | select | ❌ | ✅ | Under 10mm Mini to 50mm+ Statement |

#### Vintage & Estate Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Era/Period | select | ❌ | ✅ | Georgian, Victorian, Edwardian, Art Nouveau, Art Deco, Retro, Mid-Century, Post-War, Vintage, Modern |
| Signed/Maker | boolean | ❌ | ✅ | Yes/No |
| Provenance Documentation | boolean | ❌ | ✅ | Yes/No |

#### Pearl-Specific Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Pearl Type | select | ❌ | ✅ | Akoya, South Sea White/Golden, Tahitian, Freshwater, Keshi, Baroque, Mabe, Natural, Simulated |
| Pearl Size (mm) | select | ❌ | ✅ | Under 5mm to 13mm+ (10 ranges) |
| Pearl Quality | select | ❌ | ✅ | AAA, AA+, AA, A+, A, Commercial |

#### Body Jewelry & Supplies
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Body Jewelry Type | select | ❌ | ✅ | Nose Ring, Belly Button, Tongue, Lip/Labret, Septum, Industrial, Toe Ring, Anklet, Body Chain |
| Gauge Size | select | ❌ | ✅ | 20G (0.8mm) to 00G (10.0mm) |
| Supplies Type | select | ❌ | ✅ | Beads, Findings, Clasps, Wire, Tools, Storage, Cleaning, Packaging |
| Bead Material | select | ❌ | ✅ | Glass, Crystal, Gemstone, Pearl, Metal, Wood, Ceramic, Lampwork, Seed Bead |

#### Additional Attributes
| Attribute | Type | Required | Filterable | Options |
|-----------|------|----------|------------|---------|
| Secondary Stone | multiselect | ❌ | ✅ | Diamond Accent, Ruby, Sapphire, Emerald, Pearl, Amethyst, Topaz, None |
| Number of Stones | select | ❌ | ❌ | 1-3, 4-5, 6-10, 11-20, 20+, Pave/Cluster |
| Resizable | boolean | ❌ | ✅ | Yes/No |
| Engraving Available | boolean | ❌ | ❌ | Yes/No |
| Gift Boxed | boolean | ❌ | ❌ | Yes/No |
| Hypoallergenic | boolean | ❌ | ✅ | Yes/No |

---

### 🐕 Pets Attributes
**Category:** `pets`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Pet Type | select | ✅ | Dog, Cat, Bird, Fish, Small Animal, Reptile, Horse |
| Pet Size | select | ❌ | Extra Small, Small, Medium, Large, Extra Large, Giant |
| Life Stage | select | ❌ | Puppy/Kitten, Junior, Adult, Senior, All Life Stages |
| Product Type | select | ❌ | Food, Treats, Toys, Beds & Furniture, Bowls & Feeders, Collars & Leashes, Grooming, Health & Wellness, Training, Travel |

---

### ⚽ Sports Attributes
**Category:** `sports`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Sport Type | multiselect | ❌ | Running, Cycling, Swimming, Hiking, Fitness, Yoga, Basketball, Football, Tennis, Golf, Skiing, Snowboarding |
| Skill Level | select | ❌ | Beginner, Intermediate, Advanced, Professional |
| Indoor/Outdoor | select | ❌ | Indoor, Outdoor, Both |
| Weight | select | ❌ | Ultra Light, Light, Medium, Heavy |

---

### 🔧 Tools Attributes
**Category:** `tools-home`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Tool Type | select | ❌ | Power Tool, Hand Tool, Measuring, Safety, Storage |
| Power Source | select | ❌ | Corded Electric, Cordless/Battery, Pneumatic, Manual, Gas |
| Voltage | select | ❌ | 12V, 18V, 20V, 36V, 40V, 60V, N/A |
| Includes Accessories | boolean | ❌ | Yes/No |
| Professional Grade | boolean | ❌ | Yes/No |

---

### 👶 Kids Attributes
**Category:** `baby-kids`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Age Range | select | ❌ | 0-3 months, 3-6 months, 6-12 months, 1-2 years, 2-3 years, 3-5 years, 5-8 years, 8-12 years, 12+ years |
| Gender | select | ❌ | Boys, Girls, Unisex |
| Safety Certified | boolean | ❌ | Yes/No |
| Baby Size | select | ❌ | Preemie, Newborn, 0-3M, 3-6M, 6-9M, 9-12M, 12-18M, 18-24M, 2T, 3T, 4T, 5T |

---

### 🎨 Collectibles Attributes ✅ UPDATED - 99 Attributes
**Category:** `collectibles` (Global attributes apply to all collectibles)
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Collectible Type | select | ❌ | Art, Antiques, Coins, Currency, Stamps, Sports Memorabilia, Entertainment Memorabilia, Trading Cards, Comics, Toys & Figures, Autographs, Vintage Clothing, Militaria, Vintage Electronics, Rare Items |
| Era/Period | select | ❌ | Ancient, Medieval, 18th Century, 19th Century, Early 20th Century, Mid-Century, Vintage (1970-1990), Modern, Contemporary |
| Authenticity | select | ❌ | Certified/Authenticated, COA Included, Unverified, Reproduction |
| Signed | boolean | ❌ | Yes/No |
| Numbered Edition | boolean | ❌ | Yes/No |
| Provenance | select | ❌ | Private Collection, Estate Sale, Auction House, Gallery, Direct from Artist, Museum Deaccession, Family Heirloom, Unknown |
| Year/Date | text | ❌ | Free text |
| Country of Origin | select | ❌ | USA, UK, Germany, France, Italy, Japan, China, Bulgaria, Russia, Other European, Other Asian, Other |
| Documentation | multiselect | ❌ | Original Receipt, Appraisal, Authentication Letter, Provenance Documents, Insurance Records, None |
| Storage Condition | select | ❌ | Climate Controlled, Display Case, Safe/Vault, Original Packaging, Standard Storage, Unknown |

**Trading Cards Attributes (`coll-trading-cards`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Card Game | select | ✅ | Pokémon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, Dragon Ball, Lorcana, Flesh and Blood, Weiss Schwarz, Digimon, Sports Cards, Non-Sport Cards, Other |
| Card Condition | select | ✅ | Gem Mint (10), Mint (9), Near Mint-Mint (8), Near Mint (7), Excellent-Mint (6), Excellent (5), Very Good-Excellent (4), Very Good (3), Good (2), Poor (1), Authenticated/Sealed |
| Grading Company | select | ❌ | PSA, BGS (Beckett), CGC, SGC, BGS Black Label, Not Graded |
| Grading Score | select | ❌ | 10 (Gem Mint/Pristine), 9.5 (Gem Mint), 9 (Mint), 8.5 (NM-MT+), 8 (NM-MT), 7.5 (NM+), 7 (NM), 6.5 (EX-MT+), 6 (EX-MT), 5.5 (EX+), 5 (EX), 4 or below, Authentic Only |
| Card Rarity | select | ❌ | Common, Uncommon, Rare, Holo Rare, Reverse Holo, Ultra Rare, Secret Rare, Illustration Rare, Special Art Rare, Hyper Rare, Gold Rare, Promo, 1st Edition |
| Product Type | select | ❌ | Single Card, Booster Pack, Booster Box, Elite Trainer Box, Collection Box, Starter/Theme Deck, Bundle/Lot, Sealed Case, Display Box |
| Language | select | ❌ | English, Japanese, Korean, Chinese, German, French, Spanish, Italian, Portuguese |
| First Edition | boolean | ❌ | Yes/No |
| Shadowless | boolean | ❌ | Yes/No |
| Holographic | boolean | ❌ | Yes/No |

**Art Attributes (`art`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Art Medium | select | ❌ | Oil on Canvas, Acrylic, Watercolor, Pastel, Ink, Charcoal, Pencil, Digital, Mixed Media, Gouache, Tempera, Fresco, Encaustic, Other |
| Art Style | select | ❌ | Abstract, Contemporary, Modern, Impressionist, Expressionist, Realist, Surrealist, Pop Art, Minimalist, Folk Art, Naive, Photorealist, Street Art, Traditional, Other |
| Art Subject | multiselect | ❌ | Portrait, Landscape, Still Life, Abstract, Figurative, Animals, Nature, Architecture, Religious, Historical, Fantasy, Nude, Marine, Cityscape, Other |
| Surface | select | ❌ | Canvas, Paper, Board, Panel, Glass, Metal, Wood, Fabric, Digital, Other |
| Framed | boolean | ❌ | Yes/No |
| Artist | text | ❌ | Free text |
| Certificate of Authenticity | boolean | ❌ | Yes/No |

**Coins & Currency Attributes (`coins-currency`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Coin Type | select | ❌ | Bullion, Numismatic, Commemorative, Circulation, Proof, Ancient, Medieval, Modern, Error Coin, Pattern |
| Coin Metal | select | ❌ | Gold, Silver, Platinum, Palladium, Copper, Bronze, Nickel, Zinc, Aluminum, Bimetallic, Other |
| Coin Grade | select | ❌ | MS/PR 70, MS/PR 69, MS/PR 68, MS/PR 67, MS/PR 65, MS/PR 63, MS/PR 60, AU 58, AU 55, AU 50, XF/EF 45-40, VF 35-20, F 15-12, VG 10-8, G 6-4, AG 3, FR 2, PO 1, Ungraded |
| Grading Service | select | ❌ | PCGS, NGC, ANACS, ICG, CACG, Other, None |
| Coin Country | select | ❌ | USA, Canada, UK, Germany, France, Australia, China, South Africa, Austria, Mexico, Bulgaria, Ancient Roman, Ancient Greek, Byzantine, Other |
| Coin Weight | select | ❌ | 1/10 oz, 1/4 oz, 1/2 oz, 1 oz, 2 oz, 5 oz, 10 oz, 1 kg, Other |
| Coin Fineness | select | ❌ | .999, .9999, .925 (Sterling), .900, .835, .800, .750, .585, .500, Other |

**Comics Attributes (`coll-comics`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Publisher | select | ❌ | Marvel, DC Comics, Image Comics, Dark Horse, IDW, Boom! Studios, Valiant, Dynamite, Viz Media, Kodansha, Shueisha, Other |
| Comic Era | select | ❌ | Golden Age (1938-1956), Silver Age (1956-1970), Bronze Age (1970-1985), Copper Age (1985-1991), Modern Age (1991-Present), Platinum Age (Pre-1938) |
| Comic Grade | select | ❌ | CGC 10.0 (Gem Mint), CGC 9.8 (Near Mint/Mint), CGC 9.6 (Near Mint+), CGC 9.4 (Near Mint), CGC 9.2-9.0, CGC 8.5-8.0, CGC 7.5-7.0, CGC 6.5-6.0, CGC 5.5-5.0, CGC 4.0 or lower, CBCS Graded, Not Graded |
| Key Issue | boolean | ❌ | Yes/No |
| First Appearance | boolean | ❌ | Yes/No |
| Variant Cover | boolean | ❌ | Yes/No |

**Collectible Toys Attributes (`coll-toys`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Toy Brand | select | ❌ | Hasbro, Mattel, LEGO, Funko, Hot Wheels, NECA, McFarlane, Bandai, Good Smile, Kotobukiya, Sideshow, Hot Toys, Mezco, Super7, Other |
| Toy Line/Franchise | select | ❌ | Star Wars, Marvel, DC, Transformers, G.I. Joe, Masters of the Universe, TMNT, Power Rangers, Pokémon, Dragon Ball, One Piece, Naruto, Gundam, Disney, WWE, Other |
| Toy Type | select | ❌ | Action Figure, Statue, Bust, Funko Pop, Model Kit, Diecast, Plush, Doll, Vehicle, Playset, Accessory |
| Toy Scale | select | ❌ | 1:6 (12 inch), 1:10, 1:12 (6 inch), 1:18 (3.75 inch), 1:24, 1:32, 1:43, 1:64, Other |
| Toy Condition | select | ❌ | Mint in Sealed Box (MISB), Mint in Box (MIB), Mint on Card (MOC), Near Mint, Complete Loose, Incomplete Loose, For Parts/Display |
| Exclusive | select | ❌ | Not Exclusive, Convention Exclusive, Store Exclusive, Chase/Variant, Online Exclusive, Regional Exclusive |

**Autographs Attributes (`coll-autographs`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Autograph Category | select | ❌ | Sports, Music, Movies/TV, Historical, Political, Literary, Science, Art, Other |
| Item Type | select | ❌ | Photo, Card, Ball, Jersey/Shirt, Bat/Stick, Helmet, Poster, Book, Album/CD, Script, Document, Artwork, Equipment, Other |
| Authentication | select | ❌ | PSA/DNA, JSA, Beckett, SGC, ACOA, Fanatics, Upper Deck, MLB Hologram, NBA Hologram, In-Person Witnessed, Private COA, None |
| Inscription | boolean | ❌ | Yes/No |
| Personalized | boolean | ❌ | Yes/No |

**Militaria Attributes (`coll-militaria`):**
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Military Era | select | ❌ | Pre-WWI, WWI (1914-1918), Interwar (1918-1939), WWII (1939-1945), Korean War, Vietnam War, Cold War, Modern (Post-1991), Other |
| Military Country | select | ❌ | USA, UK, Germany, France, Russia/USSR, Japan, Italy, Bulgaria, Ottoman Empire, Austria-Hungary, Other Allied, Other Axis, Other |
| Military Branch | select | ❌ | Army, Navy, Air Force, Marines, Special Forces, Cavalry, Artillery, Infantry, Other |
| Item Category | select | ❌ | Medal/Badge, Uniform, Helmet, Weapon (Deactivated), Document, Photo, Equipment, Flag/Patch, Map, Other |
| Deactivated | boolean | ❌ | Yes/No |

---

### 🃏 Trading Card Games Attributes (Hobbies) ✅ UPDATED
**Category:** `hobby-tcg`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Card Game | select | ✅ | Pokémon TCG, Magic: The Gathering, Yu-Gi-Oh!, One Piece TCG, Lorcana, Sports Cards, Other TCG |
| Product Type | select | ❌ | Booster Pack, Booster Box, Elite Trainer Box, Theme Deck, Structure Deck, Bundle, Collection Box, Starter Deck, Accessories |
| Language | select | ❌ | English, Japanese, Korean, Chinese, German, French, Spanish, Italian, Bulgarian |
| Sealed | boolean | ❌ | Yes/No |
| Card Condition | select | ❌ | Mint, Near Mint, Excellent, Good, Played |

---

### 🎲 Board Games & Puzzles Attributes
**Category:** `hobby-tabletop`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Player Count | select | ❌ | 1 Player, 2 Players, 2-4 Players, 3-5 Players, 4-6 Players, 6+ Players, Party (8+) |
| Age Range | select | ❌ | 3+, 6+, 8+, 10+, 12+, 14+, 18+ |
| Play Time | select | ❌ | Under 30 min, 30-60 min, 1-2 hours, 2-4 hours, 4+ hours |
| Complexity | select | ❌ | Light, Light-Medium, Medium, Medium-Heavy, Heavy |

---

### 🚂 Model Building Attributes
**Category:** `hobby-model-building`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Scale | select | ❌ | 1:12, 1:18, 1:24, 1:32, 1:35, 1:43, 1:48, 1:64, 1:72, 1:87 (HO), 1:144, 1:160 (N), 1:200, 1:350, 1:700 |
| Skill Level | select | ❌ | Beginner, Intermediate, Advanced, Expert |
| Assembly | select | ❌ | Snap-Fit (No Glue), Glue Required, Pre-Built/Diecast, Partial Assembly |
| Brand | select | ❌ | Tamiya, Revell, Airfix, Italeri, Academy, Hasegawa, Trumpeter, Dragon, Eduard, ICM, MiniArt, Other |

---

### 🚁 RC Vehicles Attributes
**Category:** `hobby-rc-drones`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| RC Type | select | ❌ | On-Road Car, Off-Road Buggy, Monster Truck, Crawler, Drift Car, Racing Drone, Helicopter, Airplane, Boat, FPV Racing |
| Scale | select | ❌ | 1:5, 1:8, 1:10, 1:12, 1:14, 1:16, 1:18, 1:24, 1:28, Mini/Micro |
| Power Source | select | ❌ | Electric Brushless, Electric Brushed, Nitro/Gas, LiPo Battery, NiMH Battery |
| Ready-to-Run | select | ❌ | RTR (Ready to Run), ARR (Almost Ready), Kit (Build Required), BNF (Bind-N-Fly), PNP (Plug-N-Play) |

---

### ✂️ Handmade & Crafts Attributes
**Category:** `handmade`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Material | multiselect | ❌ | Sterling Silver, Gold Plated, Stainless Steel, Brass, Copper, Leather, Wood, Glass, Ceramic, Polymer Clay, Natural Stones, Resin, Fabric, Paper, Wax |
| Technique | multiselect | ❌ | Hand Sewn, Hand Knit, Crocheted, Hand Painted, Hand Embroidered, Hand Carved, Hand Molded, Hand Woven, Hand Stamped, Wire Wrapped, Macramé, Decoupage, Pyrography |
| Made to Order | boolean | ❌ | Yes/No |
| Customizable | boolean | ❌ | Yes/No |
| Gift Packaging | boolean | ❌ | Yes/No |

---

### 📀 Music & Vinyl Attributes
**Category:** `movies-music`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Format | select | ❌ | Vinyl LP, Vinyl Single 7", Vinyl 10", CD, Cassette, Box Set, Picture Disc, Colored Vinyl |
| Genre | multiselect | ❌ | Rock, Pop, Jazz, Classical, Electronic, Hip-Hop, Metal, Folk, Bulgarian, Soundtracks, Blues, Reggae, World Music |
| Decade | select | ❌ | 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s |
| Pressing | select | ❌ | Original Pressing, Reissue, Remaster, Limited Edition, Promotional |

---

### 🎣 Outdoor Hobbies Attributes
**Category:** `hobby-outdoor`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Activity Type | select | ❌ | Fishing, Hunting, Birdwatching, Camping, Hiking, Gardening, Stargazing, Metal Detecting, Rock Collecting, Geocaching |
| Season | multiselect | ❌ | Spring, Summer, Fall, Winter, Year-Round |

---

### 🎨 Creative Arts Attributes
**Category:** `hobby-creative-arts`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Medium | multiselect | ❌ | Oil Paint, Acrylic, Watercolor, Gouache, Pencil, Charcoal, Pastel, Ink, Digital, Mixed Media |
| Skill Level | select | ❌ | Beginner, Intermediate, Advanced, Professional |
| Brand | select | ❌ | Winsor & Newton, Faber-Castell, Prismacolor, Copic, Wacom, Strathmore, Canson, Golden, Liquitex, Other |

---

### 🎸 Musical Instruments Attributes ✅ UPDATED
**Category:** `musical-instruments`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Instrument Type | select | ❌ | Guitar, Bass, Drums, Keyboard/Piano, Violin, Wind, Brass, Folk/Traditional, Electronic, Accessories |
| Condition | select | ❌ | New, Like New, Excellent, Good, Fair, For Parts/Repair |
| Skill Level | select | ❌ | Beginner/Student, Intermediate, Professional, Vintage/Collector |

---

### 📚 Books Attributes ✅ UPDATED
**Category:** `books`
| Attribute | Type | Required | Options |
|-----------|------|----------|---------|
| Format | select | ❌ | Hardcover, Paperback, Leather Bound, Signed Copy, First Edition, Limited Edition, Slipcase |
| Language | select | ❌ | Bulgarian, English, German, French, Russian, Other |
| Era | select | ❌ | Antiquarian (pre-1900), Vintage (1900-1970), Modern First (1970-2000), Contemporary (2000+) |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Total Categories** | 3,000+ |
| **L0 Active Categories** | 21 |
| **L0 Deprecated Categories** | 4 |
| **Total Category Attributes** | 650+ |
| **Global Attributes** | 6 |
| **Category-Specific Attributes** | 644+ |
| **Attributes with Options** | ~550 |
| **Boolean Attributes** | ~100 |
| **Required Attributes** | 40 |
| **Filterable Attributes** | 640+ |

### Recent Updates:
- **Electronics Expansion (Dec 2025)**: +387 new categories, +78 new attributes
  - Categories: 35 → 387 (L0:1, L1:8, L2:62, L3:316)
  - Smartphones: Complete iPhone lineage (6-16), Samsung Galaxy (S/Z/A/M/Note), Xiaomi, Google Pixel, OnePlus, Huawei
  - Tablets: iPad Pro/Air/Mini, Samsung Tab, Android Tablets, Windows Tablets (Surface), E-Readers (Kindle)
  - PC & Laptops: Laptops by use case, Desktops (Gaming/Office/Mini), Monitors (Gaming/Pro/Ultrawide), Full PC Components
  - PC Components: GPUs (NVIDIA/AMD/Intel), CPUs (Intel/AMD), RAM (DDR4/5), Storage (NVMe/SSD/HDD), Motherboards, PSUs, Cases, Coolers
  - Audio: Complete headphone taxonomy (Over-Ear/On-Ear/TWS/Gaming), Speakers (Bluetooth/Smart/Bookshelf), Home Audio, Microphones
  - Televisions: By Technology (OLED/QLED/Mini-LED), By Size (32"-98"+), By Brand (Samsung/LG/Sony)
  - Cameras: Mirrorless/DSLR/Compact, Lenses by type, Drones (Consumer/Pro/FPV), Full accessories
  - Smart Devices: Wearables (Smartwatches/Fitness), Smart Home (Lights/Locks/Cameras/Vacuums)
  - Accessories: Phone Cases/Chargers/Power Banks, Cables, Laptop/Tablet accessories
  - Key attributes: Model Series, Storage (32GB-1TB), RAM, Screen Size, Refresh Rate (60-500Hz), Panel Type, Resolution
- **E-Mobility Expansion (Dec 2025)**: +108 new categories, +55 new attributes
  - Categories: 1 → 109 (L0:1, L1:9, L2:50, L3:49)
  - NEW: E-Scooters (Adult, Kids, Off-Road, Seated, Performance with L3 variants)
  - NEW: E-Bikes (City, Mountain, Folding, Cargo, Fat Tire, Road, Commuter, Kids)
  - NEW: E-Skateboards & Boards (Skateboards, Longboards, Onewheel, Surfboards)
  - NEW: Hoverboards & Segways (Standard with size variants, Off-Road, Go-Kart Kits)
  - NEW: E-Unicycles (Beginner, Commuter, Performance, Off-Road)
  - NEW: Electric Go-Karts (Kids, Adult, Drift)
  - NEW: E-Mobility Accessories (Helmets, Protection, Bags, Locks, Lights)
  - NEW: E-Mobility Parts (Batteries, Motors, Controllers, Tires, Brakes)
  - NEW: Charging & Power (Home, Portable, Fast, Solar, Stations)
  - Key attributes: Motor Power, Battery Capacity, Range, Max Speed, IP Rating
- **Collectibles Expansion (Dec 2025)**: +197 new categories, +94 new attributes
  - Categories: 17 → 214 (L0:1, L1:14, L2:139, L3:60)
  - NEW: Trading Cards (Pokémon, MTG, Yu-Gi-Oh!, Sports Cards with full grading attributes)
  - NEW: Comics & Graphic Novels (Marvel, DC, Manga, Graded Comics)
  - NEW: Collectible Toys & Figures (Action Figures, Funko Pop, Hot Wheels, LEGO)
  - NEW: Autographs & Signed Items (Sports, Music, Movie/TV with authentication)
  - NEW: Militaria (WWI/WWII items, Medals, Uniforms, Bulgarian Military)
  - NEW: Vintage Electronics (Audio, Cameras, Computers, Gaming)
  - NEW: Rare & Limited Items (Limited Editions, Prototypes, Convention Exclusives)
  - Expanded: Art, Antiques, Coins, Stamps, Memorabilia with comprehensive L2/L3
- **Beauty Expansion (Jan 2025)**: +227 new categories, +51 new attributes
  - Categories: 56 → 275 (L0:1, L1:9, L2:38, L3:227)
  - Complete Men's/Women's/Unisex Fragrance hierarchy
  - Complete Men's Grooming L3 expansion
  - All Beauty subcategories filled with L3

---

*Last updated: December 4, 2025*

