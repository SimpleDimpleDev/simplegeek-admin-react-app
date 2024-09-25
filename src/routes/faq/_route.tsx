import { Button, Snackbar, Typography } from "@mui/material";
import { FAQItemCreateForm, FAQItemUpdateForm } from "./forms";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCreateFAQItemMutation, useDeleteFAQItemsMutation, useGetFAQItemListQuery } from "@api/admin/faqItem";
import { useEffect, useMemo, useState } from "react";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "../table";
import { FAQItemGet } from "@appTypes/FAQ";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "../managementModal";

const columns: GridColDef<FAQItemGet>[] = [
	{ field: "question", headerName: "Вопрос" },
	{ field: "answer", headerName: "Ответ" },
];

export default function Faq() {
	const { data: FAQItemList, isLoading: FAQItemListIsLoading } = useGetFAQItemListQuery();
	const [createFAQItem, { isLoading: createIsLoading, isSuccess: createSuccess, error: createError }] = useCreateFAQItemMutation();
	const [updateFAQItem, { isLoading: updateIsLoading, isSuccess: updateSuccess, error: updateError }] = useCreateFAQItemMutation();
	const [deleteFAQItems, { isLoading: deleteIsLoading, isSuccess: deleteSuccess, error: deleteError }] = useDeleteFAQItemsMutation();

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const [updateModalOpened, setUpdateModalOpened] = useState<boolean>(false);
	const [deletionDialogOpened, setDeletionDialogOpened] = useState<boolean>(false);

	const [snackbarOpened, setSnackbarOpened] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>("");

	const showLoadingOverlay = useMemo(() => {
		return createIsLoading || updateIsLoading || deleteIsLoading;
	}, [createIsLoading, updateIsLoading, deleteIsLoading]);

	const showSnackbarMessage = (message: string) => {
		setSnackbarMessage(message);
		setSnackbarOpened(true);
	}

	useEffect(() => {
		if (createSuccess) {
			showSnackbarMessage("Вопрос успешно создан");
		}
	}, [createSuccess]);

	useEffect(() => {
		if (createError) {
			showSnackbarMessage("Произошла ошибка при создании вопроса");
		}
	}, [createError]);

	useEffect(() => {
		if (updateSuccess) {
			showSnackbarMessage("Вопрос успешно обновлен");
		}
	}, [updateSuccess]);

	useEffect(() => {
		if (updateError) {
			showSnackbarMessage("Произошла ошибка при обновлении вопроса");
		}
	}, [updateError]);

	useEffect(() => {
		if (deleteSuccess) {
			showSnackbarMessage("Вопрос успешно удален");
		}
	}, [deleteSuccess]);

	useEffect(() => {
		if (deleteError) {
			showSnackbarMessage("Произошла ошибка при удалении вопроса");
		}
	}, [deleteError]);

	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar
				open={snackbarOpened}
				autoHideDuration={2000}
				onClose={() => setSnackbarOpened(false)}
				message={snackbarMessage}
			/>
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
			<div className="d-f fd-r jc-sb p-2">
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
					<div className="w-100 h-100v d-f ai-c jc-c">
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
