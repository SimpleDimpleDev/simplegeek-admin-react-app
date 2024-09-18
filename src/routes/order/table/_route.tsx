import "react-image-crop/dist/ReactCrop.css";

import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { OrderAdmin, OrderStatus } from "@appTypes/Order";
import { useMemo, useState } from "react";

import AdminTable from "@routes/table";
import { DeliveryService } from "@appTypes/Delivery";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { orderStatusBadges } from "@components/Badges";
import { useGetOrderListQuery } from "@api/admin/service";

const deliveryServiceMapping: Record<DeliveryService | "UNASSIGNED", string> = {
	UNASSIGNED: "Не назначено",
	CDEK: "СДЕК",
	SELF_PICKUP: "Самовывоз",
};

const columns: GridColDef<OrderAdmin>[] = [
	{
		field: "user",
		headerName: "Пользователь",
		renderCell: ({ value: user }) => {
			return user.email;
		},
	},
	{
		field: "delivery",
		headerName: "Сервис доставки",
		renderCell: ({ value: delivery }) => {
			if (!delivery) return "-";
			return deliveryServiceMapping[delivery.service as DeliveryService];
		},
	},
	{
		field: "status",
		headerName: "Статус",
		renderCell: ({ value: status }) => {
			return orderStatusBadges[status as OrderStatus];
		},
	},
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
];

export default function OrderTable() {
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

	const handleChangeDeliveryService = (service: DeliveryService | "UNASSIGNED") => {
		setSelectedItemIds([]);
		setDeliveryService(service);
	};

	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
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

			<div className="d-f fd-r jc-sb p-2">
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
					<div className="w-100 h-100v d-f ai-c jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={columns}
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
					/>
				)}
			</LoadingSpinner>
		</div>
	);
}
