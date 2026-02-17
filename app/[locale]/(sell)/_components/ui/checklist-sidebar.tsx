import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ChecklistItem {
  key: string;
  labelKey: string;
  completed: boolean;
}

interface ChecklistSidebarProps {
  items: ChecklistItem[];
}

/**
 * ChecklistSidebar - Desktop sidebar showing form completion checklist
 * 
 * Displays a numbered list of form sections with completion status.
 * Shows checkmark for completed items, numbers for incomplete.
 */
export function ChecklistSidebar({
  items,
}: ChecklistSidebarProps) {
  const completedCount = items.filter(i => i.completed).length;
  const t = useTranslations("Sell")
  
  return (
    <div className="p-4 rounded-md border border-border bg-background">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-sm font-semibold text-foreground">
          {t("checklistSidebar.title")}
        </h4>
        <span className="text-xs font-medium text-muted-foreground tabular-nums bg-surface-subtle px-2 py-0.5 rounded border border-border-subtle">
          {completedCount}/{items.length}
        </span>
      </div>
      <ul className="space-y-3.5">
        {items.map((item, index) => (
          <li key={item.key} className="flex items-center gap-3.5">
            <div className={cn(
              "size-5.5 rounded-md flex items-center justify-center shrink-0 transition-all border",
              item.completed 
                ? "bg-primary border-primary text-primary-foreground" 
                : "bg-background border-border text-muted-foreground"
            )}>
              {item.completed && <Check className="size-3" />}
              {!item.completed && <span className="text-xs font-semibold">{index + 1}</span>}
            </div>
            <span className={cn(
              "text-xs font-bold tracking-tight transition-colors",
              item.completed ? "text-foreground" : "text-muted-foreground"
            )}>
              {t(item.labelKey as never)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

