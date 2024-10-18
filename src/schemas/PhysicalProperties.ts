import { z } from "zod";

export const PhysicalPropertiesSchema = z.object({
	width: z.number(),
	height: z.number(),
	length: z.number(),
	weight: z.number(),
});
