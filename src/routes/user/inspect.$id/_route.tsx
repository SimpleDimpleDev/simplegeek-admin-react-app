import { Button, Typography } from "@mui/material";

import { ChevronLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function UserInspect() {
	const navigate = useNavigate();

	return (
		<div className="pt-4">
			<Button onClick={() => navigate("/user/table")} sx={{ width: "fit-content", color: "warning.main" }}>
				<ChevronLeft />К списку всех пользователей
			</Button>
			<div className="py-2 px-2">
				<Typography variant="h5">Пользователь </Typography>
			</div>
		</div>
	);
}
