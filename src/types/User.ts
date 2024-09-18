import { UserAdminSchema, UserAuthoritySchema } from "../schemas/User";

import { z } from "zod";

export type UserAuthority = z.infer<typeof UserAuthoritySchema>;
export type UserAdmin = z.infer<typeof UserAdminSchema>;