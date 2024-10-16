import { AdminGetBaseSchema } from "./Admin";
import { ISOToDateSchema } from "./Primitives";
import { z } from "zod";

export const CreditInfoCreateUpdateSchema = z.object({
	deposit: z.number(),
	payments: z
		.object({
			sum: z.number(),
			deadline: z.string(),
		})
		.array(),
});

export const CreditInfoGetSchema = z.object({
	deposit: z.number(),
	payments: z
		.object({
			sum: z.number(),
			deadline: ISOToDateSchema,
		})
		.array(),
});

export const InvoiceGetSchema = AdminGetBaseSchema.extend({
	amount: z.number(),
	isPaid: z.boolean(),
	expiresAt: ISOToDateSchema.nullable(),
});

export const CreditGetSchema = z.object({
	deposit: z.number(),
	payments: z.object({
		invoice: InvoiceGetSchema,
		deadline: ISOToDateSchema,
	})
});
