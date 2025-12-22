"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  IconBuildingStore, 
  IconCheck, 
  IconLoader2,
  IconBriefcase,
  IconWorld,
  IconReceipt,
} from "@tabler/icons-react"
import { upgradeToBusinessAccount } from "@/app/actions/account-upgrade"
import { toast } from "sonner"

const businessUpgradeSchema = z.object({
  business_name: z.string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be less than 100 characters"),
  vat_number: z.string()
    .max(20, "VAT number must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  website_url: z.string()
    .url("Invalid website URL")
    .max(200, "Website URL must be less than 200 characters")
    .optional()
    .or(z.literal("")),
})

type FormData = z.infer<typeof businessUpgradeSchema>

interface UpgradeToBusinessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale?: string
}

const translations = {
  en: {
    title: "Upgrade to Business Account",
    description: "Unlock powerful business tools and lower fees",
    businessName: "Business Name",
    businessNamePlaceholder: "Your company or store name",
    vatNumber: "VAT Number (Optional)",
    vatNumberPlaceholder: "BG123456789",
    website: "Website (Optional)",
    websitePlaceholder: "https://yourstore.com",
    benefits: [
      "Access to Business Dashboard",
      "Lower commission rates",
      "Verified Business badge",
      "Priority support",
      "Advanced analytics",
    ],
    cancel: "Cancel",
    upgrade: "Upgrade to Business",
    upgrading: "Upgrading...",
    success: "Account upgraded to business!",
    successDesc: "You now have access to business features",
    error: "Failed to upgrade account",
  },
  bg: {
    title: "Надградете до бизнес акаунт",
    description: "Отключете мощни бизнес инструменти и по-ниски такси",
    businessName: "Име на бизнеса",
    businessNamePlaceholder: "Вашата фирма или магазин",
    vatNumber: "ДДС номер (по избор)",
    vatNumberPlaceholder: "BG123456789",
    website: "Уебсайт (по избор)",
    websitePlaceholder: "https://yourstore.bg",
    benefits: [
      "Достъп до бизнес табло",
      "По-ниски комисиони",
      "Значка Проверен Бизнес",
      "Приоритетна поддръжка",
      "Разширена аналитика",
    ],
    cancel: "Отказ",
    upgrade: "Надградете до бизнес",
    upgrading: "Надграждане...",
    success: "Акаунтът е надграден до бизнес!",
    successDesc: "Вече имате достъп до бизнес функции",
    error: "Неуспешно надграждане на акаунта",
  },
}

export function UpgradeToBusinessModal({ 
  open, 
  onOpenChange, 
  locale = "en" 
}: UpgradeToBusinessModalProps) {
  const t = translations[locale as keyof typeof translations] || translations.en
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(businessUpgradeSchema),
    defaultValues: {
      business_name: "",
      vat_number: "",
      website_url: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await upgradeToBusinessAccount({
        business_name: data.business_name,
        vat_number: data.vat_number || null,
        website_url: data.website_url || null,
      })

      if (result.success) {
        toast.success(t.success, { description: t.successDesc })
        reset()
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(t.error, { description: result.error })
      }
    } catch {
      toast.error(t.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <IconBuildingStore className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{t.title}</DialogTitle>
          <DialogDescription className="text-center">
            {t.description}
          </DialogDescription>
        </DialogHeader>

        {/* Benefits list */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-4">
          <ul className="space-y-2">
            {t.benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <IconCheck className="h-4 w-4 text-green-500 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="business_name" className="flex items-center gap-2">
              <IconBriefcase className="h-4 w-4" />
              {t.businessName}
            </Label>
            <Input
              id="business_name"
              placeholder={t.businessNamePlaceholder}
              {...register("business_name")}
              aria-invalid={!!errors.business_name}
            />
            {errors.business_name && (
              <p className="text-sm text-destructive">{errors.business_name.message}</p>
            )}
          </div>

          {/* VAT Number */}
          <div className="space-y-2">
            <Label htmlFor="vat_number" className="flex items-center gap-2">
              <IconReceipt className="h-4 w-4" />
              {t.vatNumber}
            </Label>
            <Input
              id="vat_number"
              placeholder={t.vatNumberPlaceholder}
              {...register("vat_number")}
              aria-invalid={!!errors.vat_number}
            />
            {errors.vat_number && (
              <p className="text-sm text-destructive">{errors.vat_number.message}</p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website_url" className="flex items-center gap-2">
              <IconWorld className="h-4 w-4" />
              {t.website}
            </Label>
            <Input
              id="website_url"
              type="url"
              placeholder={t.websitePlaceholder}
              {...register("website_url")}
              aria-invalid={!!errors.website_url}
            />
            {errors.website_url && (
              <p className="text-sm text-destructive">{errors.website_url.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.upgrading}
                </>
              ) : (
                t.upgrade
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
