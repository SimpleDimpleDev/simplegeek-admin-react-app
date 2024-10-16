import { CreditInfoCreateUpdateSchema, CreditInfoGetSchema } from "./Payment";

import { AdminGetBaseSchema } from "./Admin";
import { IdSchema } from "./Primitives";
import { ProductGetSchema } from "./Product";
import { z } from "zod";

export const DiscountSchema = z.object({
	type: z.enum(["FIXED", "PERCENTAGE"]),
	value: z.number(),
});

export const CatalogItemPublishSchema = z.object({
	productId: IdSchema,
	rating: z.number(),
	quantity: z.number().nullable(),
	quantityRestriction: z.number().nullable(),
	price: z.number(),
	discount: DiscountSchema.nullable(),
	creditInfo: CreditInfoCreateUpdateSchema.nullable(),
});

export const CatalogItemGetSchema = AdminGetBaseSchema.extend({
	product: ProductGetSchema,
	rating: z.number(),
	orderedQuantity: z.number(),
	quantity: z.number().nullable(),
	quantityRestriction: z.number().nullable(),
	price: z.number(),
	discount: DiscountSchema.nullable(),
	creditInfo: CreditInfoGetSchema.nullable(),
	variationIndex: z.number().nullable(),
	isActive: z.boolean(),
});

export const CatalogItemUpdateSchema = z.object({
	id: z.string(),
	rating: z.number(),
	quantity: z.number().nullable(),
	quantityRestriction: z.number().nullable(),
	price: z.number(),
	discount: DiscountSchema.nullable(),
	creditInfo: CreditInfoCreateUpdateSchema.nullable(),
});

export const MaxRatingGetSchema = z.object({
	rating: z.number(),
});
