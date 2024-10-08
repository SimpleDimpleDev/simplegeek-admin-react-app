import { AdminGetBaseSchema } from "./Admin";
import { CreditInfoSchema } from "./Payment";
import { IdSchema } from "./Primitives";
import { ProductGetSchema } from "./Product";
import { z } from "zod";

export const DiscountSchema = z.object({
	type: z.enum(["FIXED", "PERCENT"]),
	value: z.number(),
});

export const CatalogItemPublishSchema = z.object({
	productId: IdSchema,
	rating: z.number(),
	quantity: z.number().nullable(),
	price: z.number(),
	discount: DiscountSchema.nullable(),
	creditInfo: CreditInfoSchema.nullable(),
});

export const CatalogItemGetSchema = AdminGetBaseSchema.extend({
	product: ProductGetSchema,
	rating: z.number(),
	orderedQuantity: z.number(),
	quantity: z.number().nullable(),
	price: z.number(),
	discount: DiscountSchema.nullable(),
	creditInfo: CreditInfoSchema.nullable(),
	variationIndex: z.number().nullable(),
	isActive: z.boolean(),
});

export const CatalogItemUpdateSchema = z.object({
	id: z.string(),
	rating: z.number(),
	quantity: z.number().nullable(),
	price: z.number(),
	discount: DiscountSchema.nullable(),

	// TODO: Add credit info
	// creditInfo: CreditInfoSchema.nullable(),
});
