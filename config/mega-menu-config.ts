/**
 * Mega Menu Configuration
 * 
 * This file contains all the static configuration data for the category subheader mega menus.
 * Separated from UI logic following shadcn/ui best practices.
 * 
 * Each L0 category can have:
 * - featured: Array of L1 category slugs to highlight (shown with their L2 children)
 * - columns: Number of columns (2 or 3)
 * - maxItems: Maximum items per column (default 4)
 * - showL1sDirectly: Show L1 categories directly instead of drilling into L2
 * - columnHeaders: Custom headers when using showL1sDirectly
 * - banner: CTA banner configuration with localized text
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
  /** Featured L1 category slugs - the most important ones to highlight (show with L2 children) */
  featured: string[]
  /** Max items to show per column (default 4 for compact look) */
  maxItems?: number
  /** Number of columns (2 or 3) - default is 2 */
  columns?: 2 | 3
  /** Show L1 categories directly instead of drilling into L2 children */
  showL1sDirectly?: boolean
  /** Column headers when using showL1sDirectly */
  columnHeaders?: { title: string; titleBg: string }[]
  /** Banner CTA config */
  banner: MegaMenuBanner
}

/** Maximum items to show per column for compact menus */
export const MAX_MENU_ITEMS = 4

/** 
 * Maximum categories to show in the subheader row.
 * Categories fill the full container width, rest go to "Всички" dropdown.
 */
export const MAX_VISIBLE_CATEGORIES = 14

/** Categories to always show in the visible row (by slug) */
export const PRIORITY_VISIBLE_CATEGORIES = ["books"]

/** Categories to hide from visible subheader row - they go to Всички dropdown */
export const HIDDEN_FROM_SUBHEADER = [
  "jewelry-watches",
  "software",
  "wholesale",
  "tools-home",
  "collectibles",
  "services",
  "movies-music",
  "jobs",
  "bulgarian-traditional",
  "e-mobility",
]

export const MEGA_MENU_CONFIG: Record<string, MegaMenuConfig> = {
  // ===== FASHION =====
  // L1s: fashion-mens (4), fashion-womens (4), fashion-kids (3), fashion-unisex (3)
  "fashion": {
    featured: ["fashion-mens", "fashion-womens", "fashion-kids"],
    columns: 3,
    banner: {
      title: "New Season Arrivals",
      titleBg: "Нови предложения",
      subtitle: "Discover the latest trends in fashion",
      subtitleBg: "Открийте най-новите модни тенденции",
      cta: "Shop Now",
      ctaBg: "Пазарувай",
      image: "/diverse-fashion-collection.png",
      href: "/categories/fashion"
    }
  },
  // ===== ELECTRONICS =====
  // L1s: smartphones (6), pc-laptops (5), tablets (6), wearables (4), tv-audio (5)
  "electronics": {
    featured: ["smartphones", "pc-laptops", "tablets"],
    columns: 3,
    banner: {
      title: "Tech Deals",
      titleBg: "Техника на промо цени",
      subtitle: "Save big on the latest electronics",
      subtitleBg: "Спестете от най-новата електроника",
      cta: "View Deals",
      ctaBg: "Виж оферти",
      image: "/modern-smartphone.png",
      href: "/categories/electronics"
    }
  },
  // ===== COMPUTERS =====
  // L1s: laptops (4), components (9), desktops (5), peripherals (7), networking (4)
  "computers": {
    featured: ["components", "laptops", "peripherals"],
    columns: 3,
    banner: {
      title: "Power Up Your Setup",
      titleBg: "Ъпгрейднете сетъпа си",
      subtitle: "Laptops, desktops & components",
      subtitleBg: "Лаптопи, десктопи и компоненти",
      cta: "Shop Computers",
      ctaBg: "Виж компютри",
      image: "/modern-computer-setup.png",
      href: "/categories/computers"
    }
  },
  // ===== AUTOMOTIVE =====
  // L1s: vehicles (9), auto-parts (9), auto-accessories (7), electric-vehicles (4), e-scooters (3), e-bikes-cat (3)
  "automotive": {
    featured: ["vehicles", "auto-parts", "auto-accessories"],
    columns: 3,
    banner: {
      title: "Auto Essentials",
      titleBg: "Авто екипировка",
      subtitle: "Parts, accessories & vehicles",
      subtitleBg: "Части, аксесоари и превозни средства",
      cta: "Shop Auto",
      ctaBg: "Виж авто",
      image: "/retro-living-room-tv.png",
      href: "/categories/automotive"
    }
  },
  // ===== HOME =====
  // L1s: furniture (16), kitchen-dining (14), garden-outdoor (7), home-office (6), home-decor (4), bedding-bath (4)
  "home": {
    featured: ["furniture", "kitchen-dining", "garden-outdoor"],
    columns: 3,
    banner: {
      title: "Home Essentials",
      titleBg: "За дома",
      subtitle: "Transform your living space",
      subtitleBg: "Трансформирайте дома си",
      cta: "Shop Home",
      ctaBg: "Виж за дома",
      image: "/cozy-cabin-interior.png",
      href: "/categories/home"
    }
  },
  // ===== SPORTS =====
  // L1s: fitness (11), cycling (12), hiking-camping (5), team-sports (5), water-sports (5), winter-sports (4)
  "sports": {
    featured: ["fitness", "cycling", "hiking-camping"],
    columns: 3,
    banner: {
      title: "Get Active",
      titleBg: "Бъди активен",
      subtitle: "Gear up for your next adventure",
      subtitleBg: "Екипирай се за следващото приключение",
      cta: "Shop Sports",
      ctaBg: "Виж спорт",
      image: "/fitness-watch.jpg",
      href: "/categories/sports"
    }
  },
  // ===== BEAUTY =====
  // L1s: makeup (5), skincare (6), haircare (4), fragrance (4), bath-body (3), mens-grooming (3)
  "beauty": {
    featured: ["makeup", "skincare", "haircare"],
    columns: 3,
    banner: {
      title: "Beauty Favorites",
      titleBg: "Красота",
      subtitle: "Skincare, makeup & haircare essentials",
      subtitleBg: "Грижа за кожата, грим и косата",
      cta: "Shop Beauty",
      ctaBg: "Виж красота",
      image: "/abstract-beauty.png",
      href: "/categories/beauty"
    }
  },
  // ===== GAMING =====
  // L1s: pc-gaming-main (4), console-gaming (5), trading-cards (4), board-games (5), puzzles (3), retro-gaming (3)
  "gaming": {
    featured: ["pc-gaming-main", "console-gaming", "board-games"],
    columns: 3,
    banner: {
      title: "Game On",
      titleBg: "Време за игра",
      subtitle: "PC, Console & Board gaming",
      subtitleBg: "PC, конзолен и настолен гейминг",
      cta: "Shop Gaming",
      ctaBg: "Виж гейминг",
      image: "/gaming-setup.png",
      href: "/categories/gaming"
    }
  },
  // ===== TOYS =====
  // L1s: building-toys (3), educational-toys (3), outdoor-play (3), dolls-playsets (3), action-figures (3)
  "toys": {
    featured: ["building-toys", "educational-toys", "outdoor-play"],
    columns: 3,
    banner: {
      title: "Playtime Fun",
      titleBg: "Време за игра",
      subtitle: "Toys for all ages",
      subtitleBg: "Играчки за всички възрасти",
      cta: "Shop Toys",
      ctaBg: "Виж играчки",
      image: "/colorful-toy-collection.png",
      href: "/categories/toys"
    }
  },
  // ===== BABY & KIDS =====
  // L1s: baby-gear (5), toys-games (8), kids-clothing, baby-feeding, nursery, diapering, baby-safety
  // Note: toys-games has 8 L2s (richest), baby-gear has 5 L2s
  // Attributes handle age range filtering: 0-3mo, 3-6mo, 6-12mo, 1-2y, 2-3y, 3-5y, 5-8y, 8-12y, 12+
  "baby-kids": {
    featured: ["baby-gear", "toys-games", "kids-clothing"],
    columns: 3,
    banner: {
      title: "For Little Ones",
      titleBg: "За малчуганите",
      subtitle: "Baby gear, toys & games",
      subtitleBg: "Бебешки артикули, играчки и игри",
      cta: "Shop Baby",
      ctaBg: "Виж бебе",
      image: "/colorful-toy-collection.png",
      href: "/categories/baby-kids"
    }
  },
  // ===== PETS =====
  // L1s: dogs (8), cats (8), fish-aquatic (6), birds (5), small-animals (5), reptiles (5)
  "pets": {
    featured: ["dogs", "cats", "fish-aquatic"],
    columns: 3,
    banner: {
      title: "Pet Paradise",
      titleBg: "За домашните любимци",
      subtitle: "Dogs, cats, fish & more",
      subtitleBg: "Кучета, котки, риби и още",
      cta: "Shop Pets",
      ctaBg: "Виж зоо",
      image: "/placeholder.jpg",
      href: "/categories/pets"
    }
  },
  // ===== BOOKS =====
  // L1s: fiction (5), non-fiction (7), kids-books (4), textbooks (4), audiobooks (3), ebooks (3)
  "books": {
    featured: ["fiction", "non-fiction", "kids-books"],
    columns: 3,
    banner: {
      title: "Reading Corner",
      titleBg: "Кът за четене",
      subtitle: "Books for every interest",
      subtitleBg: "Книги за всеки вкус",
      cta: "Shop Books",
      ctaBg: "Виж книги",
      image: "/placeholder.jpg",
      href: "/categories/books"
    }
  },
  // ===== JEWELRY & WATCHES =====
  // L1s: watches (5), fine-jewelry (4), fashion-jewelry (4), mens-jewelry (3), wedding-engagement (3)
  "jewelry-watches": {
    featured: ["watches", "fine-jewelry", "fashion-jewelry"],
    columns: 3,
    banner: {
      title: "Timeless Elegance",
      titleBg: "Вечна елегантност",
      subtitle: "Watches & fine jewelry",
      subtitleBg: "Часовници и бижута",
      cta: "Shop Jewelry",
      ctaBg: "Виж бижута",
      image: "/placeholder.jpg",
      href: "/categories/jewelry-watches"
    }
  },
  // ===== GARDEN & OUTDOOR =====
  // L1s: outdoor-furniture (5), garden-tools (5), plants-seeds (4), outdoor-decor (3), grills-outdoor (3)
  "garden-outdoor": {
    featured: ["outdoor-furniture", "garden-tools", "plants-seeds"],
    columns: 3,
    banner: {
      title: "Outdoor Living",
      titleBg: "Градина и двор",
      subtitle: "Everything for your garden",
      subtitleBg: "Всичко за градината",
      cta: "Shop Garden",
      ctaBg: "Виж градина",
      image: "/placeholder.jpg",
      href: "/categories/garden-outdoor"
    }
  },
  // ===== HEALTH & WELLNESS =====
  // REORGANIZED HIERARCHY - 5 NEW L1 GROUPS:
  // 1. supplements-vitamins (8 L2: vitamins, omega, probiotics, superfoods, collagen, joint, immune, sleep)
  // 2. specialty-health (7 L2: women's, men's, children's, heart, blood sugar, stress, longevity)
  // 3. sports-fitness-nutrition (5 L2: sports nutrition, fitness, weight, energy, therapy)
  // 4. medical-personal-care (4 L2: medical supplies, vision, mobility, personal care)
  // 5. natural-alternative-wellness (7 L2: CBD, mushrooms, adaptogens, herbal, traditional, oils, hemp)
  "health-wellness": {
    featured: ["supplements-vitamins", "natural-alternative-wellness", "specialty-health"],
    columns: 3,
    banner: {
      title: "Wellness Essentials",
      titleBg: "Здраве и wellness",
      subtitle: "Supplements, natural wellness & targeted health",
      subtitleBg: "Добавки, натурално здраве и специализирани грижи",
      cta: "Shop Health",
      ctaBg: "Виж здраве",
      image: "/placeholder.jpg",
      href: "/categories/health-wellness"
    }
  },
  // ===== SMART HOME =====
  // L1s: smart-security (4), smart-speakers (3), smart-lighting (3), smart-appliances (3), smart-thermostats (3)
  "smart-home": {
    featured: ["smart-security", "smart-speakers", "smart-lighting"],
    columns: 3,
    banner: {
      title: "Smart Living",
      titleBg: "Умен дом",
      subtitle: "Automate your home",
      subtitleBg: "Автоматизирайте дома си",
      cta: "Shop Smart",
      ctaBg: "Виж умен дом",
      image: "/smart-speaker.jpg",
      href: "/categories/smart-home"
    }
  },
  // ===== TOOLS & HOME IMPROVEMENT =====
  // L1s: power-tools (6), hand-tools (5), electrical (4), plumbing (4), hardware (4)
  "tools-home": {
    featured: ["power-tools", "hand-tools", "electrical"],
    columns: 3,
    banner: {
      title: "DIY Tools",
      titleBg: "Инструменти",
      subtitle: "Power & hand tools",
      subtitleBg: "Електро и ръчни инструменти",
      cta: "Shop Tools",
      ctaBg: "Виж инструменти",
      image: "/placeholder.jpg",
      href: "/categories/tools-home"
    }
  },
  // ===== OFFICE & SCHOOL =====
  // L1s: office-supplies (5), school-supplies (4), office-furniture (4), office-electronics (3)
  "office-school": {
    featured: ["office-supplies", "school-supplies", "office-furniture"],
    columns: 3,
    banner: {
      title: "Office & School",
      titleBg: "Офис и училище",
      subtitle: "Supplies for work & study",
      subtitleBg: "Консумативи за работа и учене",
      cta: "Shop Supplies",
      ctaBg: "Виж консумативи",
      image: "/office-chair.jpg",
      href: "/categories/office-school"
    }
  },
  // ===== MUSICAL INSTRUMENTS =====
  // L1s: guitars-basses (5), keyboards-pianos (4), drums-percussion (4), dj-equipment (4), studio-recording (4)
  "musical-instruments": {
    featured: ["guitars-basses", "keyboards-pianos", "drums-percussion"],
    columns: 3,
    banner: {
      title: "Make Music",
      titleBg: "Създавай музика",
      subtitle: "Instruments & gear",
      subtitleBg: "Инструменти и оборудване",
      cta: "Shop Instruments",
      ctaBg: "Виж инструменти",
      image: "/placeholder.jpg",
      href: "/categories/musical-instruments"
    }
  },
  // ===== MOVIES & MUSIC =====
  // L1s: vinyl-records (4), dvds-bluray (4), cds (3), streaming-devices (3)
  "movies-music": {
    featured: ["vinyl-records", "dvds-bluray", "cds"],
    columns: 3,
    banner: {
      title: "Entertainment",
      titleBg: "Забавление",
      subtitle: "Movies, music & more",
      subtitleBg: "Филми, музика и още",
      cta: "Shop Media",
      ctaBg: "Виж медия",
      image: "/diverse-people-listening-headphones.png",
      href: "/categories/movies-music"
    }
  },
  // ===== COLLECTIBLES =====
  // L1s: art (4), antiques (5), coins-currency (4), sports-memorabilia (4), trading-cards (4)
  "collectibles": {
    featured: ["art", "antiques", "coins-currency"],
    columns: 3,
    banner: {
      title: "Collectibles",
      titleBg: "Колекционерски",
      subtitle: "Art, antiques & rare finds",
      subtitleBg: "Изкуство, антики и редки находки",
      cta: "Explore",
      ctaBg: "Разгледай",
      image: "/vintage-camera-still-life.png",
      href: "/categories/collectibles"
    }
  },
  // ===== GROCERY =====
  // L1s: grocery-pantry (7), grocery-drinks (6), grocery-snacks (11), grocery-dairy (5), grocery-meat (4)
  "grocery": {
    featured: ["grocery-pantry", "grocery-drinks", "grocery-snacks"],
    columns: 3,
    banner: {
      title: "Grocery & Food",
      titleBg: "Храна и напитки",
      subtitle: "Quality food products",
      subtitleBg: "Качествени хранителни продукти",
      cta: "Shop Grocery",
      ctaBg: "Виж храна",
      image: "/placeholder.jpg",
      href: "/categories/grocery"
    }
  },
  // ===== HANDMADE =====
  // L1s: handmade-jewelry (4), home-decor-crafts (4), art-collectibles (3), clothing-accessories (3)
  "handmade": {
    featured: ["handmade-jewelry", "home-decor-crafts", "art-collectibles"],
    columns: 3,
    banner: {
      title: "Handmade & Unique",
      titleBg: "Ръчна изработка",
      subtitle: "One-of-a-kind creations",
      subtitleBg: "Уникални творения",
      cta: "Shop Handmade",
      ctaBg: "Виж ръчна изработка",
      image: "/placeholder.jpg",
      href: "/categories/handmade"
    }
  },
  // ===== INDUSTRIAL =====
  // L1s: industrial-equipment (5), lab-equipment (5), safety-equipment (4), industrial-supplies (4)
  "industrial": {
    featured: ["industrial-equipment", "lab-equipment", "safety-equipment"],
    columns: 3,
    banner: {
      title: "Industrial & Lab",
      titleBg: "Индустриално",
      subtitle: "Professional equipment",
      subtitleBg: "Професионално оборудване",
      cta: "Shop Industrial",
      ctaBg: "Виж индустриално",
      image: "/placeholder.jpg",
      href: "/categories/industrial"
    }
  },
  // ===== SOFTWARE =====
  // L1s: office-software (3), security-software (3), creative-software (3), business-software (3)
  "software": {
    featured: ["office-software", "security-software", "creative-software"],
    columns: 3,
    banner: {
      title: "Software",
      titleBg: "Софтуер",
      subtitle: "Digital products & licenses",
      subtitleBg: "Дигитални продукти и лицензи",
      cta: "Shop Software",
      ctaBg: "Виж софтуер",
      image: "/placeholder.jpg",
      href: "/categories/software"
    }
  },
  // ===== SERVICES =====
  // L1s: home-services (5), professional-services (4), event-services (4), personal-services (3)
  "services": {
    featured: ["home-services", "professional-services", "event-services"],
    columns: 3,
    banner: {
      title: "Services",
      titleBg: "Услуги",
      subtitle: "Find trusted professionals",
      subtitleBg: "Намерете доверени професионалисти",
      cta: "Browse Services",
      ctaBg: "Виж услуги",
      image: "/placeholder.jpg",
      href: "/categories/services"
    }
  },
  // ===== REAL ESTATE =====
  // L1s: residential-sales (5), residential-rentals (5), commercial (4), land (3), vacation-rentals (3)
  "real-estate": {
    featured: ["residential-sales", "residential-rentals", "commercial"],
    columns: 3,
    banner: {
      title: "Real Estate",
      titleBg: "Имоти",
      subtitle: "Buy or rent your dream property",
      subtitleBg: "Купете или наемете мечтания имот",
      cta: "Browse Properties",
      ctaBg: "Виж имоти",
      image: "/cozy-cabin-interior.png",
      href: "/categories/real-estate"
    }
  },
  // ===== GIFT CARDS =====
  // L1s: retail-gift-cards (4), restaurant-gift-cards (3), entertainment-gift-cards (3), travel-gift-cards (3)
  "gift-cards": {
    featured: ["retail-gift-cards", "restaurant-gift-cards", "entertainment-gift-cards"],
    columns: 3,
    banner: {
      title: "Gift Cards",
      titleBg: "Ваучери",
      subtitle: "The perfect gift",
      subtitleBg: "Перфектният подарък",
      cta: "Shop Gift Cards",
      ctaBg: "Виж ваучери",
      image: "/placeholder.jpg",
      href: "/categories/gift-cards"
    }
  },
  // ===== BULGARIAN TRADITIONAL =====
  // L1s: traditional-foods (4), folk-costumes (3), crafts-souvenirs (3), bulgarian-wine (3)
  "bulgarian-traditional": {
    featured: ["traditional-foods", "folk-costumes", "crafts-souvenirs"],
    columns: 3,
    banner: {
      title: "Bulgarian Treasures",
      titleBg: "Българско",
      subtitle: "Traditional products from Bulgaria",
      subtitleBg: "Традиционни продукти от България",
      cta: "Discover",
      ctaBg: "Открий",
      image: "/placeholder.jpg",
      href: "/categories/bulgarian-traditional"
    }
  },
  // ===== E-MOBILITY =====
  // L1s: electric-vehicles (4), e-scooters (3), e-bikes-cat (3), charging-equipment (3)
  "e-mobility": {
    featured: ["electric-vehicles", "e-scooters", "e-bikes-cat"],
    columns: 3,
    banner: {
      title: "E-Mobility",
      titleBg: "Електромобилност",
      subtitle: "Electric vehicles & more",
      subtitleBg: "Електромобили и още",
      cta: "Go Electric",
      ctaBg: "Виж електро",
      image: "/placeholder.jpg",
      href: "/categories/e-mobility"
    }
  },
  // ===== HOBBIES =====
  // L1s: hobby-rc-drones (5), musical-instruments (5), hobby-tcg (4), hobby-models (4), books (7)
  "hobbies": {
    featured: ["hobby-rc-drones", "musical-instruments", "hobby-tcg"],
    columns: 3,
    banner: {
      title: "Hobby Zone",
      titleBg: "Хоби зона",
      subtitle: "RC, models, trading cards & more",
      subtitleBg: "RC, модели, колекционерски карти и още",
      cta: "Explore Hobbies",
      ctaBg: "Виж хоби",
      image: "/placeholder.jpg",
      href: "/categories/hobbies"
    }
  },
  // ===== WHOLESALE =====
  // L1s: wholesale-electronics (4), business-supplies (3), bulk-products (3)
  "wholesale": {
    featured: ["wholesale-electronics", "business-supplies", "bulk-products"],
    columns: 3,
    maxItems: 4,
    banner: {
      title: "Wholesale & B2B",
      titleBg: "На едро",
      subtitle: "Bulk orders for your business",
      subtitleBg: "Количествени поръчки за бизнеса",
      cta: "Shop Wholesale",
      ctaBg: "Виж на едро",
      image: "/placeholder.jpg",
      href: "/categories/wholesale"
    }
  }
}
