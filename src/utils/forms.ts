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
