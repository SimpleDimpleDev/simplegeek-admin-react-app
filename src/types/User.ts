import { UserAuthoritySchema, UserTableGetSchema } from "../schemas/User";

import { z } from "zod";

export type UserAuthority = z.infer<typeof UserAuthoritySchema>;
export type UserTableGet = z.infer<typeof UserTableGetSchema>;