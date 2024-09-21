import { AdminGetBaseSchema } from "./Admin";
import { CreditInfoSchema } from "./Payment";
import { IdSchema } from "./Primitives";
import { ProductGetSchema } from "./Product";
import { z } from "zod";

export const CatalogItemPublishSchema = z.object({
	productId: IdSchema,
	price: z.number(),
	discount: z.number().nullable(),
	quantity: z.number().nullable(),
	creditInfo: CreditInfoSchema.nullable(),
});

export const CatalogItemGetSchema = AdminGetBaseSchema.extend({
	product: ProductGetSchema,
	price: z.number(),
	discount: z.number().nullable(),
	quantity: z.number().nullable(),
	creditInfo: CreditInfoSchema.nullable(),
	variationIndex: z.number().nullable(),
	isActive: z.boolean(),
});
