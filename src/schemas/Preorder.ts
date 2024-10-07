import { AdminGetBaseSchema } from "./Admin";
import { ISOToDateSchema } from "./Primitives";
import { InvoiceGetSchema } from "./Payment";
import { z } from "zod";

export const PreorderStatusSchema = z.enum([
	"NEW",
	"FUNDING",
	"WAITING_FOR_RELEASE",
	"FOREIGN_SHIPPING",
	"LOCAL_SHIPPING",
	"DISPATCH",
	"FINISHED",
]);
export const ShippingCostIncludedSchema = z.enum(["FOREIGN", "FULL", "NOT"]);

export const PreorderCreateSchema = z.object({
	title: z.string(),
	expectedArrival: z.date().nullable(),
});

export const PreorderGetSchema = AdminGetBaseSchema.extend({
	title: z.string(),
	status: PreorderStatusSchema,
	expectedArrival: ISOToDateSchema.nullable(),
});

export const PreorderListGetSchema = z.object({
	items: PreorderGetSchema.array(),
});

export const PreorderUpdateSchema = z.object({
	id: z.string(),
	title: z.string(),
	expectedArrival: z.date().nullable(),
});

export const PreorderOrderGetSchema = PreorderGetSchema.extend({
	shippingCostIncluded: ShippingCostIncludedSchema,
	foreignShippingInvoice: InvoiceGetSchema.nullable(),
	localShippingInvoice: InvoiceGetSchema.nullable(),
});
