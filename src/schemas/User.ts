import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

export const UserAuthoritySchema = z.object({
	email: z.string(),
	isAdmin: z.boolean(),
});

export const UserTableGetSchema = AdminGetBaseSchema.extend({
	email: z.string(),
	verified: z.boolean(),
	vkId: z.string().nullable(),
});
