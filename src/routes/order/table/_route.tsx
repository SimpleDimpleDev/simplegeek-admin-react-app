import { Button, Snackbar, Tooltip, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { deliveryServiceTitles, orderStatusTitles } from "src/constants";
import { useCallback, useMemo, useState } from "react";
import { useGetOrderListQuery, useMakeSelfPickupReadyMutation } from "@api/admin/order";
import { useNavigate, useParams } from "react-router-dom";

import ActionDialog from "@components/ActionDialog";
import { Business } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementTable from "@components/ManagementTable";
import { OrderGet } from "@appTypes/Order";
import { OrderListFilterSchema } from "@schemas/Order";
import { orderStatusBadges } from "@components/Badges";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

const selfPickupColumns: GridColDef<OrderGet>[] = [
	{
		field: "user",
		headerName: "Пользователь",
		display: "flex",
		valueGetter: (_, row) => {
			return row.user.email;
		},
	},
	{
		field: "fullName",
		headerName: "ФИО",
		display: "flex",
		valueGetter: (_, row) => {
			if (!row.delivery) return "-";
			return row.delivery.recipient.fullName;
		},
	},
	{
		field: "status",
		headerName: "Статус",
		display: "flex",
		renderCell: ({ row: { status } }) => {
			return <div className="w-100 h-100 ai-c d-f jc-c">{orderStatusBadges[status]}</div>;
		},
		type: "singleSelect",
		valueOptions: Array.from(orderStatusTitles.entries()).map(([status, title]) => ({
			value: status,
			label: title,
		})),
	},
	{
		field: "deliveryService",
		headerName: "Сервис доставки",
		display: "flex",
		valueGetter: (_, row) => {
			if (!row.delivery) return "UNASSIGNED";
			return row.delivery.service;
		},
		renderCell: ({ row: { delivery } }) => {
			return delivery ? deliveryServiceTitles.get(delivery.service) : "Не назначена";
		},
		type: "singleSelect",
		valueOptions: Array.from(deliveryServiceTitles.entries()).map(([service, title]) => ({
			value: service,
			label: title,
		})),
	},
	{
		field: "trackingCode",
		headerName: "Трек номер",
		display: "flex",
		valueGetter: (_, row) => {
			return row.delivery?.tracking?.code || "-";
		},
	},
	{
		field: "orderType",
		headerName: "Тип заказа",
		display: "flex",
		valueGetter: (_, row) => {
			if (!row.preorder) return "Розница";
			return `Предзаказ: ${row.preorder.title}`;
		},
	},
	{
		field: "orderItems",
		headerName: "Товары",
		display: "flex",
		valueGetter: (_, row) => {
			return row.items.map((item) => item.title).join(", ");
		},
		renderCell: ({ row: { items } }) => {
			return (
				<div className="py-1 w-100 h-100 d-f fd-c">
					{items.map((item) => (
						<Typography
							sx={{
								overflow: "hidden",
								textOverflow: "ellipsis",
								WebkitLineClamp: 1,
								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
								maxWidth: "500px",
							}}
							key={item.id}
							color="black"
							variant="body2"
						>
							{item.quantity} x {item.title}
						</Typography>
					))}
				</div>
			);
		},
	},
	{ field: "createdAt", headerName: "Создан", display: "flex", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", display: "flex", type: "dateTime" },
];

export default function OrderTableRoute() {
	const navigate = useNavigate();

	const { filterString } = useParams();

	const orderListFilter = useMemo(() => {
		let filter;
		if (filterString !== undefined) {
			const filterParseResult = OrderListFilterSchema.safeParse(filterString);
			if (filterParseResult.success) {
				filter = filterParseResult.data;
			}
		}
		return filter;
	}, [filterString]);

	const {
		data: orderList,
		isLoading: orderListIsLoading,
		isFetching: orderListIsFetching,
	} = useGetOrderListQuery({ filter: orderListFilter });

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedOrder = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return orderList?.items.find((order) => order.id === selectedItemId) || null;
	}, [selectedItemIds, orderList]);

	const [makeSelfPickupReadyConfirmDialogOpen, setMakeSelfPickupReadyConfirmDialogOpen] = useState(false);

	const closeMakeSelfPickupReadyConfirmDialog = useCallback(() => setMakeSelfPickupReadyConfirmDialogOpen(false), []);

	const makeSelfPickupReadyEnabled: boolean = useMemo(() => {
		if (selectedItemIds.length == 0) return false;
		for (const itemId of selectedItemIds) {
			const order = orderList?.items.find((order) => order.id === itemId);
			if (!order?.delivery) return false;
			if (order.status !== "ACCEPTED") return false;
			if (order.delivery.service !== "SELF_PICKUP") return false;
		}
		return true;
	}, [selectedItemIds, orderList]);

	const [
		makeSelfPickupReady,
		{
			isSuccess: makeSelfPickupReadyIsSuccess,
			isError: makeSelfPickupReadyIsError,
			error: makeSelfPickupReadyError,
		},
	] = useMakeSelfPickupReadyMutation();

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useMutationFeedback({
		title: "Сделать готовыми для самовывоза",
		isSuccess: makeSelfPickupReadyIsSuccess,
		isError: makeSelfPickupReadyIsError,
		error: makeSelfPickupReadyError,
		feedbackFn: showSnackbarMessage,
		successAction: closeMakeSelfPickupReadyConfirmDialog,
	});

	const handleMakeSelfPickupReady = () => {
		if (!makeSelfPickupReadyEnabled) return;
		makeSelfPickupReady({ ids: selectedItemIds.map(String) });
	};

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<Snackbar open={snackbarOpened} onClose={closeSnackbar} message={snackbarMessage} />
			<ActionDialog
				opened={makeSelfPickupReadyConfirmDialogOpen}
				onClose={() => setMakeSelfPickupReadyConfirmDialogOpen(false)}
				title="Сделать готовыми для самовывоза?"
				helperText="Вы уверены, что хотите сделать выбранные заказы готовыми для самовывоза?"
				confirmButton={{ text: "Да", onClick: handleMakeSelfPickupReady }}
				declineButton={{ text: "Нет", onClick: closeMakeSelfPickupReadyConfirmDialog }}
			/>
			<div className="p-2 d-f fd-r jc-sb">
				<div>
					<Typography variant="h5">Заказы</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {orderList?.items.length}
					</Typography>
				</div>
			</div>
			<LoadingSpinner isLoading={orderListIsLoading || orderListIsFetching}>
				{!orderList ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<ManagementTable
						columns={selfPickupColumns}
						data={orderList.items}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
						sorting={orderListFilter === "ACTION_REQUIRED" ? [{ field: "createdAt", sort: "asc" }] : []}
						headerButtons={
							<>
								{orderListFilter === "ACTION_REQUIRED" && (
									<Tooltip title="Сделать готовыми для самовывоза.">
										<Button
											variant="contained"
											disabled={!makeSelfPickupReadyEnabled}
											onClick={() => setMakeSelfPickupReadyConfirmDialogOpen(true)}
										>
											<Business />
										</Button>
									</Tooltip>
								)}
							</>
						}
						leftHeaderButtons={
							<>
								<Button
									variant="contained"
									disabled={!selectedOrder}
									onClick={() => {
										navigate(`/order/inspect/${selectedOrder?.id}`);
									}}
								>
									Подробнее
								</Button>
								<Button
									variant="contained"
									disabled={!selectedOrder}
									onClick={() => {
										navigate(`/user/inspect/${selectedOrder?.user.id}`);
									}}
								>
									Перейти к пользователю
								</Button>
							</>
						}
					/>
				)}
			</LoadingSpinner>
		</div>
	);
}
