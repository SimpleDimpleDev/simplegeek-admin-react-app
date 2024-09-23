import "react-image-crop/dist/ReactCrop.css";

import { Button, Snackbar, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCreateCategoryMutation, useGetCategoryListQuery } from "@api/admin/service";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "../table";
import { CategoryCreateForm } from "./createForm";
import { CategoryCreateSchema } from "@schemas/Category";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "../managementModal";
import { useState } from "react";
import { z } from "zod";

const columns: GridColDef[] = [
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
	{ field: "title", headerName: "Название" },
	{ field: "link", headerName: "Ссылка" },
];

export default function Category() {
	const { data, isLoading } = useGetCategoryListQuery();
	const [createCategory] = useCreateCategoryMutation();

	const [deletionDialogOpened, setDeletionDialogOpened] = useState<boolean>(false);
	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const [updateModalOpened, setUpdateModalOpened] = useState<boolean>(false);
	const [successSnackBarOpened, setSuccessSnackBarOpened] = useState<boolean>(false);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const handleCategoryCreate = async (data: z.infer<typeof CategoryCreateSchema>) => {
		const response = await createCategory(data);
		console.debug("CategoryCreate response:", response);
		setSuccessSnackBarOpened(true);
		setCreateModalOpened(false);
	};

	const handleCategoryUpdate = () => {
		throw new Error("Not implemented");
		setSuccessSnackBarOpened(true);
		setUpdateModalOpened(false);
	};

	// const handleDeleteFaqItems = async () => {
	//     console.log("Submitting FaqItemsDelete, ids:", selectedItemIds);
	//     const response = await adminApiClient.deleteFAQItems(selectedItemIds.map(String));
	//     console.log("FaqItemsDelete response:", response);
	//     revalidator.revalidate();
	//     setSuccessSnackBarOpened(true);
	//     setDeletionDialogOpened(false);
	// };

	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
			<Snackbar
				open={successSnackBarOpened}
				autoHideDuration={4000}
				onClose={() => setSuccessSnackBarOpened(false)}
				message="Изменения сохранены"
			/>
			<ManagementModal
				title="Создать категорию"
				opened={createModalOpened}
				onClose={() => setCreateModalOpened(false)}
			>
				<CategoryCreateForm onSubmit={handleCategoryCreate} />
			</ManagementModal>
			<ManagementModal
				title="Изменить категорию"
				opened={updateModalOpened}
				onClose={() => setUpdateModalOpened(false)}
			>
				<div>
					Not implemented
					<button onClick={handleCategoryUpdate}>Submit</button>
				</div>
			</ManagementModal>
			<ActionDialog
				title="Удалить выбранные категории?"
				helperText="После удаления отменить действие будет невозможно"
				opened={deletionDialogOpened}
				onClose={() => setDeletionDialogOpened(false)}
				confirmButton={{
					text: "Удалить",
					onClick: () => console.log("Submit deletion", selectedItemIds),
				}}
				declineButton={{
					text: "Отмена",
				}}
			/>
			<div className="d-f fd-r jc-sb p-2">
				<div>
					<Typography variant="h5">Категории</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {data?.items.length || 0}
					</Typography>
				</div>
				<Button variant="contained" onClick={() => setCreateModalOpened(true)}>
					<Add />
					Добавить категорию
				</Button>
			</div>
			<LoadingSpinner isLoading={isLoading}>
				{!data ? (
					<div className="w-100 h-100v d-f ai-c jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={columns}
						data={data.items}
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
