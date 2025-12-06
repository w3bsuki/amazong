/**
 * Mega Menu Configuration
 * 
 * Factory-based approach to reduce boilerplate while maintaining flexibility.
 * Each category only defines its unique properties; defaults handle the rest.
 */

export interface MegaMenuBanner {
  title: string
  titleBg: string
  subtitle: string
  subtitleBg: string
  cta: string
  ctaBg: string
  image: string
  href: string
}

export interface MegaMenuConfig {
  featured: string[]
  maxItems?: number
  columns?: 2 | 3
  showL1sDirectly?: boolean
  columnHeaders?: { title: string; titleBg: string }[]
  banner: MegaMenuBanner
}

/** Maximum items to show per column for compact menus */
export const MAX_MENU_ITEMS = 4

/** Maximum categories to show in the subheader row */
export const MAX_VISIBLE_CATEGORIES = 14

// Default banner CTA text
const DEFAULT_CTA = { en: "Shop Now", bg: "Пазарувай" }
const DEFAULT_SUBTITLE = { en: "Discover our selection", bg: "Открийте нашата селекция" }

/**
 * Factory function to create mega menu config with sensible defaults
 */
function createConfig(
  slug: string,
  featured: string[],
  title: { en: string; bg: string },
  options?: {
    subtitle?: { en: string; bg: string }
    cta?: { en: string; bg: string }
    image?: string
    columns?: 2 | 3
    maxItems?: number
    showL1sDirectly?: boolean
    columnHeaders?: { title: string; titleBg: string }[]
  }
): MegaMenuConfig {
  const {
    subtitle = DEFAULT_SUBTITLE,
    cta = DEFAULT_CTA,
    image = "/placeholder.jpg",
    columns = 3,
    maxItems,
    showL1sDirectly,
    columnHeaders,
  } = options || {}

  return {
    featured,
    columns,
    ...(maxItems && { maxItems }),
    ...(showL1sDirectly && { showL1sDirectly }),
    ...(columnHeaders && { columnHeaders }),
    banner: {
      title: title.en,
      titleBg: title.bg,
      subtitle: subtitle.en,
      subtitleBg: subtitle.bg,
      cta: cta.en,
      ctaBg: cta.bg,
      image,
      href: `/categories/${slug}`,
    },
  }
}

/**
 * Mega Menu Configuration Map
 * 
 * Each entry uses the factory function to reduce repetition.
 * Only unique properties are specified per category.
 */
export const MEGA_MENU_CONFIG: Record<string, MegaMenuConfig> = {
  // Fashion
  fashion: createConfig(
    "fashion",
    ["fashion-mens", "fashion-womens", "fashion-kids"],
    { en: "New Season Arrivals", bg: "Нови предложения" },
    {
      subtitle: { en: "Discover the latest trends in fashion", bg: "Открийте най-новите модни тенденции" },
      image: "/diverse-fashion-collection.png",
    }
  ),

  // Electronics
  electronics: createConfig(
    "electronics",
    ["smartphones", "pc-laptops", "tablets"],
    { en: "Tech Deals", bg: "Техника на промо цени" },
    {
      subtitle: { en: "Save big on the latest electronics", bg: "Спестете от най-новата електроника" },
      cta: { en: "View Deals", bg: "Виж оферти" },
      image: "/modern-smartphone.png",
    }
  ),

  // Computers
  computers: createConfig(
    "computers",
    ["components", "laptops", "peripherals"],
    { en: "Power Up Your Setup", bg: "Ъпгрейднете сетъпа си" },
    {
      subtitle: { en: "Laptops, desktops & components", bg: "Лаптопи, десктопи и компоненти" },
      cta: { en: "Shop Computers", bg: "Виж компютри" },
      image: "/modern-computer-setup.png",
    }
  ),

  // Automotive
  automotive: createConfig(
    "automotive",
    ["vehicles", "auto-parts", "auto-accessories"],
    { en: "Auto Essentials", bg: "Авто екипировка" },
    {
      subtitle: { en: "Parts, accessories & vehicles", bg: "Части, аксесоари и превозни средства" },
      cta: { en: "Shop Auto", bg: "Виж авто" },
      image: "/retro-living-room-tv.png",
    }
  ),

  // Home
  home: createConfig(
    "home",
    ["furniture", "kitchen-dining", "garden-outdoor"],
    { en: "Home Essentials", bg: "За дома" },
    {
      subtitle: { en: "Transform your living space", bg: "Трансформирайте дома си" },
      cta: { en: "Shop Home", bg: "Виж за дома" },
      image: "/cozy-cabin-interior.png",
    }
  ),

  // Sports
  sports: createConfig(
    "sports",
    ["fitness", "cycling", "hiking-camping"],
    { en: "Get Active", bg: "Бъди активен" },
    {
      subtitle: { en: "Gear up for your next adventure", bg: "Екипирай се за следващото приключение" },
      cta: { en: "Shop Sports", bg: "Виж спорт" },
      image: "/fitness-watch.jpg",
    }
  ),

  // Beauty
  beauty: createConfig(
    "beauty",
    ["makeup", "skincare", "haircare"],
    { en: "Beauty Favorites", bg: "Красота" },
    {
      subtitle: { en: "Skincare, makeup & haircare essentials", bg: "Грижа за кожата, грим и косата" },
      cta: { en: "Shop Beauty", bg: "Виж красота" },
      image: "/abstract-beauty.png",
    }
  ),

  // Gaming
  gaming: createConfig(
    "gaming",
    ["pc-gaming-main", "console-gaming", "board-games"],
    { en: "Game On", bg: "Време за игра" },
    {
      subtitle: { en: "PC, Console & Board gaming", bg: "PC, конзолен и настолен гейминг" },
      cta: { en: "Shop Gaming", bg: "Виж гейминг" },
      image: "/gaming-setup.png",
    }
  ),

  // Toys
  toys: createConfig(
    "toys",
    ["building-toys", "educational-toys", "outdoor-play"],
    { en: "Playtime Fun", bg: "Време за игра" },
    {
      subtitle: { en: "Toys for all ages", bg: "Играчки за всички възрасти" },
      cta: { en: "Shop Toys", bg: "Виж играчки" },
      image: "/colorful-toy-collection.png",
    }
  ),

  // Baby & Kids
  "baby-kids": createConfig(
    "baby-kids",
    ["baby-gear", "toys-games", "kids-clothing"],
    { en: "For Little Ones", bg: "За малчуганите" },
    {
      subtitle: { en: "Baby gear, toys & games", bg: "Бебешки артикули, играчки и игри" },
      cta: { en: "Shop Baby", bg: "Виж бебе" },
      image: "/colorful-toy-collection.png",
    }
  ),

  // Pets
  pets: createConfig(
    "pets",
    ["dogs", "cats", "fish-aquatic"],
    { en: "Pet Paradise", bg: "За домашните любимци" },
    {
      subtitle: { en: "Dogs, cats, fish & more", bg: "Кучета, котки, риби и още" },
      cta: { en: "Shop Pets", bg: "Виж зоо" },
    }
  ),

  // Books
  books: createConfig(
    "books",
    ["fiction", "non-fiction", "kids-books"],
    { en: "Reading Corner", bg: "Кът за четене" },
    {
      subtitle: { en: "Books for every interest", bg: "Книги за всеки вкус" },
      cta: { en: "Shop Books", bg: "Виж книги" },
    }
  ),

  // Jewelry & Watches
  "jewelry-watches": createConfig(
    "jewelry-watches",
    ["watches", "fine-jewelry", "fashion-jewelry"],
    { en: "Timeless Elegance", bg: "Вечна елегантност" },
    {
      subtitle: { en: "Watches & fine jewelry", bg: "Часовници и бижута" },
      cta: { en: "Shop Jewelry", bg: "Виж бижута" },
    }
  ),

  // Garden & Outdoor
  "garden-outdoor": createConfig(
    "garden-outdoor",
    ["outdoor-furniture", "garden-tools", "plants-seeds"],
    { en: "Outdoor Living", bg: "Градина и двор" },
    {
      subtitle: { en: "Everything for your garden", bg: "Всичко за градината" },
      cta: { en: "Shop Garden", bg: "Виж градина" },
    }
  ),

  // Health & Wellness
  "health-wellness": createConfig(
    "health-wellness",
    ["supplements-vitamins", "natural-alternative-wellness", "specialty-health"],
    { en: "Wellness Essentials", bg: "Здраве и wellness" },
    {
      subtitle: { en: "Supplements, natural wellness & targeted health", bg: "Добавки, натурално здраве и специализирани грижи" },
      cta: { en: "Shop Health", bg: "Виж здраве" },
    }
  ),

  // Smart Home
  "smart-home": createConfig(
    "smart-home",
    ["smart-security", "smart-speakers", "smart-lighting"],
    { en: "Smart Living", bg: "Умен дом" },
    {
      subtitle: { en: "Automate your home", bg: "Автоматизирайте дома си" },
      cta: { en: "Shop Smart", bg: "Виж умен дом" },
      image: "/smart-speaker.jpg",
    }
  ),

  // Tools & Home Improvement
  "tools-home": createConfig(
    "tools-home",
    ["power-tools", "hand-tools", "electrical"],
    { en: "DIY Tools", bg: "Инструменти" },
    {
      subtitle: { en: "Power & hand tools", bg: "Електро и ръчни инструменти" },
      cta: { en: "Shop Tools", bg: "Виж инструменти" },
    }
  ),

  // Office & School
  "office-school": createConfig(
    "office-school",
    ["office-supplies", "school-supplies", "office-furniture"],
    { en: "Office & School", bg: "Офис и училище" },
    {
      subtitle: { en: "Supplies for work & study", bg: "Консумативи за работа и учене" },
      cta: { en: "Shop Supplies", bg: "Виж консумативи" },
      image: "/office-chair.jpg",
    }
  ),

  // Musical Instruments
  "musical-instruments": createConfig(
    "musical-instruments",
    ["guitars-basses", "keyboards-pianos", "drums-percussion"],
    { en: "Make Music", bg: "Създавай музика" },
    {
      subtitle: { en: "Instruments & gear", bg: "Инструменти и оборудване" },
      cta: { en: "Shop Instruments", bg: "Виж инструменти" },
    }
  ),

  // Movies & Music
  "movies-music": createConfig(
    "movies-music",
    ["vinyl-records", "dvds-bluray", "cds"],
    { en: "Entertainment", bg: "Забавление" },
    {
      subtitle: { en: "Movies, music & more", bg: "Филми, музика и още" },
      cta: { en: "Shop Media", bg: "Виж медия" },
      image: "/diverse-people-listening-headphones.png",
    }
  ),

  // Collectibles
  collectibles: createConfig(
    "collectibles",
    ["art", "antiques", "coins-currency"],
    { en: "Collectibles", bg: "Колекционерски" },
    {
      subtitle: { en: "Art, antiques & rare finds", bg: "Изкуство, антики и редки находки" },
      cta: { en: "Explore", bg: "Разгледай" },
      image: "/vintage-camera-still-life.png",
    }
  ),

  // Grocery
  grocery: createConfig(
    "grocery",
    ["grocery-pantry", "grocery-drinks", "grocery-snacks"],
    { en: "Grocery & Food", bg: "Храна и напитки" },
    {
      subtitle: { en: "Quality food products", bg: "Качествени хранителни продукти" },
      cta: { en: "Shop Grocery", bg: "Виж храна" },
    }
  ),

  // Handmade
  handmade: createConfig(
    "handmade",
    ["handmade-jewelry", "home-decor-crafts", "art-collectibles"],
    { en: "Handmade & Unique", bg: "Ръчна изработка" },
    {
      subtitle: { en: "One-of-a-kind creations", bg: "Уникални творения" },
      cta: { en: "Shop Handmade", bg: "Виж ръчна изработка" },
    }
  ),

  // Industrial
  industrial: createConfig(
    "industrial",
    ["industrial-equipment", "lab-equipment", "safety-equipment"],
    { en: "Industrial & Lab", bg: "Индустриално" },
    {
      subtitle: { en: "Professional equipment", bg: "Професионално оборудване" },
      cta: { en: "Shop Industrial", bg: "Виж индустриално" },
    }
  ),

  // Software
  software: createConfig(
    "software",
    ["office-software", "security-software", "creative-software"],
    { en: "Software", bg: "Софтуер" },
    {
      subtitle: { en: "Digital products & licenses", bg: "Дигитални продукти и лицензи" },
      cta: { en: "Shop Software", bg: "Виж софтуер" },
    }
  ),

  // Services
  services: createConfig(
    "services",
    ["home-services", "professional-services", "event-services"],
    { en: "Services", bg: "Услуги" },
    {
      subtitle: { en: "Find trusted professionals", bg: "Намерете доверени професионалисти" },
      cta: { en: "Browse Services", bg: "Виж услуги" },
    }
  ),

  // Real Estate
  "real-estate": createConfig(
    "real-estate",
    ["residential-sales", "residential-rentals", "commercial"],
    { en: "Real Estate", bg: "Имоти" },
    {
      subtitle: { en: "Buy or rent your dream property", bg: "Купете или наемете мечтания имот" },
      cta: { en: "Browse Properties", bg: "Виж имоти" },
      image: "/cozy-cabin-interior.png",
    }
  ),

  // Gift Cards
  "gift-cards": createConfig(
    "gift-cards",
    ["retail-gift-cards", "restaurant-gift-cards", "entertainment-gift-cards"],
    { en: "Gift Cards", bg: "Ваучери" },
    {
      subtitle: { en: "The perfect gift", bg: "Перфектният подарък" },
      cta: { en: "Shop Gift Cards", bg: "Виж ваучери" },
    }
  ),

  // Bulgarian Traditional
  "bulgarian-traditional": createConfig(
    "bulgarian-traditional",
    ["traditional-foods", "folk-costumes", "crafts-souvenirs"],
    { en: "Bulgarian Treasures", bg: "Българско" },
    {
      subtitle: { en: "Traditional products from Bulgaria", bg: "Традиционни продукти от България" },
      cta: { en: "Discover", bg: "Открий" },
    }
  ),

  // E-Mobility
  "e-mobility": createConfig(
    "e-mobility",
    ["electric-vehicles", "e-scooters", "e-bikes-cat"],
    { en: "E-Mobility", bg: "Електромобилност" },
    {
      subtitle: { en: "Electric vehicles & more", bg: "Електромобили и още" },
      cta: { en: "Go Electric", bg: "Виж електро" },
    }
  ),

  // Hobbies
  hobbies: createConfig(
    "hobbies",
    ["hobby-rc-drones", "musical-instruments", "hobby-tcg"],
    { en: "Hobby Zone", bg: "Хоби зона" },
    {
      subtitle: { en: "RC, models, trading cards & more", bg: "RC, модели, колекционерски карти и още" },
      cta: { en: "Explore Hobbies", bg: "Виж хоби" },
    }
  ),

  // Wholesale
  wholesale: createConfig(
    "wholesale",
    ["wholesale-electronics", "business-supplies", "bulk-products"],
    { en: "Wholesale & B2B", bg: "На едро" },
    {
      subtitle: { en: "Bulk orders for your business", bg: "Количествени поръчки за бизнеса" },
      cta: { en: "Shop Wholesale", bg: "Виж на едро" },
      maxItems: 4,
    }
  ),
}
