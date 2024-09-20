import {
	CreditAdminSchema,
	CreditShopSchema,
	InvoiceAdminSchema,
	InvoiceShopSchema,
} from "./Payment";
import { DeliveryOrderSchema, DeliverySchema } from "./Delivery";
import { ISOToDateSchema, IdSchema } from "./Primitives";
import { PreorderOrderAdminSchema, PreorderOrderShopSchema } from "./Preorder";

import { AdminGetBaseSchema } from "./Admin";
import { UserAdminTableSchema } from "./User";
import { z } from "zod";

export const OrderStatusSchema = z.enum(["CANCELLED", "UNPAID", "ACCEPTED", "ASSEMBLY", "DELIVERY", "FINISHED"]);

export const OrderCreateSchema = z.object({
	creditIds: IdSchema.array(),
	delivery: DeliverySchema.nullable(),
});
	
export const OrderItemShopSchema = z.object({
	id: IdSchema,
	title: z.string(),
	image: z.string(),
	quantity: z.number(),
	sum: z.number(),
	credit: CreditShopSchema.nullable(),
});

export const OrderItemAdminSchema = z.object({
	id: IdSchema,
	title: z.string(),
	image: z.string(),
	quantity: z.number(),
	sum: z.number(),
	credit: CreditAdminSchema.nullable(),
});

export const OrderShopSchema = z.object({
	id: IdSchema,
	status: OrderStatusSchema,
	createdAt: ISOToDateSchema,
	delivery: DeliveryOrderSchema.nullable(),
	preorder: PreorderOrderShopSchema.nullable(),
	items: OrderItemShopSchema.array(),
	initialInvoice: InvoiceShopSchema,
});

export const OrderAdminSchema = AdminGetBaseSchema.extend({
	user: UserAdminTableSchema,
	status: OrderStatusSchema,
	delivery: DeliveryOrderSchema.nullable(),
	preorder: PreorderOrderAdminSchema.nullable(),
	items: OrderItemAdminSchema.array(),
	initialInvoice: InvoiceAdminSchema,
});
