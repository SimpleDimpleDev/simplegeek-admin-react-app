import {
	PreorderGetSchema,
	PreorderOrderGetSchema,
	PreorderStatusSchema,
	ShippingCostIncludedSchema,
} from "@schemas/Preorder";

import { z } from "zod";

export type PreorderStatus = z.infer<typeof PreorderStatusSchema>;
export type ShippingCostIncluded = z.infer<typeof ShippingCostIncludedSchema>;
export type PreorderGet = z.infer<typeof PreorderGetSchema>;
export type PreorderOrderGet = z.infer<typeof PreorderOrderGetSchema>;
