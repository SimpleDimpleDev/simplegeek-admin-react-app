import CyrillicToTranslit from "cyrillic-to-translit-js";

export const getRuGoodsWord = (count: number) => {
	if (count % 10 === 1 && count % 100 !== 11) {
		return "Товар";
	}
	if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
		return "Товара";
	}
	return "Товаров";
};

export const generateLink = (text: string) => {
	// @ts-expect-error js-library;
	const cyrillicToTranslit = new CyrillicToTranslit();
	const snakeText = cyrillicToTranslit.transform(text, " ").toLowerCase() as string;
	return snakeText
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join("");
};
