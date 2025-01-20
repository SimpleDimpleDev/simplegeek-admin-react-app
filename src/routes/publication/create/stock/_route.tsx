import {
	Snackbar,
	Typography,
} from "@mui/material";
import { useCreatePublicationMutation, useGetMaxRatingQuery } from "@api/admin/publication";
import { useNavigate, useSearchParams } from "react-router-dom";

import { LoadingOverlay } from "@components/LoadingOverlay";
import { PublicationCreateStockForm } from "./form";
import { useGetCategoryListQuery } from "@api/admin/category";
import { useGetProductListQuery } from "@api/admin/product";
import { useMemo } from "react";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

export default function PublicationCreateStockRoute() {
	const navigate = useNavigate();
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
			setTimeout(() => navigate("/publication/table"), 1500);
		},
	});

	return (
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={1500} onClose={closeSnackbar} message={snackbarMessage} />

			<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
				<div className="p-2">
					<Typography variant="h5">Публикация товара в розницу</Typography>
				</div>

				<PublicationCreateStockForm
					productList={productList}
					productListIsLoading={productListIsLoading}
					categoryList={categoryList}
					categoryListIsLoading={categoryListIsLoading}
					productIds={productIds}
					onSubmit={createPublication}
					maxRating={maxRating?.rating}
				/>
			</div>
		</>
	);
}
