export const getImageUrl = (rawUrl: string, size: "extraSmall" | "small" | "medium" | "large") => {
	const postfixMapping = {
		extraSmall: "xs",
		small: "s",
		medium: "m",
		large: "l",
	};
	return `${rawUrl}_${postfixMapping[size]}.webp`;
};
