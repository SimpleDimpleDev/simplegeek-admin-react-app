import { CategoryCreateSchema, CategoryGetSchema } from "@schemas/Category";

import { z } from "zod";

export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;
export type CategoryGet = z.infer<typeof CategoryGetSchema>;
