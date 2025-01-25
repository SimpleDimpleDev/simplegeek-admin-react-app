import "react-image-crop/dist/ReactCrop.css";

import { Button, Divider, Snackbar, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import {
	useChangeImageCategoryMutation,
	useCreateCategoryMutation,
	useGetCategoryListQuery,
	useUpdateCategoryMutation,
} from "@api/admin/category";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import { CategoryChangeImageForm } from "./ChangeImageForm";
import { CategoryCreateForm } from "./CreateForm";
import { CategoryGet } from "@appTypes/Category";
import { CategoryUpdateForm } from "./UpdateForm";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "../../components/ManagementModal";
import ManagementTable from "../../components/ManagementTable";
import { getImageUrl } from "@utils/image";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

// TODO: category isActive
const columns: GridColDef<CategoryGet>[] = [
	{
		field: "title",
		headerName: "Название",
		display: "flex",
		renderCell: (params) => (
			<div className="gap-1 ai-c d-f fd-r">
				<div style={{ height: 40, width: 40, borderRadius: 6, overflow: "hidden" }}>
					<img src={getImageUrl(params.row.icon.url, "small")} className="contain" />
				</div>
				{params.row.title}
			</div>
		),
	},
	{ field: "link", headerName: "Ссылка", display: "flex" },
	{ field: "createdAt", headerName: "Создан", display: "flex", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", display: "flex", type: "dateTime" },
];

export default function CategoryRoute() {
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const [
		createCategory,
		{ isLoading: createIsLoading, isSuccess: createSuccess, isError: createIsError, error: createError },
	] = useCreateCategoryMutation();
	const [
		updateCategory,
		{ isLoading: updateIsLoading, isSuccess: updateSuccess, isError: updateIsError, error: updateError },
	] = useUpdateCategoryMutation();
	const [
		changeImageCategory,
		{
			isLoading: changeImageIsLoading,
			isSuccess: changeImageSuccess,
			isError: changeImageIsError,
			error: changeImageError,
		},
	] = useChangeImageCategoryMutation();

	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const closeCreateModal = useCallback(() => {
		setCreateModalOpened(false);
	}, []);

	const [updateModalOpened, setUpdateModalOpened] = useState<boolean>(false);
	const closeUpdateModal = useCallback(() => {
		setUpdateModalOpened(false);
	}, []);

	const [deletionDialogOpened, setDeletionDialogOpened] = useState<boolean>(false);
	const closeDeletionDialog = useCallback(() => {
		setDeletionDialogOpened(false);
	}, []);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedCategory = useMemo(() => {
		if (!categoryList) return null;
		return categoryList.items.find((category) => category.id === selectedItemIds[0]);
	}, [categoryList, selectedItemIds]);

	const showLoadingOverlay = useMemo(() => {
		return createIsLoading || updateIsLoading || changeImageIsLoading;
	}, [createIsLoading, updateIsLoading, changeImageIsLoading]);

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useMutationFeedback({
		title: "Создание категории",
		isSuccess: createSuccess,
		isError: createIsError,
		error: createError,
		feedbackFn: showSnackbarMessage,
		successAction: closeCreateModal,
	});

	useMutationFeedback({
		title: "Обновление категории",
		isSuccess: updateSuccess,
		isError: updateIsError,
		error: updateError,
		feedbackFn: showSnackbarMessage,
		successAction: closeUpdateModal,
	});

	useMutationFeedback({
		title: "Изменение картинки категории",
		isSuccess: changeImageSuccess,
		isError: changeImageIsError,
		error: changeImageError,
		feedbackFn: showSnackbarMessage,
		successAction: closeUpdateModal,
	});

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={2000} onClose={closeSnackbar} message={snackbarMessage} />
			<ManagementModal title="Создать категорию" opened={createModalOpened} onClose={closeCreateModal}>
				<CategoryCreateForm onSubmit={createCategory} />
			</ManagementModal>
			<ManagementModal title="Изменить категорию" opened={updateModalOpened} onClose={closeUpdateModal}>
				<LoadingSpinner isLoading={categoryListIsLoading}>
					{!selectedCategory ? (
						<Typography variant="h6">Что-то пошло не так</Typography>
					) : (
						<>
							<CategoryUpdateForm category={selectedCategory} onSubmit={updateCategory} />
							<Divider />
							<CategoryChangeImageForm
								imageType="ICON"
								category={selectedCategory}
								onSubmit={changeImageCategory}
							/>
							<Divider />
							<CategoryChangeImageForm
								imageType="BANNER"
								category={selectedCategory}
								onSubmit={changeImageCategory}
							/>
						</>
					)}
				</LoadingSpinner>
			</ManagementModal>
			<ActionDialog
				title="Удалить выбранные категории?"
				helperText="После удаления отменить действие будет невозможно"
				opened={deletionDialogOpened}
				onClose={closeDeletionDialog}
				confirmButton={{
					text: "Удалить",
					onClick: () => console.log("Submit deletion", selectedItemIds),
				}}
				declineButton={{
					text: "Отмена",
				}}
			/>
			<div className="p-2 d-f fd-r jc-sb">
				<div>
					<Typography variant="h5">Категории</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {categoryList?.items.length || 0}
					</Typography>
				</div>
				<Button variant="contained" onClick={() => setCreateModalOpened(true)}>
					<Add />
					Добавить категорию
				</Button>
			</div>
			<LoadingSpinner isLoading={categoryListIsLoading}>
				{!categoryList ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<ManagementTable
						columns={columns}
						data={categoryList.items}
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
