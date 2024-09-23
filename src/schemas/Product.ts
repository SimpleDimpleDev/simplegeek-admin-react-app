import { AdminGetBaseSchema, ImageEditPropsSchema } from "./Admin";
import { FilterGroupGetSchema, FilterGroupNewSchema } from "./FilterGroup";

import { AttachmentGetSchema } from "./Attachment";
import { CategoryGetSchema } from "./Category";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";
import { z } from "zod";

export const ProductCreateSchema = z.object({
	categoryId: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	physicalProperties: PhysicalPropertiesSchema.nullable(),
	filterGroups: FilterGroupNewSchema.array(),
	images: z.object({ file: z.instanceof(File), properties: ImageEditPropsSchema }).array(),
});

export const ProductGetSchema = AdminGetBaseSchema.extend({
	isPublished: z.boolean().default(true),
	category: CategoryGetSchema,
	title: z.string(),
	description: z.string().nullable(),
	physicalProperties: PhysicalPropertiesSchema.nullable(),
	filterGroups: FilterGroupGetSchema.array(),
	images: AttachmentGetSchema.array(),
});

export const ProductAddImageSchema = z.object({
	id: z.string(),
	image: z.object({ file: z.instanceof(File), properties: ImageEditPropsSchema }),
});

export const ProductUpdateSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	physicalProperties: PhysicalPropertiesSchema.nullable(),
	filterGroups: FilterGroupNewSchema.array(),
	images: z.object({
		id: z.string(),
		index: z.number(),
		url: z.string(),
	}).array().nullable(),
});
