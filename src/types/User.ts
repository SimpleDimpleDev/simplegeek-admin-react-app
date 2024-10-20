import { UserGetSchema, UserIdentitySchema } from "../schemas/User";

import { z } from "zod";

export type UserIdentity = z.infer<typeof UserIdentitySchema>;
export type UserGet = z.infer<typeof UserGetSchema>;