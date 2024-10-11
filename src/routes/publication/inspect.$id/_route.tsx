import { Button, CircularProgress, IconButton, Modal, Snackbar, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, OpenInNew } from "@mui/icons-material";
import {
	useActivateCatalogItemMutation,
	useDeactivateCatalogItemMutation,
	useDeleteCatalogItemMutation,
	useDeletePublicationMutation,
	useGetPublicationQuery,
	useUpdateCatalogItemMutation,
	useUpdatePublicationMutation,
} from "@api/admin/publication";
import { useNavigate, useParams } from "react-router-dom";

import { CatalogItemUpdateSchema } from "@schemas/CatalogItem";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { PublicationStockEditableHeader } from "./PublicationStockEditableHeader";
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
			<div className="gap-2 px-3 py-4 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
				<Button onClick={() => navigate(-1)} sx={{ color: "warning.main", width: "fit-content" }}>
					<ChevronLeft />
					Назад
				</Button>
				<div className="gap-2 p-2 d-f fd-r">
					<Typography variant="h5">Публикация {publication?.link || ""}</Typography>
					<Tooltip title="Открыть в браузере">
						<IconButton onClick={() => window.open(`https://simplegeek.ru/item/${publication?.link}`, "_blank")}>
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
							<PublicationStockEditableHeader
								publication={publication}
								onUpdate={updatePublication}
								updateSuccess={updatePublicationIsSuccess}
								onDelete={deletePublication}
							/>
							{publication.items.map((variation) => (
								<VariationStockEditableCard
									key={variation.id}
									variation={variation}
									onUpdate={handleUpdateVariation}
									updateSuccess={updateVariationIsSuccess}
									updateError={updateVariationIsError}
									onDelete={handleDeleteVariation}
									onActivate={handleActivateVariation}
									onDeactivate={handleDeactivateVariation}
								/>
							))}
						</>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
