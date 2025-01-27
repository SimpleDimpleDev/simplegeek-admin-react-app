import { AdminGetBaseSchema } from "./Admin";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";
import { z } from "zod";

export const ProductTemplateDataSchema = z
	.object({
		categoryId: z.string().nullable(),
		title: z.string().nullable(),
		description: z.string().nullable(),
		physicalProperties: PhysicalPropertiesSchema.nullable(),
		filterGroups: z
			.object({
				id: z.string().min(1),
				title: z.string().min(1),
				filters: z
					.object({
						id: z.string().min(1),
						value: z.string().min(1),
					})
					.array(),
			})
			.array(),
	})
	.describe("ProductTemplateData");

export const ProductTemplateDataResolver = z.object({
	title: z.string().nullable(),
	description: z.string().nullable(),
	categoryId: z.string().nullable(),
	physicalProperties: z
		.object({
			width: z.coerce
				.number({ message: "Укажите ширину" })
				.positive({ message: "Ширина должна быть положительным числом" }),
			height: z.coerce
				.number({ message: "Укажите высоту" })
				.positive({ message: "Высота должна быть положительным числом" }),
			length: z.coerce
				.number({ message: "Укажите длину" })
				.positive({ message: "Длина должна быть положительным числом" }),
			weight: z.coerce
				.number({ message: "Укажите массу" })
				.positive({ message: "Масса должна быть положительным числом" }),
		})
		.nullable(),
	filterGroups: z
		.object({
			id: z.string().min(1, { message: "Выберите группу фильтров" }),
			title: z.string({ message: "Введите название фильтра" }).min(1, { message: "Введите название фильтра" }),
			filters: z
				.object({
					id: z.string().nullable(),
					value: z.string({ message: "Введите значение" }).min(1, { message: "Введите значение" }),
				})
				.array()
				.nonempty({
					message: "У фильтра должно быть хотя бы одно значение",
				}),
		})
		.array(),
});

export const ProductTemplateCreateSchema = z
	.object({
		title: z.string(),
		data: ProductTemplateDataSchema,
	})
	.describe("ProductTemplateCreate");

export const ProductTemplateGetSchema = AdminGetBaseSchema.extend({
	title: z.string(),
	data: ProductTemplateDataSchema,
}).describe("ProductTemplateGet");

export const ProductTemplateListGetSchema = z
	.object({
		items: ProductTemplateGetSchema.array(),
	})
	.describe("ProductTemplateListGet");

export const ProductTemplateUpdateSchema = z.object({
	id: z.string(),
	title: z.string().nullable(),
	data: ProductTemplateDataSchema,
});
