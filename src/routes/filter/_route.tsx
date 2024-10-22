import { Button, CircularProgress, Modal, Snackbar, Tooltip, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import {
	useCreateFilterGroupMutation,
	useDeleteFilterGroupsMutation,
	useGetFilterGroupListQuery,
	useUpdateFilterGroupMutation,
} from "@api/admin/filterGroup";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "@components/ManagementTable";
import { FilterGroupCreateForm } from "./CreateForm";
import { FilterGroupGet } from "@appTypes/Filters";
import { FilterGroupUpdateForm } from "./UpdateForm";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "@components/ManagementModal";
import { useLazyGetCategoryListQuery } from "@api/admin/category";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

const columns: GridColDef<FilterGroupGet>[] = [
	{ field: "title", headerName: "Название", display: "flex" },
	{
		field: "category",
		headerName: "Категория",
		display: "flex",
		valueGetter: (_, row) => row.category?.title || "Без привязки",
	},
	{
		field: "filters",
		headerName: "Значения",
		display: "flex",
		sortable: false,
		maxWidth: 600,
		valueGetter: (_, row) => row.filters.map(({ value }) => value).join(", "),
		renderCell: (params) => {
			const valuesString = params.row.filters.map(({ value }) => value).join(", ");
			return (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<Tooltip title={valuesString}>
						<Typography variant="body2" color="black">
							{valuesString}
						</Typography>
					</Tooltip>
				</div>
			);
		},
	},
	{ field: "createdAt", headerName: "Создан", display: "flex", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", display: "flex", type: "dateTime" },
];

export default function FilterRoute() {
	const { data: filterGroupList, isLoading: filterGroupListIsLoading } = useGetFilterGroupListQuery({
		categoryId: undefined,
	});
	const [fetchCategoryList, { data: categoryList, isLoading: categoryListIsLoading }] = useLazyGetCategoryListQuery();

	const [
		createFilterGroup,
		{ isSuccess: createIsSuccess, isLoading: createIsLoading, isError: createIsError, error: createError },
	] = useCreateFilterGroupMutation();
	const [
		updateFilterGroup,
		{ isSuccess: updateIsSuccess, isLoading: updateIsLoading, isError: updateIsError, error: updateError },
	] = useUpdateFilterGroupMutation();
	const [
		deleteFilterGroups,
		{
			isSuccess: deleteFilterGroupsIsSuccess,
			isLoading: deleteIsLoading,
			isError: deleteFilterGroupsIsError,
			error: deleteError,
		},
	] = useDeleteFilterGroupsMutation();

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

	const selectedFilterGroup = useMemo(() => {
		if (!filterGroupList) return null;
		return filterGroupList.items.find((filterGroup) => filterGroup.id === selectedItemIds[0]);
	}, [filterGroupList, selectedItemIds]);

	const showLoadingOverlay = useMemo(
		() => createIsLoading || updateIsLoading || deleteIsLoading,
		[createIsLoading, updateIsLoading, deleteIsLoading]
	);

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useMutationFeedback({
		title: "Создание группы фильтров",
		isSuccess: createIsSuccess,
		isError: createIsError,
		error: createError,
		feedbackFn: showSnackbarMessage,
		successAction: closeCreateModal,
	});

	useMutationFeedback({
		title: "Обновление группы фильтров",
		isSuccess: updateIsSuccess,
		isError: updateIsError,
		error: updateError,
		feedbackFn: showSnackbarMessage,
		successAction: closeUpdateModal,
	});

	useMutationFeedback({
		title: "Удаление группы фильтров",
		isSuccess: deleteFilterGroupsIsSuccess,
		isError: deleteFilterGroupsIsError,
		error: deleteError,
		feedbackFn: showSnackbarMessage,
		successAction: closeDeletionDialog,
		errorAction: closeDeletionDialog,
	});

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
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<Modal open={showLoadingOverlay}>
				<div className="w-100v h-100v ai-c d-f jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
					<CircularProgress />
				</div>
			</Modal>

			<Snackbar open={snackbarOpened} autoHideDuration={2000} onClose={closeSnackbar} message={snackbarMessage} />

			<ManagementModal title="Создать группу фильтров" opened={createModalOpened} onClose={closeCreateModal}>
				<FilterGroupCreateForm
					categoryList={categoryList}
					categoryListIsLoading={categoryListIsLoading}
					onSubmit={createFilterGroup}
				/>
			</ManagementModal>
			<ManagementModal
				title="Редактировать группу фильтров"
				opened={updateModalOpened}
				onClose={closeUpdateModal}
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
				onClose={closeDeletionDialog}
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
			<div className="p-2 d-f fd-r jc-sb">
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
					<div className="w-100 h-100v ai-c d-f jc-c">
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
