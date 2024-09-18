import { z } from "zod";

import { PublicationShopSchema } from "./Publication";

export const PublicationsSchema = z.object({
	items: PublicationShopSchema.array(),
});
