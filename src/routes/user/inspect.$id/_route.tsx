import { Button, Divider, IconButton, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, OpenInNew } from "@mui/icons-material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { UserRole, UserState } from "@appTypes/User";
import { deliveryServiceTitles, orderStatusTitles, userRoleTitles, userStateTitles } from "src/constants";
import {
	useGetUserQuery,
	useGetUserSavedDeliveryQuery,
	useUpdateUserRoleMutation,
	useUpdateUserStateMutation,
} from "@api/admin/user";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementTable from "@components/ManagementTable";
import { OrderGet } from "@appTypes/Order";
import { RootState } from "@state/store";
import { SelectConfirm } from "@components/SelectConfirm";
import { orderStatusBadges } from "@components/Badges";
import { useGetOrderListQuery } from "@api/admin/order";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSelector } from "react-redux";
import { useSnackbar } from "@hooks/useSnackbar";

const orderTableColumns: GridColDef<OrderGet>[] = [
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

export default function UserInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const userId = params.id;
	if (!userId) throw new Response("No user id provided", { status: 404 });
	const { data: user, isLoading: userIsLoading } = useGetUserQuery({ userId });
	const { data: userSavedDelivery, isLoading: userSavedDeliveryIsLoading } = useGetUserSavedDeliveryQuery({ userId });
	const {
		data: userOrderList,
		isLoading: userOrderListIsLoading,
		isFetching: userOrderListIsFetching,
	} = useGetOrderListQuery({ userId });

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedOrder = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return userOrderList?.items.find((order) => order.id === selectedItemId) || null;
	}, [selectedItemIds, userOrderList]);

	const currentUser = useSelector((state: RootState) => state.user);

	const [
		updateUserRole,
		{
			isLoading: updateUserRoleIsLoading,
			isSuccess: updateUserRoleIsSuccess,
			isError: updateUserRoleIsError,
			error: updateUserRoleError,
		},
	] = useUpdateUserRoleMutation();

	const [
		updateUserState,
		{
			isLoading: updateUserStateIsLoading,
			isSuccess: updateUserStateIsSuccess,
			isError: updateUserStateIsError,
			error: updateUserStateError,
		},
	] = useUpdateUserStateMutation();

	const showLoadingOverlay = updateUserRoleIsLoading || updateUserStateIsLoading;

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	useMutationFeedback({
		title: "Изменение роли",
		isSuccess: updateUserRoleIsSuccess,
		isError: updateUserRoleIsError,
		error: updateUserRoleError,
		feedbackFn: showSnackbarMessage,
	});

	useMutationFeedback({
		title: "Изменение статуса",
		isSuccess: updateUserStateIsSuccess,
		isError: updateUserStateIsError,
		error: updateUserStateError,
		feedbackFn: showSnackbarMessage,
	});

	const handleUpdateRole = (role: UserRole) => {
		if (!user) return;
		updateUserRole({ id: user.id, role });
	};

	const handleUpdateState = (state: UserState) => {
		if (!user) return;
		updateUserState({ id: user.id, state });
	};

	return (
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={2000} onClose={closeSnackbar} message={snackbarMessage} />
			<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
				<Button onClick={() => navigate(-1)} sx={{ width: "fit-content", color: "warning.main" }}>
					<ChevronLeft />
					Назад
				</Button>
				<LoadingSpinner isLoading={userIsLoading || userSavedDeliveryIsLoading}>
					{!user ? (
						<div className="w-100 h-100v ai-c d-f jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<>
							<div className="pt-2">
								<Typography variant="h5">Пользователь {user.email} </Typography>
							</div>
							{currentUser.identity?.id === user.id ? (
								<Typography variant="subtitle0">Вы - {userRoleTitles.get(user.role)}</Typography>
							) : (
								<div className="gap-2 d-f fd-r">
									<div className="gap-05 d-f fd-c">
										<Typography variant="subtitle0">Роль</Typography>
										<SelectConfirm
											options={userRoleTitles}
											defaultOption={user.role}
											onConfirm={(role) => handleUpdateRole(role)}
										/>
									</div>
									<div className="gap-05 d-f fd-c">
										<Typography variant="subtitle0">Статус</Typography>
										<SelectConfirm
											options={userStateTitles}
											defaultOption={user.state}
											onConfirm={(role) => handleUpdateState(role)}
										/>
									</div>
								</div>
							)}

							<div className="section">
								<Typography variant="subtitle0">Информация</Typography>
								<Typography variant="body1">Email: {user.email}</Typography>
								<div className="gap-1 d-f fd-r">
									<Typography variant="body1">VK ID: {user.vkId ?? "Не подключён"}</Typography>
									{user.vkId && (
										<Tooltip title="Открыть в VK">
											<IconButton
												onClick={() => window.open(`https://vk.com/id${user.vkId}`, "_blank")}
											>
												<OpenInNew />
											</IconButton>
										</Tooltip>
									)}
								</div>
								<Typography variant="body1">
									Создан: {new Intl.DateTimeFormat("ru-RU").format(user.createdAt)}
								</Typography>
								<Typography variant="body1">
									Обновлен: {new Intl.DateTimeFormat("ru-RU").format(user.updatedAt)}
								</Typography>
							</div>
							{userSavedDelivery && (
								<div className="section">
									<Stack
										gap={1}
										direction={"column"}
										divider={<Divider orientation="horizontal" flexItem />}
									>
										<div className="gap-2 d-f fd-c">
											<div className="d-f fd-r jc-sb">
												<Typography variant={"h5"}>Доставка</Typography>
											</div>

											<div className={`d-f fd-r jc-sb"}`}>
												<div className="gap-05 w-100 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														Способ получения
													</Typography>
													<Typography variant="subtitle0">
														{deliveryServiceTitles.get(userSavedDelivery.service)}
													</Typography>
												</div>
												<div className="gap-05 w-100 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														Пункт выдачи
													</Typography>
													<Typography variant="body1">
														{userSavedDelivery.point?.code}
													</Typography>
												</div>
											</div>
											<div className="gap-05 d-f fd-c">
												<Typography variant="body1" sx={{ color: "typography.secondary" }}>
													Адрес
												</Typography>
												<Typography variant="body1">
													{userSavedDelivery.point?.address}
												</Typography>
											</div>
										</div>
										<div className="gap-2 d-f fd-c">
											<Typography variant="h5">Получатель</Typography>
											<div className={`d-f fd-r jc-sb"}`}>
												<div className="gap-05 w-100 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														ФИО
													</Typography>
													<Typography variant="subtitle0">
														{userSavedDelivery.recipient.fullName}
													</Typography>
												</div>
												<div className="gap-05 w-100 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														Номер телефона
													</Typography>
													<Typography variant="body1">
														{userSavedDelivery.recipient.phone}
													</Typography>
												</div>
											</div>
										</div>
									</Stack>
								</div>
							)}

							<LoadingSpinner isLoading={userOrderListIsLoading || userOrderListIsFetching}>
								{!userOrderList ? (
									<div className="w-100 h-100v ai-c d-f jc-c">
										<Typography variant="h5">
											Не удалось загрузить список заказов пользователя
										</Typography>
									</div>
								) : (
									<ManagementTable
										columns={orderTableColumns}
										data={userOrderList.items}
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
											</>
										}
									/>
								)}
							</LoadingSpinner>
						</>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
