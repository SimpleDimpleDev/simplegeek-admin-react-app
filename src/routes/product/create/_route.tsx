import { CircularProgress, Modal, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { ProductCreateForm } from "./CreateForm";
import { useCreateProductMutation } from "@api/admin/product";
import { useGetCategoryListQuery } from "@api/admin/category";
import { useLazyGetFilterGroupListQuery } from "@api/admin/filterGroup";
import { useNavigate } from "react-router-dom";

export default function ProductCreate() {
	const navigate = useNavigate();

	const [createProduct, { isLoading, isSuccess, isError }] = useCreateProductMutation();
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const [
		fetchFilterGroupList,
		{ data: filterGroupList, isLoading: filterGroupListIsLoading, isFetching: filterGroupListIsFetching },
	] = useLazyGetFilterGroupListQuery();

	const [successSnackBarOpened, setSuccessSnackBarOpened] = useState(false);
	const [errorSnackBarOpened, setErrorSnackBarOpened] = useState(false);

	useEffect(() => {
		if (isSuccess) {
			setSuccessSnackBarOpened(true);
			setTimeout(() => navigate("/product/table"), 1500);
		}
	}, [isSuccess, setSuccessSnackBarOpened, navigate]);

	useEffect(() => {
		if (isError) {
			setErrorSnackBarOpened(true);
		}
	}, [isError, setErrorSnackBarOpened]);

	return (
		<div className="h-100 d-f fd-c px-3 pt-1 pb-4" style={{ minHeight: "100vh" }}>
			{isLoading && (
				<Modal open={true}>
					<div className="w-100v h-100v d-f ai-c jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
						<CircularProgress />
					</div>
				</Modal>
			)}
			<Snackbar
				open={successSnackBarOpened}
				autoHideDuration={1500}
				onClose={() => setSuccessSnackBarOpened(false)}
				message="Товар создан!"
			/>
			<Snackbar
				open={errorSnackBarOpened}
				autoHideDuration={1500}
				onClose={() => setErrorSnackBarOpened(false)}
				message="Произошла ошибка при создании товара"
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
