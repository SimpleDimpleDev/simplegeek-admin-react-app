import { z } from "zod";

export const DeliveryServiceSchema = z.enum(["SELF_PICKUP", "CDEK"]);

export const DeliveryPointSchema = z.object({
	address: z.string(),
	code: z.string(),
});

export const RecipientSchema = z.object({
	fullName: z.string(),
	phone: z.string(),
});

export const DeliverySchema = z.object({
	recipient: RecipientSchema,
	service: DeliveryServiceSchema,
	point: DeliveryPointSchema.nullable(),
});

export const DeliveryOrderSchema = DeliverySchema.extend({
	tracking: z
		.object({
			code: z.string(),
			link: z.string(),
		})
		.nullable(),
});
