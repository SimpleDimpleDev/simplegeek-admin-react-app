import { Button, CircularProgress, Modal, Snackbar, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import { ProductCreateForm } from "./CreateForm";
import { useCreateProductMutation } from "@api/admin/product";
import { useGetCategoryListQuery } from "@api/admin/category";
import { useGetProductTemplateListQuery } from "@api/admin/productTemplate";
import { useLazyGetFilterGroupListQuery } from "@api/admin/filterGroup";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@hooks/useSnackbar";

export default function ProductCreateRoute() {
	const navigate = useNavigate();

	const [templateSelectOpen, setTemplateSelectOpen] = useState(false);

	const [
		createProduct,
		{ isLoading: createIsLoading, isSuccess: createIsSuccess, isError: createIsError, error: createError },
	] = useCreateProductMutation();
	const { data: templateList, isLoading: templateListIsLoading } = useGetProductTemplateListQuery();
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const [
		fetchFilterGroupList,
		{ data: filterGroupList, isLoading: filterGroupListIsLoading, isFetching: filterGroupListIsFetching },
	] = useLazyGetFilterGroupListQuery();

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	const successNavigate = useCallback(() => {
		setTimeout(() => navigate("/product/table/UNPUBLISHED"), 1500);
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
			<div className="p-2 d-f fd-r jc-sb">
				<Typography variant="h5">Создать товар</Typography>
				<Button onClick={() => setTemplateSelectOpen(true)}>Использовать шаблон</Button>
			</div>

			<ProductCreateForm
				onSubmit={createProduct}
				templateSelectOpen={templateSelectOpen}
				setTemplateSelectOpen={setTemplateSelectOpen}
				templateList={templateList}
				templateListIsLoading={templateListIsLoading}
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
