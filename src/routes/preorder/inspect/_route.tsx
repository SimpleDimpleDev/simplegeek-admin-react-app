import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";

export default function PreorderInspectRoute() {
	const navigate = useNavigate();
    const params = useParams();
    const preorderId = params.id;
	if (!preorderId) throw new Response("No preorder id provided", { status: 404 });

	return (
		<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
			<Button onClick={() => navigate(-1)} sx={{ color: "warning.main", width: "fit-content" }}>
				<ChevronLeft />
				Назад
			</Button>
			<Typography variant="h4">В разработке</Typography>
		</div>
	);
}
