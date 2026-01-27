/**
 * CompactCategorySidebar Stories - Your REAL production sidebar
 * 
 * This is the actual category sidebar used on homepage.
 * Styling changes here = styling changes in main app.
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CompactCategorySidebar, type CategoryPath } from "./category-sidebar"
import type { CategoryTreeNode } from "@/lib/category-tree"
import * as React from "react"

// =============================================================================
// MOCK DATA (component is real, only data is mocked for Storybook isolation)
// =============================================================================

const mockCategories: CategoryTreeNode[] = [
  {
    id: "fashion",
    slug: "fashion",
    name: "Fashion",
    name_bg: "Мода",
    display_order: 1,
    children: [
      { id: "women", slug: "women", name: "Women", name_bg: "Дамски", display_order: 1, children: [
        { id: "dresses", slug: "dresses", name: "Dresses", name_bg: "Рокли", display_order: 1 },
        { id: "tops", slug: "tops", name: "Tops", name_bg: "Блузи", display_order: 2 },
        { id: "pants", slug: "pants", name: "Pants", name_bg: "Панталони", display_order: 3 },
      ]},
      { id: "men", slug: "men", name: "Men", name_bg: "Мъжки", display_order: 2, children: [
        { id: "shirts", slug: "shirts", name: "Shirts", name_bg: "Ризи", display_order: 1 },
        { id: "jeans", slug: "jeans", name: "Jeans", name_bg: "Дънки", display_order: 2 },
      ]},
      { id: "kids", slug: "kids", name: "Kids", name_bg: "Детски", display_order: 3 },
    ],
  },
  {
    id: "electronics",
    slug: "electronics",
    name: "Electronics",
    name_bg: "Електроника",
    display_order: 2,
    children: [
      { id: "computers", slug: "computers", name: "Desktop Computers", name_bg: "Настолни компютри", display_order: 1 },
      { id: "smartphones", slug: "smartphones", name: "Smartphones", name_bg: "Смартфони", display_order: 2 },
      { id: "laptops", slug: "laptops", name: "Laptops", name_bg: "Лаптопи", display_order: 3 },
      { id: "tablets", slug: "tablets", name: "Tablets", name_bg: "Таблети", display_order: 4 },
      { id: "monitors", slug: "monitors", name: "Monitors", name_bg: "Монитори", display_order: 5 },
      { id: "audio", slug: "audio", name: "Audio", name_bg: "Аудио", display_order: 6 },
      { id: "tv", slug: "tv", name: "TVs", name_bg: "Телевизори", display_order: 7 },
      { id: "cameras", slug: "cameras", name: "Cameras", name_bg: "Камери", display_order: 8 },
      { id: "networking", slug: "networking", name: "Networking", name_bg: "Мрежово оборудване", display_order: 9 },
      { id: "smart-devices", slug: "smart-devices", name: "Smart Devices", name_bg: "Умни устройства", display_order: 10 },
      { id: "accessories", slug: "accessories", name: "Accessories", name_bg: "Аксесоари", display_order: 11 },
    ],
  },
  {
    id: "home",
    slug: "home",
    name: "Home & Kitchen",
    name_bg: "Дом и кухня",
    display_order: 3,
    children: [
      { id: "furniture", slug: "furniture", name: "Furniture", name_bg: "Мебели", display_order: 1 },
      { id: "decor", slug: "decor", name: "Decor", name_bg: "Декорация", display_order: 2 },
    ],
  },
  { id: "beauty", slug: "beauty", name: "Beauty", name_bg: "Красота", display_order: 4 },
  { id: "health", slug: "health", name: "Health", name_bg: "Здраве", display_order: 5 },
  { id: "sports", slug: "sports", name: "Sports", name_bg: "Спорт", display_order: 6 },
  { id: "kids-toys", slug: "kids-toys", name: "Kids & Toys", name_bg: "Деца", display_order: 7 },
  { id: "gaming", slug: "gaming", name: "Gaming", name_bg: "Гейминг", display_order: 8 },
  { id: "automotive", slug: "automotive", name: "Automotive", name_bg: "Автомобили", display_order: 9 },
  { id: "pets", slug: "pets", name: "Pets", name_bg: "Зоо", display_order: 10 },
  { id: "real-estate", slug: "real-estate", name: "Real Estate", name_bg: "Имоти", display_order: 11 },
  { id: "software", slug: "software", name: "Software", name_bg: "Софтуер", display_order: 12 },
]

const mockCategoryCounts: Record<string, number> = {
  fashion: 26,
  electronics: 42,
  home: 20,
  beauty: 12,
  health: 7,
  sports: 9,
  "kids-toys": 15,
  gaming: 12,
  automotive: 20,
  pets: 9,
  "real-estate": 0,
  software: 7,
  // L1 electronics
  computers: 8,
  smartphones: 15,
  laptops: 12,
  tablets: 5,
  monitors: 7,
  audio: 4,
  tv: 6,
  cameras: 3,
  networking: 2,
  "smart-devices": 5,
  accessories: 10,
}

// =============================================================================
// STORYBOOK META
// =============================================================================

const meta: Meta<typeof CompactCategorySidebar> = {
  title: "Layout/CategorySidebar",
  component: CompactCategorySidebar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default state - L0 "All categories" view (homepage)
 */
export const Default: Story = {
  render: function Render() {
    const [selectedPath, setSelectedPath] = React.useState<CategoryPath[]>([])
    return (
      <CompactCategorySidebar
        categories={mockCategories}
        locale="bg"
        selectedPath={selectedPath}
        onCategorySelect={(path) => setSelectedPath(path)}
        categoryCounts={mockCategoryCounts}
      />
    )
  },
}

/**
 * L1 - Drilled into "Електроника" showing subcategories
 * (matches your Image 1 screenshot)
 */
export const ElectronicsSubcategories: Story = {
  render: function Render() {
    const [selectedPath, setSelectedPath] = React.useState<CategoryPath[]>([
      { slug: "electronics", name: "Електроника" },
    ])
    return (
      <CompactCategorySidebar
        categories={mockCategories}
        locale="bg"
        selectedPath={selectedPath}
        onCategorySelect={(path) => setSelectedPath(path)}
        categoryCounts={mockCategoryCounts}
      />
    )
  },
}

/**
 * L2 - Drilled into "Мода > Дамски"
 */
export const FashionWomen: Story = {
  render: function Render() {
    const [selectedPath, setSelectedPath] = React.useState<CategoryPath[]>([
      { slug: "fashion", name: "Мода" },
      { slug: "women", name: "Дамски" },
    ])
    return (
      <CompactCategorySidebar
        categories={mockCategories}
        locale="bg"
        selectedPath={selectedPath}
        onCategorySelect={(path) => setSelectedPath(path)}
        categoryCounts={mockCategoryCounts}
      />
    )
  },
}

/**
 * English locale
 */
export const EnglishLocale: Story = {
  render: function Render() {
    const [selectedPath, setSelectedPath] = React.useState<CategoryPath[]>([])
    return (
      <CompactCategorySidebar
        categories={mockCategories}
        locale="en"
        selectedPath={selectedPath}
        onCategorySelect={(path) => setSelectedPath(path)}
        categoryCounts={mockCategoryCounts}
      />
    )
  },
}

/**
 * With "Show More" button (Electronics has 11 children > 12 limit)
 */
export const ShowMoreButton: Story = {
  render: function Render() {
    const [selectedPath, setSelectedPath] = React.useState<CategoryPath[]>([
      { slug: "electronics", name: "Електроника" },
    ])
    return (
      <CompactCategorySidebar
        categories={mockCategories}
        locale="bg"
        selectedPath={selectedPath}
        onCategorySelect={(path) => setSelectedPath(path)}
        categoryCounts={mockCategoryCounts}
      />
    )
  },
}
