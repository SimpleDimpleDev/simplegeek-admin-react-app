import { isApiError } from "@utils/api";
import { useEffect } from "react";

interface useMutationFeedBackParams {
	title: string;
	isSuccess: boolean;
	isError: boolean;
	error: unknown;
	feedbackFn: (message: string) => void;
    successAction?: () => void;
}

const useMutationFeedback = ({ title, isSuccess, isError, error, feedbackFn }: useMutationFeedBackParams) => {
    
	useEffect(() => {
		if (isSuccess) {
			feedbackFn(`${title}: Успешно!`);
		}
	}, [title, isSuccess, feedbackFn]);

	useEffect(() => {
		if (isError) {
			const errorMessage = isApiError(error) ? error.data.message : "Неизвестная ошибка";
			feedbackFn(`${title}: Ошибка - ${errorMessage}!`);
		}
	}, [title, isError, error, feedbackFn]);
};

export { useMutationFeedback };
