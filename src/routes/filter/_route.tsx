import { Button, Snackbar, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
	useCreateFilterGroupMutation,
	useDeleteFilterGroupsMutation,
	useGetFilterGroupListQuery,
	useUpdateFilterGroupMutation,
} from "@api/admin/filterGroup";
import { useEffect, useState } from "react";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "../table";
import { FilterGroupCreateForm } from "./forms";
import { FilterGroupGet } from "@appTypes/Filters";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "../managementModal";

const columns: GridColDef<FilterGroupGet>[] = [
	{ field: "title", headerName: "Название" },
	{ field: "category", headerName: "Категория", renderCell: (params) => params.row.category?.title || "Без привязки" },
	{ field: "values", headerName: "Значения" },
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
];

export default function Filter() {
	const { data: filterGroupList, isLoading: filterGroupListIsLoading } = useGetFilterGroupListQuery({
		categoryId: undefined,
	});
	const [createFilterGroup, { isSuccess: createFilterGroupIsSuccess, isError: createFilterGroupIsError }] =
		useCreateFilterGroupMutation();
	const [updateFilterGroup, { isSuccess: updateFilterGroupIsSuccess, isError: updateFilterGroupIsError }] =
		useUpdateFilterGroupMutation();
	const [deleteFilterGroups, { isSuccess: deleteFilterGroupsIsSuccess, isError: deleteFilterGroupsIsError }] =
		useDeleteFilterGroupsMutation();

	const [deletionDialogOpened, setDeletionDialogOpened] = useState<boolean>(false);
	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const [updateModalOpened, setUpdateModalOpened] = useState<boolean>(false);
	const [successSnackBarOpened, setSuccessSnackBarOpened] = useState<boolean>(false);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	useEffect(() => {
		if (createFilterGroupIsSuccess) {
			setSuccessSnackBarOpened(true);
			setCreateModalOpened(false);
		}

		if (updateFilterGroupIsSuccess) {
			setSuccessSnackBarOpened(true);
			setUpdateModalOpened(false);
		}

		if (deleteFilterGroupsIsSuccess) {
			setSuccessSnackBarOpened(true);
			setDeletionDialogOpened(false);
		}

		if (createFilterGroupIsError) {
			console.error("createFilterGroupIsError:", createFilterGroupIsError);
		}

		if (updateFilterGroupIsError) {
			console.error("updateFilterGroupIsError:", updateFilterGroupIsError);
		}

		if (deleteFilterGroupsIsError) {
			console.error("deleteFilterGroupsIsError:", deleteFilterGroupsIsError);
		}
	}, [
		createFilterGroupIsSuccess,
		updateFilterGroupIsSuccess,
		deleteFilterGroupsIsSuccess,
		createFilterGroupIsError,
		updateFilterGroupIsError,
		deleteFilterGroupsIsError,
	]);

	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
			<Snackbar
				open={successSnackBarOpened}
				autoHideDuration={4000}
				onClose={() => setSuccessSnackBarOpened(false)}
				message="Изменения сохранены"
			/>
			<ManagementModal
				title="Создать группу фильтров"
				opened={createModalOpened}
				onClose={() => setCreateModalOpened(false)}
			>
				<FilterGroupCreateForm onSubmit={createFilterGroup} />
			</ManagementModal>
			<ManagementModal
				title="Редактировать группу фильтров"
				opened={updateModalOpened}
				onClose={() => setUpdateModalOpened(false)}
			>
				<div>
					<h1>Not implemented</h1>
					<button onClick={updateFilterGroup}>Submit</button>
				</div>
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
				<Button variant="contained" onClick={() => setCreateModalOpened(true)}>
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
