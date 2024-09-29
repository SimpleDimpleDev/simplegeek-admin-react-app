import { CircularProgress, Modal, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { ProductCreateForm } from "./CreateForm";
import { useCreateProductMutation } from "@api/admin/product";
import { useGetCategoryListQuery } from "@api/admin/category";
import { useLazyGetFilterGroupListQuery } from "@api/admin/filterGroup";
import { useNavigate } from "react-router-dom";

export default function ProductCreateRoute() {
	const navigate = useNavigate();

	const [createProduct, { isLoading: createIsLoading, isSuccess: createIsSuccess, isError: createIsError }] =
		useCreateProductMutation();
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const [
		fetchFilterGroupList,
		{ data: filterGroupList, isLoading: filterGroupListIsLoading, isFetching: filterGroupListIsFetching },
	] = useLazyGetFilterGroupListQuery();

	const [snackbarOpened, setSnackbarOpened] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const showSnackBarMessage = (message: string) => {
		setSnackbarMessage(message);
		setSnackbarOpened(true);
	};

	useEffect(() => {
		if (createIsSuccess) {
			showSnackBarMessage("Товар создан!");
			setTimeout(() => navigate("/product/table"), 1500);
		}
	}, [createIsSuccess, navigate]);

	useEffect(() => {
		if (createIsError) {
			showSnackBarMessage("Произошла ошибка при создании товара");
		}
	}, [createIsError]);

	return (
		<div className="px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
			{createIsLoading && (
				<Modal open={true}>
					<div className="w-100v h-100v ai-c d-f jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
						<CircularProgress />
					</div>
				</Modal>
			)}
			<Snackbar
				open={snackbarOpened}
				autoHideDuration={1500}
				onClose={() => setSnackbarOpened(false)}
				message={snackbarMessage}
			/>
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
