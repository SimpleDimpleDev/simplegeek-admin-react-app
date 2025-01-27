import { AdminGetBaseSchema } from "./Admin";
import { ISOToDateSchema } from "./Primitives";
import { z } from "zod";

export const CreditInfoCreateUpdateSchema = z
	.object({
		deposit: z.number(),
		payments: z
			.object({
				sum: z.number(),
				deadline: z.string(),
			})
			.array(),
	})
	.describe("CreditInfoCreateUpdate");

export const CreditInfoGetSchema = z
	.object({
		deposit: z.number(),
		payments: z
			.object({
				sum: z.number(),
				deadline: ISOToDateSchema,
			})
			.array(),
	})
	.describe("CreditInfoGet");

export const InvoiceStatusSchema = z.enum(["UNPAID", "WAITING", "PAID", "REFUNDED"]).describe("InvoiceStatus");

export const InvoiceGetSchema = AdminGetBaseSchema.extend({
	title: z.string(),
	amount: z.number(),
	status: InvoiceStatusSchema,
	expiresAt: ISOToDateSchema.nullable(),
}).describe("InvoiceGet");

export const CreditGetSchema = z
	.object({
		deposit: z.number(),
		payments: z
			.object({
				invoice: InvoiceGetSchema,
				deadline: ISOToDateSchema,
			})
			.array(),
	})
	.describe("CreditGet");
