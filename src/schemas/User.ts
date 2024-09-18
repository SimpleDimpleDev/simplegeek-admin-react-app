import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

export const UserAuthoritySchema = z.object({
	email: z.string(),
	isAdmin: z.boolean(),
});

export const UserAdminSchema = AdminGetBaseSchema.extend({
	email: z.string(),
});
