import { Button, CircularProgress, Modal, Snackbar, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
	useCreateFilterGroupMutation,
	useDeleteFilterGroupsMutation,
	useGetFilterGroupListQuery,
	useUpdateFilterGroupMutation,
} from "@api/admin/filterGroup";
import { useEffect, useMemo, useState } from "react";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "../table";
import { FilterGroupCreateForm } from "./CreateForm";
import { FilterGroupGet } from "@appTypes/Filters";
import { FilterGroupUpdateForm } from "./UpdateForm";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "../managementModal";
import { useLazyGetCategoryListQuery } from "@api/admin/category";

const columns: GridColDef<FilterGroupGet>[] = [
	{ field: "title", headerName: "Название" },
	{
		field: "category",
		headerName: "Категория",
		renderCell: (params) => params.row.category?.title || "Без привязки",
	},
	{ field: "values", headerName: "Значения" },
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
];

export default function Filter() {
	const { data: filterGroupList, isLoading: filterGroupListIsLoading } = useGetFilterGroupListQuery({
		categoryId: undefined,
	});
	const [fetchCategoryList, { data: categoryList, isLoading: categoryListIsLoading }] = useLazyGetCategoryListQuery();
	const [createFilterGroup, { isSuccess: createIsSuccess, isLoading: createIsLoading, isError: createIsError }] =
		useCreateFilterGroupMutation();
	const [updateFilterGroup, { isSuccess: updateIsSuccess, isLoading: updateIsLoading, isError: updateIsError }] =
		useUpdateFilterGroupMutation();
	const [
		deleteFilterGroups,
		{ isSuccess: deleteFilterGroupsIsSuccess, isLoading: deleteIsLoading, isError: deleteFilterGroupsIsError },
	] = useDeleteFilterGroupsMutation();

	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const [updateModalOpened, setUpdateModalOpened] = useState<boolean>(false);
	const [deletionDialogOpened, setDeletionDialogOpened] = useState<boolean>(false);

	const [createSuccessSnackBarOpened, setCreateSuccessSnackBarOpened] = useState<boolean>(false);
	const [updateSuccessSnackBarOpened, setUpdateSuccessSnackBarOpened] = useState<boolean>(false);
	const [deleteSuccessSnackBarOpened, setDeleteSuccessSnackBarOpened] = useState<boolean>(false);

	const [createErrorSnackBarOpened, setCreateErrorSnackBarOpened] = useState<boolean>(false);
	const [updateErrorSnackBarOpened, setUpdateErrorSnackBarOpened] = useState<boolean>(false);
	const [deleteErrorSnackBarOpened, setDeleteErrorSnackBarOpened] = useState<boolean>(false);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedFilterGroup = useMemo(() => {
		if (!filterGroupList) return null;
		return filterGroupList.items.find((filterGroup) => filterGroup.id === selectedItemIds[0]);
	}, [filterGroupList, selectedItemIds]);

	const showLoadingOverlay = createIsLoading || updateIsLoading || deleteIsLoading;

	useEffect(() => {
		if (createIsSuccess) {
			setCreateSuccessSnackBarOpened(true);
			setCreateModalOpened(false);
		}
	}, [createIsSuccess]);

	useEffect(() => {
		if (updateIsSuccess) {
			setUpdateSuccessSnackBarOpened(true);
			setUpdateModalOpened(false);
		}
	}, [updateIsSuccess]);

	useEffect(() => {
		if (deleteFilterGroupsIsSuccess) {
			setDeleteSuccessSnackBarOpened(true);
			setDeletionDialogOpened(false);
		}
	}, [deleteFilterGroupsIsSuccess]);

	useEffect(() => {
		if (createIsError) {
			setCreateErrorSnackBarOpened(true);
		}
	}, [createIsError]);

	useEffect(() => {
		if (updateIsError) {
			setUpdateErrorSnackBarOpened(true);
		}
	}, [updateIsError]);

	useEffect(() => {
		if (deleteFilterGroupsIsError) {
			setDeleteErrorSnackBarOpened(true);
		}
	}, [deleteFilterGroupsIsError]);

	const handleStartCreate = () => {
		fetchCategoryList();
		setCreateModalOpened(true);
	};

	const handleStartUpdate = () => {
		fetchCategoryList();
		setUpdateModalOpened(true);
	};

	const handleStartDelete = () => {
		setDeletionDialogOpened(true);
	};

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
				message="Группа фильтров успешно создана"
			/>
			<Snackbar
				open={updateSuccessSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setUpdateSuccessSnackBarOpened(false)}
				message="Группа фильтров успешно обновлена"
			/>
			<Snackbar
				open={deleteSuccessSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setDeleteSuccessSnackBarOpened(false)}
				message="Группа фильтров успешно удалена"
			/>
			<Snackbar
				open={createErrorSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setCreateErrorSnackBarOpened(false)}
				message="Произошла ошибка при создании группы фильтров"
			/>
			<Snackbar
				open={updateErrorSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setUpdateErrorSnackBarOpened(false)}
				message="Произошла ошибка при обновлении группы фильтров"
			/>
			<Snackbar
				open={deleteErrorSnackBarOpened}
				autoHideDuration={2000}
				onClose={() => setDeleteErrorSnackBarOpened(false)}
				message="Произошла ошибка при удалении группы фильтров"
			/>

			<ManagementModal
				title="Создать группу фильтров"
				opened={createModalOpened}
				onClose={() => setCreateModalOpened(false)}
			>
				<FilterGroupCreateForm
					categoryList={categoryList}
					categoryListIsLoading={categoryListIsLoading}
					onSubmit={createFilterGroup}
				/>
			</ManagementModal>
			<ManagementModal
				title="Редактировать группу фильтров"
				opened={updateModalOpened}
				onClose={() => setUpdateModalOpened(false)}
			>
				{!selectedFilterGroup ? (
					<Typography variant="body2">Выберите группу</Typography>
				) : (
					<FilterGroupUpdateForm
						filterGroup={selectedFilterGroup}
						categoryList={categoryList}
						categoryListIsLoading={categoryListIsLoading}
						onSubmit={updateFilterGroup}
					/>
				)}
			</ManagementModal>
			<ActionDialog
				title="Удалить выбранные группы?"
				helperText="После удаления отменить действие будет невозможно"
				opened={deletionDialogOpened}
				onClose={() => setDeletionDialogOpened(false)}
				confirmButton={{
					text: "Удалить",
					onClick: () => {
						deleteFilterGroups(selectedItemIds.map(String));
					},
				}}
				declineButton={{
					text: "Отмена",
				}}
			/>
			<div className="d-f fd-r jc-sb p-2">
				<div>
					<Typography variant="h5">Группы фильтров</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {filterGroupList?.items.length}
					</Typography>
				</div>
				<Button variant="contained" onClick={handleStartCreate}>
					<Add />
					Добавить
				</Button>
			</div>
			<LoadingSpinner isLoading={filterGroupListIsLoading}>
				{!filterGroupList ? (
					<div className="w-100 h-100v d-f ai-c jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={columns}
						data={filterGroupList.items}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
						headerButtons={
							<>
								<Button
									variant="contained"
									disabled={!selectedItemIds.length}
									onClick={handleStartDelete}
								>
									Удалить
								</Button>
								<Button
									variant="contained"
									disabled={!selectedItemIds.length || selectedItemIds.length > 1}
									onClick={handleStartUpdate}
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
