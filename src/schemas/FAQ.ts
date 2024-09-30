import { IdSchema } from "./Primitives";
import { z } from "zod";

export const FAQItemCreateSchema = z.object({
    question: z.string().min(1, { message: "Введите вопрос" }),
    answer: z.string().min(1, { message: "Введите ответ" }),
});

export const FAQItemGetSchema = FAQItemCreateSchema.extend({
    id: IdSchema,
});

export const FAQItemListGetSchema = z.object({
	items: FAQItemGetSchema.array(),
});
