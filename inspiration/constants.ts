import { Category, CategoryNode, Filter, Product } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Всички' },
  { id: 'fashion', name: 'Мода' },
  { id: 'electronics', name: 'Техника' },
  { id: 'home', name: 'Дом' },
  { id: 'auto', name: 'Авто' },
  { id: 'sports', name: 'Спорт' },
  { id: 'toys', name: 'Детски' },
  { id: 'properties', name: 'Имоти' },
];

export const FASHION_GROUPS = [
    { id: 'women', name: 'Жени' },
    { id: 'men', name: 'Мъже' },
    { id: 'kids', name: 'Деца' },
];

// Deep Hierarchy: Gender -> Department -> Category -> SubCategory
export const FASHION_TREE: Record<string, CategoryNode[]> = {
  women: [
    {
      id: 'clothing',
      name: 'Дрехи',
      items: [
        { 
            id: 'dresses', 
            name: 'Рокли',
            items: [
                { id: 'daily', name: 'Ежедневни' },
                { id: 'evening', name: 'Официални' },
                { id: 'summer', name: 'Летни' },
                { id: 'maxi', name: 'Дълги' },
                { id: 'mini', name: 'Къси' }
            ]
        },
        { 
            id: 'tops', 
            name: 'Блузи & Ризи',
            items: [
                { id: 'tshirts', name: 'Тениски' },
                { id: 'shirts', name: 'Ризи' },
                { id: 'tunics', name: 'Туники' },
                { id: 'crop', name: 'Кроп-топ' }
            ]
        },
        { id: 'pants', name: 'Панталони & Дънки' },
        { id: 'skirts', name: 'Поли' },
        { id: 'outerwear', name: 'Якета & Палта' },
        { id: 'sport', name: 'Спортни' },
      ]
    },
    {
      id: 'shoes',
      name: 'Обувки',
      items: [
        { 
            id: 'sneakers', 
            name: 'Сникърси',
            items: [
                { id: 'low', name: 'Ниски' },
                { id: 'high', name: 'Високи' },
                { id: 'platform', name: 'Платформи' },
                { id: 'sport', name: 'За спорт' }
            ]
        },
        { id: 'boots', name: 'Боти & Ботуши' },
        { id: 'heels', name: 'Токове' },
        { id: 'sandals', name: 'Сандали' },
        { id: 'sport_shoes', name: 'Спортни обувки' },
      ]
    },
    {
      id: 'bags',
      name: 'Чанти',
      items: [
        { id: 'handbags', name: 'Дамски чанти' },
        { id: 'backpacks', name: 'Раници' },
        { id: 'wallets', name: 'Портмонета' },
      ]
    },
    {
      id: 'accessories',
      name: 'Аксесоари',
      items: [
        { id: 'jewelry', name: 'Бижута' },
        { id: 'watches', name: 'Часовници' },
        { id: 'sunglasses', name: 'Слънчеви очила' },
        { id: 'hats', name: 'Шапки & Шалове' },
      ]
    }
  ],
  men: [
    {
      id: 'clothing',
      name: 'Дрехи',
      items: [
        { id: 'tshirts', name: 'Тениски' },
        { 
            id: 'hoodies', 
            name: 'Суичъри',
            items: [
                { id: 'zip', name: 'С цип' },
                { id: 'pullover', name: 'Без цип' },
                { id: 'fleece', name: 'Полар' }
            ] 
        },
        { id: 'pants', name: 'Панталони' },
        { id: 'jeans', name: 'Дънки' },
        { id: 'suits', name: 'Костюми' },
      ]
    },
    {
      id: 'shoes',
      name: 'Обувки',
      items: [
        { id: 'sneakers', name: 'Сникърси' },
        { id: 'boots', name: 'Боти' },
        { id: 'formal', name: 'Официални' },
        { id: 'slippers', name: 'Джапанки' },
      ]
    },
    {
      id: 'accessories',
      name: 'Аксесоари',
      items: [
        { id: 'watches', name: 'Часовници' },
        { id: 'belts', name: 'Колани' },
        { id: 'hats', name: 'Шапки' },
      ]
    }
  ],
  kids: [
    {
      id: 'girls',
      name: 'Момичета',
      items: [
         { id: 'clothing', name: 'Дрехи' },
         { id: 'shoes', name: 'Обувки' }
      ]
    },
    {
      id: 'boys',
      name: 'Момчета',
      items: [
         { id: 'clothing', name: 'Дрехи' },
         { id: 'shoes', name: 'Обувки' }
      ]
    },
    {
       id: 'toys',
       name: 'Играчки',
       items: [
          { id: 'educational', name: 'Образователни' },
          { id: 'outdoor', name: 'За навън' }
       ]
    }
  ]
};

export const SUB_CATEGORIES = [
  { id: 'all', name: 'Всички' },
  { id: 'shoes', name: 'Обувки' },
  { id: 'clothes', name: 'Дрехи' },
  { id: 'accessories', name: 'Аксесоари' },
  { id: 'watches', name: 'Часовници' },
  { id: 'bags', name: 'Чанти' },
  { id: 'jewelry', name: 'Бижута' },
];

export const FILTERS: Filter[] = [
  { id: 'promoted', label: 'Промо' },
  { id: 'nearby', label: 'Близо до мен' },
  { id: 'newest', label: 'Най-нови' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Apple iPhone 13 Pro Max - 256GB - Graphite',
    price: 1250,
    currency: 'лв.',
    imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400',
    tag: 'ТОП',
    isFavorite: false,
    location: 'София',
    condition: 'Like New',
    postedAt: 'преди 2ч',
  },
  {
    id: '2',
    title: 'Винтидж кожено яке естествена кожа',
    price: 85,
    currency: 'лв.',
    imageUrl: 'https://images.unsplash.com/photo-1551028919-ac7efe5fab2c?auto=format&fit=crop&q=80&w=400',
    isFavorite: true,
    location: 'Пловдив',
    condition: 'Good',
    postedAt: 'вчера',
  },
  {
    id: '3',
    title: 'Sony PlayStation 5 Disc Edition + 2 игри',
    price: 850,
    currency: 'лв.',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400',
    tag: 'Спешно',
    isFavorite: false,
    location: 'Варна',
    condition: 'New',
    postedAt: 'преди 15м',
  },
  {
    id: '4',
    title: 'Nike Air Jordan 1 High OG Chicago',
    price: 320,
    currency: 'лв.',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400',
    isFavorite: false,
    location: 'София',
    condition: 'New',
    postedAt: 'преди 4ч',
  },
  {
    id: '5',
    title: 'MacBook Air M1 2020 Space Grey',
    price: 1100,
    currency: 'лв.',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400',
    tag: 'Гаранция',
    isFavorite: false,
    location: 'Бургас',
    condition: 'Like New',
    postedAt: 'днес',
  },
  {
    id: '6',
    title: 'Професионален фотоапарат Sony A7III Body',
    price: 2800,
    currency: 'лв.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
    isFavorite: true,
    location: 'София',
    condition: 'Used',
    postedAt: 'преди 30м',
  },
];