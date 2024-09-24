import { IdSchema } from "./Primitives";
import { z } from "zod";

export const CreateResponseSchema = z.object({
	id: IdSchema,
});
