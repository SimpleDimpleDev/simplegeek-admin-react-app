import {
	Add,
	Check,
	ChevronLeft,
	Close,
	Edit,
	MessageOutlined,
	RssFeed,
	Settings,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import {
	Button,
	CircularProgress,
	Divider,
	IconButton,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Snackbar,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useCreateOrderEventMutation, useGetOrderEventListQuery } from "@api/admin/orderEvent";
import {
	useGetOrderEditablePropsQuery,
	useGetOrderQuery,
	useIssueSelfPickupOrdersMutation,
	useRefundOrderMutation,
	useUpdateOrderDeliveryMutation,
	useUpdateOrderStatusMutation,
} from "@api/admin/order";
import { useNavigate, useParams } from "react-router-dom";

import ActionDialog from "@components/ActionDialog";
import { DeliveryForm } from "@components/DeliveryForm";
import { DeliveryInfo } from "./DeliveryInfo";
import { DeliveryPackage } from "@appTypes/Delivery";
import { DeliverySchema } from "@schemas/Delivery";
import { EventCreateForm } from "./EventCreateForm";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "@components/ManagementModal";
import { OrderStatus } from "@appTypes/Order";
import { getImageUrl } from "@utils/image";
import { getRuGoodsWord } from "@utils/lexical";
import { orderStatusBadges } from "@components/Badges";
import { orderStatusTitles } from "src/constants";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";
import { z } from "zod";

const OrderCDEKSection = lazy(() => import("./CDEKSection"));

export default function OrderInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const orderId = params.id;
	if (!orderId) throw new Response("No order id provided", { status: 404 });
	const { data: order, isLoading: orderIsLoading } = useGetOrderQuery({ orderId });
	const { data: orderEventList, isLoading: orderEventListIsLoading } = useGetOrderEventListQuery(
		{ orderId },
		{
			pollingInterval: 5000,
		}
	);
	const { data: editableProps, isLoading: editablePropsIsLoading } = useGetOrderEditablePropsQuery(
		{
			orderId,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const [
		createEvent,
		{
			isLoading: eventCreateIsLoading,
			isSuccess: eventCreateIsSuccess,
			isError: eventCreateIsError,
			error: eventCreateError,
		},
	] = useCreateOrderEventMutation();

	const [
		updateStatus,
		{
			isLoading: statusUpdateIsLoading,
			isSuccess: statusUpdateIsSuccess,
			isError: statusUpdateIsError,
			error: statusUpdateError,
		},
	] = useUpdateOrderStatusMutation();

	const [
		updateDelivery,
		{
			isLoading: deliveryUpdateIsLoading,
			isSuccess: deliveryUpdateIsSuccess,
			isError: deliveryUpdateIsError,
			error: deliveryUpdateError,
		},
	] = useUpdateOrderDeliveryMutation();

	const [
		issueSelfPickup,
		{
			isLoading: selfPickupIssueIsLoading,
			isSuccess: selfPickupIssueIsSuccess,
			isError: selfPickupIssueIsError,
			error: selfPickupIssueError,
		},
	] = useIssueSelfPickupOrdersMutation();

	const [
		refundOrder,
		{
			isLoading: refundOrderIsLoading,
			isSuccess: refundOrderIsSuccess,
			isError: refundOrderIsError,
			error: refundOrderError,
		},
	] = useRefundOrderMutation();

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	const [eventCreateModalOpened, setEventCreateModalOpened] = useState(false);
	const [selfPickupIssueConfirmDialogOpened, setSelfPickupIssueConfirmDialogOpened] = useState(false);
	const [refundConfirmDialogOpened, setRefundConfirmDialogOpened] = useState(false);

	const [statusEditing, setStatusEditing] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "UNDEFINED">("UNDEFINED");

	const packages: DeliveryPackage[] = useMemo(() => {
		const packages: DeliveryPackage[] = [];
		if (!order) return packages;
		for (const item of order.items) {
			if (!item.physicalProperties) continue;
			for (let i = 0; i < item.quantity; i++) {
				packages.push(item.physicalProperties);
			}
		}
		return packages;
	}, [order]);

	useEffect(() => {
		if (order) {
			setSelectedStatus(order.status);
		}
	}, [order]);

	const handleCloseEventCreateModal = useCallback(() => {
		setEventCreateModalOpened(false);
	}, []);

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

	const handleCancelEditStatus = useCallback(() => {
		setSelectedStatus(order?.status ?? "UNDEFINED");
		setStatusEditing(false);
	}, [order?.status]);

	const handleIssueSelfPickup = () => {
		if (!order) return;
		issueSelfPickup({ orderIds: [order.id] });
	};

	const handleRefund = () => {
		if (!order) return;
		refundOrder({ orderId: order.id });
	};

	const handleUpdateDelivery = useCallback(
		(data: z.infer<typeof DeliverySchema>) => {
			if (!order) return;
			updateDelivery({
				id: order.id,
				delivery: data,
			});
		},
		[order, updateDelivery]
	);

	useMutationFeedback({
		title: "Создание события",
		isSuccess: eventCreateIsSuccess,
		isError: eventCreateIsError,
		error: eventCreateError,
		feedbackFn: showSnackbarMessage,
		successAction: handleCloseEventCreateModal,
	});

	useMutationFeedback({
		title: "Обновление статуса",
		isSuccess: statusUpdateIsSuccess,
		isError: statusUpdateIsError,
		error: statusUpdateError,
		feedbackFn: showSnackbarMessage,
		errorAction: handleCancelEditStatus,
	});

	useMutationFeedback({
		title: "Обновление адреса доставки",
		isSuccess: deliveryUpdateIsSuccess,
		isError: deliveryUpdateIsError,
		error: deliveryUpdateError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Выдача самовывоза",
		isSuccess: selfPickupIssueIsSuccess,
		isError: selfPickupIssueIsError,
		error: selfPickupIssueError,
		feedbackFn: showSnackbarMessage,
		successAction: () => {
			setSelfPickupIssueConfirmDialogOpened(false);
		},
	});

	useMutationFeedback({
		title: "Возврат заказа",
		isSuccess: refundOrderIsSuccess,
		isError: refundOrderIsError,
		error: refundOrderError,
		feedbackFn: showSnackbarMessage,
		successAction: () => {
			setRefundConfirmDialogOpened(false);
		},
	});

	const showLoadingOverlay =
		eventCreateIsLoading ||
		statusUpdateIsLoading ||
		deliveryUpdateIsLoading ||
		selfPickupIssueIsLoading ||
		refundOrderIsLoading;

	return (
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={2000} onClose={closeSnackbar} message={snackbarMessage} />
			<ManagementModal
				title="Создание события"
				opened={eventCreateModalOpened}
				onClose={handleCloseEventCreateModal}
			>
				{!order ? <CircularProgress /> : <EventCreateForm orderId={order.id} onSubmit={createEvent} />}
			</ManagementModal>

			<ActionDialog
				title="Выдать заказ?"
				helperText="Вы собираетесь выдать этот заказ. Это действие необратимо."
				opened={selfPickupIssueConfirmDialogOpened}
				onClose={() => setSelfPickupIssueConfirmDialogOpened(false)}
				confirmButton={{
					text: "Выдать",
					onClick: handleIssueSelfPickup,
				}}
				declineButton={{
					text: "Отмена",
					onClick: () => setSelfPickupIssueConfirmDialogOpened(false),
				}}
			/>
			<ActionDialog
				title="Вернуть заказ?"
				helperText="Вы собираетесь вернуть этот заказ. Это действие необратимо."
				opened={refundConfirmDialogOpened}
				onClose={() => setRefundConfirmDialogOpened(false)}
				confirmButton={{
					text: "Вернуть",
					onClick: handleRefund,
				}}
				declineButton={{
					text: "Отмена",
					onClick: () => setRefundConfirmDialogOpened(false),
				}}
			/>
			<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
				<Button onClick={() => navigate(-1)} sx={{ width: "fit-content", color: "warning.main" }}>
					<ChevronLeft />
					Назад
				</Button>
				<LoadingSpinner isLoading={orderIsLoading || editablePropsIsLoading || orderEventListIsLoading}>
					{!order || !editableProps ? (
						<div className="w-100 h-100v ai-c d-f jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<div className="gap-2 d-f fd-c">
							<Typography variant="h5">
								Заказ от {new Intl.DateTimeFormat("ru").format(order.createdAt)}
							</Typography>

							{/* Main info */}
							<div className="gap-1 pt-2 d-f fd-c">
								<Typography variant="subtitle0" sx={{ color: "typography.secondary" }}>
									ID: {order.id}
								</Typography>

								{/* Status */}
								<div className="gap-2 ai-c d-f fd-r">
									<Typography variant="subtitle0">Статус</Typography>

									<Select
										disabled={!statusEditing}
										value={selectedStatus}
										onChange={handleSelectStatus}
									>
										{Array.from(orderStatusTitles.entries())
											.filter(([status]) => editableProps.statuses.includes(status))
											.map(([status]) => (
												<MenuItem value={status}>{orderStatusBadges[status]}</MenuItem>
											))}
									</Select>

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

								<div className="w-mc">
									<Button
										variant="contained"
										color="error"
										onClick={() => setRefundConfirmDialogOpened(true)}
										sx={{ color: "white" }}
									>
										Вернуть заказ
									</Button>
								</div>
							</div>

							<div className="gap-2 d-f fd-r">
								{/* User */}
								<Paper sx={{ p: 2, width: "max-content" }}>
									<div className="gap-1 h-100 d-f fd-c">
										<Typography variant="subtitle0">Пользователь</Typography>
										<div className="gap-1 mt-2 h-100 d-f fd-c jc-sb">
											<Typography variant="body1">Email: {order.user.email}</Typography>
											<div className="gap-1 ai-c d-f fd-r">
												<Button
													variant="contained"
													onClick={() => navigate(`/user/inspect/${order.user.id}`)}
												>
													Профиль
												</Button>
												<Button
													variant="contained"
													onClick={() =>
														navigate(`/order/table?f=user:equals:${order.user.email}`)
													}
												>
													Заказы
												</Button>
											</div>
										</div>
									</div>
								</Paper>

								{/* Delivery Controls */}
								{order.delivery && (
									<Paper sx={{ p: 2 }}>
										{order.delivery.service === "SELF_PICKUP" ? (
											<>
												<Typography variant="subtitle0">Самовывоз</Typography>
												<div className="gap-1 mt-2 d-f fd-c">
													<div className="gap-1 ai-c d-f fd-r">
														{order.status === "FINISHED" ? (
															<>
																<Typography variant="body1">Выдан</Typography>
																<Check sx={{ color: "success.main" }} />
															</>
														) : order.status === "READY_FOR_PICKUP" ? (
															<>
																<Typography variant="body1">Готов к выдаче</Typography>
																<Check sx={{ color: "success.main" }} />
																<Button
																	variant="contained"
																	color="success"
																	onClick={() =>
																		setSelfPickupIssueConfirmDialogOpened(true)
																	}
																	sx={{ color: "white" }}
																>
																	Выдать
																</Button>
															</>
														) : (
															<>
																<Typography variant="body1">Готов к выдаче</Typography>
																<Close sx={{ color: "error.main" }} />
															</>
														)}
													</div>
												</div>
											</>
										) : (
											order.delivery.service === "CDEK" && (
												<Suspense fallback={<CircularProgress />}>
													<OrderCDEKSection
														order={{ id: order.id, delivery: order.delivery }}
														feedbackFn={showSnackbarMessage}
													/>
												</Suspense>
											)
										)}
									</Paper>
								)}

								{/* Initial Payment(Deposit) */}
								<Paper sx={{ p: 2 }}>
									<Typography variant="subtitle0">
										{order.initialInvoice.title ?? "Депозит"}
									</Typography>
									<div className="gap-1 mt-2 d-f fd-c">
										<Typography variant="body1">Сумма: {order.initialInvoice.amount}₽</Typography>
										<Typography variant="body1">
											Создан:{" "}
											{new Intl.DateTimeFormat("ru", {
												year: "numeric",
												month: "numeric",
												day: "numeric",
												hour: "numeric",
												minute: "numeric",
												second: "numeric",
											}).format(order.initialInvoice.createdAt)}
										</Typography>
										<div className="gap-1 ai-c d-f fd-r">
											<Typography variant="body1">Оплачено:</Typography>
											{order.initialInvoice.isPaid ? (
												<Check sx={{ color: "success.main" }} />
											) : (
												<Close sx={{ color: "error.main" }} />
											)}
										</div>
									</div>
								</Paper>
							</div>

							<div className="gap-2 d-f fd-r">
								<div className="gap-2 d-f fd-c" style={{ width: "60%" }}>
									{/* Delivery */}
									<Paper sx={{ p: 2 }}>
										{order.delivery ? (
											editableProps.delivery ? (
												<DeliveryForm
													delivery={order.delivery}
													onChange={handleUpdateDelivery}
													packages={packages}
												/>
											) : (
												<DeliveryInfo delivery={order.delivery} />
											)
										) : (
											<>
												<Typography variant="subtitle0">
													Доставка оформляется после полной оплаты заказа и его прибытия на
													склад.
												</Typography>
												<div className="gap-1 d-f fd-r">
													<Typography
														variant="subtitle1"
														sx={{ color: "typography.secondary" }}
													>
														На складе ожидается:
													</Typography>
													<Typography variant="body1">
														{order.preorder?.expectedArrival ?? "Неизвестно"}
													</Typography>
												</div>
											</>
										)}
									</Paper>

									{/* Items */}
									<Paper sx={{ p: 2 }}>
										<Typography variant="subtitle0">
											{order.items.length} {getRuGoodsWord(order.items.length)}
										</Typography>
										<Stack divider={<Divider />}>
											{order.items.map((item) => (
												<div className="gap-1 py-1 d-f fd-c" key={item.id}>
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
																	<Typography variant="subtitle0">
																		{item.title}
																	</Typography>
																	<Typography variant="body1">
																		{item.quantity} шт.
																	</Typography>
																</div>
															</div>
														</div>
														<div className="d-f fd-r fs-0">
															<Typography variant="h6">{item.sum} ₽</Typography>
														</div>
													</div>
												</div>
											))}
										</Stack>
									</Paper>
								</div>

								<div className="gap-2 d-f fd-c" style={{ width: "40%" }}>
									{/* Events */}
									<Paper sx={{ p: 2 }}>
										<div className="pb-2 ai-c d-f fd-r jc-sb">
											<Typography variant="subtitle0">События</Typography>
											<Tooltip title="Создать событие">
												<IconButton onClick={() => setEventCreateModalOpened(true)}>
													<Add />
												</IconButton>
											</Tooltip>
										</div>
										<Stack direction={"column"} spacing={2} divider={<Divider />}>
											{!orderEventList ? (
												<Typography color={"error"}>Ошибка</Typography>
											) : (
												orderEventList.items.map((event, index) => (
													<div key={index} className="gap-1 w-100 d-f fd-c">
														<div className="gap-1 w-100 ai-c d-f fd-r">
															{event.visibility === "PUBLIC" ? (
																<Tooltip title="Отображается пользователю">
																	<Visibility />
																</Tooltip>
															) : (
																<Tooltip title="Не отображается пользователю">
																	<VisibilityOff />
																</Tooltip>
															)}

															{event.type === "MESSAGE" ? (
																<Tooltip title="Сообщение">
																	<MessageOutlined />
																</Tooltip>
															) : event.type === "INTERNAL" ? (
																<Tooltip title="Внутреннее">
																	<Settings />
																</Tooltip>
															) : (
																<Tooltip title="Внешнее">
																	<RssFeed />
																</Tooltip>
															)}

															<Typography
																variant="body2"
																sx={{ color: "typography.secondary" }}
															>
																{event.initiator}
															</Typography>

															<Typography
																variant="body2"
																sx={{ color: "typography.secondary" }}
															>
																{new Intl.DateTimeFormat("ru-RU", {
																	year: "numeric",
																	month: "numeric",
																	day: "numeric",
																	hour: "numeric",
																	minute: "numeric",
																	second: "numeric",
																}).format(event.createdAt)}
															</Typography>
														</div>

														<Typography variant="body1">{event.message}</Typography>
													</div>
												))
											)}
										</Stack>
									</Paper>
								</div>
							</div>
						</div>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
