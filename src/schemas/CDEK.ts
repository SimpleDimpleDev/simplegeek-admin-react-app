import { z } from "zod";

export const CDEKDeliveryTypeSchema = z.enum(["office", "door"]);

export const CDEKTariffSchema = z.object({
	tariff_code: z.number(),
	tariff_name: z.string(),
	tariff_description: z.string(),
	delivery_mode: z.number(),
	period_min: z.number(),
	period_max: z.number(),
	delivery_sum: z.number(),
});

export const CDEKOfficeAddressSchema = z.object({
	city_code: z.number(),
	city: z.string(),
	type: z.string(),
	postal_code: z.string(),
	country_code: z.string(),
	have_cashless: z.boolean(),
	have_cash: z.boolean(),
	allowed_cod: z.boolean(),
	is_dressing_room: z.boolean(),
	code: z.string(),
	name: z.string(),
	address: z.string(),
	work_time: z.string(),
	location: z.array(z.number()),
});

export const CDEKDoorAddressSchema = z.object({
	name: z.string(),
	position: z.array(z.number()),
	kind: z.string(),
	precision: z.string(),
	formatted: z.string(),
	postal_code: z.string(),
	country_code: z.string(),
	city: z.string(),
});

export const CDEKAddressSchema = z.union([CDEKOfficeAddressSchema, CDEKDoorAddressSchema]);

export const CDEKDeliveryDataFullSchema = z.object({
	deliveryType: CDEKDeliveryTypeSchema,
	tariff: CDEKTariffSchema,
	address: CDEKAddressSchema,
});

export const CDEKWaybillPackageSchema = z.object({
	length: z.number(),
	width: z.number(),
	height: z.number(),
	weight: z.number(),
});

export const CDEKWaybillCreateSchema = z.object({
	orderId: z.string(),
	packages: CDEKWaybillPackageSchema.array(),
});

export const CDEKWaybillGetSchema = z.object({
	status: z.enum(["PENDING", "CREATED"]),
	tracking: z
		.object({
			code: z.string(),
			link: z.string(),
		})
		.nullable(),
	print: z
		.object({
			status: z.enum(["PENDING", "CREATED"]),
			url: z.string().nullable(),
		})
		.nullable(),
});
