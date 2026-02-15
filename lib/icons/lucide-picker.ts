import * as Lucide from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createLegacyIconPicker } from "@/lib/icons/compat";

const ICONS = Lucide as unknown as Record<string, LucideIcon | undefined>;
const FALLBACK_ICON: LucideIcon = Lucide.Circle;

export function createLucideLegacyPicker() {
  return createLegacyIconPicker(ICONS, FALLBACK_ICON);
}
