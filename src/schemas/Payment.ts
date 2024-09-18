import { z } from "zod";

import { IdSchema, ISOToDateSchema } from "./Primitives";
import { AdminGetBaseSchema } from "./Admin";

export const BaseCreditPaymentInfo = z.object({
	sum: z.number(),
	deadline: ISOToDateSchema,
});

export const CreditInfoSchema = z.object({
	payments: BaseCreditPaymentInfo.array(),
});

export const InvoiceShopSchema = z.object({
	id: IdSchema,
	amount: z.number(),
	isPaid: z.boolean(),
	expiresAt: ISOToDateSchema.nullable(),
});

export const InvoiceAdminSchema = AdminGetBaseSchema.extend({
	amount: z.number(),
	isPaid: z.boolean(),
	expiresAt: ISOToDateSchema.nullable(),
});

export const CreditShopSchema = CreditInfoSchema.extend({
	paidParts: z.number(),
	invoice: InvoiceShopSchema.nullable(),
});

export const CreditAdminSchema = CreditInfoSchema.extend({
	paidParts: z.number(),
	invoices: InvoiceAdminSchema.array(),
});
