import { Button, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { deliveryServiceTitles, orderStatusTitles } from "src/constants";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminTable from "@components/ManagementTable";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { OrderGet } from "@appTypes/Order";
import { OrderListFilterSchema } from "@schemas/Order";
import { orderStatusBadges } from "@components/Badges";
import { useGetOrderListQuery } from "@api/admin/order";

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
		let filter = null;
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
	} = useGetOrderListQuery({ filter: orderListFilter }, { refetchOnMountOrArgChange: true });

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedOrder = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return orderList?.items.find((order) => order.id === selectedItemId) || null;
	}, [selectedItemIds, orderList]);

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
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
					<AdminTable
						columns={selfPickupColumns}
						data={orderList.items}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
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
