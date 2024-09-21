import { AdminGetBaseSchema } from "./Admin";
import { ISOToDateSchema } from "./Primitives";
import { z } from "zod";

export const BaseCreditPaymentInfo = z.object({
	sum: z.number(),
	deadline: ISOToDateSchema,
});

export const CreditInfoSchema = z.object({
	payments: BaseCreditPaymentInfo.array(),
});

export const InvoiceGetSchema = AdminGetBaseSchema.extend({
	amount: z.number(),
	isPaid: z.boolean(),
	expiresAt: ISOToDateSchema.nullable(),
});

export const CreditGetSchema = CreditInfoSchema.extend({
	paidParts: z.number(),
	invoices: InvoiceGetSchema.array(),
});
