"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { useForm, FormProvider, useFormContext, type UseFormReturn, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sellFormSchemaV4,
  type SellFormDataV4,
  defaultSellFormValuesV4,
  calculateFormProgress,
  type ProgressItem,
} from "@/lib/sell/schema-v4";
import type { Category } from "../_lib/types";

// ============================================================================
// SELL FORM CONTEXT - Extended state beyond react-hook-form
// ============================================================================

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  is_verified?: boolean;
}

interface SellFormContextValue {
  // Core data
  locale: string;
  categories: Category[];
  brands: Brand[];
  sellerId: string;
  
  // Form state
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
  autoSaved: boolean;
  setAutoSaved: (value: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  
  // Progress tracking
  progress: number;
  progressItems: ProgressItem[];
  nextStep: ProgressItem | null;
  
  // Navigation (for stepper)
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  
  // Draft management
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  clearDraft: () => void;
  
  // Helpers
  isBg: boolean;
}

const SellFormContext = createContext<SellFormContextValue | null>(null);

/**
 * Hook to access the extended sell form context.
 * Must be used within a SellFormProvider.
 */
export function useSellFormContext(): SellFormContextValue {
  const ctx = useContext(SellFormContext);
  if (!ctx) {
    throw new Error("useSellFormContext must be used within a SellFormProvider");
  }
  return ctx;
}

/**
 * Hook to access react-hook-form's form methods with proper typing.
 * Combines useFormContext with our schema type.
 */
export function useSellForm(): UseFormReturn<SellFormDataV4> {
  return useFormContext<SellFormDataV4>();
}

// ============================================================================
// SELL FORM PROVIDER - Wraps form with FormProvider + custom context
// ============================================================================

interface SellFormProviderProps {
  children: ReactNode;
  locale: string;
  categories: Category[];
  brands?: Brand[];
  sellerId: string;
  defaultValues?: Partial<SellFormDataV4>;
  existingProduct?: SellFormDataV4 & { id: string };
  totalSteps?: number;
}

const DRAFT_STORAGE_KEY = "sell-form-draft-v4";

export function SellFormProvider({
  children,
  locale,
  categories,
  brands = [],
  sellerId,
  defaultValues,
  existingProduct,
  totalSteps = 5,
}: SellFormProviderProps) {
  // Form setup with react-hook-form
  const methods = useForm<SellFormDataV4>({
    resolver: zodResolver(sellFormSchemaV4) as unknown as Resolver<SellFormDataV4>,
    defaultValues: existingProduct || { ...defaultSellFormValuesV4, ...defaultValues },
    mode: "onChange", // Validate on change for real-time feedback
  });

  // Extended state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Track changes for auto-save
  const lastSavedRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const draftRestoredRef = useRef(false);

  // Calculate progress from form values
  const formValues = methods.watch();
  const { percentage: progress, items: progressItems, nextStep } = calculateFormProgress(formValues);

  // Locale helper
  const isBg = locale === "bg";

  // ============================================================================
  // DRAFT MANAGEMENT
  // ============================================================================

  const saveDraft = useCallback(async () => {
    if (typeof window === "undefined") return;
    
    const currentValues = methods.getValues();
    const serialized = JSON.stringify(currentValues);
    
    // Skip if no changes
    if (serialized === lastSavedRef.current) return;
    
    setIsSaving(true);
    
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, serialized);
      lastSavedRef.current = serialized;
      setAutoSaved(true);
      setHasUnsavedChanges(false);
      
      // Reset autoSaved indicator after 3 seconds
      setTimeout(() => setAutoSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setIsSaving(false);
    }
  }, [methods]);

  const loadDraft = useCallback(async () => {
    if (typeof window === "undefined" || existingProduct || draftRestoredRef.current) return;
    
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as Partial<SellFormDataV4>;
        // Only restore if there's actual content
        if (parsed.images?.length || parsed.title || parsed.categoryId) {
          methods.reset({ ...defaultSellFormValuesV4, ...parsed });
          lastSavedRef.current = savedDraft;
        }
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    } finally {
      draftRestoredRef.current = true;
    }
  }, [methods, existingProduct]);

  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      lastSavedRef.current = "";
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, []);

  // Auto-save on form changes (debounced)
  useEffect(() => {
    const subscription = methods.watch(() => {
      setHasUnsavedChanges(true);
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save (2 seconds after last change)
      saveTimeoutRef.current = setTimeout(() => {
        saveDraft();
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [methods, saveDraft]);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: SellFormContextValue = {
    // Core data
    locale,
    categories,
    brands,
    sellerId,
    
    // Form state
    isSubmitting,
    setIsSubmitting,
    isSaving,
    setIsSaving,
    autoSaved,
    setAutoSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    
    // Progress tracking
    progress,
    progressItems,
    nextStep,
    
    // Navigation
    currentStep,
    setCurrentStep,
    totalSteps,
    
    // Draft management
    saveDraft,
    loadDraft,
    clearDraft,
    
    // Helpers
    isBg,
  };

  return (
    <FormProvider {...methods}>
      <SellFormContext.Provider value={contextValue}>
        {children}
      </SellFormContext.Provider>
    </FormProvider>
  );
}

// ============================================================================
// RE-EXPORTS for convenience
// ============================================================================

export { sellFormSchemaV4, defaultSellFormValuesV4, calculateFormProgress };
export type { SellFormDataV4, ProgressItem };
