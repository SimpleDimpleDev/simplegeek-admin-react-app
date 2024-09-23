import { Button, CircularProgress, Divider, Modal, Snackbar, Typography } from "@mui/material";
import { useAddImageProductMutation, useGetProductQuery, useUpdateProductMutation } from "@api/admin/service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProductAddImageForm } from "./AddImageForm";
import { ProductUpdateForm } from "./UpdateForm";

export default function ProductUpdateRoute() {
	const params = useParams();
	const navigate = useNavigate();
	const productId = params.id;
	if (!productId) throw new Response("No product id provided", { status: 404 });
	const { data: product, isLoading: productIsLoading } = useGetProductQuery({ productId });

	const [
		updateProduct,
		{ isSuccess: updateProductIsSuccess, isLoading: updateProductIsLoading, isError: updateProductIsError },
	] = useUpdateProductMutation();
	const [addImageProduct,
		{ isLoading: addImageProductIsLoading, isError: addImageProductIsError },
	] = useAddImageProductMutation();

	const [successSnackBarOpened, setSuccessSnackBarOpened] = useState(false);
	const [errorSnackBarOpened, setErrorSnackBarOpened] = useState(false);

	useEffect(() => {
		if (updateProductIsSuccess) {
			setSuccessSnackBarOpened(true);
			setTimeout(() => navigate(`/product/inspect/${productId}`), 1500);
		}
	}, [updateProductIsSuccess, setSuccessSnackBarOpened, navigate, productId]);

	useEffect(() => {
		if (updateProductIsError || addImageProductIsError) {
			setErrorSnackBarOpened(true);
		}
	}, [updateProductIsError, addImageProductIsError, setErrorSnackBarOpened]);

	return (
		<>
			{updateProductIsLoading || addImageProductIsLoading && (
				<Modal open={true}>
					<div className="w-100v h-100v d-f ai-c jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
						<CircularProgress />
					</div>
				</Modal>
			)}
			<Snackbar
				open={successSnackBarOpened}
				autoHideDuration={3000}
				onClose={() => setSuccessSnackBarOpened(false)}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Typography variant="body1">Товар успешно обновлен</Typography>
			</Snackbar>
			<Snackbar
				open={errorSnackBarOpened}
				autoHideDuration={3000}
				onClose={() => setErrorSnackBarOpened(false)}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Typography variant="body1">Что-то пошло не так</Typography>
			</Snackbar>
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
							<ProductUpdateForm onSubmit={updateProduct} product={product} />
							<Divider />
							<ProductAddImageForm onSubmit={addImageProduct} product={product} />
						</>
					)}
				</div>
			</LoadingSpinner>
		</>
	);
}
