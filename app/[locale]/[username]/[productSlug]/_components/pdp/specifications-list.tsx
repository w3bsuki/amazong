import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SpecItem {
  key: string;
  value: string | number | undefined | null;
}

interface SpecificationsListProps {
  specifications: SpecItem[];
}

/**
 * Product specifications list with alternating row backgrounds.
 */
export function SpecificationsList({ specifications }: SpecificationsListProps) {
  const t = useTranslations("Product");
  const validSpecs = specifications.filter(
    (spec) => spec.value !== undefined && spec.value !== null && spec.value !== ""
  );

  if (validSpecs.length === 0) return null;

  const getSpecLabel = (key: string): string => {
    if (key === "condition") {
      return t("conditionLabel").replace(/:$/, "")
    }

    return key
      .replaceAll("_", " ")
      .replaceAll(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("specifications")}
      </h3>
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {validSpecs.map((spec, index) => (
          <div
            key={`${spec.key}-${index}`}
            className={cn(
              "flex justify-between items-center px-3 py-2.5",
              index % 2 === 1 && "bg-surface-subtle"
            )}
          >
            <span className="text-sm text-muted-foreground">{getSpecLabel(spec.key)}</span>
            <span className="text-sm font-medium text-foreground">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { SpecItem, SpecificationsListProps };

