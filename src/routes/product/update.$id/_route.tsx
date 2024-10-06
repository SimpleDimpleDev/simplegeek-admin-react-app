import { Button, Divider, Snackbar, Typography } from "@mui/material";
import { useAddImageProductMutation, useGetProductQuery, useUpdateProductMutation } from "@api/admin/product";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProductAddImageForm } from "./AddImageForm";
import { ProductUpdateForm } from "./UpdateForm";
import { useEffect } from "react";
import { useLazyGetFilterGroupListQuery } from "@api/admin/filterGroup";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

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
		{
			isSuccess: updateProductIsSuccess,
			isLoading: updateProductIsLoading,
			isError: updateProductIsError,
			error: updateProductError,
		},
	] = useUpdateProductMutation();

	const [
		addImageProduct,
		{
			isLoading: addImageProductIsLoading,
			isSuccess: addImageProductIsSuccess,
			isError: addImageProductIsError,
			error: addImageProductError,
		},
	] = useAddImageProductMutation();

	const showLoadingOverlay = updateProductIsLoading || addImageProductIsLoading;

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useEffect(() => {
		if (product) {
			fetchFilterGroupList({ categoryId: product.category.id });
		}
	}, [product, fetchFilterGroupList]);

	useMutationFeedback({
		title: "Обновление продукта",
		isSuccess: updateProductIsSuccess,
		isError: updateProductIsError,
		error: updateProductError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Добавление изображения",
		isSuccess: addImageProductIsSuccess,
		isError: addImageProductIsError,
		error: addImageProductError,
		feedbackFn: showSnackbarMessage,
	});

	return (
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={3000} onClose={closeSnackbar} message={snackbarMessage} />
			<LoadingSpinner isLoading={productIsLoading}>
				<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
					<Button onClick={() => navigate(-1)} sx={{ color: "warning.main", width: "fit-content" }}>
						<ChevronLeft />
						Назад
					</Button>
					{!product ? (
						<div className="w-100 h-100v ai-c d-f jc-c">
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
