import { Add, ChevronLeft, OpenInNew } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Modal, Snackbar, Tooltip, Typography } from "@mui/material";
import {
	useActivateCatalogItemMutation,
	useAddVariationMutation,
	useDeactivateCatalogItemMutation,
	useDeleteCatalogItemMutation,
	useDeletePublicationMutation,
	useGetMaxRatingQuery,
	useGetPublicationQuery,
	useUpdateCatalogItemMutation,
	useUpdatePublicationMutation,
} from "@api/admin/publication";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CatalogItemUpdateSchema } from "@schemas/CatalogItem";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { PublicationEditableHeader } from "./PublicationEditableHeader";
import { VariationAddPreorderForm } from "./VariationAddPreorderForm";
import { VariationAddStockForm } from "./VariationAddStockForm";
import { VariationPreorderEditableCard } from "./VariationPreorderEditableCard";
import { VariationStockEditableCard } from "./VariationStockEditableCard";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";
import { z } from "zod";

export default function PublicationInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const publicationId = params.id;
	if (!publicationId) {
		throw new Response("No publication id provided", { status: 404 });
	}

	const { data: publication, isLoading: publicationIsLoading } = useGetPublicationQuery({ publicationId });
	const { data: maxRating } = useGetMaxRatingQuery();

	const [
		updatePublication,
		{
			isLoading: updatePublicationIsLoading,
			isSuccess: updatePublicationIsSuccess,
			isError: updatePublicationIsError,
			error: updatePublicationError,
		},
	] = useUpdatePublicationMutation();
	const [
		deletePublication,
		{
			isLoading: deletePublicationIsLoading,
			isSuccess: deletePublicationIsSuccess,
			isError: deletePublicationIsError,
			error: deletePublicationError,
		},
	] = useDeletePublicationMutation();

	const [
		addVariation,
		{
			isLoading: addVariationIsLoading,
			isSuccess: addVariationIsSuccess,
			isError: addVariationIsError,
			error: addVariationError,
		},
	] = useAddVariationMutation();
	const [
		updateVariation,
		{
			isLoading: updateVariationIsLoading,
			isSuccess: updateVariationIsSuccess,
			isError: updateVariationIsError,
			error: updateVariationError,
		},
	] = useUpdateCatalogItemMutation();
	const [
		deleteVariation,
		{
			isLoading: deleteVariationIsLoading,
			isSuccess: deleteVariationIsSuccess,
			isError: deleteVariationIsError,
			error: deleteVariationError,
		},
	] = useDeleteCatalogItemMutation();
	const [
		activateVariation,
		{
			isLoading: activateVariationIsLoading,
			isSuccess: activateVariationIsSuccess,
			isError: activateVariationIsError,
			error: activateVariationError,
		},
	] = useActivateCatalogItemMutation();

	const [
		deactivateVariation,
		{
			isLoading: deactivateVariationIsLoading,
			isSuccess: deactivateVariationIsSuccess,
			isError: deactivateVariationIsError,
			error: deactivateVariationError,
		},
	] = useDeactivateCatalogItemMutation();

	const [addVariationModalOpened, setAddVariationModalOpened] = useState(false);
	const closeAddVariationModal = useCallback(() => {
		setAddVariationModalOpened(false);
	}, []);

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useMutationFeedback({
		title: "Обновление публикации",
		isSuccess: updatePublicationIsSuccess,
		isError: updatePublicationIsError,
		error: updatePublicationError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Удаление публикации",
		isSuccess: deletePublicationIsSuccess,
		isError: deletePublicationIsError,
		error: deletePublicationError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Добавление вариации",
		isSuccess: addVariationIsSuccess,
		isError: addVariationIsError,
		error: addVariationError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Обновление вариации",
		isSuccess: updateVariationIsSuccess,
		isError: updateVariationIsError,
		error: updateVariationError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Удаление вариации",
		isSuccess: deleteVariationIsSuccess,
		isError: deleteVariationIsError,
		error: deleteVariationError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Активация вариации",
		isSuccess: activateVariationIsSuccess,
		isError: activateVariationIsError,
		error: activateVariationError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Деактивация вариации",
		isSuccess: deactivateVariationIsSuccess,
		isError: deactivateVariationIsError,
		error: deactivateVariationError,
		feedbackFn: showSnackbarMessage,
	});

	const showLoadingOverlay =
		updatePublicationIsLoading ||
		deletePublicationIsLoading ||
		addVariationIsLoading ||
		updateVariationIsLoading ||
		deleteVariationIsLoading ||
		activateVariationIsLoading ||
		deactivateVariationIsLoading;

	const handleUpdateVariation = (data: z.infer<typeof CatalogItemUpdateSchema>) => {
		updateVariation({ publicationId: publicationId, data: data });
	};

	const handleDeleteVariation = ({ variationId }: { variationId: string }) => {
		deleteVariation({ publicationId: publicationId, variationId: variationId });
	};

	const handleActivateVariation = ({ variationId }: { variationId: string }) => {
		activateVariation({ publicationId: publicationId, variationId: variationId });
	};

	const handleDeactivateVariation = ({ variationId }: { variationId: string }) => {
		deactivateVariation({ publicationId: publicationId, variationId: variationId });
	};

	return (
		<>
			<Snackbar
				open={snackbarOpened}
				autoHideDuration={2000}
				onClose={() => closeSnackbar()}
				message={snackbarMessage}
			/>
			<Modal open={showLoadingOverlay}>
				<div className="w-100v h-100v ai-c d-f jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
					<CircularProgress />
				</div>
			</Modal>
			<Modal open={addVariationModalOpened} onClose={closeAddVariationModal}>
				{!publication ? (
					<div className="w-100v h-100v ai-c d-f jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
						<CircularProgress />
					</div>
				) : publication.preorder === null ? (
					<div className="bg-primary p-2 w-max h-max ai-c d-f jc-c">
						<VariationAddStockForm
							onSubmit={(data) => addVariation({ publicationId: publicationId, data })}
							onClose={closeAddVariationModal}
							categoryId={publication.items.at(0)?.product.category.id || ""}
							selectedProducts={publication.items.map((item) => item.product)}
							maxRating={maxRating?.rating ?? 0}
						/>
					</div>
				) : (
					<div className="bg-primary p-2 w-max h-max ai-c d-f jc-c">
						<VariationAddPreorderForm
							onSubmit={(data) => addVariation({ publicationId: publicationId, data })}
							onClose={closeAddVariationModal}
							categoryId={publication.items.at(0)?.product.category.id || ""}
							selectedProducts={publication.items.map((item) => item.product)}
							maxRating={maxRating?.rating ?? 0}
						/>
					</div>
				)}
			</Modal>
			<div className="gap-2 px-3 py-4 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
				<Button onClick={() => navigate(-1)} sx={{ color: "warning.main", width: "fit-content" }}>
					<ChevronLeft />
					Назад
				</Button>
				<div className="gap-2 p-2 d-f fd-r">
					<Typography variant="h5">Публикация {publication?.link || ""}</Typography>
					<Tooltip title="Открыть в браузере">
						<IconButton
							onClick={() => window.open(`https://simplegeek.ru/item/${publication?.link}`, "_blank")}
						>
							<OpenInNew />
						</IconButton>
					</Tooltip>
				</div>

				<LoadingSpinner isLoading={publicationIsLoading}>
					{!publication ? (
						<div className="w-100 h-100v ai-c d-f jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<>
							<PublicationEditableHeader
								publication={publication}
								onUpdate={updatePublication}
								updateSuccess={updatePublicationIsSuccess}
								onDelete={deletePublication}
							/>
							{publication.preorder === null
								? publication.items.map((variation) => (
										<VariationStockEditableCard
											key={variation.id}
											variation={variation}
											onUpdate={handleUpdateVariation}
											updateSuccess={updateVariationIsSuccess}
											updateError={updateVariationIsError}
											onDelete={handleDeleteVariation}
											onActivate={handleActivateVariation}
											onDeactivate={handleDeactivateVariation}
											maxRating={maxRating?.rating}
										/>
								  ))
								: publication.items.map((variation) => (
										<VariationPreorderEditableCard
											key={variation.id}
											variation={variation}
											onUpdate={handleUpdateVariation}
											updateSuccess={updateVariationIsSuccess}
											updateError={updateVariationIsError}
											onDelete={handleDeleteVariation}
											onActivate={handleActivateVariation}
											onDeactivate={handleDeactivateVariation}
											maxRating={maxRating?.rating}
										/>
								  ))}
							<IconButton onClick={() => setAddVariationModalOpened(true)}>
								<Add />
							</IconButton>
						</>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
