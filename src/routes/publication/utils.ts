import { z } from "zod";

export const SlugResolver = z
	.string({ message: "Укажите ссылку" })
	.regex(/^[a-zA-Z0-9-_а-яА-ЯёЁ]+$/, {
		message: "Ссылка может включать только латинские или русские буквы, цифры, дефис и нижнее подчеркивание",
	});

export const DiscountResolver = z.object({
	type: z.enum(["FIXED", "PERCENT"]),
	value: z.coerce
		.number({ message: "Укажите скидку" })
		.positive({ message: "Скидка должна быть положительным числом" }),
}).refine((data) => data.type === "PERCENT" ? data.value <= 100 : true, {
	message: "Процент не может превышать 100%",
})
