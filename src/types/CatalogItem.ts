import {
	CatalogItemAdminSchema,
	CatalogItemPublishSchema,
	CatalogItemShopSchema,
	CatalogItemsAvailabilitySchema,
} from "@schemas/CatalogItem";

import { PreorderShop } from "./Preorder";
import { z } from "zod";

export type CatalogItemPublish = z.infer<typeof CatalogItemPublishSchema>;
export type CatalogItemShop = z.infer<typeof CatalogItemShopSchema>;
export type CatalogItem = CatalogItemShop & {
	preorder: PreorderShop | null;
	publicationLink: string;
};
export type CatalogItemAdmin = z.infer<typeof CatalogItemAdminSchema>;
export type CatalogItemsAvailability = z.infer<typeof CatalogItemsAvailabilitySchema>;
