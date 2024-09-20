import { CatalogItemAdminSchema, CatalogItemPublishSchema } from "./CatalogItem";
import { PreorderAdminSchema, ShippingCostIncludedSchema } from "./Preorder";

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

export const PublicationAdminSchema = AdminGetBaseSchema.extend({
	link: z.string(),
	preorder: PreorderAdminSchema.nullable(),
	items: CatalogItemAdminSchema.array().nonempty(),
});
