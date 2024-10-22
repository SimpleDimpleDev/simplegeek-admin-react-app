export const handleIntChange =
	(onChange: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (!onChange) return;
		const { value } = e.target;
		// Allow empty input
		if (value === "") {
			onChange("");
			return;
		}
		// Validate the input value
		const intRegex = /^-?\d*$/;
		if (intRegex.test(value)) {
			onChange(value);
		}
	};

export const formatDateField = (date: Date) => {
	const yearString = String(date.getFullYear());
	const monthString = String(date.getMonth() + 1).padStart(2, "0");
	const dayString = String(date.getDate()).padStart(2, "0");
	return `${yearString}-${monthString}-${dayString}T00:00:00+00:00`;
};
