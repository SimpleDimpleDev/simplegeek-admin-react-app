import "react-image-crop/dist/ReactCrop.css";

import { Button, CircularProgress, Divider, Modal, Snackbar, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
	useChangeImageCategoryMutation,
	useCreateCategoryMutation,
	useGetCategoryListQuery,
	useUpdateCategoryMutation,
} from "@api/admin/category";
import { useEffect, useMemo, useState } from "react";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "../table";
import { CategoryChangeImageForm } from "./ChangeImageForm";
import { CategoryCreateForm } from "./CreateForm";
import { CategoryGet } from "@appTypes/Category";
import { CategoryUpdateForm } from "./UpdateForm";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "../managementModal";
import { getImageUrl } from "@utils/image";

const columns: GridColDef<CategoryGet>[] = [
	{
		field: "title",
		headerName: "Название",
		renderCell: (params) => (
			<div className="d-f fd-r gap-1 ai-c">
				<div style={{ height: 40, width: 40, borderRadius: 6, overflow: "hidden" }}>
					<img src={getImageUrl(params.row.icon.url, "small")} className="contain" />
				</div>
				{params.row.title}
			</div>
		),
	},
	{ field: "link", headerName: "Ссылка" },
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
];

export default function Category() {
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const [createCategory, { isLoading: createIsLoading, isSuccess: createSuccess, error: createError }] =
		useCreateCategoryMutation();
	const [updateCategory, { isLoading: updateIsLoading, isSuccess: updateSuccess, error: updateError }] =
		useUpdateCategoryMutation();
	const [
		changeImageCategory,
		{ isLoading: changeImageIsLoading, isSuccess: changeImageSuccess, error: changeImageError },
	] = useChangeImageCategoryMutation();

	const [deletionDialogOpened, setDeletionDialogOpened] = useState<boolean>(false);
	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const [updateModalOpened, setUpdateModalOpened] = useState<boolean>(false);

	const [createSuccessSnackBarOpened, setCreateSuccessSnackBarOpened] = useState<boolean>(false);
	const [createErrorSnackBarOpened, setCreateErrorSnackBarOpened] = useState<boolean>(false);

	const [updateSuccessSnackBarOpened, setUpdateSuccessSnackBarOpened] = useState<boolean>(false);
	const [updateErrorSnackBarOpened, setUpdateErrorSnackBarOpened] = useState<boolean>(false);

	const [changeImageSuccessSnackBarOpened, setChangeImageSuccessSnackBarOpened] = useState<boolean>(false);
	const [changeImageErrorSnackBarOpened, setChangeImageErrorSnackBarOpened] = useState<boolean>(false);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedCategory = useMemo(() => {
		if (!categoryList) return null;
		return categoryList.items.find((category) => category.id === selectedItemIds[0]);
	}, [categoryList, selectedItemIds]);

	const showLoadingOverlay = useMemo(() => {
		return createIsLoading || updateIsLoading || changeImageIsLoading;
	}, [createIsLoading, updateIsLoading, changeImageIsLoading]);

	useEffect(() => {
		if (createSuccess) {
			setCreateSuccessSnackBarOpened(true);
			setCreateModalOpened(false);
		}
	}, [createSuccess]);

	useEffect(() => {
		if (createError) {
			setCreateErrorSnackBarOpened(true);
			setCreateModalOpened(false);
		}
	}, [createError]);

	useEffect(() => {
		if (updateSuccess) {
			setUpdateSuccessSnackBarOpened(true);
			setUpdateModalOpened(false);
		}
	}, [updateSuccess]);

	useEffect(() => {
		if (updateError) {
			setUpdateErrorSnackBarOpened(true);
			setUpdateModalOpened(false);
		}
	}, [updateError]);

	useEffect(() => {
		if (changeImageSuccess) {
			setChangeImageSuccessSnackBarOpened(true);
			setUpdateModalOpened(false);
		}
	}, [changeImageSuccess]);

	useEffect(() => {
		if (changeImageError) {
			setChangeImageErrorSnackBarOpened(true);
			setUpdateModalOpened(false);
		}
	}, [changeImageError]);

	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
			<Modal open={showLoadingOverlay}>
				<div className="w-100v h-100v d-f ai-c jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
					<CircularProgress />
				</div>
			</Modal>
			<Snackbar
				open={createSuccessSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setCreateSuccessSnackBarOpened(false)}
				message="Категория успешно создана"
			/>
			<Snackbar
				open={createErrorSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setCreateErrorSnackBarOpened(false)}
				message="Произошла ошибка при создании категории"
			/>

			<Snackbar
				open={updateSuccessSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setUpdateSuccessSnackBarOpened(false)}
				message="Категория успешно обновлена"
			/>
			<Snackbar
				open={updateErrorSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setUpdateErrorSnackBarOpened(false)}
				message="Произошла ошибка при обновлении категории"
			/>

			<Snackbar
				open={changeImageSuccessSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setChangeImageSuccessSnackBarOpened(false)}
				message="Картинка категории успешно обновлена"
			/>
			<Snackbar
				open={changeImageErrorSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setChangeImageErrorSnackBarOpened(false)}
				message="Произошла ошибка при обновлении картинки категории"
			/>

			<ManagementModal
				title="Создать категорию"
				opened={createModalOpened}
				onClose={() => setCreateModalOpened(false)}
			>
				<CategoryCreateForm onSubmit={createCategory} />
			</ManagementModal>
			<ManagementModal
				title="Изменить категорию"
				opened={updateModalOpened}
				onClose={() => setUpdateModalOpened(false)}
			>
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
					<div className="w-100 h-100v d-f ai-c jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
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
