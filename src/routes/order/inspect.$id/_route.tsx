import { Add, Check, ChevronLeft, Close, Edit } from "@mui/icons-material";
import {
	Button,
	CircularProgress,
	Divider,
	IconButton,
	MenuItem,
	Modal,
	Paper,
	Select,
	SelectChangeEvent,
	Snackbar,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import {
	useCreateCDEKWaybillMutation,
	useCreateCDEKWaybillPrintMutation,
	useLazyGetCDEKTokenQuery,
	useLazyGetCDEKWaybillQuery,
} from "@api/admin/cdek";
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
import { DeliveryService } from "@appTypes/Delivery";
import { EventCreateForm } from "./EventCreateForm";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementModal from "@components/ManagementModal";
import { OrderStatus } from "@appTypes/Order";
import { getImageUrl } from "@utils/image";
import { getRuGoodsWord } from "@utils/lexical";
import { orderStatusBadges } from "@components/Badges";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

const CDEKWaybillCreateForm = lazy(() => import("./CDEKWaybillCreateForm"));

const deliveryServiceMapping: Record<DeliveryService, string> = {
	CDEK: "СДЕК",
	SELF_PICKUP: "Самовывоз",
};

export default function OrderInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const orderId = params.id;
	if (!orderId) throw new Response("No order id provided", { status: 404 });
	const { data: order, isLoading: orderIsLoading, refetch: refetchOrder } = useGetOrderQuery({ orderId });
	const { data: orderEventList, isLoading: orderEventListIsLoading } = useGetOrderEventListQuery({ orderId });
	const { data: editableProps, isLoading: editablePropsIsLoading } = useGetOrderEditablePropsQuery(
		{
			orderId,
		},
		{ refetchOnMountOrArgChange: true }
	);
	const [getCDEKWaybill, { data: CDEKWaybill, isLoading: CDEKWaybillIsLoading }] = useLazyGetCDEKWaybillQuery();
	const [getCDEKToken, { data: cdekTokenData }] = useLazyGetCDEKTokenQuery();

	useEffect(() => {
		if (!order?.delivery) return;
		const orderDelivery = order.delivery;
		if (orderDelivery.service === "CDEK") {
			getCDEKToken();
			setInterval(() => getCDEKWaybill({ deliveryId: orderDelivery.id }), 1000 * 5);
		}
	}, [order, getCDEKWaybill, getCDEKToken]);

	useEffect(() => {
		if (!CDEKWaybill) return;
		if (CDEKWaybill.status === "CREATED") {
			refetchOrder();
		}
	}, [CDEKWaybill, refetchOrder]);

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
		createCDEKWaybill,
		{
			isLoading: createCDEKWaybillIsLoading,
			isSuccess: createCDEKWaybillIsSuccess,
			isError: createCDEKWaybillIsError,
			error: createCDEKWaybillError,
		},
	] = useCreateCDEKWaybillMutation();

	const [
		createCDEKWaybillPrint,
		{
			isLoading: createCDEKWaybillPrintIsLoading,
			isSuccess: createCDEKWaybillPrintIsSuccess,
			isError: createCDEKWaybillPrintIsError,
			error: createCDEKWaybillPrintError,
		},
	] = useCreateCDEKWaybillPrintMutation();

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
	const [waybillCreateModalOpened, setWaybillCreateModalOpened] = useState(false);
	const [selfPickupIssueConfirmDialogOpened, setSelfPickupIssueConfirmDialogOpened] = useState(false);
	const [refundConfirmDialogOpened, setRefundConfirmDialogOpened] = useState(false);

	const [statusEditing, setStatusEditing] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "UNDEFINED">("UNDEFINED");

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

	const handleCreateCDEKWaybillPrint = () => {
		if (!order?.delivery) return;
		createCDEKWaybillPrint({ orderId: order.id, deliveryId: order.delivery.id });
	};

	const handleOpenWaybillPrint = () => {
		if (!CDEKWaybill) return;
		if (!CDEKWaybill.print?.url) return;
		if (!cdekTokenData?.token) return;
		fetch(CDEKWaybill.print.url, {
			method: "GET", // or 'POST', etc. depending on your API
			headers: {
				Authorization: `Bearer ${cdekTokenData.token}`, // Include any necessary headers
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok " + response.statusText);
				}
				return response.blob(); // Convert the response to a Blob
			})
			.then((blob) => {
				const blobUrl = URL.createObjectURL(blob); // Create a URL for the Blob

				window.open(blobUrl); // Open the Blob URL in a new tab
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	};

	const handleRefund = () => {
		if (!order) return;
		refundOrder({ orderId: order.id });
	};

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
		title: "Запрос на создание накладной",
		isSuccess: createCDEKWaybillIsSuccess,
		isError: createCDEKWaybillIsError,
		error: createCDEKWaybillError,
		feedbackFn: showSnackbarMessage,
		successAction: () => {
			setWaybillCreateModalOpened(false);
		},
	});

	useMutationFeedback({
		title: "Запрос на создание распечатки накладной",
		isSuccess: createCDEKWaybillPrintIsSuccess,
		isError: createCDEKWaybillPrintIsError,
		error: createCDEKWaybillPrintError,
		feedbackFn: showSnackbarMessage,
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
		createCDEKWaybillIsLoading ||
		createCDEKWaybillPrintIsLoading ||
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
			<Modal open={waybillCreateModalOpened} onClose={() => setWaybillCreateModalOpened(false)}>
				{!order ? (
					<CircularProgress />
				) : (
					<Suspense fallback={<CircularProgress />}>
						<CDEKWaybillCreateForm orderId={order?.id} onSubmit={createCDEKWaybill} />
					</Suspense>
				)}
			</Modal>
			<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
				<Button onClick={() => navigate(-1)} sx={{ width: "fit-content", color: "warning.main" }}>
					<ChevronLeft />
					Назад
				</Button>
				<LoadingSpinner
					isLoading={
						orderIsLoading || editablePropsIsLoading || CDEKWaybillIsLoading || orderEventListIsLoading
					}
				>
					{!order || !editableProps ? (
						<div className="w-100 h-100v ai-c d-f jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<div className="gap-2 d-f fd-c">
							{/* Main info */}
							<div className="gap-1 pt-2 d-f fd-c">
								<Typography variant="h5">
									Заказ от {new Intl.DateTimeFormat("ru").format(order.createdAt)}
								</Typography>
								<Typography variant="subtitle0">ID: {order.id}</Typography>

								{/* Status */}
								<div className="gap-05 d-f fd-c">
									<Typography variant="subtitle0">Статус</Typography>
									<div className="gap-2 ai-c d-f fd-r">
										<Select
											disabled={!statusEditing}
											value={selectedStatus}
											onChange={handleSelectStatus}
										>
											{editableProps.statuses.map((status) => (
												<MenuItem value={status}>{orderStatusBadges[status]}</MenuItem>
											))}
										</Select>

										{statusEditing ? (
											<>
												<IconButton sx={{ color: "success.main" }} onClick={handleSaveStatus}>
													<Check />
												</IconButton>
												<IconButton
													sx={{ color: "error.main" }}
													onClick={handleCancelEditStatus}
												>
													<Close />
												</IconButton>
											</>
										) : (
											<IconButton onClick={handleStartEditStatus}>
												<Edit />
											</IconButton>
										)}
									</div>
								</div>

								{/* Controls */}
								<div className="gap-1 ai-c d-f fd-r">
									{order.delivery && (
										<>
											{order.delivery.service === "SELF_PICKUP"
												? order.status === "READY_FOR_PICKUP" && (
														<Button
															variant="contained"
															color="success"
															onClick={() => setSelfPickupIssueConfirmDialogOpened(true)}
															sx={{ color: "white" }}
														>
															Выдать заказ
														</Button>
												  )
												: order.delivery.service === "CDEK" && (
														<Paper sx={{ p: 2 }}>
															<Typography variant="subtitle0">СДЭК</Typography>
															<div className="gap-2 d-f fd-c">
																{CDEKWaybillIsLoading ? (
																	<CircularProgress />
																) : CDEKWaybill ? (
																	<>
																		<div className="gap-1 ai-c d-f fd-r">
																			<Typography variant="body1">
																				Накладная
																			</Typography>
																			{CDEKWaybill.status === "PENDING" ? (
																				<CircularProgress />
																			) : (
																				<Check sx={{ color: "success.main" }} />
																			)}
																		</div>
																		<div className="gap-1 ai-c d-f fd-r">
																			<Typography variant="body1">
																				Распечатка
																			</Typography>
																			{CDEKWaybill.print ? (
																				CDEKWaybill.print.status ===
																				"PENDING" ? (
																					<CircularProgress />
																				) : (
																					<>
																						<Check
																							sx={{
																								color: "success.main",
																							}}
																						/>
																						<Button
																							variant="contained"
																							onClick={
																								handleOpenWaybillPrint
																							}
																						>
																							Открыть
																						</Button>
																					</>
																				)
																			) : (
																				<>
																					<Close
																						sx={{ color: "error.main" }}
																					/>
																					<Button
																						variant="contained"
																						onClick={
																							handleCreateCDEKWaybillPrint
																						}
																					>
																						Сформировать
																					</Button>
																				</>
																			)}
																		</div>
																	</>
																) : (
																	<div className="gap-1 ai-c d-f fd-r">
																		<Typography variant="body1">
																			Накладная
																		</Typography>
																		<Close sx={{ color: "error.main" }} />
																		<Button
																			variant="contained"
																			onClick={() =>
																				setWaybillCreateModalOpened(true)
																			}
																		>
																			Сформировать
																		</Button>
																	</div>
																)}
															</div>
														</Paper>
												  )}
										</>
									)}
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
									<div className="gap-1 d-f fd-c">
										<Typography variant="subtitle0">Пользователь</Typography>
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
								</Paper>

								{/* Initial Payment(Deposit) */}
								<Paper sx={{ p: 2 }}>
									<Typography variant="subtitle0">Депозит</Typography>
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
										{order.initialInvoice.isPaid ? <Check /> : <Close />}
									</div>
								</Paper>
							</div>

							<div className="gap-2 d-f fd-r">
								<div className="gap-2 d-f fd-c" style={{ width: "50%" }}>
									{/* Delivery */}
									<Paper sx={{ p: 2 }}>
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
														<Typography variant={"h6"}>Доставка</Typography>
														<div className={`d-f fd-r jc-sb`}>
															<div className="gap-05 w-100 d-f fd-c">
																<Typography
																	variant="body1"
																	sx={{ color: "typography.secondary" }}
																>
																	Способ получения
																</Typography>
																<Typography variant="body1">
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
															<Typography
																variant="body1"
																sx={{ color: "typography.secondary" }}
															>
																Адрес
															</Typography>
															<Typography variant="body1">
																{order.delivery.point?.address}
															</Typography>
														</div>
													</div>
													<div className="gap-2 d-f fd-c">
														<Typography variant="subtitle0">Получатель</Typography>
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
								<div className="gap-2 d-f fd-c" style={{ width: "50%" }}>
									<Paper sx={{ p: 2 }}>
										<div className="ai-c d-f fd-r jc-sb">
											<Typography variant="subtitle0">События</Typography>
											<Tooltip title="Создать событие">
												<IconButton onClick={() => setEventCreateModalOpened(true)}>
													<Add />
												</IconButton>
											</Tooltip>
										</div>
										<div className="gap-1 h-100 d-f fd-c">
											{!orderEventList ? (
												<Typography color={"error"}>Ошибка</Typography>
											) : (
												orderEventList.items.map((event) => <div>{JSON.stringify(event)}</div>)
											)}
										</div>
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
