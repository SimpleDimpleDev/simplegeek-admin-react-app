import { DeliveryPointSchema, DeliverySchema, DeliveryServiceSchema, RecipientSchema } from "@schemas/Delivery";

import { z } from "zod";

export type Recipient = z.infer<typeof RecipientSchema>;
export type DeliveryService = z.infer<typeof DeliveryServiceSchema>;
export type DeliveryPoint = z.infer<typeof DeliveryPointSchema>;
export type DeliveryCreate = z.infer<typeof DeliverySchema>;
