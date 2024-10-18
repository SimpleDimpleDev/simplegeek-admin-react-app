import { AdminGetBaseSchema, ImageEditPropsSchema } from "./Admin";

import { AttachmentGetSchema } from "./Attachment";
import { z } from "zod";

export const CategoryCreateSchema = z
	.object({
		title: z.string(),
		link: z.string(),
		icon: z.object({
			file: z.instanceof(File),
			properties: ImageEditPropsSchema,
		}),
		banner: z.object({
			file: z.instanceof(File),
			properties: ImageEditPropsSchema,
		}),
	})
	.describe("CategoryCreate");

export const CategoryGetSchema = AdminGetBaseSchema.extend({
	title: z.string(),
	link: z.string(),
	icon: AttachmentGetSchema,
	banner: AttachmentGetSchema,
	isActive: z.boolean(),
}).describe("CategoryGet");

export const CategoryListGetSchema = z
	.object({
		items: CategoryGetSchema.array(),
	})
	.describe("CategoryListGet");

export const CategoryChangeImageSchema = z
	.object({
		categoryId: z.string(),
		imageType: z.enum(["ICON", "BANNER"]),
		image: z.object({ file: z.instanceof(File), properties: ImageEditPropsSchema }),
	})
	.describe("CategoryChangeImage");

export const CategoryUpdateSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		link: z.string(),
	})
	.describe("CategoryUpdate");
