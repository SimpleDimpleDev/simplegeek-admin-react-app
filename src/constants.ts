import { UserRoleSchema } from "@schemas/User";
import { z } from "zod";

export const userRoleTitles: Map<z.infer<typeof UserRoleSchema>, string> = new Map([
	["Admin", "Администратор"],
	["Customer", "Покупатель"],
]);
