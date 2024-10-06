import { CircularProgress, Modal, Snackbar, Typography } from "@mui/material";

import { ProductCreateForm } from "./CreateForm";
import { useCallback } from "react";
import { useCreateProductMutation } from "@api/admin/product";
import { useGetCategoryListQuery } from "@api/admin/category";
import { useLazyGetFilterGroupListQuery } from "@api/admin/filterGroup";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@hooks/useSnackbar";

export default function ProductCreateRoute() {
	const navigate = useNavigate();

	const [
		createProduct,
		{ isLoading: createIsLoading, isSuccess: createIsSuccess, isError: createIsError, error: createError },
	] = useCreateProductMutation();
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const [
		fetchFilterGroupList,
		{ data: filterGroupList, isLoading: filterGroupListIsLoading, isFetching: filterGroupListIsFetching },
	] = useLazyGetFilterGroupListQuery();

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	const successNavigate = useCallback(() => {
		setTimeout(() => navigate("/product/table"), 1500);
	}, [navigate]);

	useMutationFeedback({
		title: "Создание товара",
		isSuccess: createIsSuccess,
		isError: createIsError,
		error: createError,
		feedbackFn: showSnackbarMessage,
		successAction: successNavigate,
	});

	return (
		<div className="px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
			{createIsLoading && (
				<Modal open={true}>
					<div className="w-100v h-100v ai-c d-f jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
						<CircularProgress />
					</div>
				</Modal>
			)}
			<Snackbar open={snackbarOpened} autoHideDuration={1500} onClose={closeSnackbar} message={snackbarMessage} />
			<div className="p-2">
				<Typography variant="h5">Создать товар</Typography>
			</div>

			<ProductCreateForm
				onSubmit={createProduct}
				categoryList={categoryList}
				categoryListIsLoading={categoryListIsLoading}
				fetchFilterGroupList={fetchFilterGroupList}
				filterGroupList={filterGroupList}
				filterGroupListIsLoading={filterGroupListIsLoading}
				filterGroupListIsFetching={filterGroupListIsFetching}
			/>
		</div>
	);
}
