import { ProductAddImageSchema, ProductCreateSchema, ProductGetSchema, ProductUpdateSchema } from "@schemas/Product";

import { z } from "zod";

export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductGet = z.infer<typeof ProductGetSchema>;
export type ProductAddImage = z.infer<typeof ProductAddImageSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
