import { Button, CircularProgress, Modal, Snackbar, Typography } from "@mui/material";
import {
	useDeleteCatalogItemMutation,
	useDeletePublicationMutation,
	useGetPublicationQuery,
	useUpdateCatalogItemMutation,
	useUpdatePublicationMutation,
} from "@api/admin/publication";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CatalogItemUpdateSchema } from "@schemas/CatalogItem";
import { ChevronLeft } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { PublicationStockEditableHeader } from "./PublicationEditableHeader";
import { VariationStockEditableCard } from "./VariationStockEditableCard";
import { z } from "zod";

export default function PublicationInspect() {
	const navigate = useNavigate();
	const params = useParams();
	const publicationId = params.id;
	if (!publicationId) {
		throw new Response("No publication id provided", { status: 404 });
	}

	const {
		data: publication,
		isLoading: publicationIsLoading,
		isError: publicationGetIsError,
		error: publicationGetError,
	} = useGetPublicationQuery({ publicationId });

	useEffect(() => {
		if (publicationGetIsError && publicationGetError) {
			console.log(publicationGetError);
		}
	}, [publicationGetIsError, publicationGetError]);

	const [
		updatePublication,
		{
			isLoading: updatePublicationIsLoading,
			isSuccess: updatePublicationIsSuccess,
			isError: updatePublicationIsError,
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
		{ isLoading: updateVariationIsLoading, isSuccess: updateVariationIsSuccess, isError: updateVariationIsError },
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

	const [snackbarOpened, setSnackbarOpened] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>("");

	const showSnackbarMessage = (message: string) => {
		setSnackbarMessage(message);
		setSnackbarOpened(true);
	};

	useEffect(() => {
		if (updatePublicationIsSuccess) {
			showSnackbarMessage("Публикация успешно обновлена");
		}
	}, [updatePublicationIsSuccess]);

	useEffect(() => {
		if (updatePublicationIsError) {
			showSnackbarMessage("Произошла ошибка при обновлении публикации");
		}
	}, [updatePublicationIsError]);

	useEffect(() => {
		if (deletePublicationIsSuccess) {
			showSnackbarMessage("Публикация успешно удалена");
			setSnackbarOpened(true);
		}
	}, [deletePublicationIsSuccess]);

	useEffect(() => {
		if (deletePublicationIsError) {
			showSnackbarMessage("Произошла ошибка при удалении публикации");
			if (deletePublicationError) {
				console.log(deletePublicationError);
			}
		}
	}, [deletePublicationIsError, deletePublicationError]);

	useEffect(() => {
		if (updateVariationIsSuccess) {
			showSnackbarMessage("Вариация успешно обновлена");
		}
	}, [updateVariationIsSuccess]);

	useEffect(() => {
		if (updateVariationIsError) {
			showSnackbarMessage("Произошла ошибка при обновлении вариации");
		}
	}, [updateVariationIsError]);

	useEffect(() => {
		if (deleteVariationIsSuccess) {
			showSnackbarMessage("Вариация успешно удалена");
			setSnackbarOpened(true);
		}
	}, [deleteVariationIsSuccess]);

	useEffect(() => {
		if (deleteVariationIsError) {
			if (deleteVariationError) {
				console.log(deleteVariationError);
			}
			showSnackbarMessage("Произошла ошибка при удалении вариации");
		}
	}, [deleteVariationIsError, deleteVariationError]);

	const showLoadingOverlay =
		updatePublicationIsLoading ||
		deletePublicationIsLoading ||
		updateVariationIsLoading ||
		deleteVariationIsLoading;

	const handleUpdateVariation = (data: z.infer<typeof CatalogItemUpdateSchema>) => {
		updateVariation({ publicationId: publicationId, data: data });
	};

	const handleDeleteVariation = ({ variationId }: { variationId: string }) => {
		deleteVariation({ publicationId: publicationId, variationId: variationId });
	};

	return (
		<>
			<Snackbar
				open={snackbarOpened}
				autoHideDuration={2000}
				onClose={() => setSnackbarOpened(false)}
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
				<div className="p-2">
					<Typography variant="h5">Публикация {publication?.link || ""}</Typography>
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
								onDelete={deletePublication}
							/>
							{publication.items.map((variation) => (
								<VariationStockEditableCard
									key={variation.id}
									variation={variation}
									onUpdate={handleUpdateVariation}
									onDelete={handleDeleteVariation}
								/>
							))}
						</>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
