import { AdminGetBaseSchema } from "./Admin";
import { ISOToDateSchema } from "./Primitives";
import { z } from "zod";

export const CreditInfoGetSchema = z.object({
	payments: z
		.object({
			sum: z.number(),
			deadline: ISOToDateSchema,
		})
		.array(),
});

export const CreditInfoCreateSchema = z.object({
	payments: z
		.object({
			sum: z.number(),
			deadline: z.string(),
		})
		.array(),
});

export const InvoiceGetSchema = AdminGetBaseSchema.extend({
	amount: z.number(),
	isPaid: z.boolean(),
	expiresAt: ISOToDateSchema.nullable(),
});

export const CreditGetSchema = CreditInfoGetSchema.extend({
	paidParts: z.number(),
	invoices: InvoiceGetSchema.array(),
});
