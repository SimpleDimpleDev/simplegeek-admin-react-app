import { IdSchema } from "./Primitives";
import { z } from "zod";

export const FAQItemCreateSchema = z
	.object({
		question: z.string().min(1, { message: "Введите вопрос" }),
		answer: z.string().min(1, { message: "Введите ответ" }),
	})
	.describe("FAQItemCreate");

export const FAQItemGetSchema = FAQItemCreateSchema.extend({
	id: IdSchema,
}).describe("FAQItemGet");

export const FAQItemListGetSchema = z
	.object({
		items: FAQItemGetSchema.array(),
	})
	.describe("FAQItemListGet");
