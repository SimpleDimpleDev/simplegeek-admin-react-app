import { z } from "zod";

import { ISOToDateSchema } from "./Primitives";
import { AdminGetBaseSchema } from "./Admin";
import { InvoiceAdminSchema, InvoiceShopSchema } from "./Payment";

export const PreorderStatusSchema = z.enum([
	"NEW",
	"FUNDING",
	"WAITING_FOR_RELEASE",
	"SHIPPING",
	"DISPATCH",
	"FINISHED",
]);
export const ShippingCostIncludedSchema = z.enum(["FOREIGN", "FULL", "NOT"]);

export const PreorderShopSchema = z.object({
	title: z.string(),
	status: PreorderStatusSchema,
	expectedArrival: ISOToDateSchema.nullable(),
});

export const PreorderAdminSchema = AdminGetBaseSchema.merge(PreorderShopSchema);

export const PreorderOrderShopSchema = PreorderShopSchema.extend({
	shippingCostIncluded: ShippingCostIncludedSchema,
	foreignShippingInvoice: InvoiceShopSchema.nullable(),
	localShippingInvoice: InvoiceShopSchema.nullable(),
});

export const PreorderOrderAdminSchema = PreorderAdminSchema.extend({
	shippingCostIncluded: ShippingCostIncludedSchema,
	foreignShippingInvoice: InvoiceAdminSchema.nullable(),
	localShippingInvoice: InvoiceAdminSchema.nullable(),
});
