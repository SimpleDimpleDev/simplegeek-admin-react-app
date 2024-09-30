import { CreditGetSchema, InvoiceGetSchema } from "./Payment";
import { DeliveryOrderSchema, DeliverySchema } from "./Delivery";

import { AdminGetBaseSchema } from "./Admin";
import { IdSchema } from "./Primitives";
import { PreorderOrderGetSchema } from "./Preorder";
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

export const OrderCreateSchema = z.object({
	creditIds: IdSchema.array(),
	delivery: DeliverySchema.nullable(),
});

export const OrderItemGetSchema = z.object({
	id: IdSchema,
	title: z.string(),
	image: z.string(),
	quantity: z.number(),
	sum: z.number(),
	credit: CreditGetSchema.nullable(),
});

export const OrderGetSchema = AdminGetBaseSchema.extend({
	user: UserGetSchema,
	status: OrderStatusSchema,
	delivery: DeliveryOrderSchema.nullable(),
	preorder: PreorderOrderGetSchema.nullable(),
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
