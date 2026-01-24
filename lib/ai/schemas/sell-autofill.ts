import { z } from "zod"

const ConditionSchema = z.enum([
  "new-with-tags",
  "new-without-tags",
  "used-like-new",
  "used-excellent",
  "used-good",
  "used-fair",
])

const CurrencySchema = z.enum(["EUR", "BGN", "USD"])

export const SellAutofillRequestSchema = z.object({
  imageUrl: z.string().url().max(2048),
  locale: z.enum(["en", "bg"]).optional(),
})

export type SellAutofillRequest = z.infer<typeof SellAutofillRequestSchema>

export const SellAutofillDraftSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  description: z.string().min(1).max(4000).optional(),
  condition: ConditionSchema.optional(),
  brandName: z.string().min(1).max(80).optional(),
  categoryHint: z.string().min(1).max(120).optional(),
  tags: z.array(z.string().min(1).max(32)).max(10).optional(),
  suggestedPrice: z.number().positive().max(999999.99).optional(),
  suggestedCurrency: CurrencySchema.optional(),
  attributes: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        value: z.string().min(1).max(80),
      }),
    )
    .max(20)
    .optional(),
})

export type SellAutofillDraft = z.infer<typeof SellAutofillDraftSchema>
