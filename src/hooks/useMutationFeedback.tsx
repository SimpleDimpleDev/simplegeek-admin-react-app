import { isApiError } from "@utils/api";
import { useEffect } from "react";

interface useMutationFeedBackParams {
	title: string;
	isSuccess: boolean;
	isError: boolean;
	error: unknown;
	feedbackFn: (message: string) => void;
	successAction?: () => void;
	errorAction?: () => void;
}

const useMutationFeedback = ({
	title,
	isSuccess,
	isError,
	error,
	feedbackFn,
	successAction,
	errorAction,
}: useMutationFeedBackParams) => {
	useEffect(() => {
		if (isSuccess) {
			feedbackFn(`${title}: Успешно!`);
			if (successAction) successAction();
		}
	}, [title, isSuccess, feedbackFn, successAction]);

	useEffect(() => {
		if (isError) {
			const errorMessage = isApiError(error) ? error.data.message : "Неизвестная ошибка";
			feedbackFn(`${title}: Ошибка - ${errorMessage}!`);
			if (errorAction) errorAction();
		}
	}, [title, isError, error, feedbackFn, errorAction]);
};

export { useMutationFeedback };
