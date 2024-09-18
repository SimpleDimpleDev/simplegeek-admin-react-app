import { z } from "zod";

import { IdSchema } from "./Primitives";

export const FAQItemCreateSchema = z.object({
    question: z.string().min(1, { message: "Введите вопрос" }),
    answer: z.string().min(1, { message: "Введите ответ" }),
});

export const FAQItemSchema = FAQItemCreateSchema.extend({
    id: IdSchema,
});
