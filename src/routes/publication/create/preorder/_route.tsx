import { CircularProgress, Snackbar, Typography } from "@mui/material";
import { useCreatePublicationMutation, useGetMaxRatingQuery } from "@api/admin/publication";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { PublicationCreatePreorderForm } from "./form";
import { useGetCategoryListQuery } from "@api/admin/category";
import { useGetPreorderQuery } from "@api/admin/preorder";
import { useGetProductListQuery } from "@api/admin/product";
import { useMemo } from "react";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

export default function PublicationCreatePreorderRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const preorderId = params.id;
	if (!preorderId) throw new Response("No preorder id provided", { status: 404 });
	const { data: preorder, isLoading: preorderIsLoading } = useGetPreorderQuery({ preorderId });

	const [searchParams] = useSearchParams();
	const productIds = useMemo(() => searchParams.getAll("productId[]"), [searchParams]);

	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const { data: productList, isLoading: productListIsLoading } = useGetProductListQuery({ filter: undefined });
	const { data: maxRating } = useGetMaxRatingQuery();

	const [createPublication, { isSuccess, isLoading, isError, error }] = useCreatePublicationMutation();

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	const showLoadingOverlay = isLoading;

	useMutationFeedback({
		title: "Создание публикации",
		isSuccess,
		isError,
		error,
		feedbackFn: showSnackbarMessage,
		successAction: () => {
			setTimeout(() => navigate(`/preorder/inspect/${preorderId}`), 1500);
		},
	});

	return (
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={1500} onClose={closeSnackbar} message={snackbarMessage} />

			<LoadingSpinner isLoading={preorderIsLoading}>
				{!preorder ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
						<div className="p-2">
							<Typography variant="h5">Публикация товара в предзаказ {preorder.title}</Typography>
						</div>
						{categoryListIsLoading || productListIsLoading ? (
							<div className="w-100 h-100 ai-c d-f jc-c">
								<CircularProgress />
							</div>
						) : (
							<PublicationCreatePreorderForm
								preorderId={preorder.id}
								productIds={productIds}
								productList={productList}
								productListIsLoading={productListIsLoading}
								categoryList={categoryList}
								categoryListIsLoading={categoryListIsLoading}
								onSubmit={createPublication}
								maxRating={maxRating?.rating}
							/>
						)}
					</div>
				)}
			</LoadingSpinner>
		</>
	);
}
