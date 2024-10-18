import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

export const PreorderStatusSchema = z
	.enum(["NEW", "FUNDING", "WAITING_FOR_RELEASE", "FOREIGN_SHIPPING", "LOCAL_SHIPPING", "DISPATCH", "FINISHED"])
	.describe("PreorderStatus");

export const ShippingCostIncludedSchema = z.enum(["FOREIGN", "FULL", "NOT"]).describe("ShippingCostIncluded");

export const PreorderCreateSchema = z
	.object({
		title: z.string(),
		expectedArrival: z.string().nullable(),
	})
	.describe("PreorderCreate");

export const PreorderGetSchema = AdminGetBaseSchema.extend({
	title: z.string(),
	status: PreorderStatusSchema,
	expectedArrival: z.string().nullable(),
}).describe("PreorderGet");

export const PreorderListGetSchema = z
	.object({
		items: PreorderGetSchema.array(),
	})
	.describe("PreorderListGet");

export const PreorderUpdateSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		expectedArrival: z.string().nullable(),
	})
	.describe("PreorderUpdate");
