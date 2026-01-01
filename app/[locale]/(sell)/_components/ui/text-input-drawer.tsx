"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface TextInputDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "date";
  locale?: string;
}

/**
 * TextInputDrawer - Drawer component for text/number/date input on mobile
 * 
 * Opens a drawer with a single input field, cancel and save buttons.
 * Used for brand input, custom attributes, and other text fields.
 */
export function TextInputDrawer({
  isOpen,
  onClose,
  title,
  description,
  value,
  onChange,
  placeholder = "",
  type = "text",
  locale = "en",
}: TextInputDrawerProps) {
  const [inputValue, setInputValue] = useState(value);
  const isBg = locale === "bg";

  // Reset local state when drawer opens
  useEffect(() => {
    if (isOpen) setInputValue(value);
  }, [isOpen, value]);

  const handleSave = () => {
    onChange(inputValue);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="border-b border-border pb-3">
          <DrawerTitle className="text-lg">{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <Input
            type={type}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="h-12 text-base rounded-md"
            autoFocus
          />
        </div>

        <div className="p-4 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-md"
            onClick={onClose}
          >
            {isBg ? "Отказ" : "Cancel"}
          </Button>
          <Button
            className="flex-1 h-12 rounded-md"
            onClick={handleSave}
          >
            {isBg ? "Запази" : "Save"}
          </Button>
        </div>

        <div className="pb-[env(safe-area-inset-bottom)]" />
      </DrawerContent>
    </Drawer>
  );
}
