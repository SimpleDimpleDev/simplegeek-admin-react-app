import { Button, Snackbar, Typography } from "@mui/material";
import { FAQItemCreateForm, FAQItemUpdateForm } from "./forms";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCreateFAQItemMutation, useDeleteFAQItemsMutation, useGetFAQItemListQuery } from "@api/admin/faqItem";
import { useMemo, useState } from "react";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "../../components/ManagementTable";
import { FAQItemGet } from "@appTypes/FAQ";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "../../components/ManagementModal";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

const columns: GridColDef<FAQItemGet>[] = [
	{ field: "question", headerName: "Вопрос" },
	{ field: "answer", headerName: "Ответ" },
];

export default function FaqRoute() {
	const { data: FAQItemList, isLoading: FAQItemListIsLoading } = useGetFAQItemListQuery();
	const [
		createFAQItem,
		{ isLoading: createIsLoading, isSuccess: createSuccess, isError: createIsError, error: createError },
	] = useCreateFAQItemMutation();
	const [
		updateFAQItem,
		{ isLoading: updateIsLoading, isSuccess: updateSuccess, isError: updateIsError, error: updateError },
	] = useCreateFAQItemMutation();
	const [
		deleteFAQItems,
		{ isLoading: deleteIsLoading, isSuccess: deleteSuccess, isError: deleteIsError, error: deleteError },
	] = useDeleteFAQItemsMutation();

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const [updateModalOpened, setUpdateModalOpened] = useState<boolean>(false);
	const [deletionDialogOpened, setDeletionDialogOpened] = useState<boolean>(false);

	const showLoadingOverlay = useMemo(() => {
		return createIsLoading || updateIsLoading || deleteIsLoading;
	}, [createIsLoading, updateIsLoading, deleteIsLoading]);

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useMutationFeedback({
		title: "Создание вопроса",
		isSuccess: createSuccess,
		isError: createIsError,
		error: createError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Обновление вопроса",
		isSuccess: updateSuccess,
		isError: updateIsError,
		error: updateError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Удаление вопроса",
		isSuccess: deleteSuccess,
		isError: deleteIsError,
		error: deleteError,
		feedbackFn: showSnackbarMessage,
	});

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={2000} onClose={closeSnackbar} message={snackbarMessage} />
			<ManagementModal
				title="Создать вопрос"
				opened={createModalOpened}
				onClose={() => setCreateModalOpened(false)}
			>
				<FAQItemCreateForm onSubmit={createFAQItem} />
			</ManagementModal>
			<ManagementModal
				title="Редактировать вопрос"
				opened={updateModalOpened}
				onClose={() => setUpdateModalOpened(false)}
			>
				<FAQItemUpdateForm
					itemToUpdate={FAQItemList?.items.find((item) => item.id === selectedItemIds.at(0))}
					onSubmit={updateFAQItem}
				/>
			</ManagementModal>
			<ActionDialog
				title="Удалить выбранные вопросы?"
				helperText="После удаления отменить действие будет невозможно"
				opened={deletionDialogOpened}
				onClose={() => setDeletionDialogOpened(false)}
				confirmButton={{
					text: "Удалить",
					onClick: () => deleteFAQItems(selectedItemIds.map(String)),
				}}
				declineButton={{
					text: "Отмена",
				}}
			/>
			<div className="p-2 d-f fd-r jc-sb">
				<div>
					<Typography variant="h5">FAQ</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {FAQItemList?.items.length}
					</Typography>
				</div>
				<Button variant="contained" onClick={() => setCreateModalOpened(true)}>
					<Add />
					Добавить вопрос
				</Button>
			</div>
			<LoadingSpinner isLoading={FAQItemListIsLoading}>
				{!FAQItemList ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={columns}
						data={FAQItemList.items}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
						headerButtons={
							<>
								<Button
									variant="contained"
									disabled={!selectedItemIds.length}
									onClick={() => setDeletionDialogOpened(true)}
								>
									Удалить
								</Button>
								<Button
									variant="contained"
									disabled={!selectedItemIds.length || selectedItemIds.length > 1}
									onClick={() => setUpdateModalOpened(true)}
								>
									Редактировать
								</Button>
							</>
						}
					/>
				)}
			</LoadingSpinner>
		</div>
	);
}
