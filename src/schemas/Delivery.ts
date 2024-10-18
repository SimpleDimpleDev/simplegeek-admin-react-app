import { PhysicalPropertiesSchema } from "./PhysicalProperties";
import { z } from "zod";

export const DeliveryServiceSchema = z.enum(["SELF_PICKUP", "CDEK"]);

export const DeliveryPointSchema = z
	.object({
		address: z.string(),
		code: z.string(),
	})
	.describe("DeliveryPoint");

export const RecipientSchema = z
	.object({
		fullName: z.string(),
		phone: z.string(),
	})
	.describe("Recipient");

export const DeliverySchema = z
	.object({
		recipient: RecipientSchema,
		service: DeliveryServiceSchema,
		point: DeliveryPointSchema.nullable(),
	})
	.describe("Delivery");

export const DeliveryPackageSchema = PhysicalPropertiesSchema.describe("DeliveryPackage");
