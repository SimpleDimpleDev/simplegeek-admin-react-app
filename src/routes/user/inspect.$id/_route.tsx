import { Button, Snackbar, Typography } from "@mui/material";
import { UserRole, UserState } from "@appTypes/User";
import { useGetUserQuery, useUpdateUserRoleMutation, useUpdateUserStateMutation } from "@api/admin/user";
import { useNavigate, useParams } from "react-router-dom";
import { userRoleTitles, userStateTitles } from "src/constants";

import { ChevronLeft } from "@mui/icons-material";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { RootState } from "@state/store";
import { SelectConfirm } from "@components/SelectConfirm";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSelector } from "react-redux";
import { useSnackbar } from "@hooks/useSnackbar";

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
								<>
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
								</>
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
									Создан: {new Intl.DateTimeFormat("ru-RU").format(user.createdAt)}
								</Typography>
								<Typography variant="body1">
									Обновлен: {new Intl.DateTimeFormat("ru-RU").format(user.updatedAt)}
								</Typography>
							</div>
						</>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
