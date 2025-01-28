import { Button, Snackbar, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import { useCreatePreorderMutation, useGetPreorderListQuery } from "@api/admin/preorder";

import { Add } from "@mui/icons-material";
import Fader from "@components/Fader";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "@components/ManagementModal";
import ManagementTable from "@components/ManagementTable";
import { PreorderCreateForm } from "./CreateForm";
import { PreorderGet } from "@appTypes/Preorder";
import { preorderStatusBadges } from "@components/Badges";
import { preorderStatusTitles } from "src/constants";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@hooks/useSnackbar";

const columns: GridColDef<PreorderGet>[] = [
	{ field: "title", headerName: "Название", display: "flex" },
	{
		field: "status",
		headerName: "Статус",
		display: "flex",
		renderCell: ({ row: { status } }) => {
			return <div className="w-100 h-100 ai-c d-f jc-c">{preorderStatusBadges[status]}</div>;
		},
		type: "singleSelect",
		valueOptions: Array.from(preorderStatusTitles.entries()).map(([status, title]) => ({
			value: status,
			label: title,
		})),
	},
	{ field: "expectedArrival", headerName: "Ожидаемая дата доставки", display: "flex" },
	{ field: "createdAt", headerName: "Создан", type: "dateTime", display: "flex" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime", display: "flex" },
];

export default function PreorderTableRoute() {
	const navigate = useNavigate();
	const { data: preorderList, isLoading: preorderListIsLoading } = useGetPreorderListQuery();

	const [
		createPreorder,
		{
			isLoading: createPreorderIsLoading,
			isSuccess: createPreorderIsSuccess,
			isError: createPreorderIsError,
			error: createPreorderError,
		},
	] = useCreatePreorderMutation();
	const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
	const handleStartCreate = useCallback(() => {
		setCreateModalOpened(true);
	}, []);
	const closeCreateModal = useCallback(() => {
		setCreateModalOpened(false);
	}, []);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedPreorder = useMemo(() => {
		if (!preorderList) return null;
		return preorderList.items.find((filterGroup) => filterGroup.id === selectedItemIds[0]);
	}, [preorderList, selectedItemIds]);

	const showLoadingOverlay = createPreorderIsLoading;

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useMutationFeedback({
		title: "Создание предзаказа",
		isSuccess: createPreorderIsSuccess,
		isError: createPreorderIsError,
		error: createPreorderError,
		feedbackFn: showSnackbarMessage,
		successAction: closeCreateModal,
	});

	return (
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={2000} onClose={closeSnackbar} message={snackbarMessage} />
			<ManagementModal title="Создание предзаказа" opened={createModalOpened} onClose={closeCreateModal}>
				<PreorderCreateForm onSubmit={createPreorder} />
			</ManagementModal>
			<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
				<div className="p-2 d-f fd-r jc-sb">
					<div>
						<Typography variant="h5">Предзаказы</Typography>
						<Typography variant="body2" color="typography.secondary">
							Количество: {preorderList?.items.length}
						</Typography>
					</div>
					<Button variant="contained" onClick={handleStartCreate}>
						<Add />
						Добавить
					</Button>
				</div>
				<LoadingSpinner isLoading={preorderListIsLoading}>
					{!preorderList ? (
						<div className="w-100 h-100v ai-c d-f jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<Fader>
							<ManagementTable
								columns={columns}
								data={preorderList.items}
								onRowSelect={setSelectedItemIds}
								selectedRows={selectedItemIds}
								leftHeaderButtons={
									<>
										<Button
											variant="contained"
											disabled={!selectedPreorder}
											onClick={() => {
												navigate(`/preorder/inspect/${selectedPreorder?.id}`);
											}}
										>
											Подробнее
										</Button>
									</>
								}
							/>
						</Fader>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
