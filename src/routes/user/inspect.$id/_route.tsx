import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useGetUserQuery } from "@api/admin/user";

export default function UserInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const userId = params.id;
	if (!userId) throw new Response("No user id provided", { status: 404 });
	const { data: user, isLoading: userIsLoading } = useGetUserQuery({ userId });

	return (
		<div className="pt-4">
			<Button onClick={() => navigate("/user/table")} sx={{ width: "fit-content", color: "warning.main" }}>
				<ChevronLeft />К списку всех пользователей
			</Button>
			<LoadingSpinner isLoading={userIsLoading}>
				{!user ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<>
						<div className="px-2 py-2">
							<Typography variant="h5">Пользователь {user.email} </Typography>
						</div>
						<div className="section">
							<Typography variant="h5">Информация</Typography>
							<Typography variant="body1">Email: {user.email}</Typography>
						</div>
					</>
				)}
			</LoadingSpinner>
		</div>
	);
}
