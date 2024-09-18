import { ProductAdminSchema, ProductCreateSchema } from "@schemas/Product";

import { z } from "zod";

export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductAdmin = z.infer<typeof ProductAdminSchema>;
