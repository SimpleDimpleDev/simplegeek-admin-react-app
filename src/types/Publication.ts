import { PublicationAdminSchema, PublicationCreateSchema, PublicationShopSchema } from "@schemas/Publication";

import { z } from "zod";

export type PublicationCreate = z.infer<typeof PublicationCreateSchema>;
export type PublicationShop = z.infer<typeof PublicationShopSchema>;
export type PublicationAdmin = z.infer<typeof PublicationAdminSchema>;
