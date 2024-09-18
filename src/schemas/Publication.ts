import { z } from "zod";

import { IdSchema } from "./Primitives";
import { CatalogItemAdminSchema, CatalogItemPublishSchema, CatalogItemShopSchema } from "./CatalogItem";
import { PreorderShopSchema, PreorderAdminSchema, ShippingCostIncludedSchema } from "./Preorder";
import { AdminGetBaseSchema } from "./Admin";

export const PublicationCreateSchema = z.object({
	link: z.string(),
	categoryId: IdSchema,
	preorderId: IdSchema.nullable(),
	shippingCostIncluded: ShippingCostIncludedSchema.nullable(),
	items: CatalogItemPublishSchema.array(),
});

export const PublicationShopSchema = z.object({
	link: z.string(),
	preorder: PreorderShopSchema.nullable(),
	items: CatalogItemShopSchema.array().nonempty(),
	shippingCostIncluded: ShippingCostIncludedSchema.nullable(),
});

export const PublicationAdminSchema = AdminGetBaseSchema.extend({
	link: z.string(),
	preorder: PreorderAdminSchema.nullable(),
	items: CatalogItemAdminSchema.array().nonempty(),
});
