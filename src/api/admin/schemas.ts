import { CategoryChangeImageSchema, CategoryCreateSchema, CategoryGetSchema, CategoryUpdateSchema } from "@schemas/Category";
import { FilterGroupCreateSchema, FilterGroupGetSchema } from "@schemas/FilterGroup";
import { ProductAddImageSchema, ProductCreateSchema, ProductGetSchema, ProductUpdateSchema } from "@schemas/Product";
import { PublicationCreateSchema, PublicationGetSchema } from "@schemas/Publication";

import { FAQItemGetSchema } from "@schemas/FAQ";
import { IdSchema } from "@schemas/Primitives";
import { OrderGetSchema } from "@schemas/Order";
import { UserGetSchema } from "@schemas/User";
import { z } from "zod";

export const CreateResponseSchema = z.object({
	id: IdSchema,
});

export const FAQItemListResponseSchema = z.object({
	items: FAQItemGetSchema.array(),
});

// Category
export const CategoryCreateRequestSchema = CategoryCreateSchema;
export const CategoryListResponseSchema = z.object({
	items: CategoryGetSchema.array(),
});
export const CategoryUpdateRequestSchema = CategoryUpdateSchema;
export const CategoryChangeImageRequestSchema = CategoryChangeImageSchema;

export const FilterGroupCreateRequestSchema = FilterGroupCreateSchema;
export const FilterGroupListResponseSchema = z.object({
	items: FilterGroupGetSchema.array(),
});

// Product
export const ProductCreateRequestSchema = ProductCreateSchema;
export const ProductGetResponseSchema = ProductGetSchema;
export const ProductListGetResponseSchema = z.object({
	items: ProductGetSchema.array(),
});
export const ProductUpdateRequestSchema = ProductUpdateSchema;
export const ProductAddImageRequestSchema = ProductAddImageSchema;

export const PublicationCreateRequestSchema = PublicationCreateSchema;
export const PublicationGetResponseSchema = PublicationGetSchema;
export const PublicationListGetResponseSchema = z.object({
	items: PublicationGetSchema.array(),
});
export const OrderGetResponseSchema = OrderGetSchema;
export const OrderListGetResponseSchema = z.object({
	items: OrderGetSchema.array(),
});
export const UserGetResponseSchema = UserGetSchema;
export const UserListGetResponseSchema = z.object({
	items: UserGetSchema.array(),
});
