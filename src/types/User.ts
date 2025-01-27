import { UserGetSchema, UserIdentitySchema, UserRoleSchema, UserStateSchema } from "../schemas/User";

import { z } from "zod";

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserState = z.infer<typeof UserStateSchema>;
export type UserIdentity = z.infer<typeof UserIdentitySchema>;
export type UserGet = z.infer<typeof UserGetSchema>;
