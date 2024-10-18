import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

export const UserAuthoritySchema = z
	.object({
		email: z.string(),
		isAdmin: z.boolean(),
	})
	.describe("UserAuthority");

export const UserGetSchema = AdminGetBaseSchema.extend({
	email: z.string(),
	verified: z.boolean(),
	vkId: z.string().nullable(),
}).describe("UserGet");

export const UserListGetSchema = z
	.object({
		items: UserGetSchema.array(),
	})
	.describe("UserListGet");
