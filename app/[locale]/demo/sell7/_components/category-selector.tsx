"use client";

import { useState, useMemo } from "react";
import { Search, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  name_bg?: string | null;
  icon?: string | null;
  children?: CategoryNode[];
};

function flattenCategories(nodes: CategoryNode[]): CategoryNode[] {
  let flat: CategoryNode[] = [];
  for (const node of nodes) {
    flat.push(node);
    if (node.children && node.children.length > 0) {
      flat = [...flat, ...flattenCategories(node.children)];
    }
  }
  return flat;
}

interface CategorySelectorProps {
  categories: CategoryNode[];
  onSelect: (category: CategoryNode, path: CategoryNode[]) => void;
  selectedId: string;
}

export function CategorySelector({
  categories,
  onSelect,
  selectedId,
}: CategorySelectorProps) {
  const [currentLevel, setCurrentLevel] = useState<CategoryNode[]>(categories);
  const [breadcrumbs, setBreadcrumbs] = useState<CategoryNode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLevelClick = (category: CategoryNode) => {
    if (category.children && category.children.length > 0) {
      setBreadcrumbs([...breadcrumbs, category]);
      setCurrentLevel(category.children);
    } else {
      // Leaf node selected
      onSelect(category, [...breadcrumbs, category]);
    }
  };

  const handleBack = () => {
    if (breadcrumbs.length === 0) return;
    
    const newBreadcrumbs = breadcrumbs.slice(0, -1);
    const parent = newBreadcrumbs.length > 0 ? newBreadcrumbs[newBreadcrumbs.length - 1] : null;
    
    setBreadcrumbs(newBreadcrumbs);
    setCurrentLevel(parent?.children ?? categories);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const all = flattenCategories(categories);
    return all.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const displayedCategories = searchQuery.trim() ? searchResults : currentLevel;
  const isSearching = !!searchQuery.trim();

  return (
    <div className="flex flex-col bg-background h-[60vh] min-h-[400px]">
      {/* Header Area */}
      <div className="flex flex-col border-b border-border">
        {/* Navigation / Breadcrumb Row */}
        {breadcrumbs.length > 0 && !isSearching ? (
           <div className="flex items-center h-12 px-2 bg-background">
             <Button
                variant="ghost"
                onClick={handleBack}
                className="h-9 px-2 text-primary -ml-1 hover:bg-transparent hover:text-primary/70 font-medium text-[17px] flex items-center gap-1"
              >
                <ChevronLeft className="h-6 w-6" />
                Back
             </Button>
             <div className="flex-1 text-center pr-12 font-semibold text-[17px]">
                {breadcrumbs.at(-1)?.name}
             </div>
           </div>
        ) : (
           <div className="h-12 flex items-center justify-center font-semibold text-[17px]">
              Categories
           </div>
        )}

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all categories"
              className="pl-9 h-10 bg-muted/50 border-transparent focus-visible:bg-muted/80 focus-visible:ring-0 rounded-xl text-[17px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1 min-h-0 bg-background">
        {displayedCategories.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-[17px]">
            No categories found.
          </div>
        ) : (
          <div className="divide-y divide-border/60 ml-4"> {/* Indented divider pattern */}
            {displayedCategories.map((category) => {
              const isLeaf = !category.children || category.children.length === 0;
              const isSelected = selectedId === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => isSearching ? onSelect(category, []) : handleLevelClick(category)}
                  className={cn(
                    "w-full flex items-center justify-between py-3.5 pr-4 text-left active:bg-muted/30 transition-colors group",
                  )}
                >
                  <div className="flex flex-col py-0.5">
                    <span className={cn(
                      "text-[17px]",
                      isSelected ? "font-semibold text-primary" : "text-foreground font-normal"
                    )}>
                      {category.name}
                    </span>
                    {isSearching && (
                      <span className="text-[13px] text-muted-foreground leading-none mt-1">
                         Found in search
                      </span>
                    )}
                  </div>
                  
                  {!isSearching && !isLeaf ? (
                    <ChevronRight className="h-5 w-5 text-muted-foreground/30 font-bold" />
                  ) : (
                     isSelected && <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
