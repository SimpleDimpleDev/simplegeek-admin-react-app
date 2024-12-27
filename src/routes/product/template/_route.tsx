import { Button, Snackbar, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import {
	useCreateProductTemplateMutation,
	useDeleteProductTemplatesMutation,
	useGetProductTemplateListQuery,
	useUpdateProductTemplateMutation,
} from "@api/admin/productTemplate";

import ActionDialog from "@components/ActionDialog";
import { Add } from "@mui/icons-material";
import AdminTable from "@components/ManagementTable";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "@components/ManagementModal";
import { ProductTemplateCreateForm } from "./forms/CreateForm";
import { ProductTemplateGet } from "@appTypes/ProductTemplate";
import { ProductTemplateUpdateForm } from "./forms/UpdateForm";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

const columns: GridColDef<ProductTemplateGet>[] = [
	{ field: "title", headerName: "Название шаблона", display: "flex" },
	{ field: "answer", headerName: "Ответ", display: "flex" },
	{ field: "createdAt", headerName: "Создан", display: "flex", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", display: "flex", type: "dateTime" },
];

export default function ProductTemplateRoute() {
	const { data: productTemplateList, isLoading: productTemplateListIsLoading } = useGetProductTemplateListQuery();
	const [
		createProductTemplate,
		{ isLoading: createIsLoading, isSuccess: createSuccess, isError: createIsError, error: createError },
	] = useCreateProductTemplateMutation();
	const [
		updateProductTemplate,
		{ isLoading: updateIsLoading, isSuccess: updateSuccess, isError: updateIsError, error: updateError },
	] = useUpdateProductTemplateMutation();
	const [
		deleteProductTemplate,
		{ isLoading: deleteIsLoading, isSuccess: deleteSuccess, isError: deleteIsError, error: deleteError },
	] = useDeleteProductTemplatesMutation();

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedItem = useMemo(() => {
		return productTemplateList?.items.find((item) => item.id === selectedItemIds.at(0)) || null;
	}, [productTemplateList, selectedItemIds]);

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

	const showLoadingOverlay = useMemo(() => {
		return createIsLoading || updateIsLoading || deleteIsLoading;
	}, [createIsLoading, updateIsLoading, deleteIsLoading]);

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useMutationFeedback({
		title: "Создание шаблона",
		isSuccess: createSuccess,
		isError: createIsError,
		error: createError,
		feedbackFn: showSnackbarMessage,
		successAction: closeCreateModal,
	});

	useMutationFeedback({
		title: "Обновление шаблона",
		isSuccess: updateSuccess,
		isError: updateIsError,
		error: updateError,
		feedbackFn: showSnackbarMessage,
		successAction: closeUpdateModal,
	});

	useMutationFeedback({
		title: "Удаление шаблонов",
		isSuccess: deleteSuccess,
		isError: deleteIsError,
		error: deleteError,
		feedbackFn: showSnackbarMessage,
		successAction: closeDeletionDialog,
		errorAction: closeDeletionDialog,
	});

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={2000} onClose={closeSnackbar} message={snackbarMessage} />
			<ManagementModal title="Создать шаблон" opened={createModalOpened} onClose={closeCreateModal}>
				<ProductTemplateCreateForm onSubmit={createProductTemplate} />
			</ManagementModal>
			<ManagementModal title="Редактировать шаблон" opened={updateModalOpened} onClose={closeUpdateModal}>
				{selectedItem ? (
					<ProductTemplateUpdateForm itemToUpdate={selectedItem} onSubmit={updateProductTemplate} />
				) : null}
			</ManagementModal>
			<ActionDialog
				title="Удалить выбранные шаблоны?"
				helperText="После удаления отменить действие будет невозможно"
				opened={deletionDialogOpened}
				onClose={closeDeletionDialog}
				confirmButton={{
					text: "Удалить",
					onClick: () => deleteProductTemplate({ ids: selectedItemIds.map(String) }),
				}}
				declineButton={{
					text: "Отмена",
				}}
			/>
			<div className="p-2 d-f fd-r jc-sb">
				<div>
					<Typography variant="h5">Шаблоны продуктов</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {productTemplateList?.items.length}
					</Typography>
				</div>
				<Button variant="contained" onClick={() => setCreateModalOpened(true)}>
					<Add />
					Добавить шаблон
				</Button>
			</div>
			<LoadingSpinner isLoading={productTemplateListIsLoading}>
				{!productTemplateList ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={columns}
						data={productTemplateList.items}
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
