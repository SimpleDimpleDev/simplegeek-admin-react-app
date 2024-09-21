import { ISOToDateSchema, IdSchema } from "./Primitives";

import { CategoryGetSchema } from "./Category";
import { z } from "zod";

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
		.array(),
});

export const FilterGroupGetSchema = z.object({
	id: IdSchema,
	createdAt: ISOToDateSchema,
	updatedAt: ISOToDateSchema,
	title: z.string(),
	category: CategoryGetSchema.nullable(),
	filters: z
		.object({
			id: IdSchema,
			value: z.string(),
		})
		.array()
		.nonempty(),
});
