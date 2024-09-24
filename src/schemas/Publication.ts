import { CatalogItemGetSchema, CatalogItemPublishSchema } from "./CatalogItem";
import { PreorderGetSchema, ShippingCostIncludedSchema } from "./Preorder";

import { AdminGetBaseSchema } from "./Admin";
import { IdSchema } from "./Primitives";
import { z } from "zod";

export const PublicationCreateSchema = z.object({
	link: z.string(),
	categoryId: IdSchema,
	preorderId: IdSchema.nullable(),
	shippingCostIncluded: ShippingCostIncludedSchema.nullable(),
	items: CatalogItemPublishSchema.array(),
});

export const PublicationGetSchema = AdminGetBaseSchema.extend({
	link: z.string(),
	preorder: PreorderGetSchema.nullable(),
	shippingCostIncluded: ShippingCostIncludedSchema.nullable(),
	items: CatalogItemGetSchema.array().nonempty(),
});

export const PublicationUpdateSchema = z.object({
	id: IdSchema,
	link: z.string(),
});
