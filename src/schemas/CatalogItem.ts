import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

import { CreditInfoSchema } from "./Payment";
import { IdSchema } from "./Primitives";
import { ProductAdminSchema, ProductShopSchema } from "./Product";

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

export const CatalogItemShopSchema = CatalogItemGetBaseSchema.extend({
	id: IdSchema,
	product: ProductShopSchema,
});

export const CatalogItemAdminSchema = CatalogItemGetBaseSchema.extend({
	isActive: z.boolean(),
	product: ProductAdminSchema,
	quantity: z.number().nullable(),
}).merge(AdminGetBaseSchema);

export const CatalogItemsAvailabilitySchema = IdSchema.array();
