import { z } from "zod";

export const SlugResolver = z
	.string({ message: "Укажите ссылку" })
	.regex(/^[a-zA-Z0-9-_а-яА-ЯёЁ]+$/, {
		message: "Ссылка может включать только латинские или русские буквы, цифры, дефис и нижнее подчеркивание",
	});
