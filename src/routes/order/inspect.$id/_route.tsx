import {
	Button,
	Divider,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Snackbar,
	Stack,
	Typography,
} from "@mui/material";
import { Check, ChevronLeft, Close, Edit } from "@mui/icons-material";
import { DateFormatter, getRuGoodsWord } from "@utils/format";
import { useEffect, useState } from "react";
import {
	useGetOrderEditablePropsQuery,
	useGetOrderQuery,
	useUpdateOrderDeliveryMutation,
	useUpdateOrderStatusMutation,
} from "@api/admin/order";
import { useNavigate, useParams } from "react-router-dom";

import { DeliveryForm } from "@components/DeliveryForm";
import { DeliveryService } from "@appTypes/Delivery";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { OrderStatus } from "@appTypes/Order";
import { getImageUrl } from "@utils/image";
import { orderStatusBadges } from "@components/Badges";

const deliveryServiceMapping: Record<DeliveryService, string> = {
	CDEK: "СДЕК",
	SELF_PICKUP: "Самовывоз",
};

export default function OrderInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const orderId = params.id;
	if (!orderId) throw new Response("No order id provided", { status: 404 });
	const { data: order, isLoading: orderIsLoading } = useGetOrderQuery({ orderId });
	const { data: editableProps, isLoading: editablePropsIsLoading } = useGetOrderEditablePropsQuery(
		{
			orderId,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const [
		updateStatus,
		{ isLoading: statusUpdateIsLoading, isSuccess: statusUpdateIsSuccess, isError: statusUpdateIsError },
	] = useUpdateOrderStatusMutation();
	const [
		updateDelivery,
		{ isLoading: deliveryUpdateIsLoading, isSuccess: deliveryUpdateIsSuccess, isError: deliveryUpdateIsError },
	] = useUpdateOrderDeliveryMutation();

	const showLoadingOverlay = statusUpdateIsLoading || deliveryUpdateIsLoading;

	const [snackbarOpened, setSnackbarOpened] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>("");

	const [statusEditing, setStatusEditing] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "UNDEFINED">("UNDEFINED");

	useEffect(() => {
		if (order) {
			setSelectedStatus(order.status);
		}
	}, [order]);

	useEffect(() => {
		if (statusUpdateIsSuccess) {
			showSnackbarMessage("Статус успешно обновлен");
		}
		if (statusUpdateIsError) {
			showSnackbarMessage("Произошла ошибка при обновлении статуса");
		}
	}, [statusUpdateIsSuccess, statusUpdateIsError]);

	useEffect(() => {
		if (deliveryUpdateIsSuccess) {
			showSnackbarMessage("Доставка успешно обновлена");
		}
		if (deliveryUpdateIsError) {
			showSnackbarMessage("Произошла ошибка при обновлении доставки");
		}
	}, [deliveryUpdateIsSuccess, deliveryUpdateIsError]);

	const showSnackbarMessage = (message: string) => {
		setSnackbarMessage(message);
		setSnackbarOpened(true);
	};

	const handleStartEditStatus = () => {
		setStatusEditing(true);
	};

	const handleSelectStatus = (event: SelectChangeEvent) => {
		if (!statusEditing) return;
		setSelectedStatus(event.target.value as OrderStatus);
	};

	const handleSaveStatus = () => {
		if (!statusEditing) return;
		if (!order) return;
		if (selectedStatus === "UNDEFINED") return;
		updateStatus({
			id: order.id,
			status: selectedStatus,
		});
		setStatusEditing(false);
	};

	const handleCancelEditStatus = () => {
		setSelectedStatus(order?.status ?? "UNDEFINED");
		setStatusEditing(false);
	};

	return (
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar
				open={snackbarOpened}
				autoHideDuration={2000}
				onClose={() => setSnackbarOpened(false)}
				message={snackbarMessage}
			/>
			<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
				<Button onClick={() => navigate("/order/table")} sx={{ width: "fit-content", color: "warning.main" }}>
					<ChevronLeft />К списку всех заказов
				</Button>
				<LoadingSpinner isLoading={orderIsLoading || editablePropsIsLoading}>
					{!order || !editableProps ? (
						<div className="w-100 h-100v ai-c d-f jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<div className="gap-2 d-f fd-c">
							{/* Main info */}
							<div className="py-2">
								<Typography variant="h3">Заказ от {DateFormatter.DDMMYYYY(new Date())}</Typography>
								<Typography variant="subtitle0">ID: Order id</Typography>
								<Button onClick={() => navigate(`/user/inspect/${order.user.id}`)}>
									<Typography variant="subtitle0">Пользователь {order.user.email}</Typography>
								</Button>
							</div>

							{/* Status */}
							<div className="gap-2 ai-c d-f fd-r">
								<FormControl>
									<InputLabel id="demo-simple-select-label">Статус заказа</InputLabel>
									<Select
										sx={{backgroundColor: "white"}}
										readOnly={!statusEditing}
										variant="standard"
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={selectedStatus}
										label="Статус заказа"
										onChange={handleSelectStatus}
									>
										{editableProps.statuses.map((status) => (
											<MenuItem value={status}>{orderStatusBadges[status]}</MenuItem>
										))}
									</Select>
								</FormControl>
								{statusEditing ? (
									<>
										<IconButton sx={{ color: "success.main" }} onClick={handleSaveStatus}>
											<Check />
										</IconButton>
										<IconButton sx={{ color: "error.main" }} onClick={handleCancelEditStatus}>
											<Close />
										</IconButton>
									</>
								) : (
									<IconButton onClick={handleStartEditStatus}>
										<Edit />
									</IconButton>
								)}
							</div>

							{/* Delivery */}
							<Paper>
								{order.delivery ? (
									editableProps.delivery ? (
										<DeliveryForm
											delivery={order.delivery}
											onChange={(data) => {
												updateDelivery({
													id: order.id,
													delivery: data,
												});
											}}
											packages={[]}
										/>
									) : (
										<Stack
											gap={1}
											direction={"column"}
											divider={<Divider orientation="horizontal" flexItem />}
										>
											<div className="gap-2 d-f fd-c">
												<Typography variant={"h5"}>Доставка</Typography>
												<div className={`d-f fd-r jc-sb`}>
													<div className="gap-05 w-100 d-f fd-c">
														<Typography
															variant="body1"
															sx={{ color: "typography.secondary" }}
														>
															Способ получения
														</Typography>
														<Typography variant="subtitle0">
															{deliveryServiceMapping[order.delivery.service]}
														</Typography>
													</div>
													<div className="gap-05 w-100 d-f fd-c">
														<Typography
															variant="body1"
															sx={{ color: "typography.secondary" }}
														>
															Пункт выдачи
														</Typography>
														<Typography variant="body1">
															{order.delivery.point?.code}
														</Typography>
													</div>
												</div>
												<div className="gap-05 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														Адрес
													</Typography>
													<Typography variant="body1">
														{order.delivery.point?.address}
													</Typography>
												</div>
											</div>
											<div className="gap-2 d-f fd-c">
												<Typography variant="h5">Получатель</Typography>
												<div className={`d-f fd-r jc-sb`}>
													<div className="gap-05 w-100 d-f fd-c">
														<Typography
															variant="body1"
															sx={{ color: "typography.secondary" }}
														>
															ФИО
														</Typography>
														<Typography variant="subtitle0">
															{order.delivery.recipient.fullName}
														</Typography>
													</div>
													<div className="gap-05 w-100 d-f fd-c">
														<Typography
															variant="body1"
															sx={{ color: "typography.secondary" }}
														>
															Номер телефона
														</Typography>
														<Typography variant="body1">
															{order.delivery.recipient.phone}
														</Typography>
													</div>
												</div>
											</div>
										</Stack>
									)
								) : (
									<div className="gap-1">
										<Typography variant="subtitle1">
											Доставка оформляется после полной оплаты товара и приезда его на склад
										</Typography>
										<div className="gap-1 d-f fd-r">
											<Typography variant="subtitle1" sx={{ color: "typography.secondary" }}>
												На складе ожидается:
											</Typography>
											<Typography variant="body1">
												{order.preorder?.expectedArrival
													? DateFormatter.CyrillicMonthNameYYYY(
															order.preorder.expectedArrival
													  )
													: "Неизвестно"}
											</Typography>
										</div>
									</div>
								)}
							</Paper>

							{/* Initial Payment */}
							<Paper sx={{ p: 2 }}>
								<Typography variant="h5">Платёж</Typography>
								<Typography variant="body1">Сумма: {order.initialInvoice.amount}</Typography>
								<Typography variant="body1">
									Создан: {DateFormatter.DDMMYYYY(order.initialInvoice.createdAt)}
								</Typography>
								<Typography variant="body1">
									Оплачено: {order.initialInvoice.isPaid ? <Check /> : <Close />}
								</Typography>
							</Paper>

							{/* Items */}
							<Paper sx={{ p: 2 }}>
								<Typography variant="h5">
									{order.items.length} {getRuGoodsWord(order.items.length)}
								</Typography>
								<Stack divider={<Divider />}>
									{order.items.map((item) => (
										<div className="gap-1 pt-1 d-f fd-c" key={item.id}>
											<div className="w-100 d-f fd-r jc-sb">
												<div className="gap-1 w-100 d-f fd-r">
													<div className="br-2" style={{ width: 96, height: 96 }}>
														<img
															className="contain"
															src={getImageUrl(item.image, "small")}
														/>
													</div>
													<div className="d-f fd-c jc-sb">
														<div className="gap-1">
															<Typography variant="h6">{item.title}</Typography>
															<Typography variant="body1">{item.quantity} шт.</Typography>
														</div>
													</div>
												</div>
												<div className="d-f fd-r fs-0">
													<Typography variant="subtitle1">{item.sum} ₽</Typography>
												</div>
											</div>
										</div>
									))}
								</Stack>
							</Paper>
						</div>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
