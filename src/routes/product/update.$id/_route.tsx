import { Button, Divider, Snackbar, Typography } from "@mui/material";
import { useAddImageProductMutation, useGetProductQuery, useUpdateProductMutation } from "@api/admin/product";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProductAddImageForm } from "./AddImageForm";
import { ProductUpdateForm } from "./UpdateForm";
import { useLazyGetFilterGroupListQuery } from "@api/admin/filterGroup";

export default function ProductUpdateRoute() {
	const params = useParams();
	const navigate = useNavigate();
	const productId = params.id;
	if (!productId) throw new Response("No product id provided", { status: 404 });
	const { data: product, isLoading: productIsLoading } = useGetProductQuery({ productId });

	const [fetchFilterGroupList, { data: filterGroupList, isLoading: filterGroupListIsLoading }] =
		useLazyGetFilterGroupListQuery();

	const [
		updateProduct,
		{ isSuccess: updateProductIsSuccess, isLoading: updateProductIsLoading, isError: updateProductIsError },
	] = useUpdateProductMutation();

	const [
		addImageProduct,
		{ isLoading: addImageProductIsLoading, isSuccess: addImageProductIsSuccess, isError: addImageProductIsError },
	] = useAddImageProductMutation();

	const [snackbarOpened, setSuccessSnackBarOpened] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const showLoadingOverlay = updateProductIsLoading || addImageProductIsLoading;

	const showSnackbarMessage = (message: string) => {
		setSnackbarMessage(message);
		setSuccessSnackBarOpened(true);
	};

	useEffect(() => {
		if (product) {
			fetchFilterGroupList({ categoryId: product.category.id });
		}
	}, [product, fetchFilterGroupList]);

	useEffect(() => {
		if (updateProductIsSuccess) {
			showSnackbarMessage("Продукт успешно обновлен");
		}
	}, [updateProductIsSuccess]);

	useEffect(() => {
		if (updateProductIsError) {
			showSnackbarMessage("Произошла ошибка при обновлении продукта");
		}
	}, [updateProductIsError]);

	useEffect(() => {
		if (addImageProductIsSuccess) {
			showSnackbarMessage("Изображение успешно добавлено");
		}
	}, [addImageProductIsSuccess]);

	useEffect(() => {
		if (addImageProductIsError) {
			showSnackbarMessage("Произошла ошибка при добавлении изображения");
		}
	}, [addImageProductIsError]);

	return (
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar
				open={snackbarOpened}
				autoHideDuration={3000}
				onClose={() => setSuccessSnackBarOpened(false)}
				message={snackbarMessage}
			/>
			<LoadingSpinner isLoading={productIsLoading}>
				<div className="h-100 d-f fd-c gap-2 px-3 pt-1 pb-4" style={{ minHeight: "100vh" }}>
					<Button onClick={() => navigate(-1)} sx={{ color: "warning.main", width: "fit-content" }}>
						<ChevronLeft />
						Назад
					</Button>
					{!product ? (
						<div className="w-100 h-100v d-f ai-c jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<>
							<ProductUpdateForm
								product={product}
								filterGroupList={filterGroupList}
								filterGroupListIsLoading={filterGroupListIsLoading}
								onSubmit={updateProduct}
							/>
							<Divider />
							<ProductAddImageForm product={product} onSubmit={addImageProduct} />
						</>
					)}
				</div>
			</LoadingSpinner>
		</>
	);
}
