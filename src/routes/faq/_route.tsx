import { Button, Snackbar, Typography } from "@mui/material";
import { FAQItemCreateForm, FAQItemUpdateForm, FaqItemCreateFormData, FaqItemUpdateFormData } from "./forms";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCreateFAQItemMutation, useDeleteFAQItemsMutation, useGetFAQItemsTableQuery } from "@api/admin/service";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "../table";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "../managementModal";
import { useState } from "react";

const columns: GridColDef[] = [
	{ field: "question", headerName: "Вопрос" },
	{ field: "answer", headerName: "Ответ" },
];

export default function Faq() {
	const { data: FAQItemList, isLoading: FAQItemListIsLoading } = useGetFAQItemsTableQuery();
	const [createFAQItem] = useCreateFAQItemMutation();
	const [updateFAQItem] = useCreateFAQItemMutation();
	const [deleteFAQItems] = useDeleteFAQItemsMutation();

	const [deletionDialogOpened, setDeletionDialogOpened] = useState<boolean>(false);
	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const [updateModalOpened, setUpdateModalOpened] = useState<boolean>(false);
	const [successSnackBarOpened, setSuccessSnackBarOpened] = useState<boolean>(false);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const handleCreateFAQItem = async (data: FaqItemCreateFormData) => {
		console.log("Submitting FaqItemCreate, data:", data);
		const response = await createFAQItem(data);
		console.log("FaqItemCreate response:", response);
		setSuccessSnackBarOpened(true);
		setCreateModalOpened(false);
	};

	const handleUpdateFAQItem = (data: FaqItemUpdateFormData) => {
		console.log("Submitting FaqItemUpdate, data:", data);
		const response = updateFAQItem(data);
		console.log("FaqItemUpdate response:", response);
		setSuccessSnackBarOpened(true);
		setUpdateModalOpened(false);
	};

	const handleDeleteFaqItems = async () => {
		console.log("Submitting FaqItemsDelete, ids:", selectedItemIds);
		const response = await deleteFAQItems(selectedItemIds.map(String));
		console.log("FaqItemsDelete response:", response);
		setSuccessSnackBarOpened(true);
		setDeletionDialogOpened(false);
	};

	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
			<Snackbar
				open={successSnackBarOpened}
				autoHideDuration={4000}
				onClose={() => setSuccessSnackBarOpened(false)}
				message="Изменения сохранены"
			/>
			<ManagementModal
				title="Создать вопрос"
				opened={createModalOpened}
				onClose={() => setCreateModalOpened(false)}
			>
				<FAQItemCreateForm onSubmit={handleCreateFAQItem} />
			</ManagementModal>
			<ManagementModal
				title="Редактировать вопрос"
				opened={updateModalOpened}
				onClose={() => setUpdateModalOpened(false)}
			>
				<FAQItemUpdateForm
					itemToUpdate={FAQItemList?.items.find((item) => item.id === selectedItemIds.at(0))}
					onSubmit={handleUpdateFAQItem}
				/>
			</ManagementModal>
			<ActionDialog
				title="Удалить выбранные вопросы?"
				helperText="После удаления отменить действие будет невозможно"
				opened={deletionDialogOpened}
				onClose={() => setDeletionDialogOpened(false)}
				confirmButton={{
					text: "Удалить",
					onClick: handleDeleteFaqItems,
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
