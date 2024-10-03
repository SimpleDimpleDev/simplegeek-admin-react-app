import { useState } from "react";

const useSnackbar = () => {
	const [snackbarOpened, setSnackbarOpened] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const showSnackbarMessage = (message: string) => {
		setSnackbarMessage(message);
		setSnackbarOpened(true);
	};

	const closeSnackbar = () => {
		setSnackbarOpened(false);
	};

	return { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar };
};

export { useSnackbar };
