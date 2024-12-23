import { AdminGetBaseSchema, ImageEditPropsSchema } from "./Admin";
import { FilterGroupGetSchema, FilterGroupNewSchema } from "./FilterGroup";

import { AttachmentGetSchema } from "./Attachment";
import { CategoryGetSchema } from "./Category";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";
import { z } from "zod";

export const ProductListFilterSchema = z.enum(["PUBLISHED", "UNPUBLISHED"]).optional();


export const ProductCreateSchema = z
	.object({
		categoryId: z.string(),
		title: z.string(),
		description: z.string().nullable(),
		physicalProperties: PhysicalPropertiesSchema.nullable(),
		filterGroups: FilterGroupNewSchema.array(),
		images: z.object({ file: z.instanceof(File), properties: ImageEditPropsSchema }).array(),
	})
	.describe("ProductCreate");

export const ProductGetSchema = AdminGetBaseSchema.extend({
	isPublished: z.boolean().default(true),
	category: CategoryGetSchema,
	title: z.string(),
	description: z.string().nullable(),
	physicalProperties: PhysicalPropertiesSchema.nullable(),
	filterGroups: FilterGroupGetSchema.array(),
	images: AttachmentGetSchema.array(),
}).describe("ProductGet");

export const ProductListGetSchema = z
	.object({
		items: ProductGetSchema.array(),
	})
	.describe("ProductListGet");

export const ProductAddImageSchema = z
	.object({
		productId: z.string(),
		image: z.object({ file: z.instanceof(File), properties: ImageEditPropsSchema }),
	})
	.describe("ProductAddImage");

export const ProductUpdateSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		description: z.string().nullable(),
		physicalProperties: PhysicalPropertiesSchema.nullable(),
		filterGroups: FilterGroupNewSchema.array(),
		images: z
			.object({
				id: z.string(),
				index: z.number(),
				url: z.string(),
			})
			.array()
			.nullable(),
	})
	.describe("ProductUpdate");
