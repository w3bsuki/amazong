/**
 * Category-Specific Attribute Configuration
 * 
 * Defines which attributes are required for different category types.
 * This enables dynamic form fields based on what the user is selling.
 * 
 * Example: Selling a car requires Make, Model, Year, Engine Type
 * Example: Selling clothing requires Size, Color, Material
 */

export interface CategoryAttributeConfig {
  /** Category slug pattern (supports wildcards like "vehicles-*") */
  categoryPattern: string;
  /** Human-readable category name for display */
  displayName: { en: string; bg: string };
  /** Required attributes for this category */
  requiredAttributes: AttributeDefinition[];
  /** Optional but recommended attributes */
  optionalAttributes?: AttributeDefinition[];
  /** Whether to show the generic "Brand" field or use category-specific naming */
  brandFieldConfig?: {
    label: { en: string; bg: string };
    placeholder: { en: string; bg: string };
  };
}

export interface AttributeDefinition {
  /** Unique key for this attribute */
  key: string;
  /** Display name */
  name: { en: string; bg: string };
  /** Input type */
  type: "text" | "select" | "number" | "multiselect";
  /** Placeholder text */
  placeholder?: { en: string; bg: string };
  /** Options for select/multiselect types */
  options?: { value: string; label: { en: string; bg: string } }[];
  /** Validation rules */
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// =============================================================================
// CATEGORY CONFIGURATIONS
// =============================================================================

export const CATEGORY_CONFIGS: CategoryAttributeConfig[] = [
  // -------------------------------------------------------------------------
  // VEHICLES - Cars, Motorcycles, etc.
  // -------------------------------------------------------------------------
  {
    categoryPattern: "automotive-vehicles*",
    displayName: { en: "Vehicle", bg: "Превозно средство" },
    brandFieldConfig: {
      label: { en: "Make", bg: "Марка" },
      placeholder: { en: "e.g., BMW, Mercedes, Toyota", bg: "напр. BMW, Mercedes, Toyota" },
    },
    requiredAttributes: [
      {
        key: "model",
        name: { en: "Model", bg: "Модел" },
        type: "text",
        placeholder: { en: "e.g., 320d, E-Class, Camry", bg: "напр. 320d, E-Class, Camry" },
        validation: { required: true },
      },
      {
        key: "year",
        name: { en: "Year", bg: "Година" },
        type: "number",
        placeholder: { en: "e.g., 2020", bg: "напр. 2020" },
        validation: { required: true, min: 1900, max: new Date().getFullYear() + 1 },
      },
      {
        key: "mileage",
        name: { en: "Mileage (km)", bg: "Пробег (км)" },
        type: "number",
        placeholder: { en: "e.g., 50000", bg: "напр. 50000" },
        validation: { required: true, min: 0 },
      },
      {
        key: "fuel_type",
        name: { en: "Fuel Type", bg: "Вид гориво" },
        type: "select",
        options: [
          { value: "petrol", label: { en: "Petrol", bg: "Бензин" } },
          { value: "diesel", label: { en: "Diesel", bg: "Дизел" } },
          { value: "electric", label: { en: "Electric", bg: "Електрически" } },
          { value: "hybrid", label: { en: "Hybrid", bg: "Хибрид" } },
          { value: "lpg", label: { en: "LPG", bg: "Газ" } },
        ],
        validation: { required: true },
      },
      {
        key: "transmission",
        name: { en: "Transmission", bg: "Скоростна кутия" },
        type: "select",
        options: [
          { value: "manual", label: { en: "Manual", bg: "Ръчна" } },
          { value: "automatic", label: { en: "Automatic", bg: "Автоматична" } },
          { value: "semi-auto", label: { en: "Semi-automatic", bg: "Полуавтоматична" } },
        ],
        validation: { required: true },
      },
    ],
    optionalAttributes: [
      {
        key: "engine_size",
        name: { en: "Engine Size (cc)", bg: "Обем на двигателя (куб.см)" },
        type: "number",
        placeholder: { en: "e.g., 2000", bg: "напр. 2000" },
      },
      {
        key: "horsepower",
        name: { en: "Horsepower", bg: "Мощност (к.с.)" },
        type: "number",
        placeholder: { en: "e.g., 150", bg: "напр. 150" },
      },
      {
        key: "color",
        name: { en: "Color", bg: "Цвят" },
        type: "text",
        placeholder: { en: "e.g., Black, Silver", bg: "напр. Черен, Сребрист" },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // FASHION - Clothing
  // -------------------------------------------------------------------------
  {
    categoryPattern: "fashion*clothing*",
    displayName: { en: "Clothing", bg: "Дрехи" },
    requiredAttributes: [
      {
        key: "size",
        name: { en: "Size", bg: "Размер" },
        type: "select",
        options: [
          { value: "xs", label: { en: "XS", bg: "XS" } },
          { value: "s", label: { en: "S", bg: "S" } },
          { value: "m", label: { en: "M", bg: "M" } },
          { value: "l", label: { en: "L", bg: "L" } },
          { value: "xl", label: { en: "XL", bg: "XL" } },
          { value: "xxl", label: { en: "XXL", bg: "XXL" } },
          { value: "3xl", label: { en: "3XL", bg: "3XL" } },
        ],
        validation: { required: true },
      },
      {
        key: "color",
        name: { en: "Color", bg: "Цвят" },
        type: "text",
        placeholder: { en: "e.g., Black, Navy Blue", bg: "напр. Черен, Тъмносин" },
        validation: { required: true },
      },
    ],
    optionalAttributes: [
      {
        key: "material",
        name: { en: "Material", bg: "Материал" },
        type: "text",
        placeholder: { en: "e.g., Cotton, Polyester", bg: "напр. Памук, Полиестер" },
      },
      {
        key: "style",
        name: { en: "Style", bg: "Стил" },
        type: "select",
        options: [
          { value: "casual", label: { en: "Casual", bg: "Ежедневен" } },
          { value: "formal", label: { en: "Formal", bg: "Официален" } },
          { value: "sport", label: { en: "Sport", bg: "Спортен" } },
          { value: "vintage", label: { en: "Vintage", bg: "Винтидж" } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // FASHION - Shoes
  // -------------------------------------------------------------------------
  {
    categoryPattern: "fashion*shoes*",
    displayName: { en: "Shoes", bg: "Обувки" },
    requiredAttributes: [
      {
        key: "size",
        name: { en: "Size (EU)", bg: "Размер (EU)" },
        type: "select",
        options: Array.from({ length: 20 }, (_, i) => {
          const size = (35 + i).toString();
          return { value: size, label: { en: size, bg: size } };
        }),
        validation: { required: true },
      },
      {
        key: "color",
        name: { en: "Color", bg: "Цвят" },
        type: "text",
        placeholder: { en: "e.g., Black, White", bg: "напр. Черни, Бели" },
        validation: { required: true },
      },
    ],
    optionalAttributes: [
      {
        key: "material",
        name: { en: "Material", bg: "Материал" },
        type: "select",
        options: [
          { value: "leather", label: { en: "Leather", bg: "Кожа" } },
          { value: "synthetic", label: { en: "Synthetic", bg: "Синтетика" } },
          { value: "canvas", label: { en: "Canvas", bg: "Текстил" } },
          { value: "suede", label: { en: "Suede", bg: "Велур" } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ELECTRONICS - Phones & Tablets
  // -------------------------------------------------------------------------
  {
    categoryPattern: "electronics*phone*",
    displayName: { en: "Phone/Tablet", bg: "Телефон/Таблет" },
    requiredAttributes: [
      {
        key: "storage",
        name: { en: "Storage", bg: "Памет" },
        type: "select",
        options: [
          { value: "16gb", label: { en: "16 GB", bg: "16 GB" } },
          { value: "32gb", label: { en: "32 GB", bg: "32 GB" } },
          { value: "64gb", label: { en: "64 GB", bg: "64 GB" } },
          { value: "128gb", label: { en: "128 GB", bg: "128 GB" } },
          { value: "256gb", label: { en: "256 GB", bg: "256 GB" } },
          { value: "512gb", label: { en: "512 GB", bg: "512 GB" } },
          { value: "1tb", label: { en: "1 TB", bg: "1 TB" } },
        ],
        validation: { required: true },
      },
      {
        key: "color",
        name: { en: "Color", bg: "Цвят" },
        type: "text",
        placeholder: { en: "e.g., Space Gray, Silver", bg: "напр. Space Gray, Silver" },
        validation: { required: true },
      },
    ],
    optionalAttributes: [
      {
        key: "network",
        name: { en: "Network", bg: "Мрежа" },
        type: "select",
        options: [
          { value: "unlocked", label: { en: "Unlocked", bg: "Отключен" } },
          { value: "5g", label: { en: "5G", bg: "5G" } },
          { value: "4g", label: { en: "4G LTE", bg: "4G LTE" } },
          { value: "wifi", label: { en: "WiFi Only", bg: "Само WiFi" } },
        ],
      },
      {
        key: "accessories",
        name: { en: "Includes", bg: "Включва" },
        type: "multiselect",
        options: [
          { value: "charger", label: { en: "Charger", bg: "Зарядно" } },
          { value: "cable", label: { en: "Cable", bg: "Кабел" } },
          { value: "box", label: { en: "Original Box", bg: "Оригинална кутия" } },
          { value: "case", label: { en: "Case", bg: "Калъф" } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ELECTRONICS - Computers & Laptops
  // -------------------------------------------------------------------------
  {
    categoryPattern: "electronics*computer*",
    displayName: { en: "Computer/Laptop", bg: "Компютър/Лаптоп" },
    requiredAttributes: [
      {
        key: "processor",
        name: { en: "Processor", bg: "Процесор" },
        type: "text",
        placeholder: { en: "e.g., Intel i7, Apple M2", bg: "напр. Intel i7, Apple M2" },
        validation: { required: true },
      },
      {
        key: "ram",
        name: { en: "RAM", bg: "RAM памет" },
        type: "select",
        options: [
          { value: "4gb", label: { en: "4 GB", bg: "4 GB" } },
          { value: "8gb", label: { en: "8 GB", bg: "8 GB" } },
          { value: "16gb", label: { en: "16 GB", bg: "16 GB" } },
          { value: "32gb", label: { en: "32 GB", bg: "32 GB" } },
          { value: "64gb", label: { en: "64 GB", bg: "64 GB" } },
        ],
        validation: { required: true },
      },
      {
        key: "storage",
        name: { en: "Storage", bg: "Съхранение" },
        type: "text",
        placeholder: { en: "e.g., 512GB SSD", bg: "напр. 512GB SSD" },
        validation: { required: true },
      },
    ],
    optionalAttributes: [
      {
        key: "screen_size",
        name: { en: "Screen Size", bg: "Размер на екрана" },
        type: "text",
        placeholder: { en: "e.g., 15.6 inch", bg: "напр. 15.6 инча" },
      },
      {
        key: "graphics",
        name: { en: "Graphics Card", bg: "Видеокарта" },
        type: "text",
        placeholder: { en: "e.g., NVIDIA RTX 3060", bg: "напр. NVIDIA RTX 3060" },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // REAL ESTATE - Property
  // -------------------------------------------------------------------------
  {
    categoryPattern: "real-estate*",
    displayName: { en: "Property", bg: "Имот" },
    requiredAttributes: [
      {
        key: "property_type",
        name: { en: "Property Type", bg: "Тип имот" },
        type: "select",
        options: [
          { value: "apartment", label: { en: "Apartment", bg: "Апартамент" } },
          { value: "house", label: { en: "House", bg: "Къща" } },
          { value: "studio", label: { en: "Studio", bg: "Студио" } },
          { value: "maisonette", label: { en: "Maisonette", bg: "Мезонет" } },
          { value: "penthouse", label: { en: "Penthouse", bg: "Пентхаус" } },
          { value: "land", label: { en: "Land", bg: "Парцел" } },
          { value: "commercial", label: { en: "Commercial", bg: "Търговски" } },
        ],
        validation: { required: true },
      },
      {
        key: "area",
        name: { en: "Area (sq.m)", bg: "Площ (кв.м)" },
        type: "number",
        placeholder: { en: "e.g., 75", bg: "напр. 75" },
        validation: { required: true, min: 1 },
      },
      {
        key: "rooms",
        name: { en: "Rooms", bg: "Стаи" },
        type: "select",
        options: [
          { value: "1", label: { en: "1 room", bg: "1 стая" } },
          { value: "2", label: { en: "2 rooms", bg: "2 стаи" } },
          { value: "3", label: { en: "3 rooms", bg: "3 стаи" } },
          { value: "4", label: { en: "4 rooms", bg: "4 стаи" } },
          { value: "5+", label: { en: "5+ rooms", bg: "5+ стаи" } },
        ],
        validation: { required: true },
      },
      {
        key: "floor",
        name: { en: "Floor", bg: "Етаж" },
        type: "text",
        placeholder: { en: "e.g., 3rd of 8", bg: "напр. 3 от 8" },
        validation: { required: true },
      },
    ],
    optionalAttributes: [
      {
        key: "construction_year",
        name: { en: "Year Built", bg: "Година на строеж" },
        type: "number",
        placeholder: { en: "e.g., 2010", bg: "напр. 2010" },
      },
      {
        key: "heating",
        name: { en: "Heating", bg: "Отопление" },
        type: "select",
        options: [
          { value: "central", label: { en: "Central", bg: "ТЕЦ" } },
          { value: "electric", label: { en: "Electric", bg: "Електрическо" } },
          { value: "gas", label: { en: "Gas", bg: "Газово" } },
          { value: "ac", label: { en: "Air Conditioning", bg: "Климатик" } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // HOME & GARDEN - Furniture
  // -------------------------------------------------------------------------
  {
    categoryPattern: "home*furniture*",
    displayName: { en: "Furniture", bg: "Мебели" },
    requiredAttributes: [
      {
        key: "material",
        name: { en: "Material", bg: "Материал" },
        type: "select",
        options: [
          { value: "wood", label: { en: "Wood", bg: "Дърво" } },
          { value: "metal", label: { en: "Metal", bg: "Метал" } },
          { value: "glass", label: { en: "Glass", bg: "Стъкло" } },
          { value: "plastic", label: { en: "Plastic", bg: "Пластмаса" } },
          { value: "fabric", label: { en: "Fabric", bg: "Текстил" } },
          { value: "leather", label: { en: "Leather", bg: "Кожа" } },
        ],
        validation: { required: true },
      },
      {
        key: "color",
        name: { en: "Color", bg: "Цвят" },
        type: "text",
        placeholder: { en: "e.g., Oak, White, Gray", bg: "напр. Дъб, Бял, Сив" },
        validation: { required: true },
      },
    ],
    optionalAttributes: [
      {
        key: "dimensions",
        name: { en: "Dimensions (LxWxH cm)", bg: "Размери (ДxШxВ см)" },
        type: "text",
        placeholder: { en: "e.g., 120x60x75", bg: "напр. 120x60x75" },
      },
    ],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the configuration for a category based on its slug path
 * @param categoryPath - Array of category slugs from root to leaf (e.g., ["electronics", "phones", "smartphones"])
 * @returns Matching config or undefined if no specific config exists
 */
export function getCategoryConfig(categoryPath: string[]): CategoryAttributeConfig | undefined {
  const fullPath = categoryPath.join("-").toLowerCase();
  
  // Find the most specific matching config
  return CATEGORY_CONFIGS.find(config => {
    const pattern = config.categoryPattern.replaceAll('*', ".*");
    const regex = new RegExp(`^${pattern}`, "i");
    return regex.test(fullPath);
  });
}

/**
 * Get config by category slugs array (from categoryPath in form data)
 */
export function getCategoryConfigFromPath(
  categoryPath: Array<{ slug: string }> | undefined
): CategoryAttributeConfig | undefined {
  if (!categoryPath || categoryPath.length === 0) return undefined;
  const slugs = categoryPath.map(c => c.slug);
  return getCategoryConfig(slugs);
}

/**
 * Check if an attribute is filled
 */
export function isAttributeFilled(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim() !== "";
}
