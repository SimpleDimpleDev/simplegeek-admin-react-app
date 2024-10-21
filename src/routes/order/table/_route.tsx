import { Button, Typography } from "@mui/material";
import { GridColDef, GridFilterItem, GridRowSelectionModel } from "@mui/x-data-grid";
import { deliveryServiceTitles, orderStatusTitles } from "src/constants";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AdminTable from "@components/ManagementTable";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { OrderGet } from "@appTypes/Order";
import { orderStatusBadges } from "@components/Badges";
import { useGetOrderListQuery } from "@api/admin/order";

const selfPickupColumns: GridColDef<OrderGet>[] = [
	{
		field: "user",
		headerName: "Пользователь",
		valueGetter: (_, row) => {
			return row.user.email;
		},
	},
	{
		field: "status",
		headerName: "Статус",
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
		valueGetter: (_, row) => (row.delivery ? row.delivery.service : "UNASSIGNED"),
		renderCell: ({ row: { delivery } }) => {
			if (!delivery) return deliveryServiceTitles.get("UNASSIGNED");
			return deliveryServiceTitles.get(delivery.service);
		},
		type: "singleSelect",
		valueOptions: Array.from(deliveryServiceTitles.entries()).map(([service, title]) => ({
			value: service,
			label: title,
		})),
	},
	{
		field: "preorder",
		headerName: "Тип заказа",
		renderCell: ({ row: { preorder } }) => {
			if (!preorder) return "Розница";
			return `Предзаказ: ${preorder.title}`;
		},
	},
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
];

export default function OrderTableRoute() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const inspectedUserEmail = params.get("userEmail");

	const { data: orderList, isLoading: orderListIsLoading } = useGetOrderListQuery();

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedOrder = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return orderList?.items.find((order) => order.id === selectedItemId) || null;
	}, [selectedItemIds, orderList]);

	const initialFilters: GridFilterItem[] = useMemo(() => {
		const filters: GridFilterItem[] = [];
		if (inspectedUserEmail) {
			filters.push({
				field: "user",
				value: inspectedUserEmail,
				operator: "equals",
			});
		}
		return filters;
	}, [inspectedUserEmail]);

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			{/* <Snackbar
				open={successSnackBarOpened}
				autoHideDuration={4000}
				onClose={() => setSuccessSnackBarOpened(false)}
				message="Изменения сохранены"
			/> */}
			{/* <ActionDialog
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
			/> */}

			<div className="p-2 d-f fd-r jc-sb">
				<div>
					<Typography variant="h5">Заказы</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {orderList?.items.length}
					</Typography>
				</div>
			</div>
			<LoadingSpinner isLoading={orderListIsLoading}>
				{!orderList ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={selfPickupColumns}
						data={orderList.items}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
						initialFilters={initialFilters}
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
