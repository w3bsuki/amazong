import { z } from "zod";

// ============================================================================
// SELL FORM V4 - Complete rewrite with proper validation & UX
// Canonical location: lib/sell/schema-v4.ts
// ============================================================================

// Condition options - clear labels
export const conditionOptions = [
	{ value: "new-with-tags", label: "New with tags", labelBg: "Ново с етикети", description: "Brand new, never worn, original tags attached" },
	{ value: "new-without-tags", label: "New without tags", labelBg: "Ново без етикети", description: "Brand new, never worn, tags removed" },
	{ value: "used-like-new", label: "Like new", labelBg: "Като ново", description: "Worn once or twice, no visible signs of wear" },
	{ value: "used-excellent", label: "Used - Excellent", labelBg: "Използвано - Отлично", description: "Gently used, minimal signs of wear" },
	{ value: "used-good", label: "Used - Good", labelBg: "Използвано - Добро", description: "Used with some signs of wear" },
	{ value: "used-fair", label: "Used - Fair", labelBg: "Използвано - Задоволително", description: "Visible wear, may have minor flaws" },
] as const;

export const formatOptions = [
	{ value: "fixed", label: "Fixed Price", labelBg: "Фиксирана цена", icon: "Tag", description: "Buy it now" },
	{ value: "auction", label: "Auction", labelBg: "Търг", icon: "Gavel", description: "Accept bids" },
] as const;

// Image with metadata
export const imageSchema = z.object({
	url: z.string().url("Invalid image URL"),
	thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
	isPrimary: z.boolean().optional().default(false),
});

export type ProductImage = z.infer<typeof imageSchema>;

// Attribute for Item Specifics
export const attributeSchema = z.object({
	attributeId: z.string().uuid().nullable().optional(),
	name: z.string().min(1, "Attribute name is required"),
	value: z.string().min(1, "Attribute value is required"),
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
		.min(1, "Add at least 1 photo to continue")
		.max(12, "Maximum 12 photos allowed"),

	// ========== BASIC INFO ==========
	title: z
		.string()
		.min(5, "Title needs at least 5 characters")
		.max(80, "Title can't exceed 80 characters")
		.refine((val) => !/[<>{}[\]\\]/.test(val), "Title contains invalid characters"),

	categoryId: z.string().min(1, "Please select a category"),

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
		required_error: "Please select condition",
	}),

	// ========== DESCRIPTION ==========
	description: z.string()
		.min(1, "Description is required")
		.max(4000, "Description can't exceed 4,000 characters")
		.refine((val) => val.trim().length >= 50, {
			message: "Description must be at least 50 characters",
		})
		.default(""),

	// ========== ITEM SPECIFICS ==========
	attributes: z.array(attributeSchema).optional().default([]),

	// ========== PRICING ==========
	format: z.enum(["fixed", "auction"]).default("fixed"),

	price: z
		.string()
		.min(1, "Enter a price")
		.refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, "Enter a valid price greater than 0")
		.refine((val) => Number.parseFloat(val) <= 999999.99, "Price can't exceed 999,999.99"),

	currency: z.enum(["EUR", "BGN", "USD"]).default("BGN"), // V1: Default to BGN for Bulgaria

	compareAtPrice: z
		.string()
		.optional()
		.refine((val) => !val || (!isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0), "Invalid compare price"),

	quantity: z.coerce
		.number()
		.int("Quantity must be a whole number")
		.min(1, "Quantity must be at least 1")
		.max(9999, "Quantity can't exceed 9,999")
		.default(1),

	acceptOffers: z.boolean().default(false),
	minOfferPercent: z.coerce.number().min(1).max(99).optional(), // Auto-decline offers below X%

	// ========== SHIPPING ==========
	// Seller city - where the item ships from (required for Bulgaria shipping or local pickup)
	sellerCity: z.string().optional(),

	shipsToBulgaria: z.boolean().default(true),
	shipsToUK: z.boolean().default(false),
	shipsToEurope: z.boolean().default(false),
	shipsToUSA: z.boolean().default(false),
	shipsToWorldwide: z.boolean().default(false),
	pickupOnly: z.boolean().default(false),

	shippingPrice: z
		.string()
		.optional()
		.refine((val) => !val || (!isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0), "Invalid shipping price"),

	freeShipping: z.boolean().default(false),

	dimensions: dimensionsSchema.optional(),

	processingDays: z.coerce.number().min(1).max(30).default(3),

	// ========== TAGS ==========
	tags: z.array(z.string()).max(10, "Maximum 10 tags").default([]),
});

export type SellFormDataV4 = z.infer<typeof sellFormSchemaV4>;

// Default form values
export const defaultSellFormValuesV4: SellFormDataV4 = {
	images: [],
	title: "",
	categoryId: "",
	categoryPath: [],
	brandId: null,
	brandName: "",
	condition: "used-excellent",
	description: "",
	attributes: [],
	format: "fixed",
	price: "",
	currency: "BGN", // V1: Default to BGN for Bulgaria
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
	label: string;
	labelBg: string;
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
			label: "Add photos",
			labelBg: "Добави снимки",
			completed: (data.images?.length ?? 0) > 0,
			required: true,
		},
		{
			key: "title",
			label: "Write title",
			labelBg: "Напиши заглавие",
			completed: (data.title?.length ?? 0) >= 5,
			required: true,
		},
		{
			key: "category",
			label: "Select category",
			labelBg: "Избери категория",
			completed: !!data.categoryId && data.categoryId.length > 0,
			required: true,
		},
		{
			key: "condition",
			label: "Choose condition",
			labelBg: "Избери състояние",
			completed: !!data.condition,
			required: true,
		},
		{
			key: "price",
			label: "Set price",
			labelBg: "Задай цена",
			completed: !!data.price && Number.parseFloat(data.price) > 0,
			required: true,
		},
		{
			key: "description",
			label: "Add description",
			labelBg: "Добави описание",
			completed: (data.description?.length ?? 0) >= 20,
			required: false,
		},
		{
			key: "shipping",
			label: "Configure shipping",
			labelBg: "Настрой доставка",
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

// ============================================================================
// VALIDATION HELPERS
// ============================================================================
function getFieldError(errors: Record<string, string[] | undefined>, field: string): string | undefined {
	return errors[field]?.[0];
}

function isFormValid(data: Partial<SellFormDataV4>): boolean {
	const { percentage } = calculateFormProgress(data);
	return percentage === 100;
}
