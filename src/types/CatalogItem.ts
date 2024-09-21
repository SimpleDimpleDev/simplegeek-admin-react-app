import { CatalogItemGetSchema, CatalogItemPublishSchema } from "@schemas/CatalogItem";

import { z } from "zod";

export type CatalogItemPublish = z.infer<typeof CatalogItemPublishSchema>;
export type CatalogItemGet = z.infer<typeof CatalogItemGetSchema>;
