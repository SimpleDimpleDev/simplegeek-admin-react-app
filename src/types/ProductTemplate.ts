import { ProductTemplateCreateSchema, ProductTemplateUpdateSchema } from "@schemas/ProductTemplate";

import { ProductTemplateGetSchema } from "@schemas/ProductTemplate";
import { z } from "zod";

export type ProductTemplateGet = z.infer<typeof ProductTemplateGetSchema>;
export type ProductTemplateCreate = z.infer<typeof ProductTemplateCreateSchema>;
export type ProductTemplateUpdate = z.infer<typeof ProductTemplateUpdateSchema>;
