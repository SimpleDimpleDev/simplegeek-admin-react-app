export const debounce = (func: () => void, wait: number) => {
	let timeout: NodeJS.Timeout;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func();
		}, wait);
	};
};
