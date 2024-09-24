import { AdminGetBaseSchema, ImageEditPropsSchema } from "./Admin";

import { AttachmentGetSchema } from "./Attachment";
import { z } from "zod";

export const CategoryCreateSchema = z.object({
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
});

export const CategoryGetSchema = AdminGetBaseSchema.extend({
	title: z.string(),
	link: z.string(),
	icon: AttachmentGetSchema,
	banner: AttachmentGetSchema,
	isActive: z.boolean(),
});

export const CategoryChangeImageSchema = z.object({
	categoryId: z.string(),
	imageType: z.enum(["ICON", "BANNER"]),
	image: z.object({ file: z.instanceof(File), properties: ImageEditPropsSchema }),
});

export const CategoryUpdateSchema = z.object({
	id: z.string(),
	title: z.string(),
	link: z.string(),
});
