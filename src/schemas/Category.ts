import { z } from "zod";
import { IdSchema } from "./Primitives";
import { AdminGetBaseSchema, ImageEditPropsSchema } from "./Admin";

const CategoryBaseSchema = z.object({
	title: z.string(),
	link: z.string(),
});

export const CategoryCreateSchema = CategoryBaseSchema.extend({
	smallImage: z.object({
		file: z.instanceof(File),
		properties: ImageEditPropsSchema,
	}),
	bigImage: z.object({
		file: z.instanceof(File),
		properties: ImageEditPropsSchema,
	}),
});

export const CategoryShopSchema = CategoryBaseSchema.extend({
	id: IdSchema,
	image: z.string(),
});

export const CategoryAdminSchema = AdminGetBaseSchema.merge(CategoryShopSchema).extend({
	isActive: z.boolean(),
});
