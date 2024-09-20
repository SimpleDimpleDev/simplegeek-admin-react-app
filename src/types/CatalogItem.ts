import {
	CatalogItemAdminSchema,
	CatalogItemPublishSchema,
	CatalogItemsAvailabilitySchema,
} from "@schemas/CatalogItem";

import { z } from "zod";

export type CatalogItemPublish = z.infer<typeof CatalogItemPublishSchema>;
export type CatalogItemAdmin = z.infer<typeof CatalogItemAdminSchema>;
export type CatalogItemsAvailability = z.infer<typeof CatalogItemsAvailabilitySchema>;
