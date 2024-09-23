import { UserAuthoritySchema, UserGetSchema } from "../schemas/User";

import { z } from "zod";

export type UserAuthority = z.infer<typeof UserAuthoritySchema>;
export type UserGet = z.infer<typeof UserGetSchema>;