import { z } from "zod";
import { IdSchema, ISOToDateSchema } from "./Primitives";

export const AdminGetBaseSchema = z.object({
	id: IdSchema,
	createdAt: ISOToDateSchema,
	updatedAt: ISOToDateSchema,
});

export const ImageEditPropsSchema = z.object({
	scale: z.number(),
	crop: z.object({
		unit: z.union([ z.literal("px"), z.literal("%") ]),
		x: z.number(),
		y: z.number(),
		width: z.number(),
		height: z.number(),
	})
});
