import { ISOToDateSchema } from "./Primitives";
import { z } from "zod";

const OrderEventTypeSchema = z.enum(["INTERNAL", "EXTERNAL", "MESSAGE"]);
const OrderEventVisibilitySchema = z.enum(["PUBLIC", "PRIVATE"]);

export const OrderEventCreateSchema = z.object({
	orderId: z.string(),
	visibility: OrderEventVisibilitySchema,
	message: z.string(),
});

const OrderEventGetSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	createdAt: ISOToDateSchema,
    initiator: z.string(),
	visibility: OrderEventVisibilitySchema,
	type: OrderEventTypeSchema,
	message: z.string(),
});

export const OrderEventListGetSchema = z.object({
	items: OrderEventGetSchema.array(),
});
