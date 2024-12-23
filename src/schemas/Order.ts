import { CreditGetSchema, InvoiceGetSchema } from "./Payment";
import { PreorderGetSchema, ShippingCostIncludedSchema } from "./Preorder";

import { AdminGetBaseSchema } from "./Admin";
import { DeliverySchema } from "./Delivery";
import { IdSchema } from "./Primitives";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";
import { UserGetSchema } from "./User";
import { z } from "zod";

export const OrderStatusSchema = z.enum([
	"CANCELLED",
	"UNPAID",
	"ACCEPTED",
	"DELIVERY",
	"READY_FOR_PICKUP",
	"FINISHED",
]);

export const OrderListFilterSchema = z.enum([
	"ACTION_REQUIRED",
	"READY_FOR_SELF_PICKUP",
]).nullable();

export const OrderCreateSchema = z.object({
	creditIds: IdSchema.array(),
	delivery: DeliverySchema.nullable(),
});

export const OrderItemGetSchema = z.object(
	{
		id: IdSchema,
		title: z.string(),
		image: z.string(),
		quantity: z.number(),
		sum: z.number(),
		credit: CreditGetSchema.nullable(),
		physicalProperties: PhysicalPropertiesSchema.nullable(),
	},
	{ description: "OrderItemGet" }
);

export const OrderDeliveryGetSchema = DeliverySchema.extend({
	id: IdSchema,
	tracking: z
		.object({
			code: z.string(),
			link: z.string(),
		})
		.nullable(),
}).describe("OrderDelivery");

export const OrderPreorderGetSchema = PreorderGetSchema.extend({
	shippingCostIncluded: ShippingCostIncludedSchema,
	foreignShippingInvoice: InvoiceGetSchema.nullable(),
	localShippingInvoice: InvoiceGetSchema.nullable(),
}).describe("OrderPreorderGet");

export const OrderGetSchema = AdminGetBaseSchema.extend({
	user: UserGetSchema,
	status: OrderStatusSchema,
	delivery: OrderDeliveryGetSchema.nullable(),
	preorder: OrderPreorderGetSchema.nullable(),
	items: OrderItemGetSchema.array(),
	initialInvoice: InvoiceGetSchema,
});

export const OrderListGetSchema = z.object({
	items: OrderGetSchema.array(),
});

export const OrderEditablePropsGetSchema = z.object({
	delivery: z.boolean(),
	statuses: OrderStatusSchema.array(),
});

export const OrderUpdateStatusSchema = z.object({
	id: z.string(),
	status: OrderStatusSchema,
});

export const OrderUpdateDeliverySchema = z.object({
	id: z.string(),
	delivery: DeliverySchema,
});