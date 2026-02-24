import { z } from "zod";

// ============================================================================
// SELL FORM V4 - Complete rewrite with proper validation & UX
// Canonical location: lib/sell/schema.ts
// ============================================================================

// Condition options - clear labels
export const conditionOptions = [
	{ value: "new-with-tags", labelKey: "conditions.newWithTags.label", descriptionKey: "conditions.newWithTags.description" },
	{ value: "new-without-tags", labelKey: "conditions.newWithoutTags.label", descriptionKey: "conditions.newWithoutTags.description" },
	{ value: "used-like-new", labelKey: "conditions.usedLikeNew.label", descriptionKey: "conditions.usedLikeNew.description" },
	{ value: "used-excellent", labelKey: "conditions.usedExcellent.label", descriptionKey: "conditions.usedExcellent.description" },
	{ value: "used-good", labelKey: "conditions.usedGood.label", descriptionKey: "conditions.usedGood.description" },
	{ value: "used-fair", labelKey: "conditions.usedFair.label", descriptionKey: "conditions.usedFair.description" },
] as const;

export const formatOptions = [
	{ value: "fixed", labelKey: "formats.fixed.label", descriptionKey: "formats.fixed.description", icon: "Tag" },
	{ value: "auction", labelKey: "formats.auction.label", descriptionKey: "formats.auction.description", icon: "Gavel" },
] as const;

// Image with metadata
export const imageSchema = z.object({
	url: z.string().url("validation.invalidImageUrl"),
	thumbnailUrl: z.string().url("validation.invalidThumbnailUrl").optional(),
	isPrimary: z.boolean().optional().default(false),
});

export type ProductImage = z.infer<typeof imageSchema>;

// Attribute for Item Specifics
export const attributeSchema = z.object({
	attributeId: z.string().uuid().nullable().optional(),
	name: z.string().min(1, "validation.attributeNameRequired"),
	value: z.string().min(1, "validation.attributeValueRequired"),
	isCustom: z.boolean().default(false),
});

export type ProductAttribute = z.infer<typeof attributeSchema>;

// Dimensions in metric
export const dimensionsSchema = z.object({
	lengthCm: z.coerce.number().min(0).optional(),
	widthCm: z.coerce.number().min(0).optional(),
	heightCm: z.coerce.number().min(0).optional(),
	weightKg: z.coerce.number().min(0).optional(),
});

// Main form schema
export const sellFormSchemaV4 = z.object({
	// ========== PHOTOS (Required) ==========
	images: z
		.array(imageSchema)
		.min(1, "validation.photosRequired")
		.max(12, "validation.photosMax"),

	// ========== BASIC INFO ==========
	title: z
		.string()
		.trim()
		.min(5, "validation.titleMin")
		.max(80, "validation.titleMax")
		.refine((val) => !/[<>{}[\]\\]/.test(val), "validation.titleInvalidCharacters"),

	categoryId: z.string().min(1, "validation.categoryRequired"),

	listingKind: z.enum(["item", "service", "classified"]).default("item"),
	transactionMode: z.enum(["checkout", "contact"]).default("checkout"),
	fulfillmentMode: z.enum(["shipping", "pickup", "digital", "onsite"]).default("shipping"),
	pricingMode: z.enum(["fixed", "auction", "tiered"]).default("fixed"),

	categoryPath: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				name_bg: z.string().nullable().optional(),
				slug: z.string(),
			})
		)
		.optional(),

	brandId: z.string().uuid().nullable().optional(),
	brandName: z.string().optional(), // For display

	condition: z.enum([
		"new-with-tags",
		"new-without-tags",
		"used-like-new",
		"used-excellent",
		"used-good",
		"used-fair",
	], {
		error: "validation.conditionRequired",
	}),

	// ========== DESCRIPTION ==========
	description: z.string()
		.trim()
		.min(1, "validation.descriptionRequired")
		.max(4000, "validation.descriptionMax")
		.refine((val) => val.trim().length >= 50, {
			message: "validation.descriptionMin",
		})
		.default(""),

	// ========== ITEM SPECIFICS ==========
	attributes: z.array(attributeSchema).optional().default([]),

	// ========== PRICING ==========
	format: z.enum(["fixed", "auction"]).default("fixed"),

	price: z
		.string()
		.min(1, "validation.priceRequired")
		.refine((val) => !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, "validation.priceInvalid")
		.refine((val) => Number.parseFloat(val) <= 999999.99, "validation.priceMax"),

	currency: z.enum(["EUR"]).default("EUR"), // Bulgaria joined Eurozone Jan 1, 2025

	compareAtPrice: z
		.string()
		.optional()
		.refine((val) => !val || (!Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0), "validation.compareAtInvalid"),

	quantity: z.coerce
		.number()
		.int("validation.quantityInteger")
		.min(1, "validation.quantityMin")
		.max(9999, "validation.quantityMax")
		.default(1),

	acceptOffers: z.boolean().default(false),
	minOfferPercent: z.coerce.number().min(1).max(99).optional(), // Auto-decline offers below X%

	// ========== SHIPPING ==========
	// Seller city - where the item ships from (required for Bulgaria shipping or local pickup)
	sellerCity: z.string().trim().optional(),

	shipsToBulgaria: z.boolean().default(true),
	shipsToUK: z.boolean().default(false),
	shipsToEurope: z.boolean().default(false),
	shipsToUSA: z.boolean().default(false),
	shipsToWorldwide: z.boolean().default(false),
	pickupOnly: z.boolean().default(false),

	shippingPrice: z
		.string()
		.optional()
		.refine((val) => !val || (!Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0), "validation.shippingPriceInvalid"),

	freeShipping: z.boolean().default(false),

	dimensions: dimensionsSchema.optional(),

	processingDays: z.coerce.number().min(1).max(30).default(3),

	// ========== TAGS ==========
	tags: z.array(z.string()).max(10, "validation.tagsMax").default([]),
}).superRefine((data, ctx) => {
	// Discount sanity: compare-at price must be higher than the active price.
	if (data.compareAtPrice) {
		const price = Number.parseFloat(data.price);
		const compareAt = Number.parseFloat(data.compareAtPrice);

		if (Number.isFinite(price) && Number.isFinite(compareAt) && compareAt <= price) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["compareAtPrice"],
				message: "validation.compareAtMustBeHigher",
			});
		}
	}

	const hasShippingRegion = Boolean(
		data.shipsToBulgaria ||
		data.shipsToUK ||
		data.shipsToEurope ||
		data.shipsToUSA ||
		data.shipsToWorldwide ||
		data.pickupOnly
	);

	if (!hasShippingRegion) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["shipsToBulgaria"],
			message: "validation.shippingRegionRequired",
		});
	}

	const requiresSellerCity = data.shipsToBulgaria || data.pickupOnly;
	if (requiresSellerCity && !data.sellerCity?.trim()) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["sellerCity"],
			message: "shipping.selectCityPlaceholder",
		});
	}

});

export type SellFormDataV4 = z.infer<typeof sellFormSchemaV4>;

// Default form values
export const defaultSellFormValuesV4: SellFormDataV4 = {
	images: [],
	title: "",
	categoryId: "",
	listingKind: "item",
	transactionMode: "checkout",
	fulfillmentMode: "shipping",
	pricingMode: "fixed",
	categoryPath: [],
	brandId: null,
	brandName: "",
	condition: "used-excellent",
	description: "",
	attributes: [],
	format: "fixed",
	price: "",
	currency: "EUR", // Bulgaria joined Eurozone Jan 1, 2025
	compareAtPrice: "",
	quantity: 1,
	acceptOffers: false,
	minOfferPercent: undefined,
	sellerCity: "",
	shipsToBulgaria: true,
	shipsToUK: false,
	shipsToEurope: false,
	shipsToUSA: false,
	shipsToWorldwide: false,
	pickupOnly: false,
	shippingPrice: "",
	freeShipping: false,
	dimensions: {
		lengthCm: undefined,
		widthCm: undefined,
		heightCm: undefined,
		weightKg: undefined,
	},
	processingDays: 3,
	tags: [],
};

// ============================================================================
// FORM PROGRESS CALCULATION
// ============================================================================
export interface ProgressItem {
	key: string;
	labelKey: string;
	completed: boolean;
	required: boolean;
}

export function calculateFormProgress(data: Partial<SellFormDataV4>): {
	percentage: number;
	items: ProgressItem[];
	nextStep: ProgressItem | null;
} {
	const items: ProgressItem[] = [
		{
			key: "photos",
			labelKey: "checklistSidebar.items.photos",
			completed: (data.images?.length ?? 0) > 0,
			required: true,
		},
		{
			key: "title",
			labelKey: "checklistSidebar.items.title",
			completed: (data.title?.length ?? 0) >= 5,
			required: true,
		},
		{
			key: "category",
			labelKey: "checklistSidebar.items.category",
			completed: !!data.categoryId && data.categoryId.length > 0,
			required: true,
		},
		{
			key: "condition",
			labelKey: "checklistSidebar.items.condition",
			completed: !!data.condition,
			required: true,
		},
		{
			key: "price",
			labelKey: "checklistSidebar.items.price",
			completed: !!data.price && Number.parseFloat(data.price) > 0,
			required: true,
		},
		{
			key: "description",
			labelKey: "checklistSidebar.items.description",
			completed: (data.description?.trim().length ?? 0) >= 50,
			required: true,
		},
		{
			key: "shipping",
			labelKey: "checklistSidebar.items.shipping",
			completed: !!(
				data.shipsToBulgaria ||
				data.shipsToUK ||
				data.shipsToEurope ||
				data.shipsToUSA ||
				data.shipsToWorldwide ||
				data.pickupOnly
			),
			required: true,
		},
	];

	const requiredItems = items.filter((i) => i.required);
	const completedRequired = requiredItems.filter((i) => i.completed).length;
	const percentage = Math.round((completedRequired / requiredItems.length) * 100);

	const nextStep = items.find((i) => i.required && !i.completed) || null;

	return { percentage, items, nextStep };
}
