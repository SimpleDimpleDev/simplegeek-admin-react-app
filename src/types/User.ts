import { UserAdminTableSchema, UserAuthoritySchema } from "../schemas/User";

import { z } from "zod";

export type UserAuthority = z.infer<typeof UserAuthoritySchema>;
export type UserAdminTable = z.infer<typeof UserAdminTableSchema>;