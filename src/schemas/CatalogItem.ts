import { AdminGetBaseSchema } from "./Admin";
import { CreditInfoSchema } from "./Payment";
import { IdSchema } from "./Primitives";
import { ProductAdminSchema } from "./Product";
import { z } from "zod";

export const CatalogItemPublishSchema = z.object({
	productId: IdSchema,
	price: z.number(),
	discount: z.number().nullable(),
	quantity: z.number().nullable(),
	creditInfo: CreditInfoSchema.nullable(),
});

export const CatalogItemGetBaseSchema = z.object({
	price: z.number(),
	discount: z.number().nullable(),
	variationIndex: z.number().nullable(),
	creditInfo: CreditInfoSchema.nullable(),
});

export const CatalogItemAdminSchema = CatalogItemGetBaseSchema.extend({
	id: IdSchema,
	isActive: z.boolean(),
	product: ProductAdminSchema,
	quantity: z.number().nullable(),
}).merge(AdminGetBaseSchema);

export const CatalogItemsAvailabilitySchema = IdSchema.array();
