import { CatalogItemGetSchema, CatalogItemPublishSchema } from "./CatalogItem";
import { IdSchema, SlugScheme } from "./Primitives";
import { PreorderGetSchema, ShippingCostIncludedSchema } from "./Preorder";

import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

export const PublicationCreateSchema = z.object({
	link: SlugScheme,
	categoryId: IdSchema,
	preorderId: IdSchema.nullable(),
	shippingCostIncluded: ShippingCostIncludedSchema.nullable(),
	items: CatalogItemPublishSchema.array(),
	isActive: z.boolean(),
});

export const PublicationGetSchema = AdminGetBaseSchema.extend({
	link: z.string(),
	preorder: PreorderGetSchema.nullable(),
	shippingCostIncluded: ShippingCostIncludedSchema.nullable(),
	items: CatalogItemGetSchema.array().nonempty(),
});

export const PublicationListGetSchema = z.object({
	items: PublicationGetSchema.array(),
});

export const PublicationUpdateSchema = z.object({
	id: IdSchema,
	link: SlugScheme,
});
