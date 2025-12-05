"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { 
  List, 
  CaretRight,
  CaretDown,
  Monitor, 
  Laptop, 
  House, 
  ShoppingBag, 
  GameController, 
  TShirt, 
  Baby, 
  Heart, 
  Wrench, 
  Car, 
  Gift, 
  BookOpen, 
  Barbell, 
  Dog, 
  Lightbulb,
  DeviceMobile,
  Watch,
  Headphones,
  Camera,
  Television,
  MusicNotes,
  Briefcase,
  ForkKnife,
  Leaf,
  Code,
  ShoppingCart,
  Diamond,
  Palette,
  Pill,
  GraduationCap,
  Guitar,
  FilmStrip,
  Flask,
  Trophy,
  Hammer,
  Flower,
  PaintBrush,
  Tag
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import Image from "next/image"
import { categoryBlurDataURL } from "@/lib/image-utils"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon?: string | null
  image_url?: string | null
  children?: Category[]
}



// Map category slugs to Lucide icons - expanded list
const categoryIconMap: Record<string, React.ReactNode> = {
  "electronics": <Monitor size={20} weight="regular" className="mega-menu-icon" />,
  "computers": <Laptop size={20} weight="regular" className="mega-menu-icon" />,
  "smart-home": <Lightbulb size={20} weight="regular" className="mega-menu-icon" />,
  "gaming": <GameController size={20} weight="regular" className="mega-menu-icon" />,
  "fashion": <TShirt size={20} weight="regular" className="mega-menu-icon" />,
  "home": <House size={20} weight="regular" className="mega-menu-icon" />,
  "home-kitchen": <ForkKnife size={20} weight="regular" className="mega-menu-icon" />,
  "sports": <Barbell size={20} weight="regular" className="mega-menu-icon" />,
  "sports-outdoors": <Barbell size={20} weight="regular" className="mega-menu-icon" />,
  "beauty": <PaintBrush size={20} weight="regular" className="mega-menu-icon" />,
  "toys": <Gift size={20} weight="regular" className="mega-menu-icon" />,
  "books": <BookOpen size={20} weight="regular" className="mega-menu-icon" />,
  "automotive": <Car size={20} weight="regular" className="mega-menu-icon" />,
  "health": <Heart size={20} weight="regular" className="mega-menu-icon" />,
  "baby": <Baby size={20} weight="regular" className="mega-menu-icon" />,
  "pets": <Dog size={20} weight="regular" className="mega-menu-icon" />,
  "pet-supplies": <Dog size={20} weight="regular" className="mega-menu-icon" />,
  "tools": <Wrench size={20} weight="regular" className="mega-menu-icon" />,
  "lighting": <Lightbulb size={20} weight="regular" className="mega-menu-icon" />,
  "phones": <DeviceMobile size={20} weight="regular" className="mega-menu-icon" />,
  "watches": <Watch size={20} weight="regular" className="mega-menu-icon" />,
  "audio": <Headphones size={20} weight="regular" className="mega-menu-icon" />,
  "cameras": <Camera size={20} weight="regular" className="mega-menu-icon" />,
  "tv": <Television size={20} weight="regular" className="mega-menu-icon" />,
  "music": <MusicNotes size={20} weight="regular" className="mega-menu-icon" />,
  "office": <Briefcase size={20} weight="regular" className="mega-menu-icon" />,
  "garden": <Leaf size={20} weight="regular" className="mega-menu-icon" />,
  "software-services": <Code size={20} weight="regular" className="mega-menu-icon" />,
  // New categories
  "grocery": <ShoppingCart size={20} weight="regular" className="mega-menu-icon" />,
  "jewelry-watches": <Diamond size={20} weight="regular" className="mega-menu-icon" />,
  "handmade": <Palette size={20} weight="regular" className="mega-menu-icon" />,
  "health-wellness": <Pill size={20} weight="regular" className="mega-menu-icon" />,
  "cbd-wellness": <Leaf size={20} weight="regular" className="mega-menu-icon" />,
  "office-school": <GraduationCap size={20} weight="regular" className="mega-menu-icon" />,
  "musical-instruments": <Guitar size={20} weight="regular" className="mega-menu-icon" />,
  "movies-music": <FilmStrip size={20} weight="regular" className="mega-menu-icon" />,
  "industrial-scientific": <Flask size={20} weight="regular" className="mega-menu-icon" />,
  "collectibles": <Trophy size={20} weight="regular" className="mega-menu-icon" />,
  "baby-kids": <Baby size={20} weight="regular" className="mega-menu-icon" />,
  "tools-home": <Hammer size={20} weight="regular" className="mega-menu-icon" />,
  "garden-outdoor": <Flower size={20} weight="regular" className="mega-menu-icon" />,
  // Missing L0 icons from DB audit (Phase 1 fix)
  "e-mobility": <Leaf size={20} weight="regular" className="mega-menu-icon" />,
  "services": <Briefcase size={20} weight="regular" className="mega-menu-icon" />,
  "bulgarian-traditional": <ForkKnife size={20} weight="regular" className="mega-menu-icon" />,
  "wholesale": <ShoppingBag size={20} weight="regular" className="mega-menu-icon" />,
  "software": <Code size={20} weight="regular" className="mega-menu-icon" />,
  "real-estate": <House size={20} weight="regular" className="mega-menu-icon" />,
  "hobbies": <Guitar size={20} weight="regular" className="mega-menu-icon" />,
}

// Fallback product images for subcategories - comprehensive mapping
const subcategoryImages: Record<string, string> = {
  // Electronics
  "smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
  "laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80",
  "tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80",
  "headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  "cameras": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80",
  "tvs": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80",
  "tv-home-cinema": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80",
  "consoles": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80",
  "desktops": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&q=80",
  "monitors": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80",
  "keyboards": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=80",
  "audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  "wearables": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  "smart-devices": "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=200&q=80",
  "phones-tablets": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
  // Fashion
  "shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
  "women": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80",
  "men": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&q=80",
  "bags": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80",
  "accessories": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=200&q=80",
  "jewelry": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80",
  // Home
  "furniture": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80",
  "appliances": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&q=80",
  "kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
  "bedding": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&q=80",
  "decor": "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=200&q=80",
  "garden": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80",
  // Beauty
  "skincare": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80",
  "makeup": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&q=80",
  "haircare": "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=200&q=80",
  "fragrance": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&q=80",
  // Gaming
  "gaming-consoles": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80",
  "pc-gaming": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&q=80",
  "gaming-accessories": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&q=80",
  "games": "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=200&q=80",
  // Books
  "fiction": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&q=80",
  "non-fiction": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80",
  "textbooks": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&q=80",
  "children-books": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80",
  // Automotive
  "auto-accessories": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=200&q=80",
  "car-electronics": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80",
  "auto-parts": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&q=80",
  "motorcycle": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&q=80",
  "tires-wheels": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&q=80",
  // Sports
  "fitness": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
  "exercise-fitness": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
  "outdoor": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&q=80",
  "outdoor-recreation": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&q=80",
  "team-sports": "https://images.unsplash.com/photo-1461896836934-28e9b70b7d32?w=200&q=80",
  "sports-equipment": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&q=80",
  "cycling": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&q=80",
  // Toys
  "action-figures": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&q=80",
  "building-toys": "https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=200&q=80",
  "dolls": "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=200&q=80",
  "educational": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&q=80",
  // Software & Services
  "business-software": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=80",
  "creative-software": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=80",
  "security-software": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&q=80",
  "operating-systems": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200&q=80",
  "online-courses": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=200&q=80",
  "ai-tech-courses": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&q=80",
  "web-services": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&q=80",
  "cloud-saas": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&q=80",
  "professional-services": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&q=80",
  "subscriptions": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&q=80",
  // Grocery & Gourmet
  "snacks-sweets": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&q=80",
  "beverages": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80",
  "organic-natural": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80",
  "international-foods": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80",
  "pantry-staples": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=200&q=80",
  "coffee-tea": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80",
  // Pet Supplies
  "dogs": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80",
  "cats": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80",
  "fish-aquatic": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200&q=80",
  "birds": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&q=80",
  "small-animals": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200&q=80",
  "pet-food": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=80",
  // Garden & Outdoor
  "plants-seeds": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80",
  "garden-tools": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80",
  "patio-furniture": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=200&q=80",
  "grills-bbq": "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=200&q=80",
  "outdoor-decor": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  "pools-spas": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=200&q=80",
  // Jewelry & Watches
  "fine-jewelry": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80",
  "fashion-jewelry": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=80",
  "luxury-watches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  "smart-watches": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80",
  "engagement-wedding": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80",
  "watch-accessories": "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=200&q=80",
  // Handmade & Crafts
  "handmade-jewelry": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&q=80",
  "art-paintings": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&q=80",
  "craft-supplies": "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&q=80",
  "custom-personalized": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&q=80",
  "home-decor-crafts": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&q=80",
  "knitting-crochet": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  // Health & Wellness
  "vitamins-supplements": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80",
  "medical-supplies": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&q=80",
  "first-aid": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=200&q=80",
  "fitness-nutrition": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&q=80",
  "personal-care": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&q=80",
  "wellness-equipment": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&q=80",
  // Office & School
  "office-supplies": "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=200&q=80",
  "school-supplies": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80",
  "desk-accessories": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200&q=80",
  "printers-ink": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&q=80",
  "office-furniture": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&q=80",
  "calendars-planners": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=200&q=80",
  // Musical Instruments
  "guitars-basses": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&q=80",
  "keyboards-pianos": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&q=80",
  "drums-percussion": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200&q=80",
  "dj-equipment": "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&q=80",
  "wind-instruments": "https://images.unsplash.com/photo-1558584673-90d3e2c6f626?w=200&q=80",
  "recording-equipment": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&q=80",
  // Movies, Music & Media
  "bluray-dvd": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&q=80",
  "vinyl-records": "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=200&q=80",
  "cds-music": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&q=80",
  "streaming-cards": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&q=80",
  "posters-art-prints": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&q=80",
  "fan-merchandise": "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=200&q=80",
  // Industrial & Scientific
  "lab-equipment": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&q=80",
  "safety-equipment": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&q=80",
  "raw-materials": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  "test-measurement": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&q=80",
  "industrial-hardware": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&q=80",
  "3d-printing": "https://images.unsplash.com/photo-1631558382158-5e8e0b8e0e0e?w=200&q=80",
  // Collectibles & Art
  "trading-cards": "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=200&q=80",
  "coins-currency": "https://images.unsplash.com/photo-1621981386829-9b458a2cddde?w=200&q=80",
  "stamps": "https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=200&q=80",
  "sports-memorabilia": "https://images.unsplash.com/photo-1461896836934-28e9b70b7d32?w=200&q=80",
  "vintage-antiques": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  "figurines-models": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&q=80",
  "comic-books": "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=200&q=80",
  "autographs": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&q=80",
  // Baby & Kids
  "baby-gear": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&q=80",
  "diapers-wipes": "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?w=200&q=80",
  "baby-feeding": "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?w=200&q=80",
  "kids-clothing": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200&q=80",
  "nursery": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=200&q=80",
  "kids-learning": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80",
  // Tools & Home Improvement
  "power-tools": "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&q=80",
  "hand-tools": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80",
  "electrical": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
  "plumbing": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&q=80",
  "building-materials": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80",
  "paint-wall": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&q=80",
  // Default fallback
  "default": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80"
}

function getSubcategoryImage(slug: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl
  return subcategoryImages[slug] || subcategoryImages["default"]
}

function getCategoryIcon(slug: string): React.ReactNode {
  return categoryIconMap[slug] || <ShoppingBag size={20} weight="regular" className="mega-menu-icon" />
}

// Maximum visible categories before showing "View more"
const MAX_VISIBLE_CATEGORIES = 25

// Cache categories globally to prevent refetching
let categoriesCache: Category[] | null = null
let categoriesFetching = false
let categoriesCallbacks: Array<(cats: Category[]) => void> = []

export function MegaMenu() {
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>(categoriesCache || [])
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(!categoriesCache)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(118) // Default fallback
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Measure header height dynamically for proper positioning
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        setHeaderHeight(header.offsetHeight)
      }
    }
    
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  // Fetch categories with children - with global caching
  useEffect(() => {
    // Use cached data if available
    if (categoriesCache) {
      setCategories(categoriesCache)
      if (categoriesCache.length > 0) {
        setActiveCategory(categoriesCache[0])
      }
      setIsLoading(false)
      return
    }

    // If already fetching, wait for result
    if (categoriesFetching) {
      categoriesCallbacks.push((cats) => {
        setCategories(cats)
        if (cats.length > 0) setActiveCategory(cats[0])
        setIsLoading(false)
      })
      return
    }

    // Fetch and cache
    categoriesFetching = true
    fetch("/api/categories?children=true")
      .then((res) => res.json())
      .then((data) => {
        const cats = data.categories || []
        categoriesCache = cats
        setCategories(cats)
        if (cats.length > 0) {
          setActiveCategory(cats[0])
        }
        // Notify waiting callbacks
        categoriesCallbacks.forEach(cb => cb(cats))
        categoriesCallbacks = []
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err)
      })
      .finally(() => {
        categoriesFetching = false
        setIsLoading(false)
      })
  }, [])

  const getCategoryName = useCallback((cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }, [locale])

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }, [])

  const handleCategoryHover = useCallback((category: Category) => {
    setActiveCategory(category)
  }, [])

  // Helper to close menu
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div 
        className="relative"
        ref={menuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trigger Button - uses negative margin to align icon with content edge, no hover bg to avoid overflow */}
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 mega-menu-text font-normal px-3 py-2.5 h-10 -ml-3",
            "text-header-text hover:text-brand hover:bg-transparent",
            "rounded-sm",
            isOpen && "text-brand"
          )}
        >
          <List size={18} weight="bold" />
          <span>{locale === "bg" ? "Всички категории" : "All categories"}</span>
        </Button>
      </div>

      {/* Mega Menu Panel - Full width, positioned below header */}
      <div
        className={cn(
          "fixed left-0 right-0 z-40",
          "bg-background",
          "border-b border-border shadow-lg",
          "transition-opacity duration-150 ease-out",
          isOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${headerHeight}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container flex max-h-(--mega-menu-max-height)">
          {/* Left Sidebar - Clean Categories List with scroll */}
          <div className="w-64 border-r border-border py-2 shrink-0 overflow-y-auto overscroll-contain">
              {isLoading ? (
                <div className="px-4 py-12 text-center">
                  <div className="size-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mx-auto" />
                  <p className="mt-3 mega-menu-text text-muted-foreground">
                    {locale === "bg" ? "Зареждане..." : "Loading..."}
                  </p>
                </div>
              ) : (
                <nav className="pb-2">
                  {/* Show categories with dynamic limit */}
                  {(showAllCategories ? categories : categories.slice(0, MAX_VISIBLE_CATEGORIES)).map((category) => {
                    const categoryName = getCategoryName(category)
                    return (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        title={categoryName} // Tooltip for truncated text
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 mega-menu-text group",
                          "transition-colors duration-100",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          activeCategory?.id === category.id
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                        onMouseEnter={() => handleCategoryHover(category)}
                        onClick={closeMenu}
                      >
                        <span className={cn(
                          "shrink-0 transition-colors duration-100",
                          activeCategory?.id === category.id 
                            ? "text-brand" 
                            : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {getCategoryIcon(category.slug)}
                        </span>
                        <span className="flex-1 truncate">{categoryName}</span>
                        {category.children && category.children.length > 0 && (
                          <CaretRight size={16} weight="regular" className={cn(
                            "shrink-0 transition-transform duration-100",
                            activeCategory?.id === category.id && "translate-x-0.5 text-brand"
                          )} />
                        )}
                      </Link>
                    )
                  })}
                  
                  {/* View More button if there are more categories */}
                  {!showAllCategories && categories.length > MAX_VISIBLE_CATEGORIES && (
                    <button
                      onClick={() => setShowAllCategories(true)}
                      className="flex items-center gap-2 px-3 py-2.5 w-full mega-menu-text text-brand hover:text-brand/80 hover:bg-accent/50 transition-colors duration-100"
                    >
                      <CaretDown size={16} weight="regular" />
                      <span>
                        {locale === "bg" 
                          ? `Виж още ${categories.length - MAX_VISIBLE_CATEGORIES}` 
                          : `View ${categories.length - MAX_VISIBLE_CATEGORIES} more`}
                      </span>
                    </button>
                  )}
                  
                  {/* See All Categories Link */}
                  <div className="border-t border-border mt-2 pt-1">
                    <Link
                      href="/categories"
                      onClick={closeMenu}
                      className="flex items-center gap-2.5 px-3 py-2 mega-menu-text font-medium text-brand hover:text-brand/80 hover:bg-accent/50 transition-colors duration-100"
                    >
                      <ShoppingBag size={20} weight="regular" />
                      <span>{locale === "bg" ? "Всички категории" : "See All Categories"}</span>
                      <CaretRight size={16} weight="regular" className="ml-auto" />
                    </Link>
                    <Link
                      href="/deals"
                      onClick={closeMenu}
                      className="flex items-center gap-2.5 px-3 py-2 mega-menu-text font-medium text-red-500 hover:text-red-600 hover:bg-accent/50 transition-colors duration-100"
                    >
                      <Tag size={20} weight="fill" />
                      <span>{locale === "bg" ? "Промоции" : "Deals"}</span>
                      <CaretRight size={16} weight="regular" className="ml-auto" />
                    </Link>
                  </div>
                </nav>
              )}
            </div>

            {/* Right Panel - Subcategories */}
            <div className="flex-1 p-5 bg-background overflow-y-auto overscroll-contain">
              {activeCategory && (
                <div>
                  {/* Category Header - Simplified */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                    <div className="flex items-center gap-2.5">
                      <span className="text-brand">
                        {getCategoryIcon(activeCategory.slug)}
                      </span>
                      <h3 className="text-lg font-medium text-foreground">
                        {getCategoryName(activeCategory)}
                      </h3>
                    </div>
                    <Link
                      href={`/categories/${activeCategory.slug}`}
                      onClick={closeMenu}
                      className="mega-menu-text font-normal text-brand hover:text-brand/80 transition-colors flex items-center gap-1"
                    >
                      {locale === "bg" ? "Виж всички" : "Browse all"}
                      <CaretRight size={16} weight="regular" />
                    </Link>
                  </div>

                  {/* Subcategory Cards Grid - Large cards */}
                  {activeCategory.children && activeCategory.children.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {activeCategory.children.slice(0, 16).map((subcat) => (
                        <Link
                          key={subcat.id}
                          href={`/search?category=${subcat.slug}`}
                          onClick={closeMenu}
                          className="group flex flex-col items-center gap-2"
                        >
                          {/* Square Image */}
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted ring-1 ring-border/40 group-hover:ring-brand/60 transition-all duration-150">
                            <Image
                              src={getSubcategoryImage(subcat.slug, subcat.image_url)}
                              alt={getCategoryName(subcat)}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              placeholder="blur"
                              blurDataURL={categoryBlurDataURL()}
                              loading="lazy"
                            />
                          </div>
                          {/* Label */}
                          <span className="text-sm text-center text-muted-foreground group-hover:text-foreground font-normal line-clamp-2 leading-tight transition-colors">
                            {getCategoryName(subcat)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <ShoppingBag size={40} weight="regular" className="mb-3 opacity-30" />
                      <p className="mega-menu-text">
                        {locale === "bg" 
                          ? "Разгледай категорията за продукти" 
                          : "Browse category for products"}
                      </p>
                      <Link
                        href={`/categories/${activeCategory.slug}`}
                        onClick={closeMenu}
                        className="mt-2 mega-menu-text text-brand hover:text-brand/80 transition-colors"
                      >
                        {locale === "bg" ? "Отиди към категорията" : "Go to category"}
                      </Link>
                    </div>
                  )}

                  {/* Show more link if more than 16 subcategories */}
                  {activeCategory.children && activeCategory.children.length > 16 && (
                    <div className="mt-4 pt-2 border-t border-border">
                      <Link
                        href={`/categories/${activeCategory.slug}`}
                        onClick={closeMenu}
                        className="inline-flex items-center gap-1 mega-menu-text font-normal text-brand hover:text-brand/80 transition-colors"
                      >
                        {locale === "bg" 
                          ? `Виж всички ${activeCategory.children.length}` 
                          : `View all ${activeCategory.children.length}`}
                        <CaretRight size={16} weight="regular" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Backdrop overlay - Subtle */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/30 z-30 transition-opacity duration-150",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${headerHeight}px` }}
        onClick={closeMenu}
        aria-hidden="true"
      />
    </>
  )
}
