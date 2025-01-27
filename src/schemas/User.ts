import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

export const UserIdentitySchema = z
	.object({
		id: z.string(),
		email: z.string(),
		isAdmin: z.boolean(),
	})
	.describe("UserIdentity");

export const UserRoleSchema = z.enum(["Admin", "Customer"]);
export const UserStateSchema = z.enum(["active", "inactive"]);

export const UserGetSchema = AdminGetBaseSchema.extend({
	email: z.string(),
	verified: z.boolean(),
	vkId: z.string().nullable(),
	role: UserRoleSchema,
	state: UserStateSchema,
}).describe("UserGet");

export const UserListGetSchema = z
	.object({
		items: UserGetSchema.array(),
	})
	.describe("UserListGet");
