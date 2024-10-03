import { IdSchema } from "./Primitives";
import { z } from "zod";

export const CreateResponseSchema = z.object({
	id: IdSchema,
});

export const ApiErrorSchema = z.object({
	title: z.string(),
	message: z.string(),
});
