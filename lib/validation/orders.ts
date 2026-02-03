import { z } from "zod"
import { SHIPPING_CARRIER_VALUES, type ShippingCarrier } from "@/lib/order-status"

const shippingCarrierValues = SHIPPING_CARRIER_VALUES as unknown as [ShippingCarrier, ...ShippingCarrier[]]

export const orderItemIdParamSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict()

const trackingNumberSchema = z
  .string()
  .trim()
  .min(4)
  .max(64)
  .regex(/^[A-Za-z0-9-]+$/)

const shippingCarrierSchema = z.enum(shippingCarrierValues)

export const shipOrderPayloadSchema = z
  .object({
    trackingNumber: trackingNumberSchema.optional(),
    shippingCarrier: shippingCarrierSchema.optional(),
  })
  .strict()

export const trackOrderPayloadSchema = z
  .object({
    trackingNumber: trackingNumberSchema,
    shippingCarrier: shippingCarrierSchema.optional(),
  })
  .strict()
