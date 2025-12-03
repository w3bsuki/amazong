# 👗 Fashion | Мода

**Category Slug:** `fashion`  
**Icon:** 👗  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Fashion → Women → Dresses |
| **Attributes** | Filtering, Search, Campaigns | Size, Color, Brand, Material |
| **Tags** | Dynamic Collections & SEO | "summer", "vintage", "designer" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
👗 Fashion (L0)
│
├── 👩 Women's Clothing (L1)
│   ├── Dresses (L2)
│   ├── Tops & Blouses (L2)
│   ├── Pants & Jeans (L2)
│   ├── Skirts (L2)
│   ├── Jackets & Coats (L2)
│   ├── Sweaters & Cardigans (L2)
│   ├── Activewear (L2)
│   ├── Swimwear (L2)
│   └── Lingerie & Sleepwear (L2)
│
├── 👨 Men's Clothing (L1)
│   ├── T-Shirts & Polos (L2)
│   ├── Shirts (L2)
│   ├── Pants & Jeans (L2)
│   ├── Shorts (L2)
│   ├── Jackets & Coats (L2)
│   ├── Sweaters & Hoodies (L2)
│   ├── Suits & Blazers (L2)
│   ├── Activewear (L2)
│   └── Underwear & Sleepwear (L2)
│
├── 👟 Shoes (L1)
│   ├── Women's Shoes (L2)
│   ├── Men's Shoes (L2)
│   ├── Sports Shoes (L2)
│   ├── Kids' Shoes (L2)
│   └── Shoe Care & Accessories (L2)
│
├── 👜 Bags & Accessories (L1)
│   ├── Handbags (L2)
│   ├── Backpacks (L2)
│   ├── Wallets (L2)
│   ├── Belts (L2)
│   ├── Hats & Caps (L2)
│   ├── Scarves & Wraps (L2)
│   ├── Sunglasses (L2)
│   └── Gloves (L2)
│
├── 💍 Jewelry & Watches (L1)
│   ├── Necklaces & Pendants (L2)
│   ├── Earrings (L2)
│   ├── Bracelets (L2)
│   ├── Rings (L2)
│   ├── Watches (L2)
│   └── Jewelry Sets (L2)
│
└── 👶 Kids & Baby Fashion (L1)
    ├── Girls' Clothing (L2)
    ├── Boys' Clothing (L2)
    ├── Baby Clothing (L2)
    └── Kids' Accessories (L2)
```

**Total Categories: 1 (L0) + 6 (L1) + 41 (L2) = 48 categories**

---

## 📊 Complete Category Reference

### L1: 👩 WOMEN'S CLOTHING

#### L2: Dresses | Рокли
**Slug:** `womens/dresses`  
**Description:** All types of dresses for women.

**Types (Attribute, not subcategory):**

| EN | BG | Description |
|----|----|----|
| Casual Dress | Ежедневна рокля | Everyday wear |
| Evening Dress | Вечерна рокля | Formal events |
| Cocktail Dress | Коктейлна рокля | Semi-formal |
| Maxi Dress | Макси рокля | Full-length |
| Mini Dress | Мини рокля | Short length |
| Midi Dress | Миди рокля | Mid-length |
| Bodycon Dress | Вталена рокля | Fitted style |
| A-Line Dress | А-силует рокля | Flared style |
| Shirt Dress | Рокля-риза | Shirt style |
| Wrap Dress | Прегърни ме | Wrap style |
| Summer Dress | Лятна рокля | Lightweight |

---

#### L2: Tops & Blouses | Топове и Блузи
**Slug:** `womens/tops-blouses`

| EN | BG | Description |
|----|----|----|
| Blouse | Блуза | Dressy top |
| T-Shirt | Тениска | Casual |
| Tank Top | Потник | Sleeveless |
| Crop Top | Къс топ | Short top |
| Camisole | Камизол | Thin straps |
| Bodysuit | Боди | One-piece |
| Tunic | Туника | Long top |

---

#### L2: Pants & Jeans | Панталони и Дънки
**Slug:** `womens/pants-jeans`

| EN | BG | Description |
|----|----|----|
| Jeans | Дънки | Denim pants |
| Trousers | Панталони | Formal pants |
| Leggings | Клин | Fitted stretch |
| Culottes | Кюлоти | Wide cropped |
| Cargo Pants | Карго панталони | Utility style |
| Palazzo Pants | Широки панталони | Wide leg |
| Joggers | Джогъри | Casual/sport |

---

#### L2: Skirts | Поли
**Slug:** `womens/skirts`

| EN | BG | Description |
|----|----|----|
| Mini Skirt | Мини пола | Short |
| Midi Skirt | Миди пола | Mid-length |
| Maxi Skirt | Макси пола | Full-length |
| Pencil Skirt | Молив пола | Fitted |
| A-Line Skirt | А-силует пола | Flared |
| Pleated Skirt | Плисирана пола | Pleated |
| Denim Skirt | Дънкова пола | Denim |

---

#### L2: Jackets & Coats | Якета и Палта
**Slug:** `womens/jackets-coats`

| EN | BG | Description |
|----|----|----|
| Jacket | Яке | Light outerwear |
| Coat | Палто | Heavy outerwear |
| Blazer | Блейзър | Formal jacket |
| Leather Jacket | Кожено яке | Leather |
| Denim Jacket | Дънково яке | Denim |
| Puffer Jacket | Пухено яке | Insulated |
| Trench Coat | Тренч | Classic style |
| Fur Coat | Кожено палто | Fur/faux fur |
| Parka | Парка | Winter jacket |

---

#### L2: Sweaters & Cardigans | Пуловери и Жилетки
**Slug:** `womens/sweaters-cardigans`

| EN | BG | Description |
|----|----|----|
| Sweater | Пуловер | Pullover |
| Cardigan | Жилетка | Button-front |
| Hoodie | Суитшърт с качулка | Hooded |
| Turtleneck | Поло | High neck |
| Vest | Елек | Sleeveless |
| Poncho | Пончо | Blanket style |

---

#### L2: Activewear | Спортни дрехи
**Slug:** `womens/activewear`

- Sports Bras | Спортни сутиени
- Leggings | Клинове
- Sports Tops | Спортни топове
- Track Pants | Долнища
- Yoga Wear | Дрехи за йога
- Running Wear | Дрехи за бягане
- Gym Sets | Спортни комплекти

---

#### L2: Swimwear | Бански костюми
**Slug:** `womens/swimwear`

- Bikinis | Бикини
- One-Piece | Цял бански
- Tankinis | Танкини
- Cover-Ups | Плажни туники
- Sarongs | Саронги

---

#### L2: Lingerie & Sleepwear | Бельо и Пижами
**Slug:** `womens/lingerie-sleepwear`

- Bras | Сутиени
- Underwear | Бикини
- Shapewear | Оформящо бельо
- Pajamas | Пижами
- Nightgowns | Нощници
- Robes | Халати
- Lingerie Sets | Комплекти бельо

---

### L1: 👨 MEN'S CLOTHING

#### L2: T-Shirts & Polos | Тениски и Полота
**Slug:** `mens/tshirts-polos`

| EN | BG | Description |
|----|----|----|
| T-Shirt | Тениска | Casual |
| Polo Shirt | Поло | Collar |
| Tank Top | Потник | Sleeveless |
| Long Sleeve | Дълъг ръкав | Long sleeve tee |
| Henley | Хенли | Button placket |

---

#### L2: Shirts | Ризи
**Slug:** `mens/shirts`

| EN | BG | Description |
|----|----|----|
| Dress Shirt | Официална риза | Formal |
| Casual Shirt | Ежедневна риза | Casual |
| Flannel Shirt | Фланелена риза | Flannel |
| Denim Shirt | Дънкова риза | Denim |
| Linen Shirt | Ленена риза | Linen |
| Oxford Shirt | Оксфорд риза | Oxford cloth |

---

#### L2: Pants & Jeans | Панталони и Дънки
**Slug:** `mens/pants-jeans`

| EN | BG | Description |
|----|----|----|
| Jeans | Дънки | Denim |
| Chinos | Чинос | Cotton twill |
| Dress Pants | Официални панталони | Formal |
| Cargo Pants | Карго | Utility |
| Joggers | Джогъри | Casual/sport |
| Corduroy | Кадифе | Corduroy |

---

#### L2: Shorts | Къси панталони
**Slug:** `mens/shorts`

| EN | BG | Description |
|----|----|----|
| Casual Shorts | Ежедневни | Casual |
| Cargo Shorts | Карго | Utility |
| Denim Shorts | Дънкови | Denim |
| Athletic Shorts | Спортни | Sports |
| Swim Shorts | Плажни | Swimwear |
| Chino Shorts | Чинос | Cotton |

---

#### L2: Jackets & Coats | Якета и Палта
**Slug:** `mens/jackets-coats`

| EN | BG | Description |
|----|----|----|
| Jacket | Яке | Light outerwear |
| Coat | Палто | Heavy outerwear |
| Blazer | Блейзър | Sport coat |
| Leather Jacket | Кожено яке | Leather |
| Bomber Jacket | Бомбър | Bomber style |
| Denim Jacket | Дънково яке | Denim |
| Puffer Jacket | Пухено яке | Insulated |
| Parka | Парка | Winter |
| Windbreaker | Ветровка | Light rain |

---

#### L2: Sweaters & Hoodies | Пуловери и Суитшърти
**Slug:** `mens/sweaters-hoodies`

| EN | BG | Description |
|----|----|----|
| Sweater | Пуловер | Pullover |
| Hoodie | Суитшърт с качулка | Hooded |
| Sweatshirt | Суитшърт | No hood |
| Cardigan | Жилетка | Button-front |
| Quarter-Zip | Поло яка | Half-zip |
| Vest | Елек | Sleeveless |

---

#### L2: Suits & Blazers | Костюми и Сака
**Slug:** `mens/suits-blazers`

- Full Suits | Пълни костюми
- Blazers | Сака
- Suit Jackets | Сака за костюм
- Suit Pants | Панталони за костюм
- Vests | Жилетки
- Tuxedos | Смокинги

---

#### L2: Activewear | Спортни дрехи
**Slug:** `mens/activewear`

- Sports Tops | Спортни тениски
- Track Pants | Долнища
- Compression Wear | Компресионни дрехи
- Running Gear | Дрехи за бягане
- Gym Wear | Дрехи за фитнес
- Sports Sets | Спортни екипи

---

#### L2: Underwear & Sleepwear | Бельо и Пижами
**Slug:** `mens/underwear-sleepwear`

- Boxers | Боксерки
- Briefs | Слипове
- Boxer Briefs | Боксер слипове
- Undershirts | Фланелки
- Pajamas | Пижами
- Robes | Халати
- Socks | Чорапи

---

### L1: 👟 SHOES

#### L2: Women's Shoes | Дамски обувки
**Slug:** `shoes/womens-shoes`

| EN | BG | Description |
|----|----|----|
| Heels | Токчета | High heels |
| Flats | Обувки без ток | No heel |
| Boots | Ботуши | Boots |
| Ankle Boots | Боти | Ankle height |
| Sandals | Сандали | Open |
| Sneakers | Кецове | Casual |
| Loafers | Мокасини | Slip-on |
| Pumps | Обувки с ток | Classic heels |
| Wedges | Платформи | Wedge heel |
| Espadrilles | Еспадрили | Rope sole |
| Mules | Чехли | Backless |
| Slippers | Пантофи | Indoor |

---

#### L2: Men's Shoes | Мъжки обувки
**Slug:** `shoes/mens-shoes`

| EN | BG | Description |
|----|----|----|
| Dress Shoes | Официални обувки | Formal |
| Oxford Shoes | Оксфорд | Classic |
| Derby Shoes | Дерби | Open lacing |
| Loafers | Мокасини | Slip-on |
| Boots | Ботуши | Boots |
| Chelsea Boots | Челси ботуши | Elastic sides |
| Sneakers | Кецове | Casual |
| Boat Shoes | Лодкарски обувки | Nautical |
| Sandals | Сандали | Open |
| Slippers | Пантофи | Indoor |

---

#### L2: Sports Shoes | Спортни обувки
**Slug:** `shoes/sports-shoes`

- Running Shoes | Маратонки за бягане
- Training Shoes | Обувки за тренировка
- Basketball Shoes | Баскетболни
- Football Boots | Футболни бутонки
- Tennis Shoes | Тенис обувки
- Hiking Shoes | Туристически обувки
- Skateboard Shoes | Скейтборд обувки
- Golf Shoes | Голф обувки

---

#### L2: Kids' Shoes | Детски обувки
**Slug:** `shoes/kids-shoes`

- Girls' Shoes | Момичешки обувки
- Boys' Shoes | Момчешки обувки
- Baby Shoes | Бебешки обувки
- School Shoes | Училищни обувки
- Sports Shoes | Спортни обувки
- Sandals | Сандали
- Boots | Ботуши

---

#### L2: Shoe Care & Accessories | Грижа за обувки
**Slug:** `shoes/shoe-care`

- Shoe Polish | Боя за обувки
- Shoe Trees | Опъвачи
- Insoles | Стелки
- Laces | Връзки
- Shoe Brushes | Четки
- Waterproofing | Импрегниращи препарати
- Shoe Storage | Съхранение

---

### L1: 👜 BAGS & ACCESSORIES

#### L2: Handbags | Дамски чанти
**Slug:** `bags/handbags`

| EN | BG | Description |
|----|----|----|
| Tote Bag | Голяма чанта | Large open |
| Shoulder Bag | Чанта за рамо | Shoulder strap |
| Crossbody Bag | Кросбоди чанта | Cross-body |
| Clutch | Клъч | Small, no strap |
| Satchel | Сатчел | Structured |
| Hobo Bag | Хобо чанта | Slouchy |
| Bucket Bag | Кофа чанта | Bucket shape |
| Messenger Bag | Месинджър | Laptop style |

---

#### L2: Backpacks | Раници
**Slug:** `bags/backpacks`

| EN | BG | Description |
|----|----|----|
| Casual Backpack | Ежедневна раница | Everyday |
| Laptop Backpack | Раница за лаптоп | Tech |
| Travel Backpack | Туристическа раница | Travel |
| Fashion Backpack | Модна раница | Stylish |
| Mini Backpack | Мини раница | Small |
| Sports Backpack | Спортна раница | Athletic |

---

#### L2: Wallets | Портмонета
**Slug:** `bags/wallets`

- Women's Wallets | Дамски портмонета
- Men's Wallets | Мъжки портфейли
- Card Holders | Картодържачи
- Money Clips | Щипки за пари
- Coin Purses | Портмонета за монети
- Travel Wallets | Пътни портфейли

---

#### L2: Belts | Колани
**Slug:** `bags/belts`

- Women's Belts | Дамски колани
- Men's Belts | Мъжки колани
- Leather Belts | Кожени колани
- Canvas Belts | Платнени колани
- Fashion Belts | Модни колани
- Dress Belts | Официални колани

---

#### L2: Hats & Caps | Шапки и Кепета
**Slug:** `bags/hats-caps`

- Baseball Caps | Шапки с козирка
- Beanies | Зимни шапки
- Sun Hats | Слънцезащитни шапки
- Fedoras | Федора шапки
- Bucket Hats | Рибарски шапки
- Berets | Барети
- Winter Hats | Зимни шапки

---

#### L2: Scarves & Wraps | Шалове и Ешарпи
**Slug:** `bags/scarves-wraps`

- Scarves | Шалове
- Silk Scarves | Копринени шалове
- Wool Scarves | Вълнени шалове
- Wraps | Огърлици
- Pashminas | Пашмини
- Bandanas | Бандани
- Infinity Scarves | Тунелни шалове

---

#### L2: Sunglasses | Слънчеви очила
**Slug:** `bags/sunglasses`

| EN | BG | Description |
|----|----|----|
| Aviator | Авиаторски | Classic pilot |
| Wayfarer | Уейфеърър | Iconic style |
| Round | Кръгли | Round frame |
| Cat Eye | Котешко око | Cat eye shape |
| Sport | Спортни | Active wear |
| Oversized | Големи | Statement |
| Polarized | Поляризирани | Glare reduction |

---

#### L2: Gloves | Ръкавици
**Slug:** `bags/gloves`

- Leather Gloves | Кожени ръкавици
- Wool Gloves | Вълнени ръкавици
- Touchscreen Gloves | Ръкавици за тъчскрийн
- Driving Gloves | Шофьорски ръкавици
- Mittens | Ръкавици с един пръст
- Fashion Gloves | Модни ръкавици

---

### L1: 💍 JEWELRY & WATCHES

#### L2: Necklaces & Pendants | Огърлици и Медальони
**Slug:** `jewelry/necklaces`

- Chains | Верижки
- Pendants | Медальони
- Chokers | Чокери
- Statement Necklaces | Масивни огърлици
- Pearl Necklaces | Перлени огърлици
- Layered Necklaces | Многоредови огърлици

---

#### L2: Earrings | Обеци
**Slug:** `jewelry/earrings`

- Studs | Обеци с щифт
- Hoops | Халки
- Drop Earrings | Висящи обеци
- Chandelier | Полилей обеци
- Huggie Earrings | Прилепнали халки
- Ear Cuffs | Ухо клипсове

---

#### L2: Bracelets | Гривни
**Slug:** `jewelry/bracelets`

- Chain Bracelets | Верижни гривни
- Bangles | Гривни халки
- Cuffs | Твърди гривни
- Charm Bracelets | Гривни с висулки
- Tennis Bracelets | Тенис гривни
- Friendship Bracelets | Приятелски гривни
- Leather Bracelets | Кожени гривни

---

#### L2: Rings | Пръстени
**Slug:** `jewelry/rings`

- Fashion Rings | Модни пръстени
- Engagement Rings | Годежни пръстени
- Wedding Bands | Брачни халки
- Cocktail Rings | Коктейлни пръстени
- Stackable Rings | Пръстени за носене заедно
- Signet Rings | Печатни пръстени
- Statement Rings | Масивни пръстени

---

#### L2: Watches | Часовници
**Slug:** `jewelry/watches`

| EN | BG | Description |
|----|----|----|
| Analog Watch | Аналогов часовник | Traditional |
| Digital Watch | Дигитален часовник | LED/LCD |
| Smartwatch | Смарт часовник | Smart features |
| Dress Watch | Официален часовник | Formal |
| Sport Watch | Спортен часовник | Athletic |
| Luxury Watch | Луксозен часовник | High-end |
| Vintage Watch | Винтидж часовник | Classic/antique |

---

#### L2: Jewelry Sets | Комплекти бижута
**Slug:** `jewelry/jewelry-sets`

- Necklace & Earring Sets | Комплект огърлица и обеци
- Full Sets | Пълни комплекти
- Bridal Sets | Сватбени комплекти
- Party Sets | Парти комплекти

---

### L1: 👶 KIDS & BABY FASHION

#### L2: Girls' Clothing | Момичешки дрехи
**Slug:** `kids/girls-clothing`

- Dresses | Рокли
- Tops | Горнища
- Pants & Jeans | Панталони и дънки
- Skirts | Поли
- Jackets & Coats | Якета и палта
- Activewear | Спортни дрехи
- Swimwear | Бански

---

#### L2: Boys' Clothing | Момчешки дрехи
**Slug:** `kids/boys-clothing`

- T-Shirts | Тениски
- Shirts | Ризи
- Pants & Jeans | Панталони и дънки
- Shorts | Къси панталони
- Jackets & Coats | Якета и палта
- Activewear | Спортни дрехи
- Swimwear | Бански

---

#### L2: Baby Clothing | Бебешки дрехи
**Slug:** `kids/baby-clothing`

- Bodysuits | Бодита
- Rompers | Гащеризони
- Sleepsuits | Пижами
- Sets | Комплекти
- Jackets | Якета
- Accessories | Аксесоари

---

#### L2: Kids' Accessories | Детски аксесоари
**Slug:** `kids/kids-accessories`

- Bags | Чанти
- Hats | Шапки
- Gloves | Ръкавици
- Scarves | Шалове
- Hair Accessories | Аксесоари за коса
- Jewelry | Бижута

---

## 🏷️ Attribute System (The Power Layer)

### Clothing Attributes Schema

```typescript
interface ClothingProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "womens/dresses"
  
  // === BASIC INFO ===
  title: string;                 // "Zara Floral Summer Dress"
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === PRODUCT IDENTIFICATION ===
  brand: string;                 // "Zara"
  style: string;                 // "Casual", "Formal", "Bohemian"
  
  // === SIZE & FIT ===
  size: ClothingSize;
  size_system: 'EU' | 'US' | 'UK';
  fit: FitType;
  
  // === APPEARANCE ===
  color: string;
  pattern: PatternType;
  material: string;              // "Cotton", "Polyester", "Silk"
  material_composition: string;  // "95% Cotton, 5% Elastane"
  
  // === STYLE DETAILS ===
  sleeve_length?: SleeveLength;
  neckline?: Neckline;
  length?: LengthType;
  closure?: ClosureType;
  
  // === FEATURES ===
  features: string[];            // ["Pockets", "Lined", "Stretch"]
  occasion: string[];            // ["Casual", "Work", "Party"]
  season: Season[];
  
  // === CONDITION ===
  condition: ProductCondition;
  tags_attached: boolean;
  worn_times?: number;           // For used items
  
  // === CARE ===
  care_instructions: string[];
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer';
  location_city: string;
  location_region: string;
  
  // === LISTING META ===
  images: string[];
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS ===
  tags: string[];                // ["summer", "floral", "midi"]
}

// === ENUMS ===
type ClothingSize = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 
                    '32' | '34' | '36' | '38' | '40' | '42' | '44' | '46' | '48' |
                    'One Size';

type FitType = 'slim' | 'regular' | 'relaxed' | 'oversized' | 'fitted';

type PatternType = 'solid' | 'striped' | 'floral' | 'plaid' | 'polka_dot' | 
                   'animal_print' | 'geometric' | 'abstract' | 'camouflage' | 'tie_dye';

type SleeveLength = 'sleeveless' | 'short' | 'elbow' | 'three_quarter' | 'long';

type Neckline = 'crew' | 'v_neck' | 'scoop' | 'off_shoulder' | 'halter' | 
                'turtle' | 'cowl' | 'square' | 'boat';

type LengthType = 'mini' | 'midi' | 'maxi' | 'knee' | 'ankle' | 'cropped';

type ClosureType = 'zipper' | 'buttons' | 'snap' | 'tie' | 'elastic' | 'hook' | 'none';

type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all_season';

type ProductCondition = 'new_with_tags' | 'new_without_tags' | 'like_new' | 'good' | 'fair';
```

### Shoes Attributes Schema

```typescript
interface ShoeProduct {
  id: string;
  category_id: string;
  
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  
  // === SHOE IDENTIFICATION ===
  brand: string;
  style: string;
  
  // === SIZE ===
  size: number;                  // EU size: 35-47
  size_system: 'EU' | 'US' | 'UK';
  width: 'narrow' | 'standard' | 'wide' | 'extra_wide';
  
  // === APPEARANCE ===
  color: string;
  material: string;              // "Leather", "Suede", "Canvas"
  sole_material: string;         // "Rubber", "Leather"
  
  // === STYLE DETAILS ===
  heel_height?: number;          // In cm
  heel_type?: HeelType;
  toe_style?: ToeStyle;
  closure: ShoeClosureType;
  
  // === FEATURES ===
  features: string[];            // ["Cushioned", "Waterproof", "Breathable"]
  occasion: string[];
  
  // === CONDITION ===
  condition: ProductCondition;
  original_box: boolean;
  
  seller_type: 'private' | 'dealer';
  location_city: string;
  
  images: string[];
}

type HeelType = 'flat' | 'low' | 'mid' | 'high' | 'stiletto' | 'block' | 'wedge' | 'platform';
type ToeStyle = 'round' | 'pointed' | 'square' | 'almond' | 'open' | 'peep';
type ShoeClosureType = 'lace_up' | 'slip_on' | 'buckle' | 'velcro' | 'zipper' | 'strap';
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "Summer Collection" Campaign
SELECT * FROM products 
WHERE category LIKE 'fashion/%'
AND attributes->'season' ? 'summer';

-- 🏷️ "Designer Brands" Campaign  
SELECT * FROM products 
WHERE category LIKE 'fashion/%'
AND attributes->>'brand' IN ('Gucci', 'Louis Vuitton', 'Prada', 'Chanel', 'Dior');

-- 🏷️ "Budget Fashion Under 100 лв" Campaign
SELECT * FROM products 
WHERE category LIKE 'fashion/%'
AND price <= 100
AND attributes->>'condition' IN ('new_with_tags', 'new_without_tags');

-- 🏷️ "Little Black Dress" Campaign
SELECT * FROM products 
WHERE category = 'womens/dresses'
AND attributes->>'color' = 'Black'
AND attributes->'occasion' ? 'Party';

-- 🏷️ "Work Wardrobe"
SELECT * FROM products 
WHERE category LIKE 'fashion/%'
AND attributes->'occasion' ? 'Work';
```

### Search Filter Configuration

```typescript
const clothingFilters = {
  // Price & Location (Always visible)
  price: { type: 'range', min: 0, max: 5000, step: 10 },
  location: { type: 'location', regions: bulgarianRegions },
  
  // Main Filters
  brand: { type: 'searchable-select', options: fashionBrands },
  size: { type: 'multi-select', options: clothingSizes },
  color: { type: 'color-picker' },
  
  // Style
  material: { type: 'multi-select' },
  pattern: { type: 'multi-select' },
  style: { type: 'multi-select' },
  
  // Condition
  condition: { type: 'multi-select' },
  
  // Other
  seller_type: { type: 'radio', options: ['all', 'private', 'dealer'] },
  season: { type: 'multi-select' },
};

const shoeFilters = {
  price: { type: 'range', min: 0, max: 2000, step: 10 },
  brand: { type: 'searchable-select', options: shoeBrands },
  
  size: { type: 'multi-select', options: shoeSizes },
  color: { type: 'color-picker' },
  material: { type: 'multi-select' },
  
  heel_height: { type: 'range', min: 0, max: 15 },
  
  condition: { type: 'multi-select' },
  seller_type: { type: 'radio' },
};
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('fashion', 'Fashion', 'Мода', 'fashion', 'fashion', NULL, 0, '👗', 3, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('womens', 'Women''s Clothing', 'Дамски дрехи', 'womens', 'fashion/womens', 'fashion', 1, '👩', 1, true),
('mens', 'Men''s Clothing', 'Мъжки дрехи', 'mens', 'fashion/mens', 'fashion', 1, '👨', 2, true),
('shoes', 'Shoes', 'Обувки', 'shoes', 'fashion/shoes', 'fashion', 1, '👟', 3, true),
('bags', 'Bags & Accessories', 'Чанти и аксесоари', 'bags', 'fashion/bags', 'fashion', 1, '👜', 4, true),
('jewelry', 'Jewelry & Watches', 'Бижута и часовници', 'jewelry', 'fashion/jewelry', 'fashion', 1, '💍', 5, true),
('kids-fashion', 'Kids & Baby Fashion', 'Детска мода', 'kids', 'fashion/kids', 'fashion', 1, '👶', 6, true);

-- L2: Women's Clothing
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('womens-dresses', 'Dresses', 'Рокли', 'dresses', 'womens/dresses', 'womens', 2, '👗', 1, true),
('womens-tops', 'Tops & Blouses', 'Топове и блузи', 'tops-blouses', 'womens/tops-blouses', 'womens', 2, '👚', 2, true),
('womens-pants', 'Pants & Jeans', 'Панталони и дънки', 'pants-jeans', 'womens/pants-jeans', 'womens', 2, '👖', 3, true),
('womens-skirts', 'Skirts', 'Поли', 'skirts', 'womens/skirts', 'womens', 2, '🩱', 4, true),
('womens-jackets', 'Jackets & Coats', 'Якета и палта', 'jackets-coats', 'womens/jackets-coats', 'womens', 2, '🧥', 5, true),
('womens-sweaters', 'Sweaters & Cardigans', 'Пуловери и жилетки', 'sweaters-cardigans', 'womens/sweaters-cardigans', 'womens', 2, '🧶', 6, true),
('womens-activewear', 'Activewear', 'Спортни дрехи', 'activewear', 'womens/activewear', 'womens', 2, '🏃‍♀️', 7, true),
('womens-swimwear', 'Swimwear', 'Бански', 'swimwear', 'womens/swimwear', 'womens', 2, '👙', 8, true),
('womens-lingerie', 'Lingerie & Sleepwear', 'Бельо и пижами', 'lingerie-sleepwear', 'womens/lingerie-sleepwear', 'womens', 2, '🩲', 9, true);

-- L2: Men's Clothing
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('mens-tshirts', 'T-Shirts & Polos', 'Тениски и полота', 'tshirts-polos', 'mens/tshirts-polos', 'mens', 2, '👕', 1, true),
('mens-shirts', 'Shirts', 'Ризи', 'shirts', 'mens/shirts', 'mens', 2, '👔', 2, true),
('mens-pants', 'Pants & Jeans', 'Панталони и дънки', 'pants-jeans', 'mens/pants-jeans', 'mens', 2, '👖', 3, true),
('mens-shorts', 'Shorts', 'Къси панталони', 'shorts', 'mens/shorts', 'mens', 2, '🩳', 4, true),
('mens-jackets', 'Jackets & Coats', 'Якета и палта', 'jackets-coats', 'mens/jackets-coats', 'mens', 2, '🧥', 5, true),
('mens-sweaters', 'Sweaters & Hoodies', 'Пуловери и суитшърти', 'sweaters-hoodies', 'mens/sweaters-hoodies', 'mens', 2, '🧥', 6, true),
('mens-suits', 'Suits & Blazers', 'Костюми и сака', 'suits-blazers', 'mens/suits-blazers', 'mens', 2, '🤵', 7, true),
('mens-activewear', 'Activewear', 'Спортни дрехи', 'activewear', 'mens/activewear', 'mens', 2, '🏃', 8, true),
('mens-underwear', 'Underwear & Sleepwear', 'Бельо и пижами', 'underwear-sleepwear', 'mens/underwear-sleepwear', 'mens', 2, '🩲', 9, true);

-- L2: Shoes
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('shoes-womens', 'Women''s Shoes', 'Дамски обувки', 'womens-shoes', 'shoes/womens-shoes', 'shoes', 2, '👠', 1, true),
('shoes-mens', 'Men''s Shoes', 'Мъжки обувки', 'mens-shoes', 'shoes/mens-shoes', 'shoes', 2, '👞', 2, true),
('shoes-sports', 'Sports Shoes', 'Спортни обувки', 'sports-shoes', 'shoes/sports-shoes', 'shoes', 2, '👟', 3, true),
('shoes-kids', 'Kids'' Shoes', 'Детски обувки', 'kids-shoes', 'shoes/kids-shoes', 'shoes', 2, '👶', 4, true),
('shoes-care', 'Shoe Care & Accessories', 'Грижа за обувки', 'shoe-care', 'shoes/shoe-care', 'shoes', 2, '🧴', 5, true);

-- L2: Bags & Accessories
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('bags-handbags', 'Handbags', 'Дамски чанти', 'handbags', 'bags/handbags', 'bags', 2, '👜', 1, true),
('bags-backpacks', 'Backpacks', 'Раници', 'backpacks', 'bags/backpacks', 'bags', 2, '🎒', 2, true),
('bags-wallets', 'Wallets', 'Портмонета', 'wallets', 'bags/wallets', 'bags', 2, '👛', 3, true),
('bags-belts', 'Belts', 'Колани', 'belts', 'bags/belts', 'bags', 2, '🎽', 4, true),
('bags-hats', 'Hats & Caps', 'Шапки и кепета', 'hats-caps', 'bags/hats-caps', 'bags', 2, '🧢', 5, true),
('bags-scarves', 'Scarves & Wraps', 'Шалове и ешарпи', 'scarves-wraps', 'bags/scarves-wraps', 'bags', 2, '🧣', 6, true),
('bags-sunglasses', 'Sunglasses', 'Слънчеви очила', 'sunglasses', 'bags/sunglasses', 'bags', 2, '🕶️', 7, true),
('bags-gloves', 'Gloves', 'Ръкавици', 'gloves', 'bags/gloves', 'bags', 2, '🧤', 8, true);

-- L2: Jewelry & Watches
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('jewelry-necklaces', 'Necklaces & Pendants', 'Огърлици и медальони', 'necklaces', 'jewelry/necklaces', 'jewelry', 2, '📿', 1, true),
('jewelry-earrings', 'Earrings', 'Обеци', 'earrings', 'jewelry/earrings', 'jewelry', 2, '💎', 2, true),
('jewelry-bracelets', 'Bracelets', 'Гривни', 'bracelets', 'jewelry/bracelets', 'jewelry', 2, '📿', 3, true),
('jewelry-rings', 'Rings', 'Пръстени', 'rings', 'jewelry/rings', 'jewelry', 2, '💍', 4, true),
('jewelry-watches', 'Watches', 'Часовници', 'watches', 'jewelry/watches', 'jewelry', 2, '⌚', 5, true),
('jewelry-sets', 'Jewelry Sets', 'Комплекти бижута', 'jewelry-sets', 'jewelry/jewelry-sets', 'jewelry', 2, '💎', 6, true);

-- L2: Kids & Baby Fashion
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('kids-girls', 'Girls'' Clothing', 'Момичешки дрехи', 'girls-clothing', 'kids/girls-clothing', 'kids-fashion', 2, '👧', 1, true),
('kids-boys', 'Boys'' Clothing', 'Момчешки дрехи', 'boys-clothing', 'kids/boys-clothing', 'kids-fashion', 2, '👦', 2, true),
('kids-baby', 'Baby Clothing', 'Бебешки дрехи', 'baby-clothing', 'kids/baby-clothing', 'kids-fashion', 2, '👶', 3, true),
('kids-accessories', 'Kids'' Accessories', 'Детски аксесоари', 'kids-accessories', 'kids/kids-accessories', 'kids-fashion', 2, '🎀', 4, true);
```

### Fashion Brands Reference Data

```sql
-- Popular fashion brands for Bulgaria
INSERT INTO public.fashion_brands (id, name, category, is_popular, is_luxury, display_order) VALUES
-- Mass Market (Popular in Bulgaria)
('zara', 'Zara', 'clothing', true, false, 1),
('hm', 'H&M', 'clothing', true, false, 2),
('reserved', 'Reserved', 'clothing', true, false, 3),
('bershka', 'Bershka', 'clothing', true, false, 4),
('pull-bear', 'Pull & Bear', 'clothing', true, false, 5),
('stradivarius', 'Stradivarius', 'clothing', true, false, 6),
('mango', 'Mango', 'clothing', true, false, 7),
('massimo-dutti', 'Massimo Dutti', 'clothing', true, false, 8),
('lcw', 'LC Waikiki', 'clothing', true, false, 9),
('koton', 'Koton', 'clothing', true, false, 10),

-- Sports Brands
('nike', 'Nike', 'sports', true, false, 20),
('adidas', 'Adidas', 'sports', true, false, 21),
('puma', 'Puma', 'sports', true, false, 22),
('reebok', 'Reebok', 'sports', false, false, 23),
('under-armour', 'Under Armour', 'sports', false, false, 24),
('new-balance', 'New Balance', 'sports', false, false, 25),

-- Luxury Brands
('gucci', 'Gucci', 'luxury', false, true, 50),
('louis-vuitton', 'Louis Vuitton', 'luxury', false, true, 51),
('prada', 'Prada', 'luxury', false, true, 52),
('chanel', 'Chanel', 'luxury', false, true, 53),
('dior', 'Dior', 'luxury', false, true, 54),
('versace', 'Versace', 'luxury', false, true, 55),
('burberry', 'Burberry', 'luxury', false, true, 56),

-- Denim
('levis', 'Levi''s', 'denim', true, false, 70),
('diesel', 'Diesel', 'denim', false, false, 71),
('guess', 'Guess', 'denim', false, false, 72),
('calvin-klein', 'Calvin Klein', 'denim', false, false, 73);
```

---

## 🔍 Example JSONB Queries

```sql
-- Find all summer dresses size M
SELECT * FROM products 
WHERE category_id = 'womens-dresses'
AND attributes->>'size' = 'M'
AND attributes->'season' ? 'summer';

-- Find all Nike shoes size 42
SELECT * FROM products 
WHERE category_id LIKE 'shoes-%'
AND attributes->>'brand' = 'Nike'
AND (attributes->>'size')::numeric = 42;

-- Find designer handbags under 1000 лв
SELECT * FROM products 
WHERE category_id = 'bags-handbags'
AND attributes->>'brand' IN ('Gucci', 'Prada', 'Louis Vuitton')
AND price <= 1000;

-- Find men's suits in black or navy
SELECT * FROM products 
WHERE category_id = 'mens-suits'
AND attributes->>'color' IN ('Black', 'Navy');
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Fashion | Мода |
| Women's Clothing | Дамски дрехи |
| Men's Clothing | Мъжки дрехи |
| Dresses | Рокли |
| Tops & Blouses | Топове и блузи |
| Pants & Jeans | Панталони и дънки |
| Shoes | Обувки |
| Bags & Accessories | Чанти и аксесоари |
| Jewelry & Watches | Бижута и часовници |
| Kids & Baby Fashion | Детска мода |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Size | Размер |
| Color | Цвят |
| Material | Материал |
| Style | Стил |
| Condition | Състояние |
| Season | Сезон |
| Pattern | Шарка |
| Fit | Кройка |

### Attribute Values

| EN | BG |
|----|----|
| New with tags | Ново с етикет |
| New without tags | Ново без етикет |
| Like new | Като ново |
| Good | Добро |
| Fair | Задоволително |
| Cotton | Памук |
| Leather | Кожа |
| Silk | Коприна |
| Wool | Вълна |
| Polyester | Полиестер |
| Summer | Лято |
| Winter | Зима |
| Spring | Пролет |
| Fall | Есен |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add fashion brands reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/fashion (tree structure)
- [ ] GET /categories/fashion/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Product listing form (multi-step)
- [ ] Search filters component
- [ ] Size guide component
- [ ] Color picker component
- [ ] Results grid/list view
- [ ] Product detail page

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 48  
**Created:** December 3, 2025
