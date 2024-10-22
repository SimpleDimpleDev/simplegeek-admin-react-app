import { Button, IconButton, MenuItem, Select, SelectChangeEvent, Snackbar, Typography } from "@mui/material";
import { Check, ChevronLeft, Close, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useGetUserQuery, useUpdateUserRoleMutation } from "@api/admin/user";
import { useNavigate, useParams } from "react-router-dom";

import { DateFormatter } from "@utils/format";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { RootState } from "@state/store";
import { UserRoleSchema } from "@schemas/User";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSelector } from "react-redux";
import { useSnackbar } from "@hooks/useSnackbar";
import { userRoleTitles } from "src/constants";
import { z } from "zod";

export default function UserInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const userId = params.id;
	if (!userId) throw new Response("No user id provided", { status: 404 });
	const { data: user, isLoading: userIsLoading } = useGetUserQuery({ userId });

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

	const showLoadingOverlay = updateUserRoleIsLoading;

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	const [roleEditing, setRoleEditing] = useState(false);
	const [selectedRole, setSelectedRole] = useState<z.infer<typeof UserRoleSchema> | "UNDEFINED">("UNDEFINED");

	useEffect(() => {
		if (user) {
			setSelectedRole(user.role);
		}
	}, [user]);

	useMutationFeedback({
		title: "Изменение роли",
		isSuccess: updateUserRoleIsSuccess,
		isError: updateUserRoleIsError,
		error: updateUserRoleError,
		feedbackFn: showSnackbarMessage,
	});

	const handleStartEditRole = () => {
		setRoleEditing(true);
	};

	const handleCancelEditRole = () => {
		setRoleEditing(false);
		setSelectedRole(user?.role ?? "UNDEFINED");
	};

	const handleSelectRole = (event: SelectChangeEvent) => {
		if (!roleEditing) return;
		setSelectedRole(event.target.value as z.infer<typeof UserRoleSchema>);
	};

	const handleUpdateRole = () => {
		if (!user) return;
		if (!roleEditing) return;
		if (selectedRole === "UNDEFINED") return;
		updateUserRole({ id: user.id, role: selectedRole });
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
				<LoadingSpinner isLoading={userIsLoading}>
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
								<div className="gap-05 d-f fd-c">
									<Typography variant="subtitle0">Роль</Typography>
									<div className="gap-1 ai-c d-f fd-r">
										<Select
											disabled={!roleEditing}
											value={selectedRole}
											label="Роль"
											onChange={handleSelectRole}
										>
											{Array.from(userRoleTitles.entries()).map(([role, roleTitle]) => (
												<MenuItem value={role}>{roleTitle}</MenuItem>
											))}
										</Select>

										{roleEditing ? (
											<>
												<IconButton sx={{ color: "success.main" }} onClick={handleUpdateRole}>
													<Check />
												</IconButton>
												<IconButton sx={{ color: "error.main" }} onClick={handleCancelEditRole}>
													<Close />
												</IconButton>
											</>
										) : (
											<IconButton onClick={handleStartEditRole}>
												<Edit />
											</IconButton>
										)}
									</div>
								</div>
							)}

							<div className="gap-1 ai-c d-f fd-r">
								<Button
									variant="contained"
									onClick={() => navigate(`/order/table?f=user:equals:${user.email}`)}
								>
									Заказы
								</Button>
							</div>

							<div className="section">
								<Typography variant="subtitle0">Информация</Typography>
								<Typography variant="body1">Email: {user.email}</Typography>
								<Typography variant="body1">VK ID: {user.vkId ?? "Не подключён"}</Typography>
								<Typography variant="body1">
									Создан: {DateFormatter.DDMMYYYY(user.createdAt)}
								</Typography>
								<Typography variant="body1">
									Обновлен: {DateFormatter.DDMMYYYY(user.updatedAt)}
								</Typography>
							</div>
						</>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
