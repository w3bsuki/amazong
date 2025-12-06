/**
 * Centralized Icon Exports
 * 
 * Re-exports commonly used Phosphor icons with consistent naming and sizing.
 * Import from here instead of @phosphor-icons/react directly for consistency.
 * 
 * @example
 * import { Icons } from "@/components/icons"
 * <Icons.ShoppingCart size={20} />
 */

export {
  // Navigation & UI
  List,
  X,
  CaretDown,
  CaretRight,
  CaretLeft,
  CaretUp,
  ArrowRight,
  ArrowLeft,
  MagnifyingGlass,
  User,
  MapPin,
  Bell,
  
  // E-commerce
  ShoppingCart,
  ShoppingBag,
  Package,
  Tag,
  Truck,
  CreditCard,
  Heart,
  Star,
  Plus,
  Minus,
  Trash,
  
  // Communication
  ChatCircle,
  PaperPlaneTilt,
  Envelope,
  
  // Categories
  Monitor,
  Laptop,
  Lightbulb,
  GameController,
  TShirt,
  House,
  ForkKnife,
  Barbell,
  PaintBrush,
  Gift,
  BookOpen,
  Car,
  Baby,
  Dog,
  DeviceMobile,
  Watch,
  Headphones,
  Camera,
  Television,
  MusicNotes,
  Briefcase,
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
  Code,
  Leaf,
  
  // Actions
  ArrowCounterClockwise,
  TrendUp,
  Clock,
  SpinnerGap,
  Check,
  Warning,
  Info,
  Question,
  
  // Media
  Play,
  Pause,
  Image,
  
  // Social
  Share,
  Link as LinkIcon,
} from "@phosphor-icons/react"

// Re-export icon component types
export type { IconProps } from "@phosphor-icons/react"

/**
 * Default icon size constants
 */
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const

/**
 * Default icon weight for consistency
 */
export const DEFAULT_ICON_WEIGHT = "regular" as const
