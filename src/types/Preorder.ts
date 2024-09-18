import { PreorderAdminSchema, PreorderShopSchema, PreorderStatusSchema } from "@schemas/Preorder";

import { z } from "zod";

export type PreorderShop = z.infer<typeof PreorderShopSchema>;
export type PreorderAdmin = z.infer<typeof PreorderAdminSchema>;
export type PreorderStatus = z.infer<typeof PreorderStatusSchema>;
