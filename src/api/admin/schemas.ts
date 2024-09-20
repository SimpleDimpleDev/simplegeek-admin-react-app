import { CategoryAdminSchema, CategoryCreateSchema } from "@schemas/Category";
import { FilterGroupAdminSchema, FilterGroupCreateSchema } from "@schemas/FilterGroup";
import { ProductAdminSchema, ProductCreateSchema } from "@schemas/Product";
import { PublicationAdminSchema, PublicationCreateSchema } from "@schemas/Publication";

import { FAQItemSchema } from "@schemas/FAQ";
import { IdSchema } from "@schemas/Primitives";
import { OrderAdminSchema } from "@schemas/Order";
import { UserAdminTableSchema } from "@schemas/User";
import { z } from "zod";

export const CreateResponseSchema = z.object({
	id: IdSchema,
});

export const FAQItemTableAdminResponseSchema = z.object({
	items: FAQItemSchema.array(),
});

export const CategoryCreateAdminRequestSchema = CategoryCreateSchema;
export const CategoryListAdminResponseSchema = z.object({
	items: CategoryAdminSchema.array(),
});

export const FilterGroupCreateAdminRequestSchema = FilterGroupCreateSchema;
export const FilterGroupListAdminResponseSchema = z.object({
	items: FilterGroupAdminSchema.array(),
});

export const ProductCreateAdminRequestSchema = ProductCreateSchema;
export const ProductGetAdminResponseSchema = ProductAdminSchema;
export const ProductListGetAdminResponseSchema = z.object({
	items: ProductAdminSchema.array(),
});

export const PublicationCreateAdminRequestSchema = PublicationCreateSchema;
export const PublicationGetAdminResponseSchema = PublicationAdminSchema;
export const PublicationListGetAdminResponseSchema = z.object({
	items: PublicationAdminSchema.array(),
});
export const OrderGetAdminResponseSchema = OrderAdminSchema;
export const OrderListGetAdminResponseSchema = z.object({
	items: OrderAdminSchema.array(),
});
export const UserGetAdminResponseSchema = UserAdminTableSchema;
export const UserListGetAdminResponseSchema = z.object({
	items: UserAdminTableSchema.array(),
});
