import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

export const AttachmentGetSchema = AdminGetBaseSchema.extend({
	index: z.number(),
	url: z.string(),
}).describe("AttachmentGet");
