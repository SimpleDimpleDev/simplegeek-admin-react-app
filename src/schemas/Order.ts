import { CreditGetSchema, InvoiceGetSchema } from "./Payment";
import { DeliveryOrderSchema, DeliverySchema } from "./Delivery";

import { AdminGetBaseSchema } from "./Admin";
import { IdSchema } from "./Primitives";
import { PreorderOrderGetSchema } from "./Preorder";
import { UserGetSchema } from "./User";
import { z } from "zod";

export const OrderStatusSchema = z.enum(["CANCELLED", "UNPAID", "ACCEPTED", "ASSEMBLY", "DELIVERY", "FINISHED"]);

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
