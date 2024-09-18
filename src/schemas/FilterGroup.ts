import { z } from "zod";
import { IdSchema, ISOToDateSchema } from "./Primitives";
import { CategoryAdminSchema } from "./Category";

export const FilterGroupNewSchema = z.object({
	id: IdSchema.nullable(),
	title: z.string(),
	filters: z
		.object({
			id: IdSchema.nullable(),
			value: z.string(),
		})
		.array()
		.nonempty(),
});

export const FilterGroupCreateSchema = z.object({
	categoryId: IdSchema.nullable(),
	title: z.string(),
	filters: z
		.object({
			value: z.string(),
		})
		.array()
});

export const FilterGroupGetSchema = z.object({
	id: IdSchema,
	title: z.string(),
	filters: z
		.object({
			id: IdSchema,
			value: z.string(),
		})
		.array()
		.nonempty(),
});

export const FilterGroupAdminSchema = z.object({
	id: IdSchema,
	createdAt: ISOToDateSchema,
	updatedAt: ISOToDateSchema,
	title: z.string(),
	category: CategoryAdminSchema.nullable(),
	filters: z
		.object({
			id: IdSchema,
			value: z.string(),
		})
		.array()
		.nonempty(),
});
