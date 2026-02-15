import type { LucideIcon, LucideProps } from "lucide-react";

type LegacyWeight = "thin" | "light" | "regular" | "duotone" | "bold" | "fill" | string;

export type IconProps = Omit<LucideProps, "stroke"> & {
  mirrored?: boolean;
  stroke?: string | number;
  weight?: LegacyWeight;
};

export type Icon = (props: IconProps) => ReturnType<LucideIcon>;

function weightToStrokeWidth(weight: LegacyWeight | undefined): number | undefined {
  if (!weight) return undefined;
  switch (weight) {
    case "thin":
      return 1;
    case "light":
      return 1.5;
    case "regular":
    case "duotone":
    case "fill":
      return 2;
    case "bold":
      return 2.5;
    default:
      return undefined;
  }
}

function toLegacyIcon(icon: LucideIcon): Icon {
  return function LegacyIcon({ mirrored, style, stroke, strokeWidth, weight, ...rest }) {
    const resolvedStrokeWidth =
      typeof stroke === "number" ? stroke : strokeWidth ?? weightToStrokeWidth(weight);
    const resolvedStroke = typeof stroke === "string" ? stroke : undefined;
    const resolvedStyle = mirrored
      ? { ...style, transform: `${style?.transform ?? ""} scaleX(-1)`.trim() }
      : style;

    const IconComponent = icon;
    return (
      <IconComponent
        {...rest}
        stroke={resolvedStroke}
        strokeWidth={resolvedStrokeWidth}
        style={resolvedStyle}
      />
    );
  };
}

export function createLegacyIconPicker(
  icons: Record<string, LucideIcon | undefined>,
  fallbackIcon: LucideIcon,
) {
  return (...names: string[]): Icon => {
    for (const name of names) {
      const icon = icons[name];
      if (icon) return toLegacyIcon(icon);
    }
    return toLegacyIcon(fallbackIcon);
  };
}
