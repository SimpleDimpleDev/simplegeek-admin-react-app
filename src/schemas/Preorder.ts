import { AdminGetBaseSchema } from "./Admin";
import { z } from "zod";

export const PreorderOptionalStatusSchema = z.enum(["WAITING_FOR_RELEASE", "FOREIGN_SHIPPING", "LOCAL_SHIPPING"])

export const PreorderStatusSchema = z
	.enum(["NEW", "WAITING_FOR_RELEASE", "FOREIGN_SHIPPING", "LOCAL_SHIPPING", "DISPATCH", "FINISHED"])
	.describe("PreorderStatus");

export const ShippingCostIncludedSchema = z.enum(["FOREIGN", "FULL", "NOT"]).describe("ShippingCostIncluded");

export const PreorderCreateSchema = z
	.object({
		title: z.string(),
		expectedArrival: z.string().nullable(),
		stages: z.enum(["WAITING_FOR_RELEASE", "FOREIGN_SHIPPING", "LOCAL_SHIPPING"]).array(),
	})
	.describe("PreorderCreate");

export const PreorderGetSchema = AdminGetBaseSchema.extend({
	title: z.string(),
	isActive: z.boolean(),
	status: PreorderStatusSchema,
	stages: PreorderStatusSchema.array(),
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
		isActive: z.boolean(),
		expectedArrival: z.string().nullable(),
	})
	.describe("PreorderUpdate");
