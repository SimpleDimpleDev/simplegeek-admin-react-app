import "react-image-crop/dist/ReactCrop.css";

import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { OrderGet } from "@appTypes/Order";
import { useMemo, useState } from "react";

import AdminTable from "@components/ManagementTable";
import { DeliveryService } from "@appTypes/Delivery";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { orderStatusBadges } from "@components/Badges";
import { useGetOrderListQuery } from "@api/admin/order";

const deliveryServiceMapping: Record<DeliveryService | "UNASSIGNED", string> = {
	UNASSIGNED: "Не оформлена",
	SELF_PICKUP: "Самовывоз",
	CDEK: "СДЕК",
};

const selfPickupColumns: GridColDef<OrderGet>[] = [
	{
		field: "user",
		headerName: "Пользователь",
		renderCell: ({ row: { user } }) => {
			return user.email;
		},
	},
	{
		field: "status",
		headerName: "Статус",
		renderCell: ({ row: { status } }) => {
			return <div className="d-f ai-c jc-c">{orderStatusBadges[status]}</div>;
		},
	},
	{
		field: "deliveryService",
		headerName: "Сервис доставки",
		renderCell: ({ row: { delivery } }) => {
			if (!delivery) return deliveryServiceMapping["UNASSIGNED"];
			return deliveryServiceMapping[delivery.service as DeliveryService];
		},
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
	const { data: orderList, isLoading: orderListIsLoading } = useGetOrderListQuery();

	const [deliveryService, setDeliveryService] = useState<DeliveryService | "UNASSIGNED">("SELF_PICKUP");

	const deliveryServiceOrders = useMemo(
		() =>
			orderList?.items.filter((item) =>
				item.delivery ? item.delivery.service === deliveryService : deliveryService === "UNASSIGNED"
			),
		[orderList, deliveryService]
	);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedOrder = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return orderList?.items.find((order) => order.id === selectedItemId) || null;
	}, [selectedItemIds, orderList]);

	const handleChangeDeliveryService = (service: DeliveryService | "UNASSIGNED") => {
		setSelectedItemIds([]);
		setDeliveryService(service);
	};

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
			<FormControl fullWidth>
				<InputLabel id="delivery-service-label">Сервис доставки</InputLabel>
				<Select
					value={deliveryService}
					onChange={(e) => handleChangeDeliveryService(e.target.value as DeliveryService | "UNASSIGNED")}
					labelId="delivery-service-label"
					label="Сервис доставки"
					fullWidth
					variant="outlined"
				>
					{Object.entries(deliveryServiceMapping).map(([key, value]) => (
						<MenuItem key={key} value={key}>
							{value}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<LoadingSpinner isLoading={orderListIsLoading}>
				{!deliveryServiceOrders ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={selfPickupColumns}
						data={deliveryServiceOrders}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
						headerButtons={
							<>
								<Button
									variant="contained"
									disabled={!selectedItemIds.length || deliveryService !== "CDEK"}
									onClick={() => {}}
								>
									Сформировать накладные
								</Button>
							</>
						}
						leftHeaderButtons={
							<>
								<Button variant="contained" disabled={!selectedOrder} onClick={() => {}}>
									Подробнее
								</Button>
								<Button variant="contained" disabled={!selectedOrder} onClick={() => {}}>
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
